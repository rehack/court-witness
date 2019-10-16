import axios from 'axios';
// import env from '../../build/env';
// import semver from 'semver';
// import packjson from '../../package.json';
import Cookies from "js-cookie";
import lazyLoading from './lazyLoading.js';
import {
    getMenuList,
    getUserInfo1
   } from "@/api/sysIndex.js";

let util = {

};
util.title = function (title) {
    title = title || '易送达管理平台';
    window.document.title = title;
};

// const ajaxUrl = env === 'development'
//     ? 'http://127.0.0.1:8888'
//     : env === 'production'
//         ? 'https://www.url.com'http://dq.hlcourt.gov.cn
//         : 'http://court.ptnetwork001.com';

util.ajax = axios.create({
    baseURL: '/api',
    timeout: 50000
});

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.initRouter = function (vm) {
    const constRoutes = [];
    const otherRoutes = [];
    //判断是否登录
    let roleType = '';
    axios.get(getUserInfo1,{}).then(ress => {
        console.log(ress.data)
        if(ress.data.state == 100){
            console.log(9898)
            roleType = ress.data.roleId;
            // 加载菜单
            // 404路由需要和动态路由一起注入
            const otherRouter = [{
                path: '/*',
                name: 'error-404',
                meta: {
                    title: '404-页面不存在'
                },
                component: 'error-page/404'
            }];
            axios.get(getMenuList, 
                // {params:{'roleId': roleIdToken}}
                {headers: {'roleId': roleType,
            'platform':'court'}}
            ).then(res => {
                if(res.data.state == 100){

                    let menuLi = [];
                    if(res.data.roleMenus == [] || res.data.roleMenus.length == 0){
                        vm.$Message.warning({
                            content: '暂无权限',
                            duration: 2
                        });
                        
                        setTimeout(function(){ 
                            vm.$store.commit("logout", vm);
                            vm.$store.commit("clearOpenedSubmenu");
                            vm.$store.dispatch("Logout").then(res => {
                            vm.$router.push({
                                name: "login"
                                });
                            });
                        }, 2000);
                        return false;
                    }
                    res.data.roleMenus.map(item => {
                        // item.children = [];
                        item.title = item.title ? item.title : '无';
                        // item.component = 'views/bookBuilding/bookbuilding';
                    })
                        res.data.roleMenus.sort(util.compare('orderNumber'))
                        menuLi = util.pushChildren(res.data.roleMenus,"");
                        let menuLis = menuLi[0].children;
                        util.initRouterNode(constRoutes, menuLi[0].children);
                        util.initRouterNode(otherRoutes, otherRouter);
                        // 添加主界面路由
                        vm.$store.commit('updateAppRouter', constRoutes.filter(item => item.children.length > 0));
                        // 添加全局路由
                        vm.$store.commit('updateDefaultRouter', otherRoutes);
                        // 刷新界面菜单
                        // vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children.length > 0));
                        vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children.length > 0));

                        let tagsList = [];
                        vm.$store.state.app.routers.map((item) => {
                            if (item.children.length <= 1) {
                                tagsList.push(item.children[0]);
                            } else {
                                tagsList.push(...item.children);
                            }
                        });
                        vm.$store.commit('setTagsList', tagsList);
                        console.log(vm.$store.state.app.menuList)
                }
                
            });
        }else{
            vm.$Message.warning({
                content: '请登录',
                duration: 2
            });
            
            setTimeout(function(){ 
                vm.$store.commit("logout", vm);
                vm.$store.commit("clearOpenedSubmenu");
                vm.$store.dispatch("Logout").then(res => {
                vm.$router.push({
                    name: "login"
                    });
                });
             }, 2000);
            return false;
        }
    }) 
};
// 生成路由节点
util.initRouterNode = function (routers, data) {
    for (var item of data) {
        let menu = Object.assign({}, item);
        // menu.component = import(`@/views/${menu.component}.vue`);
        // menu.component = lazyLoading(menu.component);
        menu.component = lazyLoading('views/Main');

        if (item.children && item.children.length > 0) {
            menu.children = [];
            util.initRouterNode(menu.children, item.children);
        }
        // else{
           
        //     menu.children = [];
        //     let obj = {
        //         title:menu.title,
        //         path:'index',
        //         name:menu.name + '_index' ,
        //         // + '_index'
        //         component:lazyLoading(menu.component),
        //         // component:lazyLoading('views/bookBuilding/bookbuilding'),
        //     }
        //     menu.children.push(obj)
            
        // }

        let meta = {};
        // 给页面添加权限、标题、第三方网页链接
        meta.permTypes = menu.permTypes ? menu.permTypes : null;
        meta.title = menu.title ? menu.title + " 易送达" : null;
        meta.url = menu.url ? menu.url : null;
        menu.meta = meta;
        routers.push(menu);
    }
};
util.pushChildren = function (data,parent) {
    let vm = this;
    var tree = [];
    var temp;
    for (var i = 0; i < data.length; i++) {
        
        // if(data[i].fatherCode = ''){
        //     data[i].fatherCode = null;
        // }
        if (data[i].fatherCode == parent) {

            var obj = data[i];
            temp = vm.pushChildren(data, data[i].code);
            if (temp.length > 0) {
                obj.children = temp;
            }
            tree.push(obj);
        }
    }
    return tree;
}
util.compare = function(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
};


export default util;
