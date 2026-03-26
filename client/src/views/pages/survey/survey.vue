<script setup>
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
const survey_li = ref([]);

// const findAllServeyList = async () => {
//     let list = await fetch(`/api/survey`)
//         .then((resp) => resp.json())
//         .catch((err) => console.log(err));
//     survey_li.value = list;
// };

const main_isVisible = ref(false);
const sub_isVisible = ref(false);

// import { useRouter } from 'vue-router';
// const router = useRouter();
// const goToDetail = (userNo) => {
//     router.push({ name: 'userInfo', params: { no: userNo } });
// };

// onBeforeMount(() => {
//     findAllList();
// });
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 h-screen">
        <div class="md:w-1/5 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">지원서 항목</div>
                <!-- <ul class="overflow-y-auto" v-for="info in users">
                    <li class="font-semibold text-l mb-4" v-on:click="goToDetail(info.user_no)">{{ info.user_no }}</li>
                    <li class="font-semibold text-l mb-4">지원이 필요한 서비스</li>
                    <li class="font-semibold text-l mb-4">이용중인 복지 서비스</li>
                </ul> -->
                <ul class="overflow-y-auto">
                    <li class="font-semibold text-l mb-4">지원</li>
                    <li class="font-semibold text-l mb-4">지원이 필요한 서비스</li>
                    <li class="font-semibold text-l mb-4">이용중인 복지 서비스</li>
                </ul>
                <div v-if="main_isVisible">
                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-model="content" />
                    <Button type="submit" label="저장" @click="main_isVisible = !main_isVisible" />
                </div>

                <div class="mt-auto" v-if="!main_isVisible"><Button type="submit" label="항목추가" class="w-full" @click="main_isVisible = !main_isVisible"></Button></div>
            </div>
        </div>
        <div class="md:w-1/5 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">지원서 항목</div>
                <ul>
                    <li class="font-semibold text-l mb-4">지원사유</li>
                    <li class="font-semibold text-l mb-4">지원이 필요한 서비스</li>
                    <li class="font-semibold text-l mb-4">이용중인 복지 서비스</li>
                </ul>
                <div v-if="sub_isVisible">
                    <InputText type="text" id="myInput" placeholder="지원서 항목 추가" class="w-full md:w-[13rem]" v-model="content" />

                    <Button type="submit" label="저장" @click="sub_isVisible = !sub_isVisible" />
                </div>

                <div class="mt-auto" v-if="!sub_isVisible"><Button type="submit" label="항목추가" class="w-full" @click="sub_isVisible = !sub_isVisible"></Button></div>
            </div>
        </div>
        <div class="md:w-3/5 h-full">
            <div class="card h-full flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">지원서 항목</div>
                <div class="flex justify-end">
                    <Button type="submit" label="항목저장" class="w-24" v-on:click="" />
                </div>

                <div class="mt-auto flex justify-end gap-2">
                    <Button type="submit" label="수정이력" class="w-24" v-on:click="" />
                    <Button type="submit" label="전체보기" class="w-24" v-on:click="" />
                    <Button type="submit" label="항목저장" class="w-24" v-on:click="" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
