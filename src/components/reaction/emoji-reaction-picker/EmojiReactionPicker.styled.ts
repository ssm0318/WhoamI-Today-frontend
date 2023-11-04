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
        border: 1px solid ${theme.CALENDAR_TODAY}  !important;
        background-color: ${theme.BACKGROUND_COLOR} !important;
      }
    `,
  )}
`;
