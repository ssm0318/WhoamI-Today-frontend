import { readFile } from '@utils/getCroppedImg';

/**
 * 이미지 파일을 처리하고 URL 및 파일 객체를 생성합니다.
 * 앱에서 전송된 Base64 이미지만 처리합니다.
 */
export const processImageFromApp = async (
  detail: { type: string; name: string; base64?: string; uri: string },
  errorCallback: (message: string) => void,
): Promise<{ file: File; url: string } | null> => {
  const { type, name, base64 } = detail;

  try {
    // base64가 없으면 에러 처리
    if (!base64) {
      throw new Error('base64 데이터가 필요합니다');
    }

    // Base64 문자열에서 Blob 생성
    const byteString = atob(base64.split(',')[1] || base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type });
    const file = new File([blob], name, { type });
    const url = URL.createObjectURL(blob);

    return { file, url };
  } catch (error) {
    errorCallback((error as Error).message);
    return null;
  }
};

/**
 * 일반 파일 입력에서 선택된 이미지를 처리합니다.
 */
export const processImageFromInput = async (
  file: File,
  errorCallback: (message: string) => void,
): Promise<string | null> => {
  try {
    const imageDataUrl = await readFile(file);
    if (typeof imageDataUrl !== 'string') {
      throw new Error('read file error');
    }
    return imageDataUrl;
  } catch (error) {
    errorCallback((error as Error).message);
    return null;
  }
};
