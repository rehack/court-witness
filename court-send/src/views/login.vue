<style lang="less">
@import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
          <div class="login-title">
              <img src="../images/login-logo.gif" width="384px" style="margin: 0 auto">
          </div>
          <Card :bordered="false" style="background: rgba(255,255,255,.6);box-shadow: 0 1px 6px rgba(0,0,0,.2);">
                <div class="tabs">
                    <h3 class="judge-tab" v-show="!qrShow && !isSelectRole">
                        <!-- <span style="padding: 0.5em 0;display:block;font-size:20px">微信扫码登录</span> -->
                        <a class="log-in active">
                            <span>微信扫码登录</span>
                        </a>
                    </h3>
                    <h3 class="litigant-tab" v-show="isSelectRole" style="width:50%">
                        <a class="log-in" :class="isSelectRole == true ? 'active' : ''">
                        <span>请选择登录身份：</span>
                        </a>
                    </h3>
                    <h3 class="litigant-tab" v-show="qrShow && !isSelectRole">
                        <a class="log-in" :class="userType == 'litigant' ? 'active' : ''" @click="userType = 'litigant'">
                        <span>当事人/律师</span>
                        </a>
                    </h3>
                    <h3 class="judge-tab" v-show="qrShow && !isSelectRole">
                        <a class="sign-up" :class="userType == 'judge' ? 'active' : ''" @click="userType = 'judge'">
                        <span>法院工作人员</span>
                        </a>
                    </h3>
                    <!-- <img src="../images/weiL.png" alt=""> -->
                    <img src="../images/weiLogin.png" @click="showCode(1)" v-show="!qrShow && !isSelectRole" alt="">
                    <img src="../images/codeLogin.png" @click="showCode(2)" v-show="qrShow && !isSelectRole" alt="">
                </div>
                <div class="form-con" style="width:388px;height:254px;position: relative;text-align: center;" v-show="!qrShow && !isSelectRole">
                    <div v-show="OCRLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;background: rgba(255,255,255,0.5)">
                        <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-l eft:-30px;margin-left:-40px;" color="#40a9ff" size="80px"/>
                        <!-- <div style="position:absolute;bottom: 200px;left:50%;margin-left:-60px;color:#3399ff;font-size:20px">获取二维码中。。。</div> -->
                    </div>
                    <div v-show="!isLoginS">
                        
                        <div style="height:150px;width:100%;margin-top: 20px;text-align: center;position: relative;">
                            <div class="bgd" v-show="overShow">
                                <p style="margin-top: 40px;" >二维码已失效</p>
                                <Button type="primary" @click="showCode(2)" style="margin-top: 10px;">刷新二维码</Button>
                            </div>
                            <img :src="imgpath" alt="" style="height:150px;width:150px;">
                        </div>
                        
                        <p style="margin-top:8px;margin-bottom:20px">打开<span style="color: #999;font-weight:600">微信app</span>,扫一扫登录</p>
                    </div>
                    <div v-show="isLoginS" style="width:388px;height:179px;margin-bottom:20px;margin-top: 20px;">
                        <h3>登录成功，请选择登录身份：</h3>
                        <Button type="info" style="margin-right: 15px;margin-top:70px">当事人/律师</Button>
                        <Button type="info" style="margin-left:15px;margin-top:70px">法院工作人员</Button>
                    </div>
                    <p class="login-tip">本网站只支持IE9+等现代浏览器</p>
                </div>
                <div class="form-con" v-show="isSelectRole" style="width:388px;height:254px;position: relative;text-align: left;">
                  <Button type="primary" v-for="item in roleList"  @click="selRole(item.type,item.id)" style="margin-top: 10px;width:45%;margin-right:10px;">{{item.name}}</Button>
                </div>
                <div class="form-con" v-show="qrShow && !isSelectRole">
                  <Form :model="userInfo1" :rules="rules" v-show="userType == 'litigant'">
                      <FormItem prop="phone">
                          <Input v-model="userInfo1.idCard" placeholder="请输入身份证号">
                              <span slot="prepend">
                                  <Icon :size="16" type="person"></Icon>
                              </span>
                          </Input>
                      </FormItem>
                       <FormItem prop="password">
                            <Input type="password" v-model="userInfo1.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Input v-model="userInfo1.code" placeholder="请输入验证码" style="width:296px;" />
                            <span class="code-wrapper" @click="changeUserCode">
                                <img height="32px" style="vertical-align: middle;" :src="userCodeSrc" alt="验证码">
                            </span>
                        </FormItem>
                      <FormItem>
                          <Button @click="phoneSubmit" type="primary" long>登录</Button>
                      </FormItem>
                  </Form>
                <Form ref="loginForm" :model="userInfo" :rules="rules" v-show="userType == 'judge'">
                    <FormItem prop="userName">
                        <Input v-model="userInfo.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                <Icon :size="16" type="person"></Icon>
                            </span>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="userInfo.password" placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Input v-model="userInfo.authCode" placeholder="请输入验证码" style="width:296px;" />
                        <span class="code-wrapper" @click="changeCode">
                            <img height="32px" style="vertical-align: middle;" :src="codeSrc" alt="验证码">
                        </span>
                    </FormItem>
                    <FormItem>
                        <Button @click="handleSubmit" type="primary" long>登录</Button>
                    </FormItem>
                </Form>

                 <!-- <p class="login-tip register" @click="register">注册</p> -->
                  <p class="login-tip">本网站只支持IE9+等现代浏览器</p>
                </div>
            </Card>
        </div>
        <Modal
            v-model="PwdModel"
            title="修改密码"
            :loading="loading"
            width="450px"
            @on-ok="asyncOK('addFormItem')">
            <h3 style="text-align:center;margin-bottom:10px">当前登陆密码为初始密码，请修改后再登录</h3>
              <Form :model="addFormItem" ref="addFormItem" :rules='ruleValidate' :label-width="100" inline>
                  <FormItem label="当前登录密码:" style="width: 400px;">
                      <Input v-model="addFormItem.oldpwd" type="password" placeholder="请输入当前登录密码"></Input>
                  </FormItem>
                  <FormItem label="新密码:" style="width: 400px;" prop="newpwd1">
                      <Input v-model="addFormItem.newpwd1" type="password" placeholder="请输入新密码"></Input>
                  </FormItem>
                  <FormItem label="确认新密码:" style="width: 400px;" prop="newpwd2">
                      <Input v-model="addFormItem.newpwd2" type="password" placeholder="请输入新密码"></Input>
                  </FormItem>
              </Form>
        </Modal>
        <Modal
            v-model="loginModal"
            title="提示"
            @on-ok="loginModalok">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </Modal>
        <Certification ref="cer"></Certification>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import store from '@/store';
import util from "@/libs/util.js";
import { getCode, phoneLogin,wxScanLoginEncoder,saveLogin,optionRole,changePassword,login,testWxScan } from '@/api/user.js';
import Certification from '@/components/Certification/Certification.vue';
import md5 from 'md5';
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min.js';
var path = window.location.host;
export default {
    components:{
        Certification,
        ClipLoader
    },
    data () {
        var  validatepsw = function(rule, value, callback){
        let reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
            if(!value){
                return callback(new Error("请输入密码"));
            }else if(!reg.test(value)){
                return callback(new Error("密码必须同时包含字母和数字"))
            }else{
                callback();
            }
        };
        return {
            loginModal:false,
            codeSrc: '/api/main/code.jhtml',
            userCodeSrc: '/api/main/code.jhtml',
            qrShow:true,
            PwdModel:false,
            loading:true,
            imgpath:"",
            isLoginS:false,
            overShow:false,
            OCRLoading:false,
            isSelectRole:false,
            roleList:[],
            loginId:'',
            addFormItem:{
                oldpwd:"",
                newpwd1:"",
                newpwd2:""
            },
            userInfo: {
                userName: '',
                password: '',
                authCode: '',
                loginType:"court",
            },
            userInfo1: {
                idCard: '',
                password: '',
                code: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
            },
             ruleValidate:{
                newpwd1:[{validator:validatepsw, trigger:'blur' },{min:8,message:'请输入最少8位'}],  
                
            },
            courtLogin: false,
            entranceText: '法院工作人员入口',
            getCodeText: '获取验证码',
            canGetCode: true,
            userType: 'litigant'
        };
    },
    created () {
        // 显示打开的页面的列表
        // this.initWebSocket()

    },
    methods: {
        selRole(type,id){
            optionRole(type,this.loginId).then(res => {
                if(res.data.state == 100){
                Cookies.set('user', this.userInfo.userName);
                localStorage.setItem('roleIdToken',id);
                // 加载菜单
                util.initRouter(this);
                this.$router.push({
                        name: 'home_index'
                });
                }else{
                this.$Message.info(res.data.message)
                }
            
            });
        },
        // 法务人员
        handleSubmit () {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    store
                        .dispatch('Login', this.userInfo)
                        .then(res => {
                            let ele = res.data.data;
                            if (res.data.state == 100) {
                                if(res.data.isOriginalPass){
                                this.PwdModel = true;
                                }else{
                                if(ele.roles){
                                    if(ele.roles.length == 1){
                                    optionRole(ele.roles[0].type,"").then(resp => {
                                        if(res.data.state == 100){
                                        Cookies.set('user', this.userInfo.userName);
                                        localStorage.setItem('roleIdToken',ele.roles[0].id);
                                        // 加载菜单
                                        util.initRouter(this);
                                        this.$router.push({
                                                name: 'home_index'
                                        });
                                        }else{
                                        this.$Message.info(res.data.message)
                                        }
                                    })
                                    }else{
                                    this.roleList = ele.roles;
                                    console.log(this.roleList)
                                    this.isSelectRole = true;
                                    }
                                }else{
                                    that.$Message.error("暂无权限,登录失败");
                                }
                                return false;
                                }      
                            } else {
                                this.$Message.error(res.data.message);
                                this.codeSrc = "/api/main/code.jhtml?tm=" + Math.random();
                            }
                            })
                            .catch(() => {
                            this.codeSrc = "/api/main/code.jhtml?tm=" + Math.random();
                    });
                }
            });
        },
        initWebSocket () {
            let path = window.location.host
            let httpNm =  document.location.protocol;
            let wsuri = "";
            if(httpNm == 'https:'){
                wsuri = 'wss://' + path + '/api/login/scan.jhtml';
            }else{
                wsuri = 'ws://' + path + '/api/login/scan.jhtml';
            }
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
                // this.websock.onclose = function (event) {
                    
                //     console.log(event);
                // }
            this.websock.onclose = this.websocketclose;
        },
        websocketonmessage () {
            var data = JSON.parse(event.data);
            let newList = [];
            let readList = [];
            if(data.loginId){
                this.loginId = data.loginId;
                console.log(data)
                if(data.roles.length >1){
                    this.roleList = [];
                    data.roles.map(item => {
                        let ary = item.split(',');
                        let obj = {
                            type:ary[2],
                            id:ary[0],
                            name:ary[1],
                        }
                        this.roleList.push(obj);
                    })
                    this.isSelectRole = true;
                }else if(data.roles.length == 1){
                    let ary = data.roles[0].split(',');
                    optionRole(ary[2],this.loginId).then(res => {
                        if(res.data.state == 100){
                        localStorage.setItem('roleIdToken',ary[0]);
                        // 加载菜单
                        util.initRouter(this);
                        this.$router.push({
                                name: 'home_index'
                        });
                        }else{
                        this.$Message.info(res.data.message)
                        }
                    });
                }
            }
        },
        asyncOK(name){
            this.$refs[name].validate((valid) => {
                        if (!valid) {
                            this.isPass = false;
                            this.$Message.error('密码长度必须大于8且同时包含字母和数字!');     
                        }else{
                        this.isPass =true;
                        } 
                })
            if(!this.isPass){
                this.changeLoading ();
                return false;
            } 
            if(this.addFormItem.oldpwd == ""){
                this.$Message.info("请输入当前登录密码");
                this.changeLoading ();
                return false;
            }
            if(this.addFormItem.newpwd1 != this.addFormItem.newpwd2){
                this.$Message.info("密码不一致");
                this.changeLoading ();
                return false;
            }
            changePassword(md5(this.addFormItem.oldpwd),md5(this.addFormItem.newpwd1),md5(this.addFormItem.newpwd2)).then(res => {
                var that = this;
                if(res.data.state == 100){
                    this.PwdModel=false
                this.$Message.success(res.data.message); 
                this.changeLoading ();
                this.$router.push({
                    name: "login"
                });
                this.changeLoading ();
                }else{
                this.$Message.info(res.data.message);
                this.changeLoading ();
                }
            })
        },
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        websocketclose(){
            this.websock.onclose;
            console.log('WebSocket:已关闭');
        },
        showCode(dex){
            this.overShow = false;
            var that = this;
            if(dex == 2){
                this.imgpath = "";
                this.OCRLoading = true;
                // 
                wxScanLoginEncoder().then(res => {
                    this.OCRLoading = false;
                    this.imgpath ='/' +  res.data.path;
                    this.initWebSocket ();
                    // testWxScan().then(res => {
                      
                    // })
                    window.setTimeout(function(){
                        console.log(that.isLoginS)
                        if(that.isLoginS == false){
                        console.log(777)                            
                            that.overShow = true;
                            that.websocketclose();
                        }
                    }
                    , 1000 * 100);
                })
                
                this.qrShow = false;
            }else{
                this.websocketclose();
                this.qrShow = true;
            }
        },
        // 当事人
        phoneSubmit () {
            login(this.userInfo1.idCard, md5(this.userInfo1.password), this.userInfo1.code,'litigant').then(res => {
                let ele = res.data.data;
                if (res.data.state == 100) {
                    if(res.data.isOriginalPass){
                        this.PwdModel = true;
                    }else{
                        if(ele.roles){
                            if(ele.roles.length == 1){
                            optionRole(ele.roles[0].type,"").then(resp => {
                                if(res.data.state == 100){
                                Cookies.set("user", this.userInfo1.idCard);
                                localStorage.setItem('roleIdToken',ele.roles[0].id);
                                // 加载菜单
                                util.initRouter(this);
                                this.$router.push({
                                        name: 'home_index'
                                });
                                }else{
                                this.$Message.info(res.data.message)
                                }
                            })
                            }else{
                            this.roleList = ele.roles;
                            console.log(this.roleList)
                            this.isSelectRole = true;
                            }
                        }else{
                            that.$Message.error("暂无权限,登录失败");
                        }
                        // optionRole(ele.roles[0].type,"").then(resp => {
                        //     if(res.data.state == 100){
                        //     Cookies.set('user', this.userInfo.userName);
                        //     localStorage.setItem('roleIdToken',ele.roles[0].id);
                        //     util.initRouter(this);
                        //     this.$router.push({
                        //             name: 'home_index'
                        //     });
                        //     }else{
                        //     this.$Message.info(res.data.message)
                        //     }
                        // })
                        // this.$router.push({
                        //     name: "home_index"
                        // });
                    }
                }else if(res.data.state == 102){
                    this.$refs.cer.show(res.data.data.imagePath)
                }else if (res.data.state == 103) {
                    this.$refs.cer.show(res.data.data.imagePath)
                }
                else {
                    this.$Message.error(res.data.message);
                }
            });
        },
        loginModalok(){
            window.open='https://dq.hlcourt.gov.cn/'
        },
        changeCode () {
            this.codeSrc = '/api/main/code.jhtml?tm=' + Math.random();
        },
        changeUserCode(){
           this.userCodeSrc = '/api/main/code.jhtml?tm=' + Math.random();
        },
        changeEntrance () {
            this.courtLogin = !this.courtLogin;
            this.entranceText = this.courtLogin ? '当事人入口' : '法院工作人员入口';
        },
        ckickGetCode () {
            if (this.canGetCode) {
                getCode(this.userInfo1.phone).then(res => {
                    if (res.data.state == 100) {
                        this.$Message.success(res.data.message);
                        this.getCodeText = 59;
                        this.canGetCode = false;
                        var that = this;
                        var timmer = setInterval(function () {
                            that.getCodeText -= 1;
                            if (that.getCodeText == 0) {
                                that.getCodeText = '获取验证码';
                                that.canGetCode = true;
                                clearInterval(timmer);
                            }
                        }, 1000);
                    } else {
                        this.$Message.error(res.data.message);
                    }
                });
            }
        },
        register(){
            this.$router.push({
                    name: 'register'
                });
        }
    }
};
</script>

<style>
.code-wrapper {
  cursor: pointer;
}
.bgd{
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 50%;
    right: 0px;
    background: hsla(0,0%,100%,.95);
    text-align: center;
    width: 150px;
    margin-left: -75px;
}
.entrance {
  color: #40a9ff;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
}
.tabs {
  overflow: hidden;
}
.tabs * {
  -webkit-transition: 0.25s ease-in-out;
  -moz-transition: 0.25s ease-in-out;
  -o-transition: 0.25s ease-in-out;
  transition: 0.25s ease-in-out;
}

.tabs h3 {
  float: left;
  width: 32%;
  cursor: pointer;
}
.tabs img{
    float: right;
    cursor: pointer;
}
.tabs h3 a {
  padding: 0.5em 0;
  text-align: center;
  font-weight: 400;
  display: block;
  color: #666;
  border: 0;
}
.tabs h3 a.active {
  color: #000;
}
.tabs h3 a.active span {
  padding-bottom: 4px;
  border-bottom: 1px solid #40a9ff;
}
.tabs-content {
  padding: 1.5em 3em;
  text-align: left;
  width: auto;
}
</style>
