// Envoi de photos / vidéos vers le stockage Supabase (bucket "media").
export async function uploadMedia(supabase, file, uid) {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  if (!isImage && !isVideo) throw new Error('Format non pris en charge — choisissez une photo ou une vidéo.');
  const max = isVideo ? 25 * 1024 * 1024 : 6 * 1024 * 1024;
  if (file.size > max) {
    throw new Error(isVideo ? 'Vidéo trop lourde (25 Mo maximum).' : 'Photo trop lourde (6 Mo maximum).');
  }
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type });
  if (error) throw new Error("Échec de l'envoi du fichier. Réessayez.");
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, type: isVideo ? 'video' : 'image' };
}

// Pièce jointe universelle : photo, vidéo, message vocal ou document (PDF/Word/Excel).
const DOCS = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
};
export async function uploadPieceJointe(supabase, file, uid) {
  const estAudio = file.type.startsWith('audio/');
  const estDoc = !!DOCS[file.type] || /\.(pdf|docx?|xlsx?)$/i.test(file.name);
  if (!estAudio && !estDoc) return uploadMedia(supabase, file, uid); // photo / vidéo
  const max = 10 * 1024 * 1024;
  if (file.size > max) throw new Error('Fichier trop lourd (10 Mo maximum).');
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type || undefined });
  if (error) throw new Error("Échec de l'envoi du fichier. Réessayez.");
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, type: estAudio ? 'audio' : 'document', nom: file.name };
}
