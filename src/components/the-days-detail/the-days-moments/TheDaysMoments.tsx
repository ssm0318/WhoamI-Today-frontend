import { useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import CommentList from '@components/comment-list/CommentList';
import { Font, Layout } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { MomentType } from '@models/moment';
import { deleteMoment } from '@utils/apis/moment';
import DeleteAlert from '../../_common/alert-dialog/delete-alert/DeleteAlert';
import ReactionButtons from '../reaction-buttons/ReactionButtons';
import TheDaysWrapper from '../the-days-wrapper/TheDaysWrapper';
import * as S from './TheDaysMoments.styled';

interface TheDaysMomentsProps {
  moment: GetMomentResponse;
  useDeleteButton?: boolean;
  reloadMoment?: () => void;
}

function TheDaysMoments({ moment, useDeleteButton, reloadMoment }: TheDaysMomentsProps) {
  const { mood, photo, description } = moment;
  const [deleteTarget, setDeleteTarget] = useState<MomentType>();

  const closeDeleteAlert = () => {
    setDeleteTarget(undefined);
  };

  const onClickDelete = (momentType: MomentType) => () => {
    setDeleteTarget(momentType);
  };

  const confirmDeleteAlert = () => {
    if (!deleteTarget) {
      closeDeleteAlert();
      return;
    }

    deleteMoment({ id: moment.id, type: deleteTarget })
      .then(() => {
        reloadMoment?.();
      })
      .catch(() => console.log('TODO: 삭제 실패 알림'))
      .finally(() => closeDeleteAlert());
  };

  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <TheDaysWrapper type="moments">
      {mood && (
        <S.ContentWrapper>
          <span>{mood}</span>
          {useDeleteButton && <DeleteButton onClick={onClickDelete('mood')} />}
        </S.ContentWrapper>
      )}
      {photo && (
        <S.PhotoWrapper>
          <S.Photo src={photo} alt="moment_photo" loading="lazy" />
          {useDeleteButton && (
            <Layout.Absolute t={12} r={12}>
              <DeleteButton onClick={onClickDelete('photo')} />
            </Layout.Absolute>
          )}
        </S.PhotoWrapper>
      )}
      {description && (
        <S.ContentWrapper>
          <Font.Body type="20_regular">{description}</Font.Body>
          {useDeleteButton && <DeleteButton onClick={onClickDelete('description')} />}
        </S.ContentWrapper>
      )}
      <Layout.FlexRow w="100%" justifyContent="flex-end" pt={6} pr={8} pb={6}>
        <ReactionButtons
          postType="Moment"
          post={moment}
          isAuthor={useDeleteButton} // FIXME: 사용자 작성글인지 구분
          onClickComments={toggleComments}
        />
      </Layout.FlexRow>
      {showComments && <CommentList postType="Moment" />}
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={confirmDeleteAlert}
      />
    </TheDaysWrapper>
  );
}

export default TheDaysMoments;
