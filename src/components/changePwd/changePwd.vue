<template>
    <Modal
        v-model="PwdModel"
        title="修改密码"
        :loading="loading"
        width="450px"
        @on-ok="asyncOK('addFormItem')">
        <h3 v-show="strh" style="text-align:center;margin-bottom:10px">当前登陆密码为初始密码，请修改后再登录</h3>
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
</template>

<script>
import {changePassword,} from '@/api/user';
import md5 from 'md5';
export default {
    data(){
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
        return{
            PwdModel:true,
            loading:true,
            strh:false,
            addFormItem:{
                oldpwd:"",
                newpwd1:"",
                newpwd2:""
            },
            ruleValidate:{
                newpwd1:[{validator:validatepsw,trigger:'blur' },{min:8,message:'请输入最少8位'}],  
            },
        }
    },
    methods:{
        showModel(str){
            if(str == 1){   //登录页面
                this.strh = true;
            }else{
                this.strh = false;
            }
            this.PwdModel = true;
            this.addFormItem.oldpwd ="";
            this.addFormItem.newpwd1 ="";
            this.addFormItem.newpwd2 = "";
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
                if(res.data.state == 100){
                this.$Message.success(res.data.message);
                this.$store.commit("logout", this);
                this.$store.commit("clearOpenedSubmenu");
                this.$store.dispatch("Logout").then(res => {
                    this.$router.push({
                    name: "login"
                    });
                });
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

    }
}
</script>
