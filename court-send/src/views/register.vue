<style lang="less">
@import "./login.less";
</style>

<template>
    <div class="login">
       <div class="login-con">
            <div class="login-title">
              <img src="../images/login-logo.gif" width="384px" style="margin: 0 auto">
            </div>

              <Card :bordered="false" style="background: rgba(255,255,255,.6);box-shadow: 0 1px 6px rgba(0,0,0,.2);">  
                <div class="form-con">
                    <Form :model="userInfo" :rules="rules" v-show="success">
                      <FormItem prop="phone">
                          <Input v-model="userInfo.phone" placeholder="请输入手机号码">
                              <span slot="prepend">
                                  <Icon :size="16" type="person"></Icon>
                              </span>
                          </Input>
                      </FormItem>
                      <FormItem>
                          <Input v-model="userInfo.authCode" placeholder="请输入验证码" style="width:292px;" />
                          <span class="code-wrapper ivu-btn ivu-btn-primary" :style="canGetCode ? '':'background: #999;border-color:#999;width:92px;'" @click="ckickGetCode">
                              {{ getCodeText }}
                          </span>
                      </FormItem>
                       <FormItem>
                          <Button @click="phoneSubmit"  type="primary" long>下一步</Button>
                      </FormItem>
                      </Form>
                      <Form :model="userInfo1" :rules="rules"  ref="userInfo" v-show="nextInfo">
                      <FormItem prop="phone">
                          <Input v-model="userInfo1.idCard" placeholder="请输入身份证号/统一社会信用代码">
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
                        <FormItem prop="rePassword">
                            <Input type="password" v-model="userInfo1.surePassword" placeholder="确认密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="phone">
                          <Input v-model="userInfo1.email" placeholder="请输入邮箱">
                              <span slot="prepend">
                                  <Icon :size="16" type="email"></Icon>
                              </span>
                          </Input>
                      </FormItem>
                       <FormItem prop="password">
                            <Input  v-model="userInfo1.trueAddress" placeholder="请输入地址">
                                <span slot="prepend">
  
                                    <Icon :size="14" type="ios-home"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                      <FormItem>
                          <Button @click="userinfoSubmit"  type="primary" long>提交</Button>
                      </FormItem>
                  </Form>
                  <p class="login-tip">本网站只支持IE9+等现代浏览器</p>
                </div>
              </Card>
        
       </div>
    
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import store from '@/store';
import { getCode,registerPhone,registerAdmin} from '@/api/user.js';
var path = window.location.host;
export default {
    data () {
        const validatePassCheck = (rule, value, callback) => {
            if (this.userInfo1.surePassword === '') {
                callback(new Error('密码不能为空！'));
            } else if (this.userInfo1.surePassword != this.userInfo1.password) {
                console.log(this.userInfo1.surePassword);
                console.log(this.userInfo1.password)
                callback(new Error('两次密码输入不一致!'));
            } else {
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (this.userInfo1.password === '') {
                callback(new Error('密码不能为空'));
            } else {
                if (this.userInfo1.surePassword !== '') {
                    // 对第二个密码框单独验证
                    console.log(5858)
                    this.$refs.userInfo.validateField('rePassword');
                }
                callback();
            }
        };
        return {
            
            userInfo: {
                phone: "",
                authCode: ""
            },
             userInfo1: {
                idCard: "",
                password: "",
                surePassword:'',
                email:'',
                trueAddress:''

            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [{ validator: validatePass, trigger: 'blur' }],
                rePassword:[{validator: validatePassCheck, trigger: 'change'}]
            },
            courtLogin: false,
            getCodeText: '获取验证码',
            canGetCode: true,
            userType: 'litigant',
            success:true,
            nextInfo:false
        };
       
    },
    methods: {
      ckickGetCode() {
      if (this.canGetCode) {
        getCode(this.userInfo.phone).then(res => {
          if (res.data.state == 100) {
            this.$Message.success(res.data.message);
            this.getCodeText = 59;
            this.canGetCode = false;
            var that = this;
            console.log(res.data)
            var timmer = setInterval(function() {
              that.getCodeText -= 1;
              if (that.getCodeText == 0) {
                that.getCodeText = "获取验证码";
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
    phoneSubmit() {
      registerPhone(this.userInfo.phone, this.userInfo.authCode).then(res => {
        if (res.data.state == 100) {
            console.log(res.data.admin)
            if(res.data.admin.idCard){
                this.userInfo1.idCard = res.data.admin.idCard
            }
        this.success = false;
        this.nextInfo = true;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    userinfoSubmit(){
     registerAdmin(this.userInfo1.idCard,this.userInfo1.password, this.userInfo1.email, this.userInfo1.trueAddress).then(res => {
        //  console.log(res)
        //  console.log(this.userInfo1.idCard)
        if (res.data.state == 100) {
            this.$Message.info('注册成功')
             this.$router.push({
                    name: 'login'
                }); 
        } else {
            console.log(222)
          this.$Message.error(res.data.message);
        }
      });  
    }
    }
};
</script>

<style>
.code-wrapper {
  cursor: pointer;
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
  width: 50%;
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
