import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
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
  'not_yet',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

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

  const handleConfirm = () => {
    if (isSubmittingRef.current) return;
    if (!pendingData) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    onSubmit(pendingData);
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
            <Typo type="title-large" mb={12}>
              {t('confirm_title')}
            </Typo>
            <S.ConfirmSummary>
              <S.ConfirmItem>
                <Typo type="label-medium" color="DARK_GRAY">
                  {t('closeness_label')}
                </Typo>
                <Typo type="body-medium">
                  {t(`closeness_${pendingData?.closeness}`)} ({pendingData?.closeness}/5)
                </Typo>
              </S.ConfirmItem>
              <S.ConfirmDivider />
              <S.ConfirmItem>
                <Typo type="label-medium" color="DARK_GRAY">
                  {t('relationship_label')}
                </Typo>
                <Typo type="body-medium">
                  {pendingData?.relationshipType === 'other'
                    ? pendingData?.relationshipTypeDetail
                    : getRelationshipLabel(pendingData?.relationshipType || '')}
                </Typo>
              </S.ConfirmItem>
            </S.ConfirmSummary>
          </Layout.FlexCol>
        ) : (
          // Evaluation form view
          <Layout.FlexCol w="100%" alignItems="center" p={16}>
            <Typo type="title-large" mb={16} textAlign="center">
              {type === 'accept'
                ? t('accept_title', { username })
                : t('request_title', { username })}
            </Typo>

            {/* Closeness section */}
            <S.SectionTitle>
              <Typo type="label-large">{t('closeness_label')}</Typo>
            </S.SectionTitle>
            <S.ClosenessRow>
              {CLOSENESS_OPTIONS.map((value) => (
                <S.ClosenessOption key={value}>
                  <S.ClosenessButton
                    type="button"
                    selected={closeness === value}
                    onClick={() => setCloseness(value)}
                  >
                    {value}
                  </S.ClosenessButton>
                  <Typo type="label-small" color="DARK_GRAY" textAlign="center">
                    {t(`closeness_${value}`)}
                  </Typo>
                </S.ClosenessOption>
              ))}
            </S.ClosenessRow>

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

        {!showConfirmation && (
          <S.RequiredNotice>
            <Typo type="body-small" color="DARK_GRAY">
              {type === 'accept' ? t('accept_required') : t('request_required')}
            </Typo>
          </S.RequiredNotice>
        )}

        <S.ButtonContainer w="100%" justifyContent="space-evenly">
          {showConfirmation ? (
            <>
              <S.Button
                onClick={isSubmitting ? undefined : handleBack}
                pv={11}
                style={{ opacity: isSubmitting ? 0.4 : 1 }}
              >
                <Typo type="button-medium">{t('back')}</Typo>
              </S.Button>
              <S.Button
                onClick={isSubmitting ? undefined : handleConfirm}
                pv={11}
                hasBorderRight={false}
                style={{ opacity: isSubmitting ? 0.4 : 1 }}
              >
                <Typo type="button-medium" color="PRIMARY">
                  {t('confirm')}
                </Typo>
              </S.Button>
            </>
          ) : (
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
          )}
        </S.ButtonContainer>
      </S.Body>
    </S.Container>,
    document.getElementById('modal-container') || document.body,
  );
}

export default FriendEvaluationModal;
