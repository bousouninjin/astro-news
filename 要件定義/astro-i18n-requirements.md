# Astro i18n 要件定義 (Astro 5 ベストプラクティス)

## 目的
- 多言語対応により国内外ユーザー体験と SEO を向上させる。
- ルーティング、UI 文言、メタデータ、配信の各層で一貫したロケール管理を行う。

## 前提・現状
- フレームワーク: Astro 5.13 / output 未指定 (デフォルト static)。
- 現在 i18n 未設定。`@astrojs/sitemap` あり → i18n 設定と連動可能。
- 想定ロケール: **要決定**（例: `ja` を defaultLocale、将来的に `en` 追加）。

## 設計方針
- Astro ビルトイン i18n を採用し、`astro.config.mjs` に `i18n` ブロックを追加する。
- ルーティングはパスプレフィックス方式を基本とし、defaultLocale のプレフィックス有無をプロダクト方針で選択する。
- UI 文言は辞書/型安全ライブラリ（Paraglide/Lingui/astro-i18next 等）を併用し、コンテンツ翻訳と分離する。

## 必須要件
### 1) 設定
- `astro.config.mjs` に以下を追加すること:
  - `i18n.locales`: サポートするロケール配列。必要に応じ `codes`/`path` でバリアントをまとめる。
  - `i18n.defaultLocale`: locales 内の既定ロケール。
  - `i18n.routing.prefixDefaultLocale`: default を `/` に置くなら `false`（現行 URL 維持）。全ロケール揃えるなら `true`。
  - `i18n.routing.redirectToDefaultLocale`: `/` から `/<default>` へリダイレクトするかを選択。`prefixDefaultLocale: true` 時は自動で `true`。
  - 未翻訳ページ対策: `i18n.fallback` と `routing.fallbackType`(`redirect` or `rewrite`) を要件に応じ設定。
  - サーバー配信でロケール別ドメインが必要なら `i18n.domains` を使用（`site` と `output: 'server'` 必須）。

### 2) フォルダ/ファイル構成
- ページ: `src/pages/<locale>/...` でロケール別ディレクトリを作成。`prefixDefaultLocale: false` の場合、defaultLocale はルートに配置。
- コンテンツ: Content Collections を用い `src/content/<collection>/<locale>/` に格納し、`content.config.ts` でスキーマ定義。
- 動的ルーティング: `[locale]/[...slug].astro` などで `Astro.params.locale` と content id を紐付ける。

### 3) リンク/スイッチャー
- `astro:i18n` のヘルパーを使用: `getRelativeLocaleUrl()`, `getAbsoluteLocaleUrl()`, `getAbsoluteLocaleUrlList()`, `redirectToDefaultLocale()`, `redirectToFallback()`, `notFound()` など。
- 言語切替 UI は `getRelativeLocaleUrl` または `useTranslatedPath` 相当の自前ヘルパーで現在パスを保ったままロケールを切替える。
- ルート名を翻訳する場合はルートマップを用意し、リンク生成で適用する。

### 4) UI 文言翻訳
- `src/i18n/` に辞書を置き、キー名で参照。デフォルト言語値をフォールバックする関数を実装。
- 規模が大きい/型安全が必要な場合は Paraglide や Lingui を採用し、ビルド時にメッセージをコンパイル。
- React Island での文言取得はクライアント側でも同一辞書を共有する。

### 5) メタデータ/SEO
- `<html lang>` に `Astro.currentLocale` を反映。
- `<head>` でロケール別 `<title>/<meta>` を出し分け。OG/Twitter カードもロケール別に。
- `hreflang` を全ページで生成（`getAbsoluteLocaleUrlList` などで URL を取得）。
- `@astrojs/sitemap` 連携: i18n 設定後に多言語 URL と `xhtml:link rel="alternate"` を含むサイトマップを生成。
- canonical はロケールごとに正規化。

### 6) ロケール検出/リダイレクト
- `Astro.currentLocale`: 現在 URL のロケール。
- SSR/オンデマンド時は `Astro.preferredLocale` と `Astro.preferredLocaleList` を参照し、許容する場合のみ自動リダイレクトを検討（静的ホスティングではヘッダー未利用）。
- プロキシ/ホスティングで `Accept-Language`, `X-Forwarded-Host`, `X-Forwarded-Proto` を正しく転送すること。

### 7) フォールバック運用
- 未翻訳ページは `i18n.fallback` で明示し、`fallbackType` を選択。
- フォールバック時は UI で「翻訳準備中」等の表示を任意で追加。

### 8) テスト/QA
- ルーティング: 各ロケールのトップ/詳細/404、`/` リダイレクト挙動、未翻訳時の fallback。
- リンク生成: 言語切替後も同一コンテンツに留まること。
- SEO: hreflang, canonical, OG のロケール値確認。Sitemap に全ロケール URL が含まれること。
- アクセシビリティ: lang 属性、RTL 言語追加時の CSS 対応確認。
- ビルド: `astro build` で全ロケールが生成されること。`output: 'server'` 運用時はヘッダー依存動作をステージングで検証。

## 任意/拡張要件
- ロケール別ドメインや `/french/` などカスタムパスを使う場合は `locales` に `path`/`codes` を設定し、ヘルパー呼び出しは `path` をロケール値として渡す。
- 解析/計測はロケール別プロパティまたはカスタムディメンションで記録。
- 翻訳ワークフロー: 辞書抽出と差分管理、外部翻訳管理（例: Phrase/Crowdin）連携を設計。

## 決定事項 (実装済み)
- 対応ロケール: `en`, `ja`。
- defaultLocale: `en`。
- ルーティング: `routing: "manual"`（`src/pages/<locale>/...` を使用し、defaultLocale はルートに配置）。
- Fallback: `ja -> en`（manual のため `fallbackType` は `rewrite`）。
- i18n middleware: `src/middleware.ts` で `astro:i18n` の `middleware()` を使用。
- 翻訳方式: `src/i18n/` のシンプル辞書を利用（UI 文言はキー参照、コンテンツは `src/content/<collection>/<locale>/` で分離）。
- 出力方式: static（`astro.config.mjs` の `output` は未指定 = 既定の static）。
- ドメインマッピング: 未使用（`i18n.domains` 未設定）。

## 追加実装メモ
- ページ: `src/pages/[locale]/...` を追加し、defaultLocale はルート配下で運用。
- コンテンツ: `src/content/<collection>/<locale>/` に移設し、参照は `locale/slug` で統一。
- リンク生成: `localizePath()` を中心に、言語切替は同一パス維持で切替。
- SEO: `hreflang`、`og:locale`、`canonical` をロケール対応。`<html lang>` は `Astro.currentLocale` を使用。


# 最後

要件に基づきAstro 5のi18nをエンドツーエンドで実装（ロケール：en/ja、デフォルト：en、prefixDefaultLocale: false、fallbackType: 「rewrite」（ja → en））。ロケール対応ルーティング、コンテンツ、リンク、UI文字列、SEOメタデータの連携に加え、aboutページのアセットインポートとローカライズされた著者ページタイトルの軽微な修正を実施。

詳細

astro.config.mjs、config.ts、paths.ts、content.ts における翻訳、ルート、コンテンツ検索用の i18n 設定とロケールヘルパー。
src/pages/* および src/pages/[locale]/* におけるロケールスコープのルーティングとリダイレクト/404 処理（localizePath() およびローカライズされた静的パスを使用）。
base.astro、head.astro、locale-switcher.astro における UI/SEO ローカライズ（lang/dir、hreflang、OG ロケール、RSS タイトル）および言語切替機能の更新。さらにコンポーネント全体でのナビゲーション/フッター/ヘッダーテキストのローカライズ。
コンテンツをロケールフォルダに移動し、src/content/articles/en、src/content/authors/en、src/content/categories/en、src/content/views/en、content.config.ts で参照とローダーを更新。
著者ページの見出し/メタデータは翻訳可能なテンプレートキーを使用するよう変更。aboutページのアセットインポートは[page].astro、config.ts、about.mdx内のエイリアスを使用。
テスト

未実行（要求なし）。
次の手順

異なるロケールデフォルト/プレフィックス動作（例：jaをデフォルトに設定、またはprefixDefaultLocale: true）が必要か確認してください。必要に応じてルーティング/設定を調整します。
完全ローカライズページ用に、src/content/**/ja下に翻訳済みコンテンツを追加してください。
npm run build または bun run build を実行し、静的出力とサイトマップ代替ファイルを確認してください。
