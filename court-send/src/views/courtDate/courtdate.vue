<style>
.ivu-page-simple .ivu-page-next, .ivu-page-simple .ivu-page-prev{
   border: 1px solid #38B3FF;
}
.demo-badge-alone{
        background: #5cb85c !important;
    }
</style>

<template>
  <div style="position:relative;height:100%">
    <Card class="side-bar" style="height:95%;min-height:600px;position: relative;">
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
          <FormItem style="text-align: right;margin-top:30px">
            <Button type="ghost" @click="resetSearch">重置</Button>
            <Button type="primary" style="margin-left: 8px" @click="searchList">查询</Button>
          </FormItem>
        </Form>
        <div v-show="onSearch" class="search-list">
          <li v-for="item in searchContent" @click="selectCase(item.id)">{{ item.caseNo }}；<br>{{ item.judgeName }}；{{ item.tribunalName }}；</li>
          <Page @on-change="pageChange" :current="pageData.pageNumber" :total="pageData.total" :page-size="pageData.pageSize" simple style="position:absolute;bottom:10px;left: 50%;margin-left: -80px;"></Page>
        </div>
        <Collapse v-show="!onSearch" id="courtdate" v-model="collapseValue" accordion>
          <Panel v-show="this.PanelDate1 != ''" name="1" style="background: #fff;">
            {{ PanelDate1 | formatDate1 }}
            <ul slot="content">
              <li v-for="item in content1" @click="selectCase(item.id)">{{ item.caseNo }}；<br>{{ item.judgeName }}；{{ item.tribunalName }}；</li>
            </ul>
          </Panel>
          <Panel v-show="this.PanelDate2 != ''" name="2" style="background: #fff;">
            {{ PanelDate2 | formatDate1 }}
            <ul slot="content">
              <li v-for="item in content2" @click="selectCase(item.id)">{{ item.caseNo }}；<br>{{ item.judgeName }}；{{ item.tribunalName }}；</li>
            </ul>
          </Panel>
          <Panel v-show="this.PanelDate3 != ''" name="3" style="background: #fff;">
            {{ PanelDate3 | formatDate1 }}
            <ul slot="content">
              <li v-for="item in content3" @click="selectCase(item.id)">{{ item.caseNo }}；<br>{{ item.judgeName }}；{{ item.tribunalName }}；</li>
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
      <Card v-show="showCaseInfo" style='height:50vh'>
        <p slot="title">
          <Icon type="ios-calendar"></Icon>
          排期信息
          <span v-if="caseDateTime.state != 3" class="right-btn" @click="toggleChangeCaseDateTime">{{ changeCaseDateTime ? '保存' : '修改' }}</span>
        </p>
        <div style="margin-bottom: 10px;height: 30px;">
          <!-- <Select v-if="caseDateTime.state != 3" v-model="courtDateNum" @on-change="changeDateNum" style="width: 20%;vertical-align:middle;">
                      <Option v-for="item in courtdateList" :value="item" :key="item">{{ item }}</Option>
                  </Select> -->
          <span v-if="caseDateTime.state != 3">第{{ caseDateTime.times }}次排庭</span>
          <Button  type="success" @click="handArrange" style="float: right;">排期</Button>
          <Button type="info" :loading="btnLoading" @click="dateCheckTh" v-show="this.caseDateTime.times >= 1"  style="float: right;margin-right:10px">短信通知</Button>          
          <!-- <Button class="border-btn" v-if="caseDateTime.state != 3" @click="canselArrange" style="float: right;margin-right:20px;">取消排期</Button> -->
        </div>
        <table :loading="tableLoading" class="bookbuilding-table" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td>开庭时间</td>
            <td style="position: relative;">
              <span v-if="caseDateTime.state != 3" v-show="!changeCaseDateTime">{{ caseDateTime.showTime }}</span>

              <DatePicker v-show="changeCaseDateTime" placement="top-start" type="date" confirm :options="dateOptions" :open="datePickerOpen" transfer @on-change="selectDate" @on-ok="submitDate" @on-clear="clearDate" style="width: 98%;vertical-align:baseline;">
                <a href="javascript:void(0)" @click="handleClick">
                  <Icon type="ios-calendar-outline"></Icon>
                  <template v-if="caseDateTime.time === ''">选择时间</template>
                  <template v-else>{{ caseDateTime.showTime }}</template>
                </a>
              </DatePicker>

              <div class="ivu-select-dropdown time-wrapper" v-show="selectTime">
                <ul>
                  <li v-for="(item, index) in timeList" :class="{ 'checked': item.isCheck, 'disable': !item.able }" @click="selectTimeVal(index)">{{ item.value }}</li>
                </ul>
              </div>
              <div v-show="caseNoList.length != 0" class="ivu-select-dropdown time-wrapper"  style="width:200px;margin-left:165px">
                <ul>
                  <li v-for="(item, index) in caseNoList" @click="detailM(item.id)">{{item.caseNo}}</li>
                  <!-- <li >暂无排期案件</li>                -->
                </ul>
              </div>
            </td>
            <td>地点</td>
            <td>
              <span v-if="caseDateTime.state != 3">{{ caseDateTime.court }}</span>
            </td>
          </tr>
          <tr>
            <td>审判法庭</td>
            <td>
              <span v-if="caseDateTime.state != 3" v-show="!changeCaseDateTime">{{ caseDateTime.room }}</span>
              <Select v-if="caseDateTime.state != 3" v-model="caseDateTime.room" style="width: 98%;vertical-align:middle;" v-show="changeCaseDateTime">
                <Option v-for="item in roomList" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </td>
            <td>是否科技法庭</td>
            <td>
              <span v-if="caseDateTime.state != 3">{{ caseDateTime.isKeJi | whether }}</span>
            </td>
          </tr>
          <tr>
            <td>审判人员</td>
            <td>
              <span v-if="caseDateTime.state != 3">{{ caseDateTime.judge }}</span>
            </td>
            <td>书记员</td>
            <td>
              <span v-if="caseDateTime.state != 3">{{ caseDateTime.clerk }}</span>
            </td>
          </tr>
          <tr>
            <td>是否已经开庭</td>
            <td>
              <span v-if="caseDateTime.state != 3">{{ caseDateTime.isOpen | whether }}</span>
            </td>
            <td>确认状态</td>
            <td>
              <span v-if="caseDateTime.state != 3">{{ caseDateTime.state | filCheck }}</span>
            </td>
          </tr>
        </table>
      </Card>
    </div>
    <Modal :mask-closable="false" v-model="addDateModal" :closable="false" @on-cancel="canceladdDate" class-name="oneModl" z-index=990 :loading="loading" width="730" ok-text="提交" @on-ok="addDateOk" title="确认排期详情">
      <table :loading="tableLoading" class="bookbuilding-table" cellspacing="0" cellpadding="0" border="0" style='margin-top:20px;margin-bottom:20px'>
        <tr>
          <td>开庭时间</td>
          <td style="position: relative;">

            <DatePicker placement="bottom-start" type="date" confirm  :options="dateOptions" :open="addDateModal ? addDatePickerOpen:addDatePickerOpen=addDateModal" transfer @on-change="selectAddDate" @on-ok="submitDate" @on-clear="clearAddDate" style="width: 98%;vertical-align:baseline;">
              <a href="javascript:void(0)" @click="addHandleClick">
                <Icon type="ios-calendar-outline"></Icon>
                <template v-if="addDateTime.time === ''">选择时间</template>
                <template v-else>{{ addDateTime.time | formatStartDate }}</template>
              </a>
            </DatePicker>

            <div class="ivu-select-dropdown time-wrapper" v-show="selectAddTime" style="top: 26px;">
              <ul>
                <li v-for="(item, index) in timeList"  :class="{ 'checked': item.isCheck, 'disable': !item.able }" @click="selectAddTimeVal(index)">{{ item.value }}
                  <!-- <Badge count="其他" style="float:right;margin-top:9px" class-name="demo-badge-alone"></Badge> -->
                </li>
              </ul>
            </div>
            <div v-show="caseNoList.length != 0 && selectAddTime" class="ivu-select-dropdown time-wrapper"  style="top: 26px;width:200px;margin-left:165px">
              <ul>
                <li v-for="(item, index) in caseNoList" @click="detailM(item.id)">{{item.caseNo}}</li>
                <!-- <li >暂无排期案件</li>                -->
              </ul>
            </div>
          </td>
          <td>地点</td>
          <td>
            <!-- <span>{{ caseDateTime.court }}</span> -->
            <span>{{ addDateTime.where }}</span>
          </td>
        </tr>
        <tr>
          <td>审判法庭</td>
          <td>
            <Select v-model="addDateTime.room" style="width: 98%;vertical-align:middle;">
              <Option v-for="item in courtRoomList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </td>
          <td>是否科技法庭</td>
          <td>
            <span>{{ caseDateTime.isKeJi | whether }}</span>
          </td>
        </tr>
        <tr>
          <td>审判人员</td>
          <td>
            <span>{{ caseDateTime.judge }}</span>
          </td>
          <td>书记员</td>
          <td>
            <span>{{ caseDateTime.clerk }}</span>
          </td>
        </tr>
        <tr>
          <td>是否已经开庭</td>
          <td>
            <span>{{ caseDateTime.isOpen | whether }}</span>
          </td>
          <td>确认状态</td>
          <td>
            <span>{{ addDateTime.state | filCheck }}</span>
          </td>
        </tr>
      </table>
    </Modal>
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
    <Modal
      v-model="detailModal"
      width="630"
      :ok-text="'关闭'"
      cancel-text=""
      @on-ok=""
      z-index=99999
      class-name="twoModel"
      title="详情">
        <Row>
          <Col span="3" class="maininfo-col maininfo-col-label">
              原告
          </Col>
          <Col span="21" class="maininfo-col">
              {{detailLawcase.plaintiffName}}
          </Col>
      </Row>
      <Row>
          <Col span="3" class="maininfo-col maininfo-col-label">
              被告
          </Col>
          <Col span="21" class="maininfo-col">
              {{detailLawcase.defendantName}}
          </Col>
      </Row>
      <Row>
          <Col span="3" class="maininfo-col maininfo-col-label">
              案件编号
          </Col>
          <Col span="9" class="maininfo-col">
              {{detailLawcase.caseNo}}
          </Col>
          <Col span="3" class="maininfo-col maininfo-col-label">
              案由
          </Col>
          <Col span="9" class="maininfo-col">
              {{detailLawcase.briefName}}
          </Col>
      </Row>
      <Row> 
          <Col span="3" class="maininfo-col maininfo-col-label">
              法官
          </Col>
          <Col span="9" class="maininfo-col">
              {{detailLawcase.judgeName}}
          </Col>
          <Col span="3" class="maininfo-col maininfo-col-label">
              书记员
          </Col>
          <Col span="9" class="maininfo-col">
              {{detailLawcase.clerkName}}
          </Col>
      </Row>
      <Row>
          <Col span="3" class="maininfo-col maininfo-col-label">
              开庭时间
          </Col>
          <Col span="9" class="maininfo-col">
              {{detailLawcase.startDate | formatDate}}
          </Col>
          <Col span="3" class="maininfo-col maininfo-col-label">
              法庭
          </Col>
          <Col span="9" class="maininfo-col">
              {{detailLawcase.tribunalName}}
          </Col>
      </Row>
      <Row>
          <Col span="3" class="table-border-t" :style="{minHeight: '38px'}">
              关联案件
          </Col>
          <Col span="21" class="table-border-t"  v-if="detailLawcase.associateLawCase != ''" :style="{minHeight: '38px'}">
              <span v-for="item in detailLawcase.associateLawCase" > <a>{{ item.caseNo }}</a><br/> </span>
          </Col>
          <Col span="21"  class="table-border-t" v-else>
              <span>无</span>
          </Col>
      </Row>
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
  confirm,
  hand,
  handArrange,
  handArrangeConfirm,
  getNowSchedulding,
  getAssociateCase,
  cancelSchedulding
} from "@/api/courtDate";
import {
    lawCaseSchedulding
} from '@/api/homeDate';
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
      cloaseis:true,
      modal2:false,
      detailModal: false,
      detailLawcase: [],
      checkNames:[],
      collapseValue: "1",
      schedulingId: "",
      judgeId: "",
      clerkId: "",
      caseNoList:[],
      tableLoading: false,
      btnLoading:false,
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
        state: "",
        roomId:''
      },
      selectTimer: "",
      dayTimes: "",
      clear: false,
      addressList: ["湖里殿前法院", "湖里殿前法院2", "湖里殿前法院3"],
      roomList: [],
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
        where:'',
        roomId:''
      }
    };
  },
  created() {
    this.onRefreshList();
  },
  methods: {
      canceladdDate(){
          this.selectAddTime = false;
          this.addDatePickerOpen = false;
      },
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
    dateCheckTh(){
      this.btnLoading = true;
      confirm(this.schedulingId,1,2).then(res => {
        if(res.data.state == 100){
          this.btnLoading = false;
          this.$Message.success('发送成功');
          
        }else{
          this.btnLoading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    detailM (id) {
        this.detailModal = true;
        lawCaseSchedulding(id).then(res => {
            if (res.data.state == 100) {
                this.detailLawcase = res.data.result;
            } else {
                this.$Message.error(res.data.message);
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
      if (this.CaseDateTimeSaved()) {
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
      }
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
    selectCase(id) {
      if (this.CaseDateTimeSaved()) {
        this.showCaseInfo = true;
        this.schedulingId = id;
        courtDetail(id).then(res => {
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
            this.caseDateTime.courtId = caseDate.tribunal.court.id;
            this.caseDateTime.room = caseDate.tribunal.name;
            this.caseDateTime.isKeJi = caseDate.tribunal.state;
            this.caseDateTime.isOpen = caseDate.isOpen;
            this.caseDateTime.state = caseDate.state;
            this.caseDateTime.judge = caseDate.judge.name;
            this.caseDateTime.times = caseDate.times;
            this.dayTimes = caseDate.dayTimes;
            const month = new Date(this.caseDateTime.time).getMonth() + 1;
            if(res.data.result.lawCase.court.name == '民一庭' ||
            res.data.result.lawCase.court.name == '民二庭' ||
            res.data.result.lawCase.court.name == '立案庭（诉调）' ||
            res.data.result.lawCase.court.name == '交通法庭' ){
              switch (caseDate.dayTimes) {
                  case 1:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                    break;
                  case 2:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                    break;
                  case 3:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                    break;
                  case 4:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                    break;
                  case 5:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                  break;
                    case 6:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                    break;
                  case 7:
                    if (
                      month == 1 ||
                      month == 2 ||
                      month == 3 ||
                      month == 4 ||
                      month == 5 ||
                      month == 10 ||
                      month == 11 ||
                      month == 12
                    ) {
                      this.caseDateTime.showTime =
                        this.caseDateTime.time.split(" ")[0] + " " + "15:00";
                    } else {
                      this.caseDateTime.showTime =
                        this.caseDateTime.time.split(" ")[0] + " " + "15:30";
                    }
                    break;
                  case 8:
                    if (
                      month == 1 ||
                      month == 2 ||
                      month == 3 ||
                      month == 4 ||
                      month == 5 ||
                      month == 10 ||
                      month == 11 ||
                      month == 12
                    ) {
                      this.caseDateTime.showTime =
                        this.caseDateTime.time.split(" ")[0] +
                        " " +
                        "15:30";
                    } else {
                      this.caseDateTime.showTime =
                        this.caseDateTime.time.split(" ")[0] +
                        " " +
                        "16:00";
                    }

                    break;
                }
            }else{
              switch (caseDate.dayTimes) {
                  case 1:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                    break;
                  case 2:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                    break;
                  case 3:
                    this.caseDateTime.showTime = this.caseDateTime.time;
                    break;
                  case 4:
                    this.caseDateTime.showTime =
                      this.caseDateTime.time.split(" ")[0] + " " + "8:45、10:20";
                    break;
                  case 5:
                    if (
                      month == 1 ||
                      month == 2 ||
                      month == 3 ||
                      month == 4 ||
                      month == 5 ||
                      month == 10 ||
                      month == 11 ||
                      month == 12
                    ) {
                      this.caseDateTime.showTime =
                        this.caseDateTime.time.split(" ")[0] + " " + "10:20、15:00";
                    } else {
                      this.caseDateTime.showTime =
                        this.caseDateTime.time.split(" ")[0] + " " + "10:20、15:30";
                    }
                    break;
                  case 6:
                    if (
                      month == 1 ||
                      month == 2 ||
                      month == 3 ||
                      month == 4 ||
                      month == 5 ||
                      month == 10 ||
                      month == 11 ||
                      month == 12
                    ) {
                      this.caseDateTime.showTime =
                        this.caseDateTime.time.split(" ")[0] +
                        " " +
                        "8:45、10:20、15:00";
                    } else {
                      this.caseDateTime.showTime =
                        this.caseDateTime.time.split(" ")[0] +
                        " " +
                        "8:45、10:20、15:30";
                    }

                    break;
                }
            }
            this.judgeId = res.data.judge.id;
            this.clerkId = res.data.clerk.id;
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
            this.courtDateNum = "首次排庭";
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
                  this.courtDateNum = this.courtdateList[
                    caseDate.trialTimes - 1
                  ];
                }
              }
            );
          }
        });
      }
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
    addDateOk() {
      var tribunalId;
      this.courtLiData.map(item => {
        if (this.addDateTime.room == item.name) {
          tribunalId = item.value;
          this.addDateTime.roomId=item.value
        }
      });
      handArrangeConfirm(
        this.caseInfo.caseId,
        this.judgeId,
        this.clerkId,
        tribunalId,
        new Date(this.addDateTime.time).getTime(),
        this.addDateTime.times,
        this.addDateTime.dayTimes
      )
        .then(res => {
          if (res.data.state === 100) {
            this.$Message.success("排庭成功！");
            this.caseDateTime.time = this.addDateTime.time;
            this.caseDateTime.room = this.addDateTime.room;
            this.caseDateTime.state = 0;
            this.caseDateTime.times = 1;
            this.onRefreshList();
            this.schedulingId = res.data.schedulding.id;
            this.selectCase(this.schedulingId);
            this.searchList();
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(() => {});
    },
    selectDate(value) {
      console.log(this.roomListData)
      for (let i = 0; i < this.roomListData.length; i++) {
            if (this.caseDateTime.room==this.roomListData[i].name) {
                this.caseDateTime.roomId=this.roomListData[i].value
            }
            
        }
      const month = new Date(value).getMonth() + 1;
      if (!this.clear) {
        this.caseDateTime.time = value;
        this.selectTime = true;
        let data = new Date(value).getTime();
        findDayTimes(data, this.judgeId,this.caseDateTime.roomId).then(res => {
        //   if(res.data.court.name =='民一庭' || 
        //   res.data.court.name =='民二庭' || 
        //   res.data.court.name =='立案庭（诉调）' || 
        //   res.data.court.name =='交通法庭'){
        //     let disableArr = res.data.result.split(",");
        //     if(month == 1 ||
        //         month == 2 ||
        //         month == 3 ||
        //         month == 4 ||
        //         month == 5 ||
        //         month == 10 ||
        //         month == 11 ||
        //         month == 12){
        //       this.timeList = [
        //           {
        //             value: "08:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "09:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "09:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "11:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "15:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "15:30",
        //             able: true,
        //             isCheck: false
        //           },
        //       ];
        //     }else{
        //       this.timeList = [
        //           {
        //             value: "08:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "09:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "09:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "11:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "15:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "16:00",
        //             able: true,
        //             isCheck: false
        //           },
        //       ];
        //     }
        //     disableArr.map(item => {
        //         if (item != 0) {
        //           this.timeList[item - 1].able = false;
        //         }
        //       });
        //   }else if(res.data.court.name =='自贸法庭'){
        //     let disableArr = res.data.result.split(",");
        //   if (
        //     month == 1 ||
        //     month == 2 ||
        //     month == 3 ||
        //     month == 4 ||
        //     month == 5 ||
        //     month == 10 ||
        //     month == 11 ||
        //     month == 12
        //   ) {
        //     this.timeList = [
        //       {
        //         value: "08:30",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "09:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "15:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:30、09:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "09:00、15:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:30、09:00、15:00",
        //         able: true,
        //         isCheck: false
        //       }
        //     ];
        //   } else {
        //     this.timeList = [
        //       {
        //         value: "08:30",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "09:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "15:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:45、10:20",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "10:20、15:30",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:45、10:20、15:30",
        //         able: true,
        //         isCheck: false
        //       }
        //     ];
        //   }
        //   disableArr.map(item => {
        //     if (item != 0) {
        //       this.timeList[item - 1].able = false;
        //     }
        //   });
        //   }else{
        //   let disableArr = res.data.result.split(",");
        //   if (
        //     month == 1 ||
        //     month == 2 ||
        //     month == 3 ||
        //     month == 4 ||
        //     month == 5 ||
        //     month == 10 ||
        //     month == 11 ||
        //     month == 12
        //   ) {
        //     this.timeList = [
        //       {
        //         value: "08:45",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "10:20",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "15:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:45、10:20",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "10:20、15:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:45、10:20、15:00",
        //         able: true,
        //         isCheck: false
        //       }
        //     ];
        //   } else {
        //     this.timeList = [
        //       {
        //         value: "08:45",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "10:20",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "15:30",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:45、10:20",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "10:20、15:30",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:45、10:20、15:30",
        //         able: true,
        //         isCheck: false
        //       }
        //     ];
        //   }
        //   disableArr.map(item => {
        //     if (item != 0) {
        //       this.timeList[item - 1].able = false;
        //     }
        //   });
        //   }
          if (res.data.state==100) {
              this.timeList=res.data.data.map(val => {
                let json = {};
                 json.value = val.startTime
                 json.able = true;
                 json.isCheck = false;
                 return json;
          });
          }else{
              this.$Modal.warning({
                title: "提示",
                content: res.data.message
                });
          }
        });
      } else {
        this.clear = false;
      }
      console.log(this.timeList)
    },
    selectAddDate(value) {
        console.log(this.addDateTime.room)
        console.log(this.addDateTime)
        for (let i = 0; i < this.courtLiData.length; i++) {
            if (this.addDateTime.room==this.courtLiData[i].name) {
                this.addDateTime.roomId=this.courtLiData[i].value
            }
            
        }
      const month = new Date(value).getMonth() + 1;
      if (!this.clear) {
        this.addDateTime.time = value;
        this.selectAddTime = true;
        let data = new Date(value).getTime();
        findDayTimes(data, this.judgeId,this.addDateTime.roomId).then(res => {
        //   if(res.data.court.name =='民一庭' || 
        //   res.data.court.name =='民二庭' || 
        //   res.data.court.name =='立案庭（诉调）' || 
        //   res.data.court.name =='交通法庭'){
        //     let disableArr = res.data.result.split(",");
        //     console.log(month)
        //     if(month == 1 ||
        //         month == 2 ||
        //         month == 3 ||
        //         month == 4 ||
        //         month == 5 ||
        //         month == 10 ||
        //         month == 11 ||
        //         month == 12){
        //       this.timeList = [
        //           {
        //             value: "08:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "09:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "09:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "11:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "15:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "15:30",
        //             able: true,
        //             isCheck: false
        //           },
        //       ];
        //     }else{
        //       this.timeList = [
        //           {
        //             value: "08:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "09:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "09:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "11:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "15:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "16:00",
        //             able: true,
        //             isCheck: false
        //           },
        //       ];
        //     }
        //     disableArr.map(item => {
        //         if (item != 0) {
        //           this.timeList[item - 1].able = false;
        //         }
        //       });
        //   }else if(res.data.court.name =='自贸法庭'){
        //      let disableArr = res.data.result.split(",");
        //   if (
        //     month == 1 ||
        //     month == 2 ||
        //     month == 3 ||
        //     month == 4 ||
        //     month == 5 ||
        //     month == 10 ||
        //     month == 11 ||
        //     month == 12
        //   ) {
        //     this.timeList = [
        //       {
        //         value: "08:30",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "09:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "15:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:30、09:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "09:00、15:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:30、09:00、15:00",
        //         able: true,
        //         isCheck: false
        //       }
        //     ];
        //   } else {
        //     this.timeList = [
        //       {
        //         value: "08:30",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "09:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "15:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:30、09:00",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "09:00、15:30",
        //         able: true,
        //         isCheck: false
        //       },
        //       {
        //         value: "08:30、09:00、15:30",
        //         able: true,
        //         isCheck: false
        //       }
        //     ];
        //   }
        //   disableArr.map(item => {
        //     if (item != 0) {
        //       this.timeList[item - 1].able = false;
        //     }
        //   });
        //   }else{
        //     let disableArr = res.data.result.split(",");
        //       if (
        //         month == 1 ||
        //         month == 2 ||
        //         month == 3 ||
        //         month == 4 ||
        //         month == 5 ||
        //         month == 10 ||
        //         month == 11 ||
        //         month == 12
        //       ) {
        //         this.timeList = [
        //           {
        //             value: "08:45",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:20",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "15:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "08:45、10:20",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:20、15:00",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "08:45、10:20、15:00",
        //             able: true,
        //             isCheck: false
        //           }
        //         ];
        //       } else {
        //         this.timeList = [
        //           {
        //             value: "08:45",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:20",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "15:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "08:45、10:20",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "10:20、15:30",
        //             able: true,
        //             isCheck: false
        //           },
        //           {
        //             value: "08:45、10:20、15:30",
        //             able: true,
        //             isCheck: false
        //           }
        //         ];
        //       }
        //       disableArr.map(item => {
        //         if (item != 0) {
        //           this.timeList[item - 1].able = true;
        //         }
        //       });
        //   }
          if (res.data.state==100) {
              this.timeList=res.data.data.map(val => {
                let json = {};
                 json.value = val.startTime
                 json.able = true;
                 json.isCheck = false;
                 return json;
          });
          }else{
              this.$Modal.warning({
                title: "提示",
                content: res.data.message
                });
          }
          
        });
      } else {
        this.clear = false;
      }
    },
    selectTimeVal(selectIndex) {
      this.caseNoList = [];
      if (this.timeList[selectIndex].able) {
        this.timeList.map((item, index) => {
          if (selectIndex == index) {
            item.isCheck = true;
            this.selectTimer = item.value;
            this.caseDateTime.time =
              this.caseDateTime.time.split(" ")[0] +
              " " +
              this.selectTimer.split("、")[0];
            this.caseDateTime.showTime =
              this.caseDateTime.time.split(" ")[0] + " " + this.selectTimer;
            this.dayTimes = index + 1;
          } else {
            item.isCheck = false;
          }
        });
        var tribunalId = '';
        console.log(this.caseDateTime)
        this.roomListData.map(item => {
          if (this.caseDateTime.room == item.name) {
            tribunalId = item.value;
          }
        });
        var selectTim = new Date(this.caseDateTime.time).getTime()  
        getNowSchedulding(selectIndex+1,selectTim,tribunalId).then(res =>{
            if(res.data.state == 100){
              var datas = res.data;
              for(var i=0;i<datas.result.length;i++){
                let dataOb = {
                  caseNo:datas.result[i].caseNo,
                  id:datas.result[i].id
                }
                this.caseNoList.push(dataOb)
              }
              console.log(this.caseNoList)
            }else{
              this.$Message.info(res.data.message);
            }
        })
      }
    },  
    selectAddTimeVal(selectIndex) {
      this.caseNoList = [];
      console.log(this.timeList[selectIndex])
      if (this.timeList[selectIndex].able) {
        this.timeList.map((item, index) => {
          if (selectIndex == index) {
            item.isCheck = true;
            this.addDateTime.selectTimer = item.value;
            this.addDateTime.time =
              this.addDateTime.time.split(" ")[0] +
              " " +
              this.addDateTime.selectTimer.split("、")[0];
            this.caseDateTime.showTime =
              this.addDateTime.time.split(" ")[0] +
              " " +
              this.addDateTime.selectTimer;
            this.addDateTime.dayTimes = index + 1;
            console.log(this.addDateTime.time);
          } else {
            item.isCheck = false;
          }
        });
        var tribunalId = '';
        this.courtLiData.map(item => {
          if (this.addDateTime.room == item.name) {
            tribunalId = item.value;
          }
        });
        var selectTim = new Date(this.addDateTime.time).getTime()  
        getNowSchedulding(selectIndex+1,selectTim,tribunalId).then(res =>{
            if(res.data.state == 100){
              var datas = res.data;
              for(var i=0;i<datas.result.length;i++){
                let dataOb = {
                  caseNo:datas.result[i].caseNo,
                  id:datas.result[i].id
                }
                this.caseNoList.push(dataOb)
              }
            }else{
              this.$Message.info(res.data.message);
            }
        })
        // this.showCae = true;
      }
    },
    clearDate() {
      this.clear = true;
      this.selectTime = false;
      this.datePickerOpen = false;
      this.caseNoList = [];
      this.caseDateTime.time = this.time;
    },
    clearAddDate() {
      this.clear = true;
      this.selectAddTime = false;
    //   this.selectAddTime = true;
      this.showCae = false;
      this.caseNoList = [];
      this.addDatePickerOpen = false;
      this.addDateTime.time = "";
    },
    submitDate() {
      this.datePickerOpen = false;
      this.addDatePickerOpen = false;
      this.selectTime = false;
      this.caseNoList = [];
      this.selectAddTime = false;
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
                    caseNo: item.lawCase.caseNo,
                    judgeName: item.judge.name,
                    tribunalName: item.tribunal.name
                  };
                  this.content2.push(contentData);
                } else {
                  this.PanelDate1 = item.startDate;
                  let contentData = {
                    id: item.id,
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
      console.log(this.caseInfo.caseId)
      handArrange(this.caseInfo.caseId, this.judgeId, this.clerkId).then(
        res => {
          if (res.data.state == 100) {
            this.addDateTime.time = res.data.data.schedulding.startDate;
            this.addDateTime.room = res.data.data.schedulding.tribunal.name;
            this.addDateTime.where = res.data.data.schedulding.tribunal.court.name;
            this.addDateTime.times = res.data.data.schedulding.times;
            this.addDateTime.state = res.data.data.schedulding.state;
            this.addDateTime.dayTimes = res.data.data.schedulding.dayTimes || "";
            res.data.data.tribunalList.map(item => {
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
.ivu-date-picker-transfer{
  z-index:1002;
}
.oneModl{
  z-index:1001;
  display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
}
.twoModel{
  z-index:8888
}
// .ivu-modal-wrap{
//   z-index:88888;
// }
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
