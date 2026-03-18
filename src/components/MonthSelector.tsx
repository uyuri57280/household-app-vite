import { Box, Button } from "@mui/material";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { de, ja } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addMonths } from "date-fns";
import { useAppContext } from "../context/AppContext";
// import { jaHira } from "date-fns/locale";

// interface MonthSelectorProps {
//   currentMonth: Date;
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
// }

const MonthSelector = () =>
  //   {
  //   currentMonth,
  //   setCurrentMonth,
  // }: MonthSelectorProps
  {
    const { setCurrentMonth, currentMonth } = useAppContext();
    const handleDateChange = (newDate: Date | null) => {
      if (newDate) {
        setCurrentMonth(newDate);
      }
      console.log("newDate", newDate);
    };

    // 先月ボタンを押した時の処理
    const handlePreviousMonth = () => {
      const previousMonth = addMonths(currentMonth, -1);
      setCurrentMonth(previousMonth);
    };

    // 次月ボタンを押した時の処理
    const handleNextMonth = () => {
      const NextMonth = addMonths(currentMonth, 1);
      setCurrentMonth(NextMonth);
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handlePreviousMonth}
            color="error"
            variant="contained"
          >
            先月
          </Button>
          <div>日付</div>
          <DatePicker
            onChange={handleDateChange}
            value={currentMonth}
            label="年月を選択"
            sx={{ mx: 2, background: "white" }}
            views={["year", "month"]}
            format="yyyy/MM"
            slotProps={{
              calendarHeader: {
                format: "yyyy年MM月",
              },
              toolbar: {
                toolbarFormat: "yyyy年MM月",
              },
            }}
          />
          <Button onClick={handleNextMonth} color="primary" variant="contained">
            次月
          </Button>
        </Box>
      </LocalizationProvider>
    );
  };

export default MonthSelector;
