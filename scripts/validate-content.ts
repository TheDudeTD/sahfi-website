/** `npm run check` — validates content/ without building the whole site. */
import { listImages, loadContent } from "./load-content";

try {
  const content = loadContent();
  console.log(
    `✓ Content OK — ${content.tracks.length} tracks, ` +
      `${content.videos.liveSets.length + content.videos.featured.length} videos, ` +
      `${listImages("gallery").length} gallery photos`,
  );
} catch (error) {
  console.error(`\n✗ ${(error as Error).message}\n`);
  process.exit(1);
}
