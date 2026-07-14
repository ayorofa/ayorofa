// Côte d'Ivoire — communes d'Abidjan, puis toutes les principales villes (chefs-lieux
// de régions et départements), classées par ordre alphabétique.

export const ABIDJAN = [
  'Abobo', 'Adjamé', 'Anyama', 'Attécoubé', 'Bingerville', 'Cocody', 'Koumassi',
  'Marcory', 'Plateau', 'Port-Bouët', 'Songon', 'Treichville', 'Yopougon',
];

export const VILLES_CI = [
  'Abengourou', 'Aboisso', 'Adiaké', 'Adzopé', 'Agboville', 'Agnibilékrou', 'Akoupé',
  'Alépé', 'Bangolo', 'Béoumi', 'Biankouma', 'Bocanda', 'Bondoukou', 'Bongouanou',
  'Bonoua', 'Bouaflé', 'Bouaké', 'Bouna', 'Boundiali', 'Dabakala', 'Dabou', 'Daloa',
  'Danané', 'Daoukro', 'Dimbokro', 'Divo', 'Duékoué', 'Ferkessédougou', 'Fresco',
  'Gagnoa', 'Grand-Bassam', 'Grand-Lahou', 'Guiglo', 'Guitry', 'Issia', 'Jacqueville',
  'Katiola', 'Kong', 'Korhogo', 'Kouibly', 'Lakota', 'Man', 'Mankono', "M'Bahiakro",
  'Méagui', 'Minignan', 'Odienné', 'Ouangolodougou', 'Oumé', 'Sakassou', 'San-Pédro',
  'Sassandra', 'Séguéla', 'Sikensi', 'Sinfra', 'Soubré', 'Tabou', 'Tanda', 'Tengréla',
  'Tiassalé', 'Tiébissou', 'Touba', 'Toulepleu', 'Toumodi', 'Vavoua', 'Yamoussoukro',
  'Zuénoula', 'Autre localité',
];

// Liste complète pour les menus : Abidjan d'abord, puis le reste du pays
export const VILLES = [...ABIDJAN, ...VILLES_CI];

// Les 31 régions + 2 districts autonomes (pour usage futur : filtres, statistiques…)
export const REGIONS = [
  'Abidjan (district autonome)', 'Yamoussoukro (district autonome)',
  'Agnéby-Tiassa', 'Bafing', 'Bagoué', 'Bélier', 'Béré', 'Bounkani', 'Cavally',
  'Folon', 'Gbêkê', 'Gbôklé', 'Gôh', 'Gontougo', 'Grands-Ponts', 'Guémon',
  'Hambol', 'Haut-Sassandra', 'Iffou', 'Indénié-Djuablin', 'Kabadougou',
  'La Mé', 'Lôh-Djiboua', 'Marahoué', 'Moronou', 'Nawa', "N'Zi", 'Poro',
  'San-Pédro', 'Sud-Comoé', 'Tchologo', 'Tonkpi', 'Worodougou',
];
