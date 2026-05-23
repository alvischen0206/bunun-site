from __future__ import annotations

import html
import json
import re
import shutil
from pathlib import Path


SITE = Path(__file__).resolve().parents[2]
TAIWAN_SRC = Path(r"C:\Users\bigpa\Documents\New project 5\AI_Taiwan_Travel")
JAPAN_SRC = Path(r"C:\Users\bigpa\Documents\New project 6\AI_JJAPAN_Travel")

MOJIBAKE_HINTS = ("�", "", "嚗", "銝", "撠", "蝝", "摨", "憟", "隞", "餈", "摰")


def read_post(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    fm_match = re.match(r"---\n(.*?)\n---\n", text, flags=re.S)
    frontmatter = fm_match.group(1) if fm_match else ""
    body = text[fm_match.end() :] if fm_match else text
    data: dict[str, str | list[str]] = {}
    current_list = None
    for line in frontmatter.splitlines():
        if line.startswith("  - ") and current_list:
            data.setdefault(current_list, []).append(line[4:].strip())
            continue
        current_list = None
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value:
            data[key] = value
        else:
            data[key] = []
            current_list = key

    blog = extract_blog(body)
    slug = str(data.get("slug") or path.stem)
    data.update(
        {
            "slug": slug,
            "source_file": str(path),
            "blog": blog,
            "excerpt": make_excerpt(blog),
        }
    )
    return data


def looks_unreadable(post: dict) -> bool:
    sample = f"{post.get('title', '')}\n{post.get('spot', '')}\n{post.get('blog', '')[:500]}"
    if not str(post.get("blog") or "").strip():
        return True
    return sum(sample.count(token) for token in MOJIBAKE_HINTS) >= 8


def list_readable_posts(src: Path) -> tuple[list[dict], list[dict]]:
    readable = []
    skipped = []
    for path in sorted((src / "posts").glob("*.md")):
        post = read_post(path)
        if looks_unreadable(post):
            skipped.append(post)
        else:
            readable.append(post)
    return readable, skipped


def extract_blog(body: str) -> str:
    match = re.search(r"^## Blog\s*文章\s*\n(.*?)(?=^##\s|\Z)", body, flags=re.S | re.M)
    if not match:
        return ""
    return match.group(1).strip()


def make_excerpt(text: str, limit: int = 78) -> str:
    cleaned = re.sub(r"\s+", " ", text).strip()
    return cleaned[:limit] + ("..." if len(cleaned) > limit else "")


def clean_title(title: str) -> str:
    return title.strip().replace('"', "&quot;")


def esc(value: object) -> str:
    return html.escape(str(value or ""), quote=True)


def paragraph_html(text: str) -> str:
    chunks = [chunk.strip() for chunk in re.split(r"\n\s*\n", text.strip()) if chunk.strip()]
    return "\n".join(f"          <p>{esc(chunk)}</p>" for chunk in chunks)


def source_image_paths(post: dict, src_root: Path) -> list[Path]:
    entries: list[str] = []
    image = post.get("image")
    if isinstance(image, str):
        entries.append(image)
    files = post.get("image_files")
    if isinstance(files, list):
        entries.extend(files[:4])
    paths: list[Path] = []
    seen = set()
    for entry in entries:
        relative = entry.replace("../", "")
        path = (src_root / relative).resolve()
        if path.exists() and path not in seen:
            paths.append(path)
            seen.add(path)
    return paths


def export_image(src: Path, dest: Path) -> None:
    try:
        from PIL import Image, ImageOps

        with Image.open(src) as image:
            image = ImageOps.exif_transpose(image)
            if image.mode not in ("RGB", "L"):
                image = image.convert("RGB")
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            image.save(dest, "WEBP", quality=84, method=6)
    except Exception:
        fallback = dest.with_suffix(src.suffix.lower())
        shutil.copy2(src, fallback)


def is_collage_pair(cover: Path, single: Path) -> bool:
    try:
        from PIL import Image

        with Image.open(cover) as cover_image, Image.open(single) as single_image:
            cw, ch = cover_image.size
            sw, sh = single_image.size
        return abs(cw - sw * 2) <= 4 and abs(ch - sh * 2) <= 4
    except Exception:
        return False


def copy_images(posts: list[dict], src_root: Path, target_root: Path) -> None:
    for post in posts:
        asset_dir = target_root / "assets" / str(post["slug"])
        asset_dir.mkdir(parents=True, exist_ok=True)
        copied = []
        for index, path in enumerate(source_image_paths(post, src_root)):
            dest_name = "cover.webp" if index == 0 else f"photo-{index:02d}.webp"
            dest = asset_dir / dest_name
            export_image(path, dest)
            copied.append(f"assets/{post['slug']}/{dest_name}")
        cover_file = asset_dir / "cover.webp"
        first_photo = asset_dir / "photo-01.webp"
        if cover_file.exists() and first_photo.exists() and is_collage_pair(cover_file, first_photo):
            shutil.copy2(first_photo, cover_file)
        post["local_images"] = copied
        post["cover"] = copied[0] if copied else ""


def web_path(base_path: str, path: object) -> str:
    value = str(path or "").lstrip("./")
    return f"{base_path}/{value}" if value else ""


def nav(brand: str, base_path: str) -> str:
    return f"""
    <header class="travel-header">
      <a class="travel-brand" href="{esc(base_path)}/"><span></span>{esc(brand)}</a>
      <nav aria-label="travel navigation">
        <a href="/">Bunun Studio</a>
      </nav>
    </header>"""


def render_index(
    kind: str,
    brand: str,
    title: str,
    subtitle: str,
    persona_note: str,
    posts: list[dict],
    base_path: str,
) -> str:
    featured = posts[-1]
    cards = "\n".join(render_card(post, base_path) for post in posts)
    mosaic = "\n".join(
        f'<img src="{esc(web_path(base_path, post.get("cover")))}" alt="{esc(post.get("spot"))}">' for post in posts[:4]
    )
    return f"""<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{esc(title)} | Bunun Travel</title>
    <meta name="description" content="{esc(subtitle)}">
    <link rel="stylesheet" href="{esc(base_path)}/travel.css">
  </head>
  <body class="travel-{esc(kind)}">
{nav(brand, base_path)}
    <main>
      <section class="travel-hero">
        <div class="hero-copy">
          <h1>{esc(title)}</h1>
          <p>{esc(subtitle)}</p>
          <p class="persona-note">{esc(persona_note)}</p>
          <div class="hero-actions">
            <a class="travel-button primary" href="#posts">閱讀這個 Blog</a>
          </div>
        </div>
        <div class="hero-carousel" aria-label="旅遊照片精選">
          {mosaic}
        </div>
      </section>

      <section id="posts" class="post-grid" aria-label="Blog articles">
        {cards}
      </section>
    </main>
  </body>
</html>
"""


def render_card(post: dict, base_path: str) -> str:
    return f"""
        <article class="post-card">
          <a href="{esc(base_path)}/{esc(post["slug"])}.html">
            <img src="{esc(web_path(base_path, post.get("cover")))}" alt="{esc(post.get("spot"))}">
          </a>
          <div class="post-card-body">
          <p class="date-line">{esc(post.get("area"))} / {esc(post.get("spot"))}</p>
            <h2><a href="{esc(base_path)}/{esc(post["slug"])}.html">{esc(post.get("title"))}</a></h2>
            <p>{esc(post.get("excerpt"))}</p>
          </div>
        </article>"""


def render_article(kind: str, brand: str, collection_title: str, post: dict, base_path: str) -> str:
    gallery = "\n".join(
        f'<img src="{esc(web_path(base_path, path))}" alt="{esc(post.get("spot"))} travel photo">'
        for path in post.get("local_images", [])[1:5]
    )
    return f"""<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{esc(post.get("title"))} | Bunun Travel</title>
    <meta name="description" content="{esc(post.get("excerpt"))}">
    <link rel="stylesheet" href="{esc(base_path)}/travel.css">
  </head>
  <body class="travel-{esc(kind)}">
{nav(brand, base_path)}
    <main class="article-main">
      <a class="back-link" href="{esc(base_path)}/">回到{esc(collection_title)}</a>
      <article class="travel-article">
        <header class="article-hero">
          <div>
            <p class="date-line">{esc(post.get("area"))} / {esc(post.get("spot"))}</p>
            <h1>{esc(post.get("title"))}</h1>
            <p class="article-lead">{esc(post.get("excerpt"))}</p>
          </div>
          <img src="{esc(web_path(base_path, post.get("cover")))}" alt="{esc(post.get("spot"))}">
        </header>
        <div class="gallery-strip">
          {gallery}
        </div>
        <section class="article-content">
{paragraph_html(str(post.get("blog") or ""))}
        </section>
      </article>
    </main>
  </body>
</html>
"""


CSS = r""":root {
  color-scheme: light;
  --paper: #fffdfb;
  --shell: #ffffff;
  --ink: #2d2430;
  --muted: #806f7d;
  --line: rgba(206, 154, 162, 0.26);
  --coral: #ef8f8d;
  --rose: #f7c7d4;
  --mint: #b7dfd2;
  --sky: #a9cfe8;
  --gold: #d8a94f;
  --shadow: 0 24px 70px rgba(142, 88, 92, 0.18);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background:
    linear-gradient(120deg, rgba(247, 199, 212, 0.24), transparent 32rem),
    linear-gradient(240deg, rgba(183, 223, 210, 0.22), transparent 30rem),
    var(--paper);
  color: var(--ink);
  font-family: "Microsoft JhengHei", "PingFang TC", "Noto Sans TC", Arial, sans-serif;
  line-height: 1.8;
}
a { color: inherit; }
img { display: block; max-width: 100%; height: auto; }

.travel-header {
  position: sticky;
  top: 0;
  z-index: 10;
  min-height: 68px;
  padding: 0 clamp(18px, 4vw, 48px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 253, 251, 0.88);
  backdrop-filter: blur(18px);
}
.travel-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  text-decoration: none;
}
.travel-brand span {
  width: 15px;
  height: 15px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--coral), var(--mint));
}
.travel-header nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}
.travel-header nav a {
  padding: 7px 11px;
  border-radius: 999px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
}
.travel-header nav a:hover,
.travel-header nav a.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 8px 22px rgba(214, 148, 158, 0.18);
}

main {
  width: min(1160px, calc(100% - 36px));
  margin: 0 auto;
}
.travel-hero {
  min-height: auto;
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(320px, 1fr);
  align-items: center;
  gap: clamp(28px, 5vw, 70px);
  padding: 90px 0 44px;
}
.hero-copy h1,
.article-hero h1 {
  margin: 0;
  max-width: 760px;
  font-size: clamp(44px, 7vw, 86px);
  line-height: 1.04;
  letter-spacing: 0;
}
.hero-copy p {
  max-width: 610px;
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 18px;
}
.hero-copy .persona-note {
  display: inline-flex;
  width: fit-content;
  margin-top: 18px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
  color: #8f5962;
  font-size: 14px;
  font-weight: 900;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}
.travel-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-weight: 900;
  text-decoration: none;
}
.travel-button.primary {
  border-color: transparent;
  background: linear-gradient(135deg, var(--coral), #f4b37a);
  color: #fff;
  box-shadow: 0 14px 30px rgba(239, 143, 141, 0.28);
}
.travel-button.ghost { background: rgba(255, 255, 255, 0.68); }

.hero-carousel {
  position: relative;
  width: min(100%, 520px);
  aspect-ratio: 4 / 5;
  margin-left: auto;
  overflow: hidden;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow);
}
.hero-carousel img,
.post-card img,
.article-hero img,
.gallery-strip img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center top;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 8px;
}
.hero-carousel img {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  opacity: 0;
  animation: heroFade 18s infinite;
}
.hero-carousel img:nth-child(1) { animation-delay: 0s; }
.hero-carousel img:nth-child(2) { animation-delay: 4.5s; }
.hero-carousel img:nth-child(3) { animation-delay: 9s; }
.hero-carousel img:nth-child(4) { animation-delay: 13.5s; }
@keyframes heroFade {
  0%, 22% { opacity: 1; }
  28%, 100% { opacity: 0; }
}
.travel-japan .hero-carousel {
  width: min(100%, 560px);
  aspect-ratio: 3 / 2;
}
.travel-japan .article-hero img {
  aspect-ratio: 3 / 2;
}

.post-card h2 {
  margin: 8px 0 0;
  line-height: 1.2;
}
.post-card p:not(.date-line) {
  color: var(--muted);
}
.date-line {
  margin: 0;
  color: #b47378;
  font-size: 13px;
  font-weight: 900;
}
.text-link {
  color: #b45f65;
  font-weight: 900;
  text-decoration: none;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  padding: 24px 0 82px;
}
.post-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
}
.post-card > a {
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
}
.post-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}
.post-card-body { padding: 18px; }
.post-card h2 { font-size: 19px; }
.post-card h2 a { text-decoration: none; }

.article-main {
  width: min(1160px, calc(100% - 36px));
  padding: 30px 0 96px;
}
.back-link {
  display: inline-flex;
  margin-bottom: 26px;
  color: #a95f65;
  font-weight: 900;
  text-decoration: none;
}
.travel-article {
  position: relative;
}
.travel-article::before {
  content: "";
  position: absolute;
  inset: 4rem auto auto -3rem;
  width: 12rem;
  height: 12rem;
  border-radius: 999px;
  background: rgba(247, 199, 212, 0.22);
  filter: blur(24px);
  pointer-events: none;
}
.article-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(360px, 1fr);
  align-items: center;
  gap: clamp(24px, 5vw, 60px);
  min-height: 590px;
}
.article-hero h1 { font-size: clamp(38px, 5vw, 68px); }
.article-hero img {
  aspect-ratio: 5 / 4;
  box-shadow: var(--shadow);
}
.article-lead {
  max-width: 600px;
  margin: 20px 0 0;
  color: var(--muted);
  font-size: 18px;
}
.gallery-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: -8px 0 40px;
}
.gallery-strip img {
  aspect-ratio: 4 / 3;
  box-shadow: 0 12px 30px rgba(142, 88, 92, 0.12);
}
.gallery-strip img:nth-child(n + 4) { display: none; }
.article-content {
  max-width: 820px;
  margin: 0 auto;
  padding: 34px 44px 12px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.54);
  color: #493d48;
  font-size: 18px;
}
.article-content p {
  margin: 0 0 1.2em;
}
.article-content p:first-child::first-letter {
  float: left;
  padding: 0.04em 0.12em 0 0;
  color: #c76f76;
  font-size: 4.1em;
  line-height: 0.86;
  font-weight: 900;
}

@media (max-width: 820px) {
  .travel-header {
    position: static;
    align-items: flex-start;
    flex-direction: column;
    padding-top: 14px;
    padding-bottom: 14px;
  }
  .travel-header nav { justify-content: flex-start; }
  .travel-hero,
  .article-hero {
    grid-template-columns: 1fr;
  }
  .travel-hero {
    min-height: auto;
    padding-top: 42px;
  }
  .hero-carousel { margin: 0 auto; }
  .post-grid { grid-template-columns: 1fr; }
  .gallery-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .article-hero { min-height: auto; }
  .article-hero img { aspect-ratio: 4 / 5; }
  .article-content { padding: 24px 0 4px; background: transparent; }
}

@media (min-width: 821px) and (max-width: 1100px) {
  .post-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
"""


def write_collection(
    src: Path,
    posts: list[dict],
    target_name: str,
    kind: str,
    brand: str,
    title: str,
    subtitle: str,
    persona_note: str,
    base_path: str,
) -> list[dict]:
    target = SITE / target_name
    if target.exists() and target.resolve().parent == SITE.resolve():
        shutil.rmtree(target)
    target.mkdir(parents=True, exist_ok=True)
    copy_images(posts, src, target)
    (target / "travel.css").write_text(CSS, encoding="utf-8")
    (target / "index.html").write_text(
        render_index(kind, brand, title, subtitle, persona_note, posts, base_path),
        encoding="utf-8",
    )
    for post in posts:
        (target / f"{post['slug']}.html").write_text(
            render_article(kind, brand, title, post, base_path), encoding="utf-8"
        )
    return posts


def mirror_public_collection(target_name: str) -> None:
    source = SITE / target_name
    target = SITE / "public" / target_name
    public_root = (SITE / "public").resolve()
    if target.exists() and target.resolve().parent == public_root:
        shutil.rmtree(target)
    shutil.copytree(source, target)


def update_vercel() -> None:
    path = SITE / "vercel.json"
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    rewrites = data.setdefault("rewrites", [])
    additions = [
        {"source": "/Taiwan_travel", "destination": "/Taiwan_travel/index.html"},
        {"source": "/Taiwan_travel/", "destination": "/Taiwan_travel/index.html"},
        {"source": "/Taiwan_travel/(.*)", "destination": "/Taiwan_travel/$1"},
        {"source": "/japan_travel", "destination": "/Japan_travel/index.html"},
        {"source": "/japan_travel/", "destination": "/Japan_travel/index.html"},
        {"source": "/japan_travel/(.*)", "destination": "/Japan_travel/$1"},
    ]
    existing = {(item.get("source"), item.get("destination")) for item in rewrites}
    for item in additions:
        if (item["source"], item["destination"]) not in existing:
            rewrites.append(item)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_log(tw_posts: list[dict], jp_posts: list[dict], tw_skipped: list[dict], jp_skipped: list[dict]) -> None:
    log_dir = SITE / "docs" / "travel-blog-sync"
    log_dir.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Travel Blog Sync Log",
        "",
        "- Last draft sync: latest local draft",
        "- Source Taiwan: `C:\\Users\\bigpa\\Documents\\New project 5\\AI_Taiwan_Travel`",
        "- Source Japan: `C:\\Users\\bigpa\\Documents\\New project 6\\AI_JJAPAN_Travel`",
        "- Destination Taiwan draft: `Taiwan_travel/`",
        "- Destination Japan draft: `Japan_travel/`",
        "- Production mirror Taiwan: `public/Taiwan_travel/`",
        "- Production mirror Japan: `public/Japan_travel/`",
        "- Current rule: source folders are read-only; blog pages copy article text from `## Blog 文章` and copy referenced image files into the website draft folders.",
        "- Future update check: compare source `posts/*.md` and `images/*` LastWriteTime with the files listed below; add new/changed posts to the website draft, then update this log.",
        "- Incremental rule: next update should compare source post slugs against `manifest.json` and only generate slugs that are not listed there, unless the user explicitly asks to rebuild everything.",
        "- Homepage image rule: pick visually varied actions for the four hero photos; avoid images that crop off the face, cut the body awkwardly, or repeat the same pose too closely.",
        "- Global image crop rule: all homepage, card, article hero, and gallery images must avoid cutting off faces, heads, hands, or awkward body parts. Prefer `object-fit: contain` or a safer image selection over aggressive cropping.",
        "",
        "## Taiwan Draft Posts",
        "",
    ]
    for post in tw_posts:
        lines.append(f"- `{post['slug']}` / {post.get('title')}")
    lines.extend(["", "## Japan Draft Posts", ""])
    for post in jp_posts:
        lines.append(f"- `{post['slug']}` / {post.get('title')}")
    lines.extend(["", "## Skipped Source Items", ""])
    if not tw_skipped and not jp_skipped:
        lines.append("- None")
    for post in tw_skipped:
        lines.append(f"- Taiwan `{post.get('slug')}` skipped because the source text looked unreadable or had no Blog section.")
    for post in jp_skipped:
        lines.append(f"- Japan `{post.get('slug')}` skipped because the source text looked unreadable or had no Blog section.")
    lines.append("")
    (log_dir / "README.md").write_text("\n".join(lines), encoding="utf-8")

    manifest = {
        "rule": "Only append newly discovered slugs on future updates unless a full rebuild is explicitly requested.",
        "taiwan": [{"slug": str(post.get("slug")), "title": str(post.get("title"))} for post in tw_posts],
        "japan": [{"slug": str(post.get("slug")), "title": str(post.get("title"))} for post in jp_posts],
        "skipped": {
            "taiwan": [str(post.get("slug")) for post in tw_skipped],
            "japan": [str(post.get("slug")) for post in jp_skipped],
        },
    }
    (log_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def main() -> None:
    tw_all, tw_skipped = list_readable_posts(TAIWAN_SRC)
    jp_all, jp_skipped = list_readable_posts(JAPAN_SRC)
    tw_posts = write_collection(
        TAIWAN_SRC,
        tw_all,
        "Taiwan_travel",
        "taiwan",
        "Irene 台灣趴趴造",
        "Irene 台灣趴趴造",
        "跟著 Irene 鑽進台灣的山城小路、老街香氣和城市角落，把每一次散步都寫成有畫面的小旅行。",
        "Irene 喜歡把台灣巷弄、山海和老街小吃，收進一篇篇像散步一樣輕鬆的旅行筆記。",
        "/Taiwan_travel",
    )
    jp_posts = write_collection(
        JAPAN_SRC,
        jp_all,
        "Japan_travel",
        "japan",
        "Miu旅日生活",
        "Miu旅日生活",
        "跟著 Miu 把日本日常走成一篇篇小冒險，雨後街角、神社風鈴、城下町點心都慢慢收藏起來。",
        "Miu 喜歡在日本街角、神社和小鎮日常裡找驚喜，慢慢寫下像生活一樣的旅行片段。",
        "/japan_travel",
    )
    mirror_public_collection("Taiwan_travel")
    mirror_public_collection("Japan_travel")
    update_vercel()
    write_log(tw_posts, jp_posts, tw_skipped, jp_skipped)
    print(
        f"Generated {len(tw_posts)} Taiwan posts and {len(jp_posts)} Japan posts. "
        f"Skipped {len(tw_skipped)} Taiwan and {len(jp_skipped)} Japan source items."
    )


if __name__ == "__main__":
    main()

