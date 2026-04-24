<script setup>
import { ref, reactive, computed } from 'vue';
//vue 响应式 ref简单数据 reactive复杂数据
//切片太小，并发数太高
//切片太大，并发的意义就不大
const chunkSize = 1 * 1024 * 1024;//1MB
//上传切片列表
const uploadFileList = ref([]);
//最大请求并发数 6 流量阀
const maxRequest = ref(6);
const handleUploadFile = async (e) => {
  const fileEle = e.target;
  console.log(fileEle.files);
  if (!fileEle || !fileEle.files || fileEle.files.length === 0) {
    return false
  }

  const useWorker = (file) => {
    return new Promise((resolve) => {
      const worker = new Worker(
        new URL('@/worker/hashWorker.js', import.meta.url)
      )
      worker.postMessage('hello worker')
      worker.onmessage = (e) => {
        console.log(e.data);

      }
    })
  }



  const files = fileEle.files;
  Array.from(files).forEach(async (item, i) => {
    //单个上传文件 
    const file = item;
    console.log(file);
    let inTaskArrItem = reactive({
      id: new Date() + i//文件的唯一ID
    })
    await useWorker(file)
  });
}
</script>

<template>
  <div class="page">
    <div class="page_top">
      <p>正在上传...</p>
    </div>
    <div class="content">

    </div>
    <div class="bottom_box">
      <div class="input_btn">
        选择文件上传
        <input type="file" multiple class="is_input" @change="handleUploadFile">
      </div>
    </div>
  </div>
</template>

<style scoped></style>