<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userRole = ref(localStorage.getItem('role') || 'e1');

const menuByRole = {
    // 일반이용자
    e1: [
        { label: '지원신청내역', to: '/' },
        { label: '마이페이지', to: '/mypage' },
        { label: '지원신청', to: '/apply' },
        { label: '공지사항', to: '/notice' }
    ],
    // 기관담당자
    e2: [
        { label: '지원신청내역', to: '/' },
        { label: '마이페이지', to: '/mypage' },
        { label: '공지사항', to: '/notice' }
    ],
    // 기관관리자
    e3: [
        { label: '지원신청내역', to: '/' },
        { label: '마이페이지', to: '/mypage' },
        { label: '회원가입 승인요청', to: '/approve' },
        { label: '조사지 항목수정', to: '/surveyedit' },
        { label: '공지사항', to: '/notice' }
    ],
    // 시스템관리자
    e4: [
        { label: '기관목록', to: '/InstitutionList' },
        { label: '회원가입 승인요청', to: '/approve' },
        { label: '공지사항', to: '/notice' }
    ]
};

const menus = computed(() => {
    return menuByRole[userRole.value] || [];
});
</script>
<template>
    <ul class="layout-menu">
        <li v-for="menu in menus" :key="menu.label" class="layout-menu-item">
            <router-link :to="menu.to">{{ menu.label }}</router-link>
        </li>
    </ul>
</template>
