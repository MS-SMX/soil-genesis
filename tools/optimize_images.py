#!/usr/bin/env python3
"""
Batch image optimizer for Soil Genesis.

Run from the repository root:
    python -m pip install Pillow
    python tools/optimize_images.py --dry-run
    python tools/optimize_images.py

Keeps file names/formats unchanged so existing YAML, Markdown and Liquid paths
continue to work. JPEG/WebP recompression is lossy; commit or back up first.
"""
from pathlib import Path
import argparse
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "assets" / "images"
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--max-edge", type=int, default=2400)
    parser.add_argument("--jpeg-quality", type=int, default=82)
    parser.add_argument("--webp-quality", type=int, default=82)
    args = parser.parse_args()

    if not IMAGE_ROOT.exists():
        raise SystemExit(f"Image folder not found: {IMAGE_ROOT}")

    paths = [p for p in IMAGE_ROOT.rglob("*") if p.is_file() and p.suffix.lower() in EXTENSIONS]
    total_before = total_after = improved = 0

    for path in paths:
        before = path.stat().st_size
        total_before += before
        try:
            with Image.open(path) as original:
                image = ImageOps.exif_transpose(original)
                image.load()
                if image.width > args.max_edge or image.height > args.max_edge:
                    image.thumbnail((args.max_edge, args.max_edge), Image.Resampling.LANCZOS)

                suffix = path.suffix.lower()
                fmt = {".jpg": "JPEG", ".jpeg": "JPEG", ".png": "PNG", ".webp": "WEBP"}[suffix]
                save_args = {}
                if fmt == "JPEG":
                    if image.mode not in ("RGB", "L"):
                        image = image.convert("RGB")
                    save_args = {"quality": args.jpeg_quality, "optimize": True, "progressive": True}
                elif fmt == "PNG":
                    save_args = {"optimize": True, "compress_level": 9}
                elif fmt == "WEBP":
                    save_args = {"quality": args.webp_quality, "method": 6}

                if args.dry_run:
                    print(f"WOULD OPTIMIZE {path.relative_to(ROOT)} ({before / 1024:.0f} KB, {image.width}x{image.height})")
                    total_after += before
                    continue

                temp = path.with_name(path.name + ".optimized.tmp")
                image.save(temp, format=fmt, **save_args)
                after = temp.stat().st_size
                if after < before:
                    temp.replace(path)
                    total_after += after
                    improved += 1
                    print(f"OPTIMIZED {path.relative_to(ROOT)}: {before / 1024:.0f} KB -> {after / 1024:.0f} KB")
                else:
                    temp.unlink(missing_ok=True)
                    total_after += before
                    print(f"KEPT {path.relative_to(ROOT)}: already efficient ({before / 1024:.0f} KB)")
        except Exception as exc:
            total_after += before
            print(f"SKIPPED {path.relative_to(ROOT)}: {exc}")

    print(f"\nImages scanned: {len(paths)}")
    print(f"Before: {total_before:,} bytes ({total_before / 1024 / 1024:.2f} MiB)")
    print(f"After:  {total_after:,} bytes ({total_after / 1024 / 1024:.2f} MiB)")
    if not args.dry_run:
        print(f"Files improved: {improved}")

if __name__ == "__main__":
    main()
