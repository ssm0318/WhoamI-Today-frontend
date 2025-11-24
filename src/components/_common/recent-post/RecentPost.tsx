import { Layout, Typo } from '@design-system';
import { Note } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import Icon from '../icon/Icon';
import { Container } from './RecentPost.styled';

interface Props {
  recentPost: Note;
}
function RecentPost({ recentPost }: Props) {
  console.log('recentPost', recentPost);
  const { author, created_at, content } = recentPost;

  const handleClickMore = () => {
    console.log('handleClickMore');
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

        {/* content (글자수 제한) */}
        <Typo type="body-large" color="BLACK">
          {content}
        </Typo>

        {/* PostFooter */}
      </Layout.FlexCol>
    </Container>
  );
}

export default RecentPost;
