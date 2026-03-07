<script setup lang="ts">
import PictureCard from './components/PictureCard.vue'
// composition api 组合式API
import { ref } from 'vue'

const props = defineProps({
  word: {
    type: String,
    default: ''
  },
  audio: {
    type: String,
    default: ''
  }
})

const word = ref('请上传图片')
const audio = ref('')
const update = async (imageDate: string) => {
  console.log(imageDate);

}
const submit = (imageData: string) => {
  console.log(imageData);

}




</script>

<template>
  <div class="container">
    <PictureCard :word="word" :audio="audio" @update-image="submit" />
  </div>
</template>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  font-size: .85rem;
  background: linear-gradient(180deg, rgb(235, 189, 161) 0%, rgb(71, 49, 32) 100%);
}
</style>