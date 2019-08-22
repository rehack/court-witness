import Util from '@/libs/util.js';

const service = Util.ajax;

export function litigantLawCaseList (caseNo, pageData) {
    const params = {
        caseNo,
        pageNumber: pageData.pageNumber || '',
        pageSize: pageData.pageSize || ''
    };
    return service({
        url: '/court/send/litigantLawCaseList.jhtml',
        method: 'get',
        params
    });
}

export function queryDiplomsSendList (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/send/queryDiplomsSendList.jhtml',
        method: 'post',
        params
    });
}
