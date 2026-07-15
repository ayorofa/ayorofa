import Link from 'next/link';

// Rend un texte avec #hashtags, @mentions et liens cliquables.
export default function TexteRiche({ texte }) {
  if (!texte) return null;
  const parts = String(texte).split(/(#[\p{L}0-9_]+|@[\p{L}0-9_]+|https?:\/\/\S+)/gu);
  return (
    <>
      {parts.map((part, i) => {
        if (/^#[\p{L}0-9_]+$/u.test(part)) {
          return <Link key={i} className="tag" href={`/recherche?q=${encodeURIComponent(part)}`}>{part}</Link>;
        }
        if (/^@[\p{L}0-9_]+$/u.test(part)) {
          return <Link key={i} className="mention" href={`/recherche?q=${encodeURIComponent(part.slice(1))}`}>{part}</Link>;
        }
        if (/^https?:\/\//.test(part)) {
          return <a key={i} href={part} target="_blank" rel="noopener nofollow" className="lien-ext">{part.replace(/^https?:\/\//, '').slice(0, 40)}…</a>;
        }
        return part;
      })}
    </>
  );
}
