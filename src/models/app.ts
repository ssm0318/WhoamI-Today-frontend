export interface SetNotiPermissionData {
  key: 'SET_NOTI_PERMISSION';
  value: boolean;
}

export interface ScreenNavigateData {
  key: 'NAVIGATE';
  screenName: string;
  params: any;
}

export interface OpenSettingData {
  key: 'OPEN_SETTING';
}

export interface SetMomentDraftData {
  key: 'SET_MOMENT_DRAFT';
  value: {
    previewPhotoUrl: string;
  };
}

export interface SetCookieData {
  key: 'SET_COOKIE';
  value: string;
}

export interface OpenBrowserData {
  key: 'OPEN_BROWSER';
  uri: string;
}

export interface LogoutData {
  key: 'LOGOUT';
}

export interface OpenGalleryData {
  key: 'OPEN_GALLERY';
}

export interface OpenCameraData {
  key: 'OPEN_CAMERA';
}

export interface FileSelectedData {
  key: 'FILE_SELECTED';
  uri: string;
  type: string;
  name: string;
  base64?: string;
}
export interface KeyboardHeightData {
  key: 'KEYBOARD_HEIGHT';
  height: number;
}

export interface KeyboardOpenedData {
  key: 'KEYBOARD_OPENED';
}

// 앱, 웹 서로 약속한 키값에 따른 메시지 타입
export type PostMessageDataType =
  | ScreenNavigateData
  | SetNotiPermissionData
  | OpenSettingData
  | SetMomentDraftData
  | SetCookieData
  | OpenBrowserData
  | LogoutData
  | OpenGalleryData
  | OpenCameraData
  | FileSelectedData
  | KeyboardHeightData
  | KeyboardOpenedData;

// 앱, 웹 서로 약속한 키값
export type PostMessageKeyType = PostMessageDataType['key'];

// Here we create a mapping of keys to types
export type PostMessageKeyToData = {
  NAVIGATE: ScreenNavigateData;
  SET_NOTI_PERMISSION: SetNotiPermissionData;
  OPEN_SETTING: OpenSettingData;
  SET_MOMENT_DRAFT: SetMomentDraftData;
  SET_COOKIE: SetCookieData;
  OPEN_BROWSER: OpenBrowserData;
  LOGOUT: LogoutData;
  OPEN_GALLERY: OpenGalleryData;
  OPEN_CAMERA: OpenCameraData;
  FILE_SELECTED: FileSelectedData;
  KEYBOARD_HEIGHT: KeyboardHeightData;
  KEYBOARD_OPENED: KeyboardOpenedData;
};
