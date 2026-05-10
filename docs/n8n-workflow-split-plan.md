# n8n Workflow 拆分方案

## 來源

- 來源檔案：`C:\AI_project\AI_Business_Assistant\N8N\Tender_AI\N8N_workflow.json`
- 工作流名稱：`LINE AI 業務助理小幫手-名片資料庫建立完成`
- 節點數：約 155
- 連線群組：約 74

本文件只做拆分規劃，尚未實際切割 JSON。原因是 n8n workflow 內可能包含 credential reference、webhook path、節點連線與環境依賴，直接切割容易讓可運作流程失效。

## 建議拆分成 7 個 workflow

### 1. `01_line_entry_router.json`

用途：統一接收 LINE webhook，整理輸入格式，判斷任務類型。

可能包含：

- `ENTRY_LINE_WEBHOOK`
- `ENTRY_NORMALIZE_INPUT`
- `CORE_INTENT_ANALYZER`
- `CORE_TASK_PLANNER`
- `MODE_ACTION_SWITCH`
- `OUTPUT_NORMALIZE_ANSWER`
- `OUTPUT_LINE_REPLY1`

### 2. `02_memory_system.json`

用途：管理使用者記憶、偏好、短期上下文與是否需要寫入記憶。

可能包含：

- `MEMORY_READ`
- `MEMORY_CONTROLLER`
- `MEMORY_WRITR`
- `MEMORY_CLASSIFIER`
- `MEMORY_CLASSIFIER_OUTPUT`
- `MERGE_MEMORY_CLASSIFICATION`

### 3. `03_tender_rag_query.json`

用途：處理標案查詢，把使用者問題送到 RAG / FastAPI / 向量查詢服務。

可能包含：

- `TOOL_TENDER_ANALYSIS1`
- `STAGE3_ACTIVE_TENDER_RAG_CORE`
- RAG 相關 merge / prepare 節點

### 4. `04_card_scan_ocr.json`

用途：處理名片圖片、OCR / vision model、欄位解析與資料清理。

可能包含：

- `CARD_INPUT_SWITCH`
- `LINE_GET_CARD_IMAGE`
- `CARD_IMAGE_TO_BASE64`
- `CARD_GEMINI_VISION_EXTRACT`
- `CARD_LMSTUDIO_QWEN35_VISION`
- `CARD_PARSE_GEMINI_RESULT`
- `CARD_PARSE_QWEN35_RESULT`
- `CARD_SCAN_RESULT_NORMALIZE`

### 5. `05_contact_database.json`

用途：保存與查詢聯絡人資料。

可能包含：

- `CARD_PREPARE_CONTACT_DB`
- `CARD_SAVE_TO_POSTGRES_CONTACTS`
- `CONTACT_PREPARE_SEARCH_KEYWORD`
- `CONTACT_SEARCH_POSTGRES`
- `CONTACT_FORMAT_REPLY`
- `CONTACT_QUERY_SWITCH`

### 6. `06_external_tools.json`

用途：封裝外部工具，例如天氣、空氣品質、日期時間。

可能包含：

- `Weather`
- `AQI`
- `Date & Time`
- 未來其他工具節點

### 7. `07_stage3_architecture_placeholders.json`

用途：保留第三階段架構規劃、RBAC、Email、Calendar、CRM、Dashboard、Audit log 等設計節點。

可能包含：

- `STAGE3_*`
- `EMAIL_*`
- `CALENDAR_*`
- `CUSTOMER_CRM_PLACEHOLDER`
- `DASHBOARD_EXPORT_PLACEHOLDER`
- `NOTE_STAGE3_*`

## 拆分順序建議

1. 先備份目前完整 workflow。
2. 先拆出 `07_stage3_architecture_placeholders.json`，因為多數是規劃節點，風險最低。
3. 再拆外部工具 `06_external_tools.json`。
4. 再拆名片掃描與聯絡人資料庫。
5. 最後才拆 LINE 入口、記憶系統與標案 RAG，因為這些是目前核心流程。

## 拆分前檢查

- 確認 n8n credential reference 是否仍有效。
- 確認 webhook path 是否會改變。
- 確認 LINE reply token 傳遞是否完整。
- 確認每個 workflow 的輸入 / 輸出格式。
- 確認拆分後是否用 Execute Workflow、Webhook 或 HTTP Request 串接。

## 上線前測試

- LINE 一般聊天測試。
- 標案查詢測試。
- 名片圖片上傳測試。
- 聯絡人查詢測試。
- 天氣與空氣品質查詢測試。
- 錯誤情境測試，例如空訊息、圖片失敗、RAG 服務未啟動。
