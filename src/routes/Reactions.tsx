import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Icon from '@components/_common/icon/Icon';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';

// NOTE test data
const DUMMY_REACTION_LIST = [
  {
    id: 1,
    emoji: '👍',
    type: 'Emoji',
    username: '김민지',
  },
  {
    id: 1,
    type: 'Like',
    username: '박지나',
  },
];

function Reactions() {
  //   const { noteId, responseId } = useParams();
  const navigate = useNavigate();
  const [t] = useTranslation('translation', { keyPrefix: 'reactions' });

  const handleClickFriend = (username: string) => {
    return navigate(`/users/${username}`);
  };

  return (
    <MainContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" ph={16}>
        {/* like list */}
        {DUMMY_REACTION_LIST.map((reaction) => {
          const { id, username, emoji } = reaction;
          return (
            <Layout.FlexRow
              alignItems="center"
              justifyContent="space-between"
              pv={12}
              pr={8}
              w="100%"
              key={id}
              onClick={() => handleClickFriend(username)}
            >
              <Layout.FlexRow gap={14} alignItems="center">
                <ProfileImage imageUrl={null} username={username} size={44} />
                <Typo type="title-medium">{username}</Typo>
              </Layout.FlexRow>
              <Layout.FlexRow>
                {emoji ? (
                  <EmojiItem emojiString={emoji || ''} size={20} />
                ) : (
                  <Icon name="like_filled" size={24} />
                )}
              </Layout.FlexRow>
            </Layout.FlexRow>
          );
        })}
        {/* <div ref={targetRef} />
        {isLoading && (
          <Layout.FlexRow w="100%" h={40}>
            <Loader />
          </Layout.FlexRow>
        )} */}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default Reactions;
