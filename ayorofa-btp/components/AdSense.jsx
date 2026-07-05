'use client';
import { useEffect } from 'react';
import Script from 'next/script';
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
export function AdSenseScript() {
  if (!CLIENT) return null;
  return <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`} strategy="afterInteractive" crossOrigin="anonymous" />;
}
export function AdSlot({ slot, format = 'auto', responsive = true, style }) {
  useEffect(() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {} }, []);
  if (!CLIENT) return <div className="ad-placeholder">Emplacement publicitaire</div>;
  return <ins className="adsbygoogle" style={{ display: 'block', ...style }} data-ad-client={CLIENT} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive={responsive ? 'true' : 'false'} />;
}
