import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import store from '@/store';
import Cookies from 'js-cookie';
import {
    routers,
    otherRouter,
    appRouter
} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: routers
};

let hasGetUserInfo = false

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    console.log(8787)
    store.dispatch('GetUserInfo').then(res => {
        if (res.data.state == 101 && !hasGetUserInfo) {
            console.log(1112)
            next({
                name: 'login'
            });
            hasGetUserInfo = true
        } else {
            Util.title(to.meta.title);
            if(res.data.state == 100 ){
                if(res.data.court){
                    store.commit('setCourtName',res.data.court.name)
                }
                
            }
            
            if (to.name == 'register') {
                next()
                return false;
            }
            if (Cookies.get('locking') === '1' && to.name !== 'locking') {
                // 判断当前是否是锁定状态
                next({
                    replace: true,
                    name: 'locking'
                });
            } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
                next(false);
            } else {
                if (!Cookies.get('user') && to.name !== 'login') {
                    // 判断是否已经登录且前往的页面不是登录页
                    next({
                        name: 'login'
                    });
                } else if (Cookies.get('user') && to.name === 'login') {
                    // 判断是否已经登录且前往的是登录页
                    Util.title();
                    next({
                        name: 'home_index'
                    });
                } else {
                    Util.toDefaultPage([...routers], to.name, router, next);
                }
            }
        }
    })
});

router.afterEach(to => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
