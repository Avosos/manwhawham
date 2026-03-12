"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMangaStore } from "@/stores/manga-store";
import { Spinner } from "@/components/shared/ui";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { getTranslations } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export default function ReaderView() {
  const reader = useMangaStore((s) => s.reader);
  const settings = useMangaStore((s) => s.settings);
  const closeReader = useMangaStore((s) => s.closeReader);
  const nextChapter = useMangaStore((s) => s.nextChapter);
  const prevChapter = useMangaStore((s) => s.prevChapter);
  const setReaderPage = useMangaStore((s) => s.setReaderPage);
  const updateSettings = useMangaStore((s) => s.updateSettings);
  const addToHistory = useMangaStore((s) => s.addToHistory);
  const t = getTranslations(settings.uiLanguage as Language);

  const [showUI, setShowUI] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const readerMode = settings.readerMode;
  const readerFit = settings.readerFit;
  const direction = settings.readerDirection;

  const chapter = reader?.chapters[reader.currentChapterIndex];
  const pages = reader?.pages || [];
  const currentPage = reader?.currentPage || 0;

  // Auto-hide UI
  useEffect(() => {
    const resetTimer = () => {
      setShowUI(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setShowUI(false), 3000);
    };

    const handleMouseMove = () => resetTimer();
    window.addEventListener("mousemove", handleMouseMove);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showSettings) setShowSettings(false);
        else closeReader();
        return;
      }
      if (e.key === "s" || e.key === "S") {
        setShowSettings((p) => !p);
        return;
      }

      if (readerMode === "paged") {
        const isNext = direction === "ltr" ? e.key === "ArrowRight" : e.key === "ArrowLeft";
        const isPrev = direction === "ltr" ? e.key === "ArrowLeft" : e.key === "ArrowRight";
        if (isNext || e.key === "ArrowDown") goToPage(currentPage + 1);
        if (isPrev || e.key === "ArrowUp") goToPage(currentPage - 1);
      }

      if (e.key === "n" || e.key === "N") nextChapter();
      if (e.key === "p" || e.key === "P") prevChapter();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [readerMode, direction, currentPage, showSettings, closeReader, nextChapter, prevChapter]);

  // Save history on page change
  useEffect(() => {
    if (!reader || pages.length === 0) return;
    const timeout = setTimeout(() => {
      addToHistory({
        mangaId: reader.mangaId,
        mangaTitle: reader.mangaTitle,
        coverUrl: reader.coverUrl,
        chapterId: chapter?.id || "",
        chapterNumber: chapter?.chapter || "0",
        page: currentPage,
        totalPages: pages.length,
      });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [currentPage]);

  const goToPage = useCallback((page: number) => {
    if (page < 0 || page >= pages.length) return;
    setReaderPage(page);
  }, [pages.length, setReaderPage]);

  // Click navigation for paged mode
  const handlePageClick = (e: React.MouseEvent) => {
    if (readerMode !== "paged") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (direction === "ltr") {
      if (x < 0.35) goToPage(currentPage - 1);
      else if (x > 0.65) goToPage(currentPage + 1);
    } else {
      if (x < 0.35) goToPage(currentPage + 1);
      else if (x > 0.65) goToPage(currentPage - 1);
    }
  };

  // Vertical scroll progress tracking
  const handleScroll = useCallback(() => {
    if (readerMode !== "vertical" || !containerRef.current) return;
    const el = containerRef.current;
    const scrollProgress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    const estimatedPage = Math.floor(scrollProgress * (pages.length - 1));
    if (estimatedPage !== currentPage && estimatedPage >= 0) {
      setReaderPage(estimatedPage);
    }
  }, [readerMode, pages.length, currentPage, setReaderPage]);

  if (!reader) return null;

  const fitStyle: React.CSSProperties = {
    width: readerFit === "width" ? "100%" : readerFit === "height" ? "auto" : undefined,
    height: readerFit === "height" ? "100vh" : "auto",
    maxWidth: readerFit === "original" ? "none" : "100%",
    display: "block",
    margin: "0 auto",
  };

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#000",
      position: "relative",
    }}>
      {/* Top Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "10px 16px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: showUI ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: showUI ? "auto" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={closeReader} className="btn-ghost" style={{ color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
              {reader.mangaTitle}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
              {t.reader.chapter.replace("{n}", chapter?.chapter || "?")} {chapter?.title ? `— ${chapter.title}` : ""}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-ghost"
            style={{ color: showSettings ? "var(--accent)" : "#fff" }}
          >
            <Settings2 size={16} />
          </button>
          <button onClick={closeReader} className="btn-ghost" style={{ color: "#fff" }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="animate-fadeIn" style={{
          position: "absolute",
          top: 50,
          right: 16,
          zIndex: 110,
          width: 240,
          padding: 14,
          borderRadius: "var(--radius-md)",
          background: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>
            {t.reader.quickSettings}
          </div>
          <QuickSetting label={t.reader.mode}>
            <select
              value={readerMode}
              onChange={(e) => updateSettings({ readerMode: e.target.value as "vertical" | "paged" })}
              className="input"
              style={{ fontSize: 12, padding: "4px 8px" }}
            >
              <option value="vertical">{t.reader.vertical}</option>
              <option value="paged">{t.reader.paged}</option>
            </select>
          </QuickSetting>
          <QuickSetting label={t.reader.fit}>
            <select
              value={readerFit}
              onChange={(e) => updateSettings({ readerFit: e.target.value as "width" | "height" | "original" })}
              className="input"
              style={{ fontSize: 12, padding: "4px 8px" }}
            >
              <option value="width">{t.reader.fitWidth}</option>
              <option value="height">{t.reader.fitHeight}</option>
              <option value="original">{t.reader.original}</option>
            </select>
          </QuickSetting>
          <QuickSetting label={t.reader.direction}>
            <select
              value={direction}
              onChange={(e) => updateSettings({ readerDirection: e.target.value as "ltr" | "rtl" })}
              className="input"
              style={{ fontSize: 12, padding: "4px 8px" }}
            >
              <option value="ltr">{t.reader.ltr}</option>
              <option value="rtl">{t.reader.rtl}</option>
            </select>
          </QuickSetting>
        </div>
      )}

      {/* Content */}
      {reader.loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <Spinner size={36} />
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 12 }}>{t.reader.loadingChapter}</div>
          </div>
        </div>
      ) : pages.length === 0 ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <p style={{ fontSize: 14, marginBottom: 8 }}>{t.reader.noPagesAvailable}</p>
            <p style={{ fontSize: 12 }}>{t.reader.noPagesDesc}</p>
          </div>
        </div>
      ) : readerMode === "vertical" ? (
        /* Vertical Scroll Mode */
        <div
          ref={containerRef}
          onScroll={handleScroll}
          onClick={() => setShowUI(!showUI)}
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 50,
            paddingBottom: 60,
          }}
        >
          {pages.map((pageUrl, i) => (
            <ReaderImage
              key={`${chapter?.id}-${i}`}
              src={pageUrl}
              alt={`Page ${i + 1}`}
              style={fitStyle}
              onLoad={() => setLoadedImages((prev) => new Set(prev).add(i))}
            />
          ))}

          {/* Chapter navigation at bottom */}
          <div style={{
            display: "flex",
            gap: 12,
            padding: "24px 0",
          }}>
            {reader.currentChapterIndex > 0 && (
              <button className="btn-secondary" onClick={prevChapter} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
                <ChevronLeft size={14} /> {t.reader.previousChapter}
              </button>
            )}
            {reader.currentChapterIndex < reader.chapters.length - 1 && (
              <button className="btn-primary" onClick={nextChapter}>
                {t.reader.nextChapter} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Paged Mode */
        <div
          onClick={handlePageClick}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
            paddingTop: 50,
            paddingBottom: 60,
          }}
        >
          <ReaderImage
            key={`${chapter?.id}-${currentPage}`}
            src={pages[currentPage]}
            alt={t.reader.page.replace("{n}", String(currentPage + 1))}
            style={{{
              ...fitStyle,
              maxHeight: "calc(100vh - 140px)",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* Bottom Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "10px 16px",
          background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: showUI ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: showUI ? "auto" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={prevChapter}
            className="btn-ghost"
            style={{ color: "#fff", opacity: reader.currentChapterIndex > 0 ? 1 : 0.3 }}
            disabled={reader.currentChapterIndex <= 0}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Progress */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 12px" }}>
          {readerMode === "paged" && (
            <>
              <input
                type="range"
                min={0}
                max={pages.length - 1}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value))}
                style={{
                  flex: 1,
                  height: 4,
                  appearance: "none",
                  background: `linear-gradient(to right, var(--accent) ${(currentPage / (pages.length - 1)) * 100}%, rgba(255,255,255,0.2) ${(currentPage / (pages.length - 1)) * 100}%)`,
                  borderRadius: 2,
                  outline: "none",
                  cursor: "pointer",
                }}
              />
            </>
          )}
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
            {currentPage + 1} / {pages.length}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={nextChapter}
            className="btn-ghost"
            style={{ color: "#fff", opacity: reader.currentChapterIndex < reader.chapters.length - 1 ? 1 : 0.3 }}
            disabled={reader.currentChapterIndex >= reader.chapters.length - 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReaderImage({ src, alt, style, onLoad }: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [proxiedSrc, setProxiedSrc] = useState<string | null>(null);
  const failedText = useMangaStore.getState().settings.uiLanguage === "de" ? "Bild konnte nicht geladen werden" : "Failed to load image";

  useEffect(() => {
    // Reset state when src changes
    setLoaded(false);
    setError(false);
    setProxiedSrc(null);
  }, [src]);

  const handleError = () => {
    // Fallback to proxy
    if (!proxiedSrc) {
      window.electronAPI?.proxyImage(src).then((data) => {
        if (data) setProxiedSrc(data);
        else setError(true);
      });
    } else {
      setError(true);
    }
  };

  if (error) {
    return (
      <div style={{
        ...style,
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.3)",
        fontSize: 13,
      }}>
        {failedText}
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div style={{
          ...style,
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Spinner size={24} />
        </div>
      )}
      <img
        className="manga-page-img"
        src={proxiedSrc || src}
        alt={alt}
        style={{
          ...style,
          display: loaded ? "block" : "none",
        }}
        onLoad={() => { setLoaded(true); onLoad?.(); }}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </>
  );
}

function QuickSetting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    }}>
      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</span>
      {children}
    </div>
  );
}
