import React, { JSX } from "react";

import FastfoodIcon from "@mui/icons-material/Fastfood";
import { ExpenseCategory, IncomeCategory } from "../../types";
import {
  AddBusiness,
  AddHome,
  Diversity3,
  Savings,
  SportsTennis,
  Train,
  Work,
} from "@mui/icons-material";
import { Alarm } from "@mui/icons-material";

const IconComponents: Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
  食費: <FastfoodIcon fontSize="small" />,
  日用品: <Alarm fontSize="small" />,
  住居費: <AddHome fontSize="small" />,
  交際費: <Diversity3 fontSize="small" />,
  娯楽: <SportsTennis fontSize="small" />,
  交通費: <Train fontSize="small" />,
  給与: <Work fontSize="small" />,
  副収入: <AddBusiness fontSize="small" />,
  お小遣い: <Savings fontSize="small" />,
};

export default IconComponents;
