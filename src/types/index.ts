// ─── MangaDex Types ─────────────────────────────────────────────────────────

export interface MangaTag {
  id: string;
  name: string;
  group: string;
}

export interface MangaInfo {
  id: string;
  title: string;
  altTitles: string[];
  description: string;
  status: string | null;
  year: number | null;
  contentRating: string | null;
  originalLanguage: string | null;
  tags: MangaTag[];
  coverUrl: string | null;
  author: string | null;
  artist: string | null;
  lastChapter: string | null;
  lastVolume: string | null;
  demographic: string | null;
}

export interface ChapterInfo {
  id: string;
  chapter: string | null;
  volume: string | null;
  title: string | null;
  pages: number;
  publishAt: string;
  scanlationGroup: string;
  externalUrl: string | null;
}

export interface ChapterPages {
  quality: {
    data: string[];
    dataSaver: string[];
  };
  hash: string;
}

export interface SearchResult {
  results: MangaInfo[];
  total: number;
  limit: number;
  offset: number;
}

// ─── App Types ──────────────────────────────────────────────────────────────

export interface LibraryEntry extends MangaInfo {
  addedAt: number;
}

export interface HistoryEntry {
  mangaId: string;
  mangaTitle: string;
  coverUrl: string | null;
  chapterId: string;
  chapterNumber: string;
  page: number;
  totalPages: number;
  timestamp: number;
}

export interface AppSettings {
  theme: "dark" | "grey" | "light";
  accentColor: string;
  readerMode: "vertical" | "paged";
  readerFit: "width" | "height" | "original";
  readerDirection: "ltr" | "rtl";
  imageQuality: "data" | "dataSaver";
  language: string;
  uiLanguage: "en" | "de";
  showNSFW: boolean;
}

export type NavView =
  | "home"
  | "browse"
  | "library"
  | "history"
  | "downloads"
  | "settings"
  | "manga-detail"
  | "reader";

export interface DownloadProgress {
  mangaId: string;
  chapterNumber: string;
  page: number;
  total: number;
}

// ─── Electron API ───────────────────────────────────────────────────────────

export interface ElectronAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  onMaximizedChange: (cb: (val: boolean) => void) => () => void;

  getSettings: () => Promise<AppSettings>;
  setSettings: (settings: AppSettings) => Promise<boolean>;
  patchSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>;

  getLibrary: () => Promise<LibraryEntry[]>;
  addToLibrary: (manga: MangaInfo) => Promise<LibraryEntry[]>;
  removeFromLibrary: (mangaId: string) => Promise<LibraryEntry[]>;
  isInLibrary: (mangaId: string) => Promise<boolean>;

  getHistory: () => Promise<HistoryEntry[]>;
  addToHistory: (entry: HistoryEntry) => Promise<HistoryEntry[]>;
  clearHistory: () => Promise<HistoryEntry[]>;

  search: (query: string, options?: Record<string, unknown>) => Promise<SearchResult>;
  getPopular: (options?: Record<string, unknown>) => Promise<SearchResult>;
  getLatest: (options?: Record<string, unknown>) => Promise<SearchResult>;
  getManga: (mangaId: string) => Promise<MangaInfo>;
  getChapters: (mangaId: string, options?: Record<string, unknown>) => Promise<ChapterInfo[]>;
  getPages: (chapterId: string) => Promise<ChapterPages>;
  getTags: () => Promise<MangaTag[]>;

  proxyImage: (url: string) => Promise<string | null>;

  saveChapter: (mangaId: string, chapterNum: string, pages: string[]) => Promise<Array<{ page: number; success: boolean; error?: string }>>;
  getDownloadedChapter: (mangaId: string, chapterNum: string) => Promise<string[] | null>;
  listDownloads: () => Promise<Record<string, string[]>>;
  deleteChapter: (mangaId: string, chapterNum: string) => Promise<boolean>;
  onDownloadProgress: (cb: (data: DownloadProgress) => void) => () => void;

  openExternal: (url: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
