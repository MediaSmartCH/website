export type Lang = "en" | "fr";

// Toutes les sections (clés de dictionary)
export type SectionKey =
  | "navbar"
//   | "footer"
//   | "home"
//   | "it"
//   | "video"
//   | "error404"
//   | "cookies";

// Chaque section est un simple record clé -> string (ou nested si besoin)
export type SectionDict = Record<string, any>;

// Forme que TU veux garder : dictionary.section[lang] = SectionDict
export type Dictionary = Record<SectionKey, Record<Lang, SectionDict>>;
