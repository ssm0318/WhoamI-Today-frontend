import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@components/_common/icon/Icon';
import LikeButton from '@components/_common/like-button/LikeButton';
import { Layout, Typo } from '@design-system';
import { Note } from '@models/note';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import * as S from './NoteListItem.styled';

interface NoteListItemProps {
  note: Note;
}

function NoteListItem({ note }: NoteListItemProps) {
  const { content, created_at, like_count, comment_count } = note;
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    //
  };

  const handleClickComment = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <S.NoteListItemWrapper p={12} gap={8} w="100%">
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {convertTimeDiffByString(new Date(), new Date(created_at))}
        </Typo>
        <Icon name="dots_menu" size={24} onClick={handleClickMore} />
      </Layout.FlexRow>
      <Layout.FlexCol gap={8}>
        <Typo type="body-large" color="BLACK">
          {content}
        </Typo>
        <Layout.FlexRow gap={12}>
          <LikeButton postType="Note" post={note} iconSize={24} m={0} />
          <Icon name="add_comment" size={24} onClick={handleClickComment} />
        </Layout.FlexRow>
        <Layout.FlexRow>
          <Typo type="label-large" color="BLACK">
            {like_count || 0} {t('likes')}
            {' ・ '}
            {comment_count || 0} {t('comments')}
          </Typo>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </S.NoteListItemWrapper>
  );
}

export default NoteListItem;
