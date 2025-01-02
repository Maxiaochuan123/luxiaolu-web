import Layout from '@/page/index/index.vue';
import Store from '@/store/';
export default [
  {
    path: '/wel',
    component: () =>
      Store.getters.isMacOs ? import('@/mac/index.vue') : import('@/page/index/index.vue'),
    redirect: '/wel/index',
    children: [
      {
        path: 'index',
        name: '首页',
        meta: {
          i18n: 'dashboard',
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/wel/index.vue'),
      },
      {
        path: 'more',
        name: '控制台',
        meta: {
          i18n: 'more',
          menu: false,
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/wel/dashboard.vue'),
      },
    ],
  },
  {
    path: '/iframe',
    component: Layout,
    redirect: '/iframe',
    children: [
      {
        path: '',
        name: '',
        component: () => import(/* webpackChunkName: "views" */ '@/components/iframe/main.vue'),
      },
    ],
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [
      {
        path: 'index',
        name: '个人信息',
        meta: {
          i18n: 'info',
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/user/info.vue'),
      },
    ],
  },
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo/index',
    children: [
      {
        path: 'index',
        name: '演示页面',
        component: () => import('@/views/demo/index.vue'), // 修改为正确的路径，添加.vue后缀
        meta: {
          title: '演示页面',
          icon: 'el-icon-menu',
        },
      },
    ],
  },
  {
    path: '/ai',
    component: Layout,
    redirect: '/ai/robot-management',
    name: 'AI智能中心',
    meta: {
      title: 'AI智能中心',
      icon: 'el-icon-cpu',
    },
    children: [
      {
        path: 'robot-management',
        name: '机器人管理',
        component: () => import('@/views/ai/robot-management/index.vue'),
        meta: {
          title: '机器人管理',
          icon: 'el-icon-robot',
        },
      },
      {
        path: 'robot-management/:id',
        name: 'robot-detail',
        component: () => import('@/views/ai/robot-management/detail/index.vue'),
        meta: {
          title: '机器人详情',
          hidden: true, // 在菜单中隐藏
        },
      },
    ],
  },
];
