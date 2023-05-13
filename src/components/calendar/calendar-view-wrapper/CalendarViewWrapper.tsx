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
    <Layout.FlexCol>
      <CalendarHeader
        title={title}
        onClickPrevBtn={onClickPrevBtn}
        onClickNextBtn={onClickNextBtn}
      />
      <Layout.FlexCol>
        <StyledCalendarTable>
          <CalendarTableHeader />
          <tbody>{children}</tbody>
        </StyledCalendarTable>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default CalendarViewWrapper;
