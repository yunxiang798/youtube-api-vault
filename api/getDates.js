// 这段代码将运行在Vercel的服务器上，而不是用户的浏览器里
export default async function handler(request, response) {

  // --- 1. 把你的API密钥安全地粘贴在这里 ---
  // ** 把 "AIzaSy..." 替换成你刚刚从Google复制的真实密钥 **
  const API_KEY = AIzaSyBxEDrHjcbiUgMZPeUIhdsbsaQrB01mUK0

  // --- 2. 从前端(Chrome插件)获取它想查询的 videoIds ---
  const { videoIds } = request.query;
  if (!videoIds) {
    return response.status(400).json({ error: 'No videoIds provided' });
  }

  // --- 3. 带着密钥，安全地从服务器“后端”调用Google API ---
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${API_KEY}`;

  try {
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    // --- 4. 将从Google获取的数据原封不动地传回给前端(Chrome插件) ---

    // ** 关键 **：设置CORS头，允许你的Chrome插件访问这个服务器
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ error: 'Failed to fetch data' });
  }
}