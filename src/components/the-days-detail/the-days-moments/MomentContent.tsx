import { useState } from 'react';
import DeleteAlert from '@components/_common/alert-dialog/delete-alert/DeleteAlert';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Font, Layout } from '@design-system';
import { MomentType } from '@models/moment';
import { MomentPost } from '@models/post';
import { deleteMoment } from '@utils/apis/moment';
import { ContentWrapper } from '../_styled/contentWrapper.styled';
import * as S from './MomentContent.styled';

interface MomentContentProps {
  moment: MomentPost;
  useDeleteButton?: boolean;
  reloadMoment?: () => void;
}

function MomentContent({ moment, useDeleteButton, reloadMoment }: MomentContentProps) {
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

  return (
    <>
      {mood && (
        <ContentWrapper>
          <span>{mood}</span>
          {useDeleteButton && <DeleteButton onClick={onClickDelete('mood')} />}
        </ContentWrapper>
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
        <ContentWrapper>
          <Font.Body type="20_regular">{description}</Font.Body>
          {useDeleteButton && <DeleteButton onClick={onClickDelete('description')} />}
        </ContentWrapper>
      )}
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={confirmDeleteAlert}
      />
    </>
  );
}

export default MomentContent;
