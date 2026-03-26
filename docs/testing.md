# テスト設計（Vitest / React Testing Library）

単体テスト仕様書「ホーム画面」とプランで合意した内容に基づくテスト方針と、実装・実行の要点をまとめる。

## 実行環境

| 項目 | 内容 |
|------|------|
| ランナー | Vitest（Vite の設定と統合） |
| DOM | `jsdom`（[`vite.config.ts`](../vite.config.ts) の `test.environment`） |
| グローバル API | `describe` / `it` / `expect` は `test.globals: true` で import 不要 |
| セットアップ | [`src/setupTests.ts`](../src/setupTests.ts) で `@testing-library/jest-dom` を読み込み |

### コマンド

```bash
# 一度だけ実行（CI 向き）
npx vitest run

# ウォッチ（開発時）
npm test
```

任意の改善: CI では `"test": "vitest run"` または `test:ci` スクリプトでウォッチと分離する。

---

## 仕様ケース 1〜6（プランでの整理）

単体テスト仕様書「ホーム画面」のマトリクスを、入力条件と出力結果で要約したもの。

### ケース1: 画面初期表示

- **入力条件**: ホーム画面を初期表示する。
- **出力結果**: カレンダーが更新表示される。1ヶ月の収支合計（月次）が更新表示される。1日の収支合計（日次）が更新表示される。

### ケース2: 月の前後表示

- **入力条件**: 先月／来月を表示する（カレンダーで月を移動する）。
- **出力結果**: カレンダー表示が対象月に合わせて更新される。月次・日次の収支合計が更新表示される。

### ケース3: 日付選択

- **入力条件**: カレンダーから日付を選択する。
- **出力結果**: 選択した日の内訳（取引一覧・詳細エリア）を表示できる。

### ケース4: 新規追加

- **入力条件**: 「内訳を追加」→ モーダルでカテゴリ・金額・内容を入力 → 収入または支出を選択 → 「保存」。
- **出力結果**: 新規追加用フォームが表示される。収入時はカテゴリ 3 件、支出時は 6 件。入力が反映され保存され、一覧に追加され、Firestore に追加される。

### ケース5: 削除

- **入力条件**: 対象の収支を選択し「削除」。
- **出力結果**: 一覧から削除され、DB から削除される。

### ケース6: 更新

- **入力条件**: 対象を選択しモーダルで変更 → 収入または支出を選択 → 「更新」。
- **出力結果**: 一覧が更新表示され、DB が更新される。

---

## 自動テストでのカバー方針（プラン）

| 仕様ケース | 単体テスト（Vitest + RTL） | 備考 |
|------------|----------------------------|------|
| **1** | `getDocs` が空のとき、月次サマリの収入・支出・残高が `¥0` 相当で表示される。ラベル「収入」「支出」「残高」を確認。 | 本物の FullCalendar の「カレンダー更新表示」は jsdom 上で扱いづらいため、カレンダーはスタブ化し **存在スモーク** または E2E で補完する設計。 |
| **2** | カレンダー操作に依存するため **未実装（プラン）**。月変更に伴う集計は `useMonthlyTransactions` とモックデータの別テスト、または E2E。 | FullCalendar の DOM 依存を避ける。 |
| **3** | **未実装（プラン）**。日付クリック・ドロワーは E2E 推奨、または `data-testid` 注入などのリファクタ後にユニット化。 | |
| **4** | 「内訳を追加」→ ダイアログ → 支出 6 カテゴリ／収入 3 カテゴリ → 入力して保存 → `addDoc` が期待ペイロードで 1 回呼ばれる。 | [`TransactionForm`](../src/components/TransactionForm.tsx) の定義と一致させる。 |
| **5** | 取引選択 → 削除 → `deleteDoc` が正しい `id` で呼ばれ、当該行が UI から消える。 | 事前に `getDocs` で 1 件返す。 |
| **6** | 取引選択 → フォーム変更 → 更新 → `updateDoc` が期待どおり呼ばれる。 | 同上。 |

---

## 設計上のテスト基盤（ホーム画面結合テスト用）

ホーム画面の RTL テストをプランどおり行う場合の構成。

### Firestore モック

- `vi.mock("firebase/firestore", ...)` で `getDocs` / `addDoc` / `deleteDoc` / `updateDoc` / `collection` / `doc` を差し替える。
- [`src/test/mocks/firebaseFirestore.ts`](../src/test/mocks/firebaseFirestore.ts)（配置例）で `getDocs` 用の疑似 `QuerySnapshot` を生成するヘルパを置く。

### アプリコンテキスト付きレンダラ

- [`src/test/renderWithApp.tsx`](../src/test/renderWithApp.tsx)（配置例）で `ThemeProvider`、`Router`（`MemoryRouter` 等）、`AppContextProvider` をまとめてラップする。
- MUI / FullCalendar で必要なら `ResizeObserver` を [`setupTests.ts`](../src/setupTests.ts) またはテスト先頭でスタブする。

### その他モック

- [`src/firebase.ts`](../src/firebase.ts) の実初期化を避けるため `vi.mock("../firebase", () => ({ db: {} }))` など。
- FullCalendar は jsdom で不安定になりやすいため、`Calendar` を `data-testid="calendar"` の軽いコンポーネントに差し替える（ケース 2・3 は E2E 前提のコメントと併せる）。

### データ読み込み待ち

- `getDocs` 解決後に `waitFor` / `findBy*` でアサートする。

### ホーム画面テストファイル（配置例）

- `src/pages/Home.test.tsx` … ケース 1・4・5・6 を `describe` ブロックで分割して記述する想定。

---

## ユーティリティテスト（実装済み）

[`src/utils/financeCalculations.test.ts`](../src/utils/financeCalculations.test.ts) で次を検証する。

| 対象 | 内容 |
|------|------|
| `financeCalculations` | 複数取引から収入・支出・残高を正しく集計する。空配列ならすべて 0。 |
| `calclateDailyBalances` | 日付ごとの収入・支出・残高（同一日の合算含む）。空配列なら空オブジェクト。 |

カレンダー表示や月次フィルタのロジックの土台となるため、ホーム画面の表示と併せて回帰を防ぐ。

---

## E2E で補う範囲（プラン）

- ケース **2**（月移動）、**3**（日付選択）。
- ケース **1** の「本物のカレンダーが月・データとともに更新表示される」ことの厳密な確認。

Playwright 等を想定。

---

## 関連ファイル一覧

| ファイル | 役割 |
|----------|------|
| [`vite.config.ts`](../vite.config.ts) | Vitest の `test` ブロック |
| [`src/setupTests.ts`](../src/setupTests.ts) | jest-dom |
| [`src/utils/financeCalculations.test.ts`](../src/utils/financeCalculations.test.ts) | 集計ユーティリティの単体テスト |
| `src/test/mocks/firebaseFirestore.ts` | Firestore モック用ヘルパ（設計） |
| `src/test/renderWithApp.tsx` | 共通レンダラ（設計） |
| `src/pages/Home.test.tsx` | ホーム結合テスト（設計） |
