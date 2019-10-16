import Util from '@/libs/util.js';

const service = Util.ajax;

export function showNotice () {
    return service({
        url: '/court/estFile/showNotice.jhtml',
        method: 'get'
    });
}

export function modiNotice (noticeId) {
    const params = {
        noticeId
    };
    return service({
        url: '/court/estFile/modiNotice.jhtml',
        method: 'get',
        params
    });
}

export function delNotice (noticeId) {
    const params = {
        noticeId
    };
    return service({
        url: '/court/estFile/delNotice.jhtml',
        method: 'get',
        params
    });
}
