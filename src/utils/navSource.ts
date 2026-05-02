/**
 * Classifies a pathname into a stable analytics-friendly "source" label
 * used by `state.source` on cross-page navigations. Lets the destination
 * page know which surface the user came from without each call site
 * threading explicit `source` props through every parent.
 *
 * Stable label set is intentionally small. Adding a new label means
 * updating Firebase dashboards, so we resist invented variants — anything
 * that doesn't match a top-level surface falls back to 'other'.
 */
export function classifyPathnameAsSource(pathname: string): string {
  // Order matters: most-specific paths first.
  if (pathname.startsWith('/notes/')) return 'note_detail';
  if (pathname.startsWith('/responses/')) return 'response_detail';
  if (pathname.startsWith('/users/')) return 'user_profile';
  if (pathname.startsWith('/discover')) return 'discover';
  if (pathname.startsWith('/friends')) return 'friends';
  if (pathname.startsWith('/feed')) return 'feed';
  if (pathname.startsWith('/share')) return 'share';
  if (pathname.startsWith('/chats') || pathname.startsWith('/chat')) return 'chats';
  if (pathname.startsWith('/my')) return 'my_profile';
  if (pathname.startsWith('/questions')) return 'questions';
  return 'other';
}
