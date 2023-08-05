import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon } from '@design-system';
import * as S from './FriendSearch.styled';

export default function FriendSearch() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends.search' });
  return (
    <Layout.LayoutBase w="100%" pl={24} pt={4} pr={24}>
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        bgColor="GRAY_10"
        gap={12}
        rounded={12}
        p={9}
        pr={9}
      >
        <Layout.LayoutBase p={8}>
          <SvgIcon name="search" size={20} />
        </Layout.LayoutBase>
        <S.SearchInput
          placeholder={t('placeholder') || undefined}
          name="friend_search"
          autoComplete="off"
        />
      </Layout.FlexRow>
    </Layout.LayoutBase>
  );
}
