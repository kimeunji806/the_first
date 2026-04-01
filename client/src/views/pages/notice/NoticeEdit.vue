<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const noticeNo = route.params.noticeNo;

const notice = ref({
    notice_title: '',
    notice_content: '',
    user_name: '',
    created_at: '',
    files: []
});

// 날짜포맷
const dateFormat = (dateVal) => {
    let newDate = new Date(dateVal);
    let year = newDate.getFullYear();
    let month = ('0' + (newDate.getMonth() + 1)).slice(-2);
    let day = ('0' + newDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};

// 공지사항 상세조회
const getNoticeDetail = async () => {
    try {
        const res = await fetch(`/api/notice/detail/${noticeNo}`);
        const data = await res.json();

        notice.value = {
            ...data,
            files: data.files || []
        };
    } catch (err) {
        console.log(err);
    }
};

// 공지사항 수정
const updateNotice = async () => {
    if (!notice.value.notice_title || !notice.value.notice_content) {
        alert('제목과 내용을 입력해주세요.');
        return;
    }
    try {
        const res = await fetch(`/api/notice/detail/${noticeNo}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                notice_title: notice.value.notice_title,
                notice_content: notice.value.notice_content,
                user_no: userStore.user_no
            })
        });
        const data = await res.json();

        if (data.result?.status || data.status) {
            alert('공지사항이 수정되었습니다.');
            goToDetail();
        } else {
            alert('공지사항 수정에 실패했습니다.');
        }
    } catch (err) {
        console.log(err);
    }
};

// 상세조회로 돌아가기
const goToDetail = () => {
    router.push(`/notice/info/${noticeNo}`);
};

onMounted(() => {
    getNoticeDetail();
});
</script>
<template>
    <div class="card border-none bg-transparent p-0">
        <div class="text-xl font-bold mb-4 ml-1">글 수정하기</div>
        <div class="flex mb-3">
            <div class="label-box">제목</div>
            <div class="flex-1">
                <InputText v-model="notice.notice_title" class="w-full h-full border-round-md" placeholder="제목을 입력하세요" />
            </div>
        </div>
        <div class="flex mb-3">
            <div class="label-box">작성자</div>
            <div class="flex-1 p-3 border-1 surface-border border-round-md bg-gray-100 text-gray-600">
                {{ notice.user_name }}
            </div>
        </div>
        <div class="flex mb-3">
            <div class="label-box">작성일</div>
            <div class="flex-1 p-3 border-1 surface-border border-round-md bg-gray-100 text-gray-600">
                {{ dateFormat(notice.created_at) }}
            </div>
        </div>
        <div class="flex mb-3">
            <div class="label-box">공지내용</div>
            <div class="flex-1">
                <Textarea v-model="notice.notice_content" rows="10" class="w-full border-round-md block" style="resize: none" placeholder="내용을 입력하세요" />
            </div>
        </div>
        <div class="flex mb-4">
            <div class="label-box">첨부파일</div>
            <div class="flex-1 p-3 border-1 surface-border border-round-md bg-white">
                <div v-if="notice.files.length > 0" class="flex flex-wrap align-items-center gap-2">
                    <span class="text-sm font-bold text-green-500 mr-2 flex align-items-center">
                        <i class="pi pi-paperclip mr-1"></i>
                        총 {{ notice.files.length }}개 파일
                    </span>
                    <div v-for="file in notice.files" :key="file.file_no" class="flex align-items-center bg-white border-1 surface-border border-round-md px-3 py-2 text-sm shadow-sm">
                        <span>{{ file.file_name }}</span>
                    </div>
                </div>
                <div v-else class="text-sm text-gray-400">첨부파일 없음</div>
            </div>
        </div>
        <div class="flex justify-end mt-3 gap-2">
            <Button label="취소" class="p-button-secondary px-5 py-2 font-bold" @click="goToDetail" />
            <Button label="수정완료" class="p-button-success px-5 py-2 font-bold" @click="updateNotice" />
        </div>
    </div>
</template>

<style scoped>
.label-box {
    width: 120px;
    min-width: 120px;
    max-width: 120px;
    margin-right: 12px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-weight: 600;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
