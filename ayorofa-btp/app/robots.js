export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://btp.ayorofa.com';
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${base}/sitemap.xml` };
}
