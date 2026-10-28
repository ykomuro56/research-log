# 研究ログアプリ ベータ版 — はじめて使う方へ

自分のPCで研究ログを作成・検索できるアプリです。ブラウザで操作します。

ログは自分のPCに保存されます。他のメンバーのPCや研究室サーバーへ、自動で共有されることはありません。

最初に少し準備が必要ですが、2回目からは短いコマンドで起動できます。

## このガイドの読み方

- 初めて使う場合：「1. 初回の準備」から順に進めてください。
- 一度使えるようになった場合：「5. 次回からの使い方」へ進んでください。
- エラーが出た場合：その場で止め、「7. 困ったとき」を確認してください。

灰色の枠に入ったコマンドをコピーして実行します。Mac用とWindows用がある場合は、自分のOSの方だけ実行してください。

## 1. 初回の準備

必要なものは次の3つです。

- 配布された研究ログアプリのZIPファイル
- Docker Desktop
- インターネット接続

Docker Desktopは、このアプリをPC上で動かすためのソフトです。JavaやNode.js、PostgreSQLを個別にインストールする必要はありません。

Windowsでは、Docker DesktopでWSL 2を使える環境が必要です。インストール方法が分からない場合や、大学管理のPCでインストールを制限されている場合は、配布担当者へ相談してください。

### ZIPを展開する

ZIPを展開し、中身を自分で分かる場所に保管します。ZIPの中から直接作業しないでください。

展開したフォルダに、次のものがあることを確認します。

```text
compose.yaml
BETA_GUIDE.md
backend
frontend
database
```

以降、このフォルダを「アプリフォルダ」と呼びます。

アプリフォルダは、使い終わっても削除しないでください。

### Docker Desktopを起動する

Docker Desktopを開き、起動が完了するまで待ちます。アプリの利用中はDocker Desktopを動かしておいてください。

## 2. コマンドを入力する画面を開く

### Mac

1. 「ターミナル」アプリを開きます。
2. `cd `と入力します。`cd`の後ろに半角スペースを1個入れます。
3. Finderからアプリフォルダをターミナルへドラッグします。
4. Enterを押します。

次を実行してください。

```sh
ls
```

一覧に`compose.yaml`があれば、正しい場所に移動できています。

### Windows

1. エクスプローラーでアプリフォルダを開きます。
2. ウィンドウ上部のアドレス欄に`powershell`と入力します。
3. Enterを押します。

開いたPowerShellで、次を実行してください。

```powershell
Get-ChildItem
```

一覧に`compose.yaml`があれば、正しい場所です。

### Dockerが使えるか確認する

Mac・Windows共通で、次を実行します。

```sh
docker version
```

`Client`と`Server`の両方が表示されれば準備完了です。

接続エラーが出る場合は、Docker Desktopが起動しているか確認してください。

## 3. 初回だけ：自分専用のパスワードを作る

このアプリは、内部でデータ保存用のパスワードを使います。以下の操作で自動作成するため、自分で考えたり、覚えたりする必要はありません。

これは画面へのログイン用パスワードではありません。

**この操作は、初回起動前に一度だけ行います。更新や再起動の際には行わないでください。**

既に`secrets`フォルダにパスワードファイルがある場合は、削除・上書きせず、配布担当者に確認してください。

### Mac

次の枠全体をコピーし、ターミナルへ貼り付けて実行します。

```sh
(
  set -e
  umask 077

  if [ -e secrets/db_password.txt ] || [ -e secrets/app_db_password.txt ]; then
    echo "パスワードファイルが既にあります。変更せずに終了しました。"
    exit 1
  fi

  mkdir -p secrets
  set -C

  db_password="$(openssl rand -hex 32)"
  app_password="$(openssl rand -hex 32)"

  printf '%s' "$db_password" > secrets/db_password.txt
  printf '%s' "$app_password" > secrets/app_db_password.txt

  echo "パスワードファイルを2つ作成しました。"
)
```

### Windows（PowerShell）

次の枠全体をコピーし、PowerShellへ貼り付けて実行します。

```powershell
& {
    $ErrorActionPreference = "Stop"

    if ((Test-Path "secrets/db_password.txt") -or
        (Test-Path "secrets/app_db_password.txt")) {
        throw "パスワードファイルが既にあります。変更せずに終了しました。"
    }

    New-Item -ItemType Directory -Force secrets | Out-Null

    function New-PasswordFile($Name) {
        $path = Join-Path $PWD "secrets/$Name"
        $bytes = New-Object byte[] 32
        $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

        try {
            $rng.GetBytes($bytes)
            $password = [BitConverter]::ToString($bytes).Replace("-", "")
            [System.IO.File]::WriteAllText(
                $path, $password, [System.Text.Encoding]::ASCII
            )
        }
        finally {
            $rng.Dispose()
        }
    }

    New-PasswordFile "db_password.txt"
    New-PasswordFile "app_db_password.txt"

    Write-Host "パスワードファイルを2つ作成しました。"
}
```

### 完了の目印

「パスワードファイルを2つ作成しました。」と表示され、アプリフォルダに次の2ファイルがあれば完了です。

```text
secrets/
├─ db_password.txt
└─ app_db_password.txt
```

中身を開いて確認する必要はありません。ファイルはそのまま保管し、他の人へ渡さないでください。

## 4. 初めてアプリを起動する

ここからはMac・Windows共通です。

### 設定を確認する

```sh
docker compose config --quiet
```

**何も表示されず、次のコマンドを入力できる状態に戻れば正常です。**

エラーが出た場合は、次へ進まず「7. 困ったとき」を確認してください。

### アプリを準備して起動する

```sh
docker compose up -d --build
```

初回は必要なものをダウンロードし、アプリを組み立てます。数分以上かかることがあります。

処理が終わったら、次を実行します。

```sh
docker compose ps -a
```

`web`・`backend`・`db`の3つが`Up`になっていることを確認します。`db`には`healthy`と表示されます。

`Exited`やエラーがある場合は、まだ準備完了ではありません。「7. 困ったとき」へ進んでください。

### ブラウザで開く

少し待ってから、次のURLを開きます。

**http://localhost:8080**

検索欄ではなく、ブラウザ上部のアドレス欄へ入力してください。`https`ではなく`http`です。

### 保存できるか試す

1. タイトル「動作確認」、本文「保存テスト」でログを1件作ります。
2. ブラウザを再読み込みします。
3. 作ったログが残っていることを確認します。

ここまでできれば、利用開始できます。

## 5. 次回からの使い方

毎回、アプリフォルダでコマンドを実行してください。

### 使い始める

Docker Desktopを起動し、次を実行します。

```sh
docker compose up -d
```

起動後、ブラウザで **http://localhost:8080** を開きます。

パスワード作成をやり直す必要はありません。

### 使い終わる

```sh
docker compose down
```

アプリは停止しますが、保存済みのログは残ります。このコマンドが終わった後は、Docker Desktopを終了しても構いません。

**`down`に`-v`を追加しないでください。ログの保存領域まで削除する指定になります。**

## 6. データを守るために

研究ログはDockerが管理する保存領域にあります。アプリフォルダをコピーするだけでは、ログのバックアップにはなりません。

- `secrets`フォルダは削除・再生成しないでください。
- Docker Desktopのデータ削除や初期化は行わないでください。
- 大切なログを保存したら、定期的にバックアップを取ってください。
- バックアップは、PC故障に備えて別の保存先にも保管してください。

具体的な方法は、同梱の`MAINTENANCE.md`にあります。操作に不安がある場合は、配布担当者と一緒に行ってください。

### 更新版を受け取ったとき

ベータ版の更新は、配布担当者が案内する更新手順に従ってください。

基本的には、データをバックアップし、自分の`secrets`フォルダを保持したままアプリを更新します。

**新しいZIPを展開しただけで、初回用パスワードを生成し直さないでください。** 既存DBに登録されたパスワードと合わなくなることがあります。

古い版へ戻す場合も、先に配布担当者へ相談してください。DBの構造が変更された後は、アプリだけ戻しても動かない場合があります。

## 7. 困ったとき

エラーが出ても、パスワードの再生成やDBの削除をせず、まず表示内容を確認してください。

| 表示・症状 | 最初に確認すること |
|---|---|
| `docker`が見つからない | Docker Desktopのインストールを確認する |
| Dockerに接続できない | Docker Desktopが起動しているか確認する |
| `compose.yaml`が見つからない | アプリフォルダで操作しているか確認する |
| `secrets/...`が見つからない | 初回のパスワード作成が完了したか確認する |
| `TLS handshake timeout` | ダウンロード先との通信が時間切れになっている。ネット接続を確認する |
| ポートが使用中というエラー | 別のアプリや以前のテスト環境が起動していないか、配布担当者へ確認する |
| 画面が開かない／`502`が表示される | 以下の確認用コマンドを実行する |
| ログを保存できない | 保存を試した直後に、以下の確認用コマンドを実行する |

### 配布担当者へ送る情報

次を実行します。

```sh
docker compose ps -a
docker compose logs --timestamps --tail=100 web backend db
```

表示結果と、次の3点を送ってください。

- MacかWindowsか
- どの手順で止まったか
- 画面に出たエラー

記録に研究内容や秘密情報が含まれている場合は、その部分を伏せてください。`secrets`内のファイルや、研究ログのバックアップは送らないでください。

## ベータ版の確認状況

2026年10月27日時点：

- Macで画面表示・ログ保存・再起動後の保持を確認済み
- 既存DBへの変更管理機能の導入を確認済み
- バックアップを別DBへ復元できることを確認済み
- 配布ZIPのテストでは認証設定の手動修正後に動作を確認
- 改訂した初回手順だけで起動できるかは再確認中
- Windows実機での動作確認は未実施

この版は各自のPCで使う個人利用向けです。研究室サーバーでの共同利用や、インターネットへの公開には未対応です。
