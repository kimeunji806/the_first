<script setup>
import { ref, computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

import counselForm from '@/components/counsel/CounselForm.vue';
import priorityForm from '@/components/priority/PriorityForm.vue';
import planForm from '@/components/plan/PlanForm.vue';
import resultForm from '@/components/result/ResultForm.vue';

// 오른쪽에서 담당자 지정할 때 쓸 컴포넌트
import ManagerAssignForm from '@/components/common/ManagerAssignForm.vue';

// 오른쪽에서 담당자 지정 완료 후 사용할 셀렉 목록
const dropdownValues = ref([
    { name: '상담기록', code: 'A', component: counselForm },
    { name: '우선순위', code: 'B', component: priorityForm },
    { name: '지원계획', code: 'C', component: planForm },
    { name: '지원결과', code: 'D', component: resultForm }
]);

const dropdownValue = ref(null);

// 임시 데이터
// 나중에는 선택된 대상자/조사지 상세 조회값으로 교체
const targetInfo = ref({
    beneficiaries_name: '홍길동',
    guardian_name: '홍동길',
    priority_name: '긴급',
    gender_name: '남',
    birth: '2001.01.01',
    disability_type: '발달장애',
    manager_no: null,
    sub_manager_no: null,
    survey_no: 1001,
    beneficiaries_no: 5
});

// 담당자와 부담당자가 둘 다 있어야 "지정 완료"
const isAssigned = computed(() => {
    return !!targetInfo.value.manager_no && !!targetInfo.value.sub_manager_no;
});
const handleAssigned = (data) => {
    targetInfo.value.manager_no = data.manager_no;
    targetInfo.value.sub_manager_no = data.sub_manager_no;
};
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 mt-6 h-screen">
        <!-- 왼쪽: 조회창 -->
        <div class="md:w-2/4">
            <div class="h-9/10">
                <div class="font-semibold text-xl mb-4">지원자 정보</div>

                <div class="bg-gray-50 dark:bg-surface-950 px-6 md:px-12 lg:px-20 py-5 text-center">
                    <div class="flex flex-col gap-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            <div class="w-full rounded-md p-4">지원자</div>
                            <div class="w-full rounded-md p-4">{{ targetInfo.beneficiaries_name }}</div>

                            <div class="w-full rounded-md p-4">보호자</div>
                            <div class="w-full rounded-md p-4">{{ targetInfo.guardian_name }}</div>

                            <div class="w-full rounded-md p-4">우선순위</div>
                            <div class="w-full rounded-md p-4">{{ targetInfo.priority_name }}</div>

                            <div class="w-full rounded-md p-4">성별</div>
                            <div class="w-full rounded-md p-4">{{ targetInfo.gender_name }}</div>

                            <div class="w-full rounded-md p-4">생년월일</div>
                            <div class="w-full rounded-md p-4">{{ targetInfo.birth }}</div>

                            <div class="w-full rounded-md p-4">장애유형</div>
                            <div class="w-full rounded-md p-4">{{ targetInfo.disability_type }}</div>
                        </div>
                    </div>
                </div>

                <br />

                <Tabs value="0">
                    <TabList>
                        <Tab value="0"><RouterLink :to="{ name: 'surveyCheck' }">지원신청서</RouterLink> </Tab>
                        <Tab value="1"><RouterLink :to="{ name: 'counselCheck' }">상담기록</RouterLink></Tab>
                        <Tab value="2"><RouterLink :to="{ name: 'priorityCheck' }">우선순위</RouterLink></Tab>
                        <Tab value="3"><RouterLink :to="{ name: 'planCheck' }">지원계획</RouterLink> </Tab>
                        <Tab value="4"><RouterLink :to="{ name: 'resultCheck' }">지원결과</RouterLink> </Tab>
                    </TabList>
                </Tabs>

                <RouterView />
            </div>
        </div>

        <!-- 오른쪽: 상태에 따라 변경 -->
        <div class="md:w-2/4">
            <div class="h-9/10">
                <!-- 담당자 미지정 -->
                <div v-if="!isAssigned">
                    <div class="font-semibold text-xl mb-4">담당자 지정</div>
                    <ManagerAssignForm v-if="!isAssigned" :survey-no="targetInfo.survey_no" :institution-no="1" @assigned="handleAssigned" />
                </div>

                <!-- 담당자 지정 완료 -->
                <div v-else>
                    <div class="font-semibold text-xl mb-4">업무 폼 선택</div>

                    <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="폼 선택하기" class="w-full mb-4" />

                    <component :is="dropdownValue?.component" v-if="dropdownValue?.component" />
                </div>
            </div>
        </div>
    </div>
</template>
