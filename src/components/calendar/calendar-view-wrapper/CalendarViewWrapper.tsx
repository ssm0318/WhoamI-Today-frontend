import { ReactNode } from 'react';
import { Layout } from '@design-system';
import { CALENDAR_VIEW } from '@models/calendar';
import CalendarHeader from './calendar-header/CalendarHeader';
import CalendarTableHeader from './calendar-table-header/CalendarTableHeader';
import { StyledCalendarTable } from './CalendarViewWrapper.styled';

interface CalendarViewWrapperProps {
  type: CALENDAR_VIEW;
  title: string;
  children: ReactNode;
  currentDate: Date;
  onClickPrevBtn: () => void;
  onClickNextBtn: () => void;
}

function CalendarViewWrapper({
  type,
  title,
  children,
  currentDate,
  onClickPrevBtn,
  onClickNextBtn,
}: CalendarViewWrapperProps) {
  return (
    <Layout.FlexCol w="100%" pl={18} pr={17} pt={14}>
      <CalendarHeader
        type={type}
        title={title}
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
