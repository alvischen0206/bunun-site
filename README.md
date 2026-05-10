# Bunun Studio Website

這是 `bunun.co` 第一版靜態網站。

## 內容

- 個人介紹
- 作品列表
- Demo 預告
- 聯絡方式：`panda@bunun.co`

## 檔案

- `index.html`：網站首頁
- `styles.css`：網站樣式

## 本機預覽

直接用瀏覽器開啟：

```text
C:\AI_project\Website_Studio\bunun-site\index.html
```

## Vercel 部署建議

1. 建立 GitHub repo：`bunun-site`
2. 將本資料夾內檔案上傳到 repo
3. 到 Vercel 新增專案
4. 匯入 GitHub repo
5. Framework Preset 選 `Other`
6. Build Command 留空
7. Output Directory 留空
8. 按 Deploy

## DNS 注意事項

目前不要修改 Zoho Mail 相關 DNS 記錄。

等 Vercel 部署成功、取得 `*.vercel.app` 網址後，再到 Vercel 的 Project Settings > Domains 加入：

- `bunun.co`
- `www.bunun.co`

DNS 設定值以 Vercel 後台顯示為準。
