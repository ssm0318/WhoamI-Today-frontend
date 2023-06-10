import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import ReactionButtons from '../reaction-buttons/ReactionButtons';
import TheDaysWrapper from '../the-days-wrapper/TheDaysWrapper';
import * as S from './TheDaysMoments.styled';

interface TheDaysMomentsProps {
  moment: GetMomentResponse;
  useDeleteButton?: boolean;
}

function TheDaysMoments({ moment, useDeleteButton }: TheDaysMomentsProps) {
  const { mood, photo, description } = moment;

  const onClickMoodDelete = () => {
    console.log('click mood delete button');
  };

  const onClickPhotoDelete = () => {
    console.log('click photo delete button');
  };

  const onClickDescriptionDelete = () => {
    console.log('click description delete button');
  };

  return (
    <TheDaysWrapper type="moments">
      {mood && (
        <S.ContentWrapper>
          <span>{mood}</span>
          {useDeleteButton && <DeleteButton onClick={onClickMoodDelete} />}
        </S.ContentWrapper>
      )}
      {photo && (
        <S.PhotoWrapper>
          <S.Photo src={photo} alt="moment_photo" loading="lazy" />
          {useDeleteButton && (
            <Layout.Absolute t={12} r={12}>
              <DeleteButton onClick={onClickPhotoDelete} />
            </Layout.Absolute>
          )}
        </S.PhotoWrapper>
      )}
      {description && (
        <S.ContentWrapper>
          <span>{description}</span>
          {useDeleteButton && <DeleteButton onClick={onClickDescriptionDelete} />}
        </S.ContentWrapper>
      )}
      <Layout.FlexRow w="100%" justifyContent="flex-end" pt={6} pr={8} pb={6}>
        {/* TODO: 좋아요, 댓글창 버튼 기능 추가 */}
        <ReactionButtons />
      </Layout.FlexRow>
    </TheDaysWrapper>
  );
}

export default TheDaysMoments;
