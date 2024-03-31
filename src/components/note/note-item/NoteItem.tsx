import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthorProfileInfo } from '@components/_common/author-profile/AuthorProfile.helper';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { friendList } from '@mock/friends';
import { Note } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import NoteImageList from '../note-image-list/NoteImageList';

interface NoteItemProps {
  note: Note;
  isMyPage: boolean;
}

function NoteItem({ note, isMyPage }: NoteItemProps) {
  const { content, created_at, id, author_detail } = note;
  const navigate = useNavigate();
  const [overflowActive, setOverflowActive] = useState<boolean>(false);
  const { username, imageUrl } = getAuthorProfileInfo(author_detail);
  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    //
  };

  const likedUserList = friendList;

  const handleClickNote = () => {
    return navigate(`/notes/${id}`);
  };

  useEffect(() => {
    if (content.length > MAX_NOTE_CONTENT_LENGTH) {
      setOverflowActive(true);
    }
  }, [content]);

  return (
    <Layout.FlexCol
      w={SCREEN_WIDTH - 12 * 2}
      p={12}
      gap={8}
      outline="LIGHT"
      rounded={12}
      onClick={handleClickNote}
    >
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        h={PROFILE_IMAGE_SIZE}
      >
        <Layout.FlexRow w="100%" alignItems="center" gap={8}>
          <ProfileImage imageUrl={imageUrl} username={username} size={PROFILE_IMAGE_SIZE} />
          {/* author, created_at 정보 */}
          <Layout.FlexRow alignItems="center" gap={8}>
            <Typo type="title-medium">{username}</Typo>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {convertTimeDiffByString(new Date(), new Date(created_at))}
            </Typo>
          </Layout.FlexRow>
        </Layout.FlexRow>
        {/* 더보기 */}
        <Layout.FlexRow>
          <Icon name="dots_menu" size={24} onClick={handleClickMore} />
        </Layout.FlexRow>
      </Layout.FlexRow>
      <Layout.FlexCol>
        <Typo type="body-large" color="BLACK">
          {overflowActive ? (
            <>
              {`${content.slice(0, MAX_NOTE_CONTENT_LENGTH)}...`}
              <Typo type="body-medium" color="BLACK" italic underline ml={3}>
                more
              </Typo>
            </>
          ) : (
            content
          )}
        </Typo>
        <Layout.FlexRow w="100%" mv={10}>
          <NoteImageList images={likedUserList?.map((user) => user.profile_image || '') || []} />
        </Layout.FlexRow>
      </Layout.FlexCol>
      <PostFooter likedUserList={likedUserList} isMyPage={isMyPage} post={note} />
    </Layout.FlexCol>
  );
}

export default NoteItem;

const PROFILE_IMAGE_SIZE = 44;
const MAX_NOTE_CONTENT_LENGTH = 140;
