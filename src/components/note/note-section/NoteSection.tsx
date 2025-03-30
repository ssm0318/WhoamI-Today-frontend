import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Note } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { readUserAllNotes } from '@utils/apis/user';
import NoteItem from '../note-item/NoteItem';
import NoteLoader from '../note-loader/NoteLoader';

type NoteSectionProps = {
  /** username이 있으면 username에 대한 response를, 없으면 내 response를 보여줍니다. */
  username?: string;
};

function NoteSection({ username }: NoteSectionProps) {
  const [t] = useTranslation('translation');
  const { myProfile, featureFlags } = useBoundStore(UserSelector);
  const navigate = useNavigate();

  const { user } = useContext(UserPageContext);
  const areFriends = user?.data?.are_friends === true;

  const handleClickNewNote = () => {
    return navigate('/notes/new');
  };

  const isDefault = !!featureFlags?.friendFeed;

  const {
    targetRef,
    data: notes,
    isLoading: isNotesLoading,
    isLoadingMore: isNotesLoadingMore,
    mutate: refetchNotes,
  } = useSWRInfiniteScroll<Note>({
    key: `/user/${encodeURIComponent(username || 'me')}/notes/${isDefault ? 'default' : ''}`,
  });

  const { noteId } = useParams();

  // 노트 상세 페이지에서의 변경사항 업데이트
  useEffect(() => {
    if (noteId) return;
    refetchNotes();

    if (username) {
      readUserAllNotes(username);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, username]);

  return (
    <>
      <Layout.FlexRow
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        mt={!username ? 'default' : 0}
      >
        <Typo type="title-large" color="BLACK" ml={8}>
          {t('notes.title')}
        </Typo>
      </Layout.FlexRow>
      {!username && (
        <Layout.FlexRow w="100%" pv={10} bgColor="WHITE" rounded="8px 8px 0px 0px">
          <Layout.FlexRow
            rounded={30}
            alignItems="center"
            w="100%"
            justifyContent="space-between"
            ph={20}
            pv={10}
            outline="LIGHT_GRAY"
            bgColor="LIGHT"
            onClick={handleClickNewNote}
          >
            <Layout.FlexRow alignItems="center" gap={8}>
              <SvgIcon name="add_note" size={24} />
              <Typo type="body-medium" color="DARK_GRAY">
                {t('my.whats_on_your_mind', { username: myProfile?.username })}
              </Typo>
            </Layout.FlexRow>
            <Icon name="chat_media_image" size={24} fill="DARK_GRAY" />
          </Layout.FlexRow>
        </Layout.FlexRow>
      )}

      <Layout.FlexCol w="100%" pr={12}>
        <Layout.FlexCol gap={8} mt={10} w="100%" h="100%">
          {isNotesLoading ? (
            <NoteLoader />
          ) : notes?.[0] && notes[0].count > 0 ? (
            <>
              {notes.map(({ results }) =>
                results?.map((note) => (
                  <NoteItem key={note.id} note={note} isMyPage={!username} refresh={refetchNotes} />
                )),
              )}
              <div ref={targetRef} />
              {isNotesLoadingMore && (
                <Layout.FlexRow w="100%" h={40}>
                  <Loader />
                </Layout.FlexRow>
              )}
            </>
          ) : (
            <Layout.FlexRow alignItems="center" w="100%" h="100%">
              <NoContents
                text={areFriends ? t('no_contents.notes') : t('no_contents.notes_not_friend')}
                pv={20}
              />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </>
  );
}

export default NoteSection;
