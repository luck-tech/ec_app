# ECアプリケーションプロジェクト技術仕様書

## プロジェクト概要

このプロジェクトは、ECサイト（電子商取引サイト）のフルスタックWebアプリケーションです。
フロントエンド、バックエンドAPI、E2Eテストの3つのワークスペースからなるモノレポ構成になっています。

## 技術スタック

### Webサーバー（フロントエンド）
- **フレームワーク**: React 19.0.0
- **ビルドツール**: Vite 6.0.11
- **言語**: TypeScript 5.7.3
- **CSSフレームワーク**: Tailwind CSS 4.0.1
- **状態管理**: React Router DOM 7.1.3、TanStack React Query 5.65.1
- **エラーハンドリング**: React Error Boundary 5.0.0
- **開発サーバー**: Vite Dev Server (デフォルトポート: 3000)

### アプリケーションサーバー（バックエンドAPI）
- **フレームワーク**: Express.js 4.21.2
- **言語**: TypeScript 5.7.3
- **ランタイム**: Node.js (tsx 4.19.2 for development)
- **ORM**: Prisma 6.3.0 with Prisma Client
- **認証**: JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3
- **バリデーション**: Zod 3.24.1、express-validator 7.2.1
- **セキュリティ**: Helmet 8.0.0
- **ログ**: Morgan 1.10.0
- **ファイルアップロード**: Multer 1.4.5-lts.1
- **テスト**: Jest 29.7.0
- **開発サーバー**: Express Server (デフォルトポート: 8000)

### データベースサーバー
- **RDBMS**: MySQL
- **ORM**: Prisma
- **マイグレーション**: Prisma Migrate
- **シード**: Prisma Seed

### テスト環境
- **E2Eテスト**: Puppeteer 24.1.1 + Jest
- **APIテスト**: Jest + Cross-fetch

## ディレクトリ構造と役割

### ルートディレクトリ
```
ec_app/
├── package.json          # モノレポ設定、ワークスペース管理
├── LICENSE               # ライセンス情報
├── api/                  # バックエンドAPIサーバー
├── front/                # フロントエンドWebアプリケーション
└── e2e/                  # E2Eテスト
```

### APIディレクトリ (`api/`)
```
api/
├── package.json          # API依存関係とスクリプト
├── tsconfig.json         # TypeScript設定
├── eslint.config.js      # ESLint設定
├── jest.config.js        # Jestテスト設定
├── bin/
│   └── run_server.ts     # サーバー起動エントリーポイント
├── prisma/
│   ├── schema.prisma     # データベーススキーマ定義
│   ├── seed.ts           # データベース初期データ設定
│   ├── migrations/       # マイグレーションファイル
│   └── seed/             # シードデータファイル
├── src/
│   ├── app.ts            # Expressアプリケーション設定
│   ├── server.ts         # サーバー起動ロジック
│   ├── constants/        # 定数定義
│   ├── db/               # データベース接続設定
│   ├── lib/              # ユーティリティライブラリ
│   │   ├── errors.ts     # エラーハンドリング
│   │   ├── hash_password.ts  # パスワードハッシュ化
│   │   └── jwt_token.ts  # JWT認証
│   ├── loaders/
│   │   └── express.ts    # Expressミドルウェア設定
│   ├── middlewares/      # カスタムミドルウェア
│   ├── models/           # データモデル
│   ├── routes/           # APIルート定義
│   └── types/            # TypeScript型定義
├── __tests__/            # APIテスト
└── public/
    └── image/            # 静的画像ファイル
```

### フロントエンドディレクトリ (`front/`)
```
front/
├── package.json          # フロントエンド依存関係とスクリプト
├── vite.config.ts        # Vite設定（プロキシ設定含む）
├── tsconfig.json         # TypeScript設定
├── tailwind.config.js    # Tailwind CSS設定
├── postcss.config.js     # PostCSS設定
├── eslint.config.js      # ESLint設定
├── index.html            # HTMLエントリーポイント
└── src/
    ├── main.tsx          # Reactアプリケーションエントリーポイント
    ├── app.tsx           # アプリケーションルートコンポーネント
    ├── index.css         # グローバルスタイル
    ├── api/              # APIクライアント
    ├── components/       # 再利用可能コンポーネント
    ├── constants/        # フロントエンド定数
    ├── hooks/            # カスタムReactフック
    ├── lib/              # ユーティリティライブラリ
    ├── pages/            # ページコンポーネント
    ├── providers/        # Reactコンテキストプロバイダー
    ├── routes/           # ルーティング設定
    └── types/            # TypeScript型定義
```

### E2Eテストディレクトリ (`e2e/`)
```
e2e/
├── package.json          # E2Eテスト依存関係とスクリプト
├── jest-puppeteer.config.js  # Puppeteer設定
├── jest.config.js        # Jest設定
├── tsconfig.json         # TypeScript設定
└── src/
    ├── check_puppeteer.ts    # Puppeteer動作確認
    ├── pages/                # ページオブジェクトモデル
    └── usecase/              # E2Eテストユースケース
```

## データベーススキーマ

### テーブル構成
- **users**: ユーザー情報（ID、メール、名前、パスワード）
- **products**: 商品情報（ID、名前、価格、画像名、在庫ID）
- **stocks**: 在庫情報（ID、数量）
- **orders**: 注文情報（ID、ユーザーID）
- **order_details**: 注文詳細（ID、商品ID、注文ID、価格、数量）

### リレーション
- User 1:N Order
- Product 1:1 Stock
- Product 1:N OrderDetail
- Order 1:N OrderDetail

## 開発・実行環境

### ポート設定
- フロントエンド: 3000番ポート
- バックエンドAPI: 8000番ポート
- プロキシ設定により、フロントエンドから `/api` と `/image` へのリクエストはバックエンドにプロキシされる