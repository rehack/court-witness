import Cookies from 'js-cookie';
import { login, logout, getUserInfo } from '@/api/user';
import md5 from 'md5';

const user = {
    state: {
        access: [],
        name: '',
        avatar: ''
    },
    mutations: {
        SET_DATA: (state, data) => {
            state.data = data;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ACCESS: (state, access) => {
            state.access = access;
        },
        logout (state, vm) {
            Cookies.remove('user');
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        }
    },
    actions: {
    // 登录
        Login ({ commit }, userInfo) {
            const username = userInfo.userName.trim();
            return new Promise((resolve, reject) => {
                login(username, md5(userInfo.password), userInfo.authCode,userInfo.loginType)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 获取用户信息
        GetUserInfo ({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo()
                    .then(response => {
                        const data = response.data;
                        if(data.state == 100) {
                          commit('SET_ACCESS', data.roleName);
                          commit('SET_NAME', data.result.username);
                          if(data.result.name == null) {
                              Cookies.set('user', data.result.username)
                          } else {
                            Cookies.set('user', data.result.name)
                          }
                        } else {
                          Cookies.set('user', '');
                        }
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        Logout({ commit }) {
          return new Promise((resolve, reject) => {
              logout()
                  .then(response => {
                      const data = response.data;
                      resolve(response);
                  })
                  .catch(error => {
                      reject(error);
                  });
          });
        }
    }
};

export default user;
