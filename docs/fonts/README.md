# Local fonts

Fonts are loaded from this folder via `@font-face` in CSS (no Google Fonts request).

## Check

You must have **10 files** with extension **.woff2** in `app/fonts/`. If you only see README/OFL and no `.woff2` files, the fonts will not load. Get woff2 as below (the official Google Fonts zip often has only .ttf; use Google Webfonts Helper for woff2).

## Required files

Place these **woff2** files in `app/fonts/`:

| File | Source |
|------|--------|
| `poppins-400.woff2` | Poppins Regular (400) |
| `poppins-500.woff2` | Poppins Medium (500) |
| `poppins-600.woff2` | Poppins SemiBold (600) |
| `poppins-700.woff2` | Poppins Bold (700) |
| `inter-400.woff2` | Inter Regular (400) |
| `inter-700.woff2` | Inter Bold (700) |
| `manrope-400.woff2` | Manrope Regular (400) |
| `manrope-500.woff2` | Manrope Medium (500) |
| `manrope-600.woff2` | Manrope SemiBold (600) |
| `manrope-700.woff2` | Manrope Bold (700) |

## How to get the files

1. Open [Google Webfonts Helper](https://gwfh.mranftl.com/fonts).
2. Search for **Poppins**, **Inter**, and **Manrope**.
3. For each font: select the weights above, choose **woff2**, download.
4. Rename the files to match the table (e.g. `poppins-v20-latin-regular.woff2` → `poppins-400.woff2`).
5. Put all files in `app/fonts/`.

Gulp will copy them to `app/temp/fonts/` (dev) and `docs/fonts/` (build).
