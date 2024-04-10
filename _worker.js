addEventListener('scheduled', event => {
  event.waitUntil(triggerDeploy());
});

async function triggerDeploy() {
  // 环境变量定义
  const authKey = env.API_TOKEN;  // 认证密钥
  const email = env.CF_EMAIL || ACCOUNT.email || USER.email;  // 获取 email 信息，优先使用环境变量
  const accountID = env.ACCOUNT_ID || ACCOUNT.id; // 获取账户 ID，优先使用环境变量
  const scriptID = env.SCRIPTS_ID || "dingyueqi"; // workers应用"dingyueqi"的scriptID

  const cloudflareApiBaseUrl = 'https://api.cloudflare.com/client/v4'; // Cloudflare API 基础 URL
  const cronExpression = '*/10 * * * *'; // cron 表达式，表示每十分钟执行一次部署操作

  // 检查当前时间是否匹配 cron 表达式
  if (!isScheduledTime(cronExpression)) {
    console.log('Not scheduled time.'); // 如果不匹配，则输出日志并返回
    return;
  }

  try {
    const response = await fetch(subscriberScriptUrl());
    
    if (response.ok) {
      const script = await response.text();
      const headers = { 'Content-Type': 'application/javascript' };

      // 部署订阅器 Worker
      await deployWorker();
      
      return new Response('Subscriber Worker deployed successfully.', { status: 200 });
    } else {
      throw new Error('Failed to fetch subscriber script.');
    }
  } catch (error) {
    console.error('Error deploying subscriber worker:', error);
    return new Response('Error deploying subscriber worker.', { status: 500 });
  }
}

async function deployWorker() {
  const WORKERS_API_URL = `${cloudflareApiBaseUrl}/accounts/${accountID}/workers/scripts/${scriptID}`;
  const scriptCode = JSON.stringify({ scriptCode: '' });

  const response = await fetch(WORKERS_API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Key': authKey,
      'X-Auth-Email': email
    },
    body: scriptCode
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to deploy subscriber worker: ${errorText}`);
  }
}

function subscriberScriptUrl() {
  return `${cloudflareApiBaseUrl}/accounts/${accountID}/workers/scripts/${scriptID}`;
}

// 检查当前时间是否匹配 cron 表达式
function isScheduledTime(cronExpression) {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.split(' ');
  const now = new Date();
  return (
    matchField(now.getMinutes(), minute) &&
    matchField(now.getHours(), hour) &&
    matchField(now.getDate(), dayOfMonth) &&
    matchField(now.getMonth() + 1, month) &&
    matchField(now.getDay(), dayOfWeek)
  );
}

// 检查字段是否匹配给定的值或范围
function matchField(value, expression) {
  if (expression === '*') {
    return true; // 如果表达式为 *，则匹配任意值
  }
  const values = expression.split(',');
  return values.includes(value.toString()); // 如果字段的值在表达式中，则返回 true
}
