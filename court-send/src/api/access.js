import Util from '@/libs/util.js';

const service = Util.ajax;

export function getAllPermissionList (params) {
    return service({
      url: '/dp/getAllPermissionList.jhtml',
      method: 'GET',
      params
    });
  }
  export function addPermission (params) {
    return service({
      url: '/dp/addPermission.jhtml',
      method: 'GET',
      params
    });
  }
  export function editPermission (params) {
    return service({
      url: '/dp/editPermission.jhtml',
      method: 'GET',
      params
    });
  }
  export function deletePermission (params) {
    return service({
      url: '/dp/deletePermission.jhtml',
      method: 'GET',
      params
    });
  }
  export function searchPermission (params) {
    return service({
      url: '/dp/searchPermission.jhtml',
      method: 'GET',
      params
    });
  }