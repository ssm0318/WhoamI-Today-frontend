import { MouseEvent, ReactNode } from 'react';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Colors, SvgIcon, Typo } from '@design-system';
import i18n from '@i18n/index';

type PromptSummaryCardProps = {
  content: string;
  date?: string | null;
  authorName?: string;
  profileImageUrl?: string | null;
  colorHex?: string;
  width?: string | number;
  sendLabel?: string;
  trailing?: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onSend?: (e: MouseEvent<HTMLButtonElement>) => void;
};

function PromptSummaryCard({
  content,
  date,
  authorName = 'Whoami Today',
  profileImageUrl = '/whoami-profile.svg',
  colorHex,
  width = '100%',
  sendLabel,
  trailing,
  onClick,
  onSend,
}: PromptSummaryCardProps) {
  const formattedDate = formatFullDate(date);
  const cardWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <Card
      $interactive={!!onClick}
      $width={cardWidth}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <PromptRow>
        {colorHex ? (
          <ColorAvatar $color={colorHex} aria-label={`${authorName}-profile`} />
        ) : (
          <ProfileImage imageUrl={profileImageUrl} username={authorName} size={30} />
        )}
        <PromptText>
          <MetaRow>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {formattedDate}
            </Typo>
            {trailing}
          </MetaRow>
          <Typo type="body-large" color="BLACK">
            {content}
          </Typo>
        </PromptText>
      </PromptRow>
      {onSend && (
        <SendButton type="button" onClick={onSend} aria-label={sendLabel ?? 'Send question'}>
          <span style={{ marginTop: 4, display: 'inline-flex' }}>
            <SvgIcon name="question_send" size={18} />
          </span>
          {sendLabel && (
            <Typo type="label-large" color="BLACK" fontWeight={600}>
              {sendLabel}
            </Typo>
          )}
        </SendButton>
      )}
    </Card>
  );
}

export function formatFullDate(date?: string | null): string {
  if (!date) return '';

  let parsed: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number);
    parsed = new Date(year, month - 1, day);
  } else {
    parsed = new Date(date);
  }

  if (Number.isNaN(parsed.getTime())) return '';

  return parsed.toLocaleDateString(i18n.language.startsWith('ko') ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default PromptSummaryCard;

const Card = styled.div<{ $interactive: boolean; $width: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: ${({ $width }) => $width};
  max-width: 100%;
  padding: 10px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 8px;
  background: ${Colors.WHITE};
  text-align: left;
  box-sizing: border-box;
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: ${({ $interactive }) => ($interactive ? Colors.LIGHT : Colors.WHITE)};
  }
`;

const PromptRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`;

const PromptText = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 18px;
`;

const ColorAvatar = styled.div<{ $color: string }>`
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  align-self: flex-end;
  min-height: 34px;
  padding: 6px 12px;
  border: 1px solid ${Colors.DARK_GRAY};
  border-radius: 8px;
  background: ${Colors.WHITE};
`;
