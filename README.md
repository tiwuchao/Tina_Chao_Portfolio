# Tina Chao · UX portfolio

A watercolor highway portfolio. Live at https://tiwuchao.github.io/Tina_Chao_Portfolio/

## What's in this folder

| File | What it is |
| --- | --- |
| `index.html` | The homepage: hero, the five case study cards, the highway, Studio, About in short, and contact |
| `about.html` | The About page: gift tags, songs, the record player, Evergreen, photographs |
| `in2being.html` | in2being case study |
| `argus.html` | Argus Farm Stop case study |
| `songbird.html` | Songbird Cafe case study |
| `lendmate.html` | LendMate Alum case study |
| `fourth-soil.html` | Fourth Soil Farm case study |
| `css/site.css` | Styles shared by every page |
| `js/site.js` | Scripts shared by every page: menu, highway, music, the "on this page" route card |
| `images/` | Paintings, photos and case study screens |
| `images/og/` | The preview pictures shown when a page link is pasted into LinkedIn, Slack or a text |
| `audio/` | The songs the record player plays |
| `Tina-Chao-Resume.pdf` | What every Résumé link opens |

## Changing words

1. Open the page's file on GitHub (for example `argus.html`) and click the pencil icon.
2. Press Ctrl+F (Cmd+F on a Mac) to find the sentence.
3. Change it, then click **Commit changes**. The live site updates within a minute or two.

A case study's text lives only in its own file. The homepage card for each case study is in `index.html`.

## Swapping the résumé

Upload the new PDF with **Add file → Upload files**, named exactly `Tina-Chao-Resume.pdf`. A file with the same name replaces the old one.

## Good to know

- File names are case-sensitive on GitHub Pages. `Images/Hero.webp` won't find `images/hero.webp`.
- Image paths inside `css/site.css` start with `../images/`, because that file sits in the `css` folder.
- Old links to the one-page version (like `.../#argus` or `.../#about-me`) still work: the homepage forwards them to the new page.
- Each page's link preview points to `https://tiwuchao.github.io/Tina_Chao_Portfolio/`. If the site moves to its own domain, those `og:` lines at the top of each page need the new address.
- Fonts load from Google Fonts. Everything else is served from this folder.
