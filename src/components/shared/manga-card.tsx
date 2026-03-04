"use client";

import { useState, useEffect, useRef } from "react";
import type { MangaInfo } from "@/types";

interface MangaCardProps {
  manga: MangaInfo;
  onClick: () => void;
  style?: React.CSSProperties;
}

export default function MangaCard({ manga, onClick, style }: MangaCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    if (!manga.coverUrl || attempted.current) return;
    attempted.current = true;
    // Try direct load first, fallback to proxy
    const img = new Image();
    img.onload = () => setImgSrc(manga.coverUrl);
    img.onerror = () => {
      window.electronAPI?.proxyImage(manga.coverUrl!).then((data) => {
        if (data) setImgSrc(data);
        else setImgError(true);
      });
    };
    img.src = manga.coverUrl;
  }, [manga.coverUrl]);

  const statusColors: Record<string, string> = {
    ongoing: "var(--success)",
    completed: "var(--info)",
    hiatus: "var(--warning)",
    cancelled: "var(--error)",
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--border-strong)" : "var(--border-subtle)"}`,
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.3)" : "none",
        ...style,
      }}
    >
      {/* Cover */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingBottom: "142%",
        background: "var(--bg-tertiary)",
        overflow: "hidden",
      }}>
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={manga.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, var(--bg-tertiary), var(--bg-elevated))",
          }}>
            <span style={{ fontSize: 36, opacity: 0.3 }}>📖</span>
          </div>
        )}

        {/* Status badge */}
        {manga.status && (
          <span style={{
            position: "absolute",
            top: 8,
            left: 8,
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: 4,
            background: "rgba(0,0,0,0.7)",
            color: statusColors[manga.status] || "var(--text-secondary)",
            backdropFilter: "blur(4px)",
            letterSpacing: 0.5,
          }}>
            {manga.status}
          </span>
        )}

        {/* Rating overlay on hover */}
        {hovered && manga.contentRating && (
          <div style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 9,
            fontWeight: 600,
            padding: "2px 6px",
            borderRadius: 4,
            background: "rgba(0,0,0,0.7)",
            color: "var(--text-secondary)",
            backdropFilter: "blur(4px)",
            textTransform: "uppercase",
          }}>
            {manga.contentRating}
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
          pointerEvents: "none",
        }} />
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px" }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-primary)",
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {manga.title}
        </div>
        {manga.author && (
          <div style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {manga.author}
          </div>
        )}
      </div>
    </div>
  );
}
