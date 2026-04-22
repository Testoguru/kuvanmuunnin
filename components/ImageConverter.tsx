"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ImageConverterProps = {
  from: string;
  to: string;
};

function extensionFromMimeType(mimeType: string) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/heic") return "heic";
  return "img";
}

function formatNameFromMimeType(mimeType: string) {
  return extensionFromMimeType(mimeType).toUpperCase();
}

export function ImageConverter({ from, to }: ImageConverterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const acceptedTypes = useMemo(() => `${from},image/*`, [from]);
  const fromLabel = useMemo(() => formatNameFromMimeType(from), [from]);
  const toLabel = useMemo(() => formatNameFromMimeType(to), [to]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [previewUrl, downloadUrl]);

  const resetPreviousConversion = useCallback(() => {
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }, [downloadUrl, previewUrl]);

  const convertFile = useCallback(
    async (file: File) => {
      resetPreviousConversion();
      setOriginalName(file.name);
      setIsConverting(true);

      try {
        const sourceUrl = URL.createObjectURL(file);
        const image = new Image();
        image.decoding = "async";

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Kuvan lukeminen epaonnistui."));
          image.src = sourceUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Selaimesi ei tue kuvamuunnosta.");
        }

        if (to === "image/jpeg") {
          // JPEG ei tue alpha-kanavaa, joten taytetaan tausta valkoiseksi.
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(image, 0, 0);
        URL.revokeObjectURL(sourceUrl);

        const convertedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Muunnos epaonnistui."));
                return;
              }
              resolve(blob);
            },
            to,
            0.92,
          );
        });

        const nextPreviewUrl = URL.createObjectURL(convertedBlob);
        setPreviewUrl(nextPreviewUrl);
        setDownloadUrl(nextPreviewUrl);
      } catch (conversionError) {
        const message =
          conversionError instanceof Error
            ? conversionError.message
            : "Muunnos epaonnistui. Yrita toisella kuvalla.";
        setError(message);
      } finally {
        setIsConverting(false);
      }
    },
    [resetPreviousConversion, to],
  );

  const handleFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      await convertFile(file);
    },
    [convertFile],
  );

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);
      await handleFile(event.dataTransfer.files?.[0]);
    },
    [handleFile],
  );

  const downloadName = useMemo(() => {
    const baseName = originalName?.replace(/\.[^.]+$/, "") || "muunnettu-kuva";
    return `${baseName}.${extensionFromMimeType(to)}`;
  }, [originalName, to]);

  return (
    <section className="w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Muunna kuva muodosta {fromLabel} muotoon {toLabel}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Vedä kuva alueelle tai valitse tiedosto. Muunnos tapahtuu kokonaan selaimessasi.
        </p>
      </div>

      <label
        className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          className="hidden"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        <p className="text-base font-medium">Pudota kuva tahan</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">tai klikkaa ja valitse tiedosto</p>
        <button
          type="button"
          className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          onClick={(event) => {
            event.preventDefault();
            inputRef.current?.click();
          }}
        >
          Valitse kuva
        </button>
      </label>

      {isConverting && <p className="mt-4 text-sm">Muunnetaan kuvaa...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {previewUrl && (
        <div className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
            <img src={previewUrl} alt="Muunnetun kuvan esikatselu" className="h-auto max-h-[420px] w-full object-contain bg-zinc-50 dark:bg-zinc-900" />
          </div>
          <a
            href={downloadUrl ?? undefined}
            download={downloadName}
            className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Lataa kuva
          </a>
        </div>
      )}
    </section>
  );
}
