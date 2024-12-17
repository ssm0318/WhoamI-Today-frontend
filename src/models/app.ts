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

export interface CameraPermissionData {
  key: 'CAMERA_PERMISSION';
}

export interface CameraPermissionResultData {
  key: 'CAMERA_PERMISSION_RESULT';
  value: boolean;
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
  | CameraPermissionData
  | CameraPermissionResultData;

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
  CAMERA_PERMISSION: CameraPermissionData;
  CAMERA_PERMISSION_RESULT: CameraPermissionResultData;
};
