<script setup>
import { ref, onBeforeMount } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
const notice = ref([]);

// 공지사항 전체조회
const findAllNotice = async () => {
    try {
        const res = await fetch('/api/notice');
        const data = await res.json();
        notice.value = Array.isArray(data) ? data : [data];
    } catch (err) {
        console.error(err);
    }
};

// 날짜포맷
const dateFormat = (dateVal) => {
    let newDate = new Date(dateVal);
    let year = newDate.getFullYear();
    let month = ('0' + (newDate.getMonth() + 1)).slice(-2);
    let day = ('0' + newDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};

// 검색
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// 공지사항 등록으로 이동
const goToWriteForm = () => {
    router.push({
        path: '/api/notice/add'
    });
};

onBeforeMount(() => {
    findAllNotice();
});
</script>
<template>
    <div class="w-full mt-4">
        <div class="flex justify-between items-center mb-3">
            <div class="text-surface-900 dark:text-surface-0 text-2xl font-medium">공지사항</div>
            <InputText v-model="filters.global.value" placeholder="검색" class="w-64" />
        </div>
        <DataTable
            :value="notice"
            :filters="filters"
            class="w-full"
            :pt="{
                headerRow: { class: 'text-center' },
                column: {
                    headerContent: { class: 'justify-center' },
                    bodyCell: { class: 'text-center' }
                }
            }"
        >
            <Column field="notice_no" header="번호" class="w-20"></Column>
            <Column field="notice_title" header="제목"></Column>
            <Column field="user_name" header="작성자" class="w-32"></Column>
            <Column header="작성일자" class="w-40">
                <template #body="slotProps">
                    {{ dateFormat(slotProps.data.created_at) }}
                </template>
            </Column>
        </DataTable>
        <div class="flex justify-end mt-4">
            <Button label="글등록" @click="goToWriteForm"></Button>
        </div>
    </div>
</template>
