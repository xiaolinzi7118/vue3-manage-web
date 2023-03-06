import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import storage from './../utils/storage'
import API from './../api'
import utils from './../utils/utils'

const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Home,
        redirect: '/welcome',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                meta: {
                    title: '欢迎'
                },
                component: () => import('@/views/Welcome.vue')
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录'
        },
        component: () => import('@/views/Login.vue')
    },
    {
        name: '404',
        path: '/404',
        meta: {
            title: '页面不存在'
        },
        component: () => import('@/views/404.vue')
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 修复线上部署不能访问问题
async function loadAsyncRoutes() {
    let userInfo = storage.getItem('userInfo') || {}
    if (userInfo.token) {
        try {
            const { menuList } = await API.getPermissionList()
            let routes = utils.generateRoute(menuList)
            // vite glob从文件系统动态导入多个模块
            const modules = import.meta.glob('../views/*.vue')
            console.log('views',modules)
            routes.map(route => {
                let url = `../views/${route.name}.vue`
                route.component = modules[url];
                router.addRoute("home", route);
            })
        } catch (error) {

        }
    }
}
// 登录进来会执行一次
loadAsyncRoutes();

// 判断当前地址是否可以访问
/*
function checkPermission(path) {
    let hasPermission = router.getRoutes().filter(route => route.path == path).length;
    if (hasPermission) {
        return true;
    } else {
        return false;
    }
}
*/

// 导航守卫 路由变化了都会执行一次
router.beforeEach(async (to, from, next) => {
    if (to.name) {
        // checkPermission(to.path)
        if (router.hasRoute(to.name)) {
            document.title = to.meta.title;
            next()
        } else {
            next('/404')
        }
    } else {
        // 刷新浏览器页面情况
        await loadAsyncRoutes()
        let curRoute = router.getRoutes().filter(item => item.path == to.path)
        if (curRoute?.length) {
            document.title = curRoute[0].meta.title;
            next({ ...to, replace: true })
        } else {
            next('/404')
        }
    }
})

export default router