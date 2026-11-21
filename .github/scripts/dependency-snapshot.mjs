import { readFileSync } from 'node:fs'
import process from 'node:process'

const sbom = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const packagesByRef = new Map(sbom.components.map(component => [component['bom-ref'], component.purl]))
const edgesByRef = new Map(sbom.dependencies.map(entry => [entry.ref, entry.dependsOn ?? []]))
const directRefs = new Set(edgesByRef.get(sbom.metadata.component['bom-ref']) ?? [])
const resolved = new Map()

if (directRefs.size === 0 || sbom.components.some(component => !component.purl)) {
  throw new Error('The pnpm SBOM is missing dependency relationships or package URLs')
}

// Peer variants of the same package version can share one package URL.
for (const component of sbom.components) {
  const ref = component['bom-ref']
  const purl = component.purl
  const previous = resolved.get(purl)
  const children = (edgesByRef.get(ref) ?? []).map(child => packagesByRef.get(child))
  const developmentOnly = component.properties?.some(
    property => property.name === 'cdx:npm:package:development' && property.value === 'true',
  )
  resolved.set(purl, {
    package_url: purl,
    relationship: directRefs.has(ref) || previous?.relationship === 'direct' ? 'direct' : 'indirect',
    scope: !developmentOnly || previous?.scope === 'runtime' ? 'runtime' : 'development',
    dependencies: [...new Set([...(previous?.dependencies ?? []), ...children])]
      .filter(child => child && child !== purl),
  })
}

const { GITHUB_SHA, GITHUB_REF, GITHUB_RUN_ID } = process.env
const filename = 'pnpm-lock.yaml'
const directCount = [...resolved.values()].filter(dependency => dependency.relationship === 'direct').length
console.error(`Submitting ${directCount} direct and ${resolved.size - directCount} indirect dependencies`)
console.log(JSON.stringify({
  version: 0,
  sha: GITHUB_SHA,
  ref: GITHUB_REF,
  job: { id: GITHUB_RUN_ID, correlator: 'pnpm-lockfile' },
  detector: { name: 'pnpm sbom', version: sbom.metadata.tools.components[0].version, url: 'https://pnpm.io/cli/sbom' },
  scanned: new Date().toISOString(),
  manifests: {
    [filename]: {
      name: filename,
      file: { source_location: filename },
      resolved: Object.fromEntries(resolved),
    },
  },
}))
