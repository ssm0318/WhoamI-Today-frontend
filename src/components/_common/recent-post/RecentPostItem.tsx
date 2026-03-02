import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { NoteImage } from '@components/note/note-image/NoteImage.styled';
import { Layout, Typo } from '@design-system';
import { POST_TYPE, RecentPost } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import RecentPostFooter from './RecentPostFooter';
import { Container, ContentWrapper, FadeOutOverlay } from './RecentPostItem.styled';

interface Props {
  recentPost: RecentPost;
  hideContent?: boolean;
  showNewBadge?: boolean;
}
function RecentPostItem({ recentPost, hideContent = false, showNewBadge = true }: Props) {
  const { id, created_at, preview_content, is_read } = recentPost;
  const navigate = useNavigate();

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    // TODO: 더 보기 바텀 시트 연결
  };

  const getPostDetailPath = () =>
    recentPost.type === POST_TYPE.RESPONSE ? `/responses/${id}` : `/notes/${id}`;

  const handleClickPost = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(getPostDetailPath());
  };

  const handleShowComments = () => {
    navigate(getPostDetailPath());
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
            {!!showNewBadge && !is_read && (
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
          {recentPost?.type === POST_TYPE.NOTE && recentPost.images[0] && (
            <Layout.FlexRow w="100%" mv={10}>
              <NoteImage src={recentPost.images[0]} />
            </Layout.FlexRow>
          )}
          <Typo type="body-large" color="BLACK">
            {preview_content}
          </Typo>
          {hideContent && <FadeOutOverlay />}
        </ContentWrapper>

        {/* PostFooter */}
        <RecentPostFooter
          isMyPage={false}
          post={recentPost}
          showComments={handleShowComments}
          setInputFocus={handleSetInputFocus}
        />
      </Layout.FlexCol>
    </Container>
  );
}

export default RecentPostItem;
