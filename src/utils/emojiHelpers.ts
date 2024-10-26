export const getUnifiedEmoji = (emoji: string) => {
  const codePoint = emoji.codePointAt(0)?.toString(16) || '';

  // NOTE 예외적으로 relaxed emoji의 경우 -fe0f를 붙여주어야 함
  if (codePoint === '263a') {
    return '263a-fe0f';
  }

  return codePoint;
};
