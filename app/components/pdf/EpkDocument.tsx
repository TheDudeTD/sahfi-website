/**
 * The downloadable press kit, built with @react-pdf/renderer.
 * Rendered at build time by scripts/build-epk.tsx — never shipped to the browser.
 * Fonts ("Display", "Body") are registered by that script.
 */
import { Document, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Content, SocialPlatform, Video } from "~/lib/schema";

export interface PdfImage {
  data: Buffer;
  format: "jpg" | "png";
}

export interface EpkDocumentProps {
  content: Content;
  hero?: PdfImage;
  pressPhoto?: PdfImage;
  gallery: PdfImage[];
}

const C = { bg: "#000000", fg: "#ffffff", muted: "#a3a3a3", subtle: "#6b6b6b", line: "#262626" };

const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
  spotify: "Spotify",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
  beatport: "Beatport",
  mixcloud: "Mixcloud",
  appleMusic: "Apple Music",
};

const s = StyleSheet.create({
  page: { backgroundColor: C.bg, color: C.fg, fontFamily: "Body", fontSize: 10.5, padding: 48, paddingBottom: 72 },
  coverPage: { backgroundColor: C.bg, color: C.fg, fontFamily: "Body", padding: 0 },
  coverImage: { width: "100%", height: 470, objectFit: "cover" },
  coverBody: { paddingHorizontal: 48, paddingTop: 28 },
  eyebrow: { fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: C.subtle, marginBottom: 8 },
  coverName: { fontFamily: "Display", fontWeight: 800, fontSize: 120, lineHeight: 0.9, textTransform: "uppercase" },
  coverTagline: { fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.muted, marginTop: 26 },
  coverFacts: { flexDirection: "row", marginTop: 28, paddingTop: 16, borderTop: `1 solid ${C.line}` },
  fact: { flex: 1, paddingRight: 12 },
  factLabel: { fontSize: 7.5, letterSpacing: 2, textTransform: "uppercase", color: C.subtle, marginBottom: 4 },
  factValue: { fontSize: 10.5 },
  h2: {
    fontFamily: "Display",
    fontWeight: 700,
    fontSize: 40,
    textTransform: "uppercase",
    lineHeight: 1,
    marginBottom: 18,
  },
  section: { marginBottom: 32 },
  aboutRow: { flexDirection: "row" },
  aboutPhoto: { width: 190, height: 238, objectFit: "cover", marginRight: 24 },
  aboutText: { flex: 1 },
  paragraph: { color: C.muted, lineHeight: 1.45, marginBottom: 10 },
  lead: { color: C.fg, fontSize: 12.5, lineHeight: 1.5, marginBottom: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    fontSize: 8.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: C.muted,
    border: `1 solid ${C.line}`,
    paddingVertical: 4,
    paddingHorizontal: 7,
    marginRight: 5,
    marginBottom: 5,
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderBottom: `1 solid ${C.line}`,
  },
  listTitle: { fontFamily: "Display", fontWeight: 700, fontSize: 15, textTransform: "uppercase", flex: 1, paddingRight: 12 },
  listLink: { fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", color: C.fg, textDecoration: "none" },
  h3: { fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: C.subtle, marginTop: 16, marginBottom: 2 },
  contactEmail: { fontFamily: "Display", fontWeight: 800, fontSize: 30, color: C.fg, textDecoration: "none" },
  socialRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 14 },
  social: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: C.fg,
    textDecoration: "none",
    border: `1 solid ${C.line}`,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gridImage: { width: "32.3%", height: 205, objectFit: "cover", marginBottom: 7 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: C.subtle,
  },
});

/** Very small markdown → paragraphs conversion (bio is plain prose). */
function toParagraphs(markdown: string): string[] {
  return markdown
    .split(/\n\s*\n/)
    .map((p) =>
      p
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_`#>]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

function Footer({ name, email, siteUrl }: { name: string; email: string; siteUrl: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>{name} — Electronic Press Kit</Text>
      <Link src={`mailto:${email}`} style={{ color: C.subtle, textDecoration: "none" }}>
        {email}
      </Link>
      <Link src={siteUrl} style={{ color: C.subtle, textDecoration: "none" }}>
        {new URL(siteUrl).host}
      </Link>
    </View>
  );
}

function VideoList({ title, videos }: { title: string; videos: Video[] }) {
  if (!videos.length) return null;
  return (
    <View wrap={false}>
      <Text style={s.h3}>{title}</Text>
      {videos.map((video) => (
        <View key={video.url} style={s.listRow}>
          <Text style={s.listTitle}>{video.title}</Text>
          <Link src={video.url} style={s.listLink}>
            Watch on YouTube
          </Link>
        </View>
      ))}
    </View>
  );
}

export function EpkDocument({ content, hero, pressPhoto, gallery }: EpkDocumentProps) {
  const { artist, tracks, videos, venues, socials } = content;
  const [lead, ...paragraphs] = toParagraphs(content.about);
  const footer = <Footer name={artist.name} email={artist.email} siteUrl={artist.seo.siteUrl} />;

  return (
    <Document title={`${artist.name} — Electronic Press Kit`} author={artist.name} subject="Electronic Press Kit">
      {/* Cover */}
      <Page size="A4" style={s.coverPage}>
        {hero && <Image src={hero} style={s.coverImage} />}
        <View style={s.coverBody}>
          <Text style={s.eyebrow}>Electronic Press Kit</Text>
          <Text style={s.coverName}>{artist.name}</Text>
          <Text style={s.coverTagline}>{artist.tagline}</Text>
          <View style={s.coverFacts}>
            {artist.location && (
              <View style={s.fact}>
                <Text style={s.factLabel}>Based in</Text>
                <Text style={s.factValue}>{artist.location}</Text>
              </View>
            )}
            {artist.genres.length > 0 && (
              <View style={s.fact}>
                <Text style={s.factLabel}>Genres</Text>
                <Text style={s.factValue}>{artist.genres.join(", ")}</Text>
              </View>
            )}
            <View style={s.fact}>
              <Text style={s.factLabel}>Bookings</Text>
              <Link src={`mailto:${artist.email}`} style={[s.factValue, { color: C.fg, textDecoration: "none" }]}>
                {artist.email}
              </Link>
            </View>
          </View>
        </View>
      </Page>

      {/* About + Played at */}
      <Page size="A4" style={s.page}>
        <View style={s.section}>
          <Text style={s.h2}>About</Text>
          <View style={s.aboutRow}>
            {pressPhoto && <Image src={pressPhoto} style={s.aboutPhoto} />}
            <View style={s.aboutText}>
              {lead && <Text style={s.lead}>{lead}</Text>}
              {paragraphs.map((p, i) => (
                <Text key={i} style={s.paragraph}>
                  {p}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {venues.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.h2}>Played at</Text>
            <View style={s.chips}>
              {venues.map((venue) => (
                <Text key={venue} style={s.chip}>
                  {venue}
                </Text>
              ))}
            </View>
          </View>
        )}
        {footer}
      </Page>

      {/* Music, videos, contact */}
      <Page size="A4" style={s.page}>
        {tracks.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.h2}>Featured tracks</Text>
            {tracks.map((track) => (
              <View key={track.spotifyUrl} style={s.listRow}>
                <Text style={s.listTitle}>{track.title}</Text>
                <Link src={track.spotifyUrl} style={s.listLink}>
                  Listen on Spotify
                </Link>
              </View>
            ))}
          </View>
        )}

        {(videos.liveSets.length > 0 || videos.featured.length > 0) && (
          <View style={s.section}>
            <Text style={s.h2}>Videos</Text>
            <VideoList title="Live sets" videos={videos.liveSets} />
            <VideoList title="Music videos" videos={videos.featured} />
          </View>
        )}

        <View style={s.section} wrap={false}>
          <Text style={s.h2}>Contact</Text>
          <Text style={s.eyebrow}>Bookings & press</Text>
          <Link src={`mailto:${artist.email}`} style={s.contactEmail}>
            {artist.email}
          </Link>
          <View style={s.socialRow}>
            {socials.map((social) => (
              <Link key={social.url} src={social.url} style={s.social}>
                {platformLabels[social.platform]}
              </Link>
            ))}
          </View>
        </View>
        {footer}
      </Page>

      {/* Photos */}
      {gallery.length > 0 && (
        <Page size="A4" style={s.page}>
          <Text style={s.h2}>Photos</Text>
          <View style={s.grid}>
            {gallery.map((image, i) => (
              <Image key={i} src={image} style={s.gridImage} />
            ))}
          </View>
          {footer}
        </Page>
      )}
    </Document>
  );
}
