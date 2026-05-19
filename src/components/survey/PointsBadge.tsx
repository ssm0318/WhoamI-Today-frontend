import styled, { css } from 'styled-components';

import { PointAwardSummary } from '@models/reimbursement';

import { REIMBURSEMENT_POINTS_TBU } from '../../utils/reimbursementAvailability';

type PointsBadgeState = 'earnable' | 'locked' | 'earned' | 'adjusted';

interface PointsBadgeProps {
  pointValue: number;
  pointAward?: PointAwardSummary | null;
  locked?: boolean;
  onLockedClick?: () => void;
  className?: string;
}

const formatPoints = (points: number): string => `${points} pts`;

function resolveState(
  pointValue: number,
  pointAward?: PointAwardSummary | null,
  locked?: boolean,
): PointsBadgeState | null {
  if (pointAward) {
    if (
      pointAward.adjusted_points !== null &&
      pointAward.adjusted_points !== pointAward.awarded_points
    ) {
      return 'adjusted';
    }
    return 'earned';
  }
  if (pointValue <= 0) return null;
  return locked ? 'locked' : 'earnable';
}

function PointsBadge({
  pointValue,
  pointAward,
  locked = false,
  onLockedClick,
  className,
}: PointsBadgeProps) {
  if (REIMBURSEMENT_POINTS_TBU) return null;

  const state = resolveState(pointValue, pointAward, locked);
  if (!state) return null;

  const effectivePoints = pointAward?.effective_points ?? pointValue;
  const content = (() => {
    if (state === 'locked') return <>🔒 +{formatPoints(pointValue)}</>;
    if (state === 'earned') return <>✓ +{formatPoints(effectivePoints)}</>;
    if (state === 'adjusted' && pointAward) {
      return (
        <>
          +{formatPoints(effectivePoints)}
          <OriginalValue>{formatPoints(pointAward.awarded_points)}</OriginalValue>
        </>
      );
    }
    return <>+{formatPoints(pointValue)}</>;
  })();

  if (state === 'locked' && onLockedClick) {
    return (
      <BadgeButton
        type="button"
        $state={state}
        className={className}
        onClick={(event) => {
          event.stopPropagation();
          onLockedClick();
        }}
      >
        {content}
      </BadgeButton>
    );
  }

  return (
    <BadgeSpan $state={state} className={className}>
      {content}
    </BadgeSpan>
  );
}

const badgeStyles = css<{ $state: PointsBadgeState }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 24px;
  flex: 0 0 auto;
  border-radius: 8px;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  background: ${({ $state }) => {
    if ($state === 'locked') return '#f6f6f7';
    if ($state === 'earned' || $state === 'adjusted') return '#e8f6ee';
    return '#f3e8ff';
  }};
  color: ${({ $state }) => {
    if ($state === 'locked') return '#6f6f78';
    if ($state === 'earned' || $state === 'adjusted') return '#227447';
    return '#8700ff';
  }};
  border: 1px ${({ $state }) => ($state === 'locked' ? 'dashed' : 'solid')}
    ${({ $state }) => {
      if ($state === 'locked') return '#b8b8c2';
      if ($state === 'earned' || $state === 'adjusted') return '#b8dfc7';
      return '#d8c3ff';
    }};
`;

const BadgeSpan = styled.span<{ $state: PointsBadgeState }>`
  ${badgeStyles}
`;

const BadgeButton = styled.button<{ $state: PointsBadgeState }>`
  ${badgeStyles}
`;

const OriginalValue = styled.s`
  color: inherit;
  opacity: 0.75;
  font-weight: 600;
`;

export default PointsBadge;
