import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/infoManage/addLitigant.jhtml',
        method: 'GET',
        params
    });
}

export function list (params) {
    return service({
        url: '/court/infoManage/queryLitigant.jhtml',
        method: 'GET',
        params
    });
}

export function del (ids) {
    const params = {
        ids: ids
    };
    return service({
        url: '/court/infoManage/deleteLitigant.jhtml',
        method: 'GET',
        params
    });
}

export function update (params) {
    return service({
        url: '/court/infoManage/modifyLitigant.jhtml',
        method: 'GET',
        params
    });
}
