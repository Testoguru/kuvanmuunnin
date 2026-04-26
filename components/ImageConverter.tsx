"use client";

import heic2any from "heic2any";
import { jsPDF } from "jspdf";
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
  if (mimeType === "application/pdf") return "pdf";
  return "img";
}

function formatNameFromMimeType(mimeType: string) {
  return extensionFromMimeType(mimeType).toUpperCase();
}

export function ImageConverter({ from, to }: ImageConverterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isProcessingHeic, setIsProcessingHeic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [convertedPreviewUrl, setConvertedPreviewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const acceptedTypes = useMemo(() => `${from},image/*`, [from]);
  const fromLabel = useMemo(() => formatNameFromMimeType(from), [from]);
  const toLabel = useMemo(() => formatNameFromMimeType(to), [to]);

  useEffect(() => {
    return () => {
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      if (convertedPreviewUrl) URL.revokeObjectURL(convertedPreviewUrl);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [convertedPreviewUrl, downloadUrl, originalPreviewUrl]);

  const resetPreviousConversion = useCallback(() => {
    setError(null);
    setInfoMessage(null);
    if (convertedPreviewUrl) {
      URL.revokeObjectURL(convertedPreviewUrl);
      setConvertedPreviewUrl(null);
    }
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }, [convertedPreviewUrl, downloadUrl]);

  const isHeicLike = useCallback((file: File) => {
    const mime = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    return (
      mime === "image/heic" ||
      mime === "image/heif" ||
      fileName.endsWith(".heic") ||
      fileName.endsWith(".heif")
    );
  }, []);

  const convertFile = useCallback(
    async (file: File) => {
      resetPreviousConversion();
      setOriginalName(file.name);
      setInfoMessage(null);
      setIsConverting(true);
      setIsProcessingHeic(false);

      let workingSourceUrl: string | null = null;
      try {
        const sourceUrl = URL.createObjectURL(file);
        if (originalPreviewUrl) {
          URL.revokeObjectURL(originalPreviewUrl);
        }
        setOriginalPreviewUrl(sourceUrl);

        let workingBlob: Blob = file;
        if (isHeicLike(file)) {
          setIsProcessingHeic(true);
          try {
            const heicResult = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });
            workingBlob = Array.isArray(heicResult) ? heicResult[0] : heicResult;
          } catch {
            throw new Error(
              "HEIC-kuvan kasittely ei onnistunut. Yrita toista kuvaa tai muuta tiedosto ensin JPEG-muotoon.",
            );
          } finally {
            setIsProcessingHeic(false);
          }
        }

        workingSourceUrl = URL.createObjectURL(workingBlob);
        let bitmap: ImageBitmap | null = null;
        try {
          bitmap = await createImageBitmap(workingBlob);
        } catch {
          bitmap = null;
        }

        let width = 0;
        let height = 0;
        let htmlImage: HTMLImageElement | null = null;

        if (bitmap) {
          width = bitmap.width;
          height = bitmap.height;
        } else {
          htmlImage = new Image();
          htmlImage.decoding = "async";
          await new Promise<void>((resolve, reject) => {
            if (!htmlImage) {
              reject(new Error("Kuvan lukeminen epaonnistui."));
              return;
            }
            htmlImage.onload = () => resolve();
            htmlImage.onerror = () =>
              reject(new Error("Kuvan lukeminen epaonnistui. Tarkista tiedostomuoto."));
            htmlImage.src = workingSourceUrl ?? sourceUrl;
          });
          width = htmlImage.naturalWidth;
          height = htmlImage.naturalHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Selaimesi ei tue kuvamuunnosta.");
        }

        if (to === "image/jpeg") {
          // JPEG ei tue alpha-kanavaa, joten taytetaan tausta valkoiseksi.
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (bitmap) {
          ctx.drawImage(bitmap, 0, 0);
          bitmap.close();
        } else if (htmlImage) {
          ctx.drawImage(htmlImage, 0, 0);
        } else {
          throw new Error("Kuvan piirtaminen epaonnistui.");
        }

        let convertedBlob: Blob;
        if (to === "application/pdf") {
          const orientation = canvas.width >= canvas.height ? "landscape" : "portrait";
          const pdf = new jsPDF({
            orientation,
            unit: "mm",
            format: "a4",
          });
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 10;
          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - margin * 2;
          const imageRatio = canvas.width / canvas.height;
          const maxRatio = maxWidth / maxHeight;

          let renderWidth = maxWidth;
          let renderHeight = maxHeight;

          if (imageRatio > maxRatio) {
            renderHeight = maxWidth / imageRatio;
          } else {
            renderWidth = maxHeight * imageRatio;
          }

          const x = (pageWidth - renderWidth) / 2;
          const y = (pageHeight - renderHeight) / 2;
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          pdf.addImage(dataUrl, "JPEG", x, y, renderWidth, renderHeight);
          convertedBlob = pdf.output("blob");
        } else {
          convertedBlob = await new Promise<Blob>((resolve, reject) => {
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
        }

        const nextPreviewUrl = URL.createObjectURL(convertedBlob);
        if (to === "application/pdf") {
          setConvertedPreviewUrl(null);
        } else {
          setConvertedPreviewUrl(nextPreviewUrl);
        }
        setDownloadUrl(nextPreviewUrl);
        setInfoMessage("Valmista! Voit nyt ladata muunnetun kuvan.");
      } catch (conversionError) {
        const message =
          conversionError instanceof Error
            ? conversionError.message
            : "Muunnos epaonnistui. Yrita toisella kuvalla.";
        setError(message);
      } finally {
        if (workingSourceUrl) {
          URL.revokeObjectURL(workingSourceUrl);
        }
        setIsProcessingHeic(false);
        setIsConverting(false);
      }
    },
    [isHeicLike, originalPreviewUrl, resetPreviousConversion, to],
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
    <section className="w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20 sm:p-7">
      <div className="mb-5">
        <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          Turvallinen selaimessa tehtävä muunnos
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          Muunna kuva muodosta {fromLabel} muotoon {toLabel}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Raahaa kuva tähän tai valitse tiedosto. Mitään ei lähetetä palvelimelle.
        </p>
      </div>

      <label
        className={`flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
          isDragging
            ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/20"
            : "border-zinc-300 hover:border-blue-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-blue-600 dark:hover:bg-zinc-900"
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
        <p className="text-base font-semibold">Raahaa kuva tähän</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          tai klikkaa avataksesi tiedostovalitsimen
        </p>
        <button
          type="button"
          className="mt-5 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          onClick={(event) => {
            event.preventDefault();
            inputRef.current?.click();
          }}
        >
          Valitse kuva
        </button>
      </label>

      {isProcessingHeic && (
        <p className="mt-4 text-sm font-medium text-blue-700 dark:text-blue-300">
          Kasitellaan HEIC-kuvaa...
        </p>
      )}
      {isConverting && !isProcessingHeic && (
        <p className="mt-4 text-sm font-medium text-blue-700 dark:text-blue-300">Muunnetaan...</p>
      )}
      {infoMessage && <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">{infoMessage}</p>}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {(originalPreviewUrl || convertedPreviewUrl) && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="border-b border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              Alkuperainen kuva
            </p>
            {originalPreviewUrl ? (
              <img
                src={originalPreviewUrl}
                alt="Alkuperaisen kuvan esikatselu"
                className="h-auto max-h-[420px] w-full object-contain"
              />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-zinc-500">Ei esikatselua</div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="border-b border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              Muunnettu kuva ({toLabel})
            </p>
            {to === "application/pdf" && downloadUrl ? (
              <div className="flex h-48 flex-col items-center justify-center gap-3 text-center text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <span className="text-4xl">📄</span>
                <p>PDF luotu onnistuneesti!</p>
              </div>
            ) : convertedPreviewUrl ? (
              <img
                src={convertedPreviewUrl}
                alt="Muunnetun kuvan esikatselu"
                className="h-auto max-h-[420px] w-full object-contain"
              />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
                Muunnos ilmestyy tahan
              </div>
            )}
          </div>

          {downloadUrl && (
            <div className="md:col-span-2">
              <a
                href={downloadUrl}
                download={downloadName}
                className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Lataa muunnettu kuva
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
