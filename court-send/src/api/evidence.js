import Util from '@/libs/util.js';

const service = Util.ajax;

export function findEvidenAbout (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/evidenceManage/findEvidenAbout.jhtml',
        method: 'get',
        params
    });
}

export function delAttachMent (attachId) {
    const params = {
        attachId
    };
    return service({
        url: '/court/evidenceManage/delAttachMent.jhtml',
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

export function queryEvidence (searchData, pageData) {
    const params = {
        caseNo:searchData.caseNo || '',
        courtId:searchData.courtId || '',
        submitName: searchData.litigantName || '',
        submitType: searchData.litigantType == '' ? '' : searchData.litigantType == 1 ? '被告' : '原告',
        auditStatus: searchData.state || '',
        pageNumber: pageData.pageNumber || '',
        pageSize: pageData.pageSize || ''
    };
    return service({
        url: '/court/evidenceManage/queryEvidence.jhtml',
        method: 'get',
        params
    });
}

export function queryEvidenceDetail (id) {
    const params = {
        id
    };
    return service({
        url: '/court/evidenceManage/queryEvidenceDetail.jhtml',
        method: 'get',
        params
    });
}

export function downAttachMent (attachId) {
    const params = {
        attachId
    };
    return service({
        url: '/court/evidenceManage/downAttachMentPath.jhtml',
        method: 'get',
        params
    });
}

export function dealAttachMent (attachId, auditHandle) {
    const params = {
        attachId,
        auditHandle
    };
    return service({
        url: '/court/evidenceManage/dealAttachMent.jhtml',
        method: 'get',
        params
    });
}

export function dealEvidenceAbout (evidenceId, auditStatus) {
    const params = {
        evidenceId,
        auditStatus
    };
    return service({
        url: '/court/evidenceManage/dealEvidenceAbout.jhtml',
        method: 'get',
        params
    });
}
