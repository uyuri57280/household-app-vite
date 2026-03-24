// vitest の型定義を含む defineConfig を使う
// `vite` の defineConfig では `test` プロパティの型が存在せずエラーになるため
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // vitest の設定ブロック
  // `npm test` または `npm exec vitest run` で実行される
  test: {
    // describe / it / expect などをファイル先頭で import せずに使えるようにする
    // false にすると各テストファイルで `import { expect } from "vitest"` が必要になる
    globals: true,

    // テスト実行環境をブラウザ相当の DOM に設定する
    // React コンポーネントは DOM がないとレンダリングできないため jsdom を使う
    // jsdom は Node.js 上で動く DOM エミュレーター（package.json に jsdom が必要）
    environment: "jsdom",

    // 各テストファイルが実行される前に読み込むセットアップファイルを指定する
    // @testing-library/jest-dom が提供する toBeInTheDocument() などの
    // カスタムマッチャーをここで登録する
    setupFiles: "./src/setupTests.ts",
  },
});
