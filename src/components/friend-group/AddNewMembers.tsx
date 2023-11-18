import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendSearchInput from '@components/friends-settings/friend-search/FriendSearchInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import useFriendList from '@hooks/useFriendList';
import { User } from '@models/user';
import { StyledAddNewMemberItem } from './FriendGroupList.styled';
import SelectableUserItem from './SelectableUserItem';

function AddNewMembers() {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });
  const { id } = useParams();
  const [query, setQuery] = useState('');

  const { friendList, isLoading, iniFiniteLoadingRef } = useFriendList();
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);

  const selected = (userId: number) =>
    !!selectedFriends.find((selectedFriend) => selectedFriend.id === userId);

  const handleToggleFriend = (user: User) => {
    const alreadySelectedFriendIndex = selectedFriends.findIndex(
      (selectedFriend) => selectedFriend.id === user.id,
    );

    if (alreadySelectedFriendIndex >= 0) {
      setSelectedFriends([
        ...selectedFriends.slice(0, alreadySelectedFriendIndex),
        ...selectedFriends.slice(alreadySelectedFriendIndex + 1),
      ]);
      return;
    }

    setSelectedFriends([...selectedFriends, user]);
  };

  return (
    <MainContainer>
      <TitleHeader
        // FIXME: 실제 그룹 이름
        title={id}
      />
      <Layout.LayoutBase w="100%" pt={TITLE_HEADER_HEIGHT}>
        <Layout.FlexCol w="100%" p={10} alignItems="center">
          <Font.Body type="12_regular" color="GRAY_3" textAlign="center">
            {t('add_new_member_info')}
          </Font.Body>
        </Layout.FlexCol>
        <FriendSearchInput query={query} setQuery={setQuery} />
        <Layout.LayoutBase w="100%" ph={18} pt={20}>
          {friendList ? (
            <Layout.FlexCol w="100%" gap={8}>
              {friendList.length > 0 ? (
                <>
                  {friendList.map((user) => (
                    <StyledAddNewMemberItem>
                      <SelectableUserItem
                        user={user}
                        checked={selected(user.id)}
                        handleToggleFriend={handleToggleFriend}
                        profileSize={40}
                        fontType="14_semibold"
                      />
                    </StyledAddNewMemberItem>
                  ))}
                  <div ref={iniFiniteLoadingRef} />
                  {isLoading && <Loader />}
                </>
              ) : (
                <NoContents text={t('no_contents.friends')} ph={10} />
              )}
            </Layout.FlexCol>
          ) : (
            <Loader />
          )}
        </Layout.LayoutBase>
      </Layout.LayoutBase>
    </MainContainer>
  );
}

export default AddNewMembers;
