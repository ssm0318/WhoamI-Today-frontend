import { Layout, SvgIcon, Typo } from '@design-system';
import * as S from './HashTagPill.styled';

interface HashTagPillProps {
  isSelected: boolean;
  onClick: () => void;
  label: string;
}

function HashTagPill({ isSelected, onClick, label }: HashTagPillProps) {
  return (
    <S.HashTagPillContainer isSelected={isSelected} onClick={onClick}>
      <Layout.FlexRow h={16} w={16}>
        <SvgIcon name={isSelected ? 'hashtag_selected' : 'hashtag'} size={16} />
      </Layout.FlexRow>
      <Typo type="body-medium" color="BLACK" bold={isSelected}>
        {label}
      </Typo>
    </S.HashTagPillContainer>
  );
}

export default HashTagPill;
