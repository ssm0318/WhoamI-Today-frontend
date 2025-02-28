import styled from 'styled-components';

export const StyledRadioButton = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;

  label {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
  }

  input[type='radio'] {
    appearance: none;
    width: 24px;
    height: 24px;
    border: 2px solid ${({ theme }) => theme.MEDIUM_GRAY};
    border-radius: 50%;
    margin-right: 12px;
    position: relative;
    flex-shrink: 0;

    &:checked {
      border-color: ${({ theme }) => theme.PRIMARY};
      background-color: transparent;

      &:after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        background-color: ${({ theme }) => theme.PRIMARY};
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    pointer-events: none;
  `}
`;
