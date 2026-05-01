import styled from 'styled-components';
import { Colors } from '@design-system';

export const PhotoPlaceholder = styled.div`
  width: 100%;
  min-height: 280px;
  border: 2px dashed ${Colors.LIGHT_GRAY};
  border-radius: 16px;
  background-color: ${Colors.INPUT_GRAY};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
`;

export const PhotoOptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 20px;
  border-radius: 22px;
  border: 1.5px solid ${Colors.LIGHT_GRAY};
  background-color: ${Colors.WHITE};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background-color: ${Colors.LIGHT};
  }
`;

export const PhotoPreviewContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const PreviewImage = styled.img`
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 12px;
  background-color: ${Colors.LIGHT};
  display: block;
`;

export const ActionPill = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  background-color: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background-color: ${Colors.INPUT_GRAY};
  }
`;

export const CaptionInput = styled.textarea`
  width: 100%;
  margin-top: 20px;
  border: none;
  outline: none;
  resize: none;
  font-size: 16px;
  line-height: 1.4;
  padding: 8px;
  background: transparent;
  font-family: inherit;
  color: ${Colors.BLACK};
  box-sizing: border-box;

  &::placeholder {
    color: ${Colors.MEDIUM_GRAY};
  }
`;
