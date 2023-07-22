import styled from 'styled-components';
import { Layout } from '@design-system';
import { Response } from './ResponseItem.styled';

export const QuestionWrapper = styled(Layout.FlexCol).attrs({
  w: '100%',
  bgColor: 'GRAY_11',
  rounded: 12,
  pt: 24,
  pr: 10,
  pb: 24,
  pl: 10,
})``;

export const Question = styled(Layout.FlexCol).attrs({
  w: '100%',
  bgColor: 'BASIC_DISABLED_SOFT',
  rounded: 12,
  pt: 14,
  pr: 20,
  pb: 14,
  pl: 20,
  mb: 22,
})``;

export const ResponseList = styled(Layout.FlexCol).attrs({
  w: '100%',
})`
  ${Response} {
    &:not(:first-child) {
      padding-top: 25px;
    }
    &:not(:last-child) {
      border-bottom: 1.5px solid #e3e3e3;
      padding-bottom: 25px;
    }
  }
`;
