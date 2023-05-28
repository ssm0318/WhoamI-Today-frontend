export const isEmojiOnly = (text: string) => {
  // eslint-disable-next-line no-misleading-character-class
  const pattern = /^(?:[\p{Emoji}\u2614\uFE0F\u{1F3F4}\u{1F3F3}]+\s*)+$/u;
  return pattern.test(text);
};
