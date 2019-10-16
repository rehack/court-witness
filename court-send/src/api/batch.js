import Util from '@/libs/util.js';

const service = Util.ajax;

export function countLitigant (params) {
  return service({
    url: '/court/send/countLitigant.jhtml',
    method: 'GET',
    params
  });
}

export function batchBuildExpress (params) {
  return service({
    url: '/court/send/batchBuildExpress.jhtml',
    method: 'GET',
    params
  });
}

export function getCaseLitigantInfo (params) {
  return service({
    url: '/court/send/getCaseLitigantInfo.jhtml',
    method: 'GET',
    params
  });
}

export function sendAllEMS (params) {
  return service({
    url: '/court/send/sendAllEMS.jhtml',
    method: 'GET',
    params
  });
}

export function findCaseNo (params) {
  return service({
    url: '/court/case/findCaseNo.jhtml',
    method: 'GET',
    params
  });
}

export function getCaseInfo (params) {
  return service({
    url: '/court/case/getCaseInfo.jhtml',
    method: 'GET',
    params
  });
}

export function batchBuildDiploms (data) {
  return service({
    url: '/court/send/batchBuildDiploms.jhtml',
    method: 'post',
    data
  })
}

export function batchBuildDiplomsNew (data) {
  return service({
    url: '/dp/list.jhtml',
    method: 'post',
    data
  })
}

export function batchBuildExpressNew (data) {
  return service({
    url: '/court/send/batchBuildExpressNew.jhtml',
    method: 'post',
    data
  })
}

export function sendEMS (data) {
  return service({
    url: '/court/send/sendEMS.jhtml',
    method: 'post',
    data
  })
}
