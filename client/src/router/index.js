import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';


import counsel_index from '@/router/counsel_index';
import institution_index from '@/router/institution_index';
import mypage_index from '@/router/mypage_index';
import notice_index from '@/router/notice_index';
import plan_index from '@/router/plan_index';
import priority_index from '@/router/priority_index';
import register_index from '@/router/register_index';
import result_index from '@/router/result_index';
import sign_index from '@/router/sign_index';
import survey_index from '@/router/survey_index';

import { useUserStore } from '@/stores/user';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                }
            ]
      },

        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },

        {
            path: '/sign/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        ...sign_index,
        ...counsel_index,
        ...institution_index,
        ...mypage_index,
        ...notice_index,
        ...plan_index,
        ...priority_index,
        ...register_index,
        ...result_index,
        ...survey_index

    ]
});


router.beforeEach((to,from, next) => {
    const userStore = useUserStore()

    //로그인 없이 접근 가능한 페이지
    const publicPages = ['/sign/login', '/sign/register']

    // 로그인 안됨
    if (!userStore.user_no) {
        if (!publicPages.includes(to.path)) {
            return next('/sign/login')
        }
        return next()
    }

    // 승인 안됨
    if (Number(userStore.approval) === 0) {
        if (to.path !== '/sign/access') {
            return next('/sign/access')
        }
        return next()
    }

    // 승인된 유저가 승인대기 접근 막기
    if (Number(userStore.approval) === 1 && to.path === '/sign/access') {
        return next('/') //승인된 사람이 주소에 쳐서 들어갈때 다른곳으로 이동시킬거
    }

    next()
});


export default router;
