import Util from '@/libs/util.js';

const service = Util.ajax;

export function login (username, password, code,loginType) {
    const params = {
        username,
        password,
        code,
        loginType
    };
    return service({
        url: '/main/login.jhtml',
        method: 'post',
        params
    });
}
export function optionRole (roleType,loginId) {
    const params = {
        roleType,
        loginId
    }
    return service({
        url: '/main/optionRole.jhtml',
        method: 'get',
        params
    });
}
/**
 * websoket
 */
export function testWxScan () {
    return service({
        url: '/main/wxScanLogin.jhtml',
        method: 'get',
    });
}

export function wxScanLoginEncoder () {
    return service({
        url: '/main/wxScanLoginEncoder.jhtml',
        method: 'get',
    });
}

export function getCode (phone) {
    const params = {
        phone
    }
    return service({
        url: '/main/phoneCode.jhtml',
        method: 'get',
        params
    });
}
export function registerPhone (phone, mcode) {
    const data = {
        phone,
        mcode
    }
      return service({
          url: '/main/registerPhone.jhtml',
          method: 'post',
          data
      });
}

export function registerAdmin(idCard,password,email,trueAddress) {
    const data = {
        idCard,
        password,
        email,
        trueAddress
    }
    return service({
        url: '/main/registerAdmin.jhtml',
        method: 'post',
        data
    });
}

export function changePassword(oldpassword,newpassword1,newpassword2) {
    const params = {
        oldpassword,
        newpassword1,
        newpassword2
    }
    return service({
        url: '/main/changePassword.jhtml',
        method: 'post',
        params
    });
}

export function phoneLogin (idCard,password,code) {
    const data = {
        idCard,
        password,
        code
    }
    return service({
        url: '/main/phoneLogin.jhtml',
        method: 'post',
        data
    });
}

export function logout () {
    return service({
        url: '/main/loginOut.jhtml',
        method: 'get'
    });
}
export function getUserInfo () {
    return service({
        url: '/main/getUserInfo.jhtml',
        method: 'get'
    });
}
