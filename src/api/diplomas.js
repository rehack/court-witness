import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (name) {
    const params = {
        name
    };
    return service({
        url: '/dp/add.jhtml',
        method: 'GET',
        params
    });
}

export function list (litigantId, name, type, sendId) {
    const params = {
        litigantId: litigantId,
        name: name,
        type: type,
        sendId: sendId
    };
    return service({
        url: '/dp/list.jhtml',
        method: 'GET',
        params
    });
}

export function del (dtId) {
    const params = {
        dtId
    };
    return service({
        url: '/dp/delete.jhtml',
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
        url: '/dp/update.jhtml',
        method: 'POST',
        data
    });
}

export function toPdf (dlIds) {
    const params = {
        dlIds: dlIds
    };
    return service({
        url: '/dp/pdfs2pdf.jhtml',
        method: 'GET',
        params
    });
}
