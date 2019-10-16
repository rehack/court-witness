import Util from '@/libs/util.js';

const service = Util.ajax;

export function findAllCase (params) {
    return service({
        url: '/caselist/findAllCase.jhtml',
        method: 'get',
        params
    });
}

export function buildDiploms (caseNo) {
    const params = {
        caseNo: caseNo,
    };
    return service({
        url: '/caselist/buildDiploms.jhtml',
        method: 'GET',
        params
    });
}
/** 
 * 获取保存过的案件信息
 */
export function getOnlineLawCaseEdit (onlineLawCaseId) {
    const params = {
        onlineLawCaseId
    };
    return service({
        url: '/online/lawCase/getOnlineLawCaseEdit.jhtml',
        method: 'GET',
        params
    });
}
/** 
 * 获取保存过的当事人信息
 */
export function getLitigantInfo (onlineLawCaseId) {
    const params = {
        onlineLawCaseId
    };
    return service({
        url: '/online/lawCase/getLitigantInfo.jhtml',
        method: 'GET',
        params
    });
}
/** 
 * 获取保存过的代理人信息
 */
export function getLitigantLawyerList (onlineLawCaseId) {
    const params = {
        onlineLawCaseId
    };
    return service({
        url: '/online/lawCase/getLawyerList.jhtml',
        method: 'GET',
        params
    });
}
/** 
 * 法官获取文件列表
 */
export function otherGetFiles (onlineLawCaseId) {
    const params = {
        onlineLawCaseId
    };
    return service({
        url: '/online/evidenceAttachment/otherGetFiles.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * 获取单个当事人信息
 */
export function getOneLitigant (onlineLitigantId) {
    const params = {
        onlineLitigantId
    };
    return service({
        url: '/online/litigant/getLitigantInfo.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * 获取单个代理人信息
 */
export function getLawyerInfo (onlineLawyerId) {
    const params = {
        onlineLawyerId
    };
    return service({
        url: '/online/lawyer/getLawyerInfo.jhtml',
        method: 'GET',
        params
    });
}

export function sendmessage (caseId, fileds) {
    const params = {
        caseId,
        fileds
    };
    return service({
        url: '/caselist/sendmessage.jhtml',
        method: 'post',
        params
    });
}

export function emailList (lawCaseId, litigantId) {
    const params = {
        lawCaseId,
        litigantId
    };
    return service({
        url: '/court/send/EmailMessageTemplate.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 查询调解案件接口
 */
// export function getMediatedCase (params) {
//     return service({
//         url: '/online/lawCase/getMediatedCase.jhtml',
//         method: 'GET',
//         params
//     });
// }
/**
 * 生成告知书
 */
export function createWord (onlineLawCaseId) {
    const params = {
        onlineLawCaseId
    };
    return service({
        url: '/online/lawCase/createWord.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 发送告知书
 */
export function sendDiploms (caseId, onlineLawCaseId,fileds) {
    const params = {
        caseId, 
        onlineLawCaseId,
        fileds
    };
    return service({
        url: '/online/send/sendDiploms.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * 获取列表
 */
export function getJudgeBriefCourt () {
    return service({
        url: '/online/lawCase/getJudgeBriefCourt.jhtml',
        method: 'GET',
    });
}

/**
 * 转正式案件
 */

export function auditOnlineLawCase (params) {
    return service({
        url: '/online/lawCase/auditOnlineLawCase.jhtml',
        method: 'post',
        params
    });
}

/**
 * 通过引调好或回执编号搜索案件
 */

export function getMediatedCase (params) {
    // const params = {
    //     caseNo, 
    //     code
    // };
    return service({
        url: '/online/lawCase/getMediatedCase.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 打印快递单
 */
export function printEMS (litigantType,lawCaseId,litigantName,address,litigantPhone,legalManName,legalManPhone,printType) {
    const params = {
        litigantType,
        lawCaseId,
        litigantName,
        address,
        litigantPhone,
        legalManName,
        legalManPhone,
        printType
    };
    return service({
        url: '/online/send/printEMS.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 发送快递单号
 */

export function createEmsExcel (ems) {
    const params = {
        ems
    };
    return service({
        url: '/online/send/createEmsExcel.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 送达详情
 */

export function deliveryDetails (onlineLawCaseId) {
    const params = {
        onlineLawCaseId
    };
    return service({
        url: '/online/lawCase/deliveryDetails.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 时间统计用
 */

export function countTime (minDate,maxDate) {
    const params = {
        minDate,
        maxDate
    };
    return service({
        url: '/online/lawCase/countTime.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 查询法院
 */

export function findOnlineCourt (name) {
    const params = {
        name
    };
    return service({
        url: '/online/lawCase/findOnlineCourt.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 查询诉前案由
 */

export function findOnlineBrief (name) {
    const params = {
        name
    };
    return service({
        url: '/online/lawCase/findOnlineBrief.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 查询书记员或法官
 */
export function findWorkerNames (name,judgeType) {
    const params = {
        name: name,
        judgeType:judgeType
    };
    return service({
        url: '/court/case/findWorkerNames.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 查询书记员或法官
 */
export function downloadExcel (onlineLawCaseIds) {
    const params = {
        onlineLawCaseIds:onlineLawCaseIds
    };
    return service({
        url: '/online/lawCase/downloadExcel.jhtml',
        method: 'GET',
        params
    });
}


/**
 * 办理案件撤诉
 */
export function handlingWithdrawal (state,path,reason,onlineLawCaseId) {
    const params = {
        state,
        path,
        reason,
        onlineLawCaseId
    };
    return service({
        url: '/online/lawCase/handlingWithdrawal.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 案件导入内网
 */
export function setCase (onlineLawCaseId) {
    const params = {
        onlineLawCaseId
    };
    return service({
        url: '/online/lawCase/setCase.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 案件导入内网开庭日历
 */
export function setCaseForCalendar (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/case/setCaseForCalendar.jhtml',
        method: 'GET',
        params
    });
}