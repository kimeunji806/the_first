<script setup>
import { ref, computed, shallowRef, onBeforeMount } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

import counselForm from '@/components/counsel/CounselForm.vue';
import priorityForm from '@/components/priority/PriorityForm.vue';
import planForm from '@/components/plan/PlanForm.vue';
import resultForm from '@/components/result/ResultForm.vue';
import AdminPlanApprovalForm from '@/components/plan/AdminPlanApprovalForm.vue'; // 관리자용 지원계획 승인/반려 폼
import AdminResultApprovalForm from '@/components/result/AdminResultApprovalForm.vue'; // 관리자용 지원결과 승인/반려 폼
const loginUser = JSON.parse(localStorage.getItem('user')); // 로그인 사용자 정보
const loginRole = loginUser?.role; // 로그인 사용자 역할
import priorityApprovalForm from '@/components/priority/PriorityApprovalForm.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user_role = userStore.role;
// 오른쪽에서 담당자 지정할 때 쓸 컴포넌트
import ManagerAssignForm from '@/components/common/ManagerAssignForm.vue';

// 오른쪽에서 담당자 지정 완료 후 사용할 셀렉 목록
const dropdownValues = [
    { name: '상담기록', code: 'A', component: counselForm },
    { name: '우선순위', code: 'B', component: user_role === 'e3' ? priorityApprovalForm : priorityForm },
    { name: '지원계획', code: 'C', component: loginRole === 'e3' ? AdminPlanApprovalForm : planForm },
    { name: '지원결과', code: 'D', component: loginRole === 'e3' ? AdminResultApprovalForm : resultForm }
];
// 셀렉트에서 선택한 값
const dropdownValue = shallowRef(null);
//확인버튼으로 불러오게 했음
const selectedForm = shallowRef(null);
const confirmForm = () => {
    selectedForm.value = dropdownValue.value;
};

import { useRoute } from 'vue-router';
const route = useRoute();
const selectNo = Number(route.params.no);

const user = ref([]);
const isLoading = ref(true);
console.log(selectNo);

onBeforeMount(async () => {
    try {
        const resp = await fetch(`/api/beneficiaries/${selectNo}`);
        const data = await resp.json();
        user.value = data;
        targetInfo.value.manager_no = data[0].manager_no;
        targetInfo.value.sub_manager_no = data[0].sub_manager_no;
        institutionNo.value = data[0].institution_no;

        console.log('Common user:', user.value);
        console.log('Common survey_no:', user.value[0]?.survey_no);
    } catch (err) {
        console.log(err);
    } finally {
        isLoading.value = false;
    }
});
// 임시 데이터
// 나중에는 선택된 대상자/조사지 상세 조회값으로 교체
const targetInfo = ref({
    manager_no: null,
    sub_manager_no: null
});
const institutionNo = ref(null);

// 담당자와 부담당자가 둘 다 있어야 "지정 완료"
const isAssigned = computed(() => {
    return !!targetInfo.value.manager_no;
});

const handleAssigned = (data) => {
    targetInfo.value.manager_no = data.manager_no;
    targetInfo.value.sub_manager_no = data.sub_manager_no;
};
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 mt-6 h-full">
        <!-- 왼쪽: 조회창 -->
        <div class="md:w-2/4">
            <div class="h-9/10">
                <div class="font-semibold text-xl mb-4">지원자 정보</div>

                <div class="bg-gray-50 dark:bg-surface-950 px-6 md:px-12 lg:px-20 py-5 text-center">
                    <div class="flex flex-col gap-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            <div class="w-full rounded-md p-4">지원자</div>
                            <div class="w-full rounded-md p-4">{{ user[0]?.beneficiaries_name }}</div>

                            <div class="w-full rounded-md p-4">보호자</div>
                            <div class="w-full rounded-md p-4">{{ user[0]?.guardian_name }}</div>

                            <div class="w-full rounded-md p-4">우선순위</div>
                            <div class="w-full rounded-md p-4">{{ user[0]?.priority_name }}</div>

                            <div class="w-full rounded-md p-4">성별</div>
                            <div class="w-full rounded-md p-4">{{ user[0]?.gender_name }}</div>

                            <div class="w-full rounded-md p-4">생년월일</div>
                            <div class="w-full rounded-md p-4">{{ user[0]?.birth }}</div>

                            <div class="w-full rounded-md p-4">장애유형</div>
                            <div class="w-full rounded-md p-4">{{ user[0]?.disability_type }}</div>

                            <div class="w-full rounded-md p-4">담당자</div>
                            <div class="w-full rounded-md p-4">{{ user[0]?.manager_name }}</div>

                            <div class="w-full rounded-md p-4">부담당자</div>
                            <div class="w-full rounded-md p-4">{{ user[0]?.sub_manager_name }}</div>
                        </div>
                    </div>
                </div>

                <br />

                <Tabs value="0">
                    <TabList>
                        <Tab value="0"><RouterLink :to="{ name: 'surveyCheck' }">지원신청서</RouterLink></Tab>
                        <Tab value="1"><RouterLink :to="{ name: 'counselCheck' }">상담기록</RouterLink></Tab>
                        <Tab value="2"><RouterLink :to="{ name: 'priorityCheck' }">우선순위</RouterLink></Tab>
                        <Tab value="3"><RouterLink :to="{ name: 'planCheck' }">지원계획</RouterLink> </Tab>
                        <Tab value="4"><RouterLink :to="{ name: 'resultCheck' }">지원결과</RouterLink> </Tab>
                    </TabList>
                </Tabs>

                <RouterView v-if="!isLoading && user[0]" />
            </div>
        </div>

        <!-- 오른쪽: 상태에 따라 변경 -->
        <div class="md:w-2/4">
            <div class="h-9/10">
                <!-- 담당자 미지정 -->
                <div v-if="!isAssigned">
                    <div class="font-semibold text-xl mb-4">담당자 지정</div>
                    <ManagerAssignForm v-if="!isAssigned" :survey-no="selectNo" :institution-no="institutionNo" @assigned="handleAssigned" />
                    <!-- 조사지 번호 땜에 좀 바꿨어요! -->
                </div>

                <!-- 담당자 지정 완료 -->
                <div v-else>
                    <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="폼 선택하기" />
                    <Button label="확인" @click="confirmForm" />
                    <component :is="selectedForm?.component" :survey-no="user[0]?.survey_no" />
                </div>
            </div>
        </div>
    </div>
</template>
