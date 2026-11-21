import * as Sentry from '@sentry/nuxt'

const sensitiveFields = ['forwarded', '-ip', 'remote-', 'via', '-user']

Sentry.init({
  dsn: 'https://6678a41aefaba7d057807ff160f7ead6@o4507764207386624.ingest.us.sentry.io/4507763712196608',
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: { deny: sensitiveFields },
      response: { deny: sensitiveFields },
    },
    httpBodies: [],
    urlQueryParams: { deny: sensitiveFields },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    graphQL: { document: false, variables: false },
  },
})
