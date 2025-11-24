import { Layout, Typo } from '@design-system';
import { Note } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import Icon from '../icon/Icon';
import { Container } from './RecentPost.styled';

interface Props {
  recentPost: Note;
}
function RecentPost({ recentPost }: Props) {
  const { author, created_at, content } = recentPost;

  const handleClickMore = () => {
    // TODO(Gina): 더 보기 바텀 시트 연결
  };

  return (
    <Container>
      <Layout.FlexCol w="100%">
        {/* 이름, 작성시간 & more 버튼 */}
        <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
          <Layout.FlexRow gap={4}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {author}
            </Typo>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              •
            </Typo>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {convertTimeDiffByString({
                now: new Date(),
                day: new Date(created_at),
              })}
            </Typo>
          </Layout.FlexRow>
          <Layout.FlexRow>
            <Icon name="dots_menu" size={24} onClick={handleClickMore} />
          </Layout.FlexRow>
        </Layout.FlexRow>

        {/* content */}
        {/* TODO(Gina): 기획 확정되면 글자수 제한 추가 */}
        <Typo type="body-large" color="BLACK">
          {content}
        </Typo>

        {/* PostFooter */}
        {/* TODO(Gina): 기획 확정되면 PostFooter 추가 */}
      </Layout.FlexCol>
    </Container>
  );
}

export default RecentPost;
