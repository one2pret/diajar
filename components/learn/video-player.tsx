"use client";

import { useEffect, useRef, useState } from "react";

/** Event yang di-dispatch AiChatPanel saat user klik timestamp di jawaban AI. */
export const SEEK_EVENT = "diajar:seek";

export function VideoPlayer({
  youtubeVideoId,
  title,
}: {
  youtubeVideoId: string;
  title: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // origin baru diisi setelah mount — hindari hydration mismatch (window tidak
  // ada di server, jadi src server & client harus sama saat render pertama).
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    function handleSeek(event: Event) {
      const seconds = (event as CustomEvent<number>).detail;
      const win = iframeRef.current?.contentWindow;
      if (!win || typeof seconds !== "number") return;
      // YouTube IFrame API via postMessage (butuh enablejsapi=1 di src).
      win.postMessage(
        JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }),
        "*"
      );
    }

    window.addEventListener(SEEK_EVENT, handleSeek);
    return () => window.removeEventListener(SEEK_EVENT, handleSeek);
  }, []);

  const src =
    `https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1` +
    (origin ? `&origin=${encodeURIComponent(origin)}` : "");

  return (
    <div className="overflow-hidden rounded-lg bg-black shadow-md">
      <div className="relative aspect-video w-full">
        <iframe
          ref={iframeRef}
          className="absolute inset-0 h-full w-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/** Helper dipakai AiChatPanel untuk minta player seek ke detik tertentu. */
export function seekVideoTo(seconds: number) {
  window.dispatchEvent(new CustomEvent(SEEK_EVENT, { detail: seconds }));
}
