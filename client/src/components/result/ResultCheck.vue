<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import ResultFileList from '@/components/result/ResultFileList.vue';

/* =========================
   기본 상태
========================= */
// 현재 라우트에서 survey 번호를 가져옴
const route = useRoute();
const surveyNo = Number(route.params.no);

// 결과서 목록 저장용 변수
const list = ref([]);

/* =========================
   공통 함수
========================= */
// localStorage에 저장된 로그인 사용자 정보 가져오기
const getLoginUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

/* =========================
   승인된 지원계획 목록 조회
========================= */
// 결과서 작성/조회 대상이 되는 승인된 계획서 목록 조회
const loadApprovedPlanList = async () => {
    try {
        const resp = await fetch(`/api/result/approved-plan-list/${surveyNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : [];

        if (resp.ok) {
            approvedPlanList.value = Array.isArray(data) ? data : [];

            // 아직 선택된 계획이 없으면 첫 번째 승인계획 자동 선택
            if (!selectedPlanNo.value && approvedPlanList.value.length > 0) {
                selectedPlanNo.value = String(approvedPlanList.value[0].support_plan_no);
            }
        } else {
            approvedPlanList.value = [];
            console.error('승인된 지원계획 목록 조회 실패:', data.message);
        }
    } catch (err) {
        console.error('승인된 지원계획 목록 조회 에러:', err);
        approvedPlanList.value = [];
    }
};

/* =========================
   결과서 목록 조회
========================= */
// 현재 선택한 지원계획 번호 기준으로 결과서 목록 조회
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
   결과서 수정
========================= */
// 수정 버튼 클릭 시 수정용 상세 데이터 조회 후 ResultForm으로 전달
const editResult = async (supportResultNo) => {
    try {
        const loginUser = getLoginUser();
        const writerNo = loginUser?.user_no;

        if (!writerNo) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        const ok = window.confirm('이 지원결과를 수정하시겠습니까?');
        if (!ok) {
            return;
        }

        const resp = await fetch(`/api/result/detail/${supportResultNo}/${writerNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : {};

        if (!resp.ok) {
            alert(data.message || '수정할 지원결과 정보를 불러오지 못했습니다.');
            return;
        }

        // ResultForm.vue에서 받을 수 있도록 커스텀 이벤트 발생
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
   결과서 삭제
========================= */
// 검토중(a0)인 결과서만 삭제
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
// ResultForm.vue에서 저장/수정 후 발생시키는 이벤트를 받으면 목록 재조회
const handleResultListRefresh = async () => {
    await loadResultList();
};

/* =========================
   라이프사이클
========================= */
onBeforeMount(async () => {
    await loadResultList();
});

onMounted(() => {
    window.addEventListener('result-list-refresh', handleResultListRefresh);
});

onBeforeUnmount(() => {
    window.removeEventListener('result-list-refresh', handleResultListRefresh);
});

/* =========================
   watch 역할 대체용
========================= */
// select change에서 직접 호출
const changePlan = async () => {
    await loadResultList();
};
</script>

<template>
    <div class="p-4 bg-white h-full rounded-lg">
        <!-- 화면 제목 -->
        <div class="font-semibold text-lg mb-4">지원결과 조회</div>

        <!-- 스크롤 영역 -->
        <div class="max-h-[700px] overflow-y-auto pr-2">
            <!-- 데이터 없을 때 -->
            <div v-if="list.length === 0" class="text-center text-gray-500 py-10">등록된 지원결과가 없습니다.</div>

            <!-- 데이터 있을 때 -->
            <div v-else>
                <div v-for="item in list" :key="item.support_result_no" class="mb-6 border rounded-lg p-4 bg-gray-50">
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
                         수정 / 삭제 버튼
                    ========================== -->
                    <!-- 검토중(a0)인 결과서만 수정/삭제 가능 -->
                    <div v-if="item.approval === 'a0'" class="flex justify-end gap-2 mt-3">
                        <button type="button" @click.stop="editResult(item.support_result_no)" class="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1 rounded">수정</button>

                        <button type="button" @click.stop="deleteResult(item.support_result_no)" class="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded">삭제</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
