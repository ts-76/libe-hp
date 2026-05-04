---
name: project-setup
description: "このプロジェクトの初期セットアップを行う。ユーザーが「セットアップして」「環境を整えて」「初期設定して」と依頼したときに使う。"
---

# Project Setup

このスキルは、初心者でも同じ手順で開発環境を整えられるようにするためのものです。

## 手順

1. プロジェクト直下で作業していることを確認する。
2. まず `npm run doctor` を実行して、足りないものを確認する。
3. Node.js や npm が使えない場合は、ワークスペース直下の `global-tools-setup` を先に実行するよう案内する。
4. libe-hp の npm パッケージ、Git hook、安全チェックを整えるために `npm run setup` を実行する。
5. インストール直後にコマンドが見つからない場合は、新しいターミナルを開き直して再実行するよう伝える。
6. Node.js のバージョンエラーが出たら、`global-tools-setup` で Node.js 24 LTS を準備するよう短く伝える。
7. セットアップ後、`npm run dev` で起動できることを案内する。

## 注意

- APIキー、パスワード、トークンは聞き出さない。
- 秘密情報はコードに書かず、Cloudflare Secrets に入れる前提で案内する。
- 独自ログイン機能は作らず、認証は Cloudflare Access を使う。
- セットアップ中に `wrangler deploy` は実行しない。
- libe-hp 内では PC 全体に入るツールをインストールしない。
- mise、Node.js、Git、GitHub CLI などのグローバルツールは `global-tools-setup` に任せる。
