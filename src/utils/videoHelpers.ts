const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const VIDEO_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

export const isVideoFile = (file: File): boolean => {
  return ALLOWED_VIDEO_TYPES.includes(file.type);
};

export const validateVideoFile = (file: File): string | null => {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return '지원하지 않는 동영상 형식입니다. MP4, MOV, WebM만 가능합니다.';
  }
  if (file.size > VIDEO_FILE_SIZE_LIMIT) {
    return `동영상 파일이 너무 큽니다. 최대 ${
      VIDEO_FILE_SIZE_LIMIT / (1024 * 1024)
    }MB까지 가능합니다.`;
  }
  return null;
};

export const processVideoFromApp = (detail: {
  type: string;
  name: string;
  base64?: string;
}): File | null => {
  const { type, name, base64 } = detail;

  if (!base64) {
    return null;
  }

  try {
    const raw = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteString = atob(raw);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type });
    return new File([blob], name, { type });
  } catch {
    return null;
  }
};
