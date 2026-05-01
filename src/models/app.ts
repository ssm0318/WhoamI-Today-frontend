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

export interface OpenVideoGalleryData {
  key: 'OPEN_VIDEO_GALLERY';
}

export interface OpenVideoCameraData {
  key: 'OPEN_VIDEO_CAMERA';
}
export interface KeyboardHeightData {
  key: 'KEYBOARD_HEIGHT';
  height: number;
}

export interface KeyboardOpenedData {
  key: 'KEYBOARD_OPENED';
}

export interface WidgetDataUpdatedData {
  key: 'WIDGET_DATA_UPDATED';
  check_in?: {
    id: number;
    is_active: boolean;
    created_at: string;
    mood: string;
    social_battery: string | null;
    description: string;
    track_id: string;
    album_image_url: string | null;
  };
}

export interface SetAppStateData {
  key: 'SET_APP_STATE';
  value: 'active' | 'inactive' | 'background';
}

export interface AnalyticsPageViewData {
  key: 'ANALYTICS_PAGE_VIEW';
  page_name: string;
  page_path: string;
}

export interface AnalyticsSetUserData {
  key: 'ANALYTICS_SET_USER';
  user_id: number;
  user_type: string;
  user_group: string;
  current_ver: string;
  ver_changed: string;
  gender: string;
  age_range: string;
  signup_date: string;
  friend_count_tier: string;
  notification_enabled: string;
}

export interface AnalyticsTrackEventData {
  key: 'ANALYTICS_TRACK_EVENT';
  name: string;
  params?: Record<string, string | number>;
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
  | OpenVideoGalleryData
  | OpenVideoCameraData
  | FileSelectedData
  | KeyboardHeightData
  | KeyboardOpenedData
  | WidgetDataUpdatedData
  | SetAppStateData
  | AnalyticsPageViewData
  | AnalyticsSetUserData
  | AnalyticsTrackEventData;

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
  OPEN_VIDEO_GALLERY: OpenVideoGalleryData;
  OPEN_VIDEO_CAMERA: OpenVideoCameraData;
  FILE_SELECTED: FileSelectedData;
  KEYBOARD_HEIGHT: KeyboardHeightData;
  KEYBOARD_OPENED: KeyboardOpenedData;
  WIDGET_DATA_UPDATED: WidgetDataUpdatedData;
  SET_APP_STATE: SetAppStateData;
  ANALYTICS_PAGE_VIEW: AnalyticsPageViewData;
  ANALYTICS_SET_USER: AnalyticsSetUserData;
  ANALYTICS_TRACK_EVENT: AnalyticsTrackEventData;
};
