/**
 * Generates public/sahfi-epk.pdf from the files in content/.
 * Runs automatically before every `npm run build` (and by itself via `npm run epk`).
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { Font, renderToFile } from "@react-pdf/renderer";
import sharp from "sharp";
import { EpkDocument, type PdfImage } from "../app/components/pdf/EpkDocument";
import { EPK_PDF_PATH } from "../app/config/site";
import { CONTENT_DIR, ROOT, listImages, loadContent } from "./load-content";

const FONTS_DIR = join(ROOT, "scripts", "fonts");
const MAX_GALLERY_PHOTOS = 9;

Font.register({
  family: "Display",
  fonts: [
    { src: join(FONTS_DIR, "BarlowCondensed-Bold.ttf"), fontWeight: 700 },
    { src: join(FONTS_DIR, "BarlowCondensed-ExtraBold.ttf"), fontWeight: 800 },
  ],
});
Font.register({
  family: "Body",
  fonts: [
    { src: join(FONTS_DIR, "Barlow-Regular.ttf"), fontWeight: 400 },
    { src: join(FONTS_DIR, "Barlow-SemiBold.ttf"), fontWeight: 600 },
  ],
});
// Don't hyphenate words across lines
Font.registerHyphenationCallback((word) => [word]);

/** Downscale + re-encode as JPEG so the PDF stays small (react-pdf can't read WebP). */
async function loadImage(path: string, width: number): Promise<PdfImage> {
  const data = await sharp(path)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  return { data, format: "jpg" };
}

async function main() {
  const content = loadContent();
  const { heroImage, pressPhoto } = content.artist;

  const galleryFiles = listImages("gallery").slice(0, MAX_GALLERY_PHOTOS);
  const [hero, press, gallery] = await Promise.all([
    loadImage(join(CONTENT_DIR, "hero", heroImage), 1600),
    pressPhoto ? loadImage(join(CONTENT_DIR, "gallery", pressPhoto), 800) : undefined,
    Promise.all(galleryFiles.map((file) => loadImage(file, 700))),
  ]);

  const outFile = join(ROOT, "public", EPK_PDF_PATH);
  mkdirSync(join(ROOT, "public"), { recursive: true });
  await renderToFile(
    <EpkDocument content={content} hero={hero} pressPhoto={press} gallery={gallery} />,
    outFile,
  );
  console.log(`✓ EPK PDF written to public${EPK_PDF_PATH}`);
}

main().catch((error: Error) => {
  console.error(`\n✗ Build stopped\n${error.message}\n`);
  process.exit(1);
});
