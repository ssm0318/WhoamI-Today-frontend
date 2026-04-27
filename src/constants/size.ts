import { SCREEN_WIDTH } from './layout';

/** 노트 이미지 노출 사이즈(임의 설정으로 수정 가능) */
export const NOTE_IMAGE_CROP_WIDTH = 320;
/** 노트 이미지 노출 사이즈(임의 설정으로 수정 가능) */
export const NOTE_IMAGE_CROP_HEIGHT = NOTE_IMAGE_CROP_WIDTH;

export const NOTE_IMAGE_RATIO = NOTE_IMAGE_CROP_HEIGHT / NOTE_IMAGE_CROP_WIDTH;

/** 노트 아이템에서 이미지 사이즈, 노트 작성/수정 모드에서와 패딩값이 다름 */
export const NOTE_IMAGE_DISPLAY_WIDTH = SCREEN_WIDTH - 12 * 4;
export const NOTE_IMAGE_DISPLAY_HEIGHT = NOTE_IMAGE_DISPLAY_WIDTH * NOTE_IMAGE_RATIO;

/** 노트 작성/수정 모드에서의 이미지 사이즈 */
export const NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE = SCREEN_WIDTH - 12 * 2;
export const NOTE_IMAGE_DISPLAY_HEIGHT_EDIT_MODE =
  NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE * NOTE_IMAGE_RATIO;

/** 이미지 파일 사이즈 제한 (노트, 프로필) */
export const IMAGE_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

/** 동영상 파일 사이즈 제한 */
export const VIDEO_FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB

/** 동영상 최대 길이 (초) */
export const VIDEO_MAX_DURATION_SECONDS = 30;

export const NOTE_IMAGE_CROP_MIN_SIZE = 100;
