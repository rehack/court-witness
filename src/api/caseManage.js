import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/infoManage/addServicePersonnel.jhtml',
        method: 'GET',
        params
    });
}

export function list (params) {
    return service({
        url: '/court/case/distributiveLawCase/lawCase.jhtml',
        method: 'GET',
        params
    });
}

export function distri (servicePersonnelId, lawCaseIds) {
    const params = {
        servicePersonnelId,
        lawCaseIds
    };
    return service({
        url: '/court/case/distributive.jhtml',
        method: 'get',
        params
    });
}

export function serviceList (params) {
    return service({
        url: '/court/infoManage/queryServicePersonnel.jhtml',
        method: 'GET',
        params
    });
}


export function del (ids) {
    const params = {
        ids: ids
    };
    return service({
        url: '/court/infoManage//deleteServicePersonnel.jhtml',
        method: 'GET',
        params
    });
}

export function update (params) {
    return service({
        url: '/court/infoManage/modifyServicePersonnel.jhtml',
        method: 'GET',
        params
    });
}
