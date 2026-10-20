# How to update the SAHFI website

Everything you can change is in the **`content/`** folder. You never need to touch any other folder.

When you save a change to GitHub, the website rebuilds and goes live in about **1–2 minutes**. The EPK PDF is regenerated automatically too.

> **Safety net:** if you make a mistake (for example a broken link or a missing comma), the update is rejected and **the current site stays online**. The error message tells you which file and line to fix. See [If something goes wrong](#if-something-goes-wrong).

---

## Option A — Edit in the browser (no installs needed)

1. Go to the repository on **github.com** and open the `content` folder.
2. Click the file you want to change, e.g. `tracks.json`.
3. Click the **pencil icon ✏️** (top right of the file).
4. Make your change.
5. Click **Commit changes…** and write a short note (e.g. "Add new track"), then click **Commit changes**.
6. Wait 1–2 minutes and refresh the website.

**Uploading photos:** open `content/gallery`, then **Add file → Upload files**, drag the photos in, and click **Commit changes**.
**Deleting a photo:** open the photo, click the **⋯** menu → **Delete file**, then commit.

## Option B — Edit on your computer
```bash
npm install        # first time only
npm run dev        # preview at http://localhost:5173 while you edit
npm run check      # check your content for mistakes
git add content && git commit -m "Update content" && git push
```

---

## What to edit

### Featured tracks — `content/tracks.json`
On Spotify: **⋯ → Share → Copy Song Link**. Paste it into `spotifyUrl`.
```json
[
  { "title": "Type Of Way (Radio Edit)", "spotifyUrl": "https://open.spotify.com/track/1s4dSrSgFdsfTWZ1bqdXC9" },
  { "title": "My New Track", "spotifyUrl": "https://open.spotify.com/track/PASTE_ID_HERE" }
]
```
- The order in the file is the order on the site.
- Albums and playlists work too (`open.spotify.com/album/...`).
- The extra `?si=...` part of a share link is fine to leave in.

### Videos — `content/videos.json`
There are two lists: **`liveSets`** (DJ sets) and **`featured`** (music videos and other videos). On YouTube: **Share → Copy**.
```json
{
  "liveSets": [
    { "title": "SAHFI — Pannonica | 210425", "url": "https://www.youtube.com/watch?v=u8D1V9DJs4I" }
  ],
  "featured": [
    { "title": "SAHFI — Better Recognize (Official Video)", "url": "https://youtu.be/LWmfRA_u4qY" }
  ]
}
```
To add a video, copy an existing `{ ... }` block, put a comma between blocks, and change the title and URL.

### Bio — `content/about.md`
This is plain text. Separate paragraphs with an empty line; the first paragraph is shown larger. You can write `**bold**` and `[link text](https://...)`.

### Venues ("Played At") — `content/venues.json`
```json
["S One Sky Bar", "Aquarius Vils", "New Club Name"]
```

### Social media — `content/socials.json`
```json
[
  { "platform": "instagram", "url": "https://instagram.com/sahfiofficial" },
  { "platform": "spotify", "url": "https://open.spotify.com/artist/..." }
]
```
Allowed `platform` values: `instagram`, `youtube`, `soundcloud`, `spotify`, `tiktok`, `facebook`, `x`, `beatport`, `mixcloud`, `appleMusic`.

### Name, tagline, email, main photo — `content/artist.json`
- `email`: used for every "Booking"/contact button; it opens the visitor's email app.
- `heroImage`: the big photo at the top. It's a file name from `content/hero/`. To change it, upload a new photo to `content/hero/` and put its file name here. A wide landscape photo, at least 2000px wide, works best.
- `pressPhoto`: the photo next to the bio. It's a file name from `content/gallery/`.
- `genres`, `location`, `tagline`: shown in the hero, the bio, and the PDF.

### Gallery — `content/gallery/`
- Just add or remove image files (`.jpg`, `.png`, `.webp`).
- Photos are shown in **file-name order**, so name them `01.jpg`, `02.jpg`, `03.jpg`, …
- The first 9 also appear in the PDF.
- Upload the best quality you have; the site makes optimized versions automatically.

### Reorder or hide sections — `content/sections.json`
Move lines up or down to change the order on the page and in the EPK menu. Set `"enabled": false` to hide a section.
```json
[
  { "id": "tracks", "enabled": true },
  { "id": "liveSets", "enabled": true },
  { "id": "videos", "enabled": true },
  { "id": "about", "enabled": true },
  { "id": "playedAt", "enabled": false },
  { "id": "gallery", "enabled": true },
  { "id": "download", "enabled": true },
  { "id": "contact", "enabled": true }
]
```
A section with no content (e.g. an empty video list) hides itself automatically.

---

## JSON rules (the most common mistakes)
- Text goes in **double quotes**: `"title": "My Track"`.
- Put a **comma between items**, but **not after the last one**.
- Keep every opening `[` `{` matched with a closing `]` `}`.
- Unsure? Paste the file into https://jsonlint.com to check it.

## If something goes wrong
- **The site didn't update:** in Cloudflare open **Workers & Pages → sahfi → Deployments** and click the failed deployment to see the log. The message near the end tells you exactly what's wrong, for example:
  ```
  ✗ Build stopped
  Invalid content:
    • content/tracks.json → item #2 → spotifyUrl: is not a valid open.spotify.com link
  ```
  Fix that file and commit again.
- **You want to undo a change:** on GitHub, open the file → **History** → view the previous version and copy it back. Or ask your developer to revert the commit.
- **Test before going live:** when committing on GitHub, choose **"Create a new branch"** instead of committing to `main`. Cloudflare builds a private **preview link** for that branch. When you're happy, open a pull request and merge it into `main`.
