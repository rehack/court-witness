import Util from '@/libs/util.js';

const service = Util.ajax;

export function add (params) {
    return service({
        url: '/court/infoManage/addJudge.jhtml',
        method: 'GET',
        params
    });
}

// export function getJudgeList () {
//     return service({
//         url: '/court/case/getJudgeList.jhtml',
//         method: 'GET'
//     })
// }
export function getJudgeList () {
    return service({
        url: '/court/infoManage/getAllJudge.jhtml',
        method: 'GET'
    })
}

export function list (params) {
    return service({
        url: '/court/infoManage/queryJudge.jhtml',
        method: 'GET',
        params
    });
}

export function del (ids) {
    const params = {
        ids: ids
    };
    return service({
        url: '/court/infoManage/deleteJudge.jhtml',
        method: 'GET',
        params
    });
}

export function update (params) {
    return service({
        url: '/court/infoManage/modifyJudge.jhtml',
        method: 'GET',
        params
    });
}
