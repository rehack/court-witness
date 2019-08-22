import Util from '@/libs/util.js';

const service = Util.ajax;

export function queryLawCase (params) {
    return service({
        url: '/court/infoManage/queryLawCase.jhtml',
        method: 'GET',
        params
    });
}
