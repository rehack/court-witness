<template>
    <div  class="demo-tabs-style2" style="max-height:100%">
        <Tabs type="card" @on-click="changeTab">
            <TabPane label="案件信息">
                <lawcaseInfo :lowCaseId="lawCaseId" :role="role" :plaintiffList="plaintiffList" :defendantList="defendantList" :thirdList="thirdList" :caseInfo="caseInfo" />
            </TabPane>
            <TabPane label="举证和质证详情">
                <courtOnlineCertificate :lowCaseId="lawCaseId" :briefName="briefName" :revertsList="revertsList" ref="revertsList" />
            </TabPane>
            <TabPane label="争议焦点">
                <courFocusInfo :lowCaseId="lawCaseId" :briefName="briefName" ref="fouceList" />
            </TabPane>
            <TabPane label="庭前会议笔录" :disabled="disabled">
                <lawcaseRecord :briefName="caseInfo.caseNo" :lowCaseId="lawCaseId" ref="record" />
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import lawcaseInfo from "@/components/lawcaseInfo/courtLawcaseInfo.vue";
import courtOnlineCertificate from "@/components/onlineCertificate/courtOnlineCertificate.vue";
import courFocusInfo from "@/components/focusInfo/courFocusInfo.vue";
import lawcaseRecord from "@/components/lawcaseRecord/CourtLawcaseRecord.vue";
import {
  findByCaseLitigant,
  modifyCaseInfo,
  addLitigant,
  createDiploms,
  queryCaseNo,
  NetworkKyc,
  listJudgeAndClerk
} from "@/api/case";
import { getEvi, getReverts } from "@/api/witness/lawcaseInfo.js";
import { fouceList } from "@/api/courtWitness/lawCase.js";
export default {
  components: {
    lawcaseInfo,
    courtOnlineCertificate,
    courFocusInfo,
    lawcaseRecord
  },
  data() {
      return{
        caseLoading: false,
        lawCaseId:'',
        disabled:true,
        briefName:'',
        plaintiffList:[],
        defendantList:[],
        thirdList:[],
        revertsList:[],
        role:'',
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
            allMembers: "",
            judgeId:'',
            clerkId:''
        },
      }
  },
  created() {
    if(localStorage.getItem("lawCaseId")){
          console.log(1525)
          this.lawCaseId = localStorage.getItem("lawCaseId");
           this.showCase(this.lawCaseId);
           fouceList(this.lawCaseId).then(res => {
                if(res.data.state == 100){
                    this.value8 = res.data.content;
                        if(res.data.flags == 1){
                            this.disabled = false;
                        }else{
                            this.disabled = true;
                        }
                }else{
                    // this.$Message.error(res.data.message);
                    this.disabled = true;
                }
            })
      }
    },
  mounted() {
        if (this.$route.params) {
            console.log(this.$route.params)
            if(this.$route.params.lawCaseId){
                 var caseId = this.$route.params.lawCaseId;
                this.lawCaseId = caseId;
                localStorage.setItem("lawCaseId",caseId);
                if (caseId) {
                    this.showCase(caseId);
                    fouceList(caseId).then(res => {
                        if(res.data.state == 100){
                            this.value8 = res.data.content;
                                if(res.data.flags == 1){
                                    this.disabled = false;
                                }else{
                                    this.disabled = true;
                                }
                        }else{
                            // this.$Message.error(res.data.message);
                            this.disabled = true;
                        }
                    })
                }
            }

       }
    },
  methods:{
      changeTab(e){
        if(e==1){ //举证和质证
            getReverts(this.lawCaseId).then(res => {
                if(res.data.state == 100){
                    var arr = [];
                    res.data.result.map((item, index) => {
                        const ss = {};
                        ss.dsrName = item.dsrName;
                        ss.dsrStatus = item.dsrStatus;
                        ss.isLawyer = item.isLawyer;
                        arr.push(ss);
                    });
                    for(var i = 0; i < arr.length-1; i++){
                       for(var j = i+1; j < arr.length; j++){
                            if(arr[i].dsrName==arr[j].dsrName){
                                arr.splice(j,1);
                                j--;
                            }
                        }
                    }
                    var newArr = arr;
                    for(var i=0;i<newArr.length;i++){
                        var arySmall = [];
                        res.data.result.map((item, index) => {
                            var colorState = 0;
                            var ty1 = 0;
                            var ty2 = 0;
                            var ty3 = 0;
                            var ty4 = 0;
                            var ty5 = 0;
                            if(item.dsrName==newArr[i].dsrName){
                                for(var t=0;t<item.reverts.length;t++){
                                    item.reverts[t].zhen = item.reverts[t].result.substr(0,1);
                                    item.reverts[t].he = item.reverts[t].result.substr(1,1);
                                    item.reverts[t].guan = item.reverts[t].result.substr(2,1);
                                    if(item.reverts[t].result == '110' || item.reverts[t].result == '011' || item.reverts[t].result == '101'){
                                        ty2 = 1;
                                    }else if(item.reverts[t].result == '100' || item.reverts[t].result == '001' || item.reverts[t].result == '010'){
                                        ty3 = 1;
                                    }else if(item.reverts[t].result == '000'){
                                        ty4 = 1;
                                    }else if(item.reverts[t].result == '111'){
                                        ty5 = 1;
                                    }
                                }
                                if(ty5 == 1){
                                    ty1 = 4;     //全绿色
                                }
                                //越来越多反对
                                if(ty2 == 1){
                                    ty1 = 1;
                                }
                                if(ty3 == 1){
                                    ty1 = 2;
                                }
                                if(ty4 == 1){
                                    ty1 = 3;
                                }
                                if(item.reverts == []){
                                    ty1 = 0;       
                                }
                                for(var t=0;t<item.reverts2.length;t++){
                                    var str1 = item.reverts2[t].result.substr(0,1) == 1 ? "真实性" : "";
                                    var str2 = item.reverts2[t].result.substr(1,1) ==1 ? "合法性" : "";
                                    var str3 = item.reverts2[t].result.substr(2,1) ==1 ? "关联性" : "";
                                    item.reverts2[t].ary = [];
                                    if(str1 != ""){
                                        item.reverts2[t].ary.push(str1);
                                    }
                                    if(str2 != ""){
                                        item.reverts2[t].ary.push(str2);
                                    }
                                    if(str3 != ""){
                                        item.reverts2[t].ary.push(str3);
                                    }
                                }
                                const data2 = {};
                                data2.id = item.evidenceId;
                                data2.prove = item.prove;
                                data2.name = item.name;
                                data2.fileAddr = item.fileAddr;
                                data2.fileName = item.fileName;
                                data2.colorState = ty1;
                                if(ty1 == 0){
                                    if(data2.prove.length > 35){
                                        data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row' }
                                        data2.allText = 1;
                                    }else{
                                        data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row' }
                                        data2.allText = 0;
                                    }
                                    // data2.cellClassName = {  }
                                }else if(ty1 == 1){
                                    if(data2.prove.length > 35){
                                        data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row1' }
                                        data2.allText = 1;
                                    }else{
                                        data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row1' }
                                        data2.allText = 0;
                                    }
                                    colorState = 1;
                                    // data2.cellClassName = { reState: 'demo-table-error-row1' }
                                }else if(ty1 == 2){
                                    if(data2.prove.length > 35){
                                        data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row2' }
                                        data2.allText = 1;
                                    }else{
                                        data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row2' }
                                        data2.allText = 0;
                                    }
                                    // data2.cellClassName = { reState: 'demo-table-error-row2' }
                                    colorState = 2;
                                }else if(ty1 == 3){
                                    if(data2.prove.length > 35){
                                        data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row3' }
                                        data2.allText = 1;
                                    }else{
                                        data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row3' }
                                        data2.allText = 0;
                                    }
                                    // data2.cellClassName = { reState: 'demo-table-error-row3' }
                                    colorState = 3
                                }else if(ty1 == 4){
                                    if(data2.prove.length > 35){
                                        data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row4' }
                                        data2.allText = 1;
                                    }else{
                                        data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row4' }
                                        data2.allText = 0;
                                    }
                                }
                                data2.proveTime = item.time;
                                data2.reverts = item.reverts;
                                data2.reverts2 = item.reverts2;
                                data2.dsrStatus = newArr[i].dsrStatus;
                                data2.dsrName = newArr[i].dsrName;
                                data2.fileL = item.file;
                                data2.where = item.source;
                                data2.isEviChecked = item.eviChecked == true ? '已审核' : '未审核';
                                data2.isSameSite = item.isSameSite;
                                data2.peopleNum = item.reverts.length;
                                arySmall.push(data2);
                            }
                        });
                        newArr[i].eviList = arySmall;
                    }
                    console.log(newArr)
                    var plaintiff = [];
                    var defendant = [];
                    var third = [];
                    var allNewArr = [];
                    var judgeArr = [];
                    for(var i=0;i<newArr.length;i++){
                        if(newArr[i].dsrStatus == '原告'){
                            plaintiff.push(newArr[i]);
                        }else if(newArr[i].dsrStatus == '被告'){
                            defendant.push(newArr[i]);
                        }else if(newArr[i].dsrStatus == '第三人'){
                            third.push(newArr[i])
                        }else if (newArr[i].dsrStatus == '法官'){
                            judgeArr.push(newArr[i])
                        }
                    }
                    allNewArr = {
                        plaintiff:plaintiff,
                        defendant:defendant,
                        third:third,
                        judge:judgeArr,
                    }
                    console.log(allNewArr)
                    this.$refs.revertsList.getRevertsList(allNewArr);
                }else{
                    this.$Message.error(res.data.message);
                }
            })

        }else if(e==2){
            this.$refs.fouceList.getContents(this.lawCaseId);
        }else if(e == 3){
            this.$refs.record.getNote();
        }
      },
      showCase(id) {
        findByCaseLitigant(id)
          .then(res => {
            this.plaintiffList = [];
            this.defendantList = [];
            this.thirdList = [];
            if (res.data.state === 100) {
              const caseInfo = res.data.result.caseInfo;
              const defendantList = res.data.result.defendantList;
              const plaintiffList = res.data.result.plaintiffList;
              const thirdList = res.data.result.thirdList;
              this.briefName = caseInfo.brief.name + '　(' +caseInfo.caseNo + ')' ;
              this.caseInfo.id = caseInfo.id.toString();
              this.caseInfo.caseNo = caseInfo.caseNo;
              this.caseInfo.court = caseInfo.court.name;
              this.caseInfo.judge = caseInfo.judge.name;
              this.caseInfo.clerk = caseInfo.clerk.name;
              this.caseInfo.filingDate = caseInfo.filingDate;
              this.caseInfo.expireDate = caseInfo.expireDate;
              this.caseInfo.brief = caseInfo.brief.name;
              this.caseInfo.applyStandard = caseInfo.applyStandard;
              this.caseInfo.allMembers =
                caseInfo.allMembers == null ? "" : caseInfo.allMembers;
              plaintiffList.map((item, index) => {
                const data = {};
                data.id = item.id;
                data.litigantName = item.litigantName;
                data.identityCard = item.identityCard;
                data.litigantPhone = item.litigantPhone;
                data.address = item.address;
                this.plaintiffList.push(data);
              });
              defendantList.map((item, index) => {
                const data = {};
                data.id = item.id;
                data.litigantName = item.litigantName;
                data.identityCard = item.identityCard;
                data.litigantPhone = item.litigantPhone;
                data.address = item.address;
                this.defendantList.push(data);
              });
              thirdList.map((item, index) => {
                const data = {};
                data.id = item.id;
                data.litigantName = item.litigantName;
                data.identityCard = item.identityCard;
                data.litigantPhone = item.litigantPhone;
                data.address = item.address;
                this.thirdList.push(data);
              });
            }
          })
          .catch(() => {});
        },
  }

}
</script>

<style>
.demo-tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
        background: #fff;
        padding: 16px;
    }

    .demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        border-color: transparent;

    }
</style>
