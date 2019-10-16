<style>
.ivu-page-simple .ivu-page-next, .ivu-page-simple .ivu-page-prev{
   border: 1px solid #38B3FF;
}
.demo-badge-alone{
        background: #5cb85c !important;
    }
    
</style>

<template>
  <div style="position:relative;">
    <Card class="side-bar">
      <p slot="title">
        <Icon type="navicon"></Icon>
        功能菜单
        <span class="close-icon">
          <Icon type="close-round"></Icon>
        </span>
      </p>
      <div class="card-content">
        <Form :model="formItem" :label-width="40" @keydown.native.enter.prevent ="searchList">
          <FormItem label="案号">
            <Input v-model="searchData.caseNo" placeholder="请输入案号" />
          </FormItem>
          <FormItem label="法官">
            <Input v-model="searchData.judgeName" placeholder="请输入法官" />
          </FormItem>
          <FormItem label="法庭">
            <Input v-model="searchData.tribunalName" placeholder="请输入法庭" />
          </FormItem>
          <FormItem label="日期">
            <DatePicker style="width:175px;" type="daterange" placeholder="选择日期" v-model="formItem.date" />
          </FormItem>
          <FormItem style="text-align: right;">
            <Button type="ghost" @click="resetSearch">重置</Button>
            <Button type="primary" style="margin-left: 8px" @click="searchList">查询</Button>
          </FormItem>
        </Form>
        <div v-show="onSearch" class="search-list">
          <li v-for="item in searchContent" @click="selectCase(item.lawCaseId,item.date)">{{ item.caseNo }}；<br>{{ item.judgeName }}；{{ item.tribunalName }}；</li>
          <Page @on-change="pageChange" :current="pageData.pageNumber" :total="pageData.total" :page-size="pageData.pageSize" simple style="position:absolute;bottom:10px;left: 50%;margin-left: -80px;"></Page>
        </div>
        <Collapse v-show="!onSearch" id="courtdate" v-model="collapseValue" accordion>
          <Panel v-show="this.PanelDate1 != ''" name="1" style="background: #fff;">
            {{ PanelDate1 | formatDate1 }}
            <ul slot="content">
              <li v-for="item in content1" @click="selectCase(item.lawCaseId,item.date)">{{ item.caseNo }}；<br>{{ item.judgeName }}；{{ item.tribunalName }}；</li>
            </ul>
          </Panel>
          <Panel v-show="this.PanelDate2 != ''" name="2" style="background: #fff;">
            {{ PanelDate2 | formatDate1 }}
            <ul slot="content">
              <li v-for="item in content2" @click="selectCase(item.lawCaseId,item.date)">{{ item.caseNo }}；<br>{{ item.judgeName }}；{{ item.tribunalName }}；</li>
            </ul>
          </Panel>
          <Panel v-show="this.PanelDate3 != ''" name="3" style="background: #fff;">
            {{ PanelDate3 | formatDate1 }}
            <ul slot="content">
              <li v-for="item in content3" @click="selectCase(item.lawCaseId,item.date)">{{ item.caseNo }}；<br>{{ item.judgeName }}；{{ item.tribunalName }}；</li>
            </ul>
          </Panel>
        </Collapse>
        <div v-show="emptyData" style="text-align: center;color:#999;">暂无数据</div>
      </div>
    </Card>
    <div class="right-wrapper">
      <Card>
        <p slot="title">
          <Icon type="ios-bookmarks"></Icon>
          案件信息
        </p>
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
      <Card v-show="showCaseInfo">
        <p slot="title">
          <Icon type="ios-calendar"></Icon>
          最新排期时间：{{datenew}}
        </p>
       <Table :columns="columns" :data="litigantList"></Table>
      </Card>
    </div>
    <Modal v-model="modal2" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>确认取消排期</span>
        </p>
        <div style="text-align:center" v-if="checkNames.length != 0">
            <p>取消该案件排期，下列关联案件将会一并取消排期</p>
            <p v-for="(n, k) in checkNames" :key="k">
                【{{ n }}】
            </p>
            <p>共{{ checkNames.length }}条数据</p>
        </div>
        <div style="text-align:center" v-else>
            <p>确定取消该案件排期？</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="del_loading" @click="cancel">取消</Button>
        </div>
    </Modal>
    <Modal v-model="phoneModal" title="拨打电话" :mask-closable='closeM'  width="920">
        <Card v-show="showCaseInfo">
        <p slot="title">
          <Icon type="ios-calendar"></Icon>
          最新排期时间：{{datenew}}
        </p>
       <Table :columns="columns" :data="oneList"></Table>
      </Card>
      <!-- <Table :columns="columns" :data="oneList" style="margin-top:10px"></Table> -->
        <iframe :src="callPhone" frameborder="0" width="600" height="200"></iframe>
        <div>
            <Row style="margin:10px 0 0 0">
                <span style="text-align:left;line-height:32px;float:left ">
                    是否接通：
                </span>
                <span  style="text-align:left;line-height:36px;padding-left:5px;float:left ">
                    <RadioGroup v-model="isAnswer">
                        <Radio label="接听"></Radio>
                        <Radio label="未接通"></Radio>
                    </RadioGroup>
                </span>
            </Row>
            <Row style="margin:10px 0 0 0">
                <span style="text-align:left;line-height:32px;float:left ">
                    电话备注类型：
                </span>
                <span  style="text-align:left;line-height:36px;padding-left:5px;float:left ">
                    <RadioGroup v-model="teleRemarkType">
                        <Radio label="1">
                            <span>自取</span>
                        </Radio>
                        <Radio label="2">
                            <span>ems送达</span>
                        </Radio>
                        <Radio label="3">
                            <span>未确认</span>
                        </Radio>
                    </RadioGroup>
                </span>
            </Row>
            <Row style="margin:10px 0 0 0" v-show="isAnswer == '未接通'">
                <span  push='1' style="text-align:left;line-height:32px;float:left ">
                    未接通原因：
                </span>
                <span  push='1' style="text-align:left;line-height:32px;padding-left:5px;float:left ">
                    <RadioGroup v-model="noAnswerReason" >
                        <Radio label="空号"></Radio>
                        <Radio label="未接"></Radio>
                        <Radio label="停机"></Radio>
                        <Radio label="关机"></Radio>
                    </RadioGroup>
                </span>
            </Row>
            <Row style="margin:10px 0 0 0" v-show="teleRemarkType == '1'">
                <span  push='1' style="text-align:left;line-height:32px;float:left">
                    自取时间：
                </span>
                <span  push='1' style="text-align:left;line-height:32px;padding-left:5px;float:left">
                    <DatePicker v-model="selfAccessTime" format="yyyy年MM月dd日" transfer type="date" placeholder="选择自取日期" style="width: 200px"></DatePicker>
                </span>
            </Row>
            <Row style="margin:10px 0 0 0" v-show="teleRemarkType == '1'">
                <span  push='1' style="text-align:left;line-height:32px;float:left">
                    自取备注信息：
                </span>
                <span  push='1' style="text-align:left;line-height:32px;padding-left:5px;float:left;width:300px;">
                    <Input v-model="selfRemark" style="float:left;width:100%" placeholder="请输入备注信息"></Input>
                </span>
            </Row>
            <Row style="margin:10px 0 0 0">
                <span  push='1' style="text-align:left;line-height:32px;float:left">
                    备注信息：
                </span>
                <span  push='1' style="text-align:left;line-height:32px;padding-left:5px;float:left;width:300px;">
                    <Input v-model="Phoneremark" style="float:left;width:100%" placeholder="请输入备注信息"></Input>
                </span>
            </Row>
        </div>
        <div slot="footer">
                <Button @click="cloaseModel"  type="dashed" size="large">关闭</Button>
                <Button @click="saveInfo" :loading="subLoad"  type="primary" size="large">保存</Button>
        </div>
    </Modal>
  </div>
</template>
<script type="text/javascript">
import {
  courtList,
  orderByTimes,
  holiday,
  courtDetail,
  findDayTimes,
  modify,
  hand,
  handArrange,
  handArrangeConfirm,
  getNowSchedulding,
  getAssociateCase,
  cancelSchedulding,
  telephoneRecord
} from "@/api/courtDate";
import {findByCaseLitigant} from '@/api/case';
import { getTribunal } from "@/api/global";
import { formatDate } from "@/libs/date";
export default {
  data() {
    return {
      changeCaseDateTime: false,
      showCaseInfo: false,
      del_loading:false,
      emptyData: false,
      showCae:false,
      closeM:false,
      cloaseis:true,
      modal2:false,
      subLoad:false,
      isAnswer:"",
      teleRemarkType:"3",
      selfAccessTime:"",
      selfRemark:"",
      noAnswerReason:"",
      Phoneremark:"",
      phoneModal:false,
      callPhone:"",
      checkNames:[],
      collapseValue: "1",
      schedulingId: "",
      judgeId: "",
      clerkId: "",
      caseNoList:[],
      tableLoading: false,
      litigantList:[],
      oneList:[],
      columns:[
        {
            title: '当事人',
            key: 'litigantName',
            width: '180px',
            align: 'center'
        },
        {
            title: '当事人类型',
            key: 'litigantType',
            width: '100px',
            align: 'center'
        },
        {
            title: '身份证号/统一信用码',
            key: 'identityCard',
            width: '170px',
            align: 'center'
        },
        {
            title: '手机号码',
            key: 'litigantPhones',
            width: '150px',
            align: 'center',
             render: (h, params) => {
                let hArr = [];
                params.row.litigantPhone.map(item => { 
                  hArr.push(h(
                            "p",
                            {
                            style: {
                                textDecoration: "underline",
                                color: "#40a9ff",
                                cursor: "pointer",
                                margin:'2px'
                            },
                            on: {
                                click: () => {
                                  this.isAnswer="";
                                  this.noAnswerReason="";
                                  this.Phoneremark="";
                                  this.phoneModal = true;
                                      this.callPhone =
                                  // "../../src/components/webPhone/testconnect.htm?phone=" +
                                  "/testconnect.htm?phone=" +
                                    // "/testconnect.htm?phone=" +

                                  item;
                                  localStorage.setItem("caseNo",this.caseInfo.caseNo);
                                  localStorage.setItem("litigantName",params.row.litigantName);
                                  localStorage.setItem("phoneNums",item);
                                  localStorage.setItem("litigantId",params.row.id);
                                  localStorage.setItem("lawcaseId",this.schedulingId);
                                  localStorage.setItem("systemId",1);
                                  let date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                                  console.log(date)
                                  let ary = [];
                                  ary.push(params.row)
                                  this.oneList = ary;
                                }
                            },
                          },
                          item
                        ))
                })
                return h("div", hArr)
          }
        },
        {
            title: '地址',
            key: 'address',
            // width: '280px',
            align: 'center'
        },
      ],
      formItem: {
        date: ""
      },
      searchData: {
        caseNo: this.$store.getters.caseNo,
        judgeName: "",
        tribunalName: "",
        startDate: "",
        endDate: ""
      },
      pageData: {
        pageNumber: 1,
        pageSize: 5,
        total: 0
      },
      caseInfo: {
        caseId: "",
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
      caseDateTime: {
        showTime: "",
        time: "",
        court: "",
        room: "",
        isKeJi: "",
        judge: "",
        clerk: "",
        isOpen: "",
        state: ""
      },
      selectTimer: "",
      dayTimes: "",
      clear: false,
      addressList: ["湖里殿前法院", "湖里殿前法院2", "湖里殿前法院3"],
      roomList: [],
      datenew:"",
      roomListData: [],
      judgeList: ["姚", "肖"],
      secretaryList: ["庄", "王", "陈"],
      disabledDateArr: [],
      selectTime: false,
      courtRoomList:[],
      selectAddTime: false,
      datePickerOpen: false,
      addDatePickerOpen: false,
      timeList: [],
      dateOptions: {
        disabledDate: date => {
          let array = this.disabledDateArr;
          return (
            (date && date.valueOf() < Date.now()) ||
            (date && array.indexOf(new Date(date).getTime()) !== -1)
          );
        }
      },
      onSearch: false,
      searchContent: [],
      PanelDate1: "",
      PanelDate2: "",
      PanelDate3: "",
      content1: [],
      content2: [],
      content3: [],
      courtDateNum: "首次排庭",
      courtdateList: [],
      courtdateListData: [],
      courtLiData:[],
      addDateModal: false,
      loading: false,
      addDateTime: {
        time: "",
        showTime: "",
        selectTimer: "",
        dayTimes: "",
        room: "",
        where:''
      }
    };
  },
  created() {
    this.onRefreshList();
  },
  methods: {
    toggleChangeCaseDateTime() {
      this.caseNoList = [];
      if (this.changeCaseDateTime === true) {
        var tribunalId;
        this.roomListData.map(item => {
          if (this.caseDateTime.room == item.name) {
            tribunalId = item.value;
          }
        });
        modify(
          this.schedulingId,
          tribunalId,
          this.dayTimes,
          new Date(this.caseDateTime.time).getTime()
        )
          .then(res => {
            if (res.data.state === 100) {
              this.$Message.success("修改成功！");
              this.changeCaseDateTime = false;
              this.onRefreshList();
              this.schedulingId = res.data.result.id;
            } else {
              this.$Message.error(res.data.message);
            }
          })
          .catch(() => {});
      } else {
        this.changeCaseDateTime = true;
      }
    },
    saveInfo(){
      let d = new Date(this.selfAccessTime); 
      let datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      this.subLoad = true;
      if(this.isAnswer == ""){
          this.$Message.info("请选择电话是否接通");
          this.subLoad = false;
          return false;
      }
      if(this.isAnswer == '未接通'){
          if(this.noAnswerReason == ""){
              this.$Message.info("请选择未接通原因");
               this.subLoad = false;
              return false;
          }
      }
      let pramas = {
          lawCaseId:localStorage.getItem("lawcaseId"),
          litigantId:localStorage.getItem("litigantId"),
          dialPhone:"",
          answerPhone:localStorage.getItem("phoneNums"),
          startTime:"",
          endTime:"",
          isAnswer:this.isAnswer == "接听" ? 1 :0,
          systemId:localStorage.getItem("systemId"),
          noAnswerReason:this.noAnswerReason == "空号" ? 0 : (this.noAnswerReason == "未接" ? 1 : (this.noAnswerReason == "停机" ? 2 : 3)),
          remark:this.Phoneremark,
          code:localStorage.getItem("codes"),
          teleRemarkType:this.teleRemarkType,
          selfAccessTime:datetime,
          selfRemark:this.selfRemark

      }
      telephoneRecord(pramas).then(res => {
          if(res.data.state == 100){
              this.$Message.success(res.data.message);
              this.subLoad = false;
              this.phoneModal = false;                
          }else{
              this.$Message.info(res.data.message);
              this.subLoad = false;
          }
          
      })
    },
    canselArrange(){
      this.checkNames = [];
      getAssociateCase(this.caseInfo.caseNo).then(res => {
        if(res.data.state == 100){
          res.data.result.map(item => {
            this.checkNames.push(item.caseNo)
          })
          this.modal2 = true;
        }else{
          console.log(this.checkNames.length)
          this.modal2 = true;
        }
      })
    },
    cancel(){
      cancelSchedulding(this.schedulingId).then(res =>{
        if(res.data.state == 100){
          this.$Message.success(res.data.message);
          this.schedulingId = res.data.schedulding.id;
          this.selectCase(this.schedulingId);
          this.caseDateTime.state = 3;
          if(this.searchContent){
            for(var i=0;i<this.searchContent.length;i++){
              if(this.caseInfo.caseNo == this.searchContent[i].caseNo){
                this.searchContent[i].id = res.data.schedulding.id;
              }
            }
          }
          
          this.modal2 = false
        }else{
          this.$Message.info(res.data.message);
        }
      })
    },
    handleClick() {
      this.disabledDateArr = [];
      let pushArr = [];
      this.datePickerOpen = !this.datePickerOpen;
      if (this.selectTime) {
        this.selectTime = false;
      }
      holiday(this.judgeId).then(res => {
        if (res.data.state == 100) {
          res.data.result.holidays.map((item, index) => {
            pushArr.push(item.date);
          });
          res.data.result.judgeVacations.map((item, index) => {
            let startDateHours = formatDate(
              new Date(item.leaveStartDate),
              "hh"
            );
            let endDateHours = formatDate(new Date(item.leaveCloseDate), "hh");
            let startDate = formatDate(
              new Date(item.leaveStartDate),
              "yyyy-MM-dd"
            );
            let endDate = formatDate(
              new Date(item.leaveCloseDate),
              "yyyy-MM-dd"
            );
            let oneDay = 60 * 60 * 24 * 1000;
            if (startDateHours == "08") {
              pushArr.push(new Date(startDate).getTime() - 60 * 60 * 8 * 1000);
            }
            if (endDateHours == "17") {
              pushArr.push(new Date(endDate).getTime() - 60 * 60 * 8 * 1000);
            }
            let stepDate = new Date(startDate).getTime() + oneDay;
            while (stepDate < new Date(endDate).getTime()) {
              pushArr.push(stepDate - 60 * 60 * 8 * 1000);
              stepDate += oneDay;
            }
          });
          this.disabledDateArr = pushArr;
          console.log(this.disabledDateArr);
        }
      });
    },
    addHandleClick() {
      this.disabledDateArr = [];
      let pushArr = [];
      this.addDatePickerOpen = !this.addDatePickerOpen;
      if (this.selectTime) {
        this.selectTime = false;
      }
      holiday(this.judgeId).then(res => {
        if (res.data.state == 100) {
          res.data.result.holidays.map((item, index) => {
            pushArr.push(item.date);
          });
          res.data.result.judgeVacations.map((item, index) => {
            let startDateHours = formatDate(
              new Date(item.leaveStartDate),
              "hh"
            );
            let endDateHours = formatDate(new Date(item.leaveCloseDate), "hh");
            let startDate = formatDate(
              new Date(item.leaveStartDate),
              "yyyy-MM-dd"
            );
            let endDate = formatDate(
              new Date(item.leaveCloseDate),
              "yyyy-MM-dd"
            );
            let oneDay = 60 * 60 * 24 * 1000;
            if (startDateHours == "08") {
              pushArr.push(new Date(startDate).getTime() - 60 * 60 * 8 * 1000);
            }
            if (endDateHours == "17") {
              pushArr.push(new Date(endDate).getTime() - 60 * 60 * 8 * 1000);
            }
            let stepDate = new Date(startDate).getTime() + oneDay;
            while (stepDate < new Date(endDate).getTime()) {
              pushArr.push(stepDate - 60 * 60 * 8 * 1000);
              stepDate += oneDay;
            }
          });
          this.disabledDateArr = pushArr;
        }
      });
    },
    searchList() {
      console.log(11)
      // if (this.CaseDateTimeSaved()) {
        this.onSearch = true;
        this.$store.commit("SET_CASENO", this.searchData.caseNo);
        if (this.formItem.date.length == 0) {
          this.searchData.startDate =
            this.formItem.date == "" ? "" : this.formItem.date[0].getTime();
          this.searchData.endDate =
            this.formItem.date == "" ? "" : this.formItem.date[1].getTime();
        } else {
          this.searchData.startDate =
            this.formItem.date[0] == "" ? "" : this.formItem.date[0].getTime();
          this.searchData.endDate =
            this.formItem.date[1] == "" ? "" : this.formItem.date[1].getTime();
        }
        this.searchContent = [];
        this.pageData.pageSize = 5;
        courtList(this.searchData, this.pageData).then(res => {
          if (res.data.state == 100) {
            if (res.data.result.content.length == 0) {
              this.emptyData = true;
            } else {
              this.emptyData = false;
              this.pageData.total = res.data.result.total;
              res.data.result.content.map((item, index) => {
                let contentData = {
                  id: item.id,
                  lawCaseId:item.lawCase.id,
                  date:item.startDate,
                  caseNo: item.lawCase.caseNo,
                  judgeName: item.judge.name,
                  tribunalName: item.tribunal.name
                };
                this.searchContent.push(contentData);
              });
            }
          } else {
            this.$Message.error(res.data.message);
          }
        });
      // }
    },
    pageChange(pageNum) {
      this.pageData.pageNumber = pageNum;
      this.searchList();
    },
    resetSearch() {
      this.searchData = {
        caseNo: "",
        judgeName: "",
        tribunalName: "",
        startDate: "",
        endDate: ""
      };
      this.formItem.date = "";
      this.onSearch = false;
    },
    selectCase(id,date) {
        this.datenew = date;
    //   if (this.CaseDateTimeSaved()) {
        this.showCaseInfo = true;
        this.schedulingId = id;
        this.litigantList = [];
        findByCaseLitigant(id).then(res => {
          if (res.data.state == 100) {
            const lawCase = res.data.result.caseInfo;
            const data = res.data.result;
            this.caseInfo.caseNo = lawCase.caseNo;
            this.caseInfo.caseId = lawCase.id;
            this.caseInfo.court = lawCase.court.name;
            this.caseInfo.judge = lawCase.judge.name;
            this.caseInfo.clerk = lawCase.clerk.name;
            this.caseInfo.filingDate = lawCase.filingDate;
            this.caseInfo.expireDate = lawCase.expireDate;
            this.caseInfo.brief = lawCase.brief.name;
            this.caseInfo.applyStandard = lawCase.applyStandard;
            this.caseInfo.allMembers = lawCase.allMembers;
            let ary = [];
            if(data.defendantList){
                for(let y=0;y<data.defendantList.length;y++){
                    let aryy = [];
                        if(data.defendantList[y].litigantPhone != ""&& data.defendantList[y].litigantPhone != null){
                          let sary = data.defendantList[y].litigantPhone.split(',');
                          for(let u=0;u<sary.length;u++){
                            aryy.push(sary[u])
                          }
                            // aryy.push(data.defendantList[y].litigantPhone)
                        }
                        if(data.defendantList[y].litigantTelPhone != ""){
                            aryy.push(data.defendantList[y].litigantTelPhone)
                        }
                        if(data.defendantList[y].mobilepPhones != []){
                            for(let r=0;r<data.defendantList[y].mobilepPhones.length;r++){
                                aryy.push(data.defendantList[y].mobilepPhones[r].phone)
                            }
                        }
                        if(data.defendantList[y].legalManPhone != null || data.defendantList[y].legalManPhone != ''){
                          aryy.push(data.defendantList[y].legalManPhone)
                        }
                    let dat = {
                        id:data.defendantList[y].id,
                        litigantName:data.defendantList[y].litigantName,
                        litigantType:'被告',
                        identityCard:data.defendantList[y].identityCard,
                        litigantPhone:aryy,
                        address:data.defendantList[y].address,
                    }
                    ary.push(dat)
                }
            }
            if(data.plaintiffList){
                for(let y=0;y<data.plaintiffList.length;y++){
                    let aryy = [];
                        if(data.plaintiffList[y].litigantPhone != "" && data.plaintiffList[y].litigantPhone != null){
                            // aryy.push(data.plaintiffList[y].litigantPhone)
                            let sary = data.plaintiffList[y].litigantPhone.split(',');
                            for(let u=0;u<sary.length;u++){
                              aryy.push(sary[u])
                            }
                        }
                        if(data.plaintiffList[y].litigantTelPhone != "" && data.plaintiffList[y].litigantTelPhone != null){
                            aryy.push(data.plaintiffList[y].litigantTelPhone)
                        }
                        if(data.plaintiffList[y].mobilepPhones != []){
                            for(let r=0;r<data.plaintiffList[y].mobilepPhones.length;r++){
                                aryy.push(data.plaintiffList[y].mobilepPhones[r].phone)
                            }
                        }
                        if(data.plaintiffList[y].legalManPhone != null || data.plaintiffList[y].legalManPhone != ''){
                          aryy.push(data.plaintiffList[y].legalManPhone)
                        }
                    let dat = {
                        id:data.plaintiffList[y].id,
                        litigantName:data.plaintiffList[y].litigantName,
                        litigantType:'原告',
                        identityCard:data.plaintiffList[y].identityCard,
                        litigantPhone:aryy,
                        address:data.plaintiffList[y].address,
                    }
                    ary.push(dat)
                }
            }
            if(data.thirdList){
                for(let y=0;y<data.thirdList.length;y++){
                    let aryy = [];
                        if(data.thirdList[y].litigantPhone != "" && data.thirdList[y].litigantPhone != null){
                            // aryy.push(data.plaintiffList[y].litigantPhone)
                            let sary = data.thirdList[y].litigantPhone.split(',');
                            for(let u=0;u<sary.length;u++){
                              aryy.push(sary[u])
                            }
                        }
                        if(data.thirdList[y].litigantTelPhone != "" && data.thirdList[y].litigantTelPhone != null){
                            aryy.push(data.thirdList[y].litigantTelPhone)
                        }
                        if(data.thirdList[y].mobilepPhones != []){
                            for(let r=0;r<data.thirdList[y].mobilepPhones.length;r++){
                                aryy.push(data.thirdList[y].mobilepPhones[r].phone)
                            }
                        }
                        if(data.thirdList[y].legalManPhone != null || data.thirdList[y].legalManPhone != ''){
                          aryy.push(data.thirdList[y].legalManPhone)
                        }
                    let dat = {
                        id:data.thirdList[y].id,
                        litigantName:data.thirdList[y].litigantName,
                        litigantType:'第三人',
                        identityCard:data.thirdList[y].identityCard,
                        litigantPhone:aryy,
                        address:data.thirdList[y].address,
                    }
                    ary.push(dat)
                }
            }
            this.litigantList = ary;
            console.log(this.litigantList)
          }
        });
    //   }
    },
    changeDateNum() {
      if (this.CaseDateTimeSaved()) {
        let index = this.courtdateList.indexOf(this.courtDateNum);
        let changeId = this.courtdateListData[index];
        this.schedulingId = changeId;
        courtDetail(changeId).then(res => {
          if (res.data.state == 100) {
            const lawCase = res.data.result.lawCase;
            const caseDate = res.data.result;
            this.caseInfo.caseNo = lawCase.caseNo;
            this.caseInfo.caseId = lawCase.id;
            this.caseInfo.court = lawCase.court.name;
            this.caseInfo.judge = lawCase.judge.name;
            this.caseInfo.clerk = lawCase.clerk.name;
            this.caseInfo.filingDate = lawCase.filingDate;
            this.caseInfo.expireDate = lawCase.expireDate;
            this.caseInfo.brief = lawCase.brief.name;
            this.caseInfo.applyStandard = lawCase.applyStandard;
            this.caseInfo.allMembers = lawCase.allMembers;

            this.caseDateTime.time = caseDate.startDate;
            this.time = caseDate.startDate;
            this.caseDateTime.court = caseDate.tribunal.court.name;
            this.caseDateTime.room = caseDate.tribunal.name;
            this.caseDateTime.isKeJi = caseDate.tribunal.state;
            this.caseDateTime.isOpen = caseDate.isOpen;
            this.caseDateTime.state = caseDate.state;
            this.caseDateTime.judge = caseDate.judge.name;
            this.judgeId = caseDate.judge.id;
            this.clerkId = caseDate.clerk.id;
            this.caseDateTime.clerk = caseDate.clerk.name;
            getTribunal(caseDate.tribunal.court.id).then(res => {
              this.roomList = [];
              this.roomListData = [];
              res.data.result.map(item => {
                let data = {
                  value: item.id,
                  name: item.name
                };
                this.roomList.push(item.name);
                this.roomListData.push(data);
              });
            });
            let searchData = {};
            this.courtdateListData = [];
            searchData.caseNo = this.caseInfo.caseNo;
            orderByTimes(searchData, { pageNumber: 1, pageSize: 10 }).then(
              res => {
                if (res.data.state == 100) {
                  let CN = [
                    "首次排庭",
                    "第二次排庭",
                    "第三次排庭",
                    "第四次排庭",
                    "第五次排庭",
                    "第六次排庭",
                    "第七次排庭",
                    "第八次排庭"
                  ];
                  this.courtdateList = CN.slice(
                    0,
                    res.data.result.content.length
                  );
                  res.data.result.content.map(item => {
                    this.courtdateListData.push(item.id);
                  });
                }
              }
            );
          }
        });
      }
    },
    cloaseModel(){
        this.phoneModal = false;
    },
    
    CaseDateTimeSaved() {
      if (this.changeCaseDateTime === true) {
        this.$Modal.warning({
          title: "警告",
          content: "请先保存排班信息，再进行下一步"
        });

        return false;
      } else {
        return true;
      }
    },
    onRefreshList() {
      this.tableLoading = true;
      courtList(this.searchData, {
        pageNumber: "",
        pageSize: ""
      }).then(res => {
        this.tableLoading = false;
        if (res.data.state == 100) {
          const data = res.data.result.content;
          if (data.length == 0) {
            this.emptyData = true;
          } else {
            this.emptyData = false;
            this.content1 = [];
            this.content2 = [];
            this.content3 = [];
            this.PanelDate1 = "";
            this.PanelDate2 = "";
            this.PanelDate3 = "";
            data.map((item, index) => {
              if (index == 0) {
                this.PanelDate1 = item.startDate;
                let contentData = {
                  id: item.id,
                  lawCaseId:item.lawCase.id,
                  date:item.startDate,
                  caseNo: item.lawCase.caseNo,
                  judgeName: item.judge.name,
                  tribunalName: item.tribunal.name
                };
                this.content1.push(contentData);
              } else if (this.PanelDate1 && this.PanelDate2 == "") {
                if (
                  parseInt(this.PanelDate1 / 86400000) !=
                  parseInt(item.startDate / 86400000)
                ) {
                  this.PanelDate2 = item.startDate;
                  let contentData = {
                    id: item.id,
                    lawCaseId:item.lawCase.id,
                    date:item.startDate,
                    caseNo: item.lawCase.caseNo,
                    judgeName: item.judge.name,
                    tribunalName: item.tribunal.name
                  };
                  this.content2.push(contentData);
                } else {
                  this.PanelDate1 = item.startDate;
                  let contentData = {
                    id: item.id,
                    lawCaseId:item.lawCase.id,
                    date:item.startDate,
                    caseNo: item.lawCase.caseNo,
                    judgeName: item.judge.name,
                    tribunalName: item.tribunal.name
                  };
                  this.content1.push(contentData);
                }
              } else if (
                this.PanelDate1 &&
                this.PanelDate2 &&
                this.PanelDate3 == ""
              ) {
                if (
                  parseInt(this.PanelDate2 / 86400000) !=
                  parseInt(item.startDate / 86400000)
                ) {
                  this.PanelDate3 = item.startDate;
                  let contentData = {
                    id: item.id,
                    caseNo: item.lawCase.caseNo,
                    judgeName: item.judge.name,
                    tribunalName: item.tribunal.name
                  };
                  this.content3.push(contentData);
                } else {
                  this.PanelDate2 = item.startDate;
                  let contentData = {
                    id: item.id,
                    caseNo: item.lawCase.caseNo,
                    judgeName: item.judge.name,
                    tribunalName: item.tribunal.name
                  };
                  this.content2.push(contentData);
                }
              }
            });
          }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    handArrange() {
      this.courtRoomList = [];
      this.courtLiData = [];
      this.caseNoList = [];
      handArrange(this.caseInfo.caseId, this.judgeId, this.clerkId).then(
        res => {
          if (res.data.state == 100) {
            this.addDateTime.time = res.data.schedulding.startDate;
            this.addDateTime.room = res.data.schedulding.tribunal.name;
            this.addDateTime.where = res.data.schedulding.tribunal.court.name;
            this.addDateTime.times = res.data.schedulding.times;
            this.addDateTime.state = res.data.schedulding.state;
            this.addDateTime.dayTimes = res.data.schedulding.dayTimes || "";
            res.data.tribunalList.map(item => {
              var datas = {
                value:item.id,
                name:item.name
              }
              this.courtLiData.push(datas)
               this.courtRoomList.push(item.name);
            })
            this.addDateModal = true;
          } else {
            this.$Message.error(res.data.message);
          }
        }
      );
    }
  },
  filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      try {
        var date = new Date(time.replace(/-/g, "/"));
      } catch (e) {
        var date = new Date(time);
      }
      return formatDate(date, "yyyy-MM-dd");
    },
    formatDate1(time) {
      if (time == "") {
        return "";
      }
      if (time == null || time == "2000-01-01 00:00:00") {
        return "未排班";
      }
      try {
        var date = new Date(time.replace(/-/g, "/"));
      } catch (e) {
        var date = new Date(time);
      }
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
      try {
        var date = new Date(time.replace(/-/g, "/"));
      } catch (e) {
        var date = new Date(time);
      }
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  }
};
</script>
<style lang="less">
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
  min-height: 480px;
  .ivu-form-item {
    margin-bottom: 8px;
  }
}
.ivu-collapse {
  border: none;
}
.ivu-collapse > .ivu-collapse-item {
  border: none;
}
#courtdate .ivu-collapse-header {
  padding-left: 6px;
}
#courtdate .ivu-collapse-content > .ivu-collapse-content-box {
  padding-top: 0px;
  padding-bottom: 0px;
}
#courtdate li {
  margin-bottom: 6px;
  font-size: 14px;
  cursor: pointer;
}
.search-list {
  padding: 10px;
  max-height: 270px;
  overflow-y: auto;
  li {
    margin-bottom: 8px;
    font-size: 14px;
    cursor: pointer;
    list-style: none;
  }
  li:hover {
    color: #40a9ff;
  }
}
#courtdate li:hover {
  color: #40a9ff;
}
.right-wrapper {
  display: inline-block;
  width: 100%;
  padding-left: 260px;
  position: absolute;
  top: 0px;
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
        float: right;
        cursor: pointer;
        color: #fff;
      }
    }
  }
}
.page-wrapper {
  text-align: right;
  margin-top: 10px;
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
.time-wrapper {
  width: 160px;
  left: 230px;
  top: -232px;
  max-height: 240px;
  li {
    padding-left: 10px;
    cursor: pointer;
  }
  li:hover {
    color: #40a9ff;
  }
  li.checked {
    color: #fff;
    background-color: #40a9ff;
  }
  li.disable {
    color: #aaa;
    cursor: not-allowed;
  }
}
</style>
