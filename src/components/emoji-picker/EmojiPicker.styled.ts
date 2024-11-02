import { createGlobalStyle } from 'styled-components';

type EmojiPickerCustomStyleProps = {
  unifiedList: string[];
};

export const EmojiPickerCustomStyle = createGlobalStyle<EmojiPickerCustomStyleProps>`
${({ unifiedList, theme }) =>
  unifiedList &&
  unifiedList.map(
    (unified) => `
      .EmojiPickerReact [data-unified='${unified}'] {
        background-color: ${theme.SECONDARY} !important;
      }
    `,
  )}
`;
