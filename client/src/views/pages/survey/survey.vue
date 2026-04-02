<script setup>
import { ref, onBeforeMount, computed, reactive } from 'vue';
const main = ref([]);
const sub = ref([]);
const question = ref([]);
const sub_no = ref([]);
const main_no = ref([]);
const historyDialog = ref(false);
import SurveyHistoryModal from '@/components/dialog/surveyPreviewdialog.vue';
const selectedMainNo = ref(null);
const selectedSubNo = ref(null);

const clickMain = (item) => {
    selectedMainNo.value = item.main_no;
    selectedSubNo.value = null;
};

const clickSub = (item) => {
    selectedSubNo.value = item.sub_no;
};
const openHistoryModal = () => {
    historyDialog.value = true;
};
// 메인항목 조회
const mainList = async () => {
    await fetch(`/api/main`)
        .then((resp) => resp.json())
        .then((data) => {
            main.value = data.map((item) => ({
                ...item,
                isEditing: false,
                isNew: false,
                isDirty: false,
                isDeleted: false
            }));
        })
        .catch((err) => console.log(err));
};

// 세부항목 조회
const subList = async (mainNo) => {
    selectedMainNo.value = mainNo;
    selectedSubNo.value = null;
    console.log(mainNo);
    main_no.value = mainNo;
    await fetch(`/api/sub/${mainNo}`)
        .then((resp) => resp.json())
        .then((data) => {
            sub.value = data.map((item) => ({
                ...item,
                isEditing: false,
                isNew: false,
                isDirty: false,
                isDeleted: false
            }));
        })
        .catch((err) => console.log(err));
};

// 질문항목 조회
const questionList = async (subNo) => {
    selectedSubNo.value = subNo;
    console.log(subNo);
    sub_no.value = subNo;
    await fetch(`/api/question/${subNo}`)
        .then((resp) => resp.json())
        .then((data) => {
            question.value = (Array.isArray(data) ? data : [data]).map((item) => ({
                ...item,
                isEditing: false,
                isNew: false,
                isDirty: false,
                isDeleted: false
            }));
        })
        .catch((err) => console.log(err));
};

const content = reactive({
    main_title: '',
    sub_title: '',
    question_text: ''
});
// 메인항목 추가
const mainCreate = async () => {
    if (!content.main_title.trim()) return;

    main.value.push({
        main_no: null,
        main_title: content.main_title,
        isNew: true,
        isDirty: false,
        isDeleted: false,
        isEditing: false
    });

    content.main_title = '';
    main_isVisible.value = false;
};

// 서브항목 추가
const subCreate = async () => {
    if (!content.sub_title.trim()) return;

    sub.value.push({
        sub_no: null,
        main_no: main_no.value,
        sub_title: content.sub_title,
        isNew: true,
        isDirty: false,
        isDeleted: false,
        isEditing: false
    });

    content.sub_title = '';
    sub_isVisible.value = false;
};

// 질문항목 추가
const questionCreate = async () => {
    if (!content.question_text.trim()) return;

    question.value.push({
        question_no: null,
        sub_no: sub_no.value,
        question_text: content.question_text,
        isNew: true,
        isDirty: false,
        isDeleted: false,
        isEditing: false
    });

    content.question_text = '';
    question_isVisible.value = false;
};

// 메인 항목 삭제
const mainDelete = async (deleteId) => {
    const index = main.value.findIndex((v) => v.main_no === deleteId);

    if (index === -1) return;

    const item = main.value[index];

    if (item.isNew) {
        main.value.splice(index, 1);
    } else {
        item.isDeleted = true;
    }
};

// 서브 항목 삭제
const subDelete = async (deleteId) => {
    const index = sub.value.findIndex((v) => v.sub_no === deleteId);

    if (index === -1) return;

    const item = sub.value[index];

    if (item.isNew) {
        sub.value.splice(index, 1);
    } else {
        item.isDeleted = true;
    }
};

// 질문 삭제
const questionDelete = async (deleteId) => {
    const index = question.value.findIndex((v) => v.question_no === deleteId);

    if (index === -1) return;

    const item = question.value[index];

    if (item.isNew) {
        question.value.splice(index, 1);
    } else {
        item.isDeleted = true;
    }
};

const visibleMain = computed(() => main.value.filter((v) => !v.isDeleted));

const visibleSub = computed(() => sub.value.filter((v) => !v.isDeleted));

const visibleQuestion = computed(() => question.value.filter((v) => !v.isDeleted));

onBeforeMount(() => {
    mainList();
});

const main_isVisible = ref(false);
const sub_isVisible = ref(false);
const question_isVisible = ref(false);
const main_update_isVisible = ref(false);
const sub_update_isVisible = ref(false);

// const isEditing = ref(null);
const toggleEditM = (item) => {
    item.isEditing = !item.isEditing;

    if (!item.isEditing && !item.isNew) {
        item.isDirty = true;
    }
};
const toggleEdit = (item) => {
    item.isEditing = !item.isEditing;

    if (!item.isEditing && !item.isNew) {
        item.isDirty = true;
    }
};
const toggleEditQ = (item) => {
    item.isEditing = !item.isEditing;

    if (!item.isEditing && !item.isNew) {
        item.isDirty = true;
    }
};
const mainshowButton = computed(() => {
    return !main_update_isVisible.value && !main_isVisible.value;
});

const subshowButton = computed(() => {
    return !sub_update_isVisible.value && !sub_isVisible.value;
});

const saveAll = async () => {
    const payload = {
        mainCreated: main.value.filter((v) => v.isNew && !v.isDeleted),
        mainUpdated: main.value.filter((v) => !v.isNew && v.isDirty && !v.isDeleted),
        mainDeleted: main.value.filter((v) => !v.isNew && v.isDeleted).map((v) => v.main_no),

        subCreated: sub.value.filter((v) => v.isNew && !v.isDeleted),
        subUpdated: sub.value.filter((v) => !v.isNew && v.isDirty && !v.isDeleted),
        subDeleted: sub.value.filter((v) => !v.isNew && v.isDeleted).map((v) => v.sub_no),

        questionCreated: question.value.filter((v) => v.isNew && !v.isDeleted),
        questionUpdated: question.value.filter((v) => !v.isNew && v.isDirty && !v.isDeleted),
        questionDeleted: question.value.filter((v) => !v.isNew && v.isDeleted).map((v) => v.question_no)
    };

    await fetch('/api/save_all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    alert('저장 완료');

    await mainList();
    if (main_no.value) await subList(main_no.value);
    if (sub_no.value) await questionList(sub_no.value);
};
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 h-full">
        <div class="md:w-2/8 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">지원서 항목</div>
                <div class="overflow-y-auto">
                    <ul v-for="value in visibleMain">
                        <li class="font-semibold text-xl mb-4" :class="selectedMainNo === value.main_no ? 'bg-gray-50 text-gray-700 border border-gray-200 rounded-md' : 'hover:bg-gray-100'" v-on:click="subList(value.main_no)">
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center gap-2">
                                    <!-- 수정 상태일 때 -->
                                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-if="value.isEditing" v-model="value.main_title" @input="value.isDirty = !value.isNew" />
                                    <!-- 보기 상태일 때 -->
                                    <span v-else>{{ value.main_title }}</span>
                                </div>

                                <div v-if="main_update_isVisible">
                                    <Button type="submit" label="수정" @click="toggleEditM(value)">{{ value.isEditing ? '저장' : '수정' }}</Button>
                                    <Button type="submit" label="삭제" @click="mainDelete(value.main_no)"></Button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="main_isVisible">
                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-model="content.main_title"></InputText>
                    <Button type="submit" label="저장" @click="main_isVisible = !main_isVisible" v-on:click="mainCreate()" />
                </div>
                <div class="mt-auto grid grid-cols-2 gap-2 w-full">
                    <div v-if="!main_isVisible"><Button type="submit" label="항목추가" class="w-full" @click="main_isVisible = !main_isVisible"></Button></div>
                    <div v-if="mainshowButton"><Button type="submit" label="항목수정" @click="main_update_isVisible = !main_update_isVisible" class="w-full"></Button></div>
                    <div v-if="main_update_isVisible"><Button type="submit" label="확인" @click="main_update_isVisible = !main_update_isVisible" class="w-full"></Button></div>
                </div>
            </div>
        </div>
        <div class="md:w-2/8 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">세부 항목</div>
                <ul class="overflow-y-auto" v-for="value in visibleSub">
                    <li class="font-semibold text-l mb-4" :class="selectedSubNo === value.sub_no ? 'bg-gray-50 text-gray-700 border border-gray-200 rounded-md' : 'hover:bg-gray-100'" v-on:click="questionList(value.sub_no)">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center gap-2">
                                <!-- 수정 상태일 때 -->
                                <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-if="value.isEditing" v-model="value.sub_title" @input="value.isDirty = !value.isNew" />
                                <!-- 보기 상태일 때 -->
                                <span v-else>{{ value.sub_title }}</span>
                            </div>

                            <div v-if="sub_update_isVisible">
                                <Button type="submit" label="수정" @click="toggleEdit(value)">{{ value.isEditing ? '저장' : '수정' }}</Button>
                                <Button type="submit" label="삭제" @click="subDelete(value.sub_no)"></Button>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-if="sub_isVisible">
                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" v-model="content.sub_title" />

                    <Button type="submit" label="저장" @click="sub_isVisible = !sub_isVisible" v-on:click="subCreate()" />
                </div>
                <div class="mt-auto grid grid-cols-2 gap-2 w-full">
                    <div v-if="!sub_isVisible"><Button type="submit" label="항목추가" @click="sub_isVisible = !sub_isVisible" class="w-full"></Button></div>
                    <div v-if="subshowButton"><Button type="submit" label="항목수정" @click="sub_update_isVisible = !sub_update_isVisible" class="w-full"></Button></div>
                    <div v-if="sub_update_isVisible"><Button type="submit" label="확인" @click="sub_update_isVisible = !sub_update_isVisible" class="w-full"></Button></div>
                </div>
            </div>
        </div>
        <div class="md:w-4/8 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">질문 항목</div>
                <div class="font-semibold text-xl mb-4">지원신청내역</div>
                <!-- <DataTable :value="question" :paginator="true" :rows="5" dataKey="id" :rowHover="true" showGridlines> -->
                <DataTable :value="visibleQuestion" scrollable scrollHeight="500px" dataKey="id" :rowHover="true" showGridlines>
                    <!-- 못찾았을떄 -->
                    <template #empty> No customers found. </template>

                    <Column header="질문" style="min-width: 40rem">
                        <template #body="{ data }">
                            <div>
                                <!-- 수정 상태일 때 -->
                                <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-if="data.isEditing" v-model="data.question_text" @input="data.isDirty = !data.isNew" />
                                <!-- 보기 상태일 때 -->
                                <span v-else>{{ data.question_text }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column header="수정" style="min-width: 1rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <span
                                    ><Button type="submit" label="수정" @click="toggleEditQ(data)">{{ data.isEditing ? '저장' : '수정' }}</Button></span
                                >
                            </div>
                        </template>
                    </Column>
                    <Column header="삭제" style="min-width: 1rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <!-- <Checkbox id="checkOption1" name="option" value="Chicago" v-model="checkboxValue" /> -->
                                <span><Button type="submit" label="삭제" @click="questionDelete(data.question_no)"></Button></span>
                            </div>
                        </template>
                    </Column>
                </DataTable>
                <div v-if="question_isVisible">
                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[56rem]" v-model="content.question_text" />

                    <Button type="submit" label="저장" @click="question_isVisible = !question_isVisible" v-on:click="questionCreate()" />
                </div>
                <div class="flex justify-end">
                    <div class="mt-auto" v-if="!question_isVisible"><Button type="submit" label="항목추가" class="w-full" @click="question_isVisible = !question_isVisible"></Button></div>
                </div>

                <div class="mt-auto flex justify-end gap-2">
                    <Button type="submit" label="수정이력" class="w-24" v-on:click="" />
                    <Button type="submit" label="전체저장" class="w-24" v-on:click="saveAll" />
                    <Button type="submit" label="전체보기" class="w-24" v-on:click="openHistoryModal()" />
                    <SurveyHistoryModal v-model:visible="historyDialog" :surveyNo="selectedSurveyNo" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
