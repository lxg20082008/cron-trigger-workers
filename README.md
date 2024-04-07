# kvhookpages
# KV触发自动更新Cloudflare Pagess应用

### 定期检查 Workers KV 中的数据变化，比较当前的数据与上次的数据，如果有变化，则触发自动更新Cloudflare Pagess应用。

### 创建命名空间：
Workers 和 Pages -> 创建命名空间，例如变量名称为"KV", KV 命名空间为"txt"。

# 变量说明
|      变量名  |  示例       | 备注                                                              | 
|--------------|------------|-------------------------------------------------------------------|
| HOOK_URL     | dingyueqi  | 被触发重新部署的Pagess应用的hook url。设置 -> 部署挂钩 -> 添加 部署挂钩 | 
| KV_NAMESPACE | txt   
