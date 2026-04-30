import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import { getCheckInPostStories, getUserCheckInPosts } from '@utils/apis/checkInPost';
import CheckInPostViewer from './CheckInPostViewer';
import SnippetArchiveLink from './SnippetArchiveLink';
import SnippetAvatarBubble from './SnippetStoryCard/SnippetAvatarBubble';
import SnippetStoryCard from './SnippetStoryCard/SnippetStoryCard';

interface CheckInPostStoriesProps {
  /** When provided, the strip lists only this user's posts (for friend's UserPage
   *  or own profile). When omitted, the main feed strip uses `/stories/`,
   *  which returns one latest post per friend. */
  authorUserId?: number;
  /** Own profile (My page): merge highlights and recent into a single
   *  "My Daily Snippets" strip, hide redundant author username, and lift the
   *  3-day cutoff so every snippet is reachable from the strip. */
  isOwnProfile?: boolean;
  showCompose?: boolean;
}

function CheckInPostStories({
  authorUserId,
  isOwnProfile = false,
  showCompose = false,
}: CheckInPostStoriesProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const navigate = useNavigate();

  const [stories, setStories] = useState<CheckInPostStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const fetchStories = useCallback(() => {
    let cancelled = false;
    const fetcher = authorUserId ? getUserCheckInPosts(authorUserId) : getCheckInPostStories();
    fetcher
      .then((data) => {
        if (cancelled) return;
        setStories(data.results ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setStories([]);
      });
    return () => {
      cancelled = true;
    };
  }, [authorUserId]);

  useEffect(() => {
    return fetchStories();
  }, [fetchStories]);

  const handleClickStory = (story: CheckInPostStory) => () => {
    const idx = stories.findIndex((s) => s.id === story.id);
    if (idx >= 0) setActiveIndex(idx);
  };
  const handleClose = () => setActiveIndex(null);

  // After a pin toggle in the viewer, re-fetch so highlights/today re-bucket
  // and the viewer's neighbors stay correct. Cheaper than maintaining two
  // sources of truth.
  const handlePinChange = useCallback(() => {
    fetchStories();
  }, [fetchStories]);

  const { highlights, sortedAll } = useMemo(() => {
    const h = stories.filter((s) => s.is_pinned);
    const all = [...stories].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return { highlights: h, sortedAll: all };
  }, [stories]);

  // Profile mode (authorUserId provided): split into Highlights + Today,
  // and always render the today section so the pin-archive entry-point
  // stays visible even when the viewer has nothing recent.
  // Own-profile variant merges both into a single strip.
  // Feed mode: single strip, but pinned items still get the pin indicator.
  const isProfileMode = authorUserId !== undefined;

  if (!isProfileMode && !showCompose && stories.length === 0) return null;

  return (
    <>
      {isProfileMode && isOwnProfile ? (
        <Section>
          <SectionTitleRow>
            <Typo type="label-medium" color="DARK_GRAY">
              {t('my_snippets')}
            </Typo>
            <Layout.FlexRow gap={12} alignItems="center">
              <SnippetArchiveLink
                prefix={<SvgIcon name="pin_filled" size={14} color="PRIMARY" />}
                i18nKey="pinned_link"
                count={highlights.length}
                to="/check-in-posts/archive?tab=pinned"
              />
              <SnippetArchiveLink
                i18nKey="all_link"
                count={stories.length}
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
                    <Typo type="label-small" color="DARK_GRAY">
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
        </Section>
      ) : isProfileMode ? (
        <Section>
          <SectionTitleRow>
            <Typo type="label-medium" color="DARK_GRAY">
              {t('today')}
            </Typo>
            <SnippetArchiveLink
              prefix={<SvgIcon name="pin_filled" size={14} color="PRIMARY" />}
              i18nKey="pinned_link"
              count={highlights.length}
              to="/check-in-posts/archive?tab=pinned"
            />
          </SectionTitleRow>
          {sortedAll.length === 0 ? (
            <EmptyRow>
              <Typo type="label-small" color="MEDIUM_GRAY">
                {t('no_stories')}
              </Typo>
            </EmptyRow>
          ) : (
            <Strip>
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
        </Section>
      ) : (
        <Strip>
          {showCompose && (
            <ComposeBubble
              onClick={() => navigate('/check-in-posts/new')}
              aria-label={`${t('compose_line1')} ${t('compose_line2')}`}
            >
              <Plus>
                <PlusIcon>+</PlusIcon>
                <Typo type="label-small" color="DARK_GRAY">
                  {t('compose_line2')}
                </Typo>
              </Plus>
            </ComposeBubble>
          )}
          {stories.map((story) => (
            <SnippetAvatarBubble key={story.id} story={story} onClick={handleClickStory(story)} />
          ))}
        </Strip>
      )}

      {activeIndex !== null && stories[activeIndex] && (
        <CheckInPostViewer
          story={stories[activeIndex]}
          onClose={handleClose}
          onPinChange={handlePinChange}
          onPrev={activeIndex > 0 ? () => setActiveIndex(activeIndex - 1) : undefined}
          onNext={
            activeIndex < stories.length - 1 ? () => setActiveIndex(activeIndex + 1) : undefined
          }
        />
      )}
    </>
  );
}

const Section = styled.section`
  width: 100%;
  background-color: ${Colors.WHITE};
  border-bottom: 1px solid ${Colors.LIGHT};
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
  background-color: ${Colors.WHITE};
  border-bottom: 1px solid ${Colors.LIGHT};
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
  border: 2px dashed ${Colors.MEDIUM_GRAY};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px;
  box-sizing: border-box;
  text-align: center;
  line-height: 1.15;
  color: ${Colors.DARK_GRAY};
`;

const PlusIcon = styled.span`
  font-size: 24px;
  line-height: 1;
  color: ${Colors.DARK_GRAY};
`;

export default CheckInPostStories;
