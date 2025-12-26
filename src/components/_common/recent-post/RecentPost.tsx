import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import { Layout, Typo } from '@design-system';
import { Note } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { Container, ContentWrapper, FadeOutOverlay, NoteImage } from './RecentPost.styled';

interface Props {
  recentPost: Note;
  hideContent?: boolean;
  showNewBadge?: boolean;
}
function RecentPost({ recentPost, hideContent = false, showNewBadge = true }: Props) {
  const { id, created_at, content, current_user_read, images } = recentPost;
  const navigate = useNavigate();

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    // TODO: 더 보기 바텀 시트 연결
  };

  const handleClickPost = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/notes/${id}`);
  };

  const handleShowComments = () => {
    navigate(`/notes/${id}`);
  };

  const handleSetInputFocus = () => {
    // 포커스는 상세 페이지에서 처리
  };

  return (
    <Container onClick={handleClickPost}>
      <Layout.FlexCol w="100%">
        {/* 시간 & more 버튼 */}
        <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
          <Layout.FlexRow gap={10} alignItems="center">
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {convertTimeDiffByString({
                now: new Date(),
                day: new Date(created_at),
              })}
            </Typo>
            {/* NEW BADGE */}
            {/* discover 페이지에서는 보여주지 않음 */}
            {!!showNewBadge && current_user_read && (
              <Layout.FlexRow bgColor="TERTIARY_BLUE" rounded={4} ph={8} pv={2}>
                <Typo type="body-small" color="WHITE">
                  NEW
                </Typo>
              </Layout.FlexRow>
            )}
          </Layout.FlexRow>

          <Icon name="dots_menu" size={24} onClick={handleClickMore} />
        </Layout.FlexRow>

        {/* content */}
        <ContentWrapper hideContent={hideContent}>
          {images[0] && (
            <Layout.FlexRow w="100%" mv={10}>
              <NoteImage src={images[0]} />
            </Layout.FlexRow>
          )}
          <Typo type="body-large" color="BLACK">
            {content}
          </Typo>
          {hideContent && <FadeOutOverlay />}
        </ContentWrapper>

        {/* PostFooter */}
        <PostFooter
          isMyPage={false}
          post={recentPost}
          displayType="LIST"
          showComments={handleShowComments}
          setInputFocus={handleSetInputFocus}
        />
      </Layout.FlexCol>
    </Container>
  );
}

export default RecentPost;
