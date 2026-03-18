import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import NoMatch from "./pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Transaction } from "./types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { formatMonth } from "./utils/formatting";
import { schema } from "./validations/schema";
import { AppContextProvider } from "./context/AppContext";
import { isFireStoreError } from "./utils/errorHandling";

function App() {
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [isLoading, setIsLoading] = useState(true);

  // const handleSaveTransaction = async (transaction: schema) => {
  //   try {
  //     // Add a new document with a generated id.
  //     const docRef = await addDoc(collection(db, "transactions"), transaction);
  //     const newTransaction = {
  //       id: docRef.id,
  //       ...transaction,
  //     } as Transaction;
  //     setTransactions((prevTransaction) => [
  //       ...prevTransaction,
  //       newTransaction,
  //     ]);
  //   } catch (error) {
  //     if (isFireStoreError(error)) {
  //       console.error("Firebase Error:", error);
  //     } else {
  //       console.error("一般的なエラー:", error);
  //     }
  //   }
  // };

  // // firestoreからデータを削除する処理
  // const handleDeleteTransaction = async (
  //   transactionIds: string | readonly string[],
  // ) => {
  //   try {
  //     const idsToDelete = Array.isArray(transactionIds)
  //       ? transactionIds
  //       : [transactionIds];

  //     // DBからデータを削除
  //     for (const id of idsToDelete) {
  //       await deleteDoc(doc(db, "transactions", id));
  //     }

  //     // フロントの更新
  //     const filterdTransactions = transactions.filter(
  //       (transaction) => !idsToDelete.includes(transaction.id),
  //     );
  //     setTransactions(filterdTransactions);
  //   } catch (error) {
  //     if (isFireStoreError(error)) {
  //       console.error("Firebase Error:", error);
  //     } else {
  //       console.error("一般的なエラー:", error);
  //     }
  //   }
  // };

  // // firestoreからデータを更新する処理
  // const handleUpdateTransaction = async (
  //   transaction: schema,
  //   transactionId: string,
  // ) => {
  //   try {
  //     //firestore更新処理
  //     const docRef = doc(db, "transactions", transactionId);
  //     await updateDoc(docRef, transaction);
  //     // フロントの更新
  //     const updatedTransactions = transactions.map((t) =>
  //       t.id === transactionId ? { ...t, ...transaction } : t,
  //     ) as Transaction[];
  //     setTransactions(updatedTransactions);
  //   } catch (error) {
  //     if (isFireStoreError(error)) {
  //       console.error("Firebase Error:", error);
  //     } else {
  //       console.error("一般的なエラー:", error);
  //     }
  //   }
  // };

  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route
                index
                element={
                  <Home
                  // monthlyTransactions={monthlyTransactions}
                  // setCurrentMonth={setCurrentMonth}
                  // onSaveTransaction={handleSaveTransaction}
                  // onDeleteTransaction={handleDeleteTransaction}
                  // onUpdateTransaction={handleUpdateTransaction}
                  />
                }
              />
              <Route
                path="/report"
                element={
                  <Report
                  // currentMonth={currentMonth}
                  // setCurrentMonth={setCurrentMonth}
                  // monthlyTransactions={monthlyTransactions}
                  // isLoading={isLoading}
                  // onDeleteTransaction={handleDeleteTransaction}
                  />
                }
              />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
