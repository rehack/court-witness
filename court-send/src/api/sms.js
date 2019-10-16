import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/message_template/add.jhtml',
        method: 'GET',
        params
    });
}

export function selfEditingSms (params) {
    return service({
        url: '/court/smslist/selfEditingSms.jhtml',
        method: 'GET',
        params
    });
}

export function list (params) {
    return service({
        url: '/court/message_template/getBy.jhtml',
        method: 'GET',
        params
    });
}

export function del (clerkNos) {
    const params = {
        clerkNos: clerkNos
    };
    return service({
        url: '/court/message_template/edit.jhtml.jhtml',
        method: 'GET',
        params
    });
}

export function update (params) {
    return service({
        url: '/court/infoManage/modifyClerk.jhtml',
        method: 'GET',
        params
    });
}

export function smslist (params) {
    return service({
        url: '/court/smslist/list.jhtml',
        method: 'GET',
        params
    });
}
