import { VersionType } from '@models/api/user';

/** Ver.Q 프로필 노트/올포스트 목록은 `/api/q/user/` 아래에서 Q 시리얼라이저를 씁니다. */
export function userListApiPrefix(postsVerQ?: boolean): string {
  return postsVerQ ? 'q/' : '';
}

/**
 * Ver.Q 게시글 UI와 `/api/q/user/` 목록 URL: `featureFlags.postsVerQ`만 보면 첫 페인트에서 비어 있을 수 있어
 * `myProfile.current_ver`으로도 판별합니다.
 */
export function isPostsVerQClient(
  postsVerQFlag: boolean | undefined,
  currentVer: VersionType | string | undefined | null,
): boolean {
  return !!postsVerQFlag || currentVer === VersionType.VER_Q || currentVer === 'version_q';
}

export function userListApiPrefixForViewer(
  postsVerQ: boolean | undefined,
  currentVer: VersionType | string | undefined | null,
): string {
  return isPostsVerQClient(postsVerQ, currentVer) ? 'q/' : '';
}
