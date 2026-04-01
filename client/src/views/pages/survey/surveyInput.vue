<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user_no = userStore.user_no;

const dropdownValues = ref([]);
const question = ref([]);

const dropdownValue = ref(null);
const beneficiarieNo = ref(null);
const currentSurveyNo = ref(null);

const info = ref([
    {
        disability_type: '',
        gender: '',
        birth: ''
    }
]);

const handleChange = async (e) => {
    beneficiarieNo.value = e.value.beneficiaries_no;

    await fetch(`/api/beneficiariesInfo/${beneficiarieNo.value}`)
        .then((resp) => resp.json())
        .then((data) => {
            info.value = data;
        })
        .catch((err) => console.log(err));

    console.log('현재 값:', beneficiarieNo.value);
};

const questionList = async () => {
    try {
        const resp = await fetch(`/api/surveyQuestion`);
        const data = await resp.json();
        question.value = data;
        console.log(question.value);
    } catch {
        (err) => console.log(err);
    }
};

const surveyForm = async () => {
    console.log(beneficiarieNo.value);
    let data = {
        beneficiaries_no: beneficiarieNo.value
    };
    console.log(data);
    const res = await fetch(`/api/createSurvey`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch((err) => console.log(err));
    const result = await res.json();
    const survey_no = result.result.insertId;
    console.log('생성된 survey_no:', result.result.insertId);
    currentSurveyNo.value = survey_no;
    console.log('넣은 survey_no:', currentSurveyNo.value);

    questionList();
};

const addUSurveyInput = async () => {
    const data = question.value.flatMap((main) =>
        (main.subs ?? []).flatMap((sub) =>
            (sub.questions ?? [])
                .filter((q) => q.answer !== null)
                .map((q) => ({
                    survey_no: currentSurveyNo.value,
                    question_no: q.question_no,
                    choice_value: q.answer
                }))
        )
    );

    console.log('전송 data:', data);

    let result = await fetch(`/api/createSurveyInput`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        // .then((res) => res.json())
        .catch((err) => console.log(err));
    // if (result.status == 'success') {
    //     router.resolve('/sign/login');
    // } else {
    //     console.log('등록되지않았습니다.');
    //     inPrinted.value = true;
    // }
};

console.log(user_no);
console.log(dropdownValues);
onBeforeMount(() => {
    fetch(`/api/beneficiariesList/${user_no}`)
        .then((resp) => resp.json())
        .then((data) => {
            dropdownValues.value = data;
        })
        .catch((err) => console.log(err));
});
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 mt-6 h-full">
        <div class="md:w-1/5">
            <div class="h-9/10">
                <div class="font-semibold text-xl mb-4">지원자 정보 입력</div>
                <div>
                    <label for="user_name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">이름</label>
                    <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="beneficiaries_name" placeholder="지원자 선택하기" @change="handleChange" />
                </div>
                <div>
                    <label for="disability_type" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">장애유형</label>
                    <InputText id="disability_type" class="w-full mb-8" v-model="info[0].disability_type" disabled />
                </div>

                <div>
                    <div class="md:w-1/2">
                        <label for="gender" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">성별</label>
                        <InputText id="gender" class="w-full mb-8" v-model="info[0].gender" disabled />
                    </div>
                    <div class="md:w-1/2">
                        <label for="birth" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">생년월일</label>
                        <InputText id="birth" class="w-full mb-8" v-model="info[0].birth" disabled />
                    </div>
                </div>
                <Button label="지원신청하기" class="w-full md:w-[8.5rem] mb-8" v-on:click="surveyForm()"></Button>
            </div>
        </div>
        <div class="md:w-4/5">
            <div class="h-9/10">
                <div class="font-semibold text-xl mb-4">지원신청하기</div>
                <div class="card h-full flex flex-col gap-4 overflow-y-auto">
                    <div v-for="mainItem in question" :key="mainItem.main_no">
                        <div v-for="subItem in mainItem.subs" :key="subItem.sub_no">
                            <span class="text-xl font-bold text-surface-900 dark:text-surface-0">
                                {{ mainItem.main_title }}
                            </span>

                            <span class="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                                {{ subItem.sub_title }}
                            </span>

                            <DataTable :value="subItem.questions" dataKey="question_no" :rowHover="true" showGridlines>
                                <template #empty>데이터를 못 찾았습니다. </template>

                                <Column header="질문" style="min-width: 40rem">
                                    <template #body="{ data }">
                                        <div>
                                            <span>{{ data.question_text }}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column header="예" style="min-width: 1rem">
                                    <template #body="{ data }">
                                        <div class="flex items-center">
                                            <RadioButton :name="`option_${data.question_no}`" value="b1" v-model="data.answer" />
                                        </div>
                                    </template>
                                </Column>
                                <Column header="아니요" style="min-width: 1rem">
                                    <template #body="{ data }">
                                        <div class="flex items-center">
                                            <RadioButton :name="`option_${data.question_no}`" value="b2" v-model="data.answer" />
                                        </div>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                    <div class="mt-auto flex justify-end gap-2">
                        <Button type="button" label="저장" class="w-24" @click="addUSurveyInput" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
