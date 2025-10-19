import { google } from 'googleapis';

export default async function handler(request, response) {
  // CORS 头 (允许插件访问)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { videoIds } = request.query;

  // 检查 videoIds 是否存在
  if (!videoIds || typeof videoIds !== 'string') {
    return response.status(400).json({ error: 'Missing or invalid videoIds parameter' });
  }
  
  // 检查 API Key 是否已设置 (这是我们刚刚在Vercel添加的！)
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
      console.error('YOUTUBE_API_KEY environment variable is not set!');
      return response.status(500).json({ error: 'Server configuration error: API Key missing.' });
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey, // 使用我们从环境变量读取的 Key
  });

  try {
    // [!!! 关键修正 !!!] 确保 id 是一个数组
    const idsArray = videoIds.split(','); 
    
    const res = await youtube.videos.list({
      part: 'snippet',
      id: idsArray, // 传递数组给 API
    });
    
    // 成功！返回数据
    return response.status(200).json(res.data);

  } catch (error) {
    // 失败！记录详细错误并返回
    console.error('YouTube API Error:', error.response ? error.response.data : error.message);
    return response.status(500).json({ 
      error: 'Failed to fetch data from YouTube API.',
      // 把Google返回的具体错误信息也告诉前端，方便调试
      details: error.response ? error.response.data.error.message : error.message 
    });
  }
}