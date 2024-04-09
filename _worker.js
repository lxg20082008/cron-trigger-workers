// 从环境变量中获取敏感信息
const authKey = process.env.API_TOKEN; // 你的认证密钥
const email = process.env.CF_EMAIL || ACCOUNT.email || USER.email; // 获取 email 信息
const accountID = process.env.ACCOUNT_ID || ACCOUNT.id; // 获取账户 ID
const scriptID = process.env.SCRIPTS_ID || "dingyueqi"; // workers应用“dingyueqi”的scriptID

// 创建一个空的脚本代码对象并转为字符串
const scriptCode = JSON.stringify({ scriptCode: '' });

// 添加事件监听器代码
addEventListener('scheduled', event => {
 event.waitUntil(handleScheduled(event));
});

// 定义计划事件
const cronTrigger = '*/10 * * * *'; // 设置计划事件

async function handleScheduled(event) {
 try {
  // 使用 Cloudflare API 进行重新部署的代码
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountID}/workers/scripts/${scriptID}/preview`, {
   method: 'PUT',
   headers: {
    'X-Auth-Email': email,
    'X-Auth-Key': authKey,
    'Content-Type': 'application/json'
   },
   body: scriptCode
  });

  if (response.ok) {
   console.log(`Worker应用 "${scriptID}" 重新部署成功！`);
  } else {
   const errorText = await response.text();
   console.error(`Worker应用 "${scriptID}" 重新部署失败：`, errorText);
   throw new Error(errorText);
  }
 } catch (error) {
  console.error('触发重新部署时发生错误：', error.message);
 }
}
