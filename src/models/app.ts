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

export interface SetTokenData {
  key: 'SET_TOKEN';
  value: {
    accessToken: string;
    csrfToken: string;
  };
}

// 앱, 웹 서로 약속한 키값에 따른 메시지 타입
export type PostMessageDataType =
  | ScreenNavigateData
  | SetNotiPermissionData
  | OpenSettingData
  | SetTokenData;

// 앱, 웹 서로 약속한 키값
export type PostMessageKeyType = PostMessageDataType['key'];

// Here we create a mapping of keys to types
export type PostMessageKeyToData = {
  NAVIGATE: ScreenNavigateData;
  SET_NOTI_PERMISSION: SetNotiPermissionData;
  OPEN_SETTING: OpenSettingData;
  SET_TOKEN: SetTokenData;
};
