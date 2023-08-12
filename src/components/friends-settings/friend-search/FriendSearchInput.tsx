import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout, SvgIcon } from '@design-system';
import * as S from './FriendSearchInput.styled';

interface Props {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export default function FriendSearchInput({ query, setQuery }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends.search' });
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClickDeleteInput = () => {
    setQuery('');
  };

  return (
    <Layout.LayoutBase w="100%" ph={24} pt={4}>
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
          value={query}
          onChange={handleChangeInput}
        />
        {query && <DeleteButton onClick={handleClickDeleteInput} />}
      </Layout.FlexRow>
    </Layout.LayoutBase>
  );
}
