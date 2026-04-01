<script setup>
import { reactive, ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';

/* =========================
   props / 기본 상태
========================= */
// 부모(Common.vue)에서 현재 조사지 번호를 받아옴
const props = defineProps({
    surveyNo: Number
});

// 입력 폼 상태
const form = reactive({
    plan_title: '',
    plan_content: '',
    files: []
});

// 임시저장 목록
const draftList = ref([]);

// 현재 불러온 임시저장 번호
// 값이 있으면 임시저장 수정 모드, 없으면 신규 임시저장 모드
const selectedRecordNo = ref(null);

// file input을 직접 제어하기 위한 ref
const fileInputRef = ref(null);

// 수정 모드 여부
const isEditMode = ref(false);

// 수정 대상 지원계획 번호
const editPlanNo = ref(null);

// 수정 모드일 때 기존 첨부파일 목록
const existingFiles = ref([]);

// 수정 시 삭제 대상으로 표시한 기존 첨부파일 번호 목록
const deleteExistingFileNos = ref([]);

// 저장 직후 / 승인요청 직후처럼 경고를 잠시 끄기 위한 상태
const ignoreUnloadWarning = ref(false);

// 현재 폼의 기준값(snapshot)
// 작성중 여부 비교할 때 사용
const originalSnapshot = ref({
    plan_title: '',
    plan_content: '',
    existing_file_nos: []
});

/* =========================
   작성중 여부 판단
========================= */
// 제목/내용 변경, 새 파일 선택, 기존 파일 삭제 표시가 있으면 작성중으로 판단
const isDirty = computed(() => {
    const currentExistingNos = existingFiles.value
        .filter((file) => !deleteExistingFileNos.value.includes(file.file_no))
        .map((file) => file.file_no)
        .sort((a, b) => a - b);

    const originalExistingNos = [...originalSnapshot.value.existing_file_nos].sort((a, b) => a - b);

    const sameExistingFiles = JSON.stringify(currentExistingNos) === JSON.stringify(originalExistingNos);

    return !(form.plan_title === originalSnapshot.value.plan_title && form.plan_content === originalSnapshot.value.plan_content && form.files.length === 0 && sameExistingFiles);
});

/* =========================
   공통 함수
========================= */
// localStorage에 저장된 로그인 사용자 정보 가져오기
const getLoginUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

// 현재 상태를 기준 snapshot으로 저장
const syncSnapshot = () => {
    originalSnapshot.value = {
        plan_title: form.plan_title,
        plan_content: form.plan_content,
        existing_file_nos: existingFiles.value.filter((file) => !deleteExistingFileNos.value.includes(file.file_no)).map((file) => file.file_no)
    };
};

// 파일 input 초기화
const clearFileInput = () => {
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

// 폼 전체 초기화
const resetForm = () => {
    // 기본 입력값 초기화
    form.plan_title = '';
    form.plan_content = '';
    form.files = [];

    // 임시저장 선택 상태 초기화
    selectedRecordNo.value = null;

    // 수정 모드 관련 상태 초기화
    isEditMode.value = false;
    editPlanNo.value = null;
    existingFiles.value = [];
    deleteExistingFileNos.value = [];

    // 실제 file input 값 초기화
    clearFileInput();

    // snapshot도 현재 상태로 다시 맞춤
    syncSnapshot();
};

// 파일 선택 시 실행
const handleFile = (e) => {
    form.files = Array.from(e.target.files || []);
};

/* =========================
   브라우저 이탈 경고
========================= */
// 새로고침 / 탭 닫기 / 브라우저 이동 시 작성중이면 경고
const handleBeforeUnload = (event) => {
    if (ignoreUnloadWarning.value) {
        return;
    }

    if (!isDirty.value) {
        return;
    }

    event.preventDefault();
    event.returnValue = '';
};

/* =========================
   수정 모드 진입 이벤트 처리
========================= */
// PlanCheck.vue에서 window.dispatchEvent로 전달한 수정 데이터 수신
const handlePlanEditMode = (event) => {
    const data = event.detail;

    if (!data) {
        return;
    }

    // 수정 모드로 전환
    isEditMode.value = true;
    editPlanNo.value = data.support_plan_no;

    // 임시저장과 수정 모드는 동시에 쓰지 않도록 초기화
    selectedRecordNo.value = null;

    // 제목/내용 채우기
    form.plan_title = data.plan_title || '';
    form.plan_content = data.plan_content || '';

    // 기존 첨부파일 목록 저장
    existingFiles.value = Array.isArray(data.files) ? data.files : [];

    // 삭제 표시 목록 초기화
    deleteExistingFileNos.value = [];

    // 새 파일 선택 목록 초기화
    form.files = [];
    clearFileInput();

    // 현재 상태를 기준 snapshot으로 저장
    syncSnapshot();

    // 화면 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* =========================
   임시저장 목록 조회
========================= */
// 현재 surveyNo + 로그인 사용자(writerNo) 기준으로 임시저장 목록 조회
const loadDraftList = async () => {
    try {
        const loginUser = getLoginUser();
        const writerNo = loginUser?.user_no;

        if (!props.surveyNo || !writerNo) {
            draftList.value = [];
            return;
        }

        const resp = await fetch(`/api/plan/record/list/${props.surveyNo}/${writerNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : [];

        if (resp.ok) {
            draftList.value = Array.isArray(data) ? data : [];
        } else {
            draftList.value = [];
            console.error('임시저장 목록 조회 실패:', data.message);
        }
    } catch (err) {
        console.error('임시저장 목록 조회 에러:', err);
        draftList.value = [];
    }
};

/* =========================
   임시저장 1건 불러오기
========================= */
// 임시저장 목록에서 하나를 선택했을 때 제목/내용을 폼에 채움
// 수정 모드였다면 수정 상태를 해제하고 임시저장 편집/불러오기 상태로 전환
const loadDraft = async (recordNo) => {
    try {
        const resp = await fetch(`/api/plan/record/${recordNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : {};

        if (resp.ok) {
            // 수정 모드 해제
            isEditMode.value = false;
            editPlanNo.value = null;
            existingFiles.value = [];
            deleteExistingFileNos.value = [];

            // 현재 선택한 임시저장 번호 기억
            selectedRecordNo.value = data.support_plan_no_record;

            // 제목/내용 채우기
            form.plan_title = data.record_title || '';
            form.plan_content = data.record_content || '';

            // 파일은 임시저장에 저장/복원하지 않으므로 항상 비움
            form.files = [];
            clearFileInput();

            // snapshot 갱신
            syncSnapshot();
        } else {
            alert(data.message || '임시저장 불러오기에 실패했습니다.');
        }
    } catch (err) {
        console.error('임시저장 불러오기 에러:', err);
        alert('임시저장 불러오기 중 오류가 발생했습니다.');
    }
};

/* =========================
   임시저장
========================= */
// selectedRecordNo가 있으면 수정(PUT), 없으면 신규 등록(POST)
// 수정 모드에서는 임시저장을 사용하지 않음
const saveDraft = async () => {
    try {
        if (isEditMode.value) {
            alert('수정 모드에서는 임시저장을 사용할 수 없습니다.');
            return;
        }

        const loginUser = getLoginUser();
        const writerNo = loginUser?.user_no;

        if (!writerNo) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        if (!form.plan_title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!form.plan_content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const isDraftEditMode = !!selectedRecordNo.value;

        const url = isDraftEditMode ? `/api/plan/record/${selectedRecordNo.value}` : '/api/plan/record';

        const method = isDraftEditMode ? 'PUT' : 'POST';

        const body = isDraftEditMode
            ? {
                  record_title: form.plan_title,
                  record_content: form.plan_content,
                  writer_no: writerNo
              }
            : {
                  survey_no: props.surveyNo,
                  record_title: form.plan_title,
                  record_content: form.plan_content,
                  writer_no: writerNo
              };

        const resp = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const text = await resp.text();
        const data = text ? JSON.parse(text) : {};

        if (resp.ok) {
            ignoreUnloadWarning.value = true;

            alert(data.message || '임시저장되었습니다.');
            await loadDraftList();

            // 저장 후 현재 상태를 기준값으로 재설정
            syncSnapshot();

            setTimeout(() => {
                ignoreUnloadWarning.value = false;
            }, 0);
        } else {
            alert(data.message || '임시저장에 실패했습니다.');
        }
    } catch (err) {
        console.error('임시저장 에러:', err);
        alert('임시저장 중 오류가 발생했습니다.');
    }
};

/* =========================
   임시저장 삭제
========================= */
// 특정 임시저장 1건 삭제
const deleteDraftByRecordNo = async (recordNo) => {
    try {
        const loginUser = getLoginUser();
        const writerNo = loginUser?.user_no;

        if (!recordNo || !writerNo) {
            return;
        }

        const resp = await fetch(`/api/plan/record/${recordNo}/${writerNo}`, {
            method: 'DELETE'
        });

        const text = await resp.text();
        const data = text ? JSON.parse(text) : {};

        if (!resp.ok) {
            throw new Error(data.message || '임시저장 삭제에 실패했습니다.');
        }
    } catch (err) {
        console.error('임시저장 삭제 에러:', err);
        throw err;
    }
};

// 임시저장 목록의 삭제 버튼 클릭 시 실행
const removeDraft = async (recordNo) => {
    try {
        const ok = window.confirm('이 임시저장을 삭제하시겠습니까?');

        if (!ok) {
            return;
        }

        await deleteDraftByRecordNo(recordNo);

        // 현재 폼에 불러온 임시저장과 삭제 대상이 같으면 폼도 초기화
        if (selectedRecordNo.value === recordNo) {
            ignoreUnloadWarning.value = true;
            resetForm();

            setTimeout(() => {
                ignoreUnloadWarning.value = false;
            }, 0);
        }

        alert('임시저장이 삭제되었습니다.');
        await loadDraftList();
    } catch (err) {
        console.error('임시저장 삭제 처리 에러:', err);
        alert(err.message || '임시저장 삭제 중 오류가 발생했습니다.');
    }
};

/* =========================
   기존 첨부파일 삭제 표시 / 취소
========================= */
// 수정 모드에서 기존 파일 삭제 표시 토글
const toggleDeleteExistingFile = (fileNo) => {
    if (deleteExistingFileNos.value.includes(fileNo)) {
        deleteExistingFileNos.value = deleteExistingFileNos.value.filter((no) => no !== fileNo);
    } else {
        deleteExistingFileNos.value.push(fileNo);
    }
};

/* =========================
   지원계획 등록(승인요청)
========================= */
// 신규 등록 시 FormData로 전송
const submitNewPlan = async () => {
    const loginUser = getLoginUser();
    const writerNo = loginUser?.user_no;

    if (!writerNo) {
        alert('로그인 정보가 없습니다.');
        return;
    }

    if (!form.plan_title.trim()) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!form.plan_content.trim()) {
        alert('내용을 입력해주세요.');
        return;
    }

    const currentRecordNo = selectedRecordNo.value;

    const formData = new FormData();
    formData.append('survey_no', props.surveyNo);
    formData.append('plan_title', form.plan_title);
    formData.append('plan_content', form.plan_content);
    formData.append('writer_no', writerNo);

    // 여러 파일 전송
    if (form.files && form.files.length > 0) {
        form.files.forEach((file) => {
            formData.append('files', file);
        });
    }

    const resp = await fetch('/api/plan', {
        method: 'POST',
        body: formData
    });

    const text = await resp.text();
    const data = text ? JSON.parse(text) : {};
    if (resp.ok) {
        if (currentRecordNo) {
            await deleteDraftByRecordNo(currentRecordNo);
        }

        ignoreUnloadWarning.value = true;

        alert('지원계획 저장 및 승인요청이 완료되었습니다.');

        resetForm();
        await loadDraftList();

        // 여기 추가
        window.dispatchEvent(new CustomEvent('plan-list-refresh'));

        setTimeout(() => {
            ignoreUnloadWarning.value = false;
        }, 0);
    } else {
        alert(data.message || '저장에 실패했습니다.');
    }
};

/* =========================
   지원계획 수정 저장
========================= */
// 수정 모드일 때 본문 수정 + 기존 파일 삭제 + 새 파일 추가
const submitEditPlan = async () => {
    const loginUser = getLoginUser();
    const writerNo = loginUser?.user_no;

    if (!writerNo) {
        alert('로그인 정보가 없습니다.');
        return;
    }

    if (!editPlanNo.value) {
        alert('수정 대상 지원계획 정보가 없습니다.');
        return;
    }

    if (!form.plan_title.trim()) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!form.plan_content.trim()) {
        alert('내용을 입력해주세요.');
        return;
    }

    const formData = new FormData();
    formData.append('writer_no', writerNo);
    formData.append('plan_title', form.plan_title);
    formData.append('plan_content', form.plan_content);

    // 삭제할 기존 파일 번호 목록 전송
    if (deleteExistingFileNos.value.length > 0) {
        deleteExistingFileNos.value.forEach((fileNo) => {
            formData.append('delete_file_nos', fileNo);
        });
    }

    // 새 파일 추가 전송
    if (form.files && form.files.length > 0) {
        form.files.forEach((file) => {
            formData.append('files', file);
        });
    }

    const resp = await fetch(`/api/plan/${editPlanNo.value}`, {
        method: 'PUT',
        body: formData
    });

    const text = await resp.text();
    const data = text ? JSON.parse(text) : {};

    if (resp.ok) {
        ignoreUnloadWarning.value = true;

        alert(data.message || '지원계획이 수정되었습니다.');

        // 수정 완료 후 등록 모드로 초기화
        resetForm();
        await loadDraftList();

        // 여기 추가
        window.dispatchEvent(new CustomEvent('plan-list-refresh'));

        setTimeout(() => {
            ignoreUnloadWarning.value = false;
        }, 0);
    } else {
        alert(data.message || '지원계획 수정에 실패했습니다.');
    }
};

/* =========================
   저장 버튼 통합 처리
========================= */
// 등록 모드면 승인요청, 수정 모드면 수정 저장
const submit = async () => {
    try {
        if (isEditMode.value) {
            await submitEditPlan();
        } else {
            await submitNewPlan();
        }
    } catch (err) {
        console.error('저장 처리 에러:', err);
        alert('저장 처리 중 오류가 발생했습니다.');
    }
};

/* =========================
   수정 모드 취소
========================= */
// 수정하던 내용을 버리고 신규 등록 모드로 돌아감
const cancelEditMode = () => {
    const ok = window.confirm('수정을 취소하고 신규 입력 상태로 돌아가시겠습니까?');
    if (!ok) {
        return;
    }

    ignoreUnloadWarning.value = true;
    resetForm();

    setTimeout(() => {
        ignoreUnloadWarning.value = false;
    }, 0);
};

/* =========================
   라이프사이클
========================= */
// 목록 새로고침 이벤트 수신
const handlePlanListRefresh = async () => {
    await loadDraftList();
};

onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('plan-edit-mode', handlePlanEditMode);
    window.addEventListener('plan-list-refresh', handlePlanListRefresh);

    loadDraftList();
    syncSnapshot();
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('plan-edit-mode', handlePlanEditMode);
    window.removeEventListener('plan-list-refresh', handlePlanListRefresh);
});

// 다른 survey로 바뀌면 폼과 임시저장 목록을 새로 맞춤
watch(
    () => props.surveyNo,
    async () => {
        ignoreUnloadWarning.value = true;

        resetForm();
        await loadDraftList();

        setTimeout(() => {
            ignoreUnloadWarning.value = false;
        }, 0);
    }
);
</script>

<template>
    <div class="p-6 bg-slate-100 min-h-full">
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
            <!-- 화면 제목 -->
            <h2 class="text-lg font-bold mb-4 border-b pb-2">
                {{ isEditMode ? '지원계획 수정' : '지원계획 입력' }}
            </h2>

            <!-- 수정 모드 안내 -->
            <p v-if="isEditMode" class="text-xs text-blue-600 mb-3">현재 수정 모드입니다. 검토중인 지원계획의 제목, 내용, 첨부파일을 수정할 수 있습니다.</p>

            <!-- 작성중 안내 -->
            <p v-if="isDirty" class="text-xs text-orange-600 mb-3">작성 중인 내용이 있습니다. 새로고침하거나 페이지를 벗어나면 경고가 표시됩니다.</p>

            <!-- =========================
                 임시저장 목록
            ========================== -->
            <!-- 수정 모드에서는 임시저장 목록을 숨김 -->
            <div v-if="!isEditMode" class="mb-6 border rounded-lg p-4 bg-gray-50">
                <div class="font-semibold mb-3">임시저장 목록</div>

                <div v-if="draftList.length === 0" class="text-sm text-gray-500">임시저장된 계획이 없습니다.</div>

                <table v-else class="w-full text-sm">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left py-2">제목</th>
                            <th class="text-left py-2">저장일</th>
                            <th class="text-center py-2">불러오기</th>
                            <th class="text-center py-2">삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="draft in draftList" :key="draft.support_plan_no_record" class="border-b">
                            <td class="py-2">{{ draft.record_title }}</td>
                            <td class="py-2">{{ draft.created_at }}</td>
                            <td class="py-2 text-center">
                                <button type="button" @click="loadDraft(draft.support_plan_no_record)" class="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded">불러오기</button>
                            </td>
                            <td class="py-2 text-center">
                                <button type="button" @click="removeDraft(draft.support_plan_no_record)" class="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded">삭제</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- =========================
                 제목 입력
            ========================== -->
            <div class="mb-4">
                <label class="block mb-1 text-sm">제목</label>
                <input type="text" v-model="form.plan_title" class="w-full border rounded px-3 py-2 bg-gray-100" />
            </div>

            <!-- =========================
                 내용 입력
            ========================== -->
            <div class="mb-4">
                <label class="block mb-1 border-t pt-2 text-sm">내용</label>
                <textarea v-model="form.plan_content" class="w-full border rounded px-3 py-2 bg-gray-100 h-32"></textarea>
            </div>

            <!-- =========================
                 기존 첨부파일 목록 (수정 모드)
            ========================== -->
            <div v-if="isEditMode" class="mb-4 border-t pt-3">
                <div class="font-medium mb-2">기존 첨부파일</div>

                <div v-if="existingFiles.length === 0" class="text-sm text-gray-500">기존 첨부파일이 없습니다.</div>

                <ul v-else class="space-y-2">
                    <li
                        v-for="file in existingFiles"
                        :key="file.file_no"
                        class="flex items-center justify-between text-sm border rounded px-3 py-2"
                        :class="{
                            'bg-red-50 line-through text-gray-400': deleteExistingFileNos.includes(file.file_no)
                        }"
                    >
                        <span>{{ file.file_name }}</span>

                        <button
                            type="button"
                            @click="toggleDeleteExistingFile(file.file_no)"
                            class="px-3 py-1 rounded text-white"
                            :class="deleteExistingFileNos.includes(file.file_no) ? 'bg-gray-400 hover:bg-gray-500' : 'bg-red-400 hover:bg-red-500'"
                        >
                            {{ deleteExistingFileNos.includes(file.file_no) ? '삭제취소' : '삭제표시' }}
                        </button>
                    </li>
                </ul>

                <p class="text-xs text-gray-500 mt-2">삭제표시된 파일은 수정 저장 시 함께 삭제됩니다.</p>
            </div>

            <!-- =========================
                 새 파일 첨부
            ========================== -->
            <div class="mb-4 flex border-t pt-3 items-center gap-3">
                <input ref="fileInputRef" type="file" multiple @change="handleFile" class="block w-full text-sm" />
            </div>

            <!-- 첨부파일 안내 문구 -->
            <p class="text-xs text-gray-500 mt-1 mb-3">
                {{ isEditMode ? '수정 모드에서는 새 파일을 추가할 수 있으며, 기존 파일은 삭제표시 후 수정 저장 시 반영됩니다.' : '임시저장 불러오기 시 첨부파일은 함께 복원되지 않으므로 필요하면 다시 선택해주세요.' }}
            </p>

            <!-- 현재 선택된 새 파일 목록 -->
            <div v-if="form.files.length > 0" class="mb-6 text-sm text-gray-600">
                <div class="font-medium mb-2">
                    {{ isEditMode ? '추가할 새 파일' : '선택된 파일' }}
                </div>
                <ul class="list-disc pl-5">
                    <li v-for="file in form.files" :key="file.name + file.size">
                        {{ file.name }}
                    </li>
                </ul>
            </div>

            <!-- =========================
                 버튼 영역
            ========================== -->
            <div class="text-right flex justify-end gap-2">
                <!-- 등록 모드에서만 임시저장 버튼 표시 -->
                <button v-if="!isEditMode" type="button" @click="saveDraft" class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full">임시저장</button>

                <!-- 수정 모드에서만 취소 버튼 표시 -->
                <button v-if="isEditMode" type="button" @click="cancelEditMode" class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full">수정취소</button>

                <!-- 등록 / 수정 저장 버튼 -->
                <button type="button" @click="submit" class="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full">
                    {{ isEditMode ? '수정저장' : '승인요청' }}
                </button>
            </div>
        </div>
    </div>
</template>
