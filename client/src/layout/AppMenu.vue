<script setup>
import { computed } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 권한별 마이페이지 경로 설정
const myPageRouteMap = {
    e1: '/pages/mypage',
    e2: '/institutioninfo',
    e3: '/auth/admin-dash',
    e4: '/pages/guardian'
};

const model = computed(() => {
    // Pinia 스토어에서 권한을 가져오는 것이 가장 정확합니다.
    const currentRole = userStore.role;

    return [
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
                    // 매핑 테이블에서 경로를 찾고, 없으면 기본 마이페이지로 이동
                    to: myPageRouteMap[currentRole] || '/pages/mypage'
                },

                // e3(관리자) 또는 e4(보호자)에게 보여줄 메뉴
                ...(currentRole === 'e3' || currentRole === 'e4'
                    ? [
                          {
                              label: '대상자 통합 조회',
                              icon: 'pi pi-fw pi-search',
                              to: '/info/search'
                          }
                      ]
                    : []),
                // e3(관리자) 전용 메뉴
                ...(currentRole === 'e3'
                    ? [
                          { label: '담당자 조회', icon: 'pi pi-fw pi-users', to: '/info/manager' },
                          { label: '회원가입 승인', icon: 'pi pi-fw pi-verified', to: '/auth/approval' }
                      ]
                    : []),
                {
                    label: '공지사항',
                    icon: 'pi pi-fw pi-bell',
                    to: '/notice'
                }
            ]
        }
    ];
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
