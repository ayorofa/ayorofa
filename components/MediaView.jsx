// Affiche une photo ou une vidéo dans une annonce ou un message.
export default function MediaView({ url, type, petit = false }) {
  if (!url) return null;
  const style = { width: '100%', maxHeight: petit ? 260 : 420, borderRadius: 12, marginTop: 10, objectFit: 'cover', background: '#000' };
  if (type === 'video') {
    return <video src={url} controls playsInline preload="metadata" style={style} />;
  }
  return <img src={url} alt="" loading="lazy" style={style} />;
}
