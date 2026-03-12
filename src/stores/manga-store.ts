import { create } from "zustand";
import type {
  NavView,
  MangaInfo,
  ChapterInfo,
  LibraryEntry,
  HistoryEntry,
  AppSettings,
  MangaTag,
} from "@/types";

interface ReaderState {
  mangaId: string;
  mangaTitle: string;
  coverUrl: string | null;
  chapters: ChapterInfo[];
  currentChapterIndex: number;
  pages: string[];
  currentPage: number;
  loading: boolean;
}

interface MangaStore {
  // ─── Navigation ───
  currentView: NavView;
  previousView: NavView;
  setView: (view: NavView) => void;
  goBack: () => void;

  // ─── Settings ───
  settings: AppSettings;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;

  // ─── Library ───
  library: LibraryEntry[];
  loadLibrary: () => Promise<void>;
  addToLibrary: (manga: MangaInfo) => Promise<void>;
  removeFromLibrary: (mangaId: string) => Promise<void>;
  isInLibrary: (mangaId: string) => boolean;

  // ─── History ───
  history: HistoryEntry[];
  loadHistory: () => Promise<void>;
  addToHistory: (entry: Omit<HistoryEntry, "timestamp">) => Promise<void>;
  clearHistory: () => Promise<void>;

  // ─── Browse ───
  popularManga: MangaInfo[];
  latestManga: MangaInfo[];
  searchResults: MangaInfo[];
  searchQuery: string;
  searchTotal: number;
  browseLoading: boolean;
  loadPopular: () => Promise<void>;
  loadLatest: () => Promise<void>;
  searchManga: (query: string) => Promise<void>;
  setSearchQuery: (query: string) => void;

  // ─── Manga Detail ───
  selectedManga: MangaInfo | null;
  selectedMangaChapters: ChapterInfo[];
  detailLoading: boolean;
  openMangaDetail: (manga: MangaInfo) => Promise<void>;
  openMangaById: (mangaId: string) => Promise<void>;

  // ─── Reader ───
  reader: ReaderState | null;
  openReader: (mangaId: string, mangaTitle: string, coverUrl: string | null, chapters: ChapterInfo[], chapterIndex: number) => Promise<void>;
  closeReader: () => void;
  setReaderPage: (page: number) => void;
  nextChapter: () => Promise<void>;
  prevChapter: () => Promise<void>;

  // ─── Tags ───
  allTags: MangaTag[];
  loadTags: () => Promise<void>;

  // ─── Downloads ───
  downloads: Record<string, string[]>;
  loadDownloads: () => Promise<void>;

  // ─── Init ───
  initialized: boolean;
  init: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  accentColor: "#7c5cfc",
  readerMode: "vertical",
  readerFit: "width",
  readerDirection: "ltr",
  imageQuality: "data",
  language: "en",
  uiLanguage: "en",
  showNSFW: false,
};

export const useMangaStore = create<MangaStore>((set, get) => ({
  // ─── Navigation ───
  currentView: "home",
  previousView: "home",
  setView: (view) => set({ previousView: get().currentView, currentView: view }),
  goBack: () => {
    const prev = get().previousView;
    set({ currentView: prev, previousView: "home" });
  },

  // ─── Settings ───
  settings: DEFAULT_SETTINGS,
  loadSettings: async () => {
    const api = window.electronAPI;
    if (!api) return;
    const settings = await api.getSettings();
    if (settings) {
      set({ settings: { ...DEFAULT_SETTINGS, ...settings } });
      applyTheme(settings.theme || "dark");
      if (settings.accentColor) applyAccent(settings.accentColor);
    }
  },
  updateSettings: async (partial) => {
    const api = window.electronAPI;
    if (!api) return;
    const updated = await api.patchSettings(partial);
    set({ settings: { ...DEFAULT_SETTINGS, ...updated } });
    if (partial.theme) applyTheme(partial.theme);
    if (partial.accentColor) applyAccent(partial.accentColor);
  },

  // ─── Library ───
  library: [],
  loadLibrary: async () => {
    const api = window.electronAPI;
    if (!api) return;
    const lib = await api.getLibrary();
    set({ library: lib || [] });
  },
  addToLibrary: async (manga) => {
    const api = window.electronAPI;
    if (!api) return;
    const lib = await api.addToLibrary(manga);
    set({ library: lib });
  },
  removeFromLibrary: async (mangaId) => {
    const api = window.electronAPI;
    if (!api) return;
    const lib = await api.removeFromLibrary(mangaId);
    set({ library: lib });
  },
  isInLibrary: (mangaId) => get().library.some((m) => m.id === mangaId),

  // ─── History ───
  history: [],
  loadHistory: async () => {
    const api = window.electronAPI;
    if (!api) return;
    const h = await api.getHistory();
    set({ history: h || [] });
  },
  addToHistory: async (entry) => {
    const api = window.electronAPI;
    if (!api) return;
    const h = await api.addToHistory({ ...entry, timestamp: Date.now() });
    set({ history: h });
  },
  clearHistory: async () => {
    const api = window.electronAPI;
    if (!api) return;
    await api.clearHistory();
    set({ history: [] });
  },

  // ─── Browse ───
  popularManga: [],
  latestManga: [],
  searchResults: [],
  searchQuery: "",
  searchTotal: 0,
  browseLoading: false,
  loadPopular: async () => {
    const api = window.electronAPI;
    if (!api) return;
    set({ browseLoading: true });
    try {
      const data = await api.getPopular({ limit: 20 });
      set({ popularManga: data.results });
    } finally {
      set({ browseLoading: false });
    }
  },
  loadLatest: async () => {
    const api = window.electronAPI;
    if (!api) return;
    try {
      const data = await api.getLatest({ limit: 20 });
      set({ latestManga: data.results });
    } catch { /* ignore */ }
  },
  searchManga: async (query) => {
    const api = window.electronAPI;
    if (!api || !query.trim()) return;
    set({ browseLoading: true, searchQuery: query });
    try {
      const data = await api.search(query, { limit: 40 });
      set({ searchResults: data.results, searchTotal: data.total });
    } finally {
      set({ browseLoading: false });
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),

  // ─── Manga Detail ───
  selectedManga: null,
  selectedMangaChapters: [],
  detailLoading: false,
  openMangaDetail: async (manga) => {
    set({ selectedManga: manga, detailLoading: true, currentView: "manga-detail", previousView: get().currentView });
    const api = window.electronAPI;
    if (!api) return;
    try {
      const chapters = await api.getChapters(manga.id, { language: get().settings.language });
      set({ selectedMangaChapters: chapters, detailLoading: false });
    } catch {
      set({ detailLoading: false });
    }
  },
  openMangaById: async (mangaId) => {
    set({ detailLoading: true, currentView: "manga-detail", previousView: get().currentView });
    const api = window.electronAPI;
    if (!api) return;
    try {
      const manga = await api.getManga(mangaId);
      const chapters = await api.getChapters(mangaId, { language: get().settings.language });
      set({ selectedManga: manga, selectedMangaChapters: chapters, detailLoading: false });
    } catch {
      set({ detailLoading: false });
    }
  },

  // ─── Reader ───
  reader: null,
  openReader: async (mangaId, mangaTitle, coverUrl, chapters, chapterIndex) => {
    const api = window.electronAPI;
    if (!api) return;
    const chapter = chapters[chapterIndex];
    if (!chapter) return;
    set({
      reader: {
        mangaId,
        mangaTitle,
        coverUrl,
        chapters,
        currentChapterIndex: chapterIndex,
        pages: [],
        currentPage: 0,
        loading: true,
      },
      currentView: "reader",
      previousView: get().currentView,
    });
    try {
      const quality = get().settings.imageQuality;
      const pageData = await api.getPages(chapter.id);
      const pages = pageData.quality[quality] || pageData.quality.data || [];
      set((state) => ({
        reader: state.reader ? { ...state.reader, pages, loading: false } : null,
      }));
      // Record history
      get().addToHistory({
        mangaId,
        mangaTitle,
        coverUrl,
        chapterId: chapter.id,
        chapterNumber: chapter.chapter || "0",
        page: 0,
        totalPages: pages.length,
      });
    } catch {
      set((state) => ({
        reader: state.reader ? { ...state.reader, loading: false } : null,
      }));
    }
  },
  closeReader: () => {
    set({ reader: null });
    get().goBack();
  },
  setReaderPage: (page) =>
    set((state) => ({
      reader: state.reader ? { ...state.reader, currentPage: page } : null,
    })),
  nextChapter: async () => {
    const r = get().reader;
    if (!r) return;
    const nextIdx = r.currentChapterIndex + 1;
    if (nextIdx >= r.chapters.length) return;
    await get().openReader(r.mangaId, r.mangaTitle, r.coverUrl, r.chapters, nextIdx);
  },
  prevChapter: async () => {
    const r = get().reader;
    if (!r) return;
    const prevIdx = r.currentChapterIndex - 1;
    if (prevIdx < 0) return;
    await get().openReader(r.mangaId, r.mangaTitle, r.coverUrl, r.chapters, prevIdx);
  },

  // ─── Tags ───
  allTags: [],
  loadTags: async () => {
    const api = window.electronAPI;
    if (!api) return;
    try {
      const tags = await api.getTags();
      set({ allTags: tags });
    } catch { /* ignore */ }
  },

  // ─── Downloads ───
  downloads: {},
  loadDownloads: async () => {
    const api = window.electronAPI;
    if (!api) return;
    try {
      const dl = await api.listDownloads();
      set({ downloads: dl });
    } catch { /* ignore */ }
  },

  // ─── Init ───
  initialized: false,
  init: async () => {
    if (get().initialized) return;
    await get().loadSettings();
    await Promise.all([
      get().loadLibrary(),
      get().loadHistory(),
      get().loadTags(),
      get().loadDownloads(),
    ]);
    // Load home data
    get().loadPopular();
    get().loadLatest();
    set({ initialized: true });
  },
}));

// ─── Theme helpers ──────────────────────────────────────────────────────────

function applyTheme(theme: string) {
  const root = document.documentElement;
  root.classList.remove("theme-grey", "theme-light");
  if (theme === "grey") root.classList.add("theme-grey");
  if (theme === "light") root.classList.add("theme-light");
}

function applyAccent(color: string) {
  const root = document.documentElement;
  root.style.setProperty("--accent", color);
  root.style.setProperty("--accent-hover", lighten(color, 15));
  root.style.setProperty("--accent-muted", `${color}1f`);
  root.style.setProperty("--accent-glow", `${color}40`);
}

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * percent / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
