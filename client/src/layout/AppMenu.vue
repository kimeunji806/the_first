<script setup>
import { computed } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

// localStorage에서 로그인 사용자 정보 가져오기
const loginUser = JSON.parse(localStorage.getItem('user'));

// 사용자 권한 코드
const userRole = loginUser?.role || null;

// 권한별 마이페이지 경로
const myPageRouteMap = {
    e1: '/pages/mypage', // 일반사용자
    e2: '/mypage/institution', // 기관담당자
    e3: '/institutioninfo', // 기관관리자
    e4: '/admin/mypage' // 시스템관리자
};

// 메뉴 목록
const model = computed(() => [
    {
        items: [
            {
                label: '지원신청내역',
                icon: 'pi pi-fw pi-home',
                to: '/'
            },
            {
                label: '마이페이지',
                icon: 'pi pi-fw pi-user',

                // 현재 권한에 맞는 경로 사용
                // 없으면 기본값으로 일반사용자 마이페이지
                to: myPageRouteMap[userRole] || '/pages/mypage'
            },
            {
                label: '공지사항',
                icon: 'pi pi-fw pi-bell',
                to: '/notice'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="i">
            <template v-if="!item.separator">
                <AppMenuItem :item="item" :index="i" />
            </template>
            <li v-else class="menu-separator"></li>
        </template>
    </ul>
</template>
