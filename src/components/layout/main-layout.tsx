"use client";

import { useEffect } from "react";
import { useMangaStore } from "@/stores/manga-store";
import Titlebar from "./titlebar";
import Sidebar from "./sidebar";
import HomeView from "@/components/views/home-view";
import BrowseView from "@/components/views/browse-view";
import LibraryView from "@/components/views/library-view";
import HistoryView from "@/components/views/history-view";
import DownloadsView from "@/components/views/downloads-view";
import SettingsView from "@/components/views/settings-view";
import MangaDetailView from "@/components/views/manga-detail-view";
import ReaderView from "@/components/views/reader-view";

export default function MainLayout() {
  const currentView = useMangaStore((s) => s.currentView);
  const init = useMangaStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  const isReader = currentView === "reader";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Titlebar />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {!isReader && <Sidebar />}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            background: "var(--bg-primary)",
          }}
        >
          {currentView === "home" && <HomeView />}
          {currentView === "browse" && <BrowseView />}
          {currentView === "library" && <LibraryView />}
          {currentView === "history" && <HistoryView />}
          {currentView === "downloads" && <DownloadsView />}
          {currentView === "settings" && <SettingsView />}
          {currentView === "manga-detail" && <MangaDetailView />}
          {currentView === "reader" && <ReaderView />}
        </main>
      </div>
    </div>
  );
}
