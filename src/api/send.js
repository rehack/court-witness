import Util from '@/libs/util.js';

const service = Util.ajax;

export function querySend (params) {
    return service({
        url: '/court/send/queryDocumentSendSituation.jhtml',
        method: 'POST',
        params
    });
}

// 案件信息及当事人信息及送达情况
export function getInfo (lawCaseId) {
    const params = {
        lawCaseId: lawCaseId
    };
    return service({
        url: '/court/send/queryLawCaseInfo.jhtml',
        method: 'POST',
        params
    });
}

// 文书送达及物流邮件送达情况
export function getSendInfo (lawCaseId, courtNumber) {
    const params = {
        lawCaseId,
        courtNumber
    };
    return service({
        url: '/court/send/queryDiplomsSend.jhtml',
        method: 'POST',
        params
    });
}
export function litigantEvidenceList (lawCaseId, litigantId) {
    const params = {
        lawCaseId,
        litigantId
    };
    return service({
        url: '/court/send/litigantEvidenceList.jhtml',
        method: 'POST',
        params
    });
}

export function queryCurrentSend (lawCaseId, litigantId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/send/queryCurrentSend.jhtml',
        method: 'POST',
        params
    });
}
// export function getLigitantInfo (lawCaseId) {
//     const params = {
//         lawCaseId: lawCaseId
//     };
//     return service({
//         url: '/court/send/queryDiplomsSend.jhtml',
//         method: 'POST',
//         params
//     });
// }

export function getPhones (caseNo) {
    const params = {
        caseNo
    };
    return service({
        url: '/court/send/queryLitigantPhone.jhtml',
        method: 'POST',
        params
    });
}

export function sendME (lawCaseId, fileds) {
    const params = {
        lawCaseId,
        fileds
    };
    return service({
        url: '/court/send/sendMessageAndEmail.jhtml',
        method: 'POST',
        params
    });
}

export function cancelExp (postId) {
    const params = {
        postId
    };
    return service({
        url: '/court/send/cancelSendExpress.jhtml',
        method: 'POST',
        params
    });
}

export function confirm (lawCaseId, litigantId, type) {
    const params = {
        lawCaseId,
        litigantId,
        type
    };
    return service({
        url: '/court/send/receiveDocumentConfirm.jhtml',
        method: 'POST',
        params
    });
}
export function lawCaseSendComplete (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/send/confirmLawCaseSendComplete.jhtml',
        method: 'POST',
        params
    });
}

export function queryLitigantSend (litigantId) {
    const params = {
        litigantId
    };
    return service({
        url: '/court/send/queryLitigantSend.jhtml',
        method: 'POST',
        params
    });
}

export function postDeliveryBill (lawCaseId, filed) {
    const params = {
        lawCaseId,
        filed
    };
    return service({
        url: '/court/send/postDeliveryBill.jhtml',
        method: 'POST',
        params
    });
}

export function printBill (params) {
    return service({
        url: '/court/send/printExpress.jhtml',
        method: 'POST',
        params
    });
}

