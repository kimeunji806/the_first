<script setup>
import { computed } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 롤별 메뉴 구성
const menuByRole = {
    e1: ['HOME', 'MYPAGE', 'NOTICE'],
    e2: ['HOME', 'MYPAGE', 'NOTICE'],
    e3: ['HOME', 'MYPAGE', 'APPROVAL', 'SEARCH', 'MANAGER', 'NOTICE'],
    e4: ['MYPAGE', 'APPROVAL', 'SEARCH', 'NOTICE']
};

// 메뉴 정의
const MENU = {
    // 지원신청내역(홈)
    HOME: { label: '지원신청내역', to: '/', icon: 'pi pi-fw pi-home' },

    // 마이페이지
    MYPAGE: {
        e1: { label: '마이페이지', to: '/pages/mypage', icon: 'pi pi-fw pi-user' },
        e2: { label: '마이페이지', to: '/institutioninfo', icon: 'pi pi-fw pi-user' },
        e3: { label: '마이페이지', to: '/admin/institutioninfo', icon: 'pi pi-fw pi-user' },
        e4: { label: '마이페이지', to: '/pages/guardian', icon: 'pi pi-fw pi-user' }
    },

    // 관리자/공통 메뉴
    SEARCH: { label: '대상자 통합 조회', to: '/info/search', icon: 'pi pi-fw pi-search' },
    MANAGER: { label: '담당자 조회', to: '/info/manager', icon: 'pi pi-fw pi-users' },
    APPROVAL: { label: '회원가입 승인', to: '/auth/approval', icon: 'pi pi-fw pi-verified' },
    NOTICE: { label: '공지사항', to: '/notice', icon: 'pi pi-fw pi-bell' }
};

const model = computed(() => {
    const role = userStore.role;

    // 해당 권한에 맞는 메뉴 key 배열 가져와서 실제 menu 객체로 변환
    const items = (menuByRole[role] || []).map((key) => {
        // 마이페이지는 롤별로 경로 다르기 때문에 따로 처리
        if (key === 'MYPAGE') {
            return MENU.MYPAGE[role];
        }
        // 나머지는 공통 menu에서 그대로 가져옴
        return MENU[key];
    });

    return [{ items }];
});
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
