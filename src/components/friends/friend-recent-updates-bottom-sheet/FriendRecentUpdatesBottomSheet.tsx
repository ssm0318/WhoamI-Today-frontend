import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import RecentPost from '@components/_common/recent-post/RecentPost';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { UpdatedProfile } from '@models/api/friends';
import { Note } from '@models/post';
import { readUserAllNotes } from '@utils/apis/user';
import * as S from './FriendRecentUpdatesBottomSheet.styled';

interface Props {
  visible: boolean;
  userProfile: UpdatedProfile;
  closeBottomSheet: () => void;
}

function FriendRecentUpdatesBottomSheet({ visible, userProfile, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.list.latest_updates' });
  const { profile_image, username } = userProfile;

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
        {/* header */}
        <Layout.FlexRow w="100%" pb={18} gap={7} justifyContent="center" alignItems="center">
          <ProfileImage imageUrl={profile_image} username={username} size={32} />
          <Typo type="title-medium">{t('title', { username })}</Typo>
        </Layout.FlexRow>
        <Divider width={1} />

        <S.ScrollableContent>
          {isNotesLoading ? (
            <Layout.FlexCol w="100%" alignItems="center" justifyContent="center" pv={40}>
              <Loader />
            </Layout.FlexCol>
          ) : notesList.length === 0 ? (
            <Layout.FlexCol alignItems="center" justifyContent="center" pv={40}>
              <NoContents title={t('no_notes') || 'No notes'} bgColor="INPUT_GRAY" />
            </Layout.FlexCol>
          ) : (
            <Layout.FlexCol w="100%" gap={0}>
              {notesList.map((note) => (
                <React.Fragment key={note.id}>
                  <Layout.FlexCol ph={16} pv={12} w="100%">
                    <RecentPost recentPost={note} hideContent={false} />
                  </Layout.FlexCol>
                </React.Fragment>
              ))}
              <div ref={targetRef} />
              {isNotesLoadingMore && (
                <Layout.FlexCol w="100%" alignItems="center" pv={20}>
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
