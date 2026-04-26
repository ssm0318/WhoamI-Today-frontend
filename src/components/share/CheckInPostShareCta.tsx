import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Colors, Layout, Typo } from '@design-system';

function CheckInPostShareCta() {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const navigate = useNavigate();

  return (
    <Card type="button" onClick={() => navigate('/check-in-posts/new')}>
      <Layout.FlexRow w="100%" alignItems="center" gap={16}>
        <Plus>+</Plus>
        <Layout.FlexCol alignItems="flex-start" gap={2}>
          <Typo type="title-medium" color="WHITE">
            {t('compose_line1')}
          </Typo>
          <Typo type="title-large" color="WHITE" bold>
            {t('compose_line2')}
          </Typo>
        </Layout.FlexCol>
      </Layout.FlexRow>
    </Card>
  );
}

const Card = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #8700ff 0%, #6200b3 100%);
  border: none;
  cursor: pointer;
  text-align: left;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.85;
  }
`;

const Plus = styled.span`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px dashed ${Colors.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: ${Colors.WHITE};
`;

export default CheckInPostShareCta;
