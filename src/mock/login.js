const userMap = {
    admin: {
        access: 'admin',
        avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Admin'
    },
    editor: {
        access: 'user',
        avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
};

export default {
    login: config => {
        return userMap.admin;
    },
    getUserInfo: () => userMap.admin
};
