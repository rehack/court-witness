<template>
    <div  class="demo-tabs-style2">
        <Card>
            <Row style="margin-bottom:15px">
                <!-- <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">我的诉讼</span>
                </Col> -->
                <Col span="24">
                    <!-- <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button> -->
                    <Form :model="formItem" inline :label-width="100" v-show="!show1">
                        <FormItem label="案号：">
                            <Input style="width: 200px" v-model="searchData.caseNo"/>
                        </FormItem>
                        <FormItem label="当事人：">
                            <Input style="width: 200px" v-model="searchData.litigantName"/>
                        </FormItem>
                        <FormItem label="诉讼状态：">
                            <Select v-model="searchData.states" style="width: 200px;vertical-align:middle;">
                              <Option value="举证期">举证期</Option>
                              <Option value="质证期">质证期</Option>
                              <Option value="庭审">庭审</Option>
                              <Option value="已判决">已判决</Option>
                              <Option value="已撤诉">已撤诉</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="案由：">
                            <Select v-model="searchData.briefName" style="width: 200px;vertical-align:middle;">
                              <Option v-for="item in briefList" :value="item.brief" :key="item.brief">{{ item.brief }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="立案时间：">
                            <DatePicker v-model="searchData.filingDate" format="yyyy/MM/dd" type="date" placement="bottom-start" placeholder="请选择开庭时间" style="width: 200px"></DatePicker>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="serechL" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <!-- <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button> -->
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row>
              <Table
        ref="judgeTable"
        border
        stripe
        :columns="recordList"
        :data="recordData"
        @on-selection-change="tableCheck"></Table>
            </Row>

            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            v-model="proofModal"
            cancel-text=""
            :loading="loading"
            ok-text="提交"
            @on-ok="submit"
            title="在线举证">
            <!-- <onlineProof :lowCaseId="lowCaseId" :briefName="briefName"/> -->
            <Card style="margin-bottom:10px">
                <div style="line-height:30px"> <label class="labe" style="margin-left:10px">当前状态：</label> 当事人可在 <span style="color:red">{{deadDate}}</span>  前提交证据，只有举证期内可以增加、编辑和删除证据。</div>
                <div  style="line-height:30px"><label  class="labe"  style="margin-left:10px">提示：</label>文书证据，可以扫描后上传；实物证据请拍照上传，并在开庭前将实物寄送到审理法院。</div>
            </Card>
            <Form :model="addFormItem" :label-width="85" inline files>
                <FormItem label="*证据名称:"  style="width: 435px">
                    <Input v-model="addFormItem.evidenceName" placeholder="请输入证据名称" ></Input>
                </FormItem>
                <FormItem label="页数:"  style="width: 435px">
                    <Input v-model="addFormItem.pageNum" placeholder="请输入页数"></Input>
                </FormItem>
                <FormItem label="*证明对象:" style="width: 435px;">
                    <Input v-model="addFormItem.evidenceObject" placeholder="请输入证明对象"  ></Input>
                </FormItem>
                <FormItem label="*证据来源:"  style="width: 435px">
                    <Input v-model="addFormItem.evidenceWhere" placeholder="请输入证据来源"  ></Input>
                </FormItem>
                <FormItem label="*是否有原件:"  style="width: 435px">
                    <RadioGroup v-model="addFormItem.isOriginal">
                        <Radio label="1">
                            <span>是</span>
                        </Radio>
                        <Radio label="0">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <!-- <FormItem label="*证据类型:"  style="width: 435px">
                    <Select v-model="addFormItem.evidenceType"  style="width: 100%;vertical-align:middle;">
                        <Option value="1" >申请书</Option>
                        <Option value="2" >起诉状</Option>
                        <Option value="3" >答辩状</Option>
                        <Option value="4" >异议书</Option>
                        <Option value="5" >证人证词</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="*附件:"  style="width: 435px">
                    <!-- <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.lowCaseId, evidenceId: this.evidenceId,uploadType:1}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传附件</Button>
                    </myUpload> -->
                    <!-- <input type="file" @change="getFile($event)"> -->
                    <a href="javascript:;" class="a-upload">
                        <input type="file"  name="" @change="getFile($event)" id="upfil">点击这里上传文件
                    </a>
                    <div style="padding: 4px 10px;display:block;position: relative;top:-10px">
                        <p v-for="item in fileNlist">{{item}}<span @click="delFile(item)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                    </div>
                </FormItem>
            </Form>
        </Modal>
        <!-- <Modal
            v-model="addModal"
            title="当事人申请"
            :loading="loading"
            cancel-text="取消"
            ok-text="提交"
            @on-ok="asyncOK"
            class="dadd"
            style="z-index:9999999">
            <Form  :label-width="85" inline>
                <FormItem label="申请事项:"  style="width: 435px">
                    <span>举证延期</span>
                </FormItem>
                <FormItem label="延期天数:"  style="width: 435px">
                    <Select v-model="delayTime"   style="width: 200px;vertical-align:middle;">
                        <Option v-for="item in days" :value="item" :key="item">{{ item }}天</Option>
                    </Select>
                </FormItem>
                <FormItem label="申请理由:"  style="width: 435px">
                    <Input name="fouce" v-model="reason" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="申请理由"></Input>
                </FormItem>
            </Form>
        </Modal> -->
        <Modal
            v-model="addModal"
            title="当事人申请"
            :loading="loading"
            cancel-text="取消"
            ok-text="提交"
            @on-ok="asyncOK"
            class="dadd"
            style="z-index:9999999">
            <Form :model="addFormItem" :label-width="85" inline>
                <FormItem label="*申请事项:"  style="width: 435px">
                    <Select v-model="flags" @on-change="changeFlags" style="width: 200px;vertical-align:middle;">
                      <Option value="0">管辖异议</Option>
                      <Option value="1">举证延期</Option>
                      <Option value="2">庭审排期</Option>
                      <Option value="3">财产保险</Option>
                      <Option value="4">调查取证</Option>
                    </Select>
                </FormItem>
                <FormItem label="延期天数:"  style="width: 435px" v-show="dayForitem">
                    <Select v-model="delayTime"   style="width: 200px;vertical-align:middle;">
                        <Option v-for="item in days" :value="item" :key="item">{{ item }}天</Option>
                    </Select>
                </FormItem>
                <FormItem label="申请理由:"  style="width: 435px">
                    <Input name="fouce" v-model="reason" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="申请理由"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import lawcaseInfo from "@/components/lawcaseInfo/lawcaseInfo.vue";
import onlineProof from "@/components/onlineProof/onlineProof.vue";
import onlineCertificate from "@/components/onlineCertificate/onlineCertificate.vue";
import focusInfo from "@/components/focusInfo/focusInfo.vue";
import lawcaseRecord from "@/components/lawcaseRecord/lawcaseRecord.vue";

import { litigantLawCaseList } from "@/api/litigantAPI/caseInfo.js";
import { getEvi, getList,editEvi } from "@/api/witness/lawcaseInfo.js";
import { formatDate } from "@/libs/date";
import { getBrief } from "@/api/global";
import {
  findByCaseLitigant,
  modifyCaseInfo,
  addLitigant,
  createDiploms,
  queryCaseNo,
  NetworkKyc,
  listJudgeAndClerk
} from "@/api/case";
import { addApplication } from "@/api/courtWitness/lawCase.js"
export default {
  components: {
    lawcaseInfo,
    onlineProof,
    onlineCertificate,
    focusInfo,
    lawcaseRecord
  },
  data() {
      return{
          caseLoading: false,
          cardState: 0,
          fileNlist:[],
          files:[],
          show1: false,
          saved: false,
          del_loading: false,
          lawcaseModal: false,
          proofModal:false,
          spinShow: false,
          addModal:false,
          dayForitem:false,
          totalPage2: 0,
          reason:"",
          delayTime:"",
          evidenceId:"",
          days:[1,2,3,4,5,6,7,8,9,10],
          briefList: [],
          briefName:"",
          plaintiffList:[],
          defendantList:[],
          thirdList:[],
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
          totalPage:1,
          deadDate:"",
          lowCaseId:'',
          pageNumber: 1,
          pageNumber2: 0,
          checkIds: [],
          checkNames: [],
          loading: true,
          detailModal:false,
          departmentList: [],
          detailData:[],
          recordData:[],
          pageData: {
            pageNumber: 1,
            pageSize: 10
          },
          selectId:'',
          caseNo:'',
          searchData:{
            caseNo: this.$store.getters.caseNo,
            litigantName: "",
            filingDate: [],
            states: "",
            briefName: "",
          },
          addFormItem:{
              evidenceName:'',
              pageNum:'',
              evidenceObject:'',
              evidenceWhere:'',
              isOriginal:'',
          },
          fileN:"",
            file:"",
            flags:"",
          formItem: {
            id:"",
            caseNo: "",
            judgeName: "",
            brief: "",
            clerkName: "",
            servicePersonnelName:""
          },
          recordList: [
            // {
            //   type: "selection",
            //   width: 50,
            //   align: "center"
            // },
            {
              title: "案号",
              key: "caseNo",
              align: "center",
              width: 190,
              render: (h, params) => {
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          localStorage.removeItem("lawCaseId");
                          this.$router.push({
                            name: "lawsuitDetail",
                            params: { lawCaseId: params.row.id, date: params.row.deadlineDate }
                          });
                          // this.lowCaseId = params.row.id;
                          // this.lawcaseModal = true;
                          // this.showCase(this.lowCaseId);
                        }
                      }
                    },
                    params.row.caseNo
                  )
                ]);
              }
            },
            {
              title: "案由",
              key: "briefName",
              align: "center",
              ellipsis: true,
              width:180
            },
            {
              title: "原告",
              key: "plaintiffs",
              align: "center",
            },
            {
              title: "被告",
              key: "defendants",
              align: "center",
            },
            {
              title: "标的",
              key: "biaodi",
              align: "center",
            },
            {
              title: "时间",
              key: "time",
              align: "center",
              width:180,
              render: (h, params) => {
                return h("div", [
                  h(
                    "p",
                    {
                      props: {
                        type: "text",
                        size: "small"
                      }
                    },
                    "立案时间：" + params.row.createDate
                  ),
                  h(
                    "p",
                    {
                      props: {
                        type: "text",
                        size: "small"
                      }
                    },
                   params.row.surplusDay
                  ),
                  // h(
                  //   "p",
                  //   {
                  //     props: {
                  //       type: "text",
                  //       size: "small"
                  //     }
                  //   },
                  //   "审结时间剩余："
                  // )
                ]);
              }
            },
            {
              title: "诉讼状态",
              key: "processType",
              align: "center",
              width:100
            },
            {
              title: "操作",
              key: "action",
              align: "center",
              render: (h, params) => {
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          if(params.row.processType !="举证期"){
                            console.log(params.row.processType)
                            return false;
                          }
                          var sty = formatDate(new Date(params.row.deadlineDate), 'yyyy-MM-dd');
                          var aryStr = sty.split('-')
                          this.deadDate = aryStr[0] + '年' + aryStr[1] + "月" + aryStr[2] + "日";
                          this.lowCaseId = params.row.id;
                          console.log(params.row.id)
                          this.briefName = params.row.briefName + '　(' +params.row.caseNo + ')' ;
                          this.addFormItem = {
                                evidenceName:'',
                                pageNum:'',
                                evidenceObject:'',
                                evidenceWhere:'',
                                evidenceType:''
                          };
                          document.getElementById("upfil").value = "";
                          this.files = [];
                          this.fileNlist = [];
                          this.evidenceId = "";
                          this.fileN = "";
                          this.file = "";
                          this.proofModal = true;
                        }
                      }
                    },
                    params.row.processType =="举证期" ?  "举证" : ""
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          if(params.row.processType !="质证期"){
                            return false;
                          }
                          localStorage.removeItem("lawCaseId");
                          this.$router.push({
                            name: "lawsuitDetail",
                            params: { lawCaseId: params.row.id, date: params.row.deadlineDate,vtab:"certificate" }
                          });
                        }
                      }
                    },
                   params.row.processType =="质证期" ?  "质证" : ""
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          if(params.row.processType =="庭审"){
                            return false;
                          }
                          this.reason = "";
                          this.lowCaseId = params.row.id;
                          this.dayForitem = false;
                          this.addModal = true;
                        }
                      }
                    },
                  params.row.processType =="庭审" ? "" : "当事人申请"
                  ),

                  // h(
                  //   "Button",
                  //   {
                  //     props: {
                  //       type: "text",
                  //       size: "small"
                  //     },
                  //     on: {
                  //       click: () => {
                  //          this.$Modal.confirm({
                  //             title: "",
                  //             content: "<p>确定要撤回该起诉吗？</p>",
                  //             okText: "确定",
                  //             cancelText: "取消",
                  //             onOk: () => {

                  //             },
                  //             onCancel: () => {

                  //             }
                  //         });
                  //       }
                  //     }
                  //   },
                  //   "撤回起诉"
                  // )
                ]);
              }
            }
          ],
      }

  },
  created() {
    this.getList(1);
    getBrief()
      .then(res => {
        if (res.data.state === 100) {
          this.briefList = res.data.result;
        }
      })
      .catch(error => {});
  },
  methods: {
    changeLoading () {
        this.loading = false;
        this.$nextTick(() => {
            this.loading = true;
        });
    },
    changeFlags(value){
      if(value == 1){
        this.dayForitem = true;
      }else{
        this.dayForitem = false;
      }
    },
    getFile(event){
        this.file = event.target.files[0];
        for(var i=0;i<this.fileNlist.length;i++){
            if(this.file.name==this.fileNlist[i]){
                return false;
            }
        }
        this.files.push(this.file)
        this.fileN = this.file.name;
        this.fileNlist.push(this.fileN);
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
    serechL(){
      if(this.searchData.filingDate !=''){
         this.searchData.filingDate = formatDate(this.searchData.filingDate, 'yyyy-MM-dd');
      }
       console.log(this.searchData.states)
      this.getList(1);
      console.log(this.searchData.filingDate)
    },
    delFile(name){
        console.log(111);
        for(var i =0;i<this.files.length;i++){
            if(name==this.files[i].name){
                this.files.splice(i,1)
            }
        }
        for(var i=0;i<this.fileNlist.length;i++){
            if(name==this.fileNlist[i]){
                this.fileNlist.splice(i,1)
            }
        }
    },
    submit(){
      if(this.addFormItem.evidenceName == ""){
            this.$Message.info('证据名称不能为空');
            this.changeLoading();
            return false;
        }
        if(this.addFormItem.evidenceObject == ""){
            this.$Message.info('证据对象不能为空');
            this.changeLoading();
            return false;
        }
        if(this.addFormItem.evidenceWhere == ""){
            this.$Message.info('证据来源不能为空');
            this.changeLoading();
            return false;
        }
        // if(this.addFormItem.evidenceType == ''){
        //     this.$Message.info('证据类型不能为空');
        //     this.changeLoading();
        //     return false;
        // }
        if(this.files.length == 0){
            this.$Message.info('请上传证据文件');
            this.changeLoading();
            return false;
        }
        var liniId = "";
        editEvi(
          this.files,
          this.lowCaseId,
          this.addFormItem.evidenceObject,
          this.addFormItem.evidenceName,
          this.addFormItem.evidenceWhere,
          this.addFormItem.pageNum,
          this.addFormItem.evidenceType,
          this.evidenceId,
          liniId,
          this.addFormItem.isOriginal
        ).then(res => {
            if(res.data.state == 100){
                  this.$Message.success(res.data.message);
                  this.changeLoading();
                  this.proofModal = false;
            }else{
                this.$Message.error(res.data.message);
                this.changeLoading();
            }
        })
    },
    asyncOK(){
      console.log(this.delayTime)
      if(this.flags == 0){
        this.flags = "管辖异议";
      }else if(this.flags == 1){
        this.flags = "举证延期";
      }else if(this.flags == 2){
        this.flags = "庭审排期";
      }else if(this.flags == 3){
        this.flags = "财产保险";
      }else if(this.flags == 4){
        this.flags = "调查取证";
      }
      console.log(this.lowCaseId)
      addApplication(this.lowCaseId, this.flags,this.delayTime, this.reason).then(res => {
        if(res.data.state==100){
          this.$Message.info(res.data.message);
          this.addModal = false;
          this.changeLoading();
        }else{
          this.$Message.info(res.data.message);
          this.changeLoading();
        }

      })
    },
    getList(page) {
      var params = {
        pageNumber: 1,
        pageSize:1000,
        number: page,
        size:10,
      };
      this.recordData = [];
      getList(this.searchData, params).then(res => {
            res.data.result2.map(item => {
              let str = "";
                if(days < 0){
                  days = 0;
                }
                if(item.processType == "庭审" || item.processType == "已判决"){
                  str = "";
                }else if(item.processType == "举证期"){
                  var nowTime = Date.parse(new Date());
                  if(item.deadlineDateJz != null && item.deadlineDateJz != ''){
                    var dayStamp = new Date(item.deadlineDateJz).getTime() - nowTime;
                  }else{
                    var dayStamp = new Date(item.deadlineDate).getTime() - nowTime;
                  }
                  
                  var days = parseInt(dayStamp/86400000)+1;
                  if(days < 0){
                    days = 0;
                  }
                  str = item.processType+"剩余：" + days + "天";
                }else if(item.processType == "质证期"){
                  var nowTime = Date.parse(new Date());
                  if(item.deadlineDateZz != null && item.deadlineDateZz != ''){
                    var dayStamp = new Date(item.deadlineDateZz).getTime() - nowTime;
                  }else{
                    var dayStamp = new Date(item.deadlineDate).getTime() - nowTime;
                  }
                  var days = parseInt(dayStamp/86400000)+1;
                  if(days < 0){
                    days = 0;
                  }
                  str = item.processType+"剩余：" + days + "天";
                }
                let objectData = {
                    id:item.lawCaseId,
                    processType: item.processType,
                    // processType: "质证",
                    proBuooton:item.processType = "举证期" ? 2 : 3,
                    surplusDay:str,
                    deadlineDate: item.deadlineDate,
                };
                this.recordData.push(objectData);
            });
            this.totalPage =   res.data.totalCount; 
            var arr = res.data.result;
            for(var i=0;i<this.recordData.length;i++){
              for(var n=0;n<arr.length;n++){
                if(this.recordData[i].id==arr[n].id){
                  this.recordData[i].caseNo = arr[n].caseNo;
                  this.recordData[i].briefName = arr[n].brief.name;
                  this.recordData[i].biaodi = arr[n].applyStandard;
                  var yStr = "";
                  var bStr = "";
                  for(var m=0;m<arr[n].litigants.length;m++){
                    if(arr[n].litigants[m].litigationStatus.name=="原告"){
                      yStr = yStr + arr[n].litigants[m].litigantName + "、";
                    }else if(arr[n].litigants[m].litigationStatus.name=="被告"){
                      bStr = bStr + arr[n].litigants[m].litigantName + "、";
                    }
                  }
                  this.recordData[i].createDate = formatDate(new Date(arr[i].filingDate), 'yyyy-MM-dd'),
                  this.recordData[i].plaintiffs = yStr.substring(0,yStr.length-1);
                  this.recordData[i].defendants = bStr.substring(0,bStr.length-1);
                }
              }
            }
            console.log(this.recordData)
      });
    },
    changePage(p) {
      this.getList(p);
    },
    tableCheck(selection) {
      this.onSelectData = selection;
      console.log(this.onSelectData)
    },
    clean() {
      this.searchData = {
        caseNo: "",
        litigantName: "",
        filingDate: [],
        states: "",
        briefName: "",
      }
    },
  },
  filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    whether(boole) {
      return boole ? "是" : "否";
    },
    filCheck(boole) {
      return boole == 0 ? "未确认" : "已确认";
    },
    formatStartDate(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
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
.ivu-table-cell p{
    text-align:left;
}
.a-upload {
    padding: 4px 10px;
    line-height: 20px;
    position: relative;
    cursor: pointer;
    color: #888;
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    *display: inline;
    *zoom: 1
}
.a-upload  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
}

.a-upload:hover {
    color: #444;
    background: #eee;
    border-color: #ccc;
    text-decoration: none
}
</style>
