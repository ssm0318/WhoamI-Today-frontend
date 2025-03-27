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
      onClick={handleClick}
    >
      <Typo type="button-small" color="DARK_GRAY" underline>
        {t('responses.view_all')}
      </Typo>
      <Icon size={24} name="arrow_right" />
    </Layout.FlexRow>
  );
}

export default MoreResponseButton;
