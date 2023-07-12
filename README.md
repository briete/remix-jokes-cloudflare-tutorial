# Remix Jokes チュートリアル For Cloudflare

以下のチュートリアルをCloudflare Pages + Cloudflare D1 + Cloudflare Accessに対応させたチュートリアルのサンプルコードです。

[Remix Jokes App Tutorial](https://remix.run/docs/en/main/tutorials/jokes)

## 事前準備

### Cloudflareのアカウントを作成

[Cloudflare](https://www.cloudflare.com/ja-jp/) からアクセスしてサインアップを行って管理画面にアクセスできるようにしておきます。

### D1データベースの作成

```sh
npx wrangler d1 create remix-jokes
```

作成後に表示される `wrangler.toml` の設定情報を上書きして設定します。

### データベースマイグレーション

#### ローカルマイグレーション

```sh
npm run migration:local
```

#### Cloudflare D1マイグレーション

```sh
npm run migration:remote
```

### 環境変数の設定

プロジェクト直下に `.dev.env` を作成しに以下の環境変数を設定します。

```text:.dev.env
POLICY_AUD={cloudflare accessのaud}
JWKS_URL=https://{your-team-domai}/cdn-cgi/access/certs
LOGOUT_URL=https://{your-team-domain}/cdn-cgi/access/logout
DATABASE_ID=
DATABASE_NAME=
PREVIEW_DATABASE_ID=
```

## ローカル起動

```sh
npm run dev
```

## Cloudflare Pagesにデプロイ

### ローカルからデプロイ

```sh
npm run dev
npm run deploy
```

### リポジトリPushで自動デプロイ

事前にCloudflareの管理画面からPagesのプロジェクトを作成してGitHubのリポジトリと紐づけます。その後はPushすれば自動でデプロイが行われます。