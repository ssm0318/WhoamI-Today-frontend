import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@components/_common/icon-button/IconButton';
import LikeButton from '@components/_common/like-button/LikeButton';
import { Colors, Layout, Typo } from '@design-system';
import { Note } from '@models/note';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface NoteListItemProps {
  note: Note;
}

function NoteListItem({ note }: NoteListItemProps) {
  const { content, created_at, likeCount, commentCount } = note;
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    //
  };

  const handleClickComment = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Layout.FlexCol
      p={12}
      gap={8}
      style={{
        borderBottom: `1px solid ${Colors.LIGHT}`,
      }}
    >
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {convertTimeDiffByString(new Date(), new Date(created_at))}
        </Typo>
        <IconButton name="dots_menu" onClick={handleClickMore} />
      </Layout.FlexRow>
      <Layout.FlexCol gap={8}>
        <Typo type="body-large" color="BLACK">
          {content}
        </Typo>
        <Layout.FlexRow gap={12}>
          <LikeButton postType="Note" post={note} iconSize={24} m={0} />
          <IconButton name="comment" onClick={handleClickComment} />
        </Layout.FlexRow>
        <Layout.FlexRow>
          <Typo type="label-large" color="BLACK">
            {likeCount} {t('likes')}
            {' ・ '}
            {commentCount} {t('comments')}
          </Typo>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default NoteListItem;
