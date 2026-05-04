import { BotButton, BotPayload } from '@models/chat';
import { ButtonRow, PrimaryChip, SecondaryChip } from './BotCard.styled';
import MultiSelectCard from './MultiSelectCard';
import UploadCard from './UploadCard';

interface Props {
  payload: BotPayload;
  disabled?: boolean;
  onButtonClick?: (button: BotButton) => void;
  onMultiSelectSubmit?: (intent: string, selected: string[]) => void;
  onUploadSubmit?: (file: File, context?: string) => void;
}

const PRIMARY_PAYLOADS = new Set(['admin', 'start_onboarding', 'resume_onboarding']);

export function BotCard({
  payload,
  disabled,
  onButtonClick,
  onMultiSelectSubmit,
  onUploadSubmit,
}: Props) {
  if (payload.kind === 'card') {
    if (!payload.buttons?.length) return null;
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

  if (payload.kind === 'multi_select') {
    return (
      <MultiSelectCard
        options={payload.options}
        submitLabel={payload.submit_label}
        minSelection={payload.min_selection}
        maxSelection={payload.max_selection}
        disabled={disabled}
        onSubmit={(selected) => onMultiSelectSubmit?.(payload.intent, selected)}
      />
    );
  }

  if (payload.kind === 'upload') {
    return (
      <UploadCard
        context={payload.context}
        label={payload.label}
        disabled={disabled}
        onSubmit={(file) => onUploadSubmit?.(file, payload.context)}
      />
    );
  }

  // 'choice', 'multi_select_response', 'upload_response' are user-side payloads
  // that the bot doesn't render.
  return null;
}
