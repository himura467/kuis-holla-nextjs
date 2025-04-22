This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🔧 環境変数の設定方法（開発用）

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下のように記述してください：

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### 説明：

- `NEXT_PUBLIC_API_BASE_URL` は、バックエンドAPIのベースURLです。
- `NEXT_PUBLIC_` を付けることで、React/Next.js のクライアント側からアクセス可能になります。
- `.env.local` は **バージョン管理（Git）に含めない**ように `.gitignore` に登録してください。

```gitignore
.env.local
```

## Lint エラーが発生したときは

```sh
npm run lint-fix:eslint
```

を実行して問題の箇所を調べて直してください。また、

```sh
npm run lint-fix:prettier
```

を実行してコードのフォーマットをお願いします。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
