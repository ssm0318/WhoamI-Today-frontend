import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Layout, RadioButton, Typo } from '@design-system';
import * as S from './FriendEvaluationModal.styled';

export interface EvaluationData {
  closeness?: number;
  relationshipType?: string;
  relationshipTypeDetail?: string;
  skipped: boolean;
}

interface FriendEvaluationModalProps {
  visible: boolean;
  type: 'request' | 'accept';
  username: string;
  onSubmit: (data: EvaluationData) => void;
  onClose: () => void;
}

const CLOSENESS_OPTIONS = [1, 2, 3, 4, 5] as const;

const RELATIONSHIP_TYPES = [
  'school_friend',
  'coworker',
  'family',
  'online_friend',
  'club_community',
  'other',
] as const;

function FriendEvaluationModal({
  visible,
  type,
  username,
  onSubmit,
  onClose,
}: FriendEvaluationModalProps) {
  const [t] = useTranslation('translation', {
    keyPrefix: 'friends.explore_friends.friend_item.friend_evaluation',
  });

  const [closeness, setCloseness] = useState<number | null>(null);
  const [relationshipType, setRelationshipType] = useState<string | null>(null);
  const [relationshipTypeDetail, setRelationshipTypeDetail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingData, setPendingData] = useState<EvaluationData | null>(null);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);

  const handleChangeRelationshipType = (e: ChangeEvent<HTMLInputElement>) => {
    setRelationshipType(e.target.value);
    if (e.target.value !== 'other') {
      setRelationshipTypeDetail('');
    }
  };

  const handleSubmit = () => {
    if (!closeness || !relationshipType) return;
    if (relationshipType === 'other' && !relationshipTypeDetail.trim()) return;

    const data: EvaluationData = {
      closeness,
      relationshipType,
      relationshipTypeDetail:
        relationshipType === 'other' ? relationshipTypeDetail.trim() : undefined,
      skipped: false,
    };
    setPendingData(data);
    setShowConfirmation(true);
  };

  const handleSkip = () => {
    const data: EvaluationData = { skipped: true };
    setPendingData(data);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (pendingData) {
      onSubmit(pendingData);
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
    setPendingData(null);
  };

  const handleClickBackground = (e: MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const isSubmitDisabled =
    !closeness ||
    !relationshipType ||
    (relationshipType === 'other' && !relationshipTypeDetail.trim());

  const getRelationshipLabel = (typeKey: string) => t(`relationship_${typeKey}`) || typeKey;

  if (!visible) return null;

  return createPortal(
    <S.Container onClick={(e: MouseEvent) => e.stopPropagation()}>
      <S.Background onClick={handleClickBackground} />
      <S.Body className="body" onClick={(e) => e.stopPropagation()}>
        {showConfirmation ? (
          // Confirmation view
          <Layout.FlexCol w="100%" alignItems="center" p={16}>
            <Typo type="title-large" mb={8}>
              {t('confirm_title')}
            </Typo>
            <S.ConfirmSummary>
              {pendingData?.skipped ? (
                <Typo type="body-medium">{t('skip')}</Typo>
              ) : (
                <>
                  <Typo type="body-medium">
                    {t('closeness_label')}: {pendingData?.closeness}
                  </Typo>
                  <Typo type="body-medium">
                    {t('relationship_label')}:{' '}
                    {pendingData?.relationshipType === 'other'
                      ? pendingData?.relationshipTypeDetail
                      : getRelationshipLabel(pendingData?.relationshipType || '')}
                  </Typo>
                </>
              )}
            </S.ConfirmSummary>
          </Layout.FlexCol>
        ) : (
          // Evaluation form view
          <Layout.FlexCol w="100%" alignItems="center" p={16}>
            <Typo type="title-large" mb={5}>
              {type === 'accept' ? t('accept_title') : t('request_title')}
            </Typo>
            <Typo type="body-medium" textAlign="center">
              {t('description', { username })}
            </Typo>

            {/* Closeness section */}
            <S.SectionTitle>
              <Typo type="label-large">{t('closeness_label')}</Typo>
            </S.SectionTitle>
            <S.ClosenessRow>
              {CLOSENESS_OPTIONS.map((value) => (
                <S.ClosenessButton
                  key={value}
                  type="button"
                  selected={closeness === value}
                  onClick={() => setCloseness(value)}
                >
                  {value}
                </S.ClosenessButton>
              ))}
            </S.ClosenessRow>
            <S.ClosenessLabelRow>
              <Typo type="label-medium" color="DARK_GRAY">
                {t('closeness_min')}
              </Typo>
              <Typo type="label-medium" color="DARK_GRAY">
                {t('closeness_max')}
              </Typo>
            </S.ClosenessLabelRow>

            {/* Relationship type section */}
            <S.SectionTitle>
              <Typo type="label-large">{t('relationship_label')}</Typo>
            </S.SectionTitle>
            <Layout.FlexCol w="100%" gap={6}>
              {RELATIONSHIP_TYPES.map((typeKey) => (
                <RadioButton
                  key={typeKey}
                  label={getRelationshipLabel(typeKey)}
                  name="relationship_type"
                  value={typeKey}
                  checked={relationshipType === typeKey}
                  onChange={handleChangeRelationshipType}
                />
              ))}
              {relationshipType === 'other' && (
                <S.OtherInput
                  type="text"
                  placeholder={t('other_placeholder') || ''}
                  value={relationshipTypeDetail}
                  onChange={(e) => setRelationshipTypeDetail(e.target.value)}
                  maxLength={50}
                />
              )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        )}

        <S.ButtonContainer w="100%" justifyContent="space-evenly">
          {showConfirmation ? (
            <>
              <S.Button onClick={handleBack} pv={11}>
                <Typo type="button-medium">{t('back')}</Typo>
              </S.Button>
              <S.Button onClick={handleConfirm} pv={11} hasBorderRight={false}>
                <Typo type="button-medium" color="PRIMARY">
                  {t('confirm')}
                </Typo>
              </S.Button>
            </>
          ) : (
            <>
              <S.Button onClick={handleSkip} pv={11}>
                <Typo type="button-medium">{t('skip')}</Typo>
              </S.Button>
              <S.Button
                onClick={isSubmitDisabled ? undefined : handleSubmit}
                pv={11}
                hasBorderRight={false}
                style={{ opacity: isSubmitDisabled ? 0.4 : 1 }}
              >
                <Typo type="button-medium" color="PRIMARY">
                  {t('submit')}
                </Typo>
              </S.Button>
            </>
          )}
        </S.ButtonContainer>
      </S.Body>
    </S.Container>,
    document.getElementById('modal-container') || document.body,
  );
}

export default FriendEvaluationModal;
