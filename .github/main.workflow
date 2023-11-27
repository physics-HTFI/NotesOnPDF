# https://ja.vitejs.dev/guide/static-deploy.html
# 静的コンテンツを GitHub Pages にデプロイするためのシンプルなワークフロー
name: Deploy static content to Pages

on:
  # デフォルトブランチを対象としたプッシュ時にで実行されます
  push:
    branches: ['main']

  # Actions タブから手動でワークフローを実行できるようにします
  workflow_dispatch:

# GITHUB_TOKEN のパーミッションを設定し、GitHub Pages へのデプロイを許可します
permissions:
  contents: read
  pages: write
  id-token: write

# 1 つの同時デプロイメントを可能にする
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  # デプロイするだけなので、単一のデプロイジョブ
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build-mock
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          # dist リポジトリのアップロード
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2