import { MyProfile } from '@models/api/user';
import { User } from '@models/user';

const SAMPLE_CAP = 3;

function userFromMyProfile(p: MyProfile): User {
  return {
    id: p.id,
    username: p.username,
    profile_image: p.profile_image ?? null,
    profile_pic: p.profile_pic,
    url: p.url,
    bio: p.bio,
    pronouns: p.pronouns,
    connection_status: p.connection_status,
    user_interests: p.user_interests ?? [],
    user_personas: p.user_personas ?? [],
  };
}

/** Optimistically prepend/remove the current user in `like_user_sample` when toggling like (Ver.Q footer avatars). */
export function applyLikeUserSampleOptimistic(
  previous: User[] | undefined,
  liked: boolean,
  myProfile: MyProfile | null | undefined,
): User[] {
  if (!myProfile?.username) {
    return [...(previous ?? [])];
  }

  const uname = myProfile.username;

  if (!liked) {
    return (previous ?? []).filter((u) => u.username !== uname);
  }

  const list = [...(previous ?? [])];
  if (list.some((u) => u.username === uname)) {
    return list;
  }

  return [userFromMyProfile(myProfile), ...list].slice(0, SAMPLE_CAP);
}
