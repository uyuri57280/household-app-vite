import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import MonthlySummary from "../components/MonthlySummary";
import Calendar from "../components/Calendar";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/TransactionForm";
import { Transaction } from "../types";
import { format } from "date-fns";
import { schema } from "../validations/schema";
import { DateClickArg } from "@fullcalendar/interaction/index.js";
import { useAppContext } from "../context/AppContext";
import useMonthlyTransactions from "../hooks/useMonthlyTransactions";

// interface HomeProps {
//   monthlyTransactions: Transaction[];
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
//   onSaveTransaction: (transaction: schema) => Promise<void>;
//   onDeleteTransaction: (
//     transactionIds: string | readonly string[],
//   ) => Promise<void>;
//   onUpdateTransaction: (
//     transaction: schema,
//     transactionId: string,
//   ) => Promise<void>;
// }

const Home = () =>
  //   {
  //   monthlyTransactions,
  //   setCurrentMonth,
  //   onSaveTransaction,
  //   onDeleteTransaction,
  //   onUpdateTransaction,
  // }: HomeProps
  {
    const { isMobile } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();
    const today = format(new Date(), "yyyy-MM-dd");
    const [currentDay, setCurrentDay] = useState(today);
    const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
      useState<Transaction | null>(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    const dailyTransactions = useMemo(() => {
      return monthlyTransactions.filter((transaction) => {
        return transaction.date === currentDay;
      });
    }, [monthlyTransactions, currentDay]);

    const onCloseForm = () => {
      setSelectedTransaction(null);
      setIsDialogOpen(!isDialogOpen);
    };

    // フォームの開閉処理
    const handleAddTransactionForm = () => {
      setIsDialogOpen(true);
    };

    // 取引を選択した時の処理
    const handleSelectTransaction = (transaction: Transaction) => {
      setSelectedTransaction(transaction);
      setIsDialogOpen(true);
    };

    // モバイルドロワーを閉じる処理
    const handleCloseMobileDrawer = () => {
      setIsMobileDrawerOpen(false);
    };

    const handleDateClick = (dateInfo: DateClickArg) => {
      setCurrentDay(dateInfo.dateStr);
      setIsMobileDrawerOpen(true);
    };

    return (
      <Box sx={{ display: "flex" }}>
        {/* 左側コンテンツ */}
        <Box sx={{ flexGrow: 1 }}>
          <MonthlySummary
          // monthlyTransactions={monthlyTransactions}
          />
          <Calendar
            // monthlyTransactions={monthlyTransactions}
            // setCurrentMonth={setCurrentMonth}
            setCurrentDay={setCurrentDay}
            currentDay={currentDay}
            today={today}
            onDateClick={handleDateClick}
          />
        </Box>
        {/* 右側コンテンツ */}
        <Box>
          <TransactionMenu
            dailyTransactions={dailyTransactions}
            currentDay={currentDay}
            onAddTransactionForm={handleAddTransactionForm}
            onSelectTransaction={handleSelectTransaction}
            // isMobile={isMobile}
            open={isMobileDrawerOpen}
            onClose={handleCloseMobileDrawer}
          />
          <TransactionForm
            isEntryDrawerOpen={isEntryDrawerOpen}
            onCloseForm={onCloseForm}
            currentDay={currentDay}
            // onSaveTransaction={onSaveTransaction}
            selectedTransaction={selectedTransaction}
            // onDeleteTransaction={onDeleteTransaction}
            setSelectedTransaction={setSelectedTransaction}
            // onUpdateTransaction={onUpdateTransaction}
            // isMobile={isMobile}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </Box>
      </Box>
    );
  };

export default Home;
