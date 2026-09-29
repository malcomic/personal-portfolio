import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/dal";
import { getBlobToken } from "@/lib/env";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/uploads";

const PATH_PATTERN = /^projects\/[a-z0-9-]+\/[A-Za-z0-9._-]+$/;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return error("Sign in to upload images.", 401);

  const token = getBlobToken();
  if (!token) return error("Image uploads are not configured: BLOB_READ_WRITE_TOKEN is missing.", 503);

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return error("Invalid request.", 400);
  }

  try {
    const result = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        if (!PATH_PATTERN.test(pathname)) throw new Error("Invalid upload path.");
        return {
          allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Upload token request failed", err);
    return error(err instanceof Error ? err.message : "Upload failed.", 400);
  }
}
