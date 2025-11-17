# Active Users List
わんこめに簡単導入できる **現在配信に参加しているユーザー一覧ツール** です。  
OBS のブラウザソースに読み込むだけで、コメントしたリスナーが自動表示されます。

---

## 🚀 使い方（非エンジニア向け）

### 1. ダウンロード
1. GitHub の **Releases** から最新バージョンを開く
2. `active_user_list-xxx.zip` をダウンロード
3. ZIP を解凍

### 2. OBSに読み込む
1. OBS → **ソース追加 → ブラウザ**
2. 「ローカルファイルを使用する」にチェック
3. `index.html` を選択
4. サイズ調整して完了
5. 配信中、コメントした順にリスナーが表示されます

---

## 🔧 設定を変えたい場合（config.json）

`config.json` をメモ帳で開くことで設定できます。

| 項目 | 説明 |
|------|------|
| `userLifetimeSeconds` | 名前を残しておく秒数 |
| `highlightSeconds` | 新規参加時のハイライト秒数 |
| `maxActiveUsers` | 同時表示の最大人数 |

例：

```json
{
  "userLifetimeSeconds": 90,
  "highlightSeconds": 5,
  "maxActiveUsers": 20
}
