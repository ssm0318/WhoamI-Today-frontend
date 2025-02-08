import { VersionType } from '@models/api/user';

export enum FeatureFlagKey {
  FRIEND_FEED = 'friendFeed',
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
