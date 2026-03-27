"use client";

import { useState, useEffect, useCallback } from "react";

const LANG_MAP: Record<string, string> = {
  turkish: "tr-TR", german: "de-DE", arabic: "ar-SA", english: "en-US",
  "farsi-persian": "fa-IR", spanish: "es-ES", french: "fr-FR",
  japanese: "ja-JP", korean: "ko-KR", russian: "ru-RU", italian: "it-IT",
  portuguese: "pt-BR", chinese: "zh-CN", hindi: "hi-IN", polish: "pl-PL",
  dutch: "nl-NL", swedish: "sv-SE", finnish: "fi-FI", czech: "cs-CZ",
  greek: "el-GR", romanian: "ro-RO", danish: "da-DK", norwegian: "nb-NO",
  vietnamese: "vi-VN", indonesian: "id-ID", thai: "th-TH",
  ukrainian: "uk-UA", "bosnian-serbo-croatian": "bs-BA", kurdish: "ku",
  filipino: "fil-PH", dari: "fa-AF",
};

export default function PronounceButton({
  word,
  languageSlug,
  isoCode,
  className,
  iconSize = 16,
}: {
  word: string;
  languageSlug: string;
  isoCode: string | null;
  className?: string;
  iconSize?: number;
}) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback(() => {
    if (!supported || speaking) return;

    speechSynthesis.cancel();

    // Extract native script and romanization from "کس (Kos)" format
    const parenMatch = word.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    const nativeText = parenMatch ? parenMatch[1].trim() : word.trim();
    const romanText = parenMatch ? parenMatch[2].trim() : null;

    const langCode = LANG_MAP[languageSlug] || isoCode || "en-US";
    const voices = speechSynthesis.getVoices();
    const baseCode = langCode.split("-")[0];
    const match =
      voices.find((v) => v.lang === langCode) ||
      voices.find((v) => v.lang.startsWith(baseCode));

    // Use native text if voice exists, otherwise use romanization
    const textToSpeak = match ? nativeText : (romanText || nativeText);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    utterance.rate = 0.85;
    if (match) utterance.voice = match;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [word, languageSlug, isoCode, supported, speaking]);

  if (!supported) return null;

  return (
    <button
      className={`pronounce-btn ${speaking ? "speaking" : ""} ${className || ""}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); speak(); }}
      aria-label="Listen to pronunciation"
      title="Listen to pronunciation"
    >
      {speaking ? (
        <svg width={iconSize} height={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6v12" />
          <path d="M8 8v8" />
          <path d="M16 8v8" />
          <path d="M4 10v4" />
          <path d="M20 10v4" />
        </svg>
      ) : (
        <svg width={iconSize} height={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
