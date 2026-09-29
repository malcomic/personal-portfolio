"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useRef, useState } from "react";
import { ScreenshotPlaceholder } from "@/components/projects/ScreenshotPlaceholder";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadPathFor } from "@/lib/uploads";
import { actionButtonClasses } from "./ActionButton";
import { fieldId, TextInput } from "./fields";

type ScreenshotValue = { caption: string; image?: string };

type ImageUploadProps = {
  path: string;
  label: string;
  variant: "card" | "hero" | "gallery";
  sizes: string;
  slug: string;
  value: ScreenshotValue;
  onImageChange: (url: string | undefined) => void;
  onCaptionChange: (caption: string) => void;
  onBusyChange: (busy: boolean) => void;
  errors: { caption?: string; image?: string };
};

const allowedTypes: readonly string[] = ALLOWED_IMAGE_TYPES;
const maxMegabytes = MAX_IMAGE_BYTES / (1024 * 1024);

export function ImageUpload({
  path,
  label,
  variant,
  sizes,
  slug,
  value,
  onImageChange,
  onCaptionChange,
  onBusyChange,
  errors,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imageId = `${fieldId(path)}-image`;
  const errorId = `${imageId}-error`;
  const error = uploadError ?? errors.image;

  useEffect(() => () => abortRef.current?.abort(), []);

  async function onFile(file: File | undefined) {
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Choose a PNG, JPEG, WebP or AVIF image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError(`Images must be ${maxMegabytes}MB or smaller.`);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setUploadError(null);
    setProgress(0);
    onBusyChange(true);
    try {
      const blob = await upload(uploadPathFor(slug, file.name), file, {
        access: "public",
        handleUploadUrl: "/api/projects/upload",
        contentType: file.type,
        abortSignal: controller.signal,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      onImageChange(blob.url);
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Image upload failed", err);
        setUploadError(err instanceof Error && err.message ? err.message : "Upload failed. Try again.");
      }
    } finally {
      abortRef.current = null;
      setProgress(null);
      onBusyChange(false);
    }
  }

  const uploading = progress !== null;

  return (
    <div className="flex flex-col gap-3 rounded-[4px] border border-border p-4">
      <p className="font-mono text-[12px] text-muted">{label}</p>
      <ScreenshotPlaceholder screenshot={value} variant={variant} sizes={sizes} className="max-w-[560px]" />

      {uploading && (
        <div className="flex max-w-[560px] flex-col gap-1">
          <div
            role="progressbar"
            aria-label={`Uploading ${label.toLowerCase()}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-1.5 overflow-hidden rounded-full bg-border"
          >
            <div className="h-full bg-accent transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-mono text-[12px] text-muted">Uploading... {progress}%</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(event) => onFile(event.target.files?.[0])}
        />
        <button
          id={imageId}
          type="button"
          disabled={uploading}
          aria-describedby={error ? errorId : undefined}
          onClick={() => inputRef.current?.click()}
          className={actionButtonClasses("secondary")}
        >
          {value.image ? "Replace image" : "Upload image"}
        </button>
        {uploading && (
          <button type="button" onClick={() => abortRef.current?.abort()} className={actionButtonClasses("secondary")}>
            Cancel upload
          </button>
        )}
        {value.image && !uploading && (
          <button
            type="button"
            onClick={() => onImageChange(undefined)}
            className={actionButtonClasses("danger")}
          >
            Remove image
          </button>
        )}
      </div>
      <p className="text-[12px] text-muted">PNG, JPEG, WebP or AVIF, up to {maxMegabytes}MB.</p>
      {error && (
        <p id={errorId} role="alert" className="font-mono text-[12px] text-accent-text">
          {error}
        </p>
      )}

      <TextInput
        path={`${path}.caption`}
        label="CAPTION (ALSO THE ALT TEXT)"
        value={value.caption}
        onChange={onCaptionChange}
        error={errors.caption}
        maxLength={200}
      />
    </div>
  );
}
