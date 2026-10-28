#
研究ログアプリ ベータ版

各自のPCで起動して使う個人利用版です。
データは各自のPCに保存されます。
共同利用や外部公開向けの認証・権限管理は未対応です。

## 必要なもの

- Docker Desktop
- WindowsではWSL 2を利用できる環境
- 初回のダウンロード・ビルドに必要なインターネット接続

Docker Desktopを起動してから作業してください。
以降のコマンドは、compose.yamlのあるフォルダで実行します。

### 初回だけ：パスワードファイルを作る

compose.yamlのあるフォルダで、自分のOSに合うコマンドを実行します。
管理者用とアプリ用のパスワードが、自動で別々に作られます。

更新時には実行しません。ファイルが既にある場合は上書きしないでください。

#### Mac

```sh
この手順は、新しい環境の初回起動前に一度だけ実行します。既存DBのパスワードは、ファイルを生成し直しても変更されません。更新・再起動時には実行しないでください。

mkdir -p secrets
(
  set -e
  umask 077
  set -C

  db_password="$(openssl rand -hex 32)"
  app_password="$(openssl rand -hex 32)"

  printf '%s' "$db_password" > secrets/db_password.txt
  printf '%s' "$app_password" > secrets/app_db_password.txt
)
```

#### Windows（PowerShell）

```powershell
New-Item -ItemType Directory -Force secrets | Out-Null

function New-PasswordFile($Name) {
    $path = Join-Path $PWD "secrets/$Name"
    if (Test-Path $path) {
        throw "既に存在します。上書きしません: $path"
    }

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
```

secretsフォルダに次の2ファイルができれば準備完了です。

- db_password.txt
- app_db_password.txt

この2ファイルは削除せず、自分のPCに保管してください。
他の人には渡さないでください。

## 初回起動

 次を実行する。

```sh
docker compose config --quiet
docker compose up -d --build
```

設定確認でエラーが出た場合は、起動せず内容を確認してください。

起動後、ブラウザで http://localhost:8080 を開きます。
初回は空のDBが作られ、アカウントと表が自動作成されます。

## 通常の終了・再開

終了：

```sh
docker compose down
```

再開：

```sh
docker compose up -d
```

通常の終了ではDBのデータは残ります。
`down -v`はDBの保存領域も削除するため使用しないでください。

## 更新するとき

1. アプリへの書き込みを止める。
2. DBをバックアップし、処理の成功を確認する。
3. 更新版の変更内容と移行手順を確認する。
4. 自分のパスワードファイルを保持したまま、コードを更新する。
5. 次を実行する。

```sh
docker compose up -d --build
```

6. 以前のログが表示され、新しいログを保存できるか確認する。

更新時にパスワードを生成し直したり、DBの保存領域を削除したり
しないでください。

Composeの環境名は research-log-local のまま使用してください。
別名で起動すると、別のDB保存領域が作られることがあります。

DBの構造を変更する更新では、古いアプリに戻すだけで
復旧できるとは限りません。

## データの扱い

- secrets/とbackups/は他の人に渡さないでください。
- Dockerの保存領域だけでなく、別の場所にもバックアップを保管してください。
- 別PCへの移行は、DBのバックアップを移行先へ復元して行います。

## ベータ版の検証状況

- Macで初回起動・ログ保存・再起動後の保持を確認済み
- 既存DBへのFlyway導入を確認済み
- 別DBへのバックアップ復元を確認済み
- Windows実機での起動確認は未実施


## バックアップ

バックアップには研究ログの本文が含まれます。
配布物に含めず、自分だけがアクセスできる場所に保管してください。

### 1. 保存先を準備する

初回だけ、compose.yamlと同じ場所にbackupsフォルダを作ります。

Mac：

```sh
mkdir -p backups
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
```

### 2. アプリの書き込みを止める

```sh
docker compose stop web backend
```

DBは動かしたままにします。

### 3. DB内にバックアップファイルを作る

```sh
docker compose exec -T db pg_dump -U postgres -d research_log -Fc -f /tmp/research-log-backup.dump
```

実行直後に、終了結果を確認します。

Mac：

```sh
echo $?
```

Windows PowerShell：

```powershell
$LASTEXITCODE
```

0なら成功です。0以外なら、次へ進まずエラーを確認してください。

### 4. PCへコピーする

次の保存名は例です。毎回、日付や番号を変え、
以前のバックアップを上書きしない名前にしてください。

```sh
docker compose cp db:/tmp/research-log-backup.dump ./backups/research-log-before-update-01.dump
```

コピーが成功し、PC側にファイルができたことを確認します。
別の保存先にもコピーしておくと、PC故障への備えになります。

### 5. 通常利用を再開する

バックアップだけで終了する場合：

```sh
docker compose up -d
```

続けて更新する場合は、停止したまま更新手順へ進みます。

このバックアップにはDBの構造とデータが入ります。
DB利用者のアカウントやパスワード設定は含まれないため、
別PCへ復元する場合は移行先で別途準備します。

## バックアップからデータを戻せるか試す

この作業では、バックアップから**確認用のDBをもう一つ作ります。普段のDBは上書きしません。**

```text
普段のDB：research_log
    → そのまま残す

バックアップファイル
    → 確認用DB：research_log_restore_checkへ復元
```

### 作業前の状態

- Docker Desktopを起動しておく。
- ターミナルで、`compose.yaml`のあるフォルダに移動する。
- バックアップファイルを`backups`フォルダに用意する。

まず、DBを起動し、確認が終わるまで画面からの書き込みを止めます。

```sh
docker compose up -d db
docker compose stop web backend
```

各手順でエラーが出た場合は、そこで止めてください。

### 1. 戻したいファイルを選ぶ

`backups`フォルダを開き、使うファイル名を確認します。

以下では、例としてこの名前を使います。

```text
research-log-before-update-01.dump
```

**次のコマンドのファイル名を、自分のものに置き換えてください。**

```sh
docker compose cp ./backups/research-log-before-update-01.dump db:/tmp/research-log-restore.dump
```

これは、PCにあるバックアップをDBコンテナへコピーするだけです。まだ復元はしません。

### 2. 復元先の空DBを作る

```sh
docker compose exec -T db createdb -U postgres -O researchlog research_log_restore_check
```

何も表示されず終了すれば成功です。

「既に存在する」と表示された場合は、ここで止めてください。このガイドでは初めて確認用DBを作る場合を説明しています。

### 3. 確認用DBにデータを戻す

```sh
docker compose exec -T db pg_restore -U postgres --role=researchlog --no-owner --no-privileges --exit-on-error --single-transaction -d research_log_restore_check /tmp/research-log-restore.dump
```

戻す先は`research_log_restore_check`です。普段の`research_log`には書き込みません。

何も表示されなくても正常です。直後に、成功したか確認します。

Mac：

```sh
echo $?
```

Windows PowerShell：

```powershell
$LASTEXITCODE
```

**`0`なら復元処理は成功です。** それ以外なら、表示されたエラーを確認してください。

### 4. 戻したログの件数を見る

```sh
docker compose exec -T db psql -U postgres -d research_log_restore_check -c 'SELECT count(*) FROM public.log;'
```

表示された数字が、確認用DBに戻ったログの件数です。

バックアップを取ってからログを変更していなければ、次で普段のDBの件数も表示して比較できます。

```sh
docker compose exec -T db psql -U postgres -d research_log -c 'SELECT count(*) FROM public.log;'
```

バックアップ後に追加・削除したログは反映されないため、その場合は件数が違っていても異常とは限りません。

### 5. 普段の利用に戻る

```sh
docker compose up -d
```

ブラウザで http://localhost:8080 を開きます。

**画面が使うのは、引き続き普段のDBです。** 今回復元した確認用DBは、画面には接続していません。

ここまでで確認できるのは「バックアップを別DBへ復元できたこと」と「ログの件数」です。本文やタグの一致、復元したDBでアプリが動くかは、さらに確認する項目です。
