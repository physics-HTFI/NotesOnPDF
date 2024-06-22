# NotesOnPDF

`NotesOnPDF` は、PC 内の PDF ファイルを**注釈**をつけながら読むための、読書支援ソフトウェアです。

![スクリーンショット](readme/screenshot.png?raw=true)

## 特徴

1. 矢印やコメントなどの**注釈**をつけながら、PDF ファイルを読むことができます。
1. ウェブブラウザ上で動作します（`Microsoft Edge`, `Google Chrome`）。

**注釈**は別ファイルに保存されます：

1. 保存先は、PDF ファイルがあるフォルダの `PDFファイル名.pdf.json` というファイルです。
1. 変更時にオートセーブされます（最後の変更から 1 秒後に）。

### 注釈一覧

![注釈一覧](readme/notes.png?raw=true)

## ウェブ版

`NotesOnPDF` には、ウェブ版とデスクトップ版があります。
機能はほぼ同じですが、ウェブ版のほうが低速です。特に、大きな画像を含む PDF ファイルを開くと非常に遅くなります。

ウェブ版はここからアクセスできます → [ウェブ版 NotesOnPDF](https://physics-htfi.github.io/NotesOnPDF)

ウェブ版の特徴：

- ブラウザでアクセスするだけですぐ利用できます。
- アクセス時に指定したフォルダ内の PDF ファイルを読み込みます。

ただし

- 対応ブラウザは、`Google Chrome` と `Microsoft Edge` です。
  `Safari` と `Firefox` は、フォルダにアクセスする機能がないため利用できません。
- 本のスキャンのような大きな PDF ファイルの場合、非常に遅くなります。

## デスクトップ版 (Windows)

![デスクトップ版](readme/desktop.png?raw=true)

デスクトップ版の特徴：

- ウェブ版に比べて高速です。
- ブラウザで開くこともできますが、個別のウィンドウでも開けます。
- 通知領域に常駐します。
- URL を指定することで、インターネット上の PDF ファイルを開くこともできます（ダウンロードフォルダにダウンロードする）。
- 対応ブラウザは、`Google Chrome` と `Microsoft Edge` です。

### ダウンロード

デスクトップ版はここからダウンロードできます → [デスクトップ版 NotesOnPDF](https://github.com/physics-HTFI/NotesOnPDF/releases)

ダウンロードしたファイルを解凍し、`NotesOnPDF.exe`を実行すれば起動します。
ただし、ターミナルを開いて以下を実行しておいてください（必要なランタイムをインストールします）：

```powershell
winget install --id Microsoft.DotNet.DesktopRuntime.8
```

![ランタイムのインストール](readme/install-runtime.png?raw=true)
