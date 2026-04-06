<script setup>
import { onBeforeMount, reactive, ref, computed } from 'vue';

import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
const keyword = ref('');

const router = useRouter();

const userStore = useUserStore();
const user_no = userStore.user_no;

const users = ref(null);
console.log(user_no);

// onBeforeMount(async () => {
//     await fetch(`/api/lists/${user_no}`)
//         .then((resp) => resp.json())
//         .then((data) => {
//             users.value = data;
//         })
//         .catch((err) => console.log(err));
// });
const goToDetail_survey = (surveyNo) => {
    router.push(`/common/${surveyNo}/surveyCheck`);
};
const goToDetail_counsel = (surveyNo) => {
    router.push(`/common/${surveyNo}/counselCheck`);
};
const goToDetail_plan = (surveyNo) => {
    router.push(`/common/${surveyNo}/planCheck`);
};
const goToDetail_result = (surveyNo) => {
    router.push(`/common/${surveyNo}/resultCheck`);
};

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
</script>

<template>
    <div class="md:w-full">
        <div class="h-9/10">
            <div class="card">
                <div class="flex justify-between items-center mb-4">
                    <div class="font-semibold text-xl mb-4">지원신청내역</div>
                    <div class="flex gap-2">
                        <InputText v-model="keyword" placeholder="지원자 / 보호자 / 담당자 검색" class="w-72" @keydown="handleSearchEnter" />
                        <Button icon="pi pi-search" @click="searchUsers" />
                        <Button icon="pi pi-refresh" severity="secondary" outlined @click="resetSearch" />
                    </div>
                </div>
                <DataTable :value="users" :paginator="true" :rows="12" dataKey="id" :rowHover="true" showGridlines>
                    <!-- 못찾았을떄 -->
                    <template #empty> No customers found. </template>

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
                            <Button type="submit" label="보기" v-on:click="goToDetail_survey(data.survey_no)" />
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
                    <Column header="상담내역" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Button type="submit" label="보기" v-on:click="goToDetail_counsel(data.survey_no)" />
                        </template>
                    </Column>
                    <Column header="우선순위" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <span v-if="data.approval === 'a1'">{{ data.priority_name }}</span>
                                <span v-if="data.approval != 'a1'">미지정</span>
                            </div>
                        </template>
                    </Column>
                    <Column header="계획/결과 진행" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <span v-if="data.finish_cnt == 0">검토 {{ data.review_cnt }}건</span>
                                <span v-if="data.finish_cnt == 0">승인 {{ data.approve_cnt }}건</span>
                                <span v-if="data.finish_cnt == 0">반려 {{ data.reject_cnt }}건</span>
                                <span v-if="data.finish_cnt == 0">결과 {{ data.result_cnt }}건</span>
                                <span v-if="data.finish_cnt > 0">종결 {{ data.finish_cnt }}건</span>
                            </div>
                        </template>
                    </Column>
                    <Column header="지원계획" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <Button type="submit" label="보기" v-on:click="goToDetail_plan(data.survey_no)" />
                            </div>
                        </template>
                    </Column>
                    <Column header="지원결과" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <Button type="submit" label="보기" v-on:click="goToDetail_result(data.survey_no)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
