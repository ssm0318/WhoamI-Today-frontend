import { ReactNode } from 'react';
import { Layout } from '@design-system';
import { CALENDAR_VIEW } from '@models/calendar';
import CalendarHeader from './calendar-header/CalendarHeader';
import CalendarTableHeader from './calendar-table-header/CalendarTableHeader';
import { StyledCalendarTable } from './CalendarViewWrapper.styled';

interface CalendarViewWrapperProps {
  type: CALENDAR_VIEW;
  children: ReactNode;
  currentDate: Date;
  onClickPrevBtn: () => void;
  onClickNextBtn: () => void;
}

function CalendarViewWrapper({
  type,
  children,
  currentDate,
  onClickPrevBtn,
  onClickNextBtn,
}: CalendarViewWrapperProps) {
  return (
    <Layout.FlexCol w="100%" pl={18} pr={17} pt={14}>
      <CalendarHeader
        type={type}
        currentDate={currentDate}
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
