<template>
    
    <div>
        <!-- <h2>欢迎进入湖里法院在线举证质证平台，请点击头部菜单栏进行相关业务查询</h2> -->
        <div>
            <div  v-if="access == 'litigant'">
                <myLawsuit></myLawsuit>
            </div>
            <div v-else>
                <myLawcase></myLawcase>
            </div>
        </div>
    </div>
</template>
<script>
import myLawsuit from '@/views/myLawsuit/myLawsuit.vue';
import myLawcase from '@/views/myLawcase/myLawcase.vue';
import { getUserInfo } from '@/api/user';
export default {
    components: {
        myLawsuit,
        myLawcase
    },
    data() {
      return{
        caseLoading: false,
        access:'',
      }
    },
     mounted () {
         getUserInfo().then(response => {
             console.log(565356262)
            const data = response.data;
            if(data.state == 100) {
                if(data.roleName == '当事人' || data.roleName == '代理人'){
                    this.access = 'litigant';
                }else{
                    this.access = 'judge';
                }
            } else {
                Cookies.set('user', '');
            }
        })
    },
    created() {

    },
}
</script>

