import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout, SvgIcon } from '@design-system';
import * as S from './SearchInput.styled';

interface Props {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  fontSize?: number;
  placeholder?: string;
  cancelText?: string;
}

export default function SearchInput({ query, setQuery, fontSize, placeholder, cancelText }: Props) {
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
    // TODO: 검색 모드 전환
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
          placeholder={placeholder}
          autoComplete="off"
          value={query}
          onChange={handleChangeInput}
          fontSize={fontSize}
        />
        {query && <DeleteButton onClick={handleClickDeleteInput} size={44} />}
      </Layout.FlexRow>
      {searchMode && <S.SearchCancel onClick={handleClickCancel}>{cancelText}</S.SearchCancel>}
    </Layout.FlexRow>
  );
}
