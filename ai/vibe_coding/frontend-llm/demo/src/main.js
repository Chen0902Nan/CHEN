import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// API代理功能
const callApiThroughProxy = async () => {
  try {
    // 后端代理服务器地址
    const backendProxy = 'http://localhost:3000/api/proxy';
    
    // DeepSeek API端点
    const deepseekEndpoint = 'https://api.deepseek.com/chat/completions';
    
    // 请求数据
    const requestData = {
      url: deepseekEndpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: 'Hello, world!' }
        ]
      }
    };
    
    const response = await fetch(backendProxy, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
    <div class="card">
      <button id="testApi" type="button">测试API代理调用</button>
      <div id="apiResult" style="margin-top: 20px; min-height: 50px;"></div>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))

// 添加API测试按钮的事件监听器
document.querySelector('#testApi').addEventListener('click', async () => {
  const resultDiv = document.querySelector('#apiResult');
  resultDiv.textContent = '正在调用API...';
  
  try {
    const result = await callApiThroughProxy();
    resultDiv.textContent = JSON.stringify(result, null, 2);
    resultDiv.style.color = '#4caf50';
  } catch (error) {
    resultDiv.textContent = `错误: ${error.message}`;
    resultDiv.style.color = '#f44336';
  }
})
