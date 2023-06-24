import { useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Font, Layout } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { TodayMoment } from '@models/moment';
import DeleteAlert from '../delete-alert/DeleteAlert';
import ReactionButtons from '../reaction-buttons/ReactionButtons';
import TheDaysWrapper from '../the-days-wrapper/TheDaysWrapper';
import * as S from './TheDaysMoments.styled';

interface TheDaysMomentsProps {
  moment: GetMomentResponse;
  useDeleteButton?: boolean;
}

type MomentType = keyof TodayMoment;

function TheDaysMoments({ moment, useDeleteButton }: TheDaysMomentsProps) {
  const { mood, photo, description } = moment;
  const [deleteTarget, setDeleteTarget] = useState<MomentType>();

  const closeDeleteAlert = () => {
    setDeleteTarget(undefined);
  };

  const onClickDelete = (momentType: MomentType) => () => {
    setDeleteTarget(momentType);
  };

  const deleteMoment = () => {
    console.log(`TODO: delete moment /${moment.id}/${deleteTarget}`);
    closeDeleteAlert();
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
        />
      </Layout.FlexRow>
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={deleteMoment}
      />
    </TheDaysWrapper>
  );
}

export default TheDaysMoments;
