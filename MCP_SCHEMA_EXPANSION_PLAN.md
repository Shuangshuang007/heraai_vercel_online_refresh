# Hera AI MCP Schema 扩展实施计划

> **目标：** 基于现有MCP基础，系统性地扩展Schema中的所有功能，确保无遗漏
> **原则：** 分阶段实施，每步验收，严格检查，避免重复工作

---

## 📋 当前MCP状态确认

### **已实现的3个工具（基于ChatGPT Apps截图确认）：**
- ✅ `search_jobs` - 搜索和聚合多源职位
- ✅ `build_search_links` - 生成直接搜索链接  
- ✅ `get_user_applications` - 获取用户申请历史

### **现有后端已实现但未集成到MCP的功能：**
- ✅ `generate_cover_letter` (后端 `/api/generate-cover-letter` 已有)
- ✅ `tailor_resume` (后端 `/api/tailor` 已有)
- ✅ `analyze_job_fit/score_job_fit` (后端 `/src/gpt-services/jobMatch/matchJob.ts` 已有)
- ✅ `apply_to_job` (后端 `/api/profile/upsert-application` 已有)

---

## 🎯 实施阶段规划

### **阶段一：第一类 - 基于现有代码快速扩展（SEO优化类）**
**目标：** 在现有 `search_jobs` 基础上，通过添加参数、过滤器、排序逻辑快速实现更多搜索功能
**预计时间：** 3-5天
**风险等级：** 低（复用现有代码）

### **阶段二：第二类 - 真正需要扩展的核心功能**  
**目标：** 实现全新的业务逻辑和API端点
**预计时间：** 5-7天
**风险等级：** 中高（需要新建API和业务逻辑）

### **阶段三：第三类 - 已有功能Double Check**
**目标：** 确保现有功能与Schema定义完全一致
**预计时间：** 1-2天  
**风险等级：** 低（主要是验证和优化）

---

## 🚀 阶段一：第一类 - 基于现有代码快速扩展

### **1.1 搜索变体 (Search Variations)**

| Schema | 实现方案 | 检查点 | 状态 |
|--------|----------|--------|------|
| `search_jobs_by_company` | 在 `search_jobs` 中增加 `company` 过滤参数 | ✅ 公司名称匹配准确性 | ⏳ 待实施 |
| `search_jobs_by_platform` | 在 `search_jobs` 中增加 `platform` 过滤参数 | ✅ 多平台筛选支持 | ⏳ 待实施 |
| `search_jobs_near_location` | 增加 `radius` 参数，利用地理空间查询 | ✅ 地理空间索引性能 | ⏳ 待实施 |
| `search_jobs_with_filters` | 扩展支持 `employmentType`, `experienceLevel` 等通用过滤 | ✅ 过滤参数灵活性 | ⏳ 待实施 |
| `search_similar_jobs` | 基于关键词/标签相似度算法 | ✅ 相似度算法准确性 | ⏳ 待实施 |

### **1.2 获取变体 (Fetch Variations)**

| Schema | 实现方案 | 检查点 | 状态 |
|--------|----------|--------|------|
| `fetch_job_description` | 复用现有数据库查询，根据 `job_id` 获取 `description` | ✅ 描述内容完整性 | ⏳ 待实施 |
| `fetch_job_requirements` | 复用现有数据库查询，根据 `job_id` 获取 `requirements/skills` | ✅ 要求字段准确提取 | ⏳ 待实施 |
| `fetch_company_profile` | 复用现有数据库查询，根据公司ID/名称获取公司信息 | ✅ 公司信息丰富性 | ⏳ 待实施 |
| `fetch_salary_range` | 复用现有数据库查询，根据 `job_id` 获取薪资信息 | ✅ 薪资数据标准化 | ⏳ 待实施 |
| `fetch_benefits_for_job` | 复用现有数据库查询，根据 `job_id` 获取福利信息 | ✅ 福利信息准确性 | ⏳ 待实施 |

### **1.3 列表变体 (List Variations)**

| Schema | 实现方案 | 检查点 | 状态 |
|--------|----------|--------|------|
| `list_recent_jobs` | 按 `postedDateISO` 降序排序，不设关键词过滤 | ✅ 时间排序准确性 | ⏳ 待实施 |
| `list_saved_jobs` | 增加 `user_id` 过滤，获取用户收藏职位 | ✅ 用户收藏功能集成 | ⏳ 待实施 |
| `list_trending_titles` | 聚合统计，按职位标题分组计数 | ✅ 聚合统计性能 | ⏳ 待实施 |
| `list_recommended_jobs` | 集成推荐算法（基于用户行为/偏好） | ✅ 推荐算法有效性 | ⏳ 待实施 |

### **阶段一验收标准：**
- [ ] 所有搜索变体工具成功添加到MCP tools list
- [ ] 所有获取变体工具能正确返回数据库数据
- [ ] 所有列表变体工具支持正确的排序和过滤
- [ ] 每个工具都通过本地测试和生产环境测试
- [ ] ChatGPT Apps中能成功调用所有新增工具

---

## 🛠️ 阶段二：第二类 - 真正需要扩展的核心功能

### **2.1 申请管理 (Applications Pipeline)**

| Schema | 实现方案 | 检查点 | 状态 |
|--------|----------|--------|------|
| `create_application` | 新建API，创建职位申请记录 | ✅ 数据模型设计合理 | ⏳ 待实施 |
| `apply_to_job` | 新建API，向特定职位提交申请 | ✅ 与现有 `/api/profile/upsert-application` 集成 | ⏳ 待实施 |
| `withdraw_application` | 新建API，撤回已提交申请 | ✅ 权限控制和状态更新 | ⏳ 待实施 |
| `update_application_status` | 新建API，更新申请状态 | ✅ 招聘方权限控制 | ⏳ 待实施 |
| `add_application_note` | 新建API，为申请添加备注 | ✅ 备注存储和检索 | ⏳ 待实施 |

### **2.2 简历/求职信生成 (Resume/Cover Letter)**

| Schema | 实现方案 | 检查点 | 状态 |
|--------|----------|--------|------|
| `generate_cover_letter` | 新建API，调用现有 `/api/generate-cover-letter` | ✅ 与现有GPT服务集成 | ⏳ 待实施 |
| `tailor_resume_for_job` | 新建API，调用现有 `/api/tailor` | ✅ 与现有服务集成 | ⏳ 待实施 |
| `score_resume_against_job` | 新建API，评估简历与职位匹配度 | ✅ 匹配算法准确性 | ⏳ 待实施 |
| `upload_resume` | 新建API，支持PDF/DOCX文件上传 | ✅ 文件存储和格式转换 | ⏳ 待实施 |

### **2.3 匹配与打分 (Matching & Scoring)**

| Schema | 实现方案 | 检查点 | 状态 |
|--------|----------|--------|------|
| `analyze_job_fit` | 新建API，调用现有 `/src/gpt-services/jobMatch/matchJob.ts` | ✅ 与现有匹配逻辑集成 | ⏳ 待实施 |
| `score_job_fit` | 新建API，调用现有匹配服务获取量化分数 | ✅ 分数计算准确性 | ⏳ 待实施 |
| `compare_jobs_side_by_side` | 新建API，多职位对比功能 | ✅ 对比逻辑清晰性 | ⏳ 待实施 |

### **2.4 其他核心功能**

| Schema | 实现方案 | 检查点 | 状态 |
|--------|----------|--------|------|
| `save_job` | 新建API，用户收藏职位功能 | ✅ 收藏数据存储 | ⏳ 待实施 |
| `star_job` | 新建API，用户标记职位功能 | ✅ 标记状态管理 | ⏳ 待实施 |
| `flag_job` | 新建API，用户举报职位功能 | ✅ 举报处理流程 | ⏳ 待实施 |

### **阶段二验收标准：**
- [ ] 所有申请管理API创建完成并测试通过
- [ ] 所有简历/求职信生成API与现有后端服务正确集成
- [ ] 所有匹配与打分API调用现有匹配逻辑成功
- [ ] 所有收藏/标记功能API创建完成
- [ ] 每个新API都通过单元测试和集成测试
- [ ] ChatGPT Apps中能成功调用所有新功能

---

## ✅ 阶段三：第三类 - 已有功能Double Check

### **3.1 现有MCP工具验证**

| 工具 | 当前状态 | 验证检查点 | 状态 |
|------|----------|------------|------|
| `search_jobs` | ✅ 已实现FAST模式 | ✅ 参数完整性、返回字段、性能、错误处理 | ⏳ 待验证 |
| `build_search_links` | ✅ 已实现 | ✅ 链接生成逻辑、UTM参数、回退逻辑 | ⏳ 待验证 |
| `get_user_applications` | ✅ 已实现 | ✅ 用户身份验证、申请数据完整性 | ⏳ 待验证 |

### **3.2 现有后端服务集成验证**

| 服务 | 后端路径 | MCP集成状态 | 验证检查点 | 状态 |
|------|----------|-------------|------------|------|
| `generate_cover_letter` | `/api/generate-cover-letter` | ❌ 未集成 | ✅ API调用、参数传递、返回格式 | ⏳ 待集成 |
| `tailor_resume` | `/api/tailor` | ❌ 未集成 | ✅ API调用、参数传递、返回格式 | ⏳ 待集成 |
| `analyze_job_fit` | `/src/gpt-services/jobMatch/matchJob.ts` | ❌ 未集成 | ✅ 服务调用、参数传递、返回格式 | ⏳ 待集成 |
| `apply_to_job` | `/api/profile/upsert-application` | ❌ 未集成 | ✅ API调用、参数传递、返回格式 | ⏳ 待集成 |

### **阶段三验收标准：**
- [ ] 所有现有MCP工具功能验证通过
- [ ] 所有现有后端服务成功集成到MCP
- [ ] 所有工具在ChatGPT Apps中正常工作
- [ ] 性能测试通过（响应时间、并发处理）
- [ ] 错误处理测试通过（各种异常情况）

---

## 📋 Schema完整性检查清单

### **从你提供的完整Schema中提取的所有功能点：**

#### **搜索/获取类 (Search & Fetch)**
- [ ] `search_jobs` ✅ 已实现
- [ ] `search_jobs_by_company` ⏳ 阶段一
- [ ] `search_jobs_by_platform` ⏳ 阶段一  
- [ ] `search_jobs_near_location` ⏳ 阶段一
- [ ] `search_jobs_with_filters` ⏳ 阶段一
- [ ] `search_similar_jobs` ⏳ 阶段一
- [ ] `fetch_job` ⏳ 阶段一
- [ ] `fetch_job_description` ⏳ 阶段一
- [ ] `fetch_job_requirements` ⏳ 阶段一
- [ ] `fetch_company_profile` ⏳ 阶段一
- [ ] `fetch_company_jobs` ⏳ 阶段一
- [ ] `fetch_salary_range` ⏳ 阶段一
- [ ] `fetch_benefits_for_job` ⏳ 阶段一

#### **列表类 (List)**
- [ ] `list_recent_jobs` ⏳ 阶段一
- [ ] `list_saved_jobs` ⏳ 阶段一
- [ ] `list_trending_titles` ⏳ 阶段一
- [ ] `list_recommended_jobs` ⏳ 阶段一
- [ ] `list_user_search_history` ⏳ 阶段一

#### **构建链接/导出类 (Deep Links & Export)**
- [ ] `build_job_search_links` ✅ 已实现
- [ ] `build_company_career_links` ⏳ 阶段一
- [ ] `build_apply_link` ⏳ 阶段一
- [ ] `export_job_list_markdown` ⏳ 阶段二
- [ ] `export_job_list_csv` ⏳ 阶段二
- [ ] `export_job_list_json` ⏳ 阶段二

#### **候选人素材类 (Resume/CV/Portfolio)**
- [ ] `parse_resume` ⏳ 阶段二
- [ ] `extract_resume_skills` ⏳ 阶段二
- [ ] `extract_resume_experience` ⏳ 阶段二
- [ ] `score_resume_against_job` ⏳ 阶段二
- [ ] `tailor_resume_for_job` ⏳ 阶段二
- [ ] `generate_resume_from_profile` ⏳ 阶段二
- [ ] `attach_resume_to_application` ⏳ 阶段二
- [ ] `upload_resume` ⏳ 阶段二
- [ ] `remove_resume` ⏳ 阶段二
- [ ] `list_user_resumes` ⏳ 阶段二
- [ ] `select_active_resume` ⏳ 阶段二
- [ ] `link_portfolio` ⏳ 阶段二
- [ ] `unlink_portfolio` ⏳ 阶段二
- [ ] `validate_work_rights` ⏳ 阶段二
- [ ] `check_role_eligibility` ⏳ 阶段二
- [ ] `redact_personal_info` ⏳ 阶段二

#### **求职信/附加材料类 (Letters & Docs)**
- [ ] `generate_cover_letter` ⏳ 阶段三
- [ ] `tailor_cover_letter_for_job` ⏳ 阶段二
- [ ] `generate_thank_you_note` ⏳ 阶段二
- [ ] `generate_follow_up_email` ⏳ 阶段二
- [ ] `generate_referral_request_message` ⏳ 阶段二
- [ ] `upload_supporting_document` ⏳ 阶段二
- [ ] `list_supporting_documents` ⏳ 阶段二
- [ ] `remove_supporting_document` ⏳ 阶段二

#### **匹配与打分类 (Matching & Scoring)**
- [ ] `analyze_job_fit` ⏳ 阶段三
- [ ] `score_job_fit` ⏳ 阶段三
- [ ] `explain_match_score` ⏳ 阶段二
- [ ] `compare_jobs_side_by_side` ⏳ 阶段二
- [ ] `rank_jobs_by_fit` ⏳ 阶段二
- [ ] `deduplicate_job_results` ⏳ 阶段一
- [ ] `enrich_job_with_skills` ⏳ 阶段二
- [ ] `detect_special_requirements` ⏳ 阶段二

#### **申请流转类 (Applications Pipeline)**
- [ ] `create_application` ⏳ 阶段二
- [ ] `apply_to_job` ⏳ 阶段三
- [ ] `withdraw_application` ⏳ 阶段二
- [ ] `update_application_status` ⏳ 阶段二
- [ ] `add_application_note` ⏳ 阶段二

#### **收藏/标记/举报类 (Saved & Moderation)**
- [ ] `save_job` ⏳ 阶段二
- [ ] `unsave_job` ⏳ 阶段二
- [ ] `star_job` ⏳ 阶段二
- [ ] `unstar_job` ⏳ 阶段二
- [ ] `flag_job` ⏳ 阶段二
- [ ] `report_job_issue` ⏳ 阶段二
- [ ] `block_recruiter` ⏳ 阶段二
- [ ] `unblock_recruiter` ⏳ 阶段二
- [ ] `mute_company_updates` ⏳ 阶段二
- [ ] `unmute_company_updates` ⏳ 阶段二

#### **用户申请管理类 (User Applications)**
- [ ] `remove_application_note` ⏳ 阶段二
- [ ] `list_user_applications` ✅ 已实现
- [ ] `get_application` ⏳ 阶段二
- [ ] `archive_application` ⏳ 阶段二
- [ ] `restore_application` ⏳ 阶段二
- [ ] `merge_duplicate_applications` ⏳ 阶段二
- [ ] `tag_application` ⏳ 阶段二
- [ ] `untag_application` ⏳ 阶段二
- [ ] `set_application_priority` ⏳ 阶段二
- [ ] `move_application_stage` ⏳ 阶段二
- [ ] `list_pipeline_stages` ⏳ 阶段二
- [ ] `create_pipeline_stage` ⏳ 阶段二
- [ ] `delete_pipeline_stage` ⏳ 阶段二

#### **沟通/协作类 (Comms & Collaboration)**
- [ ] `find_recruiter_contacts` ⏳ 阶段二
- [ ] `message_recruiter` ⏳ 阶段二
- [ ] `reply_to_recruiter` ⏳ 阶段二
- [ ] `generate_intro_message` ⏳ 阶段二
- [ ] `generate_linkedin_connect_note` ⏳ 阶段二
- [ ] `request_referral` ⏳ 阶段二
- [ ] `send_referral_request` ⏳ 阶段二
- [ ] `log_outreach_activity` ⏳ 阶段二
- [ ] `list_outreach_activities` ⏳ 阶段二
- [ ] `add_reaction_to_job` ⏳ 阶段二
- [ ] `remove_reaction_from_job` ⏳ 阶段二
- [ ] `share_job_to_email` ⏳ 阶段二
- [ ] `share_job_to_slack` ⏳ 阶段二
- [ ] `share_job_to_linkedin` ⏳ 阶段二

#### **面试准备/日程类 (Interview & Scheduling)**
- [ ] `generate_interview_prep` ⏳ 阶段二
- [ ] `generate_company_research_brief` ⏳ 阶段二
- [ ] `generate_questions_to_ask` ⏳ 阶段二
- [ ] `mock_interview_start` ⏳ 阶段二
- [ ] `mock_interview_feedback` ⏳ 阶段二
- [ ] `schedule_interview_event` ⏳ 阶段二
- [ ] `reschedule_interview_event` ⏳ 阶段二
- [ ] `cancel_interview_event` ⏳ 阶段二
- [ ] `list_calendar_events` ⏳ 阶段二
- [ ] `add_calendar_note` ⏳ 阶段二

#### **薪酬与对比类 (Compensation & Benchmark)**
- [ ] `estimate_salary_for_role` ⏳ 阶段二
- [ ] `compare_salary_across_cities` ⏳ 阶段二
- [ ] `generate_compensation_brief` ⏳ 阶段二
- [ ] `draft_negotiation_email` ⏳ 阶段二
- [ ] `draft_counter_offer_message` ⏳ 阶段二

#### **自动化/订阅类 (Automation & Alerts)**
- [ ] `create_job_alert` ⏳ 阶段二
- [ ] `update_job_alert` ⏳ 阶段二
- [ ] `delete_job_alert` ⏳ 阶段二
- [ ] `list_job_alerts` ⏳ 阶段二
- [ ] `subscribe_company_updates` ⏳ 阶段二
- [ ] `unsubscribe_company_updates` ⏳ 阶段二
- [ ] `notify_new_matches` ⏳ 阶段二
- [ ] `notify_application_updates` ⏳ 阶段二
- [ ] `notify_interview_reminders` ⏳ 阶段二
- [ ] `schedule_weekly_digest` ⏳ 阶段二
- [ ] `run_scheduled_search_now` ⏳ 阶段二

#### **账号/集成类 (Accounts & Integrations)**
- [ ] `connect_linkedin` ⏳ 阶段二
- [ ] `disconnect_linkedin` ⏳ 阶段二
- [ ] `connect_seek` ⏳ 阶段二
- [ ] `disconnect_seek` ⏳ 阶段二
- [ ] `connect_indeed` ⏳ 阶段二
- [ ] `disconnect_indeed` ⏳ 阶段二
- [ ] `connect_greenhouse` ⏳ 阶段二
- [ ] `connect_lever` ⏳ 阶段二
- [ ] `connect_workday` ⏳ 阶段二
- [ ] `list_connected_accounts` ⏳ 阶段二
- [ ] `get_user_profile` ⏳ 阶段二
- [ ] `update_user_profile` ⏳ 阶段二
- [ ] `verify_email` ⏳ 阶段二
- [ ] `set_default_location` ⏳ 阶段二
- [ ] `set_job_preferences` ⏳ 阶段二

#### **数据操作类 (Data Ops)**
- [ ] `fetch_user_settings` ⏳ 阶段二
- [ ] `update_user_settings` ⏳ 阶段二
- [ ] `backup_user_data` ⏳ 阶段二
- [ ] `restore_user_data` ⏳ 阶段二
- [ ] `export_user_data` ⏳ 阶段二
- [ ] `import_jobs_from_csv` ⏳ 阶段二
- [ ] `export_applications_csv` ⏳ 阶段二
- [ ] `purge_cached_results` ⏳ 阶段二
- [ ] `warmup_hot_queries` ⏳ 阶段二

#### **合规/隐私类 (Compliance & Privacy)**
- [ ] `gdpr_request_export` ⏳ 阶段二
- [ ] `gdpr_request_delete` ⏳ 阶段二
- [ ] `anonymize_user_data` ⏳ 阶段二
- [ ] `consent_manage_opt_in` ⏳ 阶段二
- [ ] `consent_manage_opt_out` ⏳ 阶段二
- [ ] `get_privacy_policy_link` ⏳ 阶段二

#### **管理员/审计类 (Admin & Audit)**
- [ ] `admin_list_users` ⏳ 阶段二
- [ ] `admin_get_user` ⏳ 阶段二
- [ ] `admin_suspend_user` ⏳ 阶段二
- [ ] `admin_unsuspend_user` ⏳ 阶段二
- [ ] `admin_list_jobs` ⏳ 阶段二
- [ ] `admin_hide_job` ⏳ 阶段二
- [ ] `admin_unhide_job` ⏳ 阶段二
- [ ] `admin_tag_job` ⏳ 阶段二
- [ ] `admin_untag_job` ⏳ 阶段二
- [ ] `admin_audit_log` ⏳ 阶段二
- [ ] `admin_list_integrations` ⏳ 阶段二
- [ ] `admin_rotate_api_keys` ⏳ 阶段二
- [ ] `admin_health_check` ⏳ 阶段二
- [ ] `admin_metrics_snapshot` ⏳ 阶段二

---

## 🔍 每阶段详细检查流程

### **阶段一检查流程：**
1. **代码检查：** 确认所有搜索变体、获取变体、列表变体工具已添加到MCP
2. **参数验证：** 测试每个工具的参数解析和验证逻辑
3. **数据库查询：** 验证所有数据库查询的正确性和性能
4. **本地测试：** 使用curl命令测试每个新增工具
5. **生产测试：** 在ChatGPT Apps中测试每个工具的实际调用
6. **性能测试：** 确保所有工具响应时间在可接受范围内

### **阶段二检查流程：**
1. **API创建：** 确认所有新API端点已创建并部署
2. **业务逻辑：** 验证所有业务逻辑的正确性
3. **集成测试：** 测试与现有后端服务的集成
4. **权限控制：** 验证所有权限控制逻辑
5. **错误处理：** 测试各种异常情况的处理
6. **数据一致性：** 确保数据存储和检索的一致性

### **阶段三检查流程：**
1. **功能验证：** 验证所有现有功能的完整性
2. **集成验证：** 确认现有后端服务与MCP的集成
3. **接口一致性：** 确保所有接口与Schema定义一致
4. **性能验证：** 验证所有功能的性能指标
5. **用户体验：** 在ChatGPT Apps中验证用户体验

---

## 📊 进度跟踪表

| 阶段 | 功能类别 | 工具数量 | 完成状态 | 预计完成时间 | 实际完成时间 |
|------|----------|----------|----------|-------------|-------------|
| 阶段一 | 搜索变体 | 5个 | ⏳ 待开始 | TBD | - |
| 阶段一 | 获取变体 | 5个 | ⏳ 待开始 | TBD | - |
| 阶段一 | 列表变体 | 4个 | ⏳ 待开始 | TBD | - |
| 阶段二 | 申请管理 | 5个 | ⏳ 待开始 | TBD | - |
| 阶段二 | 简历/求职信 | 4个 | ⏳ 待开始 | TBD | - |
| 阶段二 | 匹配与打分 | 3个 | ⏳ 待开始 | TBD | - |
| 阶段二 | 其他核心功能 | 3个 | ⏳ 待开始 | TBD | - |
| 阶段三 | 现有功能验证 | 3个 | ⏳ 待开始 | TBD | - |
| 阶段三 | 后端服务集成 | 4个 | ⏳ 待开始 | TBD | - |

---

## ⚠️ 重要注意事项

1. **Schema完整性：** 此计划涵盖了你提供的完整Schema中的所有功能点，确保无遗漏
2. **现有功能复用：** 充分利用现有的后端服务和数据库查询，避免重复开发
3. **分阶段验收：** 每个阶段完成后必须通过所有检查点才能进入下一阶段
4. **性能考虑：** 所有新增功能都必须考虑性能影响，特别是数据库查询优化
5. **错误处理：** 所有新功能都必须包含完整的错误处理逻辑
6. **文档更新：** 每个阶段完成后都要更新相关文档和测试用例

---

## 🎯 下一步行动

**请确认此计划后，我们将开始实施阶段一：**

1. **确认计划：** 检查此计划是否涵盖了你提供的所有Schema功能点
2. **优先级调整：** 如有需要，可以调整各阶段的优先级
3. **资源分配：** 确认开发资源和时间安排
4. **开始实施：** 按照阶段一的详细步骤开始开发

---

**文档版本：** v1.0  
**创建时间：** 2025-01-13  
**维护者：** Hera AI Team
