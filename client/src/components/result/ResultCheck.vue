<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import ResultFileList from '@/components/result/ResultFileList.vue';

/* =========================
   기본 상태
========================= */
const route = useRoute();
const surveyNo = Number(route.params.no);
const list = ref([]);

/* =========================
   공통 함수
========================= */
const getLoginUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const loginUser = getLoginUser();
const loginRole = loginUser?.role;

/* =========================
   수정이력 모달 상태
========================= */
const historyDialog = ref(false);
const historyData = ref([]);
const historyDialogTitle = ref('지원결과 수정이력');

/* =========================
   버튼 표시 조건 함수
========================= */
// 수정 버튼 표시 조건
// - 기관담당자(e2)만 표시
// - 검토중(a0)인 결과서만 표시
const canShowEditButton = (item) => {
    return loginRole === 'e2' && item.approval === 'a0';
};

// 삭제 버튼 표시 조건
// - 기관담당자(e2)만 표시
// - 검토중(a0)인 결과서만 표시
// - 작성자 본인일 때만 표시
const canShowDeleteButton = (item) => {
    return loginRole === 'e2' && item.approval === 'a0' && Number(item.writer_no) === Number(loginUser?.user_no);
};

/* =========================
   결과서 목록 조회
========================= */
// 기관관리자(e3)는 survey 기준 전체 조회
// 기관담당자(e2)도 현재 구조에서는 survey 기준 목록 조회 사용
const loadResultList = async () => {
    try {
        const resp = await fetch(`/api/result/survey/${surveyNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : [];

        list.value = Array.isArray(data) ? data : [];
    } catch (err) {
        console.error('지원결과 조회 에러:', err);
        list.value = [];
    }
};

/* =========================
   지원결과 수정
========================= */
// 수정 버튼 클릭 시 수정용 상세 데이터 조회 후 ResultForm으로 전달
const editResult = async (supportResultNo) => {
    try {
        const loginUser = getLoginUser();
        const loginUserNo = loginUser?.user_no;

        if (!loginUserNo) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        const ok = window.confirm('이 지원결과를 수정하시겠습니까?');
        if (!ok) {
            return;
        }

        const resp = await fetch(`/api/result/detail/${supportResultNo}/${loginUserNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : {};

        if (!resp.ok) {
            alert(data.message || '수정할 지원결과 정보를 불러오지 못했습니다.');
            return;
        }

        window.dispatchEvent(
            new CustomEvent('result-edit-mode', {
                detail: data
            })
        );

        alert('오른쪽 입력폼에 수정할 내용이 불러와졌습니다.');
    } catch (err) {
        console.error('지원결과 수정 데이터 조회 에러:', err);
        alert('수정할 데이터를 불러오는 중 오류가 발생했습니다.');
    }
};

/* =========================
   결과서 수정이력 조회
========================= */
// 수정이력 버튼 클릭 시 실행
const openResultHistory = async (item) => {
    try {
        const resp = await fetch(`/api/result/history/${item.support_result_no}`);
        const text = await resp.text();

        if (!resp.ok) {
            let message = '수정이력 조회에 실패했습니다.';

            try {
                const errorData = text ? JSON.parse(text) : {};
                message = errorData.message || message;
            } catch {
                console.error('지원결과 수정이력 조회 실패 응답:', text);
            }

            alert(message);
            return;
        }

        let data = [];
        try {
            data = text ? JSON.parse(text) : [];
        } catch (parseErr) {
            console.error('지원결과 수정이력 JSON 파싱 실패:', text);
            alert('수정이력 조회 응답 형식이 올바르지 않습니다.');
            return;
        }

        historyData.value = Array.isArray(data) ? data : [];
        historyDialogTitle.value = `지원결과 ${item.support_result_no} 수정이력`;
        historyDialog.value = true;
    } catch (err) {
        console.error('지원결과 수정이력 조회 에러:', err);
        alert('수정이력 조회 중 오류가 발생했습니다.');
    }
};

/* =========================
   결과서 삭제
========================= */
// 검토중(a0)인 결과서 중 작성자 본인만 삭제 가능
const deleteResult = async (supportResultNo) => {
    try {
        const loginUser = getLoginUser();
        const writerNo = loginUser?.user_no;

        if (!writerNo) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        const ok = window.confirm('이 지원결과를 삭제하시겠습니까?');
        if (!ok) {
            return;
        }

        const resp = await fetch(`/api/result/${supportResultNo}/${writerNo}`, {
            method: 'DELETE'
        });

        const text = await resp.text();
        const data = text ? JSON.parse(text) : {};

        if (resp.ok) {
            alert(data.message || '지원결과가 삭제되었습니다.');
            await loadResultList();
        } else {
            alert(data.message || '지원결과 삭제에 실패했습니다.');
        }
    } catch (err) {
        console.error('지원결과 삭제 에러:', err);
        alert('지원결과 삭제 중 오류가 발생했습니다.');
    }
};

/* =========================
   목록 자동 새로고침 이벤트
========================= */
const handleResultListRefresh = async () => {
    await loadResultList();
};

/* =========================
   관리자용 결과서 선택
========================= */
// 관리자 로그인 상태에서는 왼쪽 조회창에서 결과서를 클릭하면
// 오른쪽 승인/반려 처리폼으로 선택한 결과서 정보를 전달
const selectResultForAdmin = (item) => {
    if (loginRole !== 'e3') {
        return;
    }

    window.dispatchEvent(
        new CustomEvent('admin-result-select', {
            detail: item
        })
    );
};

onBeforeMount(async () => {
    await loadResultList();
});

onMounted(() => {
    window.addEventListener('result-list-refresh', handleResultListRefresh);
});

onBeforeUnmount(() => {
    window.removeEventListener('result-list-refresh', handleResultListRefresh);
});
</script>

<template>
    <div class="flex flex-col h-full">
        <!-- 화면 제목 -->
        <div class="font-semibold text-lg mb-4">지원결과 조회</div>

        <!-- 스크롤 영역 -->
        <div class="max-h-[500px] overflow-y-auto pr-2">
            <!-- 데이터 없을 때 -->
            <div v-if="list.length === 0" class="text-center text-gray-500 py-10">등록된 지원결과가 없습니다.</div>

            <!-- 데이터 있을 때 -->
            <div v-else>
                <div v-for="item in list" :key="item.support_result_no" class="mb-6 border rounded-lg p-4 bg-gray-50" :class="{ 'cursor-pointer hover:bg-blue-50': loginRole === 'e3' }" @click="selectResultForAdmin(item)">
                    <!-- =========================
                         상단 정보
                    ========================== -->
                    <div class="flex justify-between items-center mb-3">
                        <div class="font-semibold flex items-center gap-2">
                            <!-- 승인상태 -->
                            <span
                                class="text-xs px-2 py-1 rounded"
                                :class="{
                                    'bg-yellow-100 text-yellow-700': item.approval === 'a0',
                                    'bg-green-100 text-green-700': item.approval === 'a1',
                                    'bg-red-100 text-red-700': item.approval === 'a2'
                                }"
                            >
                                {{ item.approval_name }}
                            </span>

                            <!-- 결과서 번호 -->
                            <div>지원결과 {{ item.support_result_no }}</div>
                        </div>

                        <!-- 작성자 / 작성일 -->
                        <div class="text-sm text-gray-600">작성자 {{ item.name }} &nbsp; 작성일 {{ item.created_at }}</div>
                    </div>

                    <!-- =========================
                         연결된 계획서 번호
                    ========================== -->
                    <div class="border-t border-b py-2 mb-2">
                        <span class="mr-2 font-medium">지원계획</span>
                        <span>지원계획 {{ item.support_plan_no }}</span>
                    </div>

                    <!-- =========================
                         제목
                    ========================== -->
                    <div class="border-b py-2 mb-2">
                        <span class="mr-2 font-medium">제목</span>
                        <span>{{ item.title }}</span>
                    </div>

                    <!-- =========================
                         내용
                    ========================== -->
                    <div class="border-b py-2 mb-2">
                        <span class="mr-2 font-medium">내용</span>
                        <span>{{ item.content }}</span>
                    </div>

                    <!-- =========================
                         종결 여부
                    ========================== -->
                    <div class="border-b py-2 mb-2">
                        <span class="mr-2 font-medium">종결 여부</span>
                        <span>{{ Number(item.finish) === 1 ? '종결' : '미종결' }}</span>
                    </div>

                    <!-- =========================
                         첨부파일
                    ========================== -->
                    <div class="border-b py-2 mb-2">
                        <div class="font-medium mb-1">첨부파일</div>
                        <ResultFileList :support-result-no="item.support_result_no" />
                    </div>

                    <!-- =========================
                         반려사유
                    ========================== -->
                    <div class="py-2" v-if="item.approval === 'a2'">
                        <span class="mr-2 font-medium">반려사유</span>
                        <span>{{ item.rejection_reason }}</span>
                    </div>

                    <!-- =========================
                        수정이력 / 수정 / 삭제 버튼
                        ========================= -->
                    <div class="flex justify-end gap-2 mt-3">
                        <!-- 수정이력 버튼 -->
                        <button type="button" @click.stop="openResultHistory(item)" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded">수정이력</button>

                        <!-- 수정 버튼 -->
                        <button v-if="canShowEditButton(item)" type="button" @click.stop="editResult(item.support_result_no)" class="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1 rounded">수정</button>

                        <!-- 삭제 버튼 -->
                        <button v-if="canShowDeleteButton(item)" type="button" @click.stop="deleteResult(item.support_result_no)" class="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded">삭제</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="historyDialog" :modal="true" :closable="false" :dismissableMask="true" :style="{ width: '50vw' }">
        <template #header>
            <div class="w-full bg-indigo-500 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                <span class="text-lg font-medium">
                    {{ historyDialogTitle }}
                </span>

                <button @click="historyDialog = false" class="text-white text-2xl font-light hover:opacity-70">✕</button>
            </div>
        </template>

        <!-- 내용 -->
        <div v-if="historyData.length === 0" class="text-center py-10 text-gray-400">수정이력 없음</div>

        <div v-else class="px-4 py-6">
            <table class="w-full text-center border-collapse">
                <thead>
                    <tr class="border-t-2 border-b-2 border-gray-400">
                        <th class="py-3">수정날짜</th>
                        <th class="py-3">작성자</th>
                        <th class="py-3">권한</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in historyData" :key="item.history_no || item.support_result_no_record || item.created_at" class="border-b border-gray-400 h-12 hover:bg-gray-50">
                        <td>{{ item.created_at }}</td>
                        <td>{{ item.writer }}</td>
                        <td>{{ item.role }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Dialog>
</template>
