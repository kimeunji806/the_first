<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import PlanFileList from '@/components/plan/PlanFileList.vue';

/* =========================
   기본 상태
========================= */
// 현재 라우트에서 survey 번호를 가져옴
const route = useRoute();
const surveyNo = Number(route.params.no);

// 지원계획 목록 저장용 변수
const list = ref([]);

/* =========================
   공통 함수
========================= */
// localStorage에 저장된 로그인 사용자 정보 가져오기
const getLoginUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

/* =========================
   지원계획 목록 조회
========================= */
// 현재 surveyNo에 해당하는 지원계획 목록을 서버에서 가져옴
const loadPlanList = async () => {
    try {
        const resp = await fetch(`/api/plan/${surveyNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : [];

        // 배열이면 그대로, 단건 객체면 배열로 감싸서 처리
        list.value = Array.isArray(data) ? data : [data];
    } catch (err) {
        console.error('지원계획 조회 에러:', err);
        list.value = [];
    }
};
const loginUser = JSON.parse(localStorage.getItem('user'));
const loginRole = loginUser?.role;
/* =========================
   목록 자동 새로고침 이벤트
========================= */
// PlanForm.vue에서 수정/삭제/저장 후 발생시키는 이벤트를 받으면 목록 재조회
const handlePlanListRefresh = async () => {
    await loadPlanList();
};
/* =========================
   지원계획 수정
========================= */
// 수정 버튼 클릭 시 수정용 상세 데이터 조회 후 PlanForm으로 전달
const editPlan = async (supportPlanNo) => {
    try {
        const loginUser = getLoginUser();
        const writerNo = loginUser?.user_no;

        if (!writerNo) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        const ok = window.confirm('이 지원계획을 수정하시겠습니까?');
        if (!ok) {
            return;
        }

        const resp = await fetch(`/api/plan/detail/${supportPlanNo}/${writerNo}`);
        const text = await resp.text();
        const data = text ? JSON.parse(text) : {};

        if (!resp.ok) {
            alert(data.message || '수정할 지원계획 정보를 불러오지 못했습니다.');
            return;
        }

        // PlanForm.vue에서 받을 수 있도록 window 커스텀 이벤트 발생
        window.dispatchEvent(
            new CustomEvent('plan-edit-mode', {
                detail: data
            })
        );

        alert('오른쪽 입력폼에 수정할 내용이 불러와졌습니다.');
    } catch (err) {
        console.error('지원계획 수정 데이터 조회 에러:', err);
        alert('수정할 데이터를 불러오는 중 오류가 발생했습니다.');
    }
};

/* =========================
   지원계획 삭제
========================= */
// 검토중(a0)인 계획서만 삭제
const deletePlan = async (supportPlanNo) => {
    try {
        const loginUser = getLoginUser();
        const writerNo = loginUser?.user_no;

        if (!writerNo) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        const ok = window.confirm('이 지원계획을 삭제하시겠습니까?');
        if (!ok) {
            return;
        }

        const resp = await fetch(`/api/plan/${supportPlanNo}/${writerNo}`, {
            method: 'DELETE'
        });

        const text = await resp.text();
        const data = text ? JSON.parse(text) : {};

        if (resp.ok) {
            alert(data.message || '지원계획이 삭제되었습니다.');
            await loadPlanList();
        } else {
            alert(data.message || '지원계획 삭제에 실패했습니다.');
        }
    } catch (err) {
        console.error('지원계획 삭제 에러:', err);
        alert('지원계획 삭제 중 오류가 발생했습니다.');
    }
};
/* =========================
   관리자용 계획서 선택
========================= */
// 관리자 로그인 상태에서는 왼쪽 조회창에서 계획서를 클릭하면
// 오른쪽 승인/반려 처리폼으로 선택한 계획서 정보를 전달
const selectPlanForAdmin = (item) => {
    if (loginRole !== 'e3') {
        return;
    }

    window.dispatchEvent(
        new CustomEvent('admin-plan-select', {
            detail: item
        })
    );
};

// 화면이 열릴 때 목록 조회
onBeforeMount(() => {
    loadPlanList();
});
onMounted(() => {
    window.addEventListener('plan-list-refresh', handlePlanListRefresh);
});

onBeforeUnmount(() => {
    window.removeEventListener('plan-list-refresh', handlePlanListRefresh);
});
</script>

<template>
    <!-- 조회영역 전체 -->
    <div class="p-4 bg-white h-full rounded-lg">
        <!-- 화면 제목 -->
        <div class="font-semibold text-lg mb-4">지원계획 조회</div>

        <!-- 스크롤 영역 -->
        <div class="max-h-[700px] overflow-y-auto pr-2">
            <!-- 데이터 없을 때 -->
            <div v-if="list.length === 0" class="text-center text-gray-500 py-10">등록된 지원계획이 없습니다.</div>

            <!-- 데이터 있을 때 -->
            <div v-else>
                <!-- 지원계획 목록 반복 출력 -->
                <div v-for="(item, index) in list" :key="item.support_plan_no || index" class="mb-6 border rounded-lg p-4 bg-gray-50" :class="{ 'cursor-pointer hover:bg-blue-50': loginRole === 'e3' }" @click="selectPlanForAdmin(item)">
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

                            <!-- 지원계획 번호 -->
                            <div>지원계획 {{ item.support_plan_no }}</div>
                        </div>

                        <!-- 작성자 / 작성일 -->
                        <div class="text-sm text-gray-600">작성자 {{ item.name }} &nbsp; 작성일 {{ item.created_at }}</div>
                    </div>

                    <!-- =========================
                         제목
                    ========================== -->
                    <div class="border-t border-b py-2 mb-2">
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
                         첨부파일
                    ========================== -->
                    <div class="border-b py-2 mb-2">
                        <div class="font-medium mb-1">첨부파일</div>

                        <!-- support_plan_no 기준으로 파일 목록 조회/다운로드 -->
                        <PlanFileList :support-plan-no="item.support_plan_no" />
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
                    <!-- 검토중(a0)인 계획서만 수정/삭제 가능 -->
                    <div v-if="item.approval === 'a0'" class="flex justify-end gap-2 mt-3">
                        <button type="button" @click.stop="editPlan(item.support_plan_no)" class="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1 rounded">수정</button>

                        <button type="button" @click.stop="deletePlan(item.support_plan_no)" class="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded">삭제</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
