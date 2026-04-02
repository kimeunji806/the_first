<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const ins_no = userStore.institution;

const managerList = ref([]);
const selectedUser = ref(null);

// 수정 모드 상태
const isEditMode = ref(false);

// 입력폼용 reactive
const form = reactive({
    user_id: '',
    name: '',
    tel: '',
    email: '',
    address: '',
    ins: ''
});

// 담당자 목록 불러오기
const managerFetch = async (ins_no) => {
    try {
        const resp = await fetch(`/api/managerList/${ins_no}`);
        const data = await resp.json();
        managerList.value = data;

        if (data.length > 0) {
            selectedUser.value = data[0];
            loadForm(selectedUser.value); // 기본값 form에 세팅
        }
    } catch (err) {
        console.error('담당자 조회 에러:', err);
    }
};

// 클릭 시 상세 변경
const selectUser = (user) => {
    selectedUser.value = user;
    loadForm(user);
    isEditMode.value = false; // 조회 모드로
};

// form에 값 세팅
const loadForm = (user) => {
    if (!user) return;
    form.user_id = user.user_id || '';
    form.name = user.name || '';
    form.tel = user.tel || '';
    form.email = user.email || '';
    form.address = user.address || '';
    form.ins = user.ins || '';
};

// 수정 버튼 클릭
const editUser = () => {
    isEditMode.value = true;
};

// 저장 버튼 클릭
const saveUser = async () => {
    try {
        const payload = {
            user_id: form.user_id,
            name: form.name,
            tel: form.tel,
            email: form.email,
            address: form.address,
            ins: form.ins
        };

        const resp = await fetch(`/api/managerUpdate/${form.user_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) throw new Error('저장 실패');

        // 저장 후 화면 업데이트
        const updatedData = await resp.json();
        selectedUser.value = updatedData;
        loadForm(updatedData);
        isEditMode.value = false;
        alert('저장 완료');
    } catch (err) {
        console.error('저장 에러:', err);
        alert('저장 실패');
    }
};

onBeforeMount(() => {
    managerFetch(ins_no);
});
</script>

<template>
    <div class="flex h-screen">
        <!-- 좌측 담당자 목록 -->
        <div class="w-64 bg-green-100 p-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold">담당자 목록</h3>
                <span class="text-sm text-gray-500">총 {{ managerList.length }}명</span>
            </div>

            <div v-for="user in managerList" :key="user.user_id" class="flex justify-between items-center p-3 border-b cursor-pointer hover:bg-green-200" @click="selectUser(user)">
                <span>{{ user.name }}</span>
                <span class="text-gray-400">›</span>
            </div>

            <button class="mt-4 w-full bg-green-400 text-white py-2 rounded-full">기관담당자 등록</button>
        </div>

        <!-- 우측 상세 정보 / 입력폼 -->
        <div class="flex-1 bg-gray-100 p-10">
            <div class="bg-white p-8 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-6">
                    {{ isEditMode ? '담당자 수정' : selectedUser?.name || '담당자 정보' }}
                </h2>

                <div class="space-y-4">
                    <!-- 조회모드 -->
                    <template v-if="!isEditMode">
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">아이디</span>
                            <span>{{ selectedUser?.user_id }}</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">이름</span>
                            <span>{{ selectedUser?.name }}</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">전화번호</span>
                            <span>{{ selectedUser?.tel }}</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">이메일</span>
                            <span>{{ selectedUser?.email }}</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">주소</span>
                            <span>{{ selectedUser?.address }}</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">기관</span>
                            <span>{{ selectedUser?.ins }}</span>
                        </div>
                    </template>

                    <!-- 수정모드 -->
                    <template v-else>
                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">이름</label>
                            <input v-model="form.name" class="border rounded px-3 py-2" />
                        </div>
                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">전화번호</label>
                            <input v-model="form.tel" class="border rounded px-3 py-2" />
                        </div>
                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">이메일</label>
                            <input v-model="form.email" class="border rounded px-3 py-2" />
                        </div>
                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">주소</label>
                            <input v-model="form.address" class="border rounded px-3 py-2" />
                        </div>
                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">기관</label>
                            <input v-model="form.ins" class="border rounded px-3 py-2" />
                        </div>
                    </template>
                </div>

                <div class="flex justify-end mt-6">
                    <button v-if="!isEditMode" @click="editUser" class="bg-green-400 text-white px-6 py-2 rounded-full">수정</button>
                    <button v-else @click="saveUser" class="bg-blue-400 text-white px-6 py-2 rounded-full">저장</button>
                </div>
            </div>
        </div>
    </div>
</template>
