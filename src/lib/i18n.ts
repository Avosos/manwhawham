/* ══════════════════════════════════════════════════════════════════════════════
 * ManwhaWham — Internationalization (i18n)
 * Supports: English (en), German (de)
 * ══════════════════════════════════════════════════════════════════════════════ */

export type Language = "en" | "de";

export interface Translations {
  // ─── Navigation ─────────────────────────────
  nav: {
    home: string;
    browse: string;
    library: string;
    history: string;
    downloads: string;
    settings: string;
    navigation: string;
    version: string;
  };
  // ─── Titlebar ───────────────────────────────
  titlebar: {
    appName: string;
    reader: string;
  };
  // ─── Home ───────────────────────────────────
  home: {
    welcome: string;
    welcomeDesc: string;
    startBrowsing: string;
    continueReading: string;
    continueReadingDesc: string;
    popular: string;
    popularDesc: string;
    trending: string;
    latestUpdates: string;
    latestUpdatesDesc: string;
    fresh: string;
    chapter: string;
  };
  // ─── Browse ─────────────────────────────────
  browse: {
    searchPlaceholder: string;
    filters: string;
    genres: string;
    themes: string;
    resultsFor: string;
    popularManga: string;
    titlesFound: string;
    noResults: string;
    noResultsDesc: string;
    startSearching: string;
  };
  // ─── Library ────────────────────────────────
  library: {
    title: string;
    empty: string;
    emptyDesc: string;
    browseManga: string;
    titlesSaved: string;
  };
  // ─── Manga Detail ──────────────────────────
  detail: {
    back: string;
    author: string;
    artist: string;
    startReading: string;
    noChapters: string;
    inLibrary: string;
    addToLibrary: string;
    mangadex: string;
    chapters: string;
    ascending: string;
    descending: string;
    chapter: string;
    volume: string;
    pages: string;
    downloaded: string;
    downloadChapter: string;
  };
  // ─── Reader ─────────────────────────────────
  reader: {
    chapter: string;
    quickSettings: string;
    mode: string;
    vertical: string;
    paged: string;
    fit: string;
    fitWidth: string;
    fitHeight: string;
    original: string;
    direction: string;
    ltr: string;
    rtl: string;
    loadingChapter: string;
    noPagesAvailable: string;
    noPagesDesc: string;
    previousChapter: string;
    nextChapter: string;
    failedToLoad: string;
    page: string;
  };
  // ─── History ────────────────────────────────
  history: {
    title: string;
    empty: string;
    emptyDesc: string;
    entries: string;
    cancel: string;
    clearAll: string;
    clear: string;
    chapterPage: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
  // ─── Downloads ──────────────────────────────
  downloads: {
    title: string;
    empty: string;
    emptyDesc: string;
    mangaWithDownloads: string;
    chaptersDownloaded: string;
    view: string;
    chapter: string;
  };
  // ─── Settings ───────────────────────────────
  settings: {
    title: string;
    appearance: string;
    theme: string;
    dark: string;
    grey: string;
    light: string;
    accentColor: string;
    readerSection: string;
    readingMode: string;
    verticalScroll: string;
    pagedMode: string;
    imageFit: string;
    fitWidth: string;
    fitHeight: string;
    originalSize: string;
    readingDirection: string;
    leftToRight: string;
    rightToLeft: string;
    performance: string;
    imageQuality: string;
    highQuality: string;
    dataSaver: string;
    content: string;
    preferredLanguage: string;
    showNSFW: string;
    about: string;
    aboutVersion: string;
    aboutEcosystem: string;
    aboutPoweredBy: string;
    language: string;
    languageDesc: string;
  };
  // ─── Languages (content) ────────────────────
  contentLanguages: {
    english: string;
    japanese: string;
    korean: string;
    chinese: string;
    french: string;
    german: string;
    spanish: string;
    portugueseBr: string;
    italian: string;
    russian: string;
    polish: string;
  };
  // ─── Common ─────────────────────────────────
  common: {
    loading: string;
    cancel: string;
    save: string;
    delete: string;
    back: string;
  };
}

const en: Translations = {
  nav: {
    home: "Home",
    browse: "Browse",
    library: "Library",
    history: "History",
    downloads: "Downloads",
    settings: "Settings",
    navigation: "Navigation",
    version: "v0.1.0 · alpha",
  },
  titlebar: {
    appName: "MANWHAWHAM",
    reader: "Reader",
  },
  home: {
    welcome: "Welcome to ManwhaWham",
    welcomeDesc: "Your personal manga & manhwa reader. Browse thousands of titles from MangaDex, build your library, and read in style.",
    startBrowsing: "Start Browsing",
    continueReading: "Continue Reading",
    continueReadingDesc: "Pick up where you left off",
    popular: "Popular",
    popularDesc: "Most followed titles",
    trending: "Trending",
    latestUpdates: "Latest Updates",
    latestUpdatesDesc: "Recently updated titles",
    fresh: "Fresh",
    chapter: "Chapter {n}",
  },
  browse: {
    searchPlaceholder: "Search manga, manhwa, manhua...",
    filters: "Filters",
    genres: "Genres",
    themes: "Themes",
    resultsFor: "Results for \"{query}\"",
    popularManga: "Popular Manga",
    titlesFound: "{n} titles found",
    noResults: "No results found",
    noResultsDesc: "No manga found matching \"{query}\". Try a different search term.",
    startSearching: "Start searching to find manga.",
  },
  library: {
    title: "Library",
    empty: "Your library is empty",
    emptyDesc: "Add manga to your library by clicking the bookmark icon on any title's detail page.",
    browseManga: "Browse Manga",
    titlesSaved: "{n} title(s) saved",
  },
  detail: {
    back: "Back",
    author: "Author:",
    artist: "Artist:",
    startReading: "Start Reading",
    noChapters: "No Chapters",
    inLibrary: "In Library",
    addToLibrary: "Add to Library",
    mangadex: "MangaDex",
    chapters: "Chapters ({n})",
    ascending: "Ascending",
    descending: "Descending",
    chapter: "Ch. {n}",
    volume: "Vol. {n}",
    pages: "{n} pages",
    downloaded: "Downloaded",
    downloadChapter: "Download chapter",
  },
  reader: {
    chapter: "Chapter {n}",
    quickSettings: "Quick Settings",
    mode: "Mode",
    vertical: "Vertical",
    paged: "Paged",
    fit: "Fit",
    fitWidth: "Width",
    fitHeight: "Height",
    original: "Original",
    direction: "Direction",
    ltr: "LTR",
    rtl: "RTL",
    loadingChapter: "Loading chapter...",
    noPagesAvailable: "No pages available",
    noPagesDesc: "This chapter may require an external reader.",
    previousChapter: "Previous Chapter",
    nextChapter: "Next Chapter",
    failedToLoad: "Failed to load image",
    page: "Page {n}",
  },
  history: {
    title: "History",
    empty: "No reading history",
    emptyDesc: "Your reading history will appear here as you read chapters.",
    entries: "{n} entries",
    cancel: "Cancel",
    clearAll: "Clear All",
    clear: "Clear",
    chapterPage: "Chapter {chapter} · Page {page}/{total}",
    justNow: "Just now",
    minutesAgo: "{n}m ago",
    hoursAgo: "{n}h ago",
    daysAgo: "{n}d ago",
  },
  downloads: {
    title: "Downloads",
    empty: "No downloads yet",
    emptyDesc: "Download chapters for offline reading from any manga's detail page.",
    mangaWithDownloads: "{n} manga with downloaded chapters",
    chaptersDownloaded: "{n} chapter(s) downloaded",
    view: "View",
    chapter: "Ch. {n}",
  },
  settings: {
    title: "Settings",
    appearance: "Appearance",
    theme: "Theme",
    dark: "Dark",
    grey: "Grey",
    light: "Light",
    accentColor: "Accent Color",
    readerSection: "Reader",
    readingMode: "Reading Mode",
    verticalScroll: "Vertical Scroll",
    pagedMode: "Paged",
    imageFit: "Image Fit",
    fitWidth: "Fit Width",
    fitHeight: "Fit Height",
    originalSize: "Original Size",
    readingDirection: "Reading Direction",
    leftToRight: "Left to Right",
    rightToLeft: "Right to Left",
    performance: "Performance",
    imageQuality: "Image Quality",
    highQuality: "High Quality",
    dataSaver: "Data Saver",
    content: "Content",
    preferredLanguage: "Preferred Language",
    showNSFW: "Show NSFW Content",
    about: "About",
    aboutVersion: "ManwhaWham v0.1.0 alpha",
    aboutEcosystem: "Part of the Avosos ecosystem",
    aboutPoweredBy: "Powered by MangaDex API",
    language: "Language",
    languageDesc: "Choose the interface language",
  },
  contentLanguages: {
    english: "English",
    japanese: "Japanese",
    korean: "Korean",
    chinese: "Chinese",
    french: "French",
    german: "German",
    spanish: "Spanish",
    portugueseBr: "Portuguese (BR)",
    italian: "Italian",
    russian: "Russian",
    polish: "Polish",
  },
  common: {
    loading: "Loading…",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    back: "Back",
  },
};

const de: Translations = {
  nav: {
    home: "Startseite",
    browse: "Durchsuchen",
    library: "Bibliothek",
    history: "Verlauf",
    downloads: "Downloads",
    settings: "Einstellungen",
    navigation: "Navigation",
    version: "v0.1.0 · alpha",
  },
  titlebar: {
    appName: "MANWHAWHAM",
    reader: "Reader",
  },
  home: {
    welcome: "Willkommen bei ManwhaWham",
    welcomeDesc: "Dein persönlicher Manga- & Manhwa-Reader. Durchsuche tausende Titel von MangaDex, baue deine Bibliothek auf und lese mit Stil.",
    startBrowsing: "Durchsuchen starten",
    continueReading: "Weiterlesen",
    continueReadingDesc: "Mach dort weiter, wo du aufgehört hast",
    popular: "Beliebt",
    popularDesc: "Meistgefolgte Titel",
    trending: "Im Trend",
    latestUpdates: "Letzte Aktualisierungen",
    latestUpdatesDesc: "Kürzlich aktualisierte Titel",
    fresh: "Neu",
    chapter: "Kapitel {n}",
  },
  browse: {
    searchPlaceholder: "Manga, Manhwa, Manhua suchen...",
    filters: "Filter",
    genres: "Genres",
    themes: "Themen",
    resultsFor: "Ergebnisse für \"{query}\"",
    popularManga: "Beliebte Manga",
    titlesFound: "{n} Titel gefunden",
    noResults: "Keine Ergebnisse gefunden",
    noResultsDesc: "Keine Manga gefunden für \"{query}\". Versuche einen anderen Suchbegriff.",
    startSearching: "Beginne mit der Suche, um Manga zu finden.",
  },
  library: {
    title: "Bibliothek",
    empty: "Deine Bibliothek ist leer",
    emptyDesc: "Füge Manga zu deiner Bibliothek hinzu, indem du auf das Lesezeichen-Symbol auf der Detailseite eines Titels klickst.",
    browseManga: "Manga durchsuchen",
    titlesSaved: "{n} Titel gespeichert",
  },
  detail: {
    back: "Zurück",
    author: "Autor:",
    artist: "Künstler:",
    startReading: "Jetzt lesen",
    noChapters: "Keine Kapitel",
    inLibrary: "In Bibliothek",
    addToLibrary: "Zur Bibliothek hinzufügen",
    mangadex: "MangaDex",
    chapters: "Kapitel ({n})",
    ascending: "Aufsteigend",
    descending: "Absteigend",
    chapter: "Kap. {n}",
    volume: "Bd. {n}",
    pages: "{n} Seiten",
    downloaded: "Heruntergeladen",
    downloadChapter: "Kapitel herunterladen",
  },
  reader: {
    chapter: "Kapitel {n}",
    quickSettings: "Schnelleinstellungen",
    mode: "Modus",
    vertical: "Vertikal",
    paged: "Seitenweise",
    fit: "Anpassung",
    fitWidth: "Breite",
    fitHeight: "Höhe",
    original: "Original",
    direction: "Richtung",
    ltr: "LTR",
    rtl: "RTL",
    loadingChapter: "Kapitel wird geladen...",
    noPagesAvailable: "Keine Seiten verfügbar",
    noPagesDesc: "Dieses Kapitel benötigt möglicherweise einen externen Reader.",
    previousChapter: "Vorheriges Kapitel",
    nextChapter: "Nächstes Kapitel",
    failedToLoad: "Bild konnte nicht geladen werden",
    page: "Seite {n}",
  },
  history: {
    title: "Verlauf",
    empty: "Kein Leseverlauf",
    emptyDesc: "Dein Leseverlauf erscheint hier, wenn du Kapitel liest.",
    entries: "{n} Einträge",
    cancel: "Abbrechen",
    clearAll: "Alles löschen",
    clear: "Löschen",
    chapterPage: "Kapitel {chapter} · Seite {page}/{total}",
    justNow: "Gerade eben",
    minutesAgo: "vor {n} Min.",
    hoursAgo: "vor {n} Std.",
    daysAgo: "vor {n} T.",
  },
  downloads: {
    title: "Downloads",
    empty: "Noch keine Downloads",
    emptyDesc: "Lade Kapitel für das Offline-Lesen von der Detailseite eines Mangas herunter.",
    mangaWithDownloads: "{n} Manga mit heruntergeladenen Kapiteln",
    chaptersDownloaded: "{n} Kapitel heruntergeladen",
    view: "Anzeigen",
    chapter: "Kap. {n}",
  },
  settings: {
    title: "Einstellungen",
    appearance: "Darstellung",
    theme: "Farbschema",
    dark: "Dunkel",
    grey: "Grau",
    light: "Hell",
    accentColor: "Akzentfarbe",
    readerSection: "Reader",
    readingMode: "Lesemodus",
    verticalScroll: "Vertikales Scrollen",
    pagedMode: "Seitenweise",
    imageFit: "Bildanpassung",
    fitWidth: "An Breite anpassen",
    fitHeight: "An Höhe anpassen",
    originalSize: "Originalgröße",
    readingDirection: "Leserichtung",
    leftToRight: "Links nach Rechts",
    rightToLeft: "Rechts nach Links",
    performance: "Leistung",
    imageQuality: "Bildqualität",
    highQuality: "Hohe Qualität",
    dataSaver: "Datensparmodus",
    content: "Inhalt",
    preferredLanguage: "Bevorzugte Sprache",
    showNSFW: "NSFW-Inhalte anzeigen",
    about: "Über",
    aboutVersion: "ManwhaWham v0.1.0 alpha",
    aboutEcosystem: "Teil des Avosos-Ökosystems",
    aboutPoweredBy: "Unterstützt durch MangaDex API",
    language: "Sprache",
    languageDesc: "Wähle die Sprache der Benutzeroberfläche",
  },
  contentLanguages: {
    english: "Englisch",
    japanese: "Japanisch",
    korean: "Koreanisch",
    chinese: "Chinesisch",
    french: "Französisch",
    german: "Deutsch",
    spanish: "Spanisch",
    portugueseBr: "Portugiesisch (BR)",
    italian: "Italienisch",
    russian: "Russisch",
    polish: "Polnisch",
  },
  common: {
    loading: "Laden…",
    cancel: "Abbrechen",
    save: "Speichern",
    delete: "Löschen",
    back: "Zurück",
  },
};

const translations: Record<Language, Translations> = { en, de };

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
];
