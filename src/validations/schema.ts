import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "日付は必須です" }), // min(1)これは1文字以上
  amount: z.number().min(1, { message: "金額は必須です" }), // min(1)これは値1以上
  content: z
    .string()
    .min(1, { message: "内容は必須です" })
    .max(50, { message: "内容は50文字以内にしてください" }),
  category: z
    .union([
      z.enum(["食費", "日用品", "住居費", "交際費", "娯楽", "交通費"]),
      z.enum(["給与", "副収入", "お小遣い"]),
      z.literal(""),
    ])
    .refine((val) => val !== "", { message: "カテゴリを選択してください" }),
});

export type schema = z.infer<typeof transactionSchema>;
