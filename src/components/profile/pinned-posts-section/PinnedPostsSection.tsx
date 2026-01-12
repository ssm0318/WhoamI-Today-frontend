import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, SvgIcon, Typo } from '@design-system';

interface PinnedPostsSectionProps {
  username?: string;
  pinnedPostsCount?: number;
}

function PinnedPostsSection({ username, pinnedPostsCount = 0 }: PinnedPostsSectionProps) {
  const navigate = useNavigate();
  const [t] = useTranslation('translation', { keyPrefix: 'pinned_posts' });
  const handleClickPinnedPosts = () => {
    if (pinnedPostsCount === 0) return;
    // TODO: Navigate to pinned posts page
    if (username) {
      navigate(`/user/${username}/pinned-posts`);
    } else {
      navigate('/my/pinned-posts');
    }
  };

  if (pinnedPostsCount === 0) return null;

  return (
    <Layout.FlexRow
      w="100%"
      alignItems="center"
      justifyContent="space-between"
      p={8}
      bgColor="WHITE"
      rounded={12}
      onClick={handleClickPinnedPosts}
      style={{ cursor: 'pointer' }}
    >
      <Layout.FlexRow alignItems="center" gap={8}>
        {/* TODO(Gina) 나중에 pin/unpin 아이콘 변경 */}
        <SvgIcon name="pin_empty" size={24} />
        <Typo type="title-small" color="BLACK">
          {t('entry_title', { count: pinnedPostsCount })}
        </Typo>
      </Layout.FlexRow>
      <SvgIcon name="chevron_right" size={24} fill="DARK_GRAY" />
    </Layout.FlexRow>
  );
}

export default PinnedPostsSection;
