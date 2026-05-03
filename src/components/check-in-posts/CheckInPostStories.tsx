import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import { useBoundStore } from '@stores/useBoundStore';
import { getCheckInPostStories, getUserCheckInPosts } from '@utils/apis/checkInPost';
import CheckInPostViewer from './CheckInPostViewer';
import SnippetArchiveLink from './SnippetArchiveLink';
import OwnSnippetBubble from './SnippetStoryCard/OwnSnippetBubble';
import SnippetAvatarBubble from './SnippetStoryCard/SnippetAvatarBubble';
import SnippetStoryCard from './SnippetStoryCard/SnippetStoryCard';

interface CheckInPostStoriesProps {
  /** When provided, the strip lists only this user's posts (for friend's UserPage
   *  or own profile). When omitted, the main feed strip uses `/stories/`,
   *  which returns one latest post per friend. */
  authorUserId?: number;
  authorUsername?: string;
  /** Own profile (My page): merge highlights and recent into a single
   *  "My Daily Snippets" strip, hide redundant author username, and lift the
   *  3-day cutoff so every snippet is reachable from the strip. */
  isOwnProfile?: boolean;
  showCompose?: boolean;
}

function CheckInPostStories({
  authorUserId,
  authorUsername,
  isOwnProfile = false,
  showCompose = false,
}: CheckInPostStoriesProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const navigate = useNavigate();
  const myProfile = useBoundStore((state) => state.myProfile);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const swrKey = authorUserId
    ? `/check_in/posts/by-user/${authorUserId}/`
    : '/check_in/posts/stories/';

  const { data, mutate } = useSWR(swrKey, () =>
    authorUserId ? getUserCheckInPosts(authorUserId) : getCheckInPostStories(),
  );

  const { myStory, friendStories } = useMemo(() => {
    const results = data?.results ?? [];
    if (authorUserId !== undefined) {
      if (!isOwnProfile) {
        // Other user's profile: filter to 24h only
        const expiryMs = 24 * 60 * 60 * 1000;
        const now = Date.now();
        const recent = results.filter((s) => now - new Date(s.created_at).getTime() < expiryMs);
        return { myStory: null, friendStories: recent };
      }
      return { myStory: null, friendStories: results };
    }
    const own = results.find((s) => s.author_detail.id === myProfile?.id) ?? null;
    const friends = results.filter((s) => s.author_detail.id !== myProfile?.id);
    return { myStory: own, friendStories: friends };
  }, [data, authorUserId, myProfile?.id, isOwnProfile]);

  const allStories: CheckInPostStory[] = useMemo(() => {
    if (!myStory) return friendStories;
    return [myStory, ...friendStories];
  }, [myStory, friendStories]);

  const handleClickStory = (story: CheckInPostStory) => () => {
    const idx = allStories.findIndex((s) => s.id === story.id);
    if (idx >= 0) setActiveIndex(idx);
  };
  const handleClose = () => {
    setActiveIndex(null);
    mutate();
  };

  // After a pin toggle in the viewer, revalidate so highlights/today re-bucket
  // and the viewer's neighbors stay correct. Cheaper than maintaining two
  // sources of truth.
  const handlePinChange = useCallback(() => {
    mutate();
  }, [mutate]);

  const { highlights, sortedAll, archivedCount } = useMemo(() => {
    const expiryMs = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const h = friendStories.filter((s) => s.is_pinned);
    const recent = friendStories.filter((s) => now - new Date(s.created_at).getTime() < expiryMs);
    const all = [...recent].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const expired = friendStories.filter((s) => now - new Date(s.created_at).getTime() > expiryMs);
    return {
      highlights: h,
      sortedAll: all,
      archivedCount: expired.length,
    };
  }, [friendStories]);

  // Profile mode (authorUserId provided): split into Highlights + Today,
  // and always render the today section so the pin-archive entry-point
  // stays visible even when the viewer has nothing recent.
  // Own-profile variant merges both into a single strip.
  // Feed mode: single strip, but pinned items still get the pin indicator.
  const isProfileMode = authorUserId !== undefined;

  if (!isProfileMode && !showCompose && friendStories.length === 0 && !myStory) return null;

  return (
    <>
      {isProfileMode && isOwnProfile ? (
        <Section>
          <SectionInner>
            <SectionTitleRow>
              <Typo type="label-large" color="BLACK">
                {t('my_snippets')}
              </Typo>
              <Layout.FlexRow gap={12} alignItems="center">
                <SnippetArchiveLink
                  prefix={<SvgIcon name="pin_filled" size={16} color="PRIMARY" />}
                  i18nKey="pinned_link"
                  count={highlights.length}
                  to="/check-in-posts/archive?tab=pinned"
                />
                <SnippetArchiveLink
                  prefix={<ArchiveIcon />}
                  i18nKey="all_link"
                  count={archivedCount}
                  to="/check-in-posts/archive?tab=all"
                />
              </Layout.FlexRow>
            </SectionTitleRow>
            {sortedAll.length === 0 && !showCompose ? (
              <EmptyRow>
                <Typo type="label-small" color="MEDIUM_GRAY">
                  {t('no_stories')}
                </Typo>
              </EmptyRow>
            ) : (
              <Strip>
                {showCompose && (
                  <ComposeBubble
                    onClick={() => navigate('/check-in-posts/new')}
                    aria-label={`${t('compose_line1')} ${t('compose_line2')}`}
                  >
                    <Plus>
                      <PlusIcon>+</PlusIcon>
                      <Typo type="label-small" color="PRIMARY" textAlign="center">
                        {t('compose_line2')}
                      </Typo>
                    </Plus>
                  </ComposeBubble>
                )}
                {sortedAll.map((story) => (
                  <SnippetStoryCard
                    key={story.id}
                    story={story}
                    onClick={handleClickStory(story)}
                    hideUsername
                  />
                ))}
              </Strip>
            )}
          </SectionInner>
        </Section>
      ) : isProfileMode ? (
        <Section>
          <SectionInner>
            <SectionTitleRow>
              <Typo type="label-large" color="BLACK">
                {t('my_snippets')}
              </Typo>
              <SnippetArchiveLink
                prefix={<SvgIcon name="pin_filled" size={16} color="PRIMARY" />}
                i18nKey="pinned_link"
                count={highlights.length}
                to={`/users/${authorUsername}/snippets/pinned`}
              />
            </SectionTitleRow>
            {sortedAll.length > 0 ? (
              <Strip>
                {sortedAll.map((story) => (
                  <SnippetStoryCard
                    key={story.id}
                    story={story}
                    onClick={handleClickStory(story)}
                    hideUsername
                    hidePinBadge
                  />
                ))}
              </Strip>
            ) : (
              <EmptyRow>
                <Typo type="label-small" color="MEDIUM_GRAY">
                  {t('no_stories')}
                </Typo>
              </EmptyRow>
            )}
          </SectionInner>
        </Section>
      ) : (
        <Strip>
          {myStory ? (
            <OwnSnippetBubble
              story={myStory}
              onClick={handleClickStory(myStory)}
              onAddClick={() => navigate('/check-in-posts/new')}
            />
          ) : (
            showCompose && (
              <ComposeBubble
                onClick={() => navigate('/check-in-posts/new')}
                aria-label={`${t('compose_line1')} ${t('compose_line2')}`}
              >
                <Plus>
                  <PlusIcon>+</PlusIcon>
                  <Typo type="label-small" color="PRIMARY" textAlign="center">
                    {t('compose_line2')}
                  </Typo>
                </Plus>
              </ComposeBubble>
            )
          )}
          {friendStories.map((story) => (
            <SnippetAvatarBubble key={story.id} story={story} onClick={handleClickStory(story)} />
          ))}
        </Strip>
      )}

      {activeIndex !== null && allStories[activeIndex] && (
        <CheckInPostViewer
          story={allStories[activeIndex]}
          enableMultiStory={!isProfileMode}
          onClose={handleClose}
          onPinChange={handlePinChange}
          onPrev={activeIndex > 0 ? () => setActiveIndex(activeIndex - 1) : undefined}
          onNext={
            activeIndex < allStories.length - 1 ? () => setActiveIndex(activeIndex + 1) : undefined
          }
        />
      )}
    </>
  );
}

const Section = styled.section`
  width: 100%;
  background-color: ${Colors.WHITE};
  padding: 0 8px 12px;
`;

const SectionInner = styled.div`
  background-color: ${Colors.GRAY_14};
  border-radius: 8px;
  overflow: hidden;
`;

const SectionTitleRow = styled.div`
  padding: 8px 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const EmptyRow = styled.div`
  width: 100%;
  padding: 12px 16px 16px;
`;

const Strip = styled(Layout.FlexRow)`
  width: 100%;
  gap: 12px;
  padding: 12px 16px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ComposeBubble = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 0;
  width: auto;
`;

const Plus = styled.span`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 2px dashed ${Colors.PRIMARY};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 4px 6px;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
  color: ${Colors.PRIMARY};
`;

const PlusIcon = styled.span`
  font-size: 22px;
  line-height: 24px;
  color: ${Colors.PRIMARY};
`;

function ArchiveIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ color: Colors.PRIMARY }}
    >
      <rect x="3" y="3" width="18" height="5" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <path d="M10 12h4" />
    </svg>
  );
}

export default CheckInPostStories;
