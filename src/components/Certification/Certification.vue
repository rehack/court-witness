<style>
.blackback{
    background-color: black;
    opacity: 0.6;
    position: fixed;
    top:0;
    left: 0;
    width:100%;
    height: 100%;
    z-index: 999;
}
.midleImg{
    width:250px;
    height: 300px;
    position: fixed;
    top:50%;
    left:50%;
    margin-top:-150px;
    margin-left:-125px;
    background: #fff;
    z-index: 1000;
    opacity: 1;
}
.clos{
    z-index: 1000;
    font-size: 50px;
    position: fixed;
    top: 100px;
    right: 100px;
    color: #fff;
    cursor: pointer;
}
</style>

<template>
    <div>
        <div class="blackback" v-show="imgshow1">
            
            <span class="clos" @click="cloaseImg"><Icon type="ios-close" /></span>
        </div>
        <div class="midleImg" v-show="imgshow2">
            <p  style="text-align:center;line-height:50px;font-size: 18px;color:#fff;background: #09BB07">请微信扫码实名认证</p>
            <img :src="imgpath" alt="" style="height:250px;width:250px">
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            imgshow1:false,
            imgshow2:false,
            imgpath:"",
        }
    },
    props: {
    //   imgpath:{
    //     type: String,
    //     default: ''
    //   }
    },
    methods: {
        cloaseImg(){
            this.imgshow1 = false;
            this.imgshow2 = false;
        },
        show(path){
            this.imgshow1 = true;
            this.imgshow2 = true;
            this.imgpath = path;
        },
    }
}
</script>
