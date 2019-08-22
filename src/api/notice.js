import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/notice/add.jhtml',
        method: 'GET',
        params
    });
}

export function list (params) {
    return service({
        url: '/court/notice/list.jhtml',
        method: 'GET',
        params
    });
}

export function del (ids) {
    const params = {
        ids: ids
    };
    return service({
        url: '/court/notice/delete.jhtml',
        method: 'GET',
        params
    });
}

export function edit (params) {
    return service({
        url: '/court/notice/edit.jhtml',
        method: 'GET',
        params
    });
}

export function getById (id) {
    const params = {
        id: id
    };
    return service({
        url: '/court/notice/getById.jhtml',
        method: 'GET',
        params
    });
}

export function sendById (id) {
    const params = {
        id: id
    };
    return service({
        url: '/court/notice/sendMsgById.jhtml',
        method: 'GET',
        params
    });
}

export function NoticeSendConfirmation (lawCaseId, litigantId) {
    const params = {
        lawCaseId,
        litigantId
    };
    return service({
        url: '/court/send/NoticeSendConfirmation.jhtml',
        method: 'GET',
        params
    });
}
