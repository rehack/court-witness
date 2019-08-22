import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 * 案件进展详情
 */
export function lawcaseEvolve (lawCaseId) {
	const params = {
        lawCaseId,
    };
    return service({
        url: '/court/process/queryProcessNote.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 获取案件列表
 */
export function getList (searchData, pageData) {
    const params = {
        caseNo: searchData.caseNo,
        litigantName: searchData.litigantName,
        states: searchData.states,
        briefName: searchData.briefName,
        filingDate: searchData.filingDate,
        pageSize: pageData.pageSize,
        pageNumber: pageData.pageNumber,
        number:pageData.number,
        size:pageData.size
    };
    return service({
        url: '/qtw/controversy/lawcaselist.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获得起诉状
 */
export function getIndict (lawCaseId) {
	const params = {
        lawCaseId
    };
    return service({
        url: '/qtw/indict/getIndictById.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 获得答辩状
 */
export function getAnswers (lawCaseId, isself) {
	const params = {
        lawCaseId,
        isself
    };
    return service({
        url: '/qtw/answer/getAnswers.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 根据案件id，添加/编辑答辩状
 */
export function editAns (lawCaseId, opinion, factsReasons) {
	const params = {
        lawCaseId,
        opinion,
        factsReasons
    };
    return service({
        url: '/qtw/answer/editAns.jhtml',
        method: 'GET',
        params
    });
}


/**
 * 根据案件id，添加/编辑起诉状
 */
export function addIndict (lawCaseId, claim, cause) {
	const data = {
        lawCaseId,
        claim,
        cause
    };
    return service({
        url: '/qtw/indict/addIndict.jhtml',
        method: 'post',
        data
    });
}

/**
 * 获得质证列表
 */
export function getReverts (lawCaseId) {
	const params = {
        lawCaseId
    };
    return service({
        url: '/qtw/reverts/getReverts.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 发表质证意见
 */
export function addrevert (evidenceId,result,content,content2,litigantStatus) {
	const params = {
        evidenceId,
        result,
        content,
        content2,
        litigantStatus
    };
    return service({
        url: '/qtw/reverts/addrevert.jhtml',
        method: 'post',
        params
    });
}


/**
 * 获得证据列表
 */
export function getEvi (lawCaseId, isself) {
	const params = {
        lawCaseId,
        isself
    };
    return service({
        url: '/qtw/evi/getEviByCaseId.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 获得当事人列表
 */
export function getLiti (lawCaseId) {
	const params = {
        lawCaseId,
    };
    return service({
        url: '/qtw/evi/getLitiByCaseid.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 添加修改证据
 */
export function editEvi (file, lawCaseId, eviprove, eviname,evisource, pageNo, evidenceType, evidenceId, litigantId,original) {
    let params = new FormData()
    for(var i=0;i<file.length;i++){
        params.append('file', file[i])
    }
    let config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var str = '/qtw/evi/editEvi.jhtml?lawCaseId='+lawCaseId+'&eviprove='+eviprove+'&eviname='+eviname+'&evisource='+evisource+'&pageNo='+pageNo+'&qtwEnvidenceType='+evidenceType+'&evidenceId='+evidenceId+'&litigantId='+litigantId+'&original='+original;
    var strs = encodeURI(str)
    return service.post(strs, params, config)
    // return service({
    //     url: '/qtw/evi/editEvi.jhtml',
    //     method: 'GET',
    //     params
    // });
}

/**
 * 根据证据id删除证据
 */
export function delEvidence (lawCaseId, evidenceId) {
	const params = {
        lawCaseId,
        evidenceId
    };
    return service({
        url: '/qtw/evi/delEvidence.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 删除证据附件
 */
export function deleteFile (lawCaseId, evidenceId, fileId) {
	const params = {
        lawCaseId,
        evidenceId,
        fileId
    };
    return service({
        url: '/qtw/filepath/deleteFile.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 根据证据id提交证据
 */
export function checkEvi (lawCaseId, evidenceId) {
	const params = {
        lawCaseId,
        evidenceId
    };
    return service({
        url: '/qtw/evi/checkEvi.jhtml',
        method: 'post',
        params
    });
}
/**
 * 法官添加延期
 */
export function addApplication (lawCaseId, flags, reason, delayTime) {
	const params = {
        lawCaseId,
        flags,
        reason,
        delayTime
    };
    return service({
        url: '/qtw/apli/addApplication.jhtml',
        method: 'post',
        params
    });
}

/**
 * 根据证据id获得证据详情
 */
export function getEviById (lawCaseId, evidenceId) {
	const params = {
        lawCaseId,
        evidenceId
    };
    return service({
        url: '/qtw/evi/getEviById.jhtml',
        method: 'post',
        params
    });
}