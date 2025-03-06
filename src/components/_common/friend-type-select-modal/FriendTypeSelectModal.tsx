import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { CheckBox, Layout, RadioButton, Typo } from '@design-system';
import { Connection } from '@models/api/friends';
import * as S from './FriendTypeSelectModal.styled';

interface FriendTypeSelectModalProps {
  visible: boolean;
  onClickConfirm: (friendType: Connection, updatePastPosts: boolean) => void;
  onClickClose: () => void;
  type: 'accept' | 'request';
}

function FriendTypeSelectModal({
  visible,
  onClickClose,
  onClickConfirm,
  type,
}: FriendTypeSelectModalProps) {
  const [t] = useTranslation('translation', {
    keyPrefix: 'friends.explore_friends.friend_item.friend_type_select_dialog',
  });
  // default 값은 friend
  const [friendType, setFriendType] = useState<Connection>(Connection.FRIEND);
  const [isUpdatePastPosts, setIsUpdatePastPosts] = useState(false);

  // Implement usePreventScroll functionality
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);

  const handleClickConfirm = () => {
    onClickConfirm(friendType, isUpdatePastPosts);
    onClickClose();
  };

  const handleChangeConnection = (e: ChangeEvent<HTMLInputElement>) => {
    setFriendType(e.target.value as Connection);
  };

  const handleClickBackground = (e: MouseEvent) => {
    e.stopPropagation();
    onClickClose();
  };

  const handleChangeCheckBox = () => {
    setIsUpdatePastPosts((prev) => !prev);
  };

  if (!visible) return null;

  return createPortal(
    <S.Container>
      <S.Background onClick={handleClickBackground} />
      <S.Body className="body" onClick={(e) => e.stopPropagation()}>
        <Layout.FlexCol w="100%" alignItems="center" p={16}>
          <Typo type="title-large" mb={5}>
            {type === 'accept' ? t('accept_title') : t('request_title')}
          </Typo>
          <Typo type="label-large" textAlign="center">
            {t('content')}
          </Typo>
          <Typo type="body-medium" textAlign="center" mt={4}>
            ({t('fyi')})
          </Typo>
          <Layout.FlexCol w="100%" gap={10} mt={10}>
            <RadioButton
              label={t('friend') || ''}
              name={Connection.FRIEND}
              value={Connection.FRIEND}
              checked={friendType === Connection.FRIEND}
              onChange={handleChangeConnection}
            />
            <RadioButton
              label={t('close_friend') || ''}
              name={Connection.CLOSE_FRIEND}
              value={Connection.CLOSE_FRIEND}
              checked={friendType === Connection.CLOSE_FRIEND}
              onChange={handleChangeConnection}
            />
          </Layout.FlexCol>
          <Layout.FlexRow mt={10}>
            <CheckBox
              name={t('update_past_posts') || ''}
              onChange={handleChangeCheckBox}
              checked={isUpdatePastPosts}
              disabled={friendType === Connection.FRIEND}
            />
          </Layout.FlexRow>
        </Layout.FlexCol>
        <S.ButtonContainer w="100%" justifyContent="space-evenly">
          <S.Button onClick={onClickClose} pv={11}>
            <Typo type="button-medium">{t('cancel')}</Typo>
          </S.Button>
          <S.Button onClick={handleClickConfirm} pv={11} hasBorderRight={false}>
            <Typo type="button-medium" color="PRIMARY">
              {t('confirm')}
            </Typo>
          </S.Button>
        </S.ButtonContainer>
      </S.Body>
    </S.Container>,
    document.getElementById('modal-container') || document.body,
  );
}

export default FriendTypeSelectModal;
