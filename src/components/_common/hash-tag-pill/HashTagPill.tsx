import { Typo } from '@design-system';
import * as S from './HashTagPill.styled';

interface HashTagPillProps {
  isSelected: boolean;
  onClick: () => void;
  label: string;
}

function HashTagPill({ isSelected, onClick, label }: HashTagPillProps) {
  return (
    <S.HashTagPillContainer isSelected={isSelected} onClick={onClick}>
      {isSelected ? (
        <>
          <S.CheckmarkBox>
            <Typo type="label-medium" color="WHITE">
              ✓
            </Typo>
          </S.CheckmarkBox>
          <Typo type="label-medium" color="WHITE">
            {label}
          </Typo>
        </>
      ) : (
        <Typo type="label-medium" color="BLACK">
          ##{label}
        </Typo>
      )}
    </S.HashTagPillContainer>
  );
}

export default HashTagPill;
