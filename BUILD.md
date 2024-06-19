# NotesOnPDF のビルド

## ウェブ版

以下のコマンドを実行すると、`frontend/dist/web/` にビルド結果が出力される。

```powershell
winget install "Node.js"       # Node.jsのインストール
cd path/to/NotesOnPdf/frontend # NotesOnPdf/frontend/ フォルダに移動
npm install                    # 必要なパッケージを frontend/node_modules/ にインストール
npm run build-web              # ビルド実行
```

## デスクトップ版

まずフロントエンドをビルドする。
以下のコマンドにより、`frontend/dist/desuktop/` にビルド成果物が出力される。

```powershell
winget install "Node.js"       # Node.jsのインストール
cd path/to/NotesOnPdf/frontend # NotesOnPdf/frontend/ フォルダに移動
npm install                    # 必要なパッケージを frontend/node_modules/ にインストール
npm run build-web              # ビルド実行
```

次にバックエンドをビルドする。
以下の操作により、`NotesOnPdf\backend\bin\release\net8.0-windows10.0.17763.0\publish\win-x64` にビルド成果物が出力される。

- `Visual Studio 2022` を以下のコマンドでインストールする:  
  `winget install "Visual Studio Community 2022"`
- `Visual Studio 2022` を起動する。
- ソリューションエクスプローラの`backend`フォルダを右クリック →`発行`を選択。
- `FolderProfile.pubxml`の`発行`ボタンをクリック。

あとは、以下をまとめればよい：
- フロントエンドのビルド結果を、以下のバックエンドのビルド成果物フォルダ内にコピーする。
（`index.html`と`NotesOnPdf.exe`が同じフォルダに配置される。）
- `download`という名の空のファイルを作っておく。（デフォルトのダウンロードフォルダとして使用される。）
