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
        pageSize: pageData.pageSize || ''
    };
    return service({
        url: '/court/scheduling/list.jhtml',
        method: 'get',
        params
    });
}
/**
 * 案件数量统计
 */
export function caseCount () {
    const params = {

    };
    return service({
        url: '/court/indexCount/caseCount.jhtml',
        method: 'get',
        params
    });
}
/**
 * 近三天庭审排期
 */
export function schedulingCase () {
    const params = {

    };
    return service({
        url: '/court/indexCount/schedulingList.jhtml',
        method: 'get',
        params
    });
}
/**
 * 送达情况统计
 * startData  开始时间
 * endDate 结束时间
 * typeDate 年月分类
 */
export function sendCountDate (yearDate, startData, endDate, typeDate) {
    const params = {
        countyear: yearDate,
        startTime: startData,
        endTime: endDate,
        countType: typeDate
    };
    return service({
        url: '/court/indexCount/getSendTime.jhtml',
        method: 'get',
        params
    });
}
/**
 * 案件案由分布情况统计
 */
export function caseCountDate (startData, endDate) {
    const params = {
        startTime: startData,
        endTime: endDate
    };
    return service({
        url: '/court/indexCount/getBriefCountTen.jhtml',
        method: 'get',
        params
    });
}
/**
 * 案点击显示案件详情
 */
export function lawCaseSchedulding (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/scheduling/indexLawCaseSchedulding.jhtml',
        method: 'get',
        params
    });
}
