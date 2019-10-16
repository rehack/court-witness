import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 * [查询所有案由接口]
 * @return {[Array]} [案由列表]
 */
export function getBrief () {
    return service({
        url: '/court/createCase/queryBrief.jhtml',
        method: 'get'
    });
}

export function getTribunal (id) {
    const params = {
        id
    };
    return service({
        url: '/court/scheduling/queryTribunals.jhtml',
        method: 'get',
        params
    });
}

export function queryCase (a, b, c) {
    const params = {
        caseNo: a,
        plaintiffName: b,
        defendantName: c
    };
    return service({
        url: '/court/send/queryLawCase.jhtml',
        method: 'POST',
        params
    });
}

export function queryCaseInfo (id) {
    const params = {
        id: id
    };
    return service({
        url: '/court/infoManage/queryLawCaseAll.jhtml',
        method: 'GET',
        params
    });
}

export function caselist (caseNo, caseName, briefName, litigantName, filingDate1, filingDate2, pageNumber) {
    const params = {
        caseNo: caseNo,
        caseName: caseName,
        briefName: briefName,
        litigantName: litigantName,
        filingDate1: filingDate1,
        filingDate2: filingDate2,
        pageNumber: pageNumber
    };
    return service({
        url: '/court/infoManage/queryLawCase.jhtml',
        method: 'GET',
        params
    });
}

export function queryProcessNote (lawCaseId) {
    const params = {
        lawCaseId: lawCaseId
    }
    return service({
        url: '/court/process/queryProcessNote.jhtml',
        method: 'GET',
        params
    })
}

export function searchCase (kw) {
    const params = {
        caseNo: kw
    };
    return service({
        url: '/court/infoManage/lawCaseInfo.jhtml',
        method: 'GET',
        params
    });
}

export function courtList () {
    return service({
        url: '/court/infoManage/courtList.jhtml',
        method: 'GET'
    });
}

