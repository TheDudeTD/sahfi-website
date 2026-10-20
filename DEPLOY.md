# Deploying to Cloudflare Pages

The site is fully static, so it's hosted on **Cloudflare Pages (free plan)**:
- $0/month, with unlimited bandwidth, free SSL, and a global CDN; commercial use is allowed.
- 500 builds/month, which is far more than needed.
- No server, no Docker. Cloudflare builds the site from GitHub on every push.

The only cost is the domain renewal you already pay.

---

## 1. Push the code to GitHub
1. Create a new repository on https://github.com/new (private is fine). Don't add a README or .gitignore; this repo already has them.
2. In this project folder:
   ```bash
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sahfi-epk.git
   git push -u origin main
   ```

## 2. Create the Cloudflare Pages project
1. Sign up or log in at https://dash.cloudflare.com (free account).
2. Go to **Workers & Pages → Create → Pages → Connect to Git**.
   > Make sure you pick the **Pages** tab/option, not "Workers".
3. Authorize GitHub and select the `sahfi-epk` repository, then click **Begin setup**.
4. Build settings:
   | Setting | Value |
   |---|---|
   | Project name | `sahfi` (this gives you `sahfi.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | `npm run build` |
   | Build output directory | `build/client` |
   | Root directory | *(leave empty)* |
5. Under **Environment variables (advanced)**, add `NODE_VERSION` = `22`. Cloudflare also reads `.nvmrc`; this just makes it explicit.
6. Click **Save and Deploy**. The first build takes 1–3 minutes.
7. Open `https://sahfi.pages.dev` and check the site and the **Download EPK** button.

## 3. Connect your custom domain
Your domain stays registered where it is; only the DNS moves to Cloudflare (free).

### 3a. Add the domain to Cloudflare (once)
1. In the Cloudflare dashboard, open **Account home → Add a domain**, enter your domain (e.g. `sahfi.com`), and choose the **Free** plan.
2. Cloudflare scans your existing DNS records. Keep them, **especially MX records for email** (`info@sahfi.com` must keep working).
3. Cloudflare shows you **two nameservers** (e.g. `ada.ns.cloudflare.com`). Log in to your domain registrar (GoDaddy, Namecheap, etc.) and replace the domain's nameservers with these two.
4. Wait until Cloudflare marks the domain **Active**. This usually takes minutes, but can take up to 24h. You'll get an email.

### 3b. Attach the domain to the Pages project
1. Go to **Workers & Pages → sahfi → Custom domains → Set up a custom domain**.
2. Enter `sahfi.com`, then **Continue → Activate domain**. Cloudflare creates the DNS record automatically.
3. Repeat for `www.sahfi.com`.
4. SSL certificates are issued automatically within a few minutes.

### 3c. Redirect `www` → main domain
1. Go to the domain in Cloudflare → **Rules → Redirect Rules → Create rule**. Choose the template **"Redirect from WWW to root"** if offered; otherwise set it up as follows:
   - **If:** Hostname equals `www.sahfi.com`
   - **Then:** Dynamic redirect to `concat("https://sahfi.com", http.request.uri.path)`, status **301**, preserve query string.
2. Deploy the rule.

### 3d. Update the site URL in the content
If your domain isn't `sahfi.com`, update:
- `content/artist.json` → `seo.siteUrl`
- `public/robots.txt` and `public/sitemap.xml`

Commit and push, and the site redeploys.

> **Alternative without moving nameservers:** you can connect only a subdomain (e.g. `www.yourdomain.com`) by adding a CNAME record at your registrar that points to `sahfi.pages.dev`. Connecting the bare domain (`yourdomain.com`) requires Cloudflare nameservers.

---

## Day-to-day
| Action | Result |
|---|---|
| Push or commit to `main` | Production deploy (live in ~1–2 min) |
| Push to any other branch | **Preview deploy** at `https://<branch>.sahfi.pages.dev` (not public on your domain) |
| Build fails | Nothing changes; the previous version stays live |

## Rollback
**Workers & Pages → sahfi → Deployments**, find a previous successful deployment, then **⋯ → Rollback to this deployment**. It's instant. Afterwards, fix or revert the bad commit in GitHub so the next push doesn't redeploy it.

## Troubleshooting
| Problem | Fix |
|---|---|
| Build log says `Invalid content: …` | A file in `content/` has a mistake; the message names the file and item. See EDITING.md. |
| `Unexpected token` / JSON error | Missing or extra comma or quote in a `.json` file. Check it on https://jsonlint.com. |
| Errors about Node version or `import.meta` | Set the env var `NODE_VERSION=22` (Settings → Variables and Secrets), then **Retry deployment**. |
| Site shows a 404 | Check that the build output directory is exactly `build/client`. |
| Custom domain stuck on "Verifying" | The domain isn't Active on Cloudflare yet (nameservers not switched or still propagating). Check with `dig NS yourdomain.com`. |
| Email stopped working after moving DNS | The MX/TXT records weren't imported. Re-add them in Cloudflare DNS from your old provider's settings. |
| Old content still showing | Hard-refresh (Cmd/Ctrl + Shift + R). The PDF is cached for up to 1 hour (`public/_headers`). |

## Test the production build locally (optional)
```bash
npm install
npm run build      # same command Cloudflare runs
npm run preview    # serves build/client at http://localhost:3000
```
