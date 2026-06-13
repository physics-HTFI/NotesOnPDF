# 📁models

`model*.ts` 内で `export` されている `model*` は、📁models の外から必要となる機能をまとめたもの。

`atoms*.ts` は primitive atom をまとめたもの。
`atom` を含むファイルを編集すると、Hot Module Replacement の際に「ファイルが読み直される → `atom` がリセットされる → UI の状態が変わってしまう」ので、`atom` 専用のファイルに隔離している。

`derivs*.ts` は derived atom をまとめたもの。
