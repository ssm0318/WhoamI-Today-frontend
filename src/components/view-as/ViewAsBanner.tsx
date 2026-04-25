import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { VisibilityTier } from '@models/viewAs';
import * as S from './ViewAsBanner.styled';

interface ViewAsBannerProps {
  tier: VisibilityTier;
}

function ViewAsBanner({ tier }: ViewAsBannerProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'view_as' });
  const navigate = useNavigate();

  return (
    <S.Banner>
      <S.Label>
        {t('banner_prefix')} <S.Strong>{t(`tier.${tier}`)}</S.Strong>
      </S.Label>
      <Icon name="close" size={24} onClick={() => navigate('/my')} />
    </S.Banner>
  );
}

export default ViewAsBanner;
