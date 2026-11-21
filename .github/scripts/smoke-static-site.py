import re
import sys
from functools import partial
from html.parser import HTMLParser
from http.client import HTTPConnection
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from xml.etree import ElementTree


class StaticSiteHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        requested = Path(super().translate_path(path))
        # Nitro can emit posts.html alongside a posts/ directory for nested routes.
        flat_page = Path(f"{requested}.html")
        if not requested.is_file() and not (requested / "index.html").is_file() and flat_page.is_file():
            return str(flat_page)
        return str(requested)

    def list_directory(self, path):
        self.send_error(404)


class Page(HTMLParser):
    def __init__(self, body):
        super().__init__()
        self.headings = {"h1": [], "h2": []}
        self.articles = {}
        self.tag = None
        self.href = None
        self.chunks = []
        self.feed(body.decode("utf-8"))
        self.close()

    def handle_starttag(self, tag, attrs):
        if tag in self.headings:
            self.tag = tag
        elif tag == "a":
            href = dict(attrs).get("href") or ""
            if re.fullmatch(r"/posts/\d{4}/[^/?#]+/?", href):
                self.tag = tag
                self.href = href

    def handle_data(self, data):
        if self.tag:
            self.chunks.append(data)

    def handle_endtag(self, tag):
        if tag != self.tag:
            return
        label = " ".join("".join(self.chunks).split())
        if tag == "a":
            if label:
                self.articles.setdefault(self.href, label)
        else:
            self.headings[tag].append(label)
        self.tag = None
        self.chunks.clear()


def fetch(port, path, content_types):
    connection = HTTPConnection("127.0.0.1", port, timeout=5)
    try:
        connection.request("GET", path)
        response = connection.getresponse()
        if response.status != 200:
            raise ValueError(f"{path}: expected HTTP 200, got {response.status}")
        content_type = response.headers.get_content_type()
        if content_type not in content_types:
            raise ValueError(f"{path}: unexpected Content-Type {content_type}")
        return response.read()
    finally:
        connection.close()


def check_site(port):
    html = ("text/html",)
    home = Page(fetch(port, "/", html))
    if "首页" not in home.headings["h1"] or "最新文章" not in home.headings["h2"]:
        raise ValueError("/: missing the homepage title or latest posts heading")
    if not home.articles:
        raise ValueError("/: missing links to published articles")
    print("PASS / (HTTP 200, homepage and latest posts)")

    posts = Page(fetch(port, "/posts", html))
    if "文章" not in posts.headings["h1"] or not posts.articles:
        raise ValueError("/posts: missing the article archive title or article links")
    print("PASS /posts (HTTP 200, archive and article links)")

    article_path, title = next(iter(posts.articles.items()))
    article = Page(fetch(port, article_path, html))
    if title not in article.headings["h1"]:
        raise ValueError(f"{article_path}: missing the article heading {title!r}")
    print(f"PASS {article_path} (HTTP 200, heading matches the archive)")

    atom = "{http://www.w3.org/2005/Atom}"
    try:
        feed = ElementTree.fromstring(
            fetch(port, "/atom.xml", ("application/atom+xml", "application/xml", "text/xml"))
        )
    except ElementTree.ParseError as error:
        raise ValueError(f"/atom.xml: invalid XML ({error})") from error
    self_link = feed.find(f"{atom}link[@rel='self']")
    if (
        feed.tag != f"{atom}feed"
        or self_link is None
        or self_link.get("href") != "https://hadb.me/atom.xml"
        or feed.find(f"{atom}entry/{atom}title") is None
    ):
        raise ValueError("/atom.xml: expected an Atom feed with its canonical URL and an article")
    print("PASS /atom.xml (HTTP 200, valid Atom feed with an entry)")


def main(output_dir):
    handler = partial(StaticSiteHandler, directory=output_dir)
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        thread = Thread(target=server.serve_forever)
        thread.start()
        try:
            check_site(server.server_port)
        finally:
            server.shutdown()
            thread.join()


if __name__ == "__main__":
    try:
        main(sys.argv[1])
    except (OSError, ValueError) as error:
        sys.exit(f"Static site smoke check failed: {error}")
