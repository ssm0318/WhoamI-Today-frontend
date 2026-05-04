import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { ProfileSuggestionCardBody, ProfileSuggestionField } from '@models/discover';
import * as S from './ProfileSuggestionCard.styled';

interface ProfileSuggestionCardProps {
  suggestion: ProfileSuggestionCardBody;
}

function ProfileSuggestionCard({ suggestion }: ProfileSuggestionCardProps) {
  const navigate = useNavigate();
  const trackEvent = useTrackEvent();
  const [t] = useTranslation('translation', { keyPrefix: 'profile_suggestion_card' });

  const handleEditProfile = () => {
    // CTA conversion: did the suggestion card actually drive users to
    // open Edit Profile? Backend can't tell — same /settings/edit-profile
    // URL regardless of source.
    trackEvent('profile_suggestion_edit_tapped');
    navigate('/settings/edit-profile');
  };

  const handleFieldClick = (field: ProfileSuggestionField) => {
    // Per-missing-field tap: which gaps in the profile users actually
    // care about filling vs which they ignore.
    trackEvent('profile_suggestion_field_tapped', {
      field_label: field.label,
      tab: String(field.tab ?? 'default'),
    });
    navigate(field.tab ? `/settings/edit-profile?tab=${field.tab}` : '/settings/edit-profile');
  };

  return (
    <S.ProfileSuggestionWrapper>
      <Layout.FlexCol gap={8} w="100%">
        <Typo type="head-line" color="WHITE" bold>
          {t('title')}
        </Typo>
        <Typo type="body-medium" color="WHITE">
          {t('description')}
        </Typo>
      </Layout.FlexCol>

      <Layout.FlexRow gap={8} style={{ flexWrap: 'wrap' }}>
        {suggestion.missingFields.map((field) => (
          <S.MissingFieldChip
            key={`${field.tab ?? 'profile'}-${field.label}`}
            type="button"
            onClick={() => handleFieldClick(field)}
          >
            <Typo type="label-medium" color="PRIMARY">
              + {field.label}
            </Typo>
          </S.MissingFieldChip>
        ))}
      </Layout.FlexRow>

      <S.EditButtonWrapper>
        <Button.Primary text={t('edit_profile')} onClick={handleEditProfile} status="normal" />
      </S.EditButtonWrapper>
    </S.ProfileSuggestionWrapper>
  );
}

export default ProfileSuggestionCard;
