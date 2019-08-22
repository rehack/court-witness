<style scoped>
    .expand-row{
        margin-bottom: 5px;
    }
</style>
<template>
    <div>
        <Card style="margin-bottom:10px">
            <h4>提示：法院判决前，双方均可在线调解。</h4>
        </Card>
        <Card style="margin-bottom:10px">
            <Tabs  :animated="false" @on-click="changeTab">
                <TabPane label="案件信息">
                    <Card  style="margin-bottom:10px">
                        <div v-show="caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;background: rgba(255,255,255,0.5)">
                        <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                        </div>
                        <table class="bookbuilding-table" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td>案号</td>
                                <td>
                                <span>{{ caseInfo.caseNo }}</span>
                                </td>
                                <td>承办部门</td>
                                <td>
                                <span>{{ caseInfo.court }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>承办人</td>
                                <td>
                                <span>{{ caseInfo.judge }}</span>
                                </td>
                                <td>书记员</td>
                                <td>
                                <span>{{ caseInfo.clerk }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>立案日期</td>
                                <td>
                                <span>{{ caseInfo.filingDate | formatDate }}</span>
                                <!-- <DatePicker type="date" :value="caseInfo.filingDate" @on-change="changeDate" style="width: 98%;vertical-align:baseline;" v-show="changeCaseInfo"></DatePicker> -->
                                </td>
                                <td>审限届满日期</td>
                                <td>
                                <span>{{ caseInfo.expireDate | formatDate }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>立案案由</td>
                                <td>
                                <span>{{ caseInfo.brief }}</span>
                                </td>
                                <td>申请标的</td>
                                <td>
                                <span>{{ caseInfo.applyStandard }}元</span>
                                </td>
                            </tr>
                            <tr>
                                <td>合议庭成员</td>
                                <td colspan="3">
                                <span>{{ caseInfo.allMembers }}</span>
                                </td>
                            </tr>
                        </table>
                    </Card>
                    <Card  style="margin-bottom:10px">
                        <p slot="title">
                            <Icon type="person"></Icon>
                            原告信息
                        </p>
                        <div v-show="this.caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index: 99;background: rgba(255,255,255,0.5)">
                          <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                        </div>
                        <Table :columns="columns" :data="plaintiffList"></Table>
                    </Card>
                    <Card  style="margin-bottom:10px">
                        <p slot="title">
                            <Icon type="person"></Icon>
                            被告信息
                        </p>
                        <div v-show="this.caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index: 99;background: rgba(255,255,255,0.5)">
                          <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                        </div>
                        <Table :columns="columns" :data="defendantList"></Table>
                    </Card>
                    <Card  style="margin-bottom:10px">
                        <p slot="title">
                            <Icon type="person"></Icon>
                            第三人信息
                        </p>
                        <div v-show="this.caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index: 99;background: rgba(255,255,255,0.5)">
                          <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                        </div>
                        <Table :columns="columns" :data="thirdList"></Table>
                    </Card>
                </TabPane>
                <TabPane label="进展详情" style="padding-left:30px">
                  <mySteps :current="2" direction="vertical" v-show="stepList.length > 0">
                      <myStep v-for="(item, index) in stepList" :icon="index == 0 ? 'compose' : '' " :status="index == 0 ? 'process' : 'finish'" :title="item.createDate | formatStartDate" :content="item.operatorContent" :people="item.operatorName"></myStep>
                  </mySteps>
                  <div v-show="stepList.length == 0" style="text-align: center;color:#999;">
                    暂无数据
                  </div>
                </TabPane>
                <TabPane label="起诉状">
                    <Card  style="margin-bottom:10px" v-show="ygShow">
                        <p slot="title">
                            诉讼请求
                            <!-- <span v-show="!ygShow" class="right-btn" @click="edit">{{ disableds ? '添加' : '保存' }}</span> -->
                        </p>
                        <div v-show="this.caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index: 99;background: rgba(255,255,255,0.5)">
                          <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                        </div>
                        <div style="min-height:50px;letter-spacing: 2px;text-indent: 2em;">{{claimContent}}</div>
                        <!-- <Input v-show="!ygShow" v-model="claimContent"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请添加编辑诉讼请求"></Input> -->
                    </Card>
                    <Card  style="margin-bottom:10px" v-show="ygShow">
                        <p slot="title">
                            事实与理由
                            <!-- <span v-show="!ygShow" class="right-btn" @click="edit2">{{ disableds2 ? '添加' : '保存' }}</span> -->
                        </p>
                        <div v-show="this.caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index: 99;background: rgba(255,255,255,0.5)">
                          <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                        </div>
                        <div  style="min-height:50px;letter-spacing: 2px;text-indent: 2em;">{{couse}}</div>
                        <!-- <Input v-show="!ygShow" v-model="couse"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请添加编辑事实与理由"></Input> -->
                    </Card>

                    <div  style="margin-bottom:10px" v-show="!ygShow">
                      <label for="fouce1">诉讼请求：</label>
                      <Input v-show="!ygShow" style="margin-bottom:15px" v-model="claimContent" name="fouce1"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请添加编辑诉讼请求"></Input>
                      <label for="fouce2" >事实与理由：</label>
                      <Input v-show="!ygShow" v-model="couse" name="fouce2"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请添加编辑诉讼请求"></Input>
                    </div>
                    <div v-show="!ygShow">
                      <Button @click="saveSu" type="info" style="margin-left:10px;float:left">保存</Button>
                    </div>
                    <div style="margin-top: 10px; text-align: right;">
                        <!-- <Button @click="" type="info">预览</Button>   -->
                        <!-- <Button @click="" type="info" style="margin-left:20px">打印</Button> -->
                    </div>
                </TabPane>

                <TabPane label="答辩状">
                  <div v-show="answerLiti">
                    <Card  style="margin-bottom:10px">
                          <p slot="title">
                              诉讼请求
                              <span class="right-btn" @click="edite">{{ disabled ? '编辑' : '保存' }}</span>
                          </p>
                          <div v-show="this.caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index: 99;background: rgba(255,255,255,0.5)">
                            <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                          </div>
                          <Input v-model="opinion" :disabled='disabled' type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="诉讼请求"></Input>
                      </Card>
                      <Card  style="margin-bottom:10px">
                          <p slot="title">
                              事实与理由
                              <span class="right-btn" @click="edite2">{{ disabled2 ? '编辑' : '保存' }}</span>
                          </p>
                          <div v-show="this.caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index: 99;background: rgba(255,255,255,0.5)">
                            <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                          </div>
                          <Input v-model="factsReasons" :disabled='disabled2' type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="事实与理由"></Input>
                      </Card>
                    </div>
                    <div v-show="answerLitiResult" style="text-align:center;min-height:50px"><h3>暂无答辩状</h3></div>
                    <Card  style="margin-bottom:10px" v-for="item in answerList" v-show="!answerLiti">
                    <!-- <span  class="ygBtn" style="margin-left:10px;margin-bottom:10px">{{item.bgStatus}}</span>  -->
                    <span  style="margin-left:10px">{{item.bgName}}</span>                      
                        <Row  style="margin-bottom:5px">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                               答辩意见：
                            </Col>
                            <Col span="19" >
                                <span  style="letter-spacing: 2px;">{{item.opinion}}</span>
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:5px">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                               事实与理由：
                            </Col>
                            <Col span="19" >
                                <span  style="letter-spacing: 2px;">{{item.factsReasons}}</span>
                            </Col>
                        </Row>
                    </Card>
                    <div style="margin-top: 10px; text-align: right;display:none">
                        <Button @click="" type="info">补充意见</Button>
                        <Button @click="" type="info">结束答辩</Button> 
                        <Button @click="" type="info" style="margin-left:10px">预览</Button> 
                        <Button @click="" type="info" style="margin-left:10px">打印</Button>
                    </div>
                    <Modal
                        v-model="modalAdd"
                        title="发表意见"
                        :loading="loading"
                        cancel-text=""
                        @on-ok="asyncOK">
                        <Input v-model="value8"  type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="发表意见"></Input>
                    </Modal>
                </TabPane>
            </Tabs>
           
        </Card>
    </div>
</template>
<script>
import myStep from '@/components/step'
import mySteps from '@/components/steps'
import { lawcaseEvolve, getIndict, getAnswers, editAns, addIndict } from "@/api/witness/lawcaseInfo.js";
import { formatDate } from '@/libs/date'
import { ClipLoader } from "vue-spinner/dist/vue-spinner.min.js";

export default {
    components: {
      'mySteps': mySteps,
      'myStep': myStep,
      ClipLoader
    },
    data() {
        return{
            caseLoading: false,
            disabled:true,
            ygShow:true,
            disableds:true,
            disableds2:true,
            disabled2:true,
            opinion:"",
            answerLiti:true,
            factsReasons:"",
            answerList:[],
            couse:"",
            loading:false,
            answerLitiResult:false,
            modalAdd:false,
            value8:'',
            status:4,
            claimContent:"",
            recordData:[],
            stepList: [],
            isself:'',
            columns: [
              {
                title: "当事人",
                key: "litigantName",
                width: "180px",
                align: "center"
              },
              {
                title: "身份证号/统一信用码",
                key: "identityCard",
                align: "center"
              },
              {
                title: "手机号码",
                key: "litigantPhone",
                align: "center"
              },
              {
                title: "地址",
                key: "address",
                align: "center"
              }
            ],
            title:""
        }       
    },
    mounted() {
    },

    props: {
      lowCaseId: {
            type: [Number, String],
            default: ''
      },
      plaintiffList: {
            type: Array,
            default: []
      },
      defendantList: {
            type: Array,
            default: []
      },
      thirdList: {
            type: Array,
            default: []
      },
      caseInfo: {
            type: Object,
            default: ''
      },
      litiRole:{
        type: String,
        default: ''
      }
    },
    created() {
      
    },
    methods:{
      edite(){  //编辑答辩状诉讼请求
        if(this.disabled==true){
          this.disabled = false;
        }else{
          this.disabled = true;
          var hih = "";
          editAns(this.lowCaseId, this.opinion, hih).then(res => {
            if (res.data.state == 100) {
                  this.$Message.success(res.data.message);
            } else {
                this.$Message.error(res.data.message);
            }
          })
        }
        
      },
      edite2(){ //编辑答辩状事实与理由
        if(this.disabled2==true){
          this.disabled2 = false;
        }else{
          this.disabled2 = true;
          var hih = "";
          editAns(this.lowCaseId, hih, this.factsReasons).then(res => {
            if (res.data.state == 100) {
                  this.$Message.success(res.data.message);
            } else {
                this.$Message.error(res.data.message);
            }
          })
        }
        
      },
      saveSu(){
        addIndict(this.lowCaseId, this.claimContent, this.couse).then(res => {
          if (res.data.state == 100) {
                this.$Message.success(res.data.message);
                getIndict(this.lowCaseId).then(res => {
                  if(res.data.isEdit == true){
                    this.ygShow = false;
                  }else{
                    this.ygShow = true;
                  }
                  if (res.data.state == 100) {
                    if(res.data.result){
                      this.claimContent = res.data.result.claim == null ? "暂无" : res.data.result.claim;
                      this.couse = res.data.result.cause  == null ? "暂无" : res.data.result.cause;
                    }else{
                      this.claimContent = "暂无";
                      this.couse = "暂无";
                    }   
                    
                  } else {
                    this.claimContent = "暂无";
                    this.couse = "暂无";
                    // this.$Message.error(res.data.message);
                  }
                });
          } else {
              this.$Message.error(res.data.message);
          }
        })
      },
      getQi(){

      },
      edit(){
        if(this.disableds == true){
          this.disableds = false;
        }else{
          this.disableds = true;
          var cont = "";
          addIndict(this.lowCaseId, this.claimContent, cont).then(res => {
            if (res.data.state == 100) {
                  this.$Message.success(res.data.message);
            } else {
                this.$Message.error(res.data.message);
            }
          })
        }
      },
      edit2(){
        if(this.disableds2 == true){
          this.disableds2 = false;
        }else{
          this.disableds2 = true;
          var cont = "";
          addIndict(this.lowCaseId, cont, couse).then(res => {
            if (res.data.state == 100) {
                  this.$Message.success(res.data.message);
            } else {
                this.$Message.error(res.data.message);
            }
          })
        }
      },
      asyncOK(){

      },
      changeTab(e){
      console.log(this.lowCaseId)
        if(e == 1){ //进展详情
          lawcaseEvolve(this.lowCaseId).then(res => {
            if (res.data.state == 100) {
               console.log(res.data)
               this.stepList = res.data.result
            } else {
              this.$Message.error(res.data.message);
            }
          });
        }else if(e == 2){ //起诉状
          getIndict(this.lowCaseId).then(res => {
            if(res.data.isEdit == true){
              this.ygShow = false;
            }else{
              this.ygShow = true;
            }
            if (res.data.state == 100) {
              if(res.data.result){
                this.claimContent = res.data.result.claim == null ? "暂无" : res.data.result.claim;
                this.couse = res.data.result.cause  == null ? "暂无" : res.data.result.cause;
              }else{
                this.claimContent = "暂无";
                this.couse = "暂无";
              }   
               
            } else {
              this.claimContent = "暂无";
              this.couse = "暂无";
              // this.$Message.error(res.data.message);
            }
          });
        }else if(e == 3){ //答辩状 
          if(this.litiRole == "被告"){
             this.isself = 1;
             this.answerLiti = true;
          }else{
             this.isself = "";
             this.answerLiti = false;
          }
          getAnswers(this.lowCaseId, this.isself).then(res => {
            if (res.data.state == 100){
              if(this.isself == 1){
                this.factsReasons = res.data.result[0].factsReasons;
                this.opinion = res.data.result[0].opinion;
              }else{
                if(res.data.result.length == 0){
                  this.answerLitiResult = true;
                }
                res.data.result.map((item, index) => {
                    const data = {};
                    data.factsReasons = item.factsReasons;
                    data.opinion = item.opinion;
                    data.bgName = item.bgName;
                    data.bgStatus = item.bgStatus;
                    this.answerList.push(data);
                });
                
              }
              
            }else{
              this.answerLiti = false;
              this.answerLitiResult = true;
              // this.$Message.error(res.data.message);
            }
          })
        }
      }
    },
  filters: {
      formatDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
      },
      whether(boole) {
          return boole ? '是' : '否';
      },
      filCheck(boole) {
          return boole == 0 ? '未确认' : '已确认';
      },
      formatStartDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
  }
};
</script>
<style lang="less" scoped>
.ivu-select-single .ivu-select-selection .ivu-select-selected-value,
.ivu-input {
  font-size: 14px;
}
.ivu-input {
  font-size: 14px;
}
.side-bar {
  display: inline-block;
  width: 250px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 99;
  transition: all 0.5s;
}
.ivu-card .ivu-card-head {
  padding: 8px 16px;
}
.close-icon {
  margin-left: 130px;
  cursor: pointer;
}
.close-icon:hover {
  color: #40a9ff;
}
.card-content {
  min-height: 400px;
  max-height: 600px;
  .search-wrapper {
    margin-top: 20px;
    .ivu-input-wrapper .ivu-icon {
      cursor: pointer;
    }
  }
}
.search-list-wrapper {
  margin-top: 20px;
  font-size: 13px;
  max-height: 340px;
  overflow: auto;
  li {
    line-height: 30px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }
  li:hover {
    color: #40a9ff;
  }
}
.search-list-empty {
  margin-top: 20px;
  font-size: 13px;
  text-align: center;
  color: #ed3f14;
}
.btn-group {
  display: inline-block;
  padding: 3px 18px;
  vertical-align: top;
  transition: all 0.5s;
}
.right-wrapper {
  display: inline-block;
  width: 100%;
  padding-left: 220px;
  position: absolute;
  top: 50px;
  left: 0px;
  transition: all 0.5s;
  .ivu-card {
    margin-bottom: 20px;
    .ivu-card-head {
      border-top: 2px solid #40a9ff;
      p {
        color: #fff;
      }
      .right-btn {
        position: absolute;
        right: 10px;
        cursor: pointer;
        color: #fff;
      }
    }
  }
}
.bookbuilding-table {
  width: 100%;
  min-width: 600px;
  border: 1px solid #e9eaec;
  tr {
    td {
      border-left: 1px solid #e9eaec;
      border-bottom: 1px solid #e9eaec;
      line-height: 37px;
      text-align: left;
      padding-left: 8px;
    }
    td:first-child {
      border-left: none;
      width: 20%;
    }
    td:nth-child(2) {
      width: 30%;
    }
    td:nth-child(3) {
      width: 20%;
    }
    td:nth-of-type(odd) {
      background: #f8f8f9;
    }
  }
  tr:last-child {
    td {
      border-bottom: none;
    }
  }
}
td.ivu-table-expanded-cell {
  padding: 15px 50px 0px;
  background: #f8f8f9;
}
.time{
    font-size: 14px;
    font-weight: bold;
}
.content{
    padding-left: 5px;
      min-height: 40px;
    line-height: 40px;
    background-color: #F2F2F2;
    border-radius: 8px;
}
.right-btn{
  position: absolute;
    right: 10px;
    cursor: pointer;
    color: #fff;
}
.demo-badge{
        width: 42px;
        height: 42px;
        background: #eee;
        border-radius: 6px;
        display: inline-block;
    }
</style>