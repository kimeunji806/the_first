<script setup>
import { ref, onBeforeMount, computed, reactive } from 'vue';
const main = ref([]);
const sub = ref([]);
const question = ref([]);
const sub_no = ref([]);
const main_no = ref([]);

// 메인항목 조회
const mainList = async () => {
    await fetch(`/api/main`)
        .then((resp) => resp.json())
        .then((data) => {
            main.value = data.map((item) => ({
                ...item,
                isEditing: false
            }));
        })
        .catch((err) => console.log(err));
};

// 세부항목 조회
const subList = async (mainNo) => {
    console.log(mainNo);
    main_no.value = mainNo;
    await fetch(`/api/sub/${mainNo}`)
        .then((resp) => resp.json())
        .then((data) => {
            sub.value = data.map((item) => ({
                ...item,
                isEditing: false
            }));
        })
        .catch((err) => console.log(err));
};

// 질문항목 조회
const questionList = async (subNo) => {
    console.log(subNo);
    sub_no.value = subNo;
    await fetch(`/api/question/${subNo}`)
        .then((resp) => resp.json())
        .then((data) => {
            question.value = (Array.isArray(data) ? data : [data]).map((item) => ({
                ...item,
                isEditing: false
            }));
        })
        .catch((err) => console.log(err));
};

const content = reactive({
    main_title: '',
    sub_title: '',
    question_text: '',
    main_no: main_no,
    sub_no: sub_no
});
// 메인항목 추가
const mainCreate = async () => {
    let data = {
        main_title: content.main_title
    };
    console.log(data);

    let result = await fetch('./api/main', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        // .then((resp) => resp.json())
        // .then((data) => {
        //     console.log(data);
        //     if (data.retCode == 'OK') {
        //         alert('등록 성공');
        //         location.herf = 'board_list.html';
        //     } else {
        //         alert(`에러 : ${data.retMsg}`);
        //     }
        // })
        .catch((err) => console.log(err));
    mainList();
};

// 서브항목 추가
const subCreate = async () => {
    let data = {
        main_no: content.main_no,
        sub_title: content.sub_title
    };
    console.log(data);

    let result = await fetch('./api/sub', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        // .then((resp) => resp.json())
        // .then((data) => {
        //     console.log(data);
        //     if (data.retCode == 'OK') {
        //         alert('등록 성공');
        //         location.herf = 'board_list.html';
        //     } else {
        //         alert(`에러 : ${data.retMsg}`);
        //     }
        // })
        .catch((err) => console.log(err));
    subList(content.main_no);
};

// 질문항목 추가
const questionCreate = async () => {
    let data = {
        sub_no: content.sub_no,
        question_text: content.question_text
    };
    console.log(data);

    let result = await fetch('./api/question', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        // .then((resp) => resp.json())
        // .then((data) => {
        //     console.log(data);
        //     if (data.retCode == 'OK') {
        //         alert('등록 성공');
        //         location.herf = 'board_list.html';
        //     } else {
        //         alert(`에러 : ${data.retMsg}`);
        //     }
        // })
        .catch((err) => console.log(err));
    questionList(content.sub_no);
};

// 메인 항목 삭제
const mainDelete = async (deleteId) => {
    console.log(deleteId);
    let result = fetch('./api/main/' + deleteId, {
        method: 'delete'
    })
        //   .then((resp) => resp.json())
        //   .then((data) => {
        //     console.log(data);
        //     if (data.retCode == "OK") {
        //       alert("삭제 성공");
        //       location.herf = "board_list.html";
        //     } else {
        //       alert(`에러 : ${data.retMsg}`);
        //     }
        //   })
        .catch((err) => console.log(err));
    mainList();
};

// 서브 항목 삭제
const subDelete = async (deleteId) => {
    console.log(deleteId);
    let result = fetch('./api/sub/' + deleteId, {
        method: 'delete'
    })
        //   .then((resp) => resp.json())
        //   .then((data) => {
        //     console.log(data);
        //     if (data.retCode == "OK") {
        //       alert("삭제 성공");
        //       location.herf = "board_list.html";
        //     } else {
        //       alert(`에러 : ${data.retMsg}`);
        //     }
        //   })
        .catch((err) => console.log(err));
    subList(content.main_no);
};

// 질문 삭제
const questionDelete = async (deleteId) => {
    console.log(deleteId);
    let result = fetch('./api/question/' + deleteId, {
        method: 'delete'
    })
        //   .then((resp) => resp.json())
        //   .then((data) => {
        //     console.log(data);
        //     if (data.retCode == "OK") {
        //       alert("삭제 성공");
        //       location.herf = "board_list.html";
        //     } else {
        //       alert(`에러 : ${data.retMsg}`);
        //     }
        //   })
        .catch((err) => console.log(err));
    questionList(content.sub_no);
};

// 서브항목 수정
const subUpdate = async (updateSub) => {
    const updateId = updateSub.sub_no;
    let data = {
        sub_title: updateSub.sub_title
    };
    console.log(updateSub);

    let result = await fetch('./api/sub/' + updateId, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        // .then((resp) => resp.json())
        // .then((data) => {
        //     console.log(data);
        //     if (data.retCode == 'OK') {
        //         alert('등록 성공');
        //         location.herf = 'board_list.html';
        //     } else {
        //         alert(`에러 : ${data.retMsg}`);
        //     }
        // })
        .catch((err) => console.log(err));
    subList(content.main_no);
};

// 메인항목 수정
const mainUpdate = async (updateMain) => {
    const updateId = updateMain.main_no;
    let data = {
        main_title: updateMain.main_title
    };
    console.log(updateSub);

    let result = await fetch('./api/sub/' + updateId, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        // .then((resp) => resp.json())
        // .then((data) => {
        //     console.log(data);
        //     if (data.retCode == 'OK') {
        //         alert('등록 성공');
        //         location.herf = 'board_list.html';
        //     } else {
        //         alert(`에러 : ${data.retMsg}`);
        //     }
        // })
        .catch((err) => console.log(err));
    subList(content.main_no);
};

// 질문항목 수정
const questionUpdate = async (updateQuestion) => {
    const updateId = updateQuestion.question_no;
    let data = {
        question_text: updateQuestion.question_text
    };
    console.log(data);
    console.log(updateId);
    let result = await fetch('./api/question/' + updateId, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        // .then((resp) => resp.json())
        // .then((data) => {
        //     console.log(data);
        //     if (data.retCode == 'OK') {
        //         alert('등록 성공');
        //         location.herf = 'board_list.html';
        //     } else {
        //         alert(`에러 : ${data.retMsg}`);
        //     }
        // })
        .catch((err) => console.log(err));
    subList(content.main_no);
};

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
    if (item.isEditing) {
        console.log(main_no._value);
        mainUpdate(item);
        // questionList(sub_no._value);
    }
    item.isEditing = !item.isEditing;
};
const toggleEdit = (item) => {
    if (item.isEditing) {
        console.log(sub_no._value);
        subUpdate(item);
        // questionList(sub_no._value);
    }
    item.isEditing = !item.isEditing;
};
const toggleEditQ = (item) => {
    if (item.isEditing) {
        console.log(item.question_no);
        questionUpdate(item);
        // questionList(sub_no._value);
    }
    item.isEditing = !item.isEditing;
};
const mainshowButton = computed(() => {
    return !main_update_isVisible.value && !main_isVisible.value;
});

const subshowButton = computed(() => {
    return !sub_update_isVisible.value && !sub_isVisible.value;
});
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 h-full">
        <div class="md:w-2/8 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">지원서 항목</div>
                <div class="overflow-y-auto">
                    <ul v-for="value in main">
                        <li class="font-semibold text-xl mb-4" v-on:click="subList(value.main_no)">
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center gap-2">
                                    <!-- 수정 상태일 때 -->
                                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-if="value.isEditing" v-model="value.main_title" />
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
                    <div v-if="main_update_isVisible"><Button type="submit" label="전체저장" @click="main_update_isVisible = !main_update_isVisible" class="w-full"></Button></div>
                </div>
            </div>
        </div>
        <div class="md:w-2/8 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">세부 항목</div>
                <ul class="overflow-y-auto" v-for="value in sub">
                    <li class="font-semibold text-l mb-4" v-on:click="questionList(value.sub_no)">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center gap-2">
                                <!-- 수정 상태일 때 -->
                                <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-if="value.isEditing" v-model="value.sub_title" />
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
                    <div v-if="sub_update_isVisible"><Button type="submit" label="전체저장" @click="sub_update_isVisible = !sub_update_isVisible" class="w-full"></Button></div>
                </div>
            </div>
        </div>
        <div class="md:w-4/8 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">질문 항목</div>
                <div class="font-semibold text-xl mb-4">지원신청내역</div>
                <!-- <DataTable :value="question" :paginator="true" :rows="5" dataKey="id" :rowHover="true" showGridlines> -->
                <DataTable :value="question" scrollable scrollHeight="500px" dataKey="id" :rowHover="true" showGridlines>
                    <!-- 못찾았을떄 -->
                    <template #empty> No customers found. </template>

                    <Column header="삭제" style="min-width: 1rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <!-- <Checkbox id="checkOption1" name="option" value="Chicago" v-model="checkboxValue" /> -->
                                <span><Button type="submit" label="삭제" @click="questionDelete(data.question_no)"></Button></span>
                            </div>
                        </template>
                    </Column>
                    <Column header="질문" style="min-width: 40rem">
                        <template #body="{ data }">
                            <div>
                                <!-- 수정 상태일 때 -->
                                <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-if="data.isEditing" v-model="data.question_text" />
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
                    <Button type="submit" label="전체보기" class="w-24" v-on:click="" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
