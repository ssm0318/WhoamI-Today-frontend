import styled from 'styled-components';
import { Colors, CommonInput, Layout } from '@design-system';

interface DropdownItemProps {
  isSelected?: boolean;
}

export const HashtagSelectInputContainer = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 4px;
`;

export const InputWrapper = styled.div`
  width: 100%;
  position: relative;
`;

interface TagsContainerProps {
  hasSelectedTags: boolean;
}

export const TagsContainer = styled(Layout.FlexRow).attrs<TagsContainerProps>(
  ({ hasSelectedTags }) => ({
    flexWrap: 'wrap',
    gap: hasSelectedTags ? 8 : 0,
    alignItems: 'center',
  }),
)<TagsContainerProps>`
  flex-wrap: wrap;
  padding-top: 12px;
  border: none;
  background-color: transparent;
  padding-bottom: 14px;
  border-bottom: 1px solid ${Colors.MEDIUM_GRAY};

  &:focus-within {
    border-bottom-width: 2px;
    border-bottom-color: ${Colors.PRIMARY};
  }
`;

export const TagWrapper = styled.div`
  flex-shrink: 0;
`;

export const SelectedTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: ${Colors.WHITE};
  border: 1px solid ${Colors.BLACK};
  border-radius: 100px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  white-space: nowrap;
`;

export const InputContainer = styled.div<{ hasSelectedTags: boolean }>`
  ${({ hasSelectedTags }) =>
    hasSelectedTags
      ? `
    flex: 1;
    min-width: 120px;
  `
      : `
    width: 100%;
  `}
`;

export const StyledInput = styled(CommonInput)<{ hasSelectedTags: boolean }>`
  border: none;
  padding: 0;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: ${({ hasSelectedTags }) => (hasSelectedTags ? '16px' : '18px')};

  &::placeholder {
    color: ${Colors.MEDIUM_GRAY};
  }

  &:focus {
    border-bottom: none;
  }
`;

export const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background-color: ${Colors.WHITE};
  border: 1px solid ${Colors.BLACK};
  border-radius: 8px;
  /* 하단 탭을 가리지 않도록 4개 항목 분만 노출 (항목 높이 ~48px × 4) */
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const DropdownItem = styled.div<DropdownItemProps>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? Colors.LIGHT_GRAY : Colors.WHITE)};
  transition: background-color 0.2s;
  border-bottom: 1px solid ${Colors.LIGHT_GRAY};

  &:hover {
    background-color: ${Colors.LIGHT_GRAY};
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;
