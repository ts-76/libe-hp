# libe-hp

Astro.js と Cloudflare Workers を使ったホームページ制作プロジェクトです。

## はじめに

このプロジェクトは、非エンジニア・初心者でも同じ手順で作業を始められるようにしています。

Claude Code を使っている場合は、次のように依頼してください。

```text
セットアップして
```

Claude が `npm run setup` を実行して、必要なパッケージのインストールと Git hook の設定を行います。

## 自分でセットアップする場合

必要なもの:

- Node.js 22.12.0 以上
- npm
- Git

ターミナルで次を実行して、`v22.12.0` 以上が表示されれば大丈夫です。

```sh
node -v
```

手順:

```sh
npm run setup
```

うまく動かないときは、次のコマンドで不足しているものを確認できます。

```sh
npm run doctor
```

セットアップが終わったら、次のコマンドでサイトを起動できます。

```sh
npm run dev
```

表示された `localhost` のURLをブラウザで開くと、サイトを確認できます。

## よく使うコマンド

| コマンド | 内容 |
| :-- | :-- |
| `npm run setup` | 初回セットアップを行う |
| `npm run doctor` | このプロジェクトを動かす準備ができているか確認する |
| `npm run dev` | 開発用サーバーを起動する |
| `npm run build` | 公開前のビルド確認をする |
| `npm run lint` | コードと秘密情報の混入を確認する |
| `npm run lint:fix` | 自動修正できる問題を直す |
| `npm run hooks:install` | `prek` の Git hook を入れる |
| `npm run hooks:run` | Git hook のチェックを全ファイルに実行する |

## 自動チェック

このプロジェクトでは `prek` を使って、コミット前に次のチェックを自動実行します。

- プロジェクト固有の安全チェック
- Biome によるコードチェック
- secretlint による秘密情報チェック

通常は `npm run setup` を一度実行すれば、コミット前チェックも自動で入ります。

`setup` や `doctor` は Node.js で書いているため、macOS、Windows、Linux で同じコマンドを使えます。

## 安全ルール

- APIキー、パスワード、トークンはコードに書かないでください。
- 個人情報、会員情報、未公開情報をリポジトリに入れないでください。
- 認証が必要な場合は、独自ログインではなく Cloudflare Access を使います。
- Cloudflare Workers で公開する場合、`preview_urls` は有効にしないでください。
- 判断に迷う情報を扱う場合は、エンジニアに相談してください。

## 公開時の前提

社外公開する場合は、次の構成を前提にします。

- フレームワーク: Astro.js
- ホスティング: Cloudflare Workers
- DB: Cloudflare D1
- 認証: Cloudflare Access

この構成で実現できない場合は、無理に進めずエンジニアに相談してください。

## Claude 用の補助設定

Claude Code 用に、次の設定を含めています。

- `.claude/settings.json`: 危険な操作や秘密情報ファイルの編集を止める hooks
- `.claude/skills/project-setup/SKILL.md`: 「セットアップして」と依頼された時の手順
- `.claude/skills/hp-safe-development/SKILL.md`: HP制作時の安全ルール

Claude に作業を頼む場合は、専門的な手順を細かく指示しなくても、まず「セットアップして」「トップページを直して」のように依頼できます。
