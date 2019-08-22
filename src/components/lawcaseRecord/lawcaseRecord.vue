<style scoped>
    .expand-row{
        margin-bottom: 5px;
    }
</style>
<template>
    <div>
        <Card style="margin-bottom:10px">
            <div>{{briefName}}</div>
        </Card>
        <Card style="margin-bottom:10px;text-align:center;" v-show="record">
            <h3>该案件法官暂未发布庭前会议笔录</h3>
        </Card>
        <Card style="margin-bottom:10px;text-align:center" v-show="!record">
            <Button @click="recordShow" size="large" type="ghost">预览庭前会议笔录</Button>
        </Card>
        <Modal
            v-model="modalAdd"
            title="补充争议焦点"
            :loading="loading"
            cancel-text=""
            ok-text="提交"
            @on-ok="asyncOK">
            <Input name="fouce" v-model="value8" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="争议焦点"></Input>
        </Modal>
    </div>
</template>
<script>
import myUpload from '../upload';
import { fouceList, getNotes } from "@/api/courtWitness/lawCase.js";
export default {
    components: {
        myUpload
    },
    created: function() {
        console.log(222);
    },
    data() {
        return{
            caseLoading: false,
            disabled:true,
            dex:false,
            disabled2:true,
            linightDex:true,
            loading:false,
            modalAdd:false,
            record:true,
            value8:'',
            plaintiffList: [],
            defendantList: [],
            thirdList: [],
            caseInfo: {
                id: "",
                caseNo: "",
                court: "",
                judge: "",
                clerk: "",
                filingDate: "",
                expireDate: "",
                brief: "",
                applyStandard: "",
                allMembers: ""
            },
            addFormItem:{
                evidenceName:'',
                pageNum:'',
                evidenceObject:'',
                evidenceWhere:''
            },
            title:"",
            path:'',
        }       
    },
    props: {
      lowCaseId:[Number, String],
      briefName:String,
    },
    methods:{
      edite(){
        if(this.disabled==true){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
        
      },
      getNote(){
        getNotes(this.lowCaseId).then(res => {
            if(res.data.state == 100){
                this.path = res.data.result.path;
                if(res.data.result.isShow == false){
                    this.record = true;
                }else{
                    this.record = false;
                }
            }else{
                this.$Message.error(res.data.message);
            }
        })
      },
      showMod(){
          this.modalAdd = true;
      },
      edite2(){
        if(this.disabled2==true){
          this.disabled2 = false;
        }else{
          this.disabled2 = true;
        }
        
      },
      recordShow(){
          window.open(this.path);
      },
      uploadSuccess (response) {
            if (response.state == 100) {
                this.evidenceInfo.evidenceId = response.result.evidenceId
            } else {
                this.$Message.error(response.message);
            }
        },
      asyncOK(){

      }
    }
};
</script>
<style>
.labe{
    display: inline-block;
    /* text-align: left; */
    margin-left:80px;
}
</style>
