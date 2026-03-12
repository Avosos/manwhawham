const { app, BrowserWindow, ipcMain, shell, session, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");

// ─── Set app user model ID for Windows taskbar ───────────────────────────────
if (process.platform === "win32") {
  app.setAppUserModelId("com.avosos.manwhawham");
}

// ─── Centralized storage under avosos ecosystem ─────────────────────────────
const dataDir = path.join(app.getPath("appData"), "avosos", "apps", "manwhawham");
fs.mkdirSync(dataDir, { recursive: true });
app.setPath("userData", dataDir);

// ─── Constants ───────────────────────────────────────────────────────────────
const IS_DEV = !app.isPackaged;
const DEV_PORT = 3200;
const DATA_DIR = app.getPath("userData");
const LIBRARY_FILE = path.join(DATA_DIR, "library.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const HISTORY_FILE = path.join(DATA_DIR, "history.json");
const DOWNLOADS_DIR = path.join(DATA_DIR, "downloads");
const MANGADEX_API = "https://api.mangadex.org";
const MANGADEX_CDN = "https://uploads.mangadex.org";

let mainWindow = null;

// ─── Ensure data dirs exist ──────────────────────────────────────────────────
function ensureDataDirs() {
  for (const dir of [DATA_DIR, DOWNLOADS_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  for (const file of [LIBRARY_FILE, HISTORY_FILE]) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf-8");
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
      theme: "dark",
      accentColor: "#7c5cfc",
      readerMode: "vertical",
      readerFit: "width",
      readerDirection: "ltr",
      imageQuality: "data",
      language: "en",
      showNSFW: false,
    }), "utf-8");
  }
}

// ─── JSON helpers ────────────────────────────────────────────────────────────
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ─── HTTP fetch helper (Node built-in) ──────────────────────────────────────
function fetchURL(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedURL = new URL(url);
    const mod = parsedURL.protocol === "https:" ? https : http;
    const reqOptions = {
      hostname: parsedURL.hostname,
      port: parsedURL.port,
      path: parsedURL.pathname + parsedURL.search,
      method: options.method || "GET",
      headers: {
        "User-Agent": "ManwhaWham/0.1.0",
        ...(options.headers || {}),
      },
    };

    const req = mod.request(reqOptions, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchURL(res.headers.location, options).then(resolve).catch(reject);
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          headers: res.headers,
          buffer: () => buffer,
          text: () => buffer.toString("utf-8"),
          json: () => JSON.parse(buffer.toString("utf-8")),
        });
      });
    });

    req.on("error", reject);
    if (options.timeout) req.setTimeout(options.timeout, () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });
}

// ─── MangaDex API helpers ───────────────────────────────────────────────────
async function mangadexFetch(endpoint, params = {}) {
  const url = new URL(`${MANGADEX_API}${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      v.forEach((val) => url.searchParams.append(`${k}[]`, val));
    } else if (v !== null && v !== undefined && typeof v === "object") {
      // Handle nested objects like order: { field: "asc" }
      for (const [subKey, subVal] of Object.entries(v)) {
        url.searchParams.set(`${k}[${subKey}]`, String(subVal));
      }
    } else if (v !== undefined && v !== null) {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetchURL(url.toString());
  if (!res.ok) throw new Error(`MangaDex API error ${res.status}: ${url.toString()}`);
  return res.json();
}

function extractMangaInfo(manga) {
  const attr = manga.attributes;
  const title = attr.title?.en || attr.title?.["ja-ro"] || Object.values(attr.title || {})[0] || "Untitled";
  const desc = attr.description?.en || Object.values(attr.description || {})[0] || "";
  const altTitles = (attr.altTitles || []).map((t) => Object.values(t)[0]).filter(Boolean);
  const tags = (attr.tags || []).map((t) => ({
    id: t.id,
    name: t.attributes?.name?.en || Object.values(t.attributes?.name || {})[0] || "",
    group: t.attributes?.group || "",
  }));
  const coverRel = (manga.relationships || []).find((r) => r.type === "cover_art");
  const coverFile = coverRel?.attributes?.fileName;
  const coverUrl = coverFile ? `${MANGADEX_CDN}/covers/${manga.id}/${coverFile}.512.jpg` : null;
  const authorRel = (manga.relationships || []).find((r) => r.type === "author");
  const artistRel = (manga.relationships || []).find((r) => r.type === "artist");

  return {
    id: manga.id,
    title,
    altTitles,
    description: desc,
    status: attr.status,
    year: attr.year,
    contentRating: attr.contentRating,
    originalLanguage: attr.originalLanguage,
    tags,
    coverUrl,
    author: authorRel?.attributes?.name || null,
    artist: artistRel?.attributes?.name || null,
    lastChapter: attr.lastChapter,
    lastVolume: attr.lastVolume,
    demographic: attr.publicationDemographic,
  };
}

// ─── Icon path helper ────────────────────────────────────────────────────────
function getIconPath() {
  if (process.platform === "win32")
    return path.join(__dirname, "../public/icon.ico");
  return path.join(__dirname, "../public/icon.png");
}

// ─── Window Creation ────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#08080d",
    show: false,
    center: true,
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.on("maximize", () => mainWindow.webContents.send("maximized-change", true));
  mainWindow.on("unmaximize", () => mainWindow.webContents.send("maximized-change", false));

  if (IS_DEV) {
    mainWindow.loadURL(`http://localhost:${DEV_PORT}`);
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "out", "index.html"));
  }
}

// ─── IPC: Window Controls ───────────────────────────────────────────────────
ipcMain.handle("window:minimize", () => mainWindow?.minimize());
ipcMain.handle("window:maximize", () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.handle("window:close", () => mainWindow?.close());
ipcMain.handle("window:isMaximized", () => mainWindow?.isMaximized() ?? false);

// ─── IPC: Settings ──────────────────────────────────────────────────────────
ipcMain.handle("settings:get", () => readJSON(SETTINGS_FILE));
ipcMain.handle("settings:set", (_, settings) => {
  writeJSON(SETTINGS_FILE, settings);
  return true;
});
ipcMain.handle("settings:patch", (_, partial) => {
  const current = readJSON(SETTINGS_FILE) || {};
  const updated = { ...current, ...partial };
  writeJSON(SETTINGS_FILE, updated);
  return updated;
});

// ─── IPC: Library ───────────────────────────────────────────────────────────
ipcMain.handle("library:get", () => readJSON(LIBRARY_FILE) || []);
ipcMain.handle("library:add", (_, manga) => {
  const lib = readJSON(LIBRARY_FILE) || [];
  if (!lib.find((m) => m.id === manga.id)) {
    lib.push({ ...manga, addedAt: Date.now() });
    writeJSON(LIBRARY_FILE, lib);
  }
  return lib;
});
ipcMain.handle("library:remove", (_, mangaId) => {
  let lib = readJSON(LIBRARY_FILE) || [];
  lib = lib.filter((m) => m.id !== mangaId);
  writeJSON(LIBRARY_FILE, lib);
  return lib;
});
ipcMain.handle("library:isInLibrary", (_, mangaId) => {
  const lib = readJSON(LIBRARY_FILE) || [];
  return lib.some((m) => m.id === mangaId);
});

// ─── IPC: Reading History ───────────────────────────────────────────────────
ipcMain.handle("history:get", () => readJSON(HISTORY_FILE) || []);
ipcMain.handle("history:add", (_, entry) => {
  let history = readJSON(HISTORY_FILE) || [];
  // Update existing or add new
  const idx = history.findIndex((h) => h.mangaId === entry.mangaId);
  const record = {
    mangaId: entry.mangaId,
    mangaTitle: entry.mangaTitle,
    coverUrl: entry.coverUrl,
    chapterId: entry.chapterId,
    chapterNumber: entry.chapterNumber,
    page: entry.page || 0,
    totalPages: entry.totalPages || 0,
    timestamp: Date.now(),
  };
  if (idx >= 0) history[idx] = record;
  else history.unshift(record);
  // Keep last 200
  history = history.slice(0, 200);
  writeJSON(HISTORY_FILE, history);
  return history;
});
ipcMain.handle("history:clear", () => {
  writeJSON(HISTORY_FILE, []);
  return [];
});

// ─── IPC: MangaDex API ─────────────────────────────────────────────────────
ipcMain.handle("mangadex:search", async (_, query, options = {}) => {
  const params = {
    title: query,
    limit: options.limit || 20,
    offset: options.offset || 0,
    includes: ["cover_art", "author", "artist"],
    contentRating: options.contentRating || ["safe", "suggestive"],
    ...(options.status ? { status: options.status } : {}),
    ...(options.includedTags ? { includedTags: options.includedTags } : {}),
    ...(options.demographic ? { publicationDemographic: options.demographic } : {}),
  };

  const data = await mangadexFetch("/manga", params);
  return {
    results: (data.data || []).map(extractMangaInfo),
    total: data.total || 0,
    limit: data.limit || 20,
    offset: data.offset || 0,
  };
});

ipcMain.handle("mangadex:popular", async (_, options = {}) => {
  const params = {
    limit: options.limit || 20,
    offset: options.offset || 0,
    includes: ["cover_art", "author", "artist"],
    order: { followedCount: "desc" },
    contentRating: ["safe", "suggestive"],
    hasAvailableChapters: "true",
  };
  const data = await mangadexFetch("/manga", params);
  return {
    results: (data.data || []).map(extractMangaInfo),
    total: data.total || 0,
  };
});

ipcMain.handle("mangadex:latest", async (_, options = {}) => {
  const params = {
    limit: options.limit || 20,
    offset: options.offset || 0,
    includes: ["cover_art", "author", "artist"],
    order: { latestUploadedChapter: "desc" },
    contentRating: ["safe", "suggestive"],
    hasAvailableChapters: "true",
  };
  const data = await mangadexFetch("/manga", params);
  return {
    results: (data.data || []).map(extractMangaInfo),
    total: data.total || 0,
  };
});

ipcMain.handle("mangadex:manga", async (_, mangaId) => {
  const data = await mangadexFetch(`/manga/${mangaId}`, {
    includes: ["cover_art", "author", "artist"],
  });
  return extractMangaInfo(data.data);
});

ipcMain.handle("mangadex:chapters", async (_, mangaId, options = {}) => {
  const lang = options.language || "en";
  const allChapters = [];
  let offset = 0;
  const limit = 100;

  // Paginate to get all chapters
  while (true) {
    const data = await mangadexFetch(`/manga/${mangaId}/feed`, {
      translatedLanguage: [lang],
      order: { chapter: "asc" },
      limit,
      offset,
      includes: ["scanlation_group"],
    });
    const chapters = (data.data || []).map((ch) => {
      const groupRel = (ch.relationships || []).find((r) => r.type === "scanlation_group");
      return {
        id: ch.id,
        chapter: ch.attributes.chapter,
        volume: ch.attributes.volume,
        title: ch.attributes.title,
        pages: ch.attributes.pages,
        publishAt: ch.attributes.publishAt,
        scanlationGroup: groupRel?.attributes?.name || "Unknown",
        externalUrl: ch.attributes.externalUrl,
      };
    });
    allChapters.push(...chapters);
    if (offset + limit >= (data.total || 0)) break;
    offset += limit;
  }

  return allChapters;
});

ipcMain.handle("mangadex:pages", async (_, chapterId) => {
  const data = await mangadexFetch(`/at-home/server/${chapterId}`);
  const baseUrl = data.baseUrl;
  const hash = data.chapter?.hash;
  const dataPages = data.chapter?.data || [];
  const dataSaverPages = data.chapter?.dataSaver || [];

  return {
    quality: {
      data: dataPages.map((f) => `${baseUrl}/data/${hash}/${f}`),
      dataSaver: dataSaverPages.map((f) => `${baseUrl}/data-saver/${hash}/${f}`),
    },
    hash,
  };
});

ipcMain.handle("mangadex:tags", async () => {
  const data = await mangadexFetch("/manga/tag");
  return (data.data || []).map((t) => ({
    id: t.id,
    name: t.attributes?.name?.en || Object.values(t.attributes?.name || {})[0] || "",
    group: t.attributes?.group || "",
  }));
});

// ─── IPC: Image Proxy ───────────────────────────────────────────────────────
ipcMain.handle("proxy:image", async (_, url) => {
  try {
    const res = await fetchURL(url, { timeout: 30000 });
    if (!res.ok) return null;
    const buf = res.buffer();
    const contentType = res.headers["content-type"] || "image/jpeg";
    return `data:${contentType};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
});

// ─── IPC: Downloads ─────────────────────────────────────────────────────────
ipcMain.handle("downloads:save-chapter", async (_, mangaId, chapterNumber, pages) => {
  const chapterDir = path.join(DOWNLOADS_DIR, mangaId, `chapter_${chapterNumber}`);
  if (!fs.existsSync(chapterDir)) fs.mkdirSync(chapterDir, { recursive: true });

  const results = [];
  for (let i = 0; i < pages.length; i++) {
    try {
      const res = await fetchURL(pages[i], { timeout: 60000 });
      if (res.ok) {
        const ext = pages[i].split(".").pop()?.split("?")[0] || "jpg";
        const filePath = path.join(chapterDir, `page_${String(i + 1).padStart(3, "0")}.${ext}`);
        fs.writeFileSync(filePath, res.buffer());
        results.push({ page: i + 1, success: true, path: filePath });
      } else {
        results.push({ page: i + 1, success: false, error: `HTTP ${res.status}` });
      }
    } catch (err) {
      results.push({ page: i + 1, success: false, error: err.message });
    }
    // Send progress
    mainWindow?.webContents.send("download:progress", {
      mangaId,
      chapterNumber,
      page: i + 1,
      total: pages.length,
    });
  }
  return results;
});

ipcMain.handle("downloads:get-chapter", async (_, mangaId, chapterNumber) => {
  const chapterDir = path.join(DOWNLOADS_DIR, mangaId, `chapter_${chapterNumber}`);
  if (!fs.existsSync(chapterDir)) return null;
  const files = fs.readdirSync(chapterDir)
    .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
    .sort();
  return files.map((f) => {
    const buf = fs.readFileSync(path.join(chapterDir, f));
    const ext = f.split(".").pop().toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  });
});

ipcMain.handle("downloads:list", async () => {
  if (!fs.existsSync(DOWNLOADS_DIR)) return {};
  const mangaIds = fs.readdirSync(DOWNLOADS_DIR).filter((f) =>
    fs.statSync(path.join(DOWNLOADS_DIR, f)).isDirectory()
  );
  const result = {};
  for (const mangaId of mangaIds) {
    const mangaDir = path.join(DOWNLOADS_DIR, mangaId);
    const chapters = fs.readdirSync(mangaDir)
      .filter((f) => f.startsWith("chapter_") && fs.statSync(path.join(mangaDir, f)).isDirectory())
      .map((f) => f.replace("chapter_", ""));
    result[mangaId] = chapters;
  }
  return result;
});

ipcMain.handle("downloads:delete-chapter", async (_, mangaId, chapterNumber) => {
  const chapterDir = path.join(DOWNLOADS_DIR, mangaId, `chapter_${chapterNumber}`);
  if (fs.existsSync(chapterDir)) fs.rmSync(chapterDir, { recursive: true, force: true });
  return true;
});

// ─── IPC: Shell ─────────────────────────────────────────────────────────────
ipcMain.handle("shell:openExternal", (_, url) => shell.openExternal(url));

// ─── App Lifecycle ──────────────────────────────────────────────────────────
app.whenReady().then(() => {
  ensureDataDirs();

  // Allow loading images from MangaDex CDN
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; " +
          "img-src 'self' data: blob: https://uploads.mangadex.org https://*.mangadex.org https://*.mangadex.network; " +
          "connect-src 'self' https://api.mangadex.org https://*.mangadex.org https://*.mangadex.network ws://localhost:*;",
        ],
      },
    });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
