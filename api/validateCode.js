export default async function handler(request, response) {
  
  // 1. 从Vercel后台读取你设置的“秘密名单”
  const validCodes = (process.env.LIFETIME_CODES || '').split(',');

  // 2. 获取用户从插件里输入的激活码
  const { code } = request.query;

  // 3. 检查用户输入的码是否在你的清单里
  const isValid = validCodes.includes(code);

  // 4. 设置CORS头 (允许插件访问)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 5. 回复插件：{ "valid": true } 或 { "valid": false }
  return response.status(200).json({ valid: isValid });
}