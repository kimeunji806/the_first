<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { FilterMatchMode } from '@primevue/core/api';

const router = useRouter();
const userStore = useUserStore();

const notice = ref([]);

// 공지사항 전체조회
const findAllNotice = async () => {
    try {
        const insNo = userStore.institution;

        const res = await fetch(`/api/notice/${insNo}`);
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

// 공지사항 등록 권한 체크
const canManageNotice = computed(() => {
    return ['e2', 'e3', 'e4'].includes(userStore.role);
});

// 공지사항 등록으로 이동
const goToWriteForm = () => {
    router.push({
        path: '/notice/add'
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

            <div class="relative">
                <InputText v-model="filters.global.value" placeholder="검색" class="pr-10 w-64" />
                <i class="pi pi-search text-xl text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"></i>
            </div>
        </div>
        <DataTable
            :value="notice"
            :filters="filters"
            :globalFilterFields="['notice_title']"
            class="w-full"
            :pt="{
                headerRow: { class: 'text-center' },
                column: {
                    headerContent: { class: 'justify-center' },
                    bodyCell: { class: 'text-center' }
                }
            }"
            paginator
            :rows="10"
            :totalRecords="notice.length"
        >
            <Column header="번호" class="w-20">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column header="제목">
                <template #body="slotProps">
                    <span class="cursor-pointer" @click="router.push(`/notice/info/${slotProps.data.notice_no}`)">
                        {{ slotProps.data.notice_title }}
                    </span>
                </template>
            </Column>
            <Column v-if="userStore.role === 'e4'" field="name" header="기관" class="w-32"></Column>
            <Column field="user_name" header="작성자" class="w-32"></Column>
            <Column header="작성일자" class="w-40">
                <template #body="slotProps">
                    {{ dateFormat(slotProps.data.created_at) }}
                </template>
            </Column>
        </DataTable>
        <div class="flex justify-end mt-4">
            <Button v-if="canManageNotice" label="글등록" @click="goToWriteForm" />
        </div>
    </div>
</template>
