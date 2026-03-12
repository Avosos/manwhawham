"use client";

import { useState, useCallback, useRef } from "react";
import { Search, X, Filter } from "lucide-react";
import { useMangaStore } from "@/stores/manga-store";
import MangaCard from "@/components/shared/manga-card";
import { MangaGrid, LoadingGrid, EmptyState } from "@/components/shared/ui";
import { getTranslations } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export default function BrowseView() {
  const searchResults = useMangaStore((s) => s.searchResults);
  const searchQuery = useMangaStore((s) => s.searchQuery);
  const searchTotal = useMangaStore((s) => s.searchTotal);
  const browseLoading = useMangaStore((s) => s.browseLoading);
  const popularManga = useMangaStore((s) => s.popularManga);
  const searchManga = useMangaStore((s) => s.searchManga);
  const setSearchQuery = useMangaStore((s) => s.setSearchQuery);
  const openMangaDetail = useMangaStore((s) => s.openMangaDetail);
  const allTags = useMangaStore((s) => s.allTags);
  const settings = useMangaStore((s) => s.settings);
  const t = getTranslations(settings.uiLanguage as Language);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    (query: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (query.trim()) searchManga(query.trim());
      }, 400);
    },
    [searchManga]
  );

  const handleInput = (value: string) => {
    setLocalQuery(value);
    setSearchQuery(value);
    doSearch(value);
  };

  const clearSearch = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const displayManga = localQuery.trim() ? searchResults : popularManga;
  const genreTags = allTags.filter((tag) => tag.group === "genre");
  const themeTags = allTags.filter((tag) => tag.group === "theme");

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Search Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: "var(--bg-tertiary)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-default)",
            padding: "0 14px",
            transition: "border-color 0.15s",
          }}>
            <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t.browse.searchPlaceholder}
              value={localQuery}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && localQuery.trim() && searchManga(localQuery.trim())}
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 14,
              }}
            />
            {localQuery && (
              <button onClick={clearSearch} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: showFilters ? "var(--accent-muted)" : undefined,
              color: showFilters ? "var(--accent-hover)" : undefined,
              borderColor: showFilters ? "var(--accent)" : undefined,
            }}
          >
            <Filter size={14} />
            {t.browse.filters}
            {selectedTags.length > 0 && (
              <span className="badge" style={{ marginLeft: 4 }}>{selectedTags.length}</span>
            )}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="animate-fadeIn" style={{
            marginTop: 12,
            padding: 16,
            background: "var(--bg-card)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}>
            {genreTags.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                  {t.browse.genres}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {genreTags.map((tag) => (
                    <TagChip
                      key={tag.id}
                      label={tag.name}
                      selected={selectedTags.includes(tag.id)}
                      onClick={() => toggleTag(tag.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            {themeTags.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                  {t.browse.themes}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {themeTags.slice(0, 30).map((tag) => (
                    <TagChip
                      key={tag.id}
                      label={tag.name}
                      selected={selectedTags.includes(tag.id)}
                      onClick={() => toggleTag(tag.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
          {localQuery.trim() ? t.browse.resultsFor.replace("{query}", localQuery) : t.browse.popularManga}
        </h2>
        {localQuery.trim() && searchTotal > 0 && (
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {t.browse.titlesFound.replace("{n}", String(searchTotal))}
          </p>
        )}
      </div>

      {/* Results */}
      {browseLoading ? (
        <LoadingGrid count={20} />
      ) : displayManga.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={t.browse.noResults}
          description={localQuery.trim() ? t.browse.noResultsDesc.replace("{query}", localQuery) : t.browse.startSearching}
        />
        />
      ) : (
        <MangaGrid>
          {displayManga.map((manga) => (
            <MangaCard key={manga.id} manga={manga} onClick={() => openMangaDetail(manga)} />
          ))}
        </MangaGrid>
      )}
    </div>
  );
}

function TagChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        border: `1px solid ${selected ? "var(--accent)" : "var(--border-default)"}`,
        background: selected ? "var(--accent-muted)" : "transparent",
        color: selected ? "var(--accent-hover)" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.12s ease",
      }}
    >
      {label}
    </button>
  );
}
