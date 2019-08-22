import Util from '@/libs/util.js';

const service = Util.ajax;

export function findEvidenAbout (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/evidenceManage/findEvidenAbout1.jhtml',
        method: 'get',
        params
    });
}

export function addEvidence (evidenceId, litigantId) {
    const params = {
        evidenceId,
        litigantId
    };
    return service({
        url: '/court/evidenceManage/addEvidence.jhtml',
        method: 'get',
        params
    });
}

export function queryEvidenceDetail (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/evidenceManage/queryEvidenceDetail1.jhtml',
        method: 'get',
        params
    });
}
