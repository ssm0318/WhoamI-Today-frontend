export interface SetTokenData {
  key: 'SET_TOKEN';
  access: string;
  refresh: string;
}

export interface ScreenNavigateData {
  key: 'NAVIGATE';
  screenName: string;
  params: any;
}

// 앱, 웹 서로 약속한 키값에 따른 메시지 타입
export type PostMessageDataType = SetTokenData | ScreenNavigateData;
// 앱, 웹 서로 약속한 키값
export type PostMessageKeyType = PostMessageDataType['key'];

// Here we create a mapping of keys to types
export type PostMessageKeyToData = {
  SET_TOKEN: SetTokenData;
  NAVIGATE: ScreenNavigateData;
};
