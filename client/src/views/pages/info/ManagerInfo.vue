<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const ins_no = userStore.institution;

const managerList = ref([]);
const selectedUser = ref(null);

const isEditMode = ref(false);
const isCreateMode = ref(false);

const insList = ref([]);

// 입력폼
const form = reactive({
    user_id: '',
    password: '',
    name: '',
    tel: '',
    email: '',
    ins_no: ''
});

// 담당자 리스트 조회
const managerFetch = async (ins_no) => {
    try {
        const resp = await fetch(`/api/managerList/${ins_no}`);
        const data = await resp.json();
        managerList.value = data;

        if (!selectedUser.value && data.length > 0) {
            selectedUser.value = data[0];
            loadForm(selectedUser.value);
        }
    } catch (err) {
        console.error('담당자 조회 에러:', err);
    }
};

//기관정보 조회
const fetchInsList = async () => {
    try {
        const resp = await fetch('/api/institutionList');
        const data = await resp.json();
        insList.value = data;
    } catch (err) {
        console.error('기관 목록 조회 에러:', err);
    }
};

//담당자 선택시 조회 모드 전환
const selectUser = (user) => {
    selectedUser.value = user;
    loadForm(user);
    isEditMode.value = false;
    isCreateMode.value = false;
};

//상세정보 불러옴
const loadForm = (user) => {
    if (!user) return;
    form.user_id = user.user_id || '';
    form.name = user.name || '';
    form.tel = user.tel || '';
    form.email = user.email || '';
    form.ins_no = user.ins_no ? String(user.ins_no) : '';
};

//등록 모드 전환
const createUser = () => {
    isCreateMode.value = true;
    isEditMode.value = false;
    selectedUser.value = null;

    form.user_id = '';
    form.password = '';
    form.name = '';
    form.tel = '';
    form.email = '';
    // form.ins_no = '';
};

//수정 모드 전환
const editUser = () => {
    isEditMode.value = true;
    isCreateMode.value = false;
};

//담당자 등록
const insertUser = async () => {
    try {
        const payload = {
            user_id: form.user_id,
            password: form.password,
            name: form.name,
            tel: form.tel,
            email: form.email,
            ins_no: ins_no
        };

        const resp = await fetch('/api/managerInsert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) throw new Error('등록 실패');

        const newUser = await resp.json();

        alert('등록 완료');

        await managerFetch(ins_no);

        selectedUser.value = managerList.value.find((u) => u.user_no === newUser.user_no);

        loadForm(selectedUser.value);

        isCreateMode.value = false;
    } catch (err) {
        console.error('등록 에러:', err);
        alert('등록 실패');
    }
};

//수정후 저장
const saveUser = async () => {
    if (!selectedUser.value) return;

    const mNo = selectedUser.value.user_no;

    try {
        const payload = {
            user_id: form.user_id,
            name: form.name,
            tel: form.tel,
            email: form.email,
            ins_no: form.ins_no
        };

        const resp = await fetch(`/api/managerUpdate/${mNo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) throw new Error('저장 실패');

        await resp.json();

        alert('저장 완료');

        await managerFetch(ins_no);

        const updatedUser = managerList.value.find((u) => String(u.user_no) === String(mNo)); //담당자 리스트중 최근에 선택된 번호랑 같은 값 찾음

        if (updatedUser) {
            // 수정 끝난후 찾은 번호로 다시 조회
            selectedUser.value = updatedUser;
            loadForm(updatedUser);
        }

        isEditMode.value = false;
    } catch (err) {
        console.error('저장 에러:', err);
        alert('저장 실패');
    }
};

onBeforeMount(() => {
    managerFetch(ins_no);
    fetchInsList();
});
</script>

<template>
    <div class="flex h-screen">
        <div class="w-64 bg-green-100 p-4">
            <div class="flex justify-between mb-4">
                <h3>담당자 목록</h3>
                <span>{{ managerList.length }}명</span>
            </div>

            <div v-for="user in managerList" :key="user.user_id" class="p-3 border-b cursor-pointer hover:bg-green-200" @click="selectUser(user)">
                {{ user.name }}
            </div>

            <button class="mt-4 w-full bg-green-400 text-white py-2 rounded" @click="createUser">기관담당자 등록</button>
        </div>

        <div class="flex-1 p-10 bg-gray-100">
            <div class="bg-white p-8 rounded shadow">
                <h2 class="mb-6 text-xl">
                    {{ isCreateMode ? '담당자 등록' : isEditMode ? '담당자 수정' : selectedUser?.name || '담당자 정보' }}
                </h2>

                <!-- 조회 -->
                <template v-if="!isEditMode && !isCreateMode">
                    <div class="space-y-3">
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">아이디</span>
                            <span class="font-medium text-gray-800">
                                {{ selectedUser?.user_id }}
                            </span>
                        </div>

                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">이름</span>
                            <span class="font-medium text-gray-800">
                                {{ selectedUser?.name }}
                            </span>
                        </div>

                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">전화번호</span>
                            <span class="font-medium text-gray-800">
                                {{ selectedUser?.tel }}
                            </span>
                        </div>

                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">이메일</span>
                            <span class="font-medium text-gray-800">
                                {{ selectedUser?.email }}
                            </span>
                        </div>

                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-500">기관</span>
                            <span class="font-medium text-gray-800">
                                {{ insList.find((i) => String(i.ins_no) === String(selectedUser?.ins_no))?.ins_name }}
                            </span>
                        </div>
                    </div>
                </template>
                <!-- 수정 -->
                <template v-else-if="isEditMode">
                    <div class="space-y-4">
                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">아이디</label>
                            <input v-model="form.user_id" :disabled="true" class="border bg-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                        </div>

                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">이름</label>
                            <input v-model="form.name" class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                        </div>

                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">전화번호</label>
                            <input v-model="form.tel" class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                        </div>

                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">이메일</label>
                            <input v-model="form.email" :disabled="true" class="border rounded bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                        </div>

                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">기관</label>
                            <select v-model="form.ins_no" :disabled="true" class="border rounded bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300">
                                <option disabled value="">기관 선택</option>
                                <option v-for="ins in insList" :key="ins.ins_no" :value="String(ins.ins_no)">
                                    {{ ins.ins_name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </template>

                <!-- 등록 -->
                <template v-else>
                    <div class="space-y-4">
                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">아이디</label>
                            <input v-model="form.user_id" class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>

                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">비밀번호</label>
                            <input type="password" v-model="form.password" class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>

                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">이름</label>
                            <input v-model="form.name" class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>

                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">전화번호</label>
                            <input v-model="form.tel" class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>

                        <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">이메일</label>
                            <input v-model="form.email" class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>

                        <!-- <div class="flex flex-col">
                            <label class="text-gray-500 text-sm mb-1">기관</label>
                            <select v-model="form.ins_no" class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300">
                                <option disabled value="">기관 선택</option>
                                <option v-for="ins in insList" :key="ins.ins_no" :value="String(ins.ins_no)">
                                    {{ ins.ins_name }}
                                </option>
                            </select>
                        </div> -->
                    </div>
                </template>

                <!-- 버튼 -->
                <div class="mt-6 text-right space-x-2">
                    <button v-if="!isEditMode && !isCreateMode" @click="editUser" class="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-lg">수정</button>

                    <button v-else-if="isEditMode" @click="saveUser" class="bg-blue-400 hover:bg-blue-500 text-white px-5 py-2 rounded-lg">저장</button>

                    <button v-else @click="insertUser" class="bg-purple-400 hover:bg-purple-500 text-white px-5 py-2 rounded-lg">등록</button>
                </div>
            </div>
        </div>
    </div>
</template>
