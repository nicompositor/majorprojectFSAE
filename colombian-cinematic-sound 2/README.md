# Colombian Cinematic Sound

An English-language research and music portfolio. Static HTML, CSS and JavaScript; no build step, database, paid hosting or API keys required.

## Preview locally

From this directory run `python3 -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173`. Stop with Ctrl+C. Serve via HTTP: do not rely on opening index.html as a local file when testing external players.

## Publish with GitHub Pages

1. Create a repository on GitHub (a public repository works with GitHub Free).
2. Upload **the contents of this folder** to the repository root. `index.html` must be at the root, not inside another folder. Include the hidden `.github` directory and `.nojekyll` file.
3. Use `main` as the default branch. If you use a different branch, change the workflow accordingly.
4. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
5. Open **Actions**, select **Publish portfolio to GitHub Pages**, and run it, or push a new commit to `main`.
6. When the deployment succeeds, GitHub Pages shows the public URL in Settings → Pages. Subsequent commits to `main` update the site.

Alternative without a workflow: select **Deploy from a branch**, choose **main / (root)**. The `.nojekyll` file enables direct static serving. Use one deployment method, not both.

Relative asset paths support both `username.github.io` and `username.github.io/repository-name/`.

## Add your content

Edit only `content.js` for cues, films, links, authors and the thesis PDF. Keep the quotation marks, commas and brackets. Empty URLs intentionally show **forthcoming**, with no broken media frames or invented recordings.

### Desterrados — SoundCloud

For each item in `cues`, replace `url: ""` with a full track or playlist link, for example `url: "https://soundcloud.com/YOUR-ACCOUNT/YOUR-TRACK"`. This example is a placeholder, not a real recording. Use soundcloud.com links, not shortened on.soundcloud.com links; resolve those in your browser first. Preserve required query parameters for permitted private shares, but remember every link in a public website is public.

M0 Prologue (From the Exile); M1 Territory; M2 Presence; M3 Threat; M4 Uprootedness; M5 Transit; M6 Non-place; M7 Memory; M8 Inside My Roots (Resilience). The prologue opens the story from the perspective of the exiled character. Each cue links to its corresponding track from the [Desterrados album](https://soundcloud.com/compositorio-mail/sets/desterrados).

### Films — YouTube

Set each film's `url` to its YouTube link (`https://www.youtube.com/watch?v=...` or `https://youtu.be/...`). Watch, share, shorts, live and embed URLs are supported. Upload/share only footage you have permission to publish. Enable embedding on YouTube. Embedding does not bypass account, region, copyright or age restrictions.

The portal contains Pedacito de Tela, Warhammer 40,000 and Hasta que suene el timbre. Warhammer is labelled as an independent academic rescoring, not an official commission. Replace pending film credits before final submission.

The films use YouTube only; there are no separate audio players below them.

### Final PDF

1. Add the **final approved PDF only** to `documents/thesis-final.pdf`.
2. Set `thesis.url` to `"documents/thesis-final.pdf"`.
3. Commit both changes. The reading, download and external-view buttons appear automatically.

An external HTTPS PDF URL also works, but remote services can prohibit embedding or force viewing instead of downloading. A PDF hosted in this repository is recommended. Mobile browsers may open PDFs directly; the new-tab link is always available. There is no upload/admin backend: changes must be committed to GitHub. Do not put credentials or tokens in website files.

### People

Replace `people: []` with entries such as `people: [{ name: "Full name", role: "Composition & research" }]`. No unconfirmed personal credits were invented.

## Design and privacy

The landscapes and film placeholders are abstract CSS artwork, not film stills or documentary evidence. Replace them only with authorised images. Google Fonts supplies the typefaces; Georgia/Arial fallbacks work if fonts cannot load. External media loads only after a visitor clicks the load button. The site has no analytics or authentication. YouTube, SoundCloud, Google Fonts and GitHub apply their own privacy policies.

## Before publishing

- Confirm names, credits, cue descriptions and permissions.
- Replace media links and test every player on the deployed URL.
- Confirm the final PDF opens and downloads on desktop and mobile.
- Do not publish the preliminary manuscript or treat its unverified bibliography as verified website content.

## Files

`index.html` — structure and editorial text; `styles.css` — design and responsiveness; `content.js` — editable portfolio data; `app.js` — cue navigation and media; `assets/mark.svg` — original graphic mark; `documents/` — final PDF; `.github/workflows/pages.yml` — deployment workflow.

This delivery does not grant rights to third-party films, music or the source book. No third-party footage, audio, film stills or manuscript has been bundled.
