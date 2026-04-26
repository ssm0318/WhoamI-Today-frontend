import { MyProfile, VersionType } from '@models/api/user';

const key = (userId: number) => `wait_widget_guide_seen_v_${userId}`;

export const shouldShowWidgetGuide = (profile?: MyProfile) => {
  if (!profile) return false;
  if (profile.current_ver !== VersionType.VER_W) return false;
  return localStorage.getItem(key(profile.id)) !== VersionType.VER_W;
};

export const markWidgetGuideSeen = (profile?: MyProfile) => {
  if (!profile) return;
  localStorage.setItem(key(profile.id), profile.current_ver);
};
