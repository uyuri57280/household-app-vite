import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/SideBar";
import { useAppContext } from "../../context/AppContext";
import { collection, getDocs } from "firebase/firestore";
import { Transaction } from "../../types";
import { db } from "../../firebase";

const drawerWidth = 240;

export default function AppLayout() {
  const { setTransactions, setIsLoading, transactions } = useAppContext();

  function isFireStoreError(
    err: unknown,
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  // firestoreからデータを取得する処理
  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "transactions"));
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });
        setTransactions(transactionsData);
      } catch (error) {
        if (isFireStoreError(error)) {
          console.error("Firebase Error:", error);
        } else {
          console.error("一般的なエラー:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box
      sx={{
        display: { md: "flex" },
        bgcolor: (theme) => theme.palette.grey[100],
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            TypeScript × React家計簿
          </Typography>
        </Toolbar>
      </AppBar>
      {/* サイドバー */}
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerClose={handleDrawerClose}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
      />
      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
