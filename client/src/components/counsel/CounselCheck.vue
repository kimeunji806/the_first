<script setup>
import { ref,computed, onBeforeMount ,watch} from 'vue';
import { useBeneStore } from '@/stores/surBene'
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userbeneStore = useBeneStore();
const route = useRoute();

const historyDialog = ref(false)
const historyData = ref([])

const selectNo = Number(route.params.no);
const list = ref([]);
const surNo = computed(() => {
  return userbeneStore.survey_no
});
const userName = userStore.user_name;
const userNo = userStore.user_no;
const userRole = userStore.role;
const beneName = userbeneStore.beneficiaries_name;



const counsel = async () => {
  await fetch(`/api/counsel/${surNo.value}`)
    .then((resp) => resp.json())
    .then((data) => {
      list.value = (Array.isArray(data) ? data : [data]).map(item => ({
        ...item,
        filename: item.filename ? item.filename.split(',') : [],
        isEditing: false,
        newFiles: [],
        deleteFiles: [], // ⭐ 중요
        isYour: item.wNo === userNo,
      }))
    })
};


const handleClick = (item) => {
  if (item.isEditing) {
    counselUpdate(item)
  }

  item.isEditing = !item.isEditing
}

const handleFileUpload = (e, item) => {
  item.newFiles = Array.from(e.target.files);
};

const removeFile = (item, file) => {
  item.deleteFiles.push(file);
  item.filename = item.filename.filter(f => f !== file);
};

const counselUpdate = async (item) => {
  const formData = new FormData();

  formData.append("no", item.no);
  formData.append("title", item.title);
  formData.append("content", item.content);
  formData.append("name", userName);
  formData.append("role", userRole);

  item.newFiles.forEach(file => {
    formData.append("files", file);
  });

  formData.append("deleteFiles", JSON.stringify(item.deleteFiles));

  await fetch(`/api/counselUpdate`, {
    method: "PUT",
    body: formData
  });

  await counsel();
};

const counselHistory = async (no) => {
  await fetch(`/api/counselHistory/${no}`)
    .then((resp) => resp.json())
    .then((data) => {
      historyData.value = data
      historyDialog.value = true
    })
}

const counselDelete = async (no) => {
  if (confirm("정말 삭제하시겠습니까?") == true) {
    await fetch(`/api/counselDelete/${no}`, {
    method: 'delete',
  })
  await counsel();
  }
}

watch(() => userbeneStore.refreshCounsel, async() => {
  await counsel();
})

onBeforeMount(async() => {
  await userbeneStore.fetchUsers(selectNo);
  await counsel();
})

</script>

<template>
  <div class="card h-5/10 flex flex-col gap 4">
    <div class="overflow-y-auto">
      <div v-if="list.length === 0" class="text-center text-gray-500 py-10">등록된 상담기록이 없습니다.</div>
      <div v-else></div>
      <div v-for="(item, index) in list" :key="index" class="mb-6 border-b pb-4">
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="font-semibold" :data-no="item.no">
            상담기록 {{ index + 1 }}
          </div>

          <div class="text-sm  text-gray-600">
            작성자 {{ item.name }} &nbsp;
            작성일 {{ item.created_at }}
            
          </div>
        </div>

        <div class="border-t border-b py-2 mb-2">
          <span class="mr-2 font-medium">제목</span>
          <span v-if="!item.isEditing">{{ item.title }}</span>
          <InputText v-if="item.isEditing" v-model="item.title" class="w-full md:w-[13rem]"/>
        </div>
          
        <div class="border-b py-2 mb-2"> 
          <span class="mr-2 font-medium">내용</span>
          <span v-if="!item.isEditing">{{ item.content }}</span>
          <InputText v-if="item.isEditing" v-model="item.content" class="w-full md:w-[13rem]"/>
        </div>

        <div class="border-b py-2 mb-2">
        <span class="mr-2 font-medium">첨부 파일</span>

        <div v-for="(file, i) in item.filename" :key="i">
          <a :href="`/api/download/${encodeURIComponent(file)}`">
          {{ file }}
          </a>
          <button v-if="item.isEditing" @click="removeFile(item, file)">❌</button>
        </div>
        <div v-if="item.isEditing" class="mt-2">
        <input type="file" multiple @change="handleFileUpload($event, item)" />
        </div>
        </div>

        <div class="py-2">
          <span class="mr-2 font-medium">상담일자</span>
          <span>{{ item.counseldate }}</span>
        </div>
      </div>
      <div class="mt-auto flex justify-end gap-2">
        <Button type="submit" label="수정이력" class="w-24" @click="counselHistory(item.no)" />
        <Button type="button" class="w-24" v-if="item.isYour" :label="item.isEditing ? '저장' : '수정'" @click="handleClick(item)"/>
        <Button type="submit" label="삭제" v-if="item.isYour" class="w-24 " severity="danger" @click="counselDelete(item.no)" />
      </div>
    </div>
  </div>
  <Dialog
  v-model:visible="historyDialog"
  :modal="true"
  :closable="false"
  :dismissableMask="true"
  :style="{ width: '50vw' }">
  <template #header>
    <div class="w-full bg-indigo-500 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
      
      <span class="text-lg font-medium">
        {{beneName}}님 상담기록에 대한 수정이력
      </span>

      <button
        @click="historyDialog = false"
        class="text-white text-2xl font-light hover:opacity-70">
        ✕
      </button>

    </div>
  </template>

  <!-- 내용 -->
  <div v-if="historyData.length === 0" class="text-center py-10 text-gray-400">
    수정이력 없음
  </div>

  <div v-else class="px-4 py-6">
    <table class="w-full text-center border-collapse">
      <thead>
        <tr class="border-t-2 border-b-2 border-gray-400">
          <th class="py-3">수정날짜</th>
          <th class="py-3">작성자</th>
          <th class="py-3">권한</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in historyData"
          :key="item.id"
          class="border-b border-gray-400 h-12 hover:bg-gray-50">
          <td>{{ item.created_at }}</td>
          <td>{{ item.writer }}</td>
          <td>{{ item.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</Dialog>
</div>
</template>