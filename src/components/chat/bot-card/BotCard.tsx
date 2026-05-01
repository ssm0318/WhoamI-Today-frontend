import { BotButton, BotPayload } from '@models/chat';
import { ButtonRow, PrimaryChip, SecondaryChip } from './BotCard.styled';

interface Props {
  payload: BotPayload;
  disabled?: boolean;
  onButtonClick?: (button: BotButton) => void;
}

const PRIMARY_PAYLOADS = new Set(['admin']);

export function BotCard({ payload, disabled, onButtonClick }: Props) {
  if (payload.kind !== 'card' || !payload.buttons?.length) return null;

  return (
    <ButtonRow>
      {payload.buttons.map((button) => {
        const Chip =
          button.payload && PRIMARY_PAYLOADS.has(button.payload) ? PrimaryChip : SecondaryChip;
        return (
          <Chip
            key={`${button.action}-${button.payload ?? button.url ?? button.label}`}
            disabled={disabled}
            onClick={() => onButtonClick?.(button)}
          >
            {button.label}
          </Chip>
        );
      })}
    </ButtonRow>
  );
}
