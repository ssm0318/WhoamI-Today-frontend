import styled from 'styled-components';

export const TmiInputBarWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.PRIMARY};
  padding: 24px 16px;
`;

export const TmiInputBar = styled.button`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.WHITE};
  border: 1.4px solid ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 30px;
  cursor: pointer;
`;

export const PhotoOfTheDayCard = styled.button`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.TERTIARY_PINK};
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
`;

export const SharePhotoButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.DARK};
  border-radius: 12px;
`;
