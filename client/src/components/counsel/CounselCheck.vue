<script setup>
import { ref,computed, onBeforeMount ,watch} from 'vue';
import { useBeneStore } from '@/stores/surBene'
import { useRoute } from 'vue-router';

const userbeneStore = useBeneStore();
const route = useRoute();

const selectNo = Number(route.params.no);
const list = ref([]);
const surNo = computed(() => {
  return userbeneStore.survey_no
});

const counsel = async () => {
    await fetch(`/api/counsel/${surNo.value}`)
        .then((resp) => resp.json())
        .then((data) => {           
            list.value = (Array.isArray(data) ? data : [data]).map(item => ({
            ...item,
              isEditing: false
            }))
        })
        .catch(err => console.log(err))
}


const handleClick = (item) => {
  if (item.isEditing) {
    counselUpdate(item)
  }

  item.isEditing = !item.isEditing
}

const counselUpdate = async (item) => {
  await fetch(`/api/counselUpdate`, {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      no:item.no,
      title:item.title,
      content:item.content
    })
  })
  await counsel();
}

const counselDelete = async (item) => {
  if (confirm("정말 삭제하시겠습니까?") == true) {
    await fetch(`/api/counselDelete/${item.no}`, {
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
          <span class="mr-2 font-medium">첨부</span>
          <span v-for="(filename, i) in item.filename" :key="i">
              {{ filename }}
            </span>
        </div>

        <div class="py-2">
          <span class="mr-2 font-medium">상담일자</span>
          <span>{{ item.counseldate }}</span>
        </div>
      </div>
      <div class="mt-auto flex justify-end gap-2">
        <Button type="button" class="w-24" :label="item.isEditing ? '저장' : '수정'" @click="handleClick(item)"/>
        <Button type="submit" label="삭제" class="w-24" @click="counselDelete(item)" />
      </div>
    </div>
  </div>
</div>
</template>
