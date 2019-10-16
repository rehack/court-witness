import Util from '@/libs/util.js'

const service = Util.ajax

export function vacationList (searchData, pageData) {
    const params = {
        name: searchData.name,
        courtId: '',
        judgeType: searchData.judgeType,
        state: searchData.state,
        startDate: searchData.startDate,
        endDate: searchData.endDate,
        pageNumber: pageData.pageNumber,
        pageSize: pageData.pageSize
    }
    return service({
        url: '/court/scheduling/vacation/list.jhtml',
        method: 'get',
        params
    })
}

export function vacationCancel (vacationId) {
    const params = {
        vacationId
    }
    return service({
        url: '/court/scheduling/vacation/cancel.jhtml',
        method: 'get',
        params
    })
}
export function addVacation (startDate, endDate) {
    const params = {
        startDate,
        endDate
    };
    return service({
        url: '/court/scheduling/addVacation.jhtml',
        method: 'get',
        params
    });
}
