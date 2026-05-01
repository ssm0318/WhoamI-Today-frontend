import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import CheckInPostItem from '@components/check-in-posts/CheckInPostItem/CheckInPostItem';
import CheckInPostViewer from '@components/check-in-posts/CheckInPostViewer';
import SnippetMoreModal from '@components/check-in-posts/SnippetMoreModal';
import SubHeader from '@components/sub-header/SubHeader';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPostStory, CheckInPostVisibility } from '@models/checkInPost';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import {
  deleteCheckInPost,
  getUserCheckInPosts,
  updateCheckInPostVisibility,
} from '@utils/apis/checkInPost';
import { MainScrollContainer } from '../Root';

function ArchiveIcon({ active }: { active: boolean }) {
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
      style={{ color: active ? Colors.WHITE : Colors.PRIMARY }}
    >
      <rect x="3" y="3" width="18" height="5" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <path d="M10 12h4" />
    </svg>
  );
}

function MySnippetsArchive() {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post.archive' });
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'pinned' ? 'pinned' : 'all';

  const { myProfile } = useBoundStore(useShallow(UserSelector));

  const [snippets, setSnippets] = useState<CheckInPostStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [moreSnippet, setMoreSnippet] = useState<CheckInPostStory | null>(null);

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

  const pinned = useMemo(() => snippets.filter((s) => s.is_pinned), [snippets]);
  const visible = tab === 'pinned' ? pinned : snippets;

  const setTab = (next: 'all' | 'pinned') => {
    setSearchParams({ tab: next }, { replace: true });
  };

  const handleClickCell = (story: CheckInPostStory) => () => {
    const idx = visible.findIndex((s) => s.id === story.id);
    if (idx >= 0) setActiveIndex(idx);
  };

  const refetch = () => {
    if (!myProfile?.id) return;
    getUserCheckInPosts(myProfile.id)
      .then((data) => setSnippets(data.results ?? []))
      .catch(() => undefined);
  };

  const handleDelete = async (snippet: CheckInPostStory) => {
    await deleteCheckInPost(snippet.id);
    refetch();
  };

  const handleChangeVisibility = async (snippet: CheckInPostStory, v: CheckInPostVisibility) => {
    await updateCheckInPostVisibility(snippet.id, v);
    refetch();
  };

  return (
    <MainScrollContainer>
      <SubHeader title={t('title') || 'Daily Snippets'} />
      <Layout.FlexCol w="100%" pv={12} ph={16} gap={0}>
        <Layout.FlexRow w="100%" mb={14} gap={6}>
          <SegmentButton active={tab === 'pinned'} onClick={() => setTab('pinned')}>
            <SvgIcon name="pin_filled" size={14} color={tab === 'pinned' ? 'WHITE' : 'PRIMARY'} />
            {t('tab_pinned_label')} ({pinned.length})
          </SegmentButton>
          <SegmentButton active={tab === 'all'} onClick={() => setTab('all')}>
            <ArchiveIcon active={tab === 'all'} />
            {t('tab_all')} ({snippets.length})
          </SegmentButton>
        </Layout.FlexRow>

        {tab === 'all' && (
          <Layout.FlexRow w="100%" mb={12}>
            <Typo type="body-small" color="DARK_GRAY">
              {t('archived_hint')}
            </Typo>
          </Layout.FlexRow>
        )}

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
                refresh={refetch}
                onMoreClick={() => setMoreSnippet(story)}
              />
            ))}
          </Layout.FlexCol>
        )}
      </Layout.FlexCol>

      {activeIndex !== null && visible[activeIndex] && (
        <CheckInPostViewer
          story={visible[activeIndex]}
          onClose={() => setActiveIndex(null)}
          onPinChange={refetch}
          onPrev={activeIndex > 0 ? () => setActiveIndex(activeIndex - 1) : undefined}
          onNext={
            activeIndex < visible.length - 1 ? () => setActiveIndex(activeIndex + 1) : undefined
          }
        />
      )}
      <SnippetMoreModal
        snippet={moreSnippet}
        onClose={() => setMoreSnippet(null)}
        onDelete={handleDelete}
        onChangeVisibility={handleChangeVisibility}
      />
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

interface SegmentButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function SegmentButton({ active, onClick, children }: SegmentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        borderRadius: 999,
        padding: '4px 12px',
        fontSize: 14,
        lineHeight: 1.4,
        fontWeight: active ? 600 : 500,
        border: 'none',
        background: active ? Colors.DARK : '#F5F5F5',
        color: active ? Colors.WHITE : Colors.PRIMARY,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export default MySnippetsArchive;
