import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import FriendSearchInput from '@components/friends-settings/friend-search/FriendSearchInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';

function AddNewMembers() {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });
  const { id } = useParams();
  const [query, setQuery] = useState('');

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
      </Layout.LayoutBase>
    </MainContainer>
  );
}

export default AddNewMembers;
