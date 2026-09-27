# 重症社區型肺炎導航

依 **ATS/IDSA 2019 社區型肺炎指引**（重症判定沿用 IDSA/ATS 2007 主要／次要條件）與 **ERS/ESICM/ESCMID/ALAT 2023 重症社區型肺炎指引**製作的互動工具，並標註 SCCM 2024 與 ATS 2025 的類固醇更新。

線上版：https://yht5582-source.github.io/severe-CAP/

> ⚠️ **僅供臨床流程輔助與教學，不取代臨床判斷。** 抗生素請依院內 antibiogram 與感染科建議；劑量為腎功能正常時的成人劑量。

## 功能

| 區塊 | 內容 |
|---|---|
| 1. 重症判定 | 主要條件（需升壓劑的敗血性休克、需侵襲性呼吸器）；9 項次要條件，RR、PaO₂/FiO₂、BUN、白血球、血小板、體溫輸入數值後自動判斷；1 項主要或 ≥3 項次要即為重症 |
| 2. 診斷檢查 | 血液與痰液培養、尿液肺炎鏈球菌與退伍軍人菌抗原、流感檢測、下呼吸道多重 PCR（ERS 2023）、MRSA 鼻腔 PCR；procalcitonin 的角色 |
| 3. 經驗性抗生素 | β-lactam＋macrolide（macrolide 禁忌改呼吸道 fluoroquinolone）；依 MRSA、Pseudomonas 風險加藥並附劑量；β-lactam 過敏、流感、肺膿瘍的調整 |
| 4. 類固醇 | 並列 ATS/IDSA 2019、ERS/ESICM 2023、SCCM 2024、ATS 2025 的建議，依休克、重症、流感與禁忌自動標示是否適用；附 CAPE COD 處方 |
| 5. 呼吸支持 | HFNO 優於傳統氧氣、部分病人可考慮 NIV（ERS 2023）；ROX 指數計算 |
| 6. 療程與降階 | 臨床穩定 7 項條件；重症至少 5 天；MRSA／PsA 培養陰性 48 小時停藥 |

其他功能：
- **床位列**：每床顯示重症或非重症。
- **一鍵複製摘要**：可貼到病歷。

## 各指引的類固醇建議

| 指引 | 建議 |
|---|---|
| ATS/IDSA 2019 | 不常規使用；難治性敗血性休克依 SSC |
| ERS/ESICM 2023 | 有休克時建議使用（條件式，低證據） |
| SCCM 2024 | 住院的重症細菌性 CAP 建議使用（強建議，中度證據） |
| ATS 2025 | 住院的重症 CAP 建議使用（條件式，低證據）；流感肺炎除外 |

## 使用方式

直接用瀏覽器開啟 `index.html` 即可，不需安裝或建置。

## 在地化設定

| 項目 | 位置 |
|---|---|
| 床號 | 網頁右側「床號設定」 |
| 重症條件 | `<script>` 內 `MAJOR`、`MINOR` |
| 抗藥菌風險與抗生素處方 | `RISK`、`regimen()` |
| 類固醇建議 | `steroid()` |

## 資料與隱私

- 所有資料只存在該瀏覽器的 `localStorage`，不會上傳。
- 只記錄床號，請勿輸入姓名或病歷號。

## 依據

1. Metlay JP, et al. Diagnosis and treatment of adults with community-acquired pneumonia: an official clinical practice guideline of the ATS and IDSA. *Am J Respir Crit Care Med* 2019;200:e45–e67.
2. Martin-Loeches I, Torres A, Nagavci B, et al. ERS/ESICM/ESCMID/ALAT guidelines for the management of severe community-acquired pneumonia. *Intensive Care Med* 2023;49:615–632；*Eur Respir J* 2023;61:2200735.
3. Jones BE, Ramirez JA, Oren E, et al. Diagnosis and management of community-acquired pneumonia: an official ATS clinical practice guideline. *Am J Respir Crit Care Med* 2025;212:24.
4. Chaudhuri D, et al. 2024 focused update: guidelines on use of corticosteroids in sepsis, ARDS, and community-acquired pneumonia. *Crit Care Med* 2024.
5. Dequin PF, et al. Hydrocortisone in severe community-acquired pneumonia. *N Engl J Med* 2023;388:1931–1941.
6. Roca O, et al. An index combining respiratory rate and oxygenation to predict outcome of nasal high-flow therapy. *Am J Respir Crit Care Med* 2019;199:1368–1376.

## 授權

請依使用單位規定自行選擇授權方式（例如 MIT）。
