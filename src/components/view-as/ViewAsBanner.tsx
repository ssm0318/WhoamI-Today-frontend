import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { VisibilityTier } from '@models/viewAs';
import * as S from './ViewAsBanner.styled';

interface ViewAsBannerProps {
  tier?: VisibilityTier | null;
  viewAsUser?: string | null;
  onChange: () => void;
}

function ViewAsBanner({ tier, viewAsUser, onChange }: ViewAsBannerProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'view_as' });
  const navigate = useNavigate();

  const subjectLabel = viewAsUser ? `@${viewAsUser}` : t(`tier.${tier ?? 'public'}`);

  return (
    <S.Banner>
      <S.LabelRow type="button" onClick={onChange}>
        <S.Label>
          {t('banner_prefix')} <S.Strong>{subjectLabel}</S.Strong>
        </S.Label>
        <S.ChangeHint>{t('banner_change')}</S.ChangeHint>
      </S.LabelRow>
      <Icon name="close" size={24} onClick={() => navigate('/my')} />
    </S.Banner>
  );
}

export default ViewAsBanner;
