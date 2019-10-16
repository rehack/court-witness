import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/infoManage/addTribunal.jhtml',
        method: 'GET',
        params
    });
}

export function list (params) {
    return service({
        url: '/court/infoManage/queryTribunal.jhtml',
        method: 'GET',
        params
    });
}

export function del (tribunalNos) {
    const params = {
        tribunalNos: tribunalNos
    };
    return service({
        url: '/court/infoManage/deleteTribunal.jhtml',
        method: 'GET',
        params
    });
}

export function update (params) {
    return service({
        url: '/court/infoManage/modifyTribunal.jhtml',
        method: 'GET',
        params
    });
}
