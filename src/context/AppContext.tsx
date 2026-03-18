import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Transaction } from "../types";
import { useMediaQuery, useTheme } from "@mui/material";
import { schema } from "../validations/schema";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { formatMonth } from "../utils/formatting";

interface AppContextType {
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
  onSaveTransaction: (transaction: schema) => Promise<void>;
  onDeleteTransaction: (
    transactionIds: string | readonly string[],
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: schema,
    transactionId: string,
  ) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  function isFireStoreError(
    err: unknown,
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  const handleSaveTransaction = async (transaction: schema) => {
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "transactions"), transaction);
      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions((prevTransaction) => [
        ...prevTransaction,
        newTransaction,
      ]);
    } catch (error) {
      if (isFireStoreError(error)) {
        console.error("Firebase Error:", error);
      } else {
        console.error("一般的なエラー:", error);
      }
    }
  };

  // firestoreからデータを削除する処理
  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[],
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];

      // DBからデータを削除
      for (const id of idsToDelete) {
        await deleteDoc(doc(db, "transactions", id));
      }

      // フロントの更新
      const filterdTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id),
      );
      setTransactions(filterdTransactions);
    } catch (error) {
      if (isFireStoreError(error)) {
        console.error("Firebase Error:", error);
      } else {
        console.error("一般的なエラー:", error);
      }
    }
  };

  // firestoreからデータを更新する処理
  const handleUpdateTransaction = async (
    transaction: schema,
    transactionId: string,
  ) => {
    try {
      //firestore更新処理
      const docRef = doc(db, "transactions", transactionId);
      await updateDoc(docRef, transaction);
      // フロントの更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t,
      ) as Transaction[];
      setTransactions(updatedTransactions);
    } catch (error) {
      if (isFireStoreError(error)) {
        console.error("Firebase Error:", error);
      } else {
        console.error("一般的なエラー:", error);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        isMobile,
        onSaveTransaction: handleSaveTransaction,
        onDeleteTransaction: handleDeleteTransaction,
        onUpdateTransaction: handleUpdateTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("グローバルなデータはプロバイダーの中で取得して下さい。");
  }
  return context;
};
