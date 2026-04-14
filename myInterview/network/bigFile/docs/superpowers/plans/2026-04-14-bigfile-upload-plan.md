# 大文件上传 Demo 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个完整的大文件上传系统，包含分片上传、秒传、断点续传功能

**Architecture:** 前端用 React 通过 CDN 引入实现单页应用，使用 WebWorker + spark-md5 计算 hash；后端用 Node.js 原生 http 模块实现上传服务，文件存储在本地文件系统

**Tech Stack:** React (CDN), spark-md5, Node.js 原生 http

---

## 文件结构

```
bigFile/
├── server/
│   ├── index.js          # 入口，启动服务
│   ├── uploadHandler.js  # 处理分片上传
│   ├── mergeHandler.js   # 处理分片合并
│   ├── checkHandler.js   # 处理秒传检查和已上传分片查询
│   └── utils.js         # 工具函数
└── client/
    ├── index.html        # 主页面
    ├── App.jsx           # React组件
    ├── worker.js         # WebWorker计算hash
    └── style.css         # 样式
```

---

### Task 1: 服务端 - 入口和工具函数

**Files:**
- Create: `server/utils.js`
- Create: `server/index.js`

- [ ] **Step 1: 创建 server/utils.js**

```javascript
// server/utils.js
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, 'uploads');

// 确保目录存在
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// 获取文件元数据
function getMetadata(hash) {
    const metaPath = path.join(UPLOAD_DIR, hash, 'metadata.json');
    if (fs.existsSync(metaPath)) {
        return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    }
    return null;
}

// 保存文件元数据
function saveMetadata(hash, data) {
    const metaPath = path.join(UPLOAD_DIR, hash, 'metadata.json');
    fs.writeFileSync(metaPath, JSON.stringify(data, null, 2));
}

module.exports = { UPLOAD_DIR, ensureDir, getMetadata, saveMetadata };
```

- [ ] **Step 2: 创建 server/index.js**

```javascript
// server/index.js
const http = require('http');
const path = require('path');
const { uploadChunk } = require('./uploadHandler');
const { mergeChunks } = require('./mergeHandler');
const { checkFile } = require('./checkHandler');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 设置 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = req.url;

    // 文件下载
    if (req.method === 'GET' && url.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, url);
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        return;
    }

    // 秒传检查 + 已上传分片查询
    if (req.method === 'GET' && url.startsWith('/api/check')) {
        checkFile(req, res);
        return;
    }

    // 上传分片
    if (req.method === 'POST' && url === '/api/upload') {
        uploadChunk(req, res);
        return;
    }

    // 合并分片
    if (req.method === 'POST' && url === '/api/merge') {
        mergeChunks(req, res);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
```

---

### Task 2: 服务端 - 秒传检查和已上传分片查询

**Files:**
- Create: `server/checkHandler.js`

- [ ] **Step 1: 创建 server/checkHandler.js**

```javascript
// server/checkHandler.js
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR, ensureDir, getMetadata, saveMetadata } = require('./utils');

function checkFile(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const hash = url.searchParams.get('hash');
    const filename = url.searchParams.get('filename');

    if (!hash || !filename) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing hash or filename' }));
        return;
    }

    const fileDir = path.join(UPLOAD_DIR, hash);
    const finalPath = path.join(fileDir, filename);

    // 检查是否已完全合并（秒传）
    if (fs.existsSync(finalPath)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            skip: true,
            message: 'File already exists'
        }));
        return;
    }

    // 获取已上传分片列表
    const metadata = getMetadata(hash);
    const uploadedChunks = metadata ? metadata.uploadedChunks : [];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        skip: false,
        uploadedChunks: uploadedChunks
    }));
}

module.exports = { checkFile };
```

---

### Task 3: 服务端 - 分片上传处理

**Files:**
- Modify: `server/index.js` (添加 fs require)
- Create: `server/uploadHandler.js`

- [ ] **Step 1: 修改 server/index.js 添加 fs require**

在 `const http = require('http');` 后添加：
```javascript
const fs = require('fs');
```

- [ ] **Step 2: 创建 server/uploadHandler.js**

```javascript
// server/uploadHandler.js
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR, ensureDir, getMetadata, saveMetadata } = require('./utils');

function uploadChunk(req, res) {
    const chunks = [];
    let hash = '';
    let chunkIndex = -1;
    let filename = '';

    req.on('data', (chunk) => {
        chunks.push(chunk);
    });

    req.on('end', () => {
        try {
            const buffer = Buffer.concat(chunks);
            const boundary = req.headers['content-type'].split('boundary=')[1];

            // 简单解析 multipart 数据
            const parts = buffer.toString('binary').split(`--${boundary}`);
            for (const part of parts) {
                if (part.includes('filename')) {
                    // 提取 hash 和 chunkIndex
                    const hashMatch = part.match(/hash="([^"]+)"/);
                    const indexMatch = part.match(/name="chunkIndex"/);
                    const nameMatch = part.match(/name="filename"/);

                    if (hashMatch) hash = hashMatch[1];
                    if (indexMatch && nameMatch) {
                        // 从 part 中提取二进制数据
                        const headerEnd = part.indexOf('\r\n\r\n');
                        const binaryData = part.substring(headerEnd + 4);
                        // 去掉结尾的 \r\n
                        const cleanData = binaryData.replace(/\r\n--$/, '');

                        filename = decodeURIComponent(nameMatch[1]);
                        chunkIndex = parseInt(indexMatch[1], 10);

                        // 保存分片
                        const chunkDir = path.join(UPLOAD_DIR, hash, 'chunks');
                        ensureDir(chunkDir);
                        const chunkPath = path.join(chunkDir, String(chunkIndex));
                        fs.writeFileSync(chunkPath, cleanData, 'binary');

                        // 更新 metadata
                        const metadata = getMetadata(hash) || {
                            filename,
                            totalChunks: 0,
                            uploadedChunks: []
                        };
                        metadata.filename = filename;
                        if (!metadata.uploadedChunks.includes(chunkIndex)) {
                            metadata.uploadedChunks.push(chunkIndex);
                            metadata.uploadedChunks.sort((a, b) => a - b);
                        }
                        saveMetadata(hash, metadata);

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            chunkIndex,
                            uploadedChunks: metadata.uploadedChunks
                        }));
                        return;
                    }
                }
            }

            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        } catch (err) {
            console.error('Upload error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    });
}

module.exports = { uploadChunk };
```

---

### Task 4: 服务端 - 分片合并处理

**Files:**
- Create: `server/mergeHandler.js`

- [ ] **Step 1: 创建 server/mergeHandler.js**

```javascript
// server/mergeHandler.js
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR, getMetadata } = require('./utils');

function mergeChunks(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        try {
            const { hash, totalChunks } = JSON.parse(body);

            if (!hash) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing hash' }));
                return;
            }

            const metadata = getMetadata(hash);
            if (!metadata) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'File not found' }));
                return;
            }

            const { filename, uploadedChunks } = metadata;

            // 检查分片是否完整
            if (uploadedChunks.length < totalChunks) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Chunks not complete',
                    uploaded: uploadedChunks.length,
                    total: totalChunks
                }));
                return;
            }

            // 合并文件
            const chunkDir = path.join(UPLOAD_DIR, hash, 'chunks');
            const finalPath = path.join(UPLOAD_DIR, hash, filename);
            const writeStream = fs.createWriteStream(finalPath);

            for (let i = 0; i < totalChunks; i++) {
                const chunkPath = path.join(chunkDir, String(i));
                const chunkData = fs.readFileSync(chunkPath);
                writeStream.write(chunkData);
            }
            writeStream.end();

            // 清理分片
            fs.rmSync(chunkDir, { recursive: true, force: true });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                path: `/uploads/${hash}/${filename}`
            }));
        } catch (err) {
            console.error('Merge error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    });
}

module.exports = { mergeChunks };
```

---

### Task 5: 前端 - WebWorker 计算 hash

**Files:**
- Create: `client/worker.js`

- [ ] **Step 1: 创建 client/worker.js**

```javascript
// client/worker.js
importScripts('https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js');

self.onmessage = function(e) {
    const file = e.data;
    const chunkSize = 2 * 1024 * 1024; // 2MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let hash = '';

    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();

    function readNextChunk() {
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        reader.onload = function(e) {
            spark.append(e.target.result);
            currentChunk++;

            // 发送进度
            self.postMessage({
                type: 'progress',
                progress: Math.round((currentChunk / totalChunks) * 100),
                current: currentChunk,
                total: totalChunks
            });

            if (currentChunk < totalChunks) {
                readNextChunk();
            } else {
                hash = spark.end();
                self.postMessage({
                    type: 'complete',
                    hash: hash,
                    totalChunks: totalChunks
                });
            }
        };

        reader.onerror = function() {
            self.postMessage({
                type: 'error',
                error: 'Failed to read chunk'
            });
        };

        reader.readAsArrayBuffer(chunk);
    }

    readNextChunk();
};
```

---

### Task 6: 前端 - React 组件

**Files:**
- Create: `client/App.jsx`

- [ ] **Step 1: 创建 client/App.jsx**

```javascript
// client/App.jsx
const { useState, useRef, useCallback } = React;

function App() {
    const [file, setFile] = useState(null);
    const [hash, setHash] = useState(null);
    const [hashProgress, setHashProgress] = useState(0);
    const [uploadedChunks, setUploadedChunks] = useState([]);
    const [totalChunks, setTotalChunks] = useState(0);
    const [uploadingChunks, setUploadingChunks] = useState([]);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState(null);

    const workerRef = useRef(null);
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_CONCURRENT = 3;

    // 初始化 WebWorker
    const initWorker = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
        }
        workerRef.current = new Worker('./worker.js');
        workerRef.current.onmessage = function(e) {
            const { type, hash: fileHash, progress: prog, current, total, error, uploadedChunks: chunks } = e.data;

            if (type === 'progress') {
                setHashProgress(prog);
                setMessage(`计算 hash: ${current}/${total}`);
            } else if (type === 'complete') {
                setHash(fileHash);
                setTotalChunks(total);
                setHashProgress(100);
                checkAndUpload(fileHash, total);
            } else if (type === 'error') {
                setStatus('error');
                setMessage(error || 'Hash 计算失败');
            }
        };
    }, [file]);

    // 检查文件并开始上传
    const checkAndUpload = async (fileHash, total) => {
        setStatus('checking');
        setMessage('检查文件...');

        try {
            const res = await fetch(`/api/check?hash=${fileHash}&filename=${encodeURIComponent(file.name)}`);
            const data = await res.json();

            if (data.skip) {
                setStatus('done');
                setMessage('秒传成功！');
                setResult({ path: `/uploads/${fileHash}/${file.name}`, type: 'skip' });
                return;
            }

            setUploadedChunks(data.uploadedChunks || []);
            const missingChunks = [];
            for (let i = 0; i < total; i++) {
                if (!data.uploadedChunks.includes(i)) {
                    missingChunks.push(i);
                }
            }

            if (missingChunks.length === 0) {
                setStatus('done');
                setMessage('文件已完整上传');
                return;
            }

            setStatus('uploading');
            setMessage(`开始上传 ${missingChunks.length} 个分片...`);
            uploadChunks(file, missingChunks, fileHash, total);
        } catch (err) {
            setStatus('error');
            setMessage('检查文件失败: ' + err.message);
        }
    };

    // 上传单个分片
    const uploadChunk = async (file, chunkIndex, fileHash, total) => {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('hash', fileHash);
        formData.append('chunkIndex', chunkIndex);
        formData.append('filename', file.name);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            throw new Error('Upload failed');
        }

        return await res.json();
    };

    // 并行上传分片
    const uploadChunks = async (file, chunks, fileHash, total) => {
        let completed = 0;
        const totalToUpload = chunks.length;
        const uploading = new Set();
        let idx = 0;

        const updateProgress = () => {
            const uploadedCount = uploadedChunks.length + completed;
            setProgress(Math.round((uploadedCount / total) * 100));
            setMessage(`上传中: ${uploadedCount}/${total}`);
        };

        const uploadNext = async () => {
            if (idx >= chunks.length) {
                // 等待所有上传完成
                return;
            }

            const currentIdx = chunks[idx++];
            uploading.add(currentIdx);
            setUploadingChunks([...uploading]);

            try {
                const result = await uploadChunk(file, currentIdx, fileHash, total);
                uploading.delete(currentIdx);
                setUploadingChunks([...uploading]);

                // 更新已上传分片
                setUploadedChunks(prev => {
                    const newList = [...prev, currentIdx].sort((a, b) => a - b);
                    return newList;
                });

                completed++;
                updateProgress();

                // 继续上传下一个
                await uploadNext();
            } catch (err) {
                uploading.delete(currentIdx);
                setUploadingChunks([...uploading]);
                console.error('Chunk upload failed:', err);
                // 重试
                chunks.push(currentIdx);
                await uploadNext();
            }
        };

        // 启动并行上传
        const promises = [];
        for (let i = 0; i < MAX_CONCURRENT; i++) {
            promises.push(uploadNext());
        }

        await Promise.all(promises);

        // 合并
        if (completed === totalToUpload) {
            setStatus('merging');
            setMessage('正在合并文件...');

            try {
                const res = await fetch('/api/merge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ hash: fileHash, totalChunks: total })
                });
                const data = await res.json();

                if (data.success) {
                    setStatus('done');
                    setMessage('上传成功！');
                    setResult({ path: data.path, type: 'success' });
                } else {
                    setStatus('error');
                    setMessage(data.error || '合并失败');
                }
            } catch (err) {
                setStatus('error');
                setMessage('合并失败: ' + err.message);
            }
        }
    };

    // 选择文件
    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setHash(null);
        setHashProgress(0);
        setUploadedChunks([]);
        setProgress(0);
        setStatus('hashing');
        setMessage('开始计算文件 hash...');
        setResult(null);

        initWorker();
        workerRef.current.postMessage(selectedFile);
    };

    // 拖拽处理
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const input = document.createElement('input');
            input.type = 'file';
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(droppedFile);
            input.files = dataTransfer.files;
            handleFileSelect({ target: input });
        }
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    return (
        <div className="container">
            <h1>大文件上传 Demo</h1>

            <div
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <p>拖拽文件到此处，或</p>
                <input type="file" onChange={handleFileSelect} />
            </div>

            {file && (
                <div className="file-info">
                    <p><strong>文件名:</strong> {file.name}</p>
                    <p><strong>大小:</strong> {formatSize(file.size)}</p>
                    {hash && <p><strong>Hash:</strong> {hash}</p>}
                </div>
            )}

            {status !== 'idle' && (
                <div className="progress-container">
                    <div className="progress-item">
                        <label>Hash 计算进度:</label>
                        <div className="progress-bar">
                            <div className="progress-fill hash" style={{ width: hashProgress + '%' }}></div>
                        </div>
                        <span>{hashProgress}%</span>
                    </div>

                    {totalChunks > 0 && (
                        <div className="progress-item">
                            <label>上传进度:</label>
                            <div className="progress-bar">
                                <div className="progress-fill upload" style={{ width: progress + '%' }}></div>
                            </div>
                            <span>{progress}%</span>
                        </div>
                    )}

                    <p className="status-message">{message}</p>
                </div>
            )}

            {result && (
                <div className={`result ${result.type}`}>
                    {result.type === 'skip' ? '秒传成功！' : '上传成功！'}
                    <a href={result.path} target="_blank">查看文件</a>
                </div>
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

### Task 7: 前端 - HTML 和 CSS

**Files:**
- Create: `client/index.html`
- Create: `client/style.css`

- [ ] **Step 1: 创建 client/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>大文件上传 Demo</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel" src="./App.jsx"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 client/style.css**

```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 40px 20px;
}

.container {
    background: white;
    border-radius: 12px;
    padding: 40px;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.drop-zone {
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s;
}

.drop-zone:hover {
    border-color: #007bff;
}

.drop-zone input {
    margin-top: 10px;
}

.file-info {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.file-info p {
    margin: 5px 0;
    word-break: break-all;
}

.progress-container {
    margin-top: 20px;
}

.progress-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 15px 0;
}

.progress-item label {
    min-width: 100px;
    color: #666;
}

.progress-bar {
    flex: 1;
    height: 20px;
    background: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    transition: width 0.3s;
    border-radius: 10px;
}

.progress-fill.hash {
    background: linear-gradient(90deg, #667eea, #764ba2);
}

.progress-fill.upload {
    background: linear-gradient(90deg, #11998e, #38ef7d);
}

.status-message {
    text-align: center;
    color: #666;
    margin-top: 15px;
}

.result {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
}

.result.success {
    background: #d4edda;
    color: #155724;
}

.result.skip {
    background: #cce5ff;
    color: #004085;
}

.result a {
    display: inline-block;
    margin-top: 10px;
    color: #007bff;
}
```

---

## 验证计划

### 测试场景

1. **秒传测试**: 上传同一文件两次，第二次应立即返回成功
2. **断点续传测试**: 上传中断后重新选择同一文件，应从中断处继续
3. **分片上传测试**: 上传大文件，验证分片是否正确上传

### 验证命令

1. 启动服务器: `cd server && node index.js`
2. 访问: `http://localhost:3000/client/`
3. 选择文件并观察上传过程