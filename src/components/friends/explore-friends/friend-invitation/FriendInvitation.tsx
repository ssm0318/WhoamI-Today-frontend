import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ToastMessage from '@components/_common/toast-message/ToastMessage';
import { INVITATION_LINK } from '@constants/url';
import { Colors, Font, Layout, SvgIcon, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { decodeHTMLEntities } from '@utils/urlHelpers';

const ActionRow = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 13px;
  padding: 8px 11px;
  border: 0;
  border-radius: 12px;
  background: ${Colors.INPUT_GRAY};
  color: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

export default function FriendInvitation() {
  const myProfile = useBoundStore((state) => state.myProfile);

  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends.invite' });
  const { isMobile } = getMobileDeviceInfo();
  const [toastText, setToastText] = useState<string | null>(null);
  const inviteCode = myProfile?.invite_code?.trim();
  const invitationLink = inviteCode
    ? `whoami://app/signup/email/invite-code/${encodeURIComponent(inviteCode)}`
    : INVITATION_LINK;

  const copyToClipboard = (text: string, successText: string) => {
    if (!navigator.clipboard) return;
    Promise.resolve(navigator.clipboard.writeText(text)).catch(() => undefined);
    setToastText(successText);
  };

  const handleClickLinkShare = () => {
    // desktop 에서는 클립보드에 복사
    if (!isMobile || !navigator.share) {
      const message = decodeHTMLEntities(
        t('desktop_message', {
          username: myProfile?.username ?? '',
          invite_code: inviteCode ?? '',
          invitation_link: invitationLink,
        }),
      );
      copyToClipboard(message, t('copy'));
      return;
    }

    // mobile 에서는 공유하기
    // webview의 경우는 title이 포함된 message를 보내야 함
    const message = window.ReactNativeWebView
      ? decodeHTMLEntities(
          `${t('mobile_message_title')}\n\n${t('mobile_message', {
            username: myProfile?.username ?? '',
            invite_code: inviteCode ?? '',
            invitation_link: invitationLink,
          })}`,
        )
      : decodeHTMLEntities(
          t('mobile_message', {
            username: myProfile?.username ?? '',
            invite_code: inviteCode ?? '',
            invitation_link: invitationLink,
          }),
        );

    navigator.share({
      title: t('mobile_message_title') || '',
      text: message,
    });
  };

  const handleClickCopyCode = () => {
    if (!inviteCode) return;
    copyToClipboard(inviteCode, t('copy_code_copied'));
  };

  return (
    <>
      <Layout.FlexCol w="100%" gap={8}>
        <ActionRow type="button" onClick={handleClickLinkShare}>
          <SvgIcon name="my_profile" size={36} />
          <Layout.FlexCol w="100%">
            {/* FIXME: 디자인 시스템에 대응되는 폰트 없음 */}
            <Font.Body type="14_semibold" color="MEDIUM_GRAY">
              {t('text')}
            </Font.Body>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              {invitationLink}
            </Typo>
          </Layout.FlexCol>
          <SvgIcon name="share_default" size={44} />
        </ActionRow>
        {inviteCode && (
          <>
            <ActionRow type="button" onClick={handleClickCopyCode}>
              <Layout.FlexCol w="100%">
                {/* FIXME: 디자인 시스템에 대응되는 폰트 없음 */}
                <Font.Body type="14_semibold" color="MEDIUM_GRAY">
                  {t('copy_code_text')}
                </Font.Body>
                <Typo type="body-medium" color="MEDIUM_GRAY">
                  {inviteCode}
                </Typo>
              </Layout.FlexCol>
              <SvgIcon name="share_default" size={44} />
            </ActionRow>
            <Typo type="label-small" color="MEDIUM_GRAY">
              {t('code_disclaimer')}
            </Typo>
          </>
        )}
      </Layout.FlexCol>
      {toastText && <ToastMessage text={toastText} closeToastMessage={() => setToastText(null)} />}
    </>
  );
}
