# 怎么实现拖拽功能，需要什么样的api或能力？

1. 拖拽是什么？
   前端拖拽=用户鼠标/手指按住元素，移动后松开，完成交互的完整行为
2. 交互带来的好处

- 直观零学习成本
  符合现实世界操作习惯(拖文件)，不用教用户
  小孩子都会
- 操作效率翻倍 减少点击 选择 确认等多步操作 一步完成
- 支持文件、元素、列表顺序

## github 拖拽上传 VS 普通上传

- github拖拽上传 直接拖拽，松手就上传 支持批量拖拽、把3,5步操作压缩成一步 百度网盘，腾讯文档，github，figma

### API

HTML5原生拖拽API

- 被拖拽元素事件
  dragstart 开始拖拽时触发
  drag 拖拽过程中持续触发
  dragend 拖拽结束时触发

- 放置区域(容器)事件
  - dragover 拖拽元素在目标上移动时触发
  - dragenter 刚进入
  - dragleave 离开
  - drop 松开鼠标

- 元素上添加 draggable="true"
- 获得文件
  datatransfer.files

## 如果有一个提交请求，如果请求的图片或文件是怎么上传的？

### 普通表单

- 普通请求
  普通请求传 json 文本，文件上传需用FormData，请求头指定multipart/form-data，传输二进制流，数据格式、编码方式完全不同。

// 构造表单数据，普通参数+文件一起传
const formData = new FormData();
formData.append('username', 'test');
formData.append('password', '123456');
formData.append('file', file); // 图片文件

// axios发送，不用手动改请求头
axios.post('/login', formData);

- 文件 / 图片上传，本质就是前端把二进制文件打包，后端接收并存储，最后返回可访问地址。
  普通表单上传、 大文件分片上传（处理大视频 / 大压缩包）。

### 大文件上传

```js
// 普通表单上传
// 用 form 表单，必须加 enctype="multipart/form-data"，这是告诉后端 “我传的是文件，不是普通文本”；

// 用 input type="file" 选择文件，通过 AJAX/axios 提交给后端。

// <!-- 表单必须加这个编码格式 -->
<form enctype="multipart/form-data">
  <input type="file" name="file" accept="image/*" />
  <button type="button" onclick="upload()">上传图片</button>
</form>

<script>
async function upload() {
  // 1. 创建FormData，专门装文件
  const formData = new FormData();
  // 把选中的文件放进去
  formData.append('file', document.querySelector('input[type=file]').files[0]);

  // 2. 发请求
  const res = await axios.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  console.log("上传成功，图片地址：", res.data.url);
}
</script>
{/* 后端怎么做
接收前端传来的 multipart 格式数据；
解析出二进制文件；
存到本地 / 云存储（OSS/COS），返回访问 URL。 static 服务器， public 目录下 */}
```

如果传几百 M 的视频、安装包，普通上传容易超时、断传就得重传。

前端把文件切成一片一片（比如每片 5MB）； http 多路复用 失败仅重传分片
const fileInput = document.querySelector('input[type="file"]');
const chunkSize = 5 _ 1024 _ 1024; // 5MB 一片

fileInput.onchange = async (e) => { const file = e.target.files[0]; if (!file) return;

// 新建 WebWorker const worker = new Worker('./hash.worker.js');

// 通知 worker 开始切割+计算文件md5 worker.postMessage({ file, chunkSize });

// 接收 worker 返回的分片数组 + 文件唯一hash worker.onmessage = (e) => { const { chunks, fileHash } = e.data; console.log('文件唯一标识：', fileHash); console.log('所有分片：', chunks);

// 后续并行上传分片、后端合并、秒传判断
uploadChunks(chunks, fileHash);
}; };

// 分片并行上传 async function uploadChunks(chunks, fileHash) { for (const chunk of chunks) { const fd = new FormData(); fd.append('chunk', chunk.blob); fd.append('index', chunk.index); fd.append('fileHash', fileHash); axios.post('/api/chunk-upload', fd); } }

importScripts('https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js');

// 监听主线程消息 self.onmessage = async (e) => { const { file, chunkSize } = e.data; const chunks = []; const spark = new SparkMD5.ArrayBuffer(); const reader = new FileReader();

let cur = 0;

// 循环切片 while (cur < file.size) { const blob = file.slice(cur, cur + chunkSize); chunks.push({ blob, index: cur / chunkSize }); cur += chunkSize; }

// 读取文件计算整体 MD5 哈希 reader.readAsArrayBuffer(file); reader.onload = (ev) => { spark.append(ev.target.result); const fileHash = spark.end(); // 文件唯一指纹

// 把结果回传给主线程
self.postMessage({ chunks, fileHash });
}; };

const Koa = require('koa'); const Router = require('koa-router'); const multer = require('@koa/multer'); const fs = require('fs'); const path = require('path'); const fse = require('fs-extra');

const app = new Koa(); const router = new Router();

app.use(require('koa-body')());

// 目录配置 const UPLOAD_DIR = path.resolve(\_\_dirname, 'upload'); const CHUNK_DIR = path.resolve(UPLOAD_DIR, 'chunks'); fse.ensureDirSync(UPLOAD_DIR); fse.ensureDirSync(CHUNK_DIR);

const upload = multer({ dest: CHUNK_DIR });

- 后端

// 1. 秒传接口 + 查询已上传分片（断点重传核心） // ====================== router.post('/api/check-file', async (ctx) => { const { fileHash, filename } = ctx.request.body; const ext = filename.split('.').pop(); const finalPath = path.join(UPLOAD_DIR, ${fileHash}.${ext});

// 【秒传】文件已存在，直接返回地址 if (fs.existsSync(finalPath)) { ctx.body = { code: 200, shouldUpload: false, url: http://localhost:3000/upload/${fileHash}.${ext} }; return; }

// 【断点重传】查询该文件已经上传了哪些分片 const chunkDir = path.join(CHUNK_DIR, fileHash); let uploadedChunks = []; if (fs.existsSync(chunkDir)) { uploadedChunks = await fse.readdir(chunkDir); uploadedChunks = uploadedChunks.map(Number).sort((a, b) => a - b); }

ctx.body = { code: 200, shouldUpload: true, uploadedChunks // 前端拿到后，只上传缺失的分片 }; });

// ====================== // 2. 接收单个分片 // ====================== router.post('/api/chunk', upload.single('chunk'), async (ctx) => { const { fileHash, index } = ctx.request.body; const chunkDir = path.join(CHUNK_DIR, fileHash); await fse.ensureDir(chunkDir);

const chunkPath = path.join(chunkDir, index); await fse.move(ctx.file.path, chunkPath);

ctx.body = { code: 200, msg: '分片上传成功' }; });

// ====================== // 3. 合并所有分片 // ====================== router.post('/api/merge', async (ctx) => { const { fileHash, filename } = ctx.request.body; const ext = filename.split('.').pop(); const chunkDir = path.join(CHUNK_DIR, fileHash); const finalPath = path.join(UPLOAD_DIR, ${fileHash}.${ext});

// 读取分片并排序 let chunks = await fse.readdir(chunkDir); chunks = chunks.map(Number).sort((a, b) => a - b);

// 流合并 const writeStream = fs.createWriteStream(finalPath); for (const index of chunks) { const chunkPath = path.join(chunkDir, index); const readStream = fs.createReadStream(chunkPath); await new Promise(resolve => { readStream.pipe(writeStream, { end: false }); readStream.on('end', resolve); }); } writeStream.end();

// 删除临时分片文件夹 await fse.remove(chunkDir);

ctx.body = { code: 200, url: http://localhost:3000/upload/${fileHash}.${ext} }; });

app.use(router.routes()); app.listen(3000, () => console.log('服务 3000 启动'));
