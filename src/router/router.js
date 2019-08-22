import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/witness/login',
    name: 'login',
    meta: {
        title: '湖里区人民法院 - 登录'
    },
    component: () => import('@/views/login.vue')
};
export const registerRouter = {
    path: '/witness/register',
    name: 'register',
    meta: {
        title: '湖里区人民法院 - 注册'
    },
    component: () => import('@/views/register.vue')
};
export const page404 = {
    path: '/witness/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/witness/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/witness/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/witness/',
    name: 'otherRouter',
    redirect: '/witness/home',
    component: Main,
    children: [
        {
            path: 'home',
            title: '首页',
            name: 'home_index',
            component: () => import('@/views/home/home.vue')
        },
        {
            path: 'lawsuitDetail',
            name: 'lawsuitDetail',
            title: '案件信息',
            component: () => import('@/views/myLawsuit/lawsuitDetail.vue')
        }
        ,
        {
            path: 'myLawcaseInfo',
            name: 'myLawcaseInfo',
            title: '案件办理信息',
            component: () => import('@/views/myLawcase/myLawcaseInfo.vue')
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/witness/myLawsuit',
        name: 'myLawsuit',
        title: '我的诉讼',
        access: ['litigant','lawyer'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '我的诉讼',
                name: 'myLawsuit_index',
                component: () => import('@/views/myLawsuit/myLawsuit.vue')
            }
        ]
    },
    {
        path: '/witness/onlineApplication',
        name: 'onlineApplication',
        title: '在线申请',
        access: ['litigant','lawyer'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '在线申请',
                name: 'onlineApplication_index',
                component: () => import('@/views/onlineApplication/onlineApplication.vue')
            }
        ]
    },
    {
        path: '/witness/myLawcase',
        name: 'myLawcase',
        title: '案件办理',
        access: ['admin', 'judge', 'clerk'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '案件办理',
                name: 'myLawcase_index',
                component: () => import('@/views/myLawcase/myLawcase.vue')
            }
        ]
    },
    {
        path: '/witness/application',
        name: 'application',
        title: '申请处理',
        access: ['admin', 'judge', 'clerk'],
        component: Main,
        children: [
            {
                path: 'index',
                title: '申请处理',
                name: 'application_index',
                component: () => import('@/views/application/application.vue')
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
    page404
];
