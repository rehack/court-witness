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
export function findBriefNames (name) {
    const params = {
        name: name,
    };
    return service({
        url: '/court/case/findBriefNames.jhtml',
        method: 'GET',
        params
    });
}
export function findWorkerNames (name,judgeType) {
    const params = {
        name: name,
        judgeType:judgeType
    };
    return service({
        url: '/court/case/findWorkerNames.jhtml',
        method: 'GET',
        params
    });
}
/**分配案件查询送达人员接 */
export function queryServicePersonnel () {
    const params = {};
    return service({
        url: '/court/case/queryServicePersonnel.jhtml',
        method: 'GET',
        params
    });
}
