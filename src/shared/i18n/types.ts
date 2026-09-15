export type Lang = "en" | "fr";

export type SectionKey =
  | "navbar"

export type SectionDict = Record<string, any>;

export type Dictionary = Record<SectionKey, Record<Lang, SectionDict>>;
