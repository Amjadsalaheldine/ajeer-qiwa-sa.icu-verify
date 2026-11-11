
from playwright.sync_api import sync_playwright
from pathlib import Path
from urllib.parse import urlparse
import hashlib

# Use a website you own or have permission to archive
URL = "https://ajeer-qiwa-sa.icu/verify/JU1CJOSWTY2N?i=2"

ROOT = Path("website")
ROOT.mkdir(exist_ok=True)

for folder in ["css", "js", "images", "fonts"]:
    (ROOT / folder).mkdir(exist_ok=True)

saved = {}

def save_resource(response):
    url = response.url
    parsed = urlparse(url)

    # Only archive resources from the same host
    if parsed.netloc != urlparse(URL).netloc:
        return

    content_type = response.headers.get(
        "content-type", ""
    ).lower()

    if "text/css" in content_type:
        folder, ext = "css", ".css"
    elif "javascript" in content_type:
        folder, ext = "js", ".js"
    elif content_type.startswith("image/"):
        folder = "images"
        ext = "." + content_type.split("/")[-1].split(";")[0]
        if ext == ".svg+xml":
            ext = ".svg"
        if ext == ".jpeg":
            ext = ".jpg"
    elif "font" in content_type or "woff" in content_type:
        folder = "fonts"
        ext = ".woff2" if "woff2" in content_type else ".woff"
    else:
        return

    filename = hashlib.sha256(
        url.encode()
    ).hexdigest()[:16] + ext

    try:
        content = response.body()
        (ROOT / folder / filename).write_bytes(content)
        saved[url] = f"{folder}/{filename}"
        print("Saved:", folder, filename)
    except Exception as e:
        print("Skipped:", url, e)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.on("response", save_resource)

    page.goto(URL, wait_until="networkidle")

    html = page.content()

    # Replace downloaded asset URLs with local paths
    for remote_url, local_path in saved.items():
        html = html.replace(remote_url, local_path)

    (ROOT / "index.html").write_text(
        html, encoding="utf-8"
    )

    browser.close()

print("Archive saved in:", ROOT.resolve())
