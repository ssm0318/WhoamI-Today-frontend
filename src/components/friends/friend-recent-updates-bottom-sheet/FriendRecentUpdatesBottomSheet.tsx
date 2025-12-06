import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import RecentPost from '@components/_common/recent-post/RecentPost';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Note } from '@models/post';
import { readUserAllNotes } from '@utils/apis/user';
import * as S from './FriendRecentUpdatesBottomSheet.styled';

interface Props {
  visible: boolean;
  username: string;
  closeBottomSheet: () => void;
}

function FriendRecentUpdatesBottomSheet({ visible, username, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.list' });

  const {
    targetRef,
    data: notes,
    isLoading: isNotesLoading,
    isLoadingMore: isNotesLoadingMore,
  } = useSWRInfiniteScroll<Note>({
    key: visible ? `/user/${encodeURIComponent(username)}/notes/` : '',
  });

  // BottomSheet가 열릴 때 노트 읽음 처리
  useEffect(() => {
    if (visible && username) {
      readUserAllNotes(username);
    }
  }, [visible, username]);

  // 노트 목록 평탄화
  const notesList = notes
    ? notes.flatMap((page) => page.results || []).filter((note) => note !== null)
    : [];

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet} heightMode="full">
      <S.Container>
        <Icon name="home_indicator" />
        <Layout.FlexCol w="100%" ph={16} pv={20}>
          <Typo type="title-large">{t('latest_update')}</Typo>
        </Layout.FlexCol>

        <S.ScrollableContent>
          {isNotesLoading ? (
            <Layout.FlexCol alignItems="center" justifyContent="center" pv={40}>
              <Loader />
            </Layout.FlexCol>
          ) : notesList.length === 0 ? (
            <Layout.FlexCol alignItems="center" justifyContent="center" pv={40}>
              <NoContents title={t('no_notes') || 'No notes'} bgColor="INPUT_GRAY" />
            </Layout.FlexCol>
          ) : (
            <Layout.FlexCol w="100%" gap={0}>
              {notesList.map((note, index) => (
                <React.Fragment key={note.id}>
                  {index > 0 && <Divider width={1} />}
                  <Layout.FlexCol ph={16} pv={12}>
                    <RecentPost recentPost={note} hideContent={false} />
                  </Layout.FlexCol>
                </React.Fragment>
              ))}
              <div ref={targetRef} />
              {isNotesLoadingMore && (
                <Layout.FlexCol alignItems="center" pv={20}>
                  <Loader />
                </Layout.FlexCol>
              )}
            </Layout.FlexCol>
          )}
        </S.ScrollableContent>
      </S.Container>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default FriendRecentUpdatesBottomSheet;
