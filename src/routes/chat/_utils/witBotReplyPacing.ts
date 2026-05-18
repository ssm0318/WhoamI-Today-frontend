import { BotPayload } from '@models/chat';

const FIRST_REPLY_DELAY_MS = 320;
const CARD_REPLY_DELAY_MS = 420;
const FOLLOWUP_BASE_DELAY_MS = 480;
const LONG_TEXT_CAP_MS = 1200;
const TEXT_CHARS_PER_EXTRA_MS = 4;

interface PaceableBotReply {
  content?: string | null;
  bot_payload?: BotPayload | null;
}

export function getWitBotReplyRevealDelay(reply: PaceableBotReply, index: number): number {
  if (index === 0) return FIRST_REPLY_DELAY_MS;

  if (reply.bot_payload?.kind === 'card') {
    return CARD_REPLY_DELAY_MS;
  }

  const contentLength = reply.content?.trim().length ?? 0;
  const textDelay = FOLLOWUP_BASE_DELAY_MS + contentLength * TEXT_CHARS_PER_EXTRA_MS;
  return Math.min(textDelay, LONG_TEXT_CAP_MS);
}
