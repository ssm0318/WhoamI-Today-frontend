import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { MainScrollContainer } from '../Root';
import { PinnedPostsHeaderWrapper } from './PinnedPosts.styled';

const ALL_COUNT = 10; // TODO: get from API

function PinnedPosts() {
  const [t] = useTranslation('translation', { keyPrefix: 'pinned_posts' });

  const { username } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = username === myProfile?.username;
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  console.log(isMyPage);
  return (
    <MainScrollContainer>
      <PinnedPostsHeaderWrapper>
        <Layout.LayoutBase w={36} h={36}>
          <button type="button" onClick={handleGoBack}>
            <SvgIcon name="arrow_left" size={36} color="BLACK" />
          </button>
        </Layout.LayoutBase>
        <Layout.FlexRow>
          <Typo type="head-line">{`${t('title')} (${ALL_COUNT})`}</Typo>
        </Layout.FlexRow>
      </PinnedPostsHeaderWrapper>
      {/* TODO: 포스트 리스트 추가 */}
    </MainScrollContainer>
  );
}

export default PinnedPosts;
