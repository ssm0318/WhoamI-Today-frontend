import * as Sentry from '@sentry/react';
import { Area } from 'react-easy-crop';
import { PixelCrop } from 'react-image-crop';
import { IMAGE_FILE_SIZE_LIMIT } from '@constants/size';
import i18n from '@i18n/index';

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export const getRadianAngle = (degreeValue: number) => {
  return (degreeValue * Math.PI) / 180;
};

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

export const readFile = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    Sentry.captureMessage('readFile', {
      level: 'info',
      extra: {
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        },
      },
    });

    // 파일 크기 확인
    if (file.size > IMAGE_FILE_SIZE_LIMIT) {
      Sentry.captureMessage('readFile file size exceeded', {
        level: 'warning',
        extra: {
          fileSize: file.size,
          fileSizeLimit: IMAGE_FILE_SIZE_LIMIT,
          fileSizeMB: file.size / 1024 / 1024,
          fileSizeLimitMB: IMAGE_FILE_SIZE_LIMIT / 1024 / 1024,
        },
      });

      reject(
        new Error(
          i18n.t('error.file_size_exceeded', {
            size: IMAGE_FILE_SIZE_LIMIT / 1024 / 1024,
          }) || '',
        ),
      );
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('error', (error) => {
      Sentry.captureException(error, {
        extra: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
      });
      reject(new Error('File reading error'));
    });

    reader.addEventListener(
      'load',
      () => {
        Sentry.captureMessage('readFile success', {
          level: 'info',
          extra: {
            resultType: typeof reader.result,
            resultLength: reader.result ? String(reader.result).length : 0,
          },
        });
        resolve(reader.result);
      },
      false,
    );

    reader.readAsDataURL(file);
  });
};

export interface CroppedImg {
  file: File;
  url: string;
}
/**
 * react-easy-crop에서 사용되는 helper
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<CroppedImg> => {
  Sentry.captureMessage('getCroppedImg', {
    level: 'info',
    extra: {
      pixelCrop,
      rotation,
      flip,
    },
  });

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    Sentry.captureMessage('getCroppedImg error', {
      level: 'error',
      extra: {
        error: 'Get context from canvas Error',
      },
    });
    throw new Error('Get context from canvas Error');
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');

  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('Get context from cropped canvas Error');
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        Sentry.captureMessage('getCroppedImg blob error', {
          level: 'error',
          extra: {
            error: 'Blob is null',
          },
        });
        return;
      }
      const result = {
        file: new File([blob], `${imageSrc}_cropped.jpg`, { type: 'image/jpeg' }),
        url: URL.createObjectURL(blob),
      };
      Sentry.captureMessage('getCroppedImg success', {
        level: 'info',
        extra: {
          fileSize: blob.size,
          fileType: blob.type,
        },
      });
      resolve(result);
    }, 'image/jpeg');
  });
};

export default getCroppedImg;

export const CROP_MIN_ZOOM = 0.1;

const TO_RADIANS = Math.PI / 180;

/**
 *
 * react-image-crop 에서 사용하는 helper
 *
 * @param image 크롭할 이미지를 src로 가지고 있는 HTMLImageElement
 * @param crop
 * @param scale
 * @param rotate
 * @returns
 */
export async function getReactImageCrop(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0,
): Promise<CroppedImg> {
  Sentry.captureMessage('getReactImageCrop', {
    level: 'info',
    extra: {
      imageNaturalWidth: image.naturalWidth,
      imageNaturalHeight: image.naturalHeight,
      crop,
      scale,
      rotate,
    },
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    Sentry.captureMessage('getReactImageCrop error', {
      level: 'error',
      extra: {
        error: 'No 2d context',
      },
    });
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = 0.5;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        Sentry.captureMessage('getReactImageCrop blob error', {
          level: 'error',
          extra: {
            error: 'Blob is null',
          },
        });
        return;
      }
      const result = {
        file: new File([blob], `cropped.jpg`, { type: 'image/jpeg' }),
        url: URL.createObjectURL(blob),
      };
      Sentry.captureMessage('getReactImageCrop success', {
        level: 'info',
        extra: {
          fileSize: blob.size,
          fileType: blob.type,
        },
      });
      resolve(result);
    }, 'image/jpeg');
  });
}
