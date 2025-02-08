import { VersionType } from '@models/api/user';

export enum FeatureFlagKey {
  /** 친구탭 페이지에서 친구 피드(친구들의 게시물을 최신순으로 노출)를 노출하는 플래그 */
  FRIEND_FEED = 'friendFeed',
  /** 친구탭 페이지에서 전체 친구 목록을 노출하는 플래그 */
  FRIEND_LIST = 'friendList',
}

export type FeatureFlagMap = { [feature in FeatureFlagKey]: boolean };
export type FeatureFlagMapCollection = {
  [version in VersionType]: FeatureFlagMap;
};

const DEFAULT_FLAGS = {
  [FeatureFlagKey.FRIEND_FEED]: true,
  [FeatureFlagKey.FRIEND_LIST]: false,
};

export const FEATURE_FLAG_MAP_COLLECTION: FeatureFlagMapCollection = {
  [VersionType.DEFAULT]: { ...DEFAULT_FLAGS },
  [VersionType.EXPERIMENT]: {
    ...DEFAULT_FLAGS,
    [FeatureFlagKey.FRIEND_FEED]: false,
    [FeatureFlagKey.FRIEND_LIST]: true,
  },
};
