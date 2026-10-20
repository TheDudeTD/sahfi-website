import type { Config } from "@react-router/dev/config";

export default {
  // Fully static: the home page is prerendered to HTML at build time,
  // then hydrates into a React SPA. No server needed (Cloudflare Pages).
  ssr: false,
  prerender: ["/"],
} satisfies Config;
