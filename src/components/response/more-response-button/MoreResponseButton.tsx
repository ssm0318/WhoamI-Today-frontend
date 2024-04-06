import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Layout, Typo } from '@design-system';

type MoreResponseButtonProps = {
  username?: string;
};

function MoreResponseButton({ username }: MoreResponseButtonProps) {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(username ? `/users/${username}/responses` : '/my/responses');
  };

  return (
    <Layout.FlexRow
      ml={12}
      h="100%"
      justifyContent="center"
      alignItems="center"
      gap={4}
      w={MORE_RESPONSE_BUTTON_WIDTH}
      onClick={handleClick}
    >
      <Typo type="button-medium" color="DARK_GRAY">
        {t('responses.more')}
      </Typo>
      <Icon size={32} name="arrow_right" />
    </Layout.FlexRow>
  );
}

const MORE_RESPONSE_BUTTON_WIDTH = 90;

export default MoreResponseButton;
