import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
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
  const [searchMode, setSearchMode] = useState(false);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSearchMode(true);
  };

  const handleClickDeleteInput = () => {
    setQuery('');
  };

  const handleClickCancel = () => {
    // TODO: 검색 모드 전환
    setSearchMode(false);
    setQuery('');
  };

  return (
    <Layout.FlexRow w="100%" pl={16} pr={searchMode ? 4 : 24} pt={4} alignItems="center" gap={8}>
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        bgColor="INPUT_GRAY"
        rounded={12}
        ph={8}
        pv={6}
        h={56}
      >
        <Layout.LayoutBase p={12}>
          <SvgIcon name="search" size={20} fill="MEDIUM_GRAY" />
        </Layout.LayoutBase>
        <S.SearchInput
          placeholder={t('placeholder') || undefined}
          name="friend_search"
          autoComplete="off"
          value={query}
          onChange={handleChangeInput}
        />
        {query && <DeleteButton onClick={handleClickDeleteInput} size={44} />}
      </Layout.FlexRow>
      {searchMode && <S.SearchCancel onClick={handleClickCancel}>{t('cancel')}</S.SearchCancel>}
    </Layout.FlexRow>
  );
}
