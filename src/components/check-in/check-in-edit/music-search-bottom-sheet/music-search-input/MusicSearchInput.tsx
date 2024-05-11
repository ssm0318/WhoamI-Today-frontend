import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout, SvgIcon } from '@design-system';
import * as S from './MusicSearchInput.styled';

interface Props {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  fontSize?: number;
  placeholder?: string;
}

export default function MusicSearchInput({ query, setQuery, fontSize, placeholder }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends.search' });
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchMode, setSearchMode] = useState(false);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSearchMode(true);
  };

  const handleClickDeleteInput = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleClickCancel = () => {
    setSearchMode(false);
    setQuery('');
  };

  return (
    <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        bgColor="INPUT_GRAY"
        rounded={12}
        ph={8}
        pv={6}
        h={56}
      >
        <SvgIcon name="search" size={44} fill="MEDIUM_GRAY" />
        <S.SearchInput
          ref={inputRef}
          placeholder={placeholder || t('placeholder') || undefined}
          name="friend_search"
          autoComplete="off"
          value={query}
          onChange={handleChangeInput}
          fontSize={fontSize}
        />
        {query && <DeleteButton onClick={handleClickDeleteInput} size={44} />}
      </Layout.FlexRow>
      {searchMode && <S.SearchCancel onClick={handleClickCancel}>{t('cancel')}</S.SearchCancel>}
    </Layout.FlexRow>
  );
}