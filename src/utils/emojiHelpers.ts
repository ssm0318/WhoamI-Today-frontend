export const getUnifiedEmoji = (emoji: string): string => {
  // 모든 codePoint를 순회하면서 16진수로 변환하고 '-'로 join
  const codePoints = Array.from(emoji)
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter(Boolean); // undefined 필터링

  // relaxed emoji 보정도 같이 적용
  if (codePoints.length === 1 && codePoints[0] === '263a') {
    return '263a-fe0f';
  }

  return codePoints.join('-');
};
