<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
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
                to: ['/institutioninfo', '/institutioninfo/edit']
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
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
