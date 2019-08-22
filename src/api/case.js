import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 * [通过案号模糊搜索案件]
 * @param caseNo [案号]
 * @return {[Array]} [案件列表]
 */
export function queryCaseNo (caseNo, pageData) {
    const params = {
        caseNo,
        pageNumber: pageData.pageNumber || '',
        pageSize: pageData.pageSize || ''
    };
    return service({
        url: '/court/createCase/queryCaseNo.jhtml',
        method: 'get',
        params
    });
}
/** 三网认证 */
export function NetworkKyc (litigantName,identityCard,litigantPhone) {
    const params = {
        litigantName,
        identityCard,
        litigantPhone
    };
    return service({
        url: '/court/createCase/validateIdCard.jhtml',
        method: 'get',
        params
    });
}

export function findByCaseLitigant (lowCaseId) {
    const params = {
        lowCaseId
    };
    return service({
        url: '/court/estFile/findByCaseLitigant.jhtml',
        method: 'get',
        params
    });
}

export function modifyCaseInfo (
    id,
    allMembers,
    filingDate,
    expireDate,
    applyStandard,
    brief
) {
    const params = {
        id,
        allMembers,
        filingDate,
        expireDate,
        applyStandard,
        brief
    };
    return service({
        url: '/court/createCase/modifyCaseInfo.jhtml',
        method: 'get',
        params
    });
}

export function addLitigant (
    lowCaseId,
    litigantName,
    identityCard,
    litigantSex,
    litigantType,
    employer,
    litigantPhone,
    litigantTelPhone,
    email,
    nativePlace,
    address,
    nation,
    birthday,
    litigaStatus,
    legalManName,
    legalManPhone,
    legalManId,
    sendAddress,
    lawerName,
    lawermobile,
    lawIdentiCard,
    lawerNum,
    lawFirm
) {
    const params = {
        lowCaseId,
        litigantName,
        identityCard,
        litigantSex,
        litigantType,
        employer,
        litigantPhone,
        litigantTelPhone,
        email,
        nativePlace,
        address,
        nation,
        birthday,
        litigaStatus,
        legalManName,
        legalManPhone,
        legalManId,
        sendAddress,
        lawerName,
        lawermobile,
        lawIdentiCard,
        lawerNum,
        lawFirm
    };
    return service({
        url: '/court/estFile/addLitigant.jhtml',
        method: 'post',
        params
    });
}

export function modiLitigant (
    litigantId,
    litigantName,
    identityCard,
    litigantSex,
    litigantType,
    employer,
    litigantPhone,
    litigantTelPhone,
    email,
    nativePlace,
    address,
    nation,
    birthday,
    litigaStatus,
    legalManName,
    legalManPhone,
    legalManId,
    sendAddress,
    lawerName,
    lawermobile,
    lawIdentiCard,
    lawerNum,
    lawFirm
) {
    const params = {
        litigantId,
        litigantName,
        identityCard,
        litigantSex,
        litigantType,
        employer,
        litigantPhone,
        litigantTelPhone,
        email,
        nativePlace,
        address,
        nation,
        birthday,
        litigaStatus,
        legalManName,
        legalManPhone,
        legalManId,
        sendAddress,
        lawerName,
        lawermobile,
        lawIdentiCard,
        lawerNum,
        lawFirm
    };
    return service({
        url: '/court/estFile/modiLitigant.jhtml',
        method: 'post',
        params
    });
}

export function detailLitigant (litigantId) {
    const params = {
        litigantId
    };
    return service({
        url: '/court/estFile/detailLitigant.jhtml',
        method: 'post',
        params
    });
}

export function removeLitigant (litigantId) {
    const params = {
        litigantId
    };
    return service({
        url: '/court/estFile/removeLitigant.jhtml',
        method: 'post',
        params
    });
}

export function createDiploms (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/createCase/createDiploms.jhtml',
        method: 'get',
        params
    });
}
