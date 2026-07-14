'use client';
import Script from 'next/script';

// Google AdSense — actif seulement si NEXT_PUBLIC_ADSENSE_ID est défini.
export function AdSenseScript() {
  const id = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!id) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

export function AdSlot() {
  const id = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!id) return null;
  return <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={id} data-ad-format="auto" />;
}

export default AdSlot;
