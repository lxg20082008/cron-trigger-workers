# cron-trigger-workers
# 触发按计划时间自动重新部署Cloudflare  Workers应用

### 定期cron运行，触发自动更新另一个Cloudflare Workers应用重新部署。
# 按需修改cron UTC 时间： const cronExpression = '*/10 * * * *'; // cron 表达式，表示每十分钟执行一次部署操作
# 变量说明
|      变量名  |  示例       | 备注                                                                                | 
|--------------|------------|-------------------------------------------------------------------------------------|
| API_TOKEN    |            | API令牌                                                                              |       
| CF_EMAIL     |            | 被触发按计划时间自动重新部署Cloudflare  Workers应用账户的邮箱。与本应用同一账户的尝试自动提取 |
| ACCOUNT_ID   |            | 被触发按计划时间自动重新部署Cloudflare  Workers应用账户的ID。与本应用同一账户的尝试自动提取   |
| SCRIPTS_ID   | dingyueqi  | 被触发按计划时间自动重新部署Cloudflare  Workers应用名称。默认"dingyueqi"                   |
