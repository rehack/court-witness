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
    litigantName:searchData.litigantName || '',
    pageSize: pageData.pageSize || ''
  };
  return service({
    url: '/court/scheduling/list.jhtml',
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

export function findDayTimes (date, judgeId) {
  const params = {
    date,
    judgeId
  };
  return service({
    url: '/court/scheduling/findDayTimes.jhtml',
    method: 'get',
    params
  });
}

export function modify (schedulingId, tribunalId, date) {
  const params = {
    schedulingId,
    tribunalId,
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
export function handArrange (caseId,judgeId,clerkId) {
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
export function calendarList (startYear, startMonth, judgeId) {
  const params = {
    startYear,
    startMonth,
    judgeId
  };
  return service({
    url: '/court/scheduling/calendar/list.jhtml',
    method: 'post',
    params
  });
}
