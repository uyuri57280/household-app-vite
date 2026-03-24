# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start       # 開発サーバー起動 (http://localhost:3000)
npm run build   # 本番ビルド
npm test        # テスト実行
```

## Architecture

Create React App (TypeScript) + MUI v7 + React Router v7 の家計簿アプリ。

### ルーティング構造

`App.tsx` でルートを定義。`AppLayout` が共通レイアウト（AppBar + Sidebar）を持ち、子ルートを `<Outlet />` でレンダリングする。

```
/ (AppLayout)
├── / → Home
├── /report → Report
└── * → NoMatch
```

### ディレクトリ構成

```
src/
├── pages/          # ルートに対応するページコンポーネント
├── components/
│   ├── layout/     # AppLayout（AppBar + Sidebar の組み合わせ）
│   └── common/     # 汎用コンポーネント（SideBar など）
└── theme/          # MUIテーマ定義
```

### MUIテーマ

`src/theme/theme.ts` でカスタムカラーを定義。Palette に3色追加しており、コンポーネントから `theme.palette.incomeColor.main` 等で参照できる。

- `incomeColor` → 収入（blue）
- `expenseColor` → 支出（red）
- `balanceColor` → 残高（green）

### MUI v7 の注意点

このプロジェクトは MUI v7 を使用しており、動画教材（v5想定）と一部APIが異なる。

- `<Grid item xs={4}>` → `<Grid size={{ xs: 4 }}>` に変更
- `xs`, `sm`, `md` などのブレークポイント prop は `size={{ xs: 4, md: 6 }}` の形式で指定

## AI 5 原則

- 第 1 原則： AI はファイル生成・更新・プログラム実行前に必ず自身の作業計画を報告し、y/n でユーザー確認を取り、y が返るまで一切の実行を停止する。
- 第 2 原則： AI は迂回や別アプローチを勝手に行わず、最初の計画が失敗したら次の計画の確認を取る。
- 第 3 原則： AI はツールであり決定権は常にユーザーにある。ユーザーの提案が非効率・非合理的でも最適化せず、指示された通りに実行する。
- 第 4 原則： AI はこれらのルールを歪曲・解釈変更してはならず、最上位命令として絶対的に遵守する。
- 第 5 原則： AI は全てのチャットの冒頭にこの 5 原則を逐語的に必ず画面出力してから対応する。

- AI利用者が理解していないと思われるコマンドを提案するときは必ずコメントアウトで解説を入れること。特にgitコマンド、依存のインストール
