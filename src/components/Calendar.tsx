import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "../calendar.css";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import { calclateDailyBalances } from "../utils/financeCalculations";
import { Balance, CalendarContent, Transaction } from "../types";
import { formatCurrency } from "../utils/formatting";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";
import useMonthlyTransactions from "../hooks/useMonthlyTransactions";
import { useAppContext } from "../context/AppContext";

interface CalendarProps {
  // monthlyTransactions: Transaction[];
  // setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
  onDateClick: (dateInfo: DateClickArg) => void;
}

const Calendar = ({
  // monthlyTransactions,
  // setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
  onDateClick,
}: CalendarProps) => {
  const theme = useTheme();
  const monthlyTransactions = useMonthlyTransactions();
  const { setCurrentMonth } = useAppContext();

  // 各日付の収支を計算する
  const dailyBalances = calclateDailyBalances(monthlyTransactions);
  const createCarendarEvents = (
    daylyBalances: Record<string, Balance>,
  ): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };
  const calendarEvents = createCarendarEvents(dailyBalances);

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  };
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className="money" id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>

        <div className="money" id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>

        <div className="money" id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  const handleDateSet = (dateSetInfo: DatesSetArg) => {
    const currentMonth = dateSetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if (isSameMonth(currentMonth, todayDate)) {
      setCurrentDay(today);
    }
  };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
    />
  );
};

export default Calendar;
