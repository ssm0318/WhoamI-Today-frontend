import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSWRConfig } from 'swr';

import AlertDialog from '@components/_common/alert-dialog/AlertDialog';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import MainContainer from '@components/_common/main-container/MainContainer';
import ValidatedTextArea from '@components/_common/validated-textarea/ValidatedTextArea';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, CheckBox, Font, Layout, Typo } from '@design-system';
import { VersionType } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { requestVersionSwap } from '@utils/apis/user';

const VERSION_LABEL: Record<VersionType, string> = {
  [VersionType.VER_W]: 'Ver.W',
  [VersionType.VER_Q]: 'Ver.Q',
};

function VersionSwapRequest() {
  const [t] = useTranslation('translation', { keyPrefix: 'version_swap' });
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
  const { myProfile, openToast } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    openToast: state.openToast,
  }));

  const [reason, setReason] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!myProfile) return null;

  const currentLabel = VERSION_LABEL[myProfile.current_ver];

  const handleClickSubmit = () => {
    if (!understood || submitting) return;
    setConfirmVisible(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await requestVersionSwap(reason.trim() || undefined);
      setConfirmVisible(false);
      mutate('/user/version-swap-request/me/');
      setSuccessVisible(true);
    } catch (e) {
      setConfirmVisible(false);
      const detail =
        isAxiosError(e) && e.response?.data?.detail
          ? String(e.response.data.detail)
          : t('submit_failed');
      const message = isAxiosError(e) && e.response?.status === 400 ? t('already_pending') : detail;
      openToast({ message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessVisible(false);
    navigate(-1);
  };

  return (
    <MainContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" gap={20} ph={DEFAULT_MARGIN}>
        <Layout.FlexCol w="100%" gap={6}>
          <Font.Display type="18_bold">{t('confirm_question')}</Font.Display>
          <Typo type="body-medium" color="DARK_GRAY">
            {t('confirm_explanation')}
          </Typo>
          <Layout.FlexRow gap={4} alignItems="center" mt={6} style={{ flexWrap: 'wrap' }}>
            <Typo type="body-medium" color="DARK_GRAY">
              {t('your_version_is')}
            </Typo>
            <VersionCode>{currentLabel}</VersionCode>
          </Layout.FlexRow>
        </Layout.FlexCol>

        <Layout.FlexCol w="100%" gap={6}>
          <Typo type="title-medium" color="BLACK">
            {t('reason_label')}
          </Typo>
          <ValidatedTextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('reason_placeholder') || ''}
            limit={500}
            minRows={3}
          />
        </Layout.FlexCol>

        <WarningBox>
          <CheckBox
            name="version-swap-understood"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            label={
              <Typo type="body-medium" color="BLACK">
                {t('understand_irreversible')}
              </Typo>
            }
          />
        </WarningBox>

        <Layout.FlexRow w="100%" mt={8} mb={32}>
          <Button.Primary
            status={understood && !submitting ? 'normal' : 'disabled'}
            text={t('submit')}
            sizing="stretch"
            onClick={handleClickSubmit}
          />
        </Layout.FlexRow>
      </Layout.FlexCol>

      <CommonDialog
        visible={confirmVisible}
        title={t('confirm_modal_title')}
        content={t('confirm_modal_body')}
        cancelText={t('cancel')}
        confirmText={t('submit')}
        onClickConfirm={handleConfirm}
        onClickClose={() => setConfirmVisible(false)}
      />

      <AlertDialog visible={successVisible} onClickDimmed={handleCloseSuccess}>
        <Layout.FlexCol w="100%" alignItems="center" gap={16} ph={20} pv={28}>
          <Typo type="title-large" textAlign="center">
            {t('submitted_title')}
          </Typo>
          <Typo type="body-medium" textAlign="center" color="DARK_GRAY">
            {t('submitted_popup')}
          </Typo>
          <Button.Primary
            status="normal"
            text={t('ok')}
            sizing="stretch"
            onClick={handleCloseSuccess}
          />
        </Layout.FlexCol>
      </AlertDialog>
    </MainContainer>
  );
}

const VersionCode = styled.code`
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  background: ${({ theme }) => theme.LIGHT};
  color: ${({ theme }) => theme.BLACK};
  padding: 2px 6px;
  border-radius: 4px;
`;

const WarningBox = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 8px;
  padding: 12px;
  background: ${({ theme }) => theme.INPUT_GRAY};
`;

export default VersionSwapRequest;
