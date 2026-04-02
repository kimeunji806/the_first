<script setup>
import { ref, reactive, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useBeneStore } from '@/stores/surBene';
import { useRoute } from 'vue-router';
import { Button } from 'primevue';

const userStore = useUserStore();
const userbeneStore = useBeneStore();
const route = useRoute();

const userNo = userStore.user_no;
const userRole = userStore.role;
const userName = userStore.user_name;
const beneNo = userbeneStore.beneficiaries_no;
const surNo = userbeneStore.survey_no;

const selectNo = Number(route.params.no);

//수정시 삭제할 파일
const deleteFiles = ref([]);

const form = reactive({
    date: '',
    title: '',
    content: '',
    file: [],
    existingFiles: []
});

//폼 초기화

// 수정 모드 상태
const editNo = ref(null);

// store 값 감지해서 form 채우기
watch(
    () => userbeneStore.selectedCounsel,
    (data) => {
        if (data) {
            userbeneStore.isEditMode = true;

            editNo.value = data.no;

            form.date = '';
            form.title = '';
            form.content = '';
            form.file = [];
            form.existingFiles = [];

            setTimeout(() => {
                form.date = data.counseldate?.substring(0, 10) || '';
                form.title = data.title || '';
                form.content = data.content || '';
                form.existingFiles = Array.isArray(data.filename) ? data.filename : data.filename ? data.filename.split(',') : [];
            });
        }
    },
    { immediate: true }
);

//임시저장 목록
const tempList = ref([]);

//form에 첨부파일 선택한거 넣음
const handleFile = (e) => {
    form.file = e.target.files;
};

//임시저장 값 불러오기
const loadTempData = (item) => {
    form.date = item.record_date?.substring(0, 10) || '';
    form.title = item.title || '';
    form.content = item.content || '';
};

//지울 파일 정보 넘겨주기 위해 삭제 목록에 추가
const removeExistingFile = (file) => {
    deleteFiles.value.push(file);
    form.existingFiles = form.existingFiles.filter((f) => f !== file);
};

// 등록
const submit = async () => {
    const beneNo = userbeneStore.beneficiaries_no;
    const surNo = userbeneStore.survey_no;
    const userNo = userStore.user_no;

    const formData = new FormData();

    formData.append('date', form.date);
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('surNo', surNo);
    formData.append('beneNo', beneNo);
    formData.append('userNo', userNo);

    if (form.file.length > 0) {
        for (let i = 0; i < form.file.length; i++) {
            formData.append('file', form.file[i]);
        }
    }
    try {
        await fetch(`/api/counselUpload`, {
            method: 'POST',
            body: formData
        });
        userbeneStore.refreshCounsel = !userbeneStore.refreshCounsel;
        alert('등록 완료');
        form.date = '';
        form.title = '';
        form.content = '';
        form.file = [];
        form.existingFiles = [];
        deleteFiles.value = [];
    } catch (err) {
        console.error(err);
        alert('에러 발생');
    }
};

//수정
const update = async () => {
    const counselNo = userbeneStore.selectedCounsel.no;

    const formData = new FormData();

    formData.append('date', form.date);
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('surNo', surNo);
    formData.append('beneNo', beneNo);
    formData.append('userNo', userNo);
    formData.append('no', counselNo);
    formData.append('name', userName);
    formData.append('role', userRole);
    formData.append('deleteFiles', JSON.stringify(deleteFiles.value));

    if (form.file.length > 0) {
        for (let i = 0; i < form.file.length; i++) {
            formData.append('files', form.file[i]);
        }
    }

    await fetch(`/api/counselUpdate`, {
        method: 'PUT',
        body: formData
    });
    alert('수정 처리 되었습니다');
    userbeneStore.refreshCounsel = !userbeneStore.refreshCounsel;
    userbeneStore.isEditMode = false;
    form.date = '';
    form.title = '';
    form.content = '';
    form.file = [];
    form.existingFiles = [];
    deleteFiles.value = [];
};

//임시저장 목록 불러오기
const temporaryStorageInfo = async (surNo, wNo) => {
    await fetch(`/api/counselSaveInfo/${surNo}/${wNo}`)
        .then((resp) => resp.json())
        .then((data) => {
            tempList.value = Array.isArray(data) ? data : [data];
        });
};

//임시저장하기
const temporaryStorage = async () => {
    const beneNo = userbeneStore.beneficiaries_no;
    const surNo = userbeneStore.survey_no;
    const userNo = userStore.user_no;
    try {
        await fetch(`/api/counselSave`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: form.date,
                title: form.title,
                content: form.content,
                surNo: surNo,
                wNo: userNo,
                beneNo: beneNo
            })
        });
        await temporaryStorageInfo(userbeneStore.survey_no, userNo);
    } catch {
        console.log((err) => console.log(err));
    }
};

//임시저장 삭제
const deleteSave = async () => {
    const recordNo = tempList.value[0].record_no;

    try {
        await fetch(`/api/counselSaveDelete/${recordNo}`, {
            method: 'delete'
        });
        await temporaryStorageInfo(userbeneStore.survey_no, userNo);
    } catch {
        console.log((err) => console.log(err));
    }
};

const updateCancel = async () => {
    userbeneStore.isEditMode = false;
};

onBeforeMount(async () => {
    await userbeneStore.fetchUsers(selectNo);

    // 임시저장 정보 불러오기
    if (userbeneStore.survey_no) {
        await temporaryStorageInfo(userbeneStore.survey_no, userNo);
    }

    // 수정 모드인지 확인 후 폼 세팅
    const editData = userbeneStore.selectedCounsel;
    if (editData) {
        userbeneStore.isEditMode = true;
        editNo.value = editData.no;
        form.date = editData.counseldate?.substring(0, 10) || '';
        form.title = editData.title || '';
        form.content = editData.content || '';
        form.existingFiles = Array.isArray(editData.filename) ? editData.filename : editData.filename ? editData.filename.split(',') : [];
    } else {
        userbeneStore.isEditMode = false;
    }
});

// 페이지 떠날 때 selectedCounsel 초기화
onBeforeUnmount(() => {
    userbeneStore.beneficiaries_no = null;
    userbeneStore.beneficiaries_name = null;
    userbeneStore.survey_no = null;
    userbeneStore.selectedCounsel = null;
    userbeneStore.isEditMode = false;
});
</script>

<template>
    <div class="card h-full flex flex-col gap-4">
        <div class="max-h-[800px] overflow-y-auto pr-2">
            <!--담당자 아닐경우-->
            <div v-if="userRole !== 'e2'" class="p-6 bg-gray-100 text-gray-800 rounded-lg text-center font-semibold">상담기록 등록은 담당자만 가능합니다.</div>

            <div v-else>
                <!-- 임시저장 목록 -->
                <div v-if="tempList.length !== 0 && !userbeneStore.isEditMode" class="mb-4">
                    <h3 class="text-sm font-bold mb-3">임시저장 목록</h3>
                    <div v-for="item in tempList" :key="item.record_no" @click="loadTempData(item)" class="p-4 mb-3 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 transition">
                        <!-- 상단 -->
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-xs text-gray-400"> 상담일자: {{ item.record_date }} </span>
                            <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full"> 임시저장 </span>
                        </div>
                        <!-- 제목 -->
                        <div class="font-semibold text-base text-gray-800 truncate">
                            {{ item.title || '제목 없음' }}
                        </div>
                        <!-- 내용 -->
                        <div class="text-sm text-gray-600 mt-1 line-clamp-2">
                            {{ item.content || '내용 없음' }}
                        </div>
                        <!-- 하단 -->
                        <div class="flex justify-between items-center mt-4 pt-2 border-t">
                            <span class="text-xs text-gray-400"> 등록일자: {{ item.created_at }} </span>
                            <Button @click.stop="deleteSave" severity="danger" size="small" outlined> 삭제 </Button>
                        </div>
                    </div>
                </div>

                <!-- 상담 입력/수정 폼 -->
                <h2 class="text-lg font-bold mb-4 border-b pb-2">
                    {{ userbeneStore.isEditMode ? '상담기록 수정' : '상담기록 입력' }}
                </h2>
                <div class="mb-4">
                    <label class="block mb-1 text-sm">상담일</label>
                    <input type="date" v-model="form.date" class="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
                <div class="mb-4">
                    <label class="block mb-1 border-t pt-2 text-sm">제목</label>
                    <input type="text" v-model="form.title" class="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
                <div class="mb-4">
                    <label class="block mb-1 border-t pt-2 text-sm">내용</label>
                    <textarea v-model="form.content" class="w-full border rounded px-3 py-2 bg-gray-100 h-32"></textarea>
                </div>

                <!-- 첨부파일, 등록/수정 버튼 등 나머지 폼 -->
                <div v-if="!userbeneStore.isEditMode">
                    <div class="mb-6 flex border-t pt-2 items-center gap-3">
                        <label class="block mb-1 text-sm">첨부파일</label>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <i class="pi pi-info-circle text-blue-400"></i>
                        <span>첨부파일은 임시저장되지 않습니다.</span>
                    </div>
                    <input type="file" multiple @change="handleFile" />
                </div>

                <div v-else>
                    <div class="mb-6 flex border-t pt-2 items-center gap-3">
                        <label class="block mb-1 text-sm">첨부파일</label>
                    </div>

                    <div v-if="form.existingFiles.length > 0" class="mb-2">
                        <div v-for="(file, i) in form.existingFiles" :key="i" class="flex items-center gap-2">
                            <a :href="`/api/download/${encodeURIComponent(file)}`">{{ file }}</a>
                            <button @click="removeExistingFile(file)">X</button>
                        </div>
                    </div>

                    <input type="file" multiple @change="handleFile" />
                </div>

                <div class="text-right">
                    <button v-if="userbeneStore.isEditMode" @click="updateCancel" class="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 mr-2 rounded-full">수정취소</button>
                    <button v-if="!userbeneStore.isEditMode" @click="temporaryStorage" class="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 mr-2 rounded-full">임시저장</button>
                    <button @click="userbeneStore.isEditMode ? update() : submit()" class="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full">
                        {{ userbeneStore.isEditMode ? '수정' : '등록' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
