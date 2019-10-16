import Util from '@/libs/util.js';

const service = Util.ajax;

export function bindList (searchData, pageData) {
    const params = {
        caseNo: searchData.caseNo,
        tribunalId: searchData.court,
        briefName: searchData.brief,
        judgeName: searchData.judge,
        clerkName: searchData.clerk,
        startDate: searchData.startDate,
        endDate: searchData.endDate,
        isMaster: searchData.isMaster,
        associate: searchData.associate,
        litigantName: searchData.litigantName,
        pageSize: pageData.pageSize,
        pageNumber: pageData.pageNumber
    };
    return service({
        url: '/court/scheduling/bindList.jhtml',
        method: 'get',
        params
    });
}

export function connectList (caseNo) {
    const params = {
        caseNo
    };
    return service({
        url: '/court/case/noAssociate/lawCase.jhtml',
        method: 'get',
        params
    });
}

export function lawCaseSchedulding (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/scheduling/indexLawCaseSchedulding.jhtml',
        method: 'get',
        params
    });
}

export function lawCaseConnectGet (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/case/associate/lawCase.jhtml',
        method: 'get',
        params
    });
}

export function associate (slaveIds, masterId) {
    const params = {
        slaveIds,
        masterId
    };
    return service({
        url: '/court/case/associate.jhtml',
        method: 'get',
        params
    });
}

export function associateCancel (slaveIds, masterId) {
    const params = {
        slaveIds,
        masterId
    };
    return service({
        url: '/court/case//associate/cancel.jhtml',
        method: 'get',
        params
    });
}
