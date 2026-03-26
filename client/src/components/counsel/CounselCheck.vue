<script setup>
import { ref, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/user'
import { useBeneStore } from '@/stores/surBene'

const userStore = useUserStore()
const userbeneStore = useBeneStore();
const userNo = userStore.user_no;

const list = ref([]);

const counsel = async () => {
    await fetch(`/api/counsel/${2}`)
        .then((resp) => resp.json())
        .then((data) => {           
            list.value = Array.isArray(data) ? data : [data];

        })
        .catch(err => console.log(err))
}



onBeforeMount(() => {
  counsel();
  userbeneStore.fetchUsers(userNo);
})



</script>

<template>
  <div class="p-4 bg-[#ffffff] h-screen">

    <!-- 스크롤 영역 -->
    <div class="h-full overflow-y-auto pr-2">

      <!-- 반복 영역 -->
      <div
        v-for="(item, index) in list"
        :key="index"
        class="mb-6 border-b pb-4"
      >
        <!-- 제목 -->
        <div class="flex justify-between items-center mb-2">
          <div class="font-semibold">
            상담기록 {{ index + 1 }}
          </div>

          <div class="text-sm  text-gray-600">
            작성자 {{ item.name }} &nbsp;
            작성일 {{ item.created_at }}
          </div>
        </div>

        <!-- 제목 내용 -->
        <div class="border-t border-b py-2 mb-2">
          <span class="mr-2 font-medium">제목</span>
          <span>{{ item.title }}</span>
        </div>

        <!-- 내용 -->
        <div class="border-b py-2 mb-2">
          <span class="mr-2 font-medium">내용</span>
          <span>{{ item.content }}</span>
        </div>

        <!-- 첨부 -->
        <div class="border-b py-2 mb-2">
          <span class="mr-2 font-medium">첨부</span>
          <span v-for="(filename, i) in item.filename" :key="i">
              {{ filename }}
            </span>
        </div>

        <!-- 상담일 -->
        <div class="py-2">
          <span class="mr-2 font-medium">상담일자</span>
          <span>{{ item.counseldate }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

