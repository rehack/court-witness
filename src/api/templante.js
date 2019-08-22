import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/message_template/add.jhtml',
        method: 'GET',
        params
    });
}

export function list () {
    return service({
        url: '/dpt/list.jhtml',
        method: 'GET'
    });
}

export function del (dtId) {
    const params = {
        dtId
    };
    return service({
        url: '/dpt/delete.jhtml',
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
        url: '/dpt/update.jhtml',
        method: 'POST',
        data
    });
}

export function senList (type, pageNo) {
    const params = {
        type: type,
        pageNo: pageNo
    };
    return service({
        url: '/court/message_template/list.jhtml',
        method: 'GET',
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

export function addressList (litigantId) {
    const params = {
        litigantId
    };
    return service({
        url: '/court/send/queryLitigantSendAddress.jhtml',
        method: 'GET',
        params
    });
}
