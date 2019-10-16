import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/send/login',
    name: 'login',
    meta: {
        title: '湖里区人民法院 - 登录'
    },
    component: () => import('@/views/login.vue')
};
export const registerRouter = {
    path: '/send/register',
    name: 'register',
    meta: {
        title: '湖里区人民法院 - 注册'
    },
    component: () => import('@/views/register.vue')
};
export const page404 = {
    path: '/send/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/send/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/send/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const webPhones = {
    path: '/send/webPhone',
    meta: {
        title: '电话拨打'
    },
    name: 'web-Phone',
    component: () => import('@/components/webPhone/webPhone.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/send/',
    name: 'otherRouter',
    redirect: '/send/home',
    component: Main,
    children: [
        {
            path: '/send/home',
            title: '首页',
            name: 'home_index',
            component: () => import('@/views/home/home.vue')
        },
        {
            path: '/send/ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () => import('@/views/own-space/own-space.vue')
        },
        {
            path: '/send/message',
            title: '消息中心',
            name: 'message_index',
            component: () => import('@/views/message/message.vue')
        },
        {
            path: '/send/send',
            name: 'send',
            title: '送达详情',
            component: () => import('@/diplomas/send/send.vue')
        },
        {
            path: '/send/sendY',
            name: 'sendY',
            title: '送达详情',
            component: () => import('@/diplomas/send/sendY.vue')
        },
        // {
        //     path: '/send/sendDip',
        //     name: 'sendDip',
        //     title: '发送文书',
        //     component: () => import('@/diplomas/send/sendDip.vue')
        // },
        {
            path: '/send/diplomas/dip',
            name: 'dip',
            title: '发送文书',
            component: () => import('@/diplomas/diplomas/dip.vue')
        },
        {
            path: '/send/sendDipY',
            name: 'sendDipY',
            title: '发送文书',
            component: () => import('@/diplomas/send/sendDipY.vue')
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/send/bookbuilding',
        name: 'bookbuilding',
        title: '立案登记',
        access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge' ,'distributiveCommissioner'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '立案登记',
                name: 'bookbuilding_index',
                component: () => import('@/views/bookBuilding/bookbuilding.vue')
            }
        ]
    },
    {
        path: '/send/caseManage',
        name: 'caseManage',
        title: '案件管理',
        access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge','distributiveCommissioner'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '案件分配',
                name: 'caseManage_index',
                component: () => import('@/views/caseManage/caseManage.vue')
            },
            {
                path: 'connection',
                title: '案件关联',
                name: 'courtdate_connection',
                component: () => import('@/views/connection/connection.vue')
            }

        ]
    },
    {
        path: '/send/courtdate',
        name: 'courtdate',
        title: '庭审排期',
        access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge','distributiveCommissioner'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '庭审排期',
                name: 'courtdate_index',
                component: () => import('@/views/courtDate/courtdate.vue')
            },
            {
                path: 'check',
                title: '排期确认',
                name: 'courtdate_check',
                component: () => import('@/views/courtDate/datecheck.vue')
            },

            {
                path: 'lock',
                title: '日期锁定',
                name: 'courtdate_lock',
                component: () => import('@/views/courtDate/datelock.vue')
            },
            {
                path: 'calendar',
                title: '开庭日历',
                name: 'calendar',
                component: () => import('@/views/courtDate/calendar.vue')
            },
            {
                path: 'ruleTable',
                title: '排班规则表',
                name: 'ruleTable',
                component: () => import('@/views/courtDate/ruleTable.vue')
            },
            {
                path: 'phoneNotify',
                title: '电话通知',
                name: 'phoneNotify',
                component: () => import('@/views/courtDate/phoneNotify.vue')
            },
            {
                path: 'callRecord',
                title: '电话通知记录',
                name: 'callRecord',
                component: () => import('@/views/callRecord/callRecord.vue')
            }
        ]
    },
    {
        path: '/send/diplomas',
        name: 'diplomas',
        title: '文书管理',
        access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge','distributiveCommissioner'],
        component: Main,
        children: [

            {
                path: 'sendM',
                name: 'sendM',
                title: '文书送达管理',
                component: () => import('@/diplomas/send/sendM.vue')
            },
            {
                path: 'SMS',
                name: 'SMS',
                title: '短信通知记录',
                component: () => import('@/diplomas/message/SMS.vue')
            },
            {
                path: 'batch',
                name: 'batch',
                title: '文书批量管理',
                component: () => import('@/diplomas/diplomas/batch.vue')
            },
            {
                path: 'emsHandover',
                name: 'emsHandover',
                title: '邮件交接单',
                component: () => import('@/diplomas/diplomas/emsHandover.vue')
            },
            {
                path: 'account',
                name: 'account',
                title: '个人页台账',
                component: () => import('@/diplomas/diplomas/account.vue')
            },
            {
                path: 'diplomsMap',
                name: 'diplomsMap',
                title: '文书地图',
                component: () => import('@/diplomas/diplomas/diplomsMap.vue')
            }
        ]
    },
    {
        path: '/send/notice',
        title: '公告送达管理',
        name: 'notice',
        access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge','distributiveCommissioner'],
        component: Main,
        children: [
            {
                path: 'noticeM',
                title: '公告管理',
                name: 'noticeM',
                component: () => import('@/notice/noticeM.vue')
            }
        ]
    },
    {
        path: '/send/information',
        name: 'information',
        title: '信息管理',
        access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge','distributiveCommissioner'],
        component: Main,
        children: [
            {
                path: 'caseInfo',
                name: 'caseInfo',
                title: '案件信息库',
                component: () => import('@/information/caseInfo/caseInfo.vue')
            },
            {
                path: 'judgeInfo',
                name: 'judgeInfo',
                title: '法官信息库',
                component: () => import('@/information/judgeInfo/judgeInfo.vue')
            },
            {
                path: 'nationWideCourtInfo',
                title: '法院信息库',
                name: 'nationWideCourtInfo',
                component: () => import('@/information/courtInfo/nationWideCourtInfo.vue')
            },
            
            {
                path: 'clerkInfo',
                name: 'clerkInfo',
                title: '书记员信息库',
                component: () => import('@/information/clerkInfo/clerkInfo.vue')
            },
            {
                path: 'litigantInfo',
                name: 'litigantInfo',
                title: '当事人信息库',
                component: () => import('@/information/litigantInfo/litigantInfo.vue')
            },
            {
                path: 'serviceInfo',
                name: 'serviceInfo',
                title: '送达专员信息库',
                component: () => import('@/information/serviceInfo/serviceInfo.vue')
            },
            {
                path: 'staffInfo',
                name: 'staffInfo',
                title: '工作人员信息库',
                component: () => import('@/information/staffInfo/staffInfo.vue')
            },
            {
                path: 'tribunalInfo',
                name: 'tribunalInfo',
                title: '审判庭信息库',
                component: () =>
                    import('@/information/tribunalInfo/tribunalInfo.vue')
            },
            // {
            //     path: 'caseInfo',
            //     name: 'caseInfo',
            //     title: '案件信息库',
            //     component: () => import('@/information/caseInfo/caseInfo.vue')
            // },
            {
                path: 'evidence',
                name: 'evidence',
                title: '证据信息库',
                component: () => import('@/views/evidence/evidence.vue')
            },
            {
                path: 'templateM',
                title: '模板管理',
                name: 'templateM',
                component: () => import('@/information/template/templateM.vue')
            },
            {
                path: 'courtInfo',
                name: 'courtInfo',
                title: '全国法院信息库',
                component: () => import('@/information/courtInfo/courtInfo.vue')
            },
            // {
            //     path: 'access',
            //     name: 'access',
            //     title: '全国法院信息库',
            //     component: () => import('@/views/access/access.vue')
            // }
        ]
    },
    // {
    //     path: '/send/caseInfo',
    //     name: 'caseInfo',
    //     title: '案件卷宗',
    //     access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge'],
    //     component: Main,
    //     children: [
    //         {
    //             path: 'index',
    //             title: '案件卷宗',
    //             name: 'caseInfo_index',
    //             component: () => import('@/information/caseInfo/caseInfo.vue')
    //         }
    //     ]
    // },
    {
        path: '/send/archive',
        name: 'archive',
        title: '电子卷宗',
        access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge','distributiveCommissioner'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '电子卷宗',
                name: 'archive_index',
                component: () => import('@/views/archive/archive.vue')
            }
        ]
    },
    {
        path: '/send/step',
        name: 'step',
        title: '案件时间轴',
        access: ['admin', 'judge', 'clerk', 'servicePersonnel', 'dqJudge','distributiveCommissioner'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '案件时间轴',
                name: 'step_index',
                component: () => import('@/views/step/step.vue')
            }
        ]
    },
    {
        path: '/send/finaceCase',
        name: 'finaceCase',
        title: '诉前案件',
        access: ['dqJudge'],
        component: Main,
        children: [
            {
                path: 'finaceCase',
                title: '诉前案件管理',
                name: 'finaceCase_index',
                component: () => import('@/views/financeCase/finaceCase2.vue')
            },
            {
                path: 'emsRecord',
                title: 'EMS记录查询',
                name: 'emsRecord',
                component: () => import('@/views/financeCase/emsRecord.vue')
            },
            {
                path: 'timeStatistics',
                title: '时间统计',
                name: 'timeStatistics',
                component: () => import('@/views/financeCase/timeStatistics.vue')
            },
        ]
    },
    {
        path: '/send/sys',
        name: 'sys',
        title: '系统管理',
        access: ['dqJudge'],
        component: Main,
        children: [
            {
                path: 'menuManage',
                title: '菜单权限管理',
                name: 'menuManage_index',
                component: () => import('@/views/sys/menu-manage/menuManage.vue')
            },
            {
                path: 'roleManage',
                title: '角色权限管理',
                name: 'roleManage_index',
                component: () => import('@/views/sys/role-manage/roleManage.vue')
            },
            {
                path: 'userManage',
                title: '工作人员管理',
                name: 'userManage_index',
                component: () => import('@/views/sys/user-manage/userManage.vue')
            }
        ]
    },
    {
        path: '/send/litigantCaseInfo',
        name: 'litigantCaseInfo',
        title: '案件进展查询',
        access: ['litigant','lawyer'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '案件进展查询',
                name: 'litigantCaseInfo_index',
                component: () => import('@/views/litigant/litigantCaseInfo.vue')
            }
        ]
    },
    {
        path: '/send/litigantEvidence',
        name: 'litigantEvidence',
        title: '在线提交材料',
        access: ['litigant','lawyer'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '在线提交材料',
                name: 'litigantEvidence_index',
                component: () => import('@/views/litigant/litigantEvidence.vue')
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    registerRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404,
];
