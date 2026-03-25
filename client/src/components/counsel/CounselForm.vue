<script setup>
import { reactive } from 'vue'

const form = reactive({
  date: '',
  title: '',
  content: '',
  file: null
})

const handleFile = (e) => {
  form.file = e.target.files
}

const submit = async () => {
  const formData = new FormData()
  formData.append('date', form.date)
  formData.append('title', form.title)
  formData.append('content', form.content)

  if (form.file) {
    formData.append('file', form.file)
  }
  console.log(form);

  try {
    const result =  await fetch.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('저장 완료')
  } catch (err) {
    console.error(err)
    alert('에러 발생')
  }
}
</script>

<template>
  <div class="p-6 bg-slate-100 min-h-screen">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

      <h2 class="text-lg font-bold mb-4 border-b pb-2">상담기록 입력</h2>

      <!-- 상담일 -->
      <div class="mb-4">
        <label class="block mb-1  text-sm">상담일</label>
        <input type="date" v-model="form.date"
          class="w-full border rounded px-3  py-2 bg-gray-100"/>
      </div>

      <!-- 제목 -->
      <div class="mb-4 ">
        <label class="block mb-1 border-t pt-2 text-sm">제목</label>
        <input type="text" v-model="form.title"
          class="w-full border rounded px-3 py-2 bg-gray-100"/>
      </div>

      <!-- 내용 -->
      <div class="mb-4">
        <label class="block mb-1 border-t pt-2 text-sm">내용</label>
        <textarea v-model="form.content"
          class="w-full border rounded px-3 py-2 bg-gray-100 h-32"></textarea>
      </div>

      <!-- 첨부파일 -->
      <div class="mb-6 flex border-t pt-2 items-center gap-3">
        <input type="file" multiple @change="handleFile" />
      </div>

      <!-- 저장 버튼 -->
      <div class="text-right">
        <button @click="submit"
          class="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full">
          저장
        </button>
      </div>

    </div>
  </div>
</template>

