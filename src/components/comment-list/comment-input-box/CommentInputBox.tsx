import { useTranslation } from 'react-i18next';
import { Button, Layout, SvgIcon } from '@design-system';
import * as S from './CommentInputBox.styled';

interface CommentInputBoxProps {
  isReply?: boolean;
}

function CommentInputBox({ isReply }: CommentInputBoxProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const placeholder = isReply ? t('reply_place_holder') : t('comment_place_holder');

  // TODO: post comment api 연결

  return (
    <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between" gap={5}>
      {/* FIXME: reply icon 교체 */}
      {isReply && <SvgIcon name="arrow_right" color="BASIC_BLACK" size={20} />}
      <S.CommentInput placeholder={placeholder} />
      <Button.Small text={t('post')} type="white_fill" status="normal" />
    </Layout.FlexRow>
  );
}

export default CommentInputBox;
