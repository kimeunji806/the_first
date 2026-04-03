<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getInstitutionMyPage, updateInstitutionMyPage } from '@/service/InstitutionMyPageService';

const router = useRouter();

// 수정 폼
const form = reactive({
    user_no: null,
    user_id: '',
    user_name: '',
    tel: '',
    email: '',
    institution_name: '',
    created_at: ''
});

// 날짜 표시용
function formatDate(value) {
    if (!value) return '';
    return String(value).slice(0, 10);
}

// 조회
async function loadMyInfo() {
    try {
        const loginUser = JSON.parse(localStorage.getItem('user'));
        const userNo = loginUser?.user_no;

        if (!userNo) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        const result = await getInstitutionMyPage(userNo);

        if (result.retCode === 'OK') {
            const data = result.data;

            form.user_no = data.user_no;
            form.user_id = data.user_id || '';
            form.user_name = data.user_name || '';
            form.tel = data.tel || '';
            form.email = data.email || '';
            form.institution_name = data.institution_name || '';
            form.created_at = data.created_at || '';
        } else {
            alert(result.message || '정보 조회 실패');
        }
    } catch (err) {
        console.error('기관담당자 수정정보 조회 오류:', err);
        alert('정보를 불러오지 못했습니다.');
    }
}

// 저장
async function saveInfo() {
    try {
        if (!form.user_name.trim()) {
            alert('이름을 입력하세요.');
            return;
        }

        if (!form.tel.trim()) {
            alert('전화번호를 입력하세요.');
            return;
        }

        const payload = {
            user_name: form.user_name,
            tel: form.tel
        };

        const result = await updateInstitutionMyPage(form.user_no, payload);

        if (result.retCode === 'OK') {
            alert('수정되었습니다.');
            router.push('/institutioninfo');
        } else {
            alert(result.message || '수정 실패');
        }
    } catch (err) {
        console.error('기관담당자 정보 수정 오류:', err);
        alert('수정 중 오류가 발생했습니다.');
    }
}

// 취소
function cancelEdit() {
    router.push('/institutioninfo');
}

onMounted(() => {
    loadMyInfo();
});
</script>

<template>
    <div class="p-6">
        <!-- 제목 -->
        <div class="mb-5">
            <div class="text-surface-900 dark:text-surface-0 text-2xl font-medium mb-1">내 정보 수정</div>
            <span class="text-muted-color"> 이름과 전화번호를 수정할 수 있습니다. </span>
        </div>

        <!-- 수정 폼 -->
        <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl p-4 lg:p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 아이디 -->
                <div>
                    <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">아이디</label>
                    <InputText :value="form.user_id" class="w-full mb-4 readonly-field" readonly />
                </div>

                <!-- 이름 -->
                <div>
                    <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">이름</label>
                    <InputText v-model="form.user_name" class="w-full mb-4" />
                </div>

                <!-- 전화번호 -->
                <div>
                    <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">전화번호</label>
                    <InputText v-model="form.tel" class="w-full mb-4" placeholder="010-0000-0000" />
                </div>

                <!-- 이메일 -->
                <div>
                    <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">이메일</label>
                    <InputText :value="form.email" class="w-full mb-4 readonly-field" readonly />
                </div>

                <!-- 기관명 -->
                <div>
                    <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">소속 기관</label>
                    <InputText :value="form.institution_name" class="w-full mb-4 readonly-field" readonly />
                </div>

                <!-- 가입일 -->
                <div>
                    <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">가입일</label>
                    <InputText :value="formatDate(form.created_at)" class="w-full mb-4 readonly-field" readonly />
                </div>
            </div>

            <!-- 버튼 -->
            <div class="flex gap-2 justify-end mt-2">
                <Button label="취소" severity="secondary" outlined @click="cancelEdit" />
                <Button label="저장" @click="saveInfo" />
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.readonly-field) {
    background-color: #f3f4f6 !important;
    color: #6b7280 !important;
    border-color: #d1d5db !important;
    cursor: not-allowed;
}
</style>
