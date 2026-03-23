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
const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...sign_index,
        {
            path: '/',
            component: AppLayout,
            children: [...counsel_index, ...institution_index, ...mypage_index, ...notice_index, ...plan_index, ...priority_index, ...register_index, ...result_index, ...survey_index]
        }
    ]
});

export default router;
