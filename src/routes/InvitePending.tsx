import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Font } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { useBoundStore } from '@stores/useBoundStore';
import { getMe } from '@utils/apis/my';
import { signOut } from '@utils/apis/user';

function InvitePending() {
  const [t] = useTranslation('translation', { keyPrefix: 'invite_pending' });
  const postMessage = usePostAppMessage();
  const { myProfile, fcmToken } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    fcmToken: state.fcmToken,
  }));

  const inviterName = myProfile?.invited_from_detail?.username ?? t('your_friend');

  const handleRefresh = () => {
    getMe().catch(() => {});
  };

  const handleLogout = () => {
    signOut(() => {
      postMessage('LOGOUT', {});
      window.location.replace('/signin');
    }, fcmToken);
  };

  return (
    <Page>
      <Container>
        <Logo src="/whoami-logo.svg" alt="WhoAmI Today" />
        <Title>WhoAmI Today</Title>
        <Emoji>⏳</Emoji>
        <Message>
          {t('message', {
            username: inviterName,
          })}
        </Message>
        <Divider />
        <SubMessage>{t('sub_message')}</SubMessage>
        <Actions>
          <Button.Medium
            type="gray_fill"
            status="normal"
            text={t('refresh')}
            onClick={handleRefresh}
          />
          <TextButton type="button" onClick={handleLogout}>
            <Font.Body type="14_regular">{t('logout')}</Font.Body>
          </TextButton>
        </Actions>
      </Container>
    </Page>
  );
}

export default InvitePending;

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #ffffff;
`;

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0 0 20px;
  color: #8700ff;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0;
`;

const Emoji = styled.div`
  margin-bottom: 16px;
  font-size: 40px;
  line-height: 1;
`;

const Message = styled.p`
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
  white-space: pre-line;
`;

const Divider = styled.div`
  width: 40px;
  height: 3px;
  margin: 24px auto;
  border-radius: 2px;
  background: #8700ff;
`;

const SubMessage = styled.p`
  margin: 0;
  color: #999999;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-line;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
`;

const TextButton = styled.button`
  border: 0;
  background: transparent;
  color: #999999;
  cursor: pointer;
`;
