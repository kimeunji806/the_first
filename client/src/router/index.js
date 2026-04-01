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
import common_index from '@/router/common_index';

import { useUserStore } from '@/stores/user';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...sign_index,
        {
            path: '/',
            component: AppLayout,
            children: [...common_index, ...counsel_index, ...institution_index, ...mypage_index, ...notice_index, ...plan_index, ...priority_index, ...register_index, ...result_index, ...survey_index]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    //로그인 없이 접근 가능한 페이지
    const publicPages = ['/sign/login', '/sign/register', '/sign/find-password', '/sign/reset-password'];

    // 로그인 안됨
    if (!userStore.user_no) {
        if (!publicPages.includes(to.path)) {
            return next('/sign/login');
        }
        return next();
    }

    // 승인 안됨
    if (userStore.approval === 0) {
        if (to.path !== '/sign/access') {
            if (to.path == '/sign/login' || to.path == '/sign/register') {
                return next();
            }
            return next('/sign/access');
        }
        return next();
    }
    //관리자가 아닌데 회원가입 승인 페이지 갈때
    if (userStore.role !== 'e3' && to.path === '/auth/approval') {
        return next('/'); // 이 루트가 회원가입으로 되어있음 나중에 페이지 만들면 경로 수정
    }

    // 승인된 유저가 승인대기 접근 막기
    if (userStore.approval === 1 && to.path === '/sign/access') {
        return next('/'); //승인된 사람이 주소에 쳐서 들어갈때 다른곳으로 이동시킬거
        // 이 루트가 회원가입으로 되어있음 나중에 페이지 만들면 경로 수정
    }

    // 롤별 페이지 접근 제한
    const requiredRoles = to.matched.find((record) => record.meta.roles)?.meta.roles;

    if (requiredRoles && !requiredRoles.includes(userStore.role)) {
        alert('접근 권한이 없습니다.');
        return next('/');
    }

    next();
});

export default router;
