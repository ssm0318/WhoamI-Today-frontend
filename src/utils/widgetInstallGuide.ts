import { MyProfile, VersionType } from '@models/api/user';

const seenKey = (userId: number) => `wait_widget_guide_seen_v_${userId}`;
const lastVerKey = (userId: number) => `wait_widget_guide_last_ver_${userId}`;

export const shouldShowWidgetGuide = (profile?: MyProfile) => {
  if (!profile) return false;
  if (profile.current_ver !== VersionType.VER_W) return false;
  return localStorage.getItem(seenKey(profile.id)) !== VersionType.VER_W;
};

export const shouldShowWidgetGuideOnVersionChange = (profile?: MyProfile) => {
  if (!profile) return false;
  if (profile.current_ver !== VersionType.VER_W) return false;
  const last = localStorage.getItem(lastVerKey(profile.id));
  return last !== null && last !== VersionType.VER_W;
};

export const recordCurrentVersion = (profile?: MyProfile) => {
  if (!profile) return;
  localStorage.setItem(lastVerKey(profile.id), profile.current_ver);
};

export const markWidgetGuideSeen = (profile?: MyProfile) => {
  if (!profile) return;
  localStorage.setItem(seenKey(profile.id), profile.current_ver);
  localStorage.setItem(lastVerKey(profile.id), profile.current_ver);
};
