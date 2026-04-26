import { useTranslation } from 'react-i18next';
import { VIEW_AS_TIERS, VisibilityTier } from '@models/viewAs';
import * as S from './ViewAsTabs.styled';

interface ViewAsTabsProps {
  selected: VisibilityTier;
  onSelect: (tier: VisibilityTier) => void;
}

function ViewAsTabs({ selected, onSelect }: ViewAsTabsProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'view_as.tab' });

  return (
    <S.TabsRow role="tablist">
      {VIEW_AS_TIERS.map((tier) => (
        <S.TabButton
          key={tier}
          type="button"
          role="tab"
          aria-selected={tier === selected}
          $selected={tier === selected}
          onClick={() => onSelect(tier)}
        >
          {t(tier)}
        </S.TabButton>
      ))}
    </S.TabsRow>
  );
}

export default ViewAsTabs;
