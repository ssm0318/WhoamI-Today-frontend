import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Icon from '@components/_common/icon/Icon';
import PersonaChip from '@components/profile/persona/PersonaChip';
import { Layout, Typo } from '@design-system';
import { Persona } from '@models/persona';
import * as S from './EditPersonaBottomSheet.styled';

type EditPersonaBottomSheetProps = {
  visible: boolean;
  closeBottomSheet: () => void;
  onSelect: (personas: Persona[]) => void;
  selectedPersonas: Persona[] | null;
};

function EditPersonaBottomSheet({
  visible,
  closeBottomSheet,
  onSelect,
  selectedPersonas = [],
}: EditPersonaBottomSheetProps) {
  const [t] = useTranslation('translation', {
    keyPrefix: 'settings.edit_profile.persona_edit_bottom_sheet',
  });
  const [selected, setSelected] = useState<Persona[]>(selectedPersonas || []);

  const handleTogglePersona = (persona: Persona) => {
    setSelected((prev) => {
      // If already selected, remove it
      if (prev.includes(persona)) {
        return prev.filter((p) => p !== persona);
      }

      // If not selected and we're under the limit of 10, add it
      if (prev.length < 10) {
        return [...prev, persona];
      }

      // If at the limit, return the current selection
      return prev;
    });
  };

  const handleConfirm = () => {
    onSelect(selected);
    closeBottomSheet();
  };

  return (
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE">
        <Icon name="home_indicator" />
        <Typo type="title-large">{t('title')}</Typo>
        <Layout.FlexRow mt={8} mb={2}>
          <Typo type="body-medium" color={selected.length >= 10 ? 'WARNING' : 'DARK'}>
            {selected.length} / 10 {t('selected')}
          </Typo>
        </Layout.FlexRow>
        {selected.length >= 10 && (
          <Layout.FlexRow mb={4}>
            <Typo type="body-small" color="WARNING">
              {t('max_persona_limit')}
            </Typo>
          </Layout.FlexRow>
        )}
        <Layout.FlexRow
          gap={6}
          pv={16}
          style={{
            flexWrap: 'wrap',
          }}
          ph={12}
        >
          {Object.values(Persona).map((persona) => (
            <PersonaChip
              persona={persona}
              key={persona}
              onSelect={handleTogglePersona}
              isSelected={selected.includes(persona)}
            />
          ))}
        </Layout.FlexRow>
        <S.ConfirmButtonContainer w="100%" pt={16} pb={20} ph={12}>
          <BottomModalActionButton
            status={selected.length > 0 ? 'normal' : 'disabled'}
            text={t('confirm')}
            onClick={handleConfirm}
          />
        </S.ConfirmButtonContainer>
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default EditPersonaBottomSheet;
