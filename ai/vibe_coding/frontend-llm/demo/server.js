import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 代理API路由
app.post('/api/proxy', async (req, res) => {
  try {
    const { url, method = 'POST', headers = {}, data = {} } = req.body;
    
    // 添加API密钥到请求头
    const authHeaders = {
      ...headers,
      'Authorization': `Bearer ${process.env.VITE_DEEPSEEK_API_KEY}`
    };
    
    const response = await axios({
      url,
      method,
      headers: authHeaders,
      data
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy request error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message || 'Internal Server Error'
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});