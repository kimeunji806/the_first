<script setup>
import { ref, onBeforeMount, computed } from 'vue';
const main = ref([]);
const sub = ref([]);
const question = ref([]);
const sub_no = ref([]);

// 세부항목 조회
const subList = async (mainNo) => {
    console.log(mainNo);
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

// 메인항목 조회
onBeforeMount(async () => {
    await fetch(`/api/main`)
        .then((resp) => resp.json())
        .then((data) => {
            main.value = data.map((item) => ({
                ...item,
                isEditing: false
            }));
        })
        .catch((err) => console.log(err));
});

const main_isVisible = ref(false);
const sub_isVisible = ref(false);
const question_isVisible = ref(false);
const main_update_isVisible = ref(false);
const sub_update_isVisible = ref(false);

// const isEditing = ref(null);

const toggleEdit = (item) => {
    item.isEditing = !item.isEditing;
    if (item.isEditing == false) {
        console.log(sub_no._value);

        // questionList(sub_no._value);
    }
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
                                    <Button type="submit" label="수정" @click="toggleEdit(value)">{{ value.isEditing ? '저장' : '수정' }}</Button>
                                    <Button type="submit" label="삭제" @click=""></Button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="main_isVisible">
                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-model="content" />
                    <Button type="submit" label="저장" @click="main_isVisible = !main_isVisible" />
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
                                <Button type="submit" label="삭제" @click=""></Button>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-if="sub_isVisible">
                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" v-model="content" />

                    <Button type="submit" label="저장" @click="sub_isVisible = !sub_isVisible" />
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
                                <Checkbox id="checkOption1" name="option" value="Chicago" v-model="checkboxValue" />
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
                                    ><Button type="submit" label="수정" @click="toggleEdit(data)">{{ data.isEditing ? '저장' : '수정' }}</Button></span
                                >
                            </div>
                        </template>
                    </Column>
                </DataTable>
                <div v-if="question_isVisible">
                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[56rem]" v-model="content" />

                    <Button type="submit" label="저장" @click="question_isVisible = !question_isVisible" />
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
