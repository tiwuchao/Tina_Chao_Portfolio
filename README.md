# Tina Chao · UX portfolio

A watercolor highway portfolio built as one static page. Everything it needs is in this folder:

- `index.html` is the whole site: the homepage, About, and all five case studies, with the styles and scripts inside the file.
- `images/` holds the paintings, photos and case study screens.
- `audio/` holds the two songs for the record player.
- `Tina-Chao-Resume.pdf` is what every Résumé link opens.

The pages switch with links like `#about-me` and `#argus`, so the site works on any static host with no build step.

## Put it on GitHub Pages

1. Unzip the download. You'll get a folder called `tina-chao-portfolio`.
2. On GitHub, click **New repository**.
   - Name it `your-username.github.io` if you want the site at `https://your-username.github.io`.
   - Or give it any name, like `portfolio`, and the site will be at `https://your-username.github.io/portfolio/`.
   - Make it **Public**. Free accounts can only publish Pages from public repos.
3. On the new repo's page, click **uploading an existing file**.
4. Open the unzipped folder and drag everything inside it onto the upload area: `index.html`, `images`, `audio`, the PDF and this README. Drag the folders themselves so GitHub keeps them as folders. Then click **Commit changes**.
5. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, the branch to **main** and the folder to **/ (root)**, then click **Save**.
6. Wait a minute or two and refresh. GitHub shows the link at the top of the Pages settings.

## Changing words later

The **Edit words** button only works in the Claude version of the page, so this copy doesn't include it. To change words here:

1. Open `index.html` on GitHub and click the pencil icon.
2. Use Ctrl+F (Cmd+F on a Mac) to find the sentence.
3. Change it, then click **Commit changes**. The live site updates within a minute or two.

To swap in a newer version of the whole site, use **Add file → Upload files** and drop in the new `index.html` (plus any new images). Files with the same name get replaced.

## Good to know

- File names are case-sensitive on GitHub Pages. `Images/Hero.webp` won't find `images/hero.webp`.
- Fonts load from Google Fonts. Everything else is served from this folder.
- Once the site is live, put its link in the header of your résumé in place of the Framer link.
