import { ReactNode } from 'react';
import { Layout } from '@design-system';
import CalendarHeader from './calendar-header/CalendarHeader';
import CalendarTableHeader from './calendar-table-header/CalendarTableHeader';
import { StyledCalendarTable } from './CalendarViewWrapper.styled';

interface CalendarViewWrapperProps {
  title: string;
  children: ReactNode;
  onClickPrevBtn: () => void;
  onClickNextBtn: () => void;
}

function CalendarViewWrapper({
  title,
  children,
  onClickPrevBtn,
  onClickNextBtn,
}: CalendarViewWrapperProps) {
  return (
    <Layout.FlexCol w="100%" pl={18} pr={17} pt={14}>
      <CalendarHeader
        title={title}
        onClickPrevBtn={onClickPrevBtn}
        onClickNextBtn={onClickNextBtn}
      />
      <StyledCalendarTable>
        <CalendarTableHeader />
        <tbody>{children}</tbody>
      </StyledCalendarTable>
    </Layout.FlexCol>
  );
}

export default CalendarViewWrapper;
