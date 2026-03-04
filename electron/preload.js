const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Window controls
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
  onMaximizedChange: (cb) => {
    const handler = (_event, val) => cb(val);
    ipcRenderer.on("maximized-change", handler);
    return () => ipcRenderer.removeListener("maximized-change", handler);
  },

  // Settings
  getSettings: () => ipcRenderer.invoke("settings:get"),
  setSettings: (settings) => ipcRenderer.invoke("settings:set", settings),
  patchSettings: (partial) => ipcRenderer.invoke("settings:patch", partial),

  // Library
  getLibrary: () => ipcRenderer.invoke("library:get"),
  addToLibrary: (manga) => ipcRenderer.invoke("library:add", manga),
  removeFromLibrary: (mangaId) => ipcRenderer.invoke("library:remove", mangaId),
  isInLibrary: (mangaId) => ipcRenderer.invoke("library:isInLibrary", mangaId),

  // History
  getHistory: () => ipcRenderer.invoke("history:get"),
  addToHistory: (entry) => ipcRenderer.invoke("history:add", entry),
  clearHistory: () => ipcRenderer.invoke("history:clear"),

  // MangaDex
  search: (query, options) => ipcRenderer.invoke("mangadex:search", query, options),
  getPopular: (options) => ipcRenderer.invoke("mangadex:popular", options),
  getLatest: (options) => ipcRenderer.invoke("mangadex:latest", options),
  getManga: (mangaId) => ipcRenderer.invoke("mangadex:manga", mangaId),
  getChapters: (mangaId, options) => ipcRenderer.invoke("mangadex:chapters", mangaId, options),
  getPages: (chapterId) => ipcRenderer.invoke("mangadex:pages", chapterId),
  getTags: () => ipcRenderer.invoke("mangadex:tags"),

  // Image proxy
  proxyImage: (url) => ipcRenderer.invoke("proxy:image", url),

  // Downloads
  saveChapter: (mangaId, chapterNum, pages) => ipcRenderer.invoke("downloads:save-chapter", mangaId, chapterNum, pages),
  getDownloadedChapter: (mangaId, chapterNum) => ipcRenderer.invoke("downloads:get-chapter", mangaId, chapterNum),
  listDownloads: () => ipcRenderer.invoke("downloads:list"),
  deleteChapter: (mangaId, chapterNum) => ipcRenderer.invoke("downloads:delete-chapter", mangaId, chapterNum),
  onDownloadProgress: (cb) => {
    const handler = (_event, data) => cb(data);
    ipcRenderer.on("download:progress", handler);
    return () => ipcRenderer.removeListener("download:progress", handler);
  },

  // Shell
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
});
