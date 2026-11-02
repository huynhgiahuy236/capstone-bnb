export const MAX_IMAGE_SIZE_BYTES = 1024 * 1024;

const CDN_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
];

export const getCdnFallbackImage = (index = 0) => {
  return CDN_FALLBACK_IMAGES[index % CDN_FALLBACK_IMAGES.length];
};

export const getImageValidationMessage = (file: File) => {
  if (!file.type.startsWith("image/")) {
    return "Vui lòng chọn đúng định dạng hình ảnh.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Hình ảnh phải có dung lượng dưới 1MB.";
  }
  return null;
};

export const getOptionalImageSource = (value?: string | null) => {
  const source = value?.trim();
  if (!source) return null;

  if (source.startsWith("http://")) {
    return source.replace(/^http:\/\//, "https://");
  }

  if (source.startsWith("https://") || source.startsWith("data:")) {
    return source;
  }

  const fallbackApiUrl = "https://capstone-backend-airbnb.vercel.app/api";
  let apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  const isHttpUrl = (val?: string | null): boolean => {
    if (!val || typeof val !== "string") return false;
    try {
      const parsed = new URL(val);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!apiUrl || !isHttpUrl(apiUrl)) {
    apiUrl = fallbackApiUrl;
  }

  const isVercelServer = Boolean(process.env.VERCEL);
  const isVercelBrowser =
    typeof window !== "undefined" &&
    !window.location.hostname.includes("localhost");

  if ((isVercelServer || isVercelBrowser) && apiUrl.includes("localhost")) {
    apiUrl = fallbackApiUrl;
  }

  const cleanApiUrl = apiUrl.replace(/\/api\/?$/, "");
  if (!cleanApiUrl) return null;

  if (source.startsWith("/")) {
    return `${cleanApiUrl}${source}`;
  }

  return `${cleanApiUrl}/images/${encodeURIComponent(source)}`;
};

export const getImageSource = (value?: string | null, fallbackIndex = 0) =>
  getOptionalImageSource(value) ?? getCdnFallbackImage(fallbackIndex);
