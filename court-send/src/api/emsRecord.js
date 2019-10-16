import Util from '@/libs/util.js';

const service = Util.ajax;

export function findAllRecord (params) {
    return service({
        url: '/court/emsRecord/findAllRecord.jhtml',
        method: 'GET',
        params
    });
}

export function updateSendType (id) {
    const params = {
        id
    };
    return service({
        url: '/court/emsRecord/updateSendType.jhtml',
        method: 'post',
        params
    });
}

/** 
 * 修改邮寄信息
 */
export function updateEmsRecord (params) {
    return service({
        url: '/court/emsRecord/updateEmsRecord.jhtml',
        method: 'GET',
        params
    });
}

export function queryCallLog (params) {
    return service({
        url: '/court/sqmobile/queryCallLog.jhtml',
        method: 'GET',
        params
    });
}