<script setup>
import { reactive, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/user';
import { useBeneStore } from '@/stores/surBene';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const userbeneStore = useBeneStore();
const route = useRoute();
const userNo = userStore.user_no;
const selectNo = Number(route.params.no);

const form = reactive({
    date: '',
    title: '',
    content: '',
    file: []
});

const handleFile = (e) => {
    form.file = e.target.files;
};

const submit = async () => {
    const beneNo = userbeneStore.beneficiaries_no;
    const surNo = userbeneStore.survey_no;

    const formData = new FormData();

    formData.append('date', form.date);
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('surNo', surNo);
    formData.append('beneNo', beneNo);
    formData.append('userNo', userNo);

    if (form.file.length > 0) {
        for (let i = 0; i < form.file.length; i++) {
            formData.append('file', form.file[i]);
        }
    }
  }

  try {
    await fetch(`/api/counselUpload`, {
      method: 'POST',
      body: formData
    })
    userbeneStore.refreshCounsel = !userbeneStore.refreshCounsel
    alert('등록 완료')

  } catch (err) {
    console.error(err)
    alert('에러 발생')
  }
}

        alert('저장 완료');
    } catch (err) {
        console.error(err);
        alert('에러 발생');
    }
};

onBeforeMount(async() => {
  await userbeneStore.fetchUsers(selectNo);
})

</script>

<template>
  <div class="p-6 bg-slate-100 min-h-full">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

      <h2 class="text-lg font-bold mb-4 border-b pb-2">상담기록 입력</h2>

      <div class="mb-4">
        <label class="block mb-1  text-sm">상담일</label>
        <input type="date" v-model="form.date"
          class="w-full border rounded px-3  py-2 bg-gray-100"/>
      </div>

      <div class="mb-4 ">
        <label class="block mb-1 border-t pt-2 text-sm">제목</label>
        <input type="text" v-model="form.title"
          class="w-full border rounded px-3 py-2 bg-gray-100"/>
      </div>

      <div class="mb-4">
        <label class="block mb-1 border-t pt-2 text-sm">내용</label>
        <textarea v-model="form.content"
          class="w-full border rounded px-3 py-2 bg-gray-100 h-32"></textarea>
      </div>

      <div class="mb-6 flex border-t pt-2 items-center gap-3">
        <label class="block mb-1  text-sm">첨부파일</label>
      </div>
      <input type="file" multiple @change="handleFile" />

      <div class="text-right">
        <button @click="submit"
          class="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full">
          등록
        </button>
      </div>

    </div>
</template>
