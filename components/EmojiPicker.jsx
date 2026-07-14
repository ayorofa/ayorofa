'use client';

// La palette de réactions Ayôrôfa Connect — à l'ivoirienne 🇨🇮
// Chaque emoji porte son expression du pays (visible en appui long / survol).
export const EMOJIS = ['👍', '❤️', '🔥', '😂', '💪', '👏', '🙏', '🇨🇮'];

export const EMOJI_LABELS = {
  '👍': 'C’est validé',
  '❤️': 'J’adore',
  '🔥': 'C’est chaud !',
  '😂': 'C’est drôle deh !',
  '💪': 'Force à toi',
  '👏': 'Bravo champion',
  '🙏': 'On est ensemble',
  '🇨🇮': 'Fierté ivoirienne',
};

// Petite barre d'emojis qui s'ouvre au clic sur « Réagir »
export default function EmojiPicker({ onPick, actif }) {
  return (
    <span className="emoji-pop" role="menu" aria-label="Choisir une réaction">
      {EMOJIS.map((e) => (
        <button key={e} type="button"
          className={'emoji-opt' + (actif === e ? ' on' : '')}
          onClick={() => onPick(e)}
          title={EMOJI_LABELS[e]}
          aria-label={EMOJI_LABELS[e]}>
          {e}
        </button>
      ))}
    </span>
  );
}
