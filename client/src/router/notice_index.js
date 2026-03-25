export default [
    {
        path: '/notice',
        name: 'notice',
        component: () => import('@/views/pages/notice/notice.vue')
    },
    {
        path: '/notice/info',
        name: 'notice_info',
        component: () => import('@/views/pages/notice/NoticeInfo.vue')
    },
    {
        path: '/notice/add',
        name: 'notice_add',
        component: () => import('@/views/pages/notice/noticeAdd.vue')
    },
    {
        path: '/notice/edit',
        name: 'notice_edit',
        component: () => import('@/views/pages/notice/NoticeEdit.vue')
    },
    {
        path: '/notice/del',
        name: 'notice_del',
        component: () => import('@/views/pages/notice/NoticeDel.vue')
    }
];
