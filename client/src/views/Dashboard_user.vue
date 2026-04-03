<script setup>
import { onBeforeMount, reactive, ref, computed } from 'vue';

import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import SurveyHistoryModal from '@/components/dialog/survey_dialog.vue';

const keyword = ref('');
const router = useRouter();
const historyDialog = ref(false);
const userStore = useUserStore();
const user_no = userStore.user_no;
const selectedSurveyNo = ref(null);

const openHistoryModal = (surveyNo) => {
    selectedSurveyNo.value = surveyNo;
    historyDialog.value = true;
};

const planDialog = ref(false);
const resultDialog = ref(false);

const users = ref(null);
console.log(user_no);

// 지원계획 목록 저장용 변수
const planList = ref([]);
const resultList = ref([]);

const getLoginUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

//신청서 번호랑 대상자 번호 필요하면 담당자 번호도 넘겨서 해당 값들과 일치하는 계획 들고와서 모달안에 넣기
const planModalBtn = async (row) => {
    const surNo = row.survey_no;
    try {
        const loginUser = getLoginUser();
        const loginRole = loginUser?.role;

        const url = loginRole === 'e3' ? `/api/plan/admin/list/${surNo}` : `/api/plan/${surNo}`;

        const resp = await fetch(url);
        const text = await resp.text();
        const result = text ? JSON.parse(text) : [];

        planList.value = (Array.isArray(result) ? result : []).map((item) => ({
            ...item,
            files: item.filename ? item.filename.split(',') : []
        }));
    } catch (err) {
        console.error('지원계획 조회 에러:', err);
        planList.value = [];
    }
};

const filteredApprovalForm = computed(() => {
    return planList.value.filter((item) => item.approval === 'a1');
});

const loadResultList = async (row) => {
    const surNo = row.survey_no;
    try {
        const resp = await fetch(`/api/result/survey/${surNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : [];

        resultList.value = (Array.isArray(data) ? data : [])
            .filter((item) => item.finish === 1) //종결건만 조회
            .map((item) => ({
                ...item,
                files: item.filename ? item.filename.split(',').map((f) => f.trim()) : []
            }));
    } catch (err) {
        console.error('지원결과 조회 에러:', err);
        resultList.value = [];
    }
};

const filteredApprovalForm_re = computed(() => {
    return resultList.value.filter((item) => item.approval === 'a1');
});

const findAllUsers = async () => {
    try {
        const searchQuery = keyword.value.trim() ? `?keyword=${encodeURIComponent(keyword.value.trim())}` : '';
        const resp = await fetch(`/api/lists/${user_no}${searchQuery}`);

        const text = await resp.text();
        if (text) {
            users.value = JSON.parse(text);
        } else {
            users.value = [];
        }
    } catch (err) {
        console.error('조회 에러:', err);
        users.value = [];
    }
};

// 검색 실행 (버튼 클릭용)
const searchUsers = () => {
    findAllUsers();
};

// 엔터키 검색
const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
        findAllUsers();
    }
};

// 검색 초기화
const resetSearch = async () => {
    keyword.value = '';
    await findAllUsers();
};

// 검색어 하이라이트
const highlightText = (text) => {
    const trimmedKeyword = keyword.value.trim();
    if (!trimmedKeyword || !text) return text;
    const regex = new RegExp(`(${trimmedKeyword})`, 'gi');
    return String(text).replace(regex, '<mark class="search-match">$1</mark>');
};

onBeforeMount(() => {
    findAllUsers();
});

// onBeforeMount(async () => {
//     await fetch(`/api/lists/${user_no}`)
//         .then((resp) => resp.json())
//         .then((data) => {
//             users.value = data;
//         })
//         .catch((err) => console.log(err));
// });
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 mt-6 h-full">
        <div class="md:w-1/7">
            <div class="h-9/10">
                <div class="font-semibold text-xl mb-4">상세검색</div>
            </div>
        </div>
        <div class="md:w-6/7">
            <div class="h-9/10">
                <div class="card">
                    <div class="flex justify-between items-center mb-4">
                        <div class="font-semibold text-xl">지원신청내역</div>

                        <div class="flex gap-2">
                            <InputText v-model="keyword" placeholder="지원자 / 보호자 / 담당자 검색" class="w-72" @keydown="handleSearchEnter" />
                            <Button icon="pi pi-search" @click="searchUsers" />
                            <Button icon="pi pi-refresh" severity="secondary" outlined @click="resetSearch" />
                        </div>
                    </div>
                    <DataTable :value="users" :paginator="true" :rows="10" dataKey="id" :rowHover="true" showGridlines>
                        <!-- 못찾았을떄 -->
                        <template #empty> 검색 결과가 없습니다. </template>

                        <Column header="지원자명" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>{{ data.beneficiaries_name }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="보호자명" style="min-width: 8rem">
                            <template #body="{ data }">
                                {{ data.guardian_name }}
                            </template>
                        </Column>
                        <Column header="지원신청일" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>{{ data.created_at }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="지원신청서" style="min-width: 8rem">
                            <template #body="{ data }">
                                <Button type="submit" label="보기" v-on:click="openHistoryModal(data.survey_no)" />
                                <SurveyHistoryModal v-model:visible="historyDialog" :surveyNo="selectedSurveyNo" />
                            </template>
                        </Column>
                        <Column header="담당자" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>{{ data.manager_name }}</span>
                                    <span v-if="data.manager_name == null">미지정</span>
                                </div>
                            </template>
                        </Column>

                        <Column header="우선순위" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>{{ data.priority_name }}</span>
                                    <span v-if="data.priority_name == null">미지정</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="계획/결과 진행" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span v-if="data.finish_cnt == 0">진행중 {{ data.progress_cnt }}건</span>
                                    <span v-if="data.finish_cnt == 0">결과 {{ data.e1_result_cnt }}건</span>
                                    <span v-if="data.finish_cnt > 0">종결 {{ data.finish_cnt }}건</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="지원계획" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        label="보기"
                                        @click="
                                            planModalBtn(data);
                                            planDialog = true;
                                        "
                                    />
                                </div>
                            </template>
                        </Column>
                        <Column header="지원결과" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        label="보기"
                                        @click="
                                            loadResultList(data);
                                            resultDialog = true;
                                        "
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="planDialog" :modal="true" :closable="false" :dismissableMask="true" :style="{ width: '700px' }" :showHeader="false">
        <div class="rounded-xl overflow-hidden">
            <div class="bg-blue-500 text-white px-5 py-4 mt-7 flex justify-between items-center rounded-t-xl">
                <div class="text-lg font-semibold">지원계획</div>
                <button @click="planDialog = false" class="text-white text-xl hover:opacity-70 transition">✕</button>
            </div>

            <div class="max-h-[500px] overflow-y-auto p-4 bg-white">
                <div v-if="filteredApprovalForm.length === 0" class="text-center py-6 text-gray-400">데이터 없음</div>
                <div v-else class="flex flex-col gap-6">
                    <div v-for="(item, index) in filteredApprovalForm" :key="item.plan_no" class="border rounded-xl overflow-hidden bg-white shadow-sm">
                        <div class="flex justify-between items-center px-4 py-3 border-b">
                            <div class="font-semibold">계획 {{ String(index + 1).padStart(2, '0') }}</div>

                            <div
                                class="text-sm font-medium px-3 py-1 rounded-full"
                                :class="{
                                    'bg-green-100 text-green-700': item.approval_name === '승인',
                                    'bg-red-100 text-red-700': item.approval_name === '반려',
                                    'bg-gray-100 text-gray-600': !item.approval_name
                                }"
                            >
                                {{ item.approval_name || '미정' }}
                            </div>
                        </div>

                        <div class="divide-y">
                            <div class="grid grid-cols-4">
                                <div class="bg-gray-100 p-3 font-medium border-r">제목</div>
                                <div class="col-span-3 p-3">{{ item.title }}</div>
                            </div>

                            <div class="grid grid-cols-4">
                                <div class="bg-gray-100 p-3 font-medium border-r">내용</div>
                                <div class="col-span-3 p-3 whitespace-pre-line">
                                    {{ item.content }}
                                </div>
                            </div>

                            <div class="grid grid-cols-4" v-if="item.files.length">
                                <div class="bg-gray-100 p-3 font-medium border-r">첨부파일</div>

                                <div class="col-span-3 p-3">
                                    <div class="flex flex-col gap-1 w-full">
                                        <a v-for="file in item.files" :key="file" :href="`/api/download/${encodeURIComponent(file)}`" download class="block text-blue-600 hover:underline break-all w-full">
                                            {{ file }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
    <Dialog v-model:visible="resultDialog" :modal="true" :closable="false" :dismissableMask="true" :style="{ width: '700px' }" :showHeader="false">
        <div class="rounded-xl overflow-hidden">
            <!-- 🔵 헤더 -->
            <div class="bg-blue-500 text-white px-5 py-4 mt-7 flex justify-between items-center rounded-t-xl">
                <div class="text-lg font-semibold">지원결과</div>
                <button @click="resultDialog = false" class="text-white text-xl hover:opacity-70 transition">✕</button>
            </div>

            <!-- 📦 내용 -->
            <div class="max-h-[500px] overflow-y-auto p-4 bg-white">
                <div v-if="filteredApprovalForm_re.length === 0" class="text-center py-6 text-gray-400">데이터 없음</div>

                <div v-else class="flex flex-col gap-6">
                    <div v-for="(item, index) in filteredApprovalForm_re" :key="item.result_no" class="border rounded-xl overflow-hidden bg-white shadow-sm">
                        <!-- 상단 -->
                        <div class="flex justify-between items-center px-4 py-3 border-b">
                            <div class="font-semibold">결과 {{ String(index + 1).padStart(2, '0') }}</div>

                            <!-- 결과 상태 (있으면 사용) -->
                            <div class="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                                {{ item.status_name || '완료' }}
                            </div>
                        </div>

                        <!-- 내용 -->
                        <div class="divide-y">
                            <div class="grid grid-cols-4">
                                <div class="bg-gray-100 p-3 font-medium border-r">제목</div>
                                <div class="col-span-3 p-3">{{ item.title }}</div>
                            </div>

                            <div class="grid grid-cols-4">
                                <div class="bg-gray-100 p-3 font-medium border-r">내용</div>
                                <div class="col-span-3 p-3 whitespace-pre-line">
                                    {{ item.content }}
                                </div>
                            </div>

                            <!-- 파일 -->
                            <div class="grid grid-cols-4" v-if="item.files.length">
                                <div class="bg-gray-100 p-3 font-medium border-r">첨부파일</div>

                                <div class="col-span-3 p-3">
                                    <div class="flex flex-col gap-1 w-full">
                                        <a v-for="file in item.files" :key="file" :href="`/api/download/${encodeURIComponent(file)}`" download class="block text-blue-600 hover:underline break-all w-full"> 📎 {{ file }} </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>
<style scoped>
:deep(.search-match) {
    background-color: rgba(var(--primary-color-rgb), 0.15);
    color: var(--primary-color);
    font-weight: bold;
    padding: 2px 4px;
    border-radius: 4px;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    text-align: center;
}
</style>
