# Enriched Words Tracker

Words enriched with `example_sentences`, `cultural_context`, and `regional_variations` via `scripts/enrich-words.mjs`.

## Stats

| Metric | Count |
|---|---|
| Total enriched | 61 |
| Total published | 2,672 |
| Still eligible | 2,602 |

## Run 1 — 2026-05-08 · gemini-2.5-flash · 10 words

Initial top-10 by views.

| # | ID | Lang | Word | Slug | Views |
|---|---|---|---|---|---|
| 1 | `c31324e5-b4f8-4a38-8865-c16346bb6c24` | ukrainian | дідько (didko) | didko | 34 |
| 2 | `ff583645-2368-4f69-bb48-597855cf881e` | farsi-persian | کس (Kos) | kos | 22 |
| 3 | `b6a1a7a1-2966-4e50-aa57-e72b347c3937` | hindi | चूतिया (chutiya) | chutiya | 22 |
| 4 | `89e1a971-48c6-42f9-8924-2080c1769c21` | turkish | amına koyayım | am-na-koyay-m | 18 |
| 5 | `80fd932e-780d-4943-85b3-5e2d33485807` | farsi-persian | بی‌ناموس (Bi nāmus) | bi-namus | 18 |
| 6 | `f04969f1-05e2-49a8-9af6-e19e5a6737c5` | english | tits | tits | 18 |
| 7 | `dfc75292-9e96-4774-a4fd-fa43712be92e` | arabic | شرموطة (Sharmouta) | sharmouta | 16 |
| 8 | `6fbd6c3c-a838-4deb-9556-2dfed0e9f224` | farsi-persian | کیری (Kiri) | kiri | 14 |
| 9 | `b4e18d3d-51f6-4364-8b98-cb217c0f5205` | english | fuck | fuck | 13 |
| 10 | `be1874be-526e-4b39-8340-e8d4b16e7334` | english | fuckery | fuckery | 13 |

## Run 2 — 2026-05-09 · gemini-2.5-flash · 10 words

Bulk run, capped early by free-tier daily quota.

| # | ID | Lang | Word | Slug | Views |
|---|---|---|---|---|---|
| 11 | `b04100cc-f3fa-421d-9527-dea1da295565` | spanish | comemierda | comemierda | 12 |
| 12 | `dae442b7-e2be-4c1c-8b54-f73587f65163` | spanish | pajero | pajero | 12 |
| 13 | `9c896d79-21a7-408b-853e-94fc33a65ab3` | vietnamese | bê đê | be-e | 12 |
| 14 | `998eebdd-caab-4f8a-b1ab-af16379e75d2` | hindi | गांड (gaand/gand) | gaand-gand | 11 |
| 15 | `4d4b4ac3-c4b9-4a45-ac62-54eca8424106` | bosnian-serbo-croatian | jebem ti mater | jebem-ti-mater | 11 |
| 16 | `b4999b15-31d0-45d8-8eb9-e1fbe801b657` | russian | идиот (idiot) | idiot | 11 |
| 17 | `399385ec-d41a-4dbc-a38e-a68592f3eb79` | russian | ёпт (yopt) | yopt | 10 |
| 18 | `7c20e5a6-a627-4fa1-b1b5-8a8f2311c1a8` | farsi-persian | شاشیدن (Shāshidan) | shashidan | 9 |
| 19 | `bc9c9efa-1f40-4735-a2ec-a42e28dc7201` | english | cockwomble | cockwomble | 9 |
| 20 | `3216f3ef-3144-4928-961e-028b76a53efb` | english | hell | hell | 9 |

## Run 3 — 2026-05-09 · gemini-2.5-flash-lite · 5 words

Probe run to test free-tier RPD on the lite model. Ran clean, no quota hit.

| # | ID | Lang | Word | Slug | Views |
|---|---|---|---|---|---|
| 21 | `73126a21-f9e5-45c5-ba04-4cae6e0e6693` | farsi-persian | بی‌شرف (Bi sharaf) | bi-sharaf | 9 |
| 22 | `bd522e35-4775-4192-a456-37e29c63de77` | italian | cagna | cagna | 9 |
| 23 | `c62364a8-a5fb-495e-8ec2-e2acaf7d433f` | farsi-persian | خسیس (Khasis) | khasis | 8 |
| 24 | `88ca17f5-d686-4cb4-9823-5b581db838c8` | kurdish | خوشک حیز (Xwîşk hîz) | xwisk-hiz | 8 |
| 25 | `3aea65de-3cae-4d37-bf69-1ec595227656` | farsi-persian | عوضی (Avazi) | avazi | 8 |

## Run 4 — 2026-05-15 · gemini-2.5-flash-lite · 18 words

Bulk run capped at 50, stopped early on daily quota after 20 processed (18 succeeded, 2 hit transient 503s and were skipped). Tighter validation prompt: every entry got 5 sentences, 3 paragraphs, 385–521 cultural-context words.

| # | ID | Lang | Word | Slug | Views |
|---|---|---|---|---|---|
| 26 | `efef949a-79e0-4ef7-b9f4-3a74b1b7b43e` | russian | сука (suka) | suka | 7 |
| 27 | `7ff40013-5b43-402d-a229-5783db0feff2` | arabic | كس أمك (Kus ummak) | kus-ummak | 7 |
| 28 | `f9604ab7-576d-4ba9-8086-26c1607b3d88` | korean | 씨발 (ssibal) | ssibal | 7 |
| 29 | `e122874d-b502-4f3f-8945-668d72b620f5` | french | garce | garce | 7 |
| 30 | `5a76fca7-6b9b-4f80-a33c-e25d53a3bce3` | russian | ёбаный (yobanyy) | yobanyy | 6 |
| 31 | `41fb5b8c-88cc-490a-9d8c-886d56c0edd2` | portuguese | puta | puta | 6 |
| 32 | `106cc055-80dc-4b05-9448-6ba09b4d3d3c` | english | for fuck's sake | for-fuck-s-sake | 6 |
| 33 | `940d6eb3-6025-4080-9092-88964ca624eb` | arabic | كس أختك (Kuss ukhtak) | kuss-ukhtak | 6 |
| 34 | `d62191e9-bc26-4b48-b510-8f2c55934329` | english | dick | dick | 6 |
| 35 | `fedb54af-31b4-42b9-9821-d93af57d67dd` | arabic | ابن المتناكة (Ibn el metnaaka) | ibn-el-metnaaka | 6 |
| 36 | `358251a9-79f6-42f6-93ce-8e8f7f7d5b72` | arabic | عرص (Ars) | ars | 6 |
| 37 | `2ab4b878-1d30-42c7-b58a-cc7fb0aeb2b4` | arabic | قحبة (Qahba) | qahba | 6 |
| 38 | `5f7f72e1-0955-4455-8642-3563acde93da` | japanese | うるさい (urusai) | urusai | 6 |
| 39 | `7f91554b-0357-4750-a9ef-5b4822afb264` | vietnamese | địt mẹ mày | it-me-may | 6 |
| 40 | `cd01fee3-6419-4a82-9eab-aab156b0a666` | hindi | गांडू (gandu) | gandu | 6 |
| 41 | `51d85bdf-b0e3-4bc0-ba3f-599dc2df2335` | farsi-persian | کسکش (Koskesh) | koskesh | 6 |
| 42 | `4c05d56a-b351-464f-bedd-09c831a2e20a` | english | cock | cock | 6 |
| 43 | `d530e67d-83f8-4a1e-bc46-06aa301438f1` | french | se barrer | se-barrer | 6 |

Skipped this run (need re-run):
- 操你妈 (chinese) — Gemini 503 high-demand error
- la concha de la lora (spanish) — Gemini 503 high-demand error

## Run 5 — 2026-05-15 · gemini-2.5-flash · 9 words

Switched back to `gemini-2.5-flash` after `flash-lite` daily quota hit on Run 4. Stopped manually after 10 processed (9 succeeded, 1 503 retry-failed). Cleared both 503-failed words from Run 4 (Chinese 操你妈 and Spanish la concha de la lora).

| # | ID | Lang | Word | Slug | Views |
|---|---|---|---|---|---|
| 44 | `cb6bb77a-6dfa-4541-b29f-86916ed37290` | chinese | 操你妈 | motherfucker-fuck-your-mother | 7 |
| 45 | `03c5d1ad-0d8f-4439-b860-d26d2868df59` | spanish | la concha de la lora | la-concha-de-la-lora | 6 |
| 46 | `8c5a72db-f02a-4b75-bb9d-5e4a4bca158c` | kurdish | Kero / Kerê | kero-kere | 5 |
| 47 | `62966149-3fcc-4800-8b37-7ce63805fb73` | ukrainian | залупа (zalupa) | zalupa | 5 |
| 48 | `ff879cea-a134-4b66-acb8-ef079dfa7af2` | dari | لعنتی (Lanati) | lanati | 5 |
| 49 | `5e137956-2764-4ea1-a70b-4197a52f262b` | dari | بد کاره (Bad kara) | bad-kara | 5 |
| 50 | `7f511b39-63f7-4287-a2a0-71d793f57068` | arabic | كل خرا (Kol khara) | kol-khara | 5 |
| 51 | `b00836d5-9d1f-4d61-8653-c1026277e205` | thai | สัส (sat) | sat | 5 |
| 52 | `420c98e1-4bcf-4b71-aecf-656a1ad12944` | chinese | 去你的 (qù nǐ de) | qu-ni-de | 5 |

Skipped (stay eligible):
- ukala (turkish) — Gemini 503 high-demand error

## Run 6 — 2026-05-16 · gemini-2.5-flash · 9 words

Same-day continuation on a fresh daily quota. 10 attempted, 9 succeeded, daily quota hit on the 10th. Cleared the Turkish `ukala` 503 from Run 5.

| # | ID | Lang | Word | Slug | Views |
|---|---|---|---|---|---|
| 53 | `544887ab-ecd8-452d-9e0b-5e851be68b62` | arabic | منيّك (Mnayyak) | mnayyak | 7 |
| 54 | `b9878a9c-83ac-4256-ad05-7de2e2d657c5` | chinese | 肏你妈 (cào nǐ mā) | cao-ni-ma | 6 |
| 55 | `5e5888cb-b239-4d93-bd43-84e4c11d8ee2` | spanish | puta | puta | 6 |
| 56 | `90a41304-48dd-494e-b2a5-76024e07deb6` | vietnamese | đm | m | 6 |
| 57 | `c1df247a-f433-4591-b808-dd911ae20652` | italian | che palle | che-palle | 6 |
| 58 | `686bd72e-5cde-4fb7-8f53-0e6d37566bff` | turkish | ukala | ukala | 5 |
| 59 | `054d3643-fa11-4c8a-92e3-954658e04740` | spanish | puto | puto | 5 |
| 60 | `dd02f342-2116-4566-a228-4f938ebeb4b6` | korean | 쌍놈 (ssangnom) | ssangnom | 5 |
| 61 | `0c96b767-ef3a-4515-8553-4b6c72e67b4b` | japanese | 弱虫 (yowamushi) | yowamushi | 5 |

## Quota notes

- `gemini-2.5-flash` free tier: ~10 RPD per account-day (hit on Runs 2 and 6).
- `gemini-2.5-flash-lite` free tier: ~20 RPD observed on Run 4 (quota hit at word 21).
- 503 high-demand errors aren't retried — affected words stay eligible and get picked up next run.
- Re-running the script automatically picks up where this left off (skip filter excludes already-enriched words).
