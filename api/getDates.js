import { google } from 'googleapis';

export default async function handler(request, response) {
  // [!!! 关键修正 ！！！]
  // 我们把“通行许可”(CORS头)放在最前面。
  // 这样无论服务器后面是否出错，它都会先告诉浏览器“你可以接收我的信息”。
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { videoIds } = request.query;

  // 如果没有收到videoIds，直接返回错误，防止崩溃
  if (!videoIds) {
    return response.status(400).json({ error: 'Missing videoIds parameter' });
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });

  try {
    const res = await youtube.videos.list({
      part: 'snippet',
      id: videoIds,
    });
    // 如果成功，返回200和数据
    return response.status(200).json(res.data);
  } catch (error) {
    // 如果失败，打印错误日志到Vercel后台，方便我们查看
    console.error('YouTube API Error:', error.message);
    // 并且返回500和详细的错误信息
    return response.status(500).json({ 
      error: 'Failed to fetch data from YouTube API.',
      details: error.message 
    });
  }
}