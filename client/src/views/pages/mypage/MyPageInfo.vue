<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const uNo = userStore.user_no;

import { myInfo } from '@/service/MyPageService';

const myInfoList = ref([]);

// 수정 모드
const isEditMode = ref(false);

// 입력값 (수정용)
const editForm = ref({
    user_name: '',
    tel: ''
});

// 데이터 불러오기
async function loadInfo(uNo) {
    const data = await myInfo(uNo);
    myInfoList.value = Array.isArray(data) ? data : [data];
}

// 수정 버튼 클릭
function handleEdit() {
    isEditMode.value = true;

    // 기존 값 세팅
    editForm.value.user_name = myInfoList.value[0].user_name;
    editForm.value.tel = myInfoList.value[0].tel;
}

// 저장 버튼 클릭
async function handleSave() {
    // try {
    // await fetch('/api/updateUser', {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         user_no: uNo,
    //         user_name: editForm.value.user_name,
    //         tel: editForm.value.tel
    //     })
    //     });
    //     // 화면 반영
    //     myInfoList.value[0].user_name = editForm.value.user_name;
    //     myInfoList.value[0].tel = editForm.value.tel;
    //     isEditMode.value = false;
    //     alert('수정 완료');
    // } catch (err) {
    //     console.error(err);
    //     alert('수정 실패');
    // }
}

onMounted(async () => {
    await loadInfo(uNo);
});
</script>

<template>
    <div class="p-6 rounded">
        <div class="text-lg font-semibold mb-4 border-b pb-2">보호자 정보</div>

        <div v-if="myInfoList[0]" class="divide-y">
            <!-- 아이디 -->
            <div class="grid grid-cols-4 py-4">
                <div>아이디</div>
                <div class="col-span-3">{{ myInfoList[0].user_id }}</div>
            </div>

            <!-- 이름 -->
            <div class="grid grid-cols-4 py-4">
                <div>이름</div>
                <div class="col-span-3">
                    <input v-if="isEditMode" v-model="editForm.user_name" class="border px-2 py-1 rounded w-full" />
                    <span v-else>{{ myInfoList[0].user_name }}</span>
                </div>
            </div>

            <!-- 전화번호 -->
            <div class="grid grid-cols-4 py-4">
                <div>전화번호</div>
                <div class="col-span-3">
                    <input v-if="isEditMode" v-model="editForm.tel" class="border px-2 py-1 rounded w-full" />
                    <span v-else>{{ myInfoList[0].tel }}</span>
                </div>
            </div>

            <!-- 이메일 -->
            <div class="grid grid-cols-4 py-4">
                <div>이메일</div>
                <div class="col-span-3">{{ myInfoList[0].email }}</div>
            </div>

            <!-- 주소 -->
            <div class="grid grid-cols-4 py-4">
                <div>주소</div>
                <div class="col-span-3">{{ myInfoList[0].address }}</div>
            </div>

            <!-- 기관 -->
            <div class="grid grid-cols-4 py-4">
                <div>기관</div>
                <div class="col-span-3">{{ myInfoList[0].ins }}</div>
            </div>

            <!-- 가입일 -->
            <div class="grid grid-cols-4 py-4">
                <div>가입일</div>
                <div class="col-span-3">{{ myInfoList[0].created_at }}</div>
            </div>
        </div>

        <!-- 버튼 -->
        <div class="flex justify-end mt-6 gap-3">
            <button class="bg-gray-300 px-4 py-2 rounded">회원탈퇴</button>

            <button v-if="!isEditMode" @click="handleEdit" class="bg-green-500 text-white px-4 py-2 rounded">수정</button>

            <button v-else @click="handleSave" class="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
        </div>
    </div>
</template>
