import Util from '@/libs/util.js';

const service = Util.ajax;

export function queryLawCase (params) {
    return service({
        url: '/court/infoManage/queryLawCase.jhtml',
        method: 'GET',
        params
    });
}

export function batchBuildDiplomsLawCaseList (params) {
    return service({
        url: '/court/case/batchBuildDiplomsLawCaseList.jhtml',
        method: 'GET',
        params
    });
}

export function downloadZip (params) {
    return service({
        url: '/court/infoManage/downloadZip.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 撤案
 */
export function backoutCase (lawCaseIds) {
    const params = {
        lawCaseIds
    }
    return service({
        url: '/court/case/closeLawCase.jhtml',
        method: 'GET',
        params
    });
}


/**
 * 结案
 */
export function overLawCase (lawCaseIds,closeType,closeDate,closeMoney) {
    const params = {
        lawCaseIds,
        closeType,
        closeDate,
        closeMoney,
    }
    return service({
        url: '/court/case/overLawCase.jhtml',
        method: 'GET',
        params
    });
}

export function updateLawCaseState (lawCaseId,process) {
    const params = {
        lawCaseId,
        process
    }
    return service({
        url: '/court/case/updateLawCaseState.jhtml',
        method: 'post',
        params
    });
}
export function updatecaseNo (lawCaseId,caseNo) {
    const params = {
        lawCaseId,
        caseNo
    }
    return service({
        url: '/court/infoManage/updateCaseNo.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 
 */
export function querySendAddr (caseId) {
    const params = {
        caseId
    }
    return service({
        url: '/court/infoManage/querySendAddr.jhtml',
        method: 'post',
        params
    });
}

/**
 * 
 */
export function createMapAddr (data) {
    return service({
        url: '/court/infoManage/createMapAddr.jhtml',
        method: 'post',
        data
    });
}