# 📁models

`model*.ts` 内で `export` されている `model*` は、📁models の外から必要となる機能をまとめたもの。

`atoms*.ts` は primitive atom をまとめたもの。
`atom` を含むファイルを編集すると、開発時、「Hot Module Replacement の際にファイルが読み直される → `atom` がリセットされる → UI の状態が変わってしまう」ので、`atom` 専用のファイルに隔離している。

`derivs*.ts` は derived atom をまとめたもの。

`Watch_*.ts` は、`atom` の値が変化したときに、それに連動して実行される処理を記述する。
