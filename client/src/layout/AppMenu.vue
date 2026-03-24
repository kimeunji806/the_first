<script setup>
import { computed } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()


const model = computed(()=>[
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
                to: ['/institutioninfo', '/institutioninfo/edit', '/pages/mypage']
            },
            // 기관관리자로 로그인시 사이드바 추가
            ...(userStore.role === 'e3' ? [{
                label: '담당자 조회',
                icon: 'pi pi-fw pi pi-users',
                to: '/info/manager'
            }] : []),
            ...(userStore.role === 'e3' ? [{
                label: '회원가입 승인',
                icon: 'pi pi-fw pi pi-verified',
                to: '/auth/approval'
            }] : []),
            {
                label: '공지사항',
                icon: 'pi pi-fw pi-bell',
                to: '/'
            },
            
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
