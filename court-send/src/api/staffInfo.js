import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/infoManage/addStaff.jhtml',
        method: 'GET',
        params
    });
}

export function list (params) {
    return service({
        url: '/court/infoManage/queryStaff.jhtml',
        method: 'GET',
        params
    });
}

export function del (ids) {
    const params = {
        ids: ids
    };
    return service({
        url: '/court/infoManage/deleteStaff.jhtml',
        method: 'GET',
        params
    });
}

export function update (params) {
    return service({
        url: '/court/infoManage/modifyStaff.jhtml',
        method: 'GET',
        params
    });
}
