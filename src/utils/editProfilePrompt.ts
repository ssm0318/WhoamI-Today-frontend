import { MyProfile } from '@models/api/user';

const seenKey = (userId: number) => `wait_edit_profile_prompt_seen_${userId}`;

export const needsProfileSetup = (profile: MyProfile): boolean => {
  if (profile.profile_image == null) return true;
  if (profile.username_history && profile.username_history.length === 1) return true;
  return false;
};

export const shouldRedirectToEditProfile = (profile: MyProfile): boolean => {
  if (localStorage.getItem(seenKey(profile.id))) return false;
  return needsProfileSetup(profile);
};

export const markEditProfilePromptSeen = (userId: number) => {
  localStorage.setItem(seenKey(userId), '1');
};
