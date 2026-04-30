import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import CheckInPostItem from '@components/check-in-posts/CheckInPostItem/CheckInPostItem';
import CheckInPostViewer from '@components/check-in-posts/CheckInPostViewer';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getUserCheckInPosts } from '@utils/apis/checkInPost';
import { MainScrollContainer } from '../Root';

type Tab = 'all' | 'pinned';

/**
 * Viewer's own Daily Snippet archive — `/check-in-posts/archive?tab=all|pinned`.
 *
 * Backend `UserCheckInPosts` returns every snippet the viewer has authored
 * (regardless of 24h expiry) when target == viewer, so the All tab needs no
 * extra filtering and Pinned is a client-side `is_pinned` filter.
 *
 * Vertical post-card list (CheckInPostItem). Tapping a card opens
 * `CheckInPostViewer` so pin toggling works in-place.
 */
function MySnippetsArchive() {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post.archive' });
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = (searchParams.get('tab') as Tab) ?? 'all';
  const tab: Tab = tabParam === 'pinned' ? 'pinned' : 'all';

  const { myProfile } = useBoundStore(useShallow(UserSelector));

  const [snippets, setSnippets] = useState<CheckInPostStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!myProfile?.id) return;
    let cancelled = false;
    getUserCheckInPosts(myProfile.id)
      .then((data) => {
        if (!cancelled) setSnippets(data.results ?? []);
      })
      .catch(() => {
        if (!cancelled) setSnippets([]);
      });
    return () => {
      cancelled = true;
    };
  }, [myProfile?.id]);

  const visible = useMemo(
    () => (tab === 'pinned' ? snippets.filter((s) => s.is_pinned) : snippets),
    [snippets, tab],
  );

  const handleClickCell = (story: CheckInPostStory) => () => {
    const idx = visible.findIndex((s) => s.id === story.id);
    if (idx >= 0) setActiveIndex(idx);
  };

  const handlePinChange = () => {
    // Re-fetch so pin toggles inside the viewer re-bucket the grid.
    if (!myProfile?.id) return;
    getUserCheckInPosts(myProfile.id)
      .then((data) => setSnippets(data.results ?? []))
      .catch(() => undefined);
  };

  const setTab = (next: Tab) => {
    setSearchParams({ tab: next }, { replace: true });
  };

  return (
    <MainScrollContainer>
      <SubHeader title={t('title') || 'Daily Snippets'} />
      <Layout.FlexCol w="100%" pv={12} ph={16} gap={12}>
        <Layout.FlexRow w="100%" justifyContent="flex-end">
          <Layout.FlexRow
            gap={6}
            alignItems="center"
            style={{ cursor: 'pointer' }}
            onClick={() => setTab(tab === 'pinned' ? 'all' : 'pinned')}
          >
            <CheckboxIcon checked={tab === 'pinned'} />
            <SvgIcon name="pin_filled" size={18} color={tab === 'pinned' ? 'PRIMARY' : 'BLACK'} />
            <Typo type="label-medium" color="BLACK">
              {t('tab_pinned')}
            </Typo>
          </Layout.FlexRow>
        </Layout.FlexRow>

        {visible.length === 0 ? (
          <EmptyState>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              {tab === 'pinned' ? t('empty_pinned') : t('empty_all')}
            </Typo>
          </EmptyState>
        ) : (
          <Layout.FlexCol w="100%" gap={12}>
            {visible.map((story) => (
              <CheckInPostItem
                key={story.id}
                post={story}
                onClick={handleClickCell(story)}
                isMyPage
              />
            ))}
          </Layout.FlexCol>
        )}
      </Layout.FlexCol>

      {activeIndex !== null && visible[activeIndex] && (
        <CheckInPostViewer
          story={visible[activeIndex]}
          onClose={() => setActiveIndex(null)}
          onPinChange={handlePinChange}
          onPrev={activeIndex > 0 ? () => setActiveIndex(activeIndex - 1) : undefined}
          onNext={
            activeIndex < visible.length - 1 ? () => setActiveIndex(activeIndex + 1) : undefined
          }
        />
      )}
    </MainScrollContainer>
  );
}

const EmptyState = styled.div`
  width: 100%;
  padding: 48px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function CheckboxIcon({ checked }: { checked: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        rx="3"
        stroke={checked ? '#8700FF' : '#D9D9D9'}
        strokeWidth="1.5"
        fill={checked ? '#8700FF' : 'none'}
      />
      {checked && (
        <path
          d="M5 9L8 12L13 6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default MySnippetsArchive;
