import Util from '@/libs/util.js';

const service = Util.ajax;


/**
 * 编辑案件笔录
 */
export function editRecord (id, content) {
    const data = {
        id,
        content
    };
    return service({
        url: '/qtw/info/edit.jhtml',
        method: 'POST',
        data
    });
}

/**
 * 发布案件笔录
 */
export function publishRecord (id) {
    const params = {
        id
    };
    return service({
        url: '/qtw/info/publish.jhtml',
        method: 'post',
        params
    });
}

/**
 * 新增争议焦点
 */
export function addFouce (lawCaseId, content) {
	const params = {
        lawCaseId,
        content
    };
    return service({
        url: '/qtw/controversy/add.jhtml',
        method: 'GET',
        params
    });
}
/**
 * 修改争议焦点
 */
export function editFouce (conId, content) {
	const params = {
        conId,
        content
    };
    return service({
        url: '/qtw/controversy/edit.jhtml',
        method: 'GET',
        params
    });
}


/**
 * 获取争议焦点
 */
export function fouceList (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/qtw/controversy/list.jhtml',
        method: 'GET',
        params
    });
}


/**
 * 发布争议焦点
 */
export function publish (conId) {
    const params = {
        conId
    };
    return service({
        url: '/qtw/controversy/publish.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 当事人反馈焦点
 */
export function reply (conId, content ) {
    const params = {
        conId,
        content
    };
    return service({
        url: '/qtw/controversy/reply.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 获取庭前会议笔录
 */
export function getNotes (lawcaseId) {
    const params = {
        lawcaseId
    };
    return service({
        url: '/qtw/info/notes.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 法官申请列表
 */
export function judgeQuest (searchData, pageData ) {
    const params = {
        lawCaseNo: searchData.lawCaseNo,
        flags: searchData.flags,
        litigantName: searchData.litigantName,
        caseBrief: searchData.caseBrief,
        processResults: searchData.processResults,
        caseCreateTime: searchData.caseCreateTime,
        pageSize: pageData.pageSize,
        pageNumber: pageData.pageNumber
    };
    return service({
        url: '/qtw/apli/judgeQuestApplication.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 当事人申请列表
 */
export function litigantQuest (searchData, pageData ) {
    const params = {
        litigantName: searchData.litigantName,
        flags: searchData.flags,
        processResults: searchData.processResults,
        lawCaseNo: searchData.lawCaseNo,
        caseCreateTime: searchData.caseCreateTime,
        dealStateType: searchData.dealStateType,
        pageSize: pageData.pageSize,
        pageNumber: pageData.pageNumber
    };
    return service({
        url: '/qtw/apli/litigantQuestApplication.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 当事人提交申请
 */
export function addApplication (lawCaseId, flags, delayTime, reason, applicationId ) {
    const params = {
        lawCaseId,
        flags,
        delayTime,
        reason,
        applicationId
    };
    return service({
        url: '/qtw/apli/addApplication.jhtml',
        method: 'GET',
        params
    });
}


/**
 * 法官审批申请
 */
export function ediApplication (lawCaseId, dealState, dealReason, applicationId ) {
    const params = {
        lawCaseId,
        dealState,
        dealReason,
        applicationId
    };
    return service({
        url: '/qtw/apli/ediApplication.jhtml',
        method: 'GET',
        params
    });
}