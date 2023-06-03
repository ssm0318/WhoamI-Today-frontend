export const isEmojiOnly = (text: string) => {
  const pattern =
    /^(?:(?:[\u{1F000}-\u{1FFFF}\u{20000}-\u{3FFFF}\u{E0000}-\u{EFFFF}\u{FE000}-\u{FEFFF}\u{FF000}-\u{FFFFF}])+\s*)+$/u;
  return pattern.test(text);
};
