<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const notice = ref([]);
const keyword = ref('');

// 날짜포맷
const dateFormat = (dateVal) => {
    let newDate = new Date(dateVal);
    let year = newDate.getFullYear();
    let month = ('0' + (newDate.getMonth() + 1)).slice(-2);
    let day = ('0' + newDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};

// 공지사항 전체조회
const findAllNotice = async () => {
    try {
        const role = userStore.role;
        const insNo = userStore.institution;

        let url = '';

        // 검색어가 있으면 query string으로 붙여서 DB 검색
        const searchQuery = keyword.value.trim() ? `?keyword=${encodeURIComponent(keyword.value.trim())}` : '';

        // 시스템관리자 : 전체 공지 조회
        if (role === 'e4') {
            url = `/api/notice${searchQuery}`;
        } else {
            // 일반이용자/기관담당자/기관관리자 : 본인 기관 공지만 조회
            url = `/api/notice/${insNo}${searchQuery}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        notice.value = list.map((item) => ({
            ...item,
            create_at_formatted: dateFormat(item.created_at)
        }));
    } catch (err) {
        console.error(err);
    }
};

// 검색 실행
const searchNotice = () => {
    findAllNotice();
};

// 엔터 검색
const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
        findAllNotice();
    }
};

// 검색 초기화
const resetSearch = async () => {
    keyword.value = '';
    await findAllNotice();
};

// 내용 검색일 떄만 내용 표시
const shouldShowContent = (row) => {
    const trimmedKeyword = keyword.value.trim().toLowerCase();

    // 검색어 없으면 내용 숨김
    if (!trimmedKeyword) return false;

    const content = (row.notice_content || '').toLowerCase();

    // notice_content에 검색어가 실제 포함될 때만 true
    return content.includes(trimmedKeyword);
};

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

            <div class="flex gap-2">
                <InputText v-model="keyword" placeholder="제목 / 내용 / 작성자 / 작성일자 검색" class="w-72" @keydown="handleSearchEnter" />
                <Button icon="pi pi-search" @click="searchNotice" />
                <Button icon="pi pi-refresh" severity="secondary" outlined @click="resetSearch" />
            </div>
        </div>
        <DataTable
            :value="notice"
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
            <Column header="번호" class="w-20 text-center">
                <template #body="slotProps">
                    <div class="text-center">
                        {{ slotProps.index + 1 }}
                    </div>
                </template>
            </Column>
            <Column header="제목" class="text-center">
                <template #body="slotProps">
                    <div class="text-left">
                        <div>
                            <span class="cursor-pointer inline-block" @click="router.push(`/notice/info/${slotProps.data.notice_no}`)">
                                {{ slotProps.data.notice_title }}
                            </span>
                        </div>
                        <div v-if="shouldShowContent(slotProps.data)" class="text-sm text-gray-500 mt-1 truncate">
                            {{ slotProps.data.notice_content }}
                        </div>
                    </div>
                </template>
            </Column>
            <Column v-if="userStore.role === 'e4'" field="name" header="기관" class="w-57 text-center"></Column>
            <Column field="user_name" header="작성자" class="w-32 text-center"></Column>
            <Column header="작성일자" class="w-40 text-center">
                <template #body="slotProps">
                    <div class="text-center">
                        {{ dateFormat(slotProps.data.created_at) }}
                    </div>
                </template>
            </Column>
        </DataTable>
        <div class="flex justify-end mt-4">
            <Button v-if="canManageNotice" label="글등록" @click="goToWriteForm" />
        </div>
    </div>
</template>
