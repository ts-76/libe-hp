# ホームページ制作ハンズオン

この資料は、初心者向けに GitHub と Cloudflare を使ってホームページを公開し、手元のパソコンで調整して、変更を保存・反映するまでの流れをまとめたものです。

## このハンズオンで行うこと

1. GitHub Repository にアクセスする
2. Deploy to Cloudflare でサイトを公開する
3. 開発・調整のために `git clone` する
4. サイト制作ワークフローを始める
5. 変更をコミット・プッシュする

## 事前に必要なもの

| 必要なもの | 用途 | ない場合 |
| :-- | :-- | :-- |
| GitHub アカウント | ソースコードを保存する | 先に GitHub アカウントを作成する |
| Cloudflare アカウント | サイトを公開する | 先に Cloudflare アカウントを作成する |
| Git | コードを取得・保存する | Git をインストールする |
| Node.js | サイトを手元で動かす | Node.js 24 LTS 以上をインストールする |
| ターミナル | コマンドを実行する | macOS はターミナル、Windows は PowerShell などを使う |

> 不安な場合は、最初に講師・サポート担当に確認してください。

---

## 1. GitHub Repository にアクセスする

### やること

1. ブラウザで配布された GitHub Repository の URL を開く
2. README を読む
3. `Deploy to Cloudflare` ボタンの場所を確認する

### 確認すること

- GitHub にログインできている
- Repository のページが表示されている
- README の内容が見えている

### つまずきポイント

#### GitHub アカウントがない

GitHub のアカウント作成が必要です。

- メールアドレスが必要です
- パスワードは使い回さないでください
- 可能なら 2段階認証を有効にしてください

#### Repository が見られない

次を確認してください。

- URL が間違っていないか
- GitHub にログインしているか
- 非公開 Repository の場合、招待を受けているか

#### 英語画面で不安になる

GitHub は英語表示が多いです。わからないボタンを押す前に、講師に確認してください。

---

## 2. Deploy to Cloudflare でデプロイする

### やること

1. README の `Deploy to Cloudflare` ボタンを押す
2. Cloudflare にログインする
3. 表示される手順に沿ってデプロイする
4. デプロイ完了後、表示された URL を開く

### 確認すること

- Cloudflare にログインできている
- デプロイが成功している
- `workers.dev` などの公開 URL でサイトが表示される

### つまずきポイント

#### Cloudflare アカウントがない

Cloudflare のアカウント作成が必要です。

- メールアドレスが必要です
- 無料プランで始められます
- 支払い情報を求められた場合は、講師に確認してください

#### Cloudflare の画面で何を選べばよいかわからない

ハンズオンでは、基本的に無料で進めます。
迷った場合は、勝手に有料プランを選ばず講師に確認してください。

#### デプロイは成功したが、サイトが表示されない

少し時間を置いて再読み込みしてください。
それでも表示されない場合は、次を確認します。

- デプロイが `Success` になっているか
- 表示された URL を正しく開いているか
- Cloudflare 側でエラーが出ていないか

#### `workers_dev` や `preview_urls` の警告が出る

このプロジェクトでは、`wrangler.jsonc` で次のように設定します。

```jsonc
{
  "workers_dev": true,
  "preview_urls": false
}
```

- `workers_dev: true` は、Workers の URL で公開するための設定です
- `preview_urls: false` は、確認用 URL を外部に残さないための安全設定です

---

## 3. 開発・調整のために git clone する

### やること

1. GitHub Repository の `Code` ボタンを押す
2. Repository の URL をコピーする
3. ターミナルを開く
4. 作業したい場所に移動する
5. `git clone` を実行する

例:

```sh
git clone https://github.com/ユーザー名/リポジトリ名.git
cd リポジトリ名
```

### 確認すること

```sh
git status
```

次のような表示になれば大丈夫です。

```text
On branch main
nothing to commit, working tree clean
```

### つまずきポイント

#### Git がインストールされていない

次を実行して確認します。

```sh
git --version
```

バージョンが表示されない場合は、Git をインストールしてください。

#### `git clone` でエラーになる

よくある原因は次の通りです。

- URL をコピーし間違えている
- GitHub にログインできていない
- Repository へのアクセス権がない
- すでに同じ名前のフォルダがある

#### ターミナルでどこにいるかわからない

次のコマンドで、現在の場所を確認できます。

macOS / Linux:

```sh
pwd
```

Windows PowerShell:

```powershell
Get-Location
```

---

## 4. ワークフローを始める

### やること

1. 必要なパッケージを入れる
2. プロジェクトの状態を確認する
3. 開発用サーバーを起動する
4. ブラウザで確認しながら調整する

```sh
npm run setup
npm run doctor
npm run dev
```

表示された `localhost` の URL をブラウザで開きます。

### Claude Code などの AI エージェントを使う場合

最初は次のように依頼します。

```text
セットアップして
```

サイト内容を変えたい場合は、具体的に依頼します。

```text
サイト名を「〇〇」に変えて
トップページを初心者向けの説明に調整して
ブログ記事を日本語のサンプルにして
```

### 確認すること

- `npm run setup` が成功する
- `npm run doctor` が成功する
- `npm run dev` でローカル URL が表示される
- ブラウザでサイトが見える

### つまずきポイント

#### Node.js がインストールされていない

次を実行して確認します。

```sh
node -v
```

`v24.0.0` 以上が表示されれば大丈夫です。
表示されない場合や古い場合は、Node.js をインストール・更新してください。

#### `npm` が使えない

次を実行して確認します。

```sh
npm -v
```

表示されない場合は、Node.js のインストールがうまくできていない可能性があります。

#### `npm run setup` が失敗する

まず次を実行します。

```sh
npm run doctor
```

表示されたエラーを講師に見せてください。

#### `localhost` が開けない

次を確認してください。

- `npm run dev` を実行したターミナルを閉じていないか
- 表示された URL をそのままコピーしているか
- 別のアプリが同じポートを使っていないか

---

## 5. コミット・プッシュする

### やること

変更内容を確認します。

```sh
git status
```

変更差分を確認します。

```sh
git diff
```

問題がなければ、公開前の確認をします。

```sh
npm run lint
npm run build
```

成功したらコミットします。

```sh
git add .
git commit -m "Update site content"
git push origin main
```

### 確認すること

- `npm run lint` が成功する
- `npm run build` が成功する
- `git status` で変更内容を確認している
- `git push` が成功する
- GitHub に変更が反映されている
- Cloudflare の再デプロイ後、公開サイトに反映されている

### つまずきポイント

#### `git commit` で名前やメールアドレスを聞かれる

初回だけ Git の設定が必要です。

```sh
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"
```

#### `git push` でログインできない

GitHub では、パスワードではなく認証設定が必要になることがあります。

よくある対応:

- GitHub Desktop を使う
- GitHub CLI を使う
- Personal Access Token を使う

ハンズオンでは、詰まったら講師に相談してください。

#### `npm run lint` が失敗する

自動修正できる場合があります。

```sh
npm run lint:fix
npm run lint
```

それでも直らない場合は、エラー内容を講師に見せてください。

#### `npm run build` が失敗する

公開前に直す必要があります。
エラーの最後のほうに原因が出ることが多いです。

まずは次を確認してください。

- ファイル名を間違えていないか
- 画像ファイルを消していないか
- 設定ファイルに余計な文字を入れていないか

---

## ハンズオン中の安全ルール

- APIキー、パスワード、トークンをコードに書かない
- 個人情報、会員情報、未公開情報を Repository に入れない
- Cloudflare の有料プランや課金が出る操作は、必ず講師に確認する
- 認証が必要なサイトを作る場合は、独自ログインを作らず Cloudflare Access を使う
- わからないエラーを無理に直そうとせず、エラー文をそのまま共有する

## 当日のチェックリスト

### 開始前

- [ ] GitHub にログインできる
- [ ] Cloudflare にログインできる
- [ ] Git が使える
- [ ] Node.js 24 LTS 以上が使える
- [ ] ターミナルを開ける

### 公開

- [ ] GitHub Repository を開いた
- [ ] `Deploy to Cloudflare` を押した
- [ ] Cloudflare でデプロイした
- [ ] 公開 URL でサイトを確認した

### 開発

- [ ] `git clone` した
- [ ] `npm run setup` を実行した
- [ ] `npm run doctor` を実行した
- [ ] `npm run dev` でサイトを確認した

### 保存・反映

- [ ] `git status` で変更を確認した
- [ ] `npm run lint` を実行した
- [ ] `npm run build` を実行した
- [ ] `git commit` した
- [ ] `git push` した
- [ ] 公開サイトに反映されたことを確認した
