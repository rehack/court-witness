<style lang="less">
    @import "./main.less";
    .ivu-menu li{
        height: 64px;
    }
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <!-- <div class="sidebar-menu-con" :style="{
            width: shrink?'0px':'200px',
            overflow: shrink ? 'visible' : 'auto',
            borderRight: shrink ? 'none' : 'auto'}">
            <shrinkable-menu
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <div slot="top" class="menu-logo-con">
                    <Button :style="{
                            transform: 'rotateZ(' + (this.shrink ? '-180' : '0') + 'deg)',
                            background: shrink ? '#40a9ff' : '#fff',
                            boxShadow: shrink ? 'rgba(0, 0, 0, 0.1) -2px -2px 5px': 'none',
                            padding: 0,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        }"
                        type="text"
                        @click="toggleClick">
                        <img v-show="shrink" src="../images/menu-w.png" alt="">
                        <img v-show="!shrink" src="../images/menu-s.png" alt="">
                    </Button>
                </div>
            </shrinkable-menu>
        </div> -->
        <div class="main-header-con">
            <div class="main-header">
                <div class="navicon-con">
                    <div slot="top" class="logo-con" style="margin-left: 23px;">
                        <img src="../images/logo.gif" key="max-logo" />
                    </div>
                </div>
                <div class="header-middle-con" style="padding:0;margin-left: 113px; right: 375px;">
                    <!-- <Menu mode="horizontal" theme="primary" active-name="1">
                        <MenuItem name="1">
                            <Icon type="ios-paper" />
                            内容管理
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-people" />
                            用户管理
                        </MenuItem>
                    </Menu> -->
                    <shrinkable-menu
                        :shrink="shrink"
                        @on-change="handleSubmenuChange"
                        :theme="menuTheme"
                        :before-push="beforePush"
                        :open-names="openedSubmenuArr"
                        :menu-list="menuList">
                    </shrinkable-menu>
                    <!-- <Menu mode="horizontal" theme="primary" :active-name="$route.name" >
                        <span v-for="(item, d) in menuList">
                            <MenuItem :name="item.name" @click.native="changeMenu(item,d)">
                                <Icon :type="d ==0 ? 'ios-paper' : 'ios-briefcase'" />
                                {{item.title}}
                            </MenuItem>
                        </span>
                    </Menu> -->
                </div>
                
                <div class="header-avator-con" style="width:370px;">
                    <span><h3 style="display:inline-block;float: left;line-height: 60px;">在线举证质证平台</h3></span>
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange" style="margin-left:10px"></full-screen>
                    <message-tip v-model="mesCount"></message-tip>
                    <div class="user-dropdown-menu-con" style="margin-right: 30px;">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon" style="padding: 20px 0 22px;">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name" >{{ userName }}</span>
                                    <Icon type="arrow-down-b" style="margin-bottom:6px"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="changePwd">修改密码</DropdownItem>
                                    <!-- <DropdownItem name="ownSpace">个人中心</DropdownItem> -->
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con" :style="{paddingLeft: shrink?'0px':'0px'}">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'0px':'0px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <changePwd v-show="shows" ref="change"></changePwd>
    </div>
</template>
<script>
    import shrinkableMenu from '../components/main/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from '../components/main/tags-page-opened.vue';
    import breadcrumbNav from '../components/main/breadcrumb-nav.vue';
    import changePwd from '../components/changePwd/changePwd.vue';
    import fullScreen from '../components/main/fullscreen.vue';
    import messageTip from '../components/main/message-tip.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import store from '@/store';
    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            messageTip,
            changePwd
        },
        data () {
            return {
                websock: null,
                shrink: false,
                shows:false,
                userName: '',
                isFullScreen: false,
                activeMenu:0,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr
            };
        },
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            },
            
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.getters.new.length;
            }
        },
        methods: {
            audio () {
                var audio = new Audio('https://court.ptnetwork001.com/dist/static/3424.mp3');
                audio.play();
            },
            sss(){
                console.log(this.menuList)
            },
            changeMenu(data,d){
                console.log(data)
                this.$router.push({
                    name: data.name
                });
                this.activeMenu = d;
                console.log(this.activeMenu)
            },
            initWebSocket () {
                let path = window.location.host
                const wsuri = 'wss://' + path + '/api/web/webSocket.jhtml';
                this.websock = new WebSocket(wsuri);
                this.websock.onopen = function (event) {
            			console.log('WebSocket:已连接');
            			console.log(event);
            		};
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onerror = function (event) {
            			console.log('WebSocket:发生错误 ');
            			console.log(event);
            		};
            		this.websock.onclose = function (event) {
            			console.log('WebSocket:已关闭');
            			console.log(event);
            		}
            },
            websocketonmessage () {
                var data = JSON.parse(event.data);
                let newList = [];
                let readList = [];
                data.map(item => {
                    if (item.isRead == 0) {
                        newList.push(item)
                    } else {
                        readList.push(item)
                    }
                    this.$store.commit('SET_NEW', newList);
                    this.$store.commit('SET_READ', readList);
                })
                if (newList.length != 0) {
                    this.$Notice.info({
                        title: '你有新消息，请注意查收',
                        desc: '信箱中共有' + newList.length + '条未读消息'
                    });
                    this.audio();
                }
            },
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                // this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
                // store.dispatch('ShowNotice');
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$store.dispatch('Logout').then(res => {
                        this.$router.push({
                            name: 'login'
                        });
                    })
                }else if(name == "changePwd"){
                    this.$refs.change.showModel(2);
                    this.shows = true;
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            }
        },
        mounted () {
            this.init();
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
            // this.initWebSocket();
        }
    };
</script>
