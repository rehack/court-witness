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
export function NetworkKyc (litigantName, identityCard, litigantPhone,legalManName, legalManId, legalManPhone,  litigantType) {
    const params = {
        litigantName,
        identityCard,
        litigantPhone,
        litigantType,
        legalManName,
        legalManId,
        legalManPhone
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

export function addLitigantRelation (lawcaseId,relationType,litigationStatus,litigantId) {
    const params = {
        lawcaseId,
        relationType,
        litigationStatus,
        litigantId
    };
    return service({
        url: '/court/litigantRelation/add.jhtml',
        method: 'get',
        params
    });
}
export function deleteLitigantRelation (litigantRelationId) {
    const params = {
        litigantRelationId
    };
    return service({
        url: '/court/litigantRelation/delete.jhtml.jhtml',
        method: 'post',
        params
    });
}

export function updateLitigantRelation (lawcaseId,relationType,litigationStatus,litigantId,litigantRelationId) {
    const params = {
        lawcaseId,
        relationType,
        litigationStatus,
        litigantId,
        litigantRelationId
    };
    return service({
        url: '/court/litigantRelation/update.jhtml',
        method: 'post',
        params
    });
}

export function litigantRelation (lawcaseId,litigationStatus) {
    const params = {
        lawcaseId,
        litigationStatus
    };
    return service({
        url: '/court/litigantRelation/list.jhtml.jhtml',
        method: 'get',
        params
    });
}

export function listJudgeAndClerk (courtId) {
    const params = {
        courtId
    };
    return service({
        url: '/court/createCase/listJudgeAndClerk.jhtml',
        method: 'get',
        params
    });
}

/** 
 * 代理人接口
 */
export function findAgent (agentName, agentIdentiCard, lawerNum) {
    const params = {
        agentName,
        agentIdentiCard,
        lawerNum
    };
    return service({
        url: '/court/lawyer/findByNameOrCardNum.jhtml',
        method: 'get',
        params
    });
}

/** 
 * 代理人接口
 */
export function findLitigant (litigantName, identityCard, litigantType) {
    const params = {
        litigantName,
        identityCard,
        litigantType
    };
    return service({
        // url: '/court/estFile/findLitigant.jhtml',
        url: '/court/estFile/findPersonnel.jhtml',
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
    brief,
    judge,
    clerk
) {
    const params = {
        id,
        allMembers,
        filingDate,
        expireDate,
        applyStandard,
        brief,
        judge,
        clerk
    };
    return service({
        url: '/court/createCase/modifyCaseInfo.jhtml',
        method: 'get',
        params
    });
}


export function addLitigant (
    isCreate,
    nativePlaceRemark,
    addressRemark,
    sendAddressRemark,
    allOtherAddress,
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
    agentId,
    agentType,
    agentName,
    agentMobile,
    agentIdentiCard,
    lawerNum,
    lawFirm,
    relationType,
    relationLitigantId,
    agentId1,
    agentType1,
    agentName1,
    agentMobile1,
    agentIdentiCard1,
    lawerNum1,
    lawFirm1
) {
    const params = {
        isCreate,
        nativePlaceRemark,
        addressRemark,
        sendAddressRemark,
        allOtherAddress,
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
        agentId,
        agentType,
        agentName,
        agentMobile,
        agentIdentiCard,
        lawerNum,
        lawFirm,
        relationType,
        relationLitigantId,
        agentId1,
        agentType1,
        agentName1,
        agentMobile1,
        agentIdentiCard1,
        lawerNum1,
        lawFirm1
    };
    return service({
        url: '/court/estFile/addLitigant.jhtml',
        method: 'post',
        params
    });
}

export function modiLitigant (
    isCreate,
    nativePlaceRemark,
    addressRemark,
    sendAddressRemark,
    allOtherAddress,
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
    agentId,
    agentType,
    agentName,
    agentMobile,
    agentIdentiCard,
    lawerNum,
    lawFirm,
    relationType,
    relationLitigantId,
    agentId1,
    agentType1,
    agentName1,
    agentMobile1,
    agentIdentiCard1,
    lawerNum1,
    lawFirm1
) {
    const params = {
        isCreate,
        nativePlaceRemark,
        addressRemark,
        sendAddressRemark,
        allOtherAddress,
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
        agentId,
        agentType,
        agentName,
        agentMobile,
        agentIdentiCard,
        lawerNum,
        lawFirm,
        relationType,
        relationLitigantId,
        agentId1,
        agentType1,
        agentName1,
        agentMobile1,
        agentIdentiCard1,
        lawerNum1,
        lawFirm1
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

export function removeAddress (addressId) {
    const params = {
        addressId
    };
    return service({
        url: '/court/estFile/removeAddress.jhtml',
        method: 'get',
        params
    });
}
