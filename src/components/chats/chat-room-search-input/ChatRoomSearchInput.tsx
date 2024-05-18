import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout, SvgIcon } from '@design-system';
import { StyledChatRoomSearchInputArea, StyledSearchInput } from './ChatRoomSearchInput.styled';

interface Props {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}
export function ChatRoomSearchInput({ query, setQuery }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.room_list' });

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClickDeleteInput = () => {
    setQuery('');
  };

  return (
    <StyledChatRoomSearchInputArea>
      <Layout.FlexRow w="100%" alignItems="center" bgColor="INPUT_GRAY" ph={8} pv={6} rounded={12}>
        <SvgIcon name="search" size={44} fill="MEDIUM_GRAY" />
        <StyledSearchInput
          placeholder={t('search_placeholder') || undefined}
          name="chat_room_list_search"
          autoComplete="off"
          value={query}
          onChange={handleChangeInput}
        />
        {query && <DeleteButton onClick={handleClickDeleteInput} size={44} />}
      </Layout.FlexRow>
    </StyledChatRoomSearchInputArea>
  );
}
