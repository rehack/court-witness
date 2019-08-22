import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/infoManage/addClerk.jhtml',
        method: 'GET',
        params
    });
}

export function list (params) {
    return service({
        url: '/court/infoManage/queryClerk.jhtml',
        method: 'GET',
        params
    });
}

export function del (ids) {
    const params = {
        ids: ids
    };
    return service({
        url: '/court/infoManage/deleteClerk.jhtml',
        method: 'GET',
        params
    });
}

export function update (params) {
    return service({
        url: '/court/infoManage/modifyClerk.jhtml',
        method: 'GET',
        params
    });
}
