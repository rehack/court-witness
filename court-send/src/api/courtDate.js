import Util from '@/libs/util.js';

const service = Util.ajax;

export function courtList (searchData, pageData) {
    const params = {
        caseNo: searchData.caseNo || '',
        judgeName: searchData.judgeName || '',
        tribunalName: searchData.tribunalName || '',
        briefName: searchData.briefName || '',
        state: searchData.state || '',
        startDate: searchData.startDate || '',
        endDate: searchData.endDate || '',
        pageNumber: pageData.pageNumber || '',
        litigantName: searchData.litigantName || '',
        pageSize: pageData.pageSize || ''
    };
    return service({
        url: '/court/scheduling/list.jhtml',
        method: 'get',
        params
    });
}

export function courtList2 (searchData, pageData) {
    const params = {
        caseNo: searchData.caseNo || '',
        judgeName: searchData.judgeName || '',
        tribunalName: searchData.tribunalName || '',
        briefName: searchData.briefName || '',
        state: searchData.state || '',
        startDate: searchData.startDate || '',
        endDate: searchData.endDate || '',
        pageNumber: pageData.pageNumber || '',
        litigantName: searchData.litigantName || '',
        pageSize: pageData.pageSize || ''
    };
    return service({
        url: '/court/scheduling/confirmLawCaseList.jhtml',
        method: 'get',
        params
    });
}

export function orderByTimes (searchData, pageData) {
    const params = {
        caseNo: searchData.caseNo || '',
        judgeName: searchData.judgeName || '',
        tribunalName: searchData.tribunalName || '',
        briefName: searchData.briefName || '',
        state: searchData.state || '',
        startDate: searchData.startDate || '',
        endDate: searchData.endDate || '',
        pageNumber: pageData.pageNumber || '',
        pageSize: pageData.pageSize || ''
    };
    return service({
        url: '/court/scheduling/orderByTimes.jhtml',
        method: 'get',
        params
    });
}

export function holiday (judgeId) {
    const params = {
        judgeId
    };
    return service({
        url: '/court/scheduling/holiday.jhtml',
        method: 'get',
        params
    });
}

export function courtDetail (schedulingId) {
    const params = {
        schedulingId
    };
    return service({
        url: '/court/scheduling/detail.jhtml',
        method: 'get',
        params
    });
}

export function getNowSchedulding (dayTimes, date, tribunalId) {
    const params = {
        dayTimes,
        date,
        tribunalId
    };
    return service({
        url: '/court/scheduling/getNowSchedulding.jhtml',
        method: 'get',
        params
    });
}

export function findDayTimes (date, judgeId,tribunalId) {
    const params = {
        date,
        judgeId,
        tribunalId
    };
    return service({
        url: '/court/scheduling/findDayTimes.jhtml',
        method: 'get',
        params
    });
}

export function modify (schedulingId, tribunalId, dayTimes, date) {
    const params = {
        schedulingId,
        tribunalId,
        dayTimes,
        date
    };
    return service({
        url: '/court/scheduling/modify.jhtml',
        method: 'get',
        params
    });
}

export function confirm (schedulingId, isConfirm, confirmType) {
    const params = {
        schedulingId,
        isConfirm,
        confirmType
    };
    return service({
        url: '/court/scheduling/confirm.jhtml',
        method: 'get',
        params
    });
}

export function confirmOne (schedulingId, isConfirm, litigantId) {
    const params = {
        schedulingId,
        isConfirm,
        litigantId
    };
    return service({
        url: '/court/scheduling/confirm.jhtml',
        method: 'get',
        params
    });
}

export function confirmDetail (schedulingId) {
    const params = {
        schedulingId
    };
    return service({
        url: '/court/scheduling/confirm/detail.jhtml',
        method: 'get',
        params
    });
}
export function handArrange (caseId, judgeId, clerkId) {
    const params = {
        caseId,
        judgeId,
        clerkId
    };
    return service({
        url: '/court/scheduling/handArrange.jhtml',
        method: 'get',
        params
    });
}
export function hand (caseId, judgeId, clerkId, tribunalId, date) {
    const params = {
        caseId,
        judgeId,
        clerkId,
        tribunalId,
        date
    };
    return service({
        url: '/court/scheduling/hand.jhtml',
        method: 'get',
        params
    });
}

export function handArrangeConfirm (lawCaseId, judgeId, clerkId, tribunalId, startDate, times, dayTimes) {
    const params = {
        lawCaseId,
        judgeId,
        clerkId,
        tribunalId,
        startDate,
        times,
        dayTimes
    };
    return service({
        url: '/court/scheduling/handArrangeConfirm.jhtml',
        method: 'get',
        params
    });
}
export function calendarList (startYear, startMonth, judgeId, type,openState,caseNo,litigantName,sort) {
    const params = {
        startYear,
        startMonth,
        judgeId,
        type,
        openState,
        caseNo,
        litigantName,
        sort
    };
    return service({
        url: '/court/scheduling/calendar/list.jhtml',
        method: 'post',
        params
    });
}

export function list (params) {
    return service({
        url: '/court/infoManage/queryCourtInfo.jhtml',
        method: 'GET',
        params
    });
}

export function addCourtInfo (params) {
    return service({
        url: '/court/infoManage/addCourtInfo.jhtml',
        method: 'post',
        params
    });
}

export function delCourtInfo (params) {
    return service({
        url: '/court/infoManage/delCourtInfo.jhtml',
        method: 'post',
        params
    });
}

export function updateCourtInfo (params) {
    return service({
        url: '/court/infoManage/updateCourtInfo.jhtml',
        method: 'post',
        params
    });
}


export function getAssociateCase (caseNo) {
    const params = {
        caseNo,
    };
    return service({
        url: '/court/scheduling/getAssociateCase.jhtml',
        method: 'GET',
        params
    });
}

export function updateScheduldingIsConfirmOpen (isConfirmOpen,scheduldingId,remark) {
    const params = {
        isConfirmOpen,
        scheduldingId,
        remark
    };
    return service({
        url: '/court/scheduling/updateScheduldingIsConfirmOpen.jhtml',
        method: 'GET',
        params
    });
}

export function cancelSchedulding (scheduldingId) {
    const params = {
        scheduldingId,
    };
    return service({
        url: '/court/scheduling/cancelSchedulding.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * ??????????????????????????????
 */
export function findCourt (params) {
    return service({
        url: '/court/infoManage/findCourt.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * ??????????????????????????????
 */
export function addCourt (params) {
    return service({
        url: '/court/infoManage/addCourt.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * ??????????????????????????????
 */
export function updateCourt (params) {
    return service({
        url: '/court/infoManage/updateCourt.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * ??????????????????????????????
 */
export function delCourt (ids) {
    const params = {
        ids
    }
    return service({
        url: '/court/infoManage/delCourt.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * ??????????????????
 */
export function getParentCourt () {
    return service({
        url: '/court/infoManage/getParentCourt.jhtml',
        method: 'GET',
    });
}

/** 
 * ????????????
 */
export function telephoneRecord (params) {
    return service({
        url: '/court/sqmobile/telephoneRecord.jhtml',
        method: 'post',
        params
    });
}

/**
 * ??????????????????
 * @param {*} courtId 
 */
export function queryTribunalList (courtId) {
    const params = {
        courtId,
    };
    return service({
        url: '/court/infoManage/queryTribunalList.jhtml',
        method: 'GET',
        params
    });
}

/**
 * ????????????
 * @param {*} courtId 
 */
export function setTribunalList (courtId,tribunalIds) {
    const params = {
        courtId,
        tribunalIds
    };
    return service({
        url: '/court/infoManage/setTribunalList.jhtml',
        method: 'GET',
        params
    });
}

/**
 * ????????????????????????
 * @param  {true/false} groupRule  [??????????????????]
 * @param  {WINTER/SUMMER} season     [?????????/?????????]
 * @param  {number} pageNumber [??????]
 * @param  {[number]} pageSize   [????????????]
 * @return {[type]}            [description]
 */
export function getRuleList (groupRule, season, pageNumber, pageSize) {
    const params = {
        groupRule,
        season,
        pageNumber,
        pageSize
    };
    return service({
        url: '/court/scheduldingRule/list.jhtml',
        method: 'GET',
        params
    });
}


/**
 * ??????????????????????????????
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function delateComfirm (id) {
    const params = {
        id
    };
    return service({
        url: '/court/scheduldingRule/deleteBeforeConfirm.jhtml',
        method: 'GET',
        params
    });
}

/**
 * ??????????????????
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function delateRule (id) {
    const params = {
        id
    };
    return service({
        url: '/court/scheduldingRule/delete.jhtml',
        method: 'GET',
        params
    });
}

/**
 * ??????????????????
 * @param {[type]} hour         [??????]
 * @param {[type]} minute       [??????]
 * @param {[type]} groupRule    [??????????????????]
 * @param {[type]} groupDayTime [????????????????????????]
 * @param {[type]} season       [?????????/?????????]
 * @param {[type]} tribunalId   [??????id]
 * @param {[type]} groupId      [?????????????????????]
 */
export function addRule (hour,minute,groupRule,groupDayTime,season,tribunalId,groupId) {
    const params = {
        hour,
        minute,
        groupRule,
        groupDayTime,
        season,
        tribunalId,
        groupId
    };
    return service({
        url: '/court/scheduldingRule/add.jhtml',
        method: 'GET',
        params
    });
}


/**
 * ????????????????????????????????????
 * @param  {[type]} tribunalId   [??????id]
 * @param  {[type]} groupRule    [??????????????????]
 * @param  {[type]} groupDayTime [????????????????????????]
 * @return {[type]}              [description]
 */
export function getWinterRule (tribunalId,groupRule,groupDayTime) {
    const params = {
        tribunalId,
        groupRule,
        groupDayTime,
    };
    return service({
        url: '/court/scheduldingRule/winterScheduldingRule.jhtml',
        method: 'GET',
        params
    });
}

/**
 * ?????????????????????????????????????????????
 * @return {[type]} [description]
 */
export function getTribunalList () {
    const params = {
    };
    return service({
        url: '/court/scheduldingRule/getTribunalList.jhtml',
        method: 'GET',
        params
    });
}

/**
 * ????????????????????????????????????????????????
 * @param  {[type]} tribunalId [description]
 * @return {[type]}    [description]
 */
export function getTribunalWinterRuleList (tribunalId,season) {
    const params = {
        tribunalId,
        season
    };
    return service({
        url: '/court/scheduldingRule/ordinaryScheduldingRuleList.jhtml',
        method: 'GET',
        params
    });
}