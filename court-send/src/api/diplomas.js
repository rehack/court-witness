import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (name) {
    const params = {
        name
    };
    return service({
        url: '/dp/add.jhtml',
        method: 'GET',
        params
    });
}

export function list (litigantId, name, requestContent, type, sendId,programType,entrustedCourt,defendantLitigantAddress) {
    const data = {
        litigantId,
        name,
        requestContent,
        type,
        sendId,
        programType,
        entrustedCourt,
        defendantLitigantAddress
    };
    return service({
        url: '/dp/list.jhtml',
        method: 'post',
        data
    });
}
export function printer (litigantId, name, type, sendId) {
    const params = {
        litigantId: litigantId,
        name: name,
        type: type,
        sendId: sendId
    };
    return service({
        url: '/dp/diplomsAndBuildWxCode.jhtml',
        method: 'GET',
        params
    });
}

//编辑回填
export function diplomsEditorPreview (diplomsName,litigantId) {
    const params = {
        diplomsName: diplomsName,
        litigantId: litigantId,
    };
    return service({
        url: '/dp/diplomsEditorPreview.jhtml',
        method: 'GET',
        params
    });
}
// 生成
// export function dbList (litigantId,name,caseNo,briefName,litigantName,startTime,tribunalAddress,contactPhone,judgeName,clerkName,noticeTime,
// plaintiffName,defendantName,defendantNameBriefName,litigantStatusName,allMembers,department,sendAddress,sendDiploms,
// costMoney,converCaseNo,plaintiffNamePhone,defendantNamePhone,plaintiffLawyerNamePhone,defendantLawyerNamePhone,
// closeDate,converStartDate,startDate,proofPeriod,filingDate,requestContent,diplomsListJoin,you,otherProofPeriod,plaintiffNameOrLawyerNameAndPhone,
// otherClerkName,plaintiffNameOrLawyerName,courtNum,courtTime,sentenceContent,converDefendantAddress1,converDefendantAddress2,converDefendantAddress3,converDefendantAddress4,converDefendantAddress5,converDefendantAddress6,notifiedPerson,clerkTelephone) {
//     const data = {
        // litigantId,
        // name,
        // caseNo,
        // briefName,
        // litigantName,
        // startTime,
        // tribunalAddress,
        // contactPhone,
        // judgeName,
        // clerkName,
        // noticeTime,
        // plaintiffName,
        // defendantName,
        // defendantNameBriefName,
        // litigantStatusName,
        // allMembers,
        // department,
        // sendAddress,
        // sendDiploms,
        // costMoney,
        // converCaseNo,
        // plaintiffNamePhone,
        // defendantNamePhone,
        // plaintiffLawyerNamePhone,
        // defendantLawyerNamePhone,
        // closeDate,
        // converStartDate,
        // startDate,
        // proofPeriod,
        // filingDate,

//         type:'add',
//         requestContent,
//         diplomsListJoin,
//         you,
//         otherProofPeriod,
//         plaintiffNameOrLawyerNameAndPhone,

//         otherClerkName,
//         plaintiffNameOrLawyerName,
//         courtNum,

//         courtTime,

//         sentenceContent,
        
//         converDefendantAddress1,
//         converDefendantAddress2,
//         converDefendantAddress3,
//         converDefendantAddress4,
//         converDefendantAddress5,
//         converDefendantAddress6,

//         notifiedPerson,
//         clerkTelephone,
//     };
//     return service({
//         url: '/dp/list.jhtml',
//         method: 'post',
//         data
//     });
// }

export function dbList (data) {

        return service({
            url: '/dp/list.jhtml',
            method: 'post',
            data
        });
    }



export function del (dtId) {
    const params = {
        dtId
    };
    return service({
        url: '/dp/delete.jhtml',
        method: 'GET',
        params
    });
}

export function queryDiplomsIsAdd (litigantId, name) {
    const params = {
        litigantId,
        name
    };
    return service({
        url: '/dp/queryDiplomsIsAdd.jhtml',
        method: 'GET',
        params
    });
}

export function update (dtId, name, content) {
    const data = {
        dtId,
        name,
        content
    };
    return service({
        url: '/dp/update.jhtml',
        method: 'POST',
        data
    });
}



export function toPdf (dlIds) {
    const params = {
        dlIds: dlIds
    };
    return service({
        url: '/dp/pdfs2pdf.jhtml',
        method: 'GET',
        params
    });
}

export function sendDelivererHistory (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/dp/sendDelivererHistory.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 添加修改证据
 */
export function uploadDelivererFiles (file) {
    let params = new FormData()
    params.append('file', file)
    let config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var str = '/dp/uploadDelivererFiles.jhtml';
    var strs = encodeURI(str)
    return service.post(strs, params, config)
}

export function sendDeliverer (data) {
    return service({
        url: '/dp/sendDeliverer.jhtml',
        method: 'post',
        data
    });
}


