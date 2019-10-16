<template>
    <div>
        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">文书送达管理</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="query()">
                        <FormItem label="案号：">
                            <Input style="width: 128px" v-model="formItem.caseNo"/>
                        </FormItem>
                        <FormItem label="案由：">
                            <Select style="width: 128px" v-model="formItem.briefName" filterable>
                                <Option v-for="b in briefList" :value="b.brief" :key="b.brief">{{ b.brief }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="当事人：">
                            <Input style="width: 128px" v-model="formItem.litigantName"/>
                        </FormItem>
                        <FormItem label="送达状态：">
                            <Select style="width: 128px" v-model="formItem.state">
                                <Option value="-1">取消</Option>
                                <Option value="0">送达中</Option>
                                <Option value="1">已送达成功</Option>
                                <Option value="2">未外送达成功</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="立案时间：">
                            <DatePicker type="daterange"  placement="bottom-end":options="options" v-model="formItem.daterange" placeholder="请选择您要查询的时间范围" style="width: 190px"></DatePicker>
                        </FormItem>
                        <!-- <FormItem label="庭审次数：">
                            <Input style="width: 128px" v-model="formItem.courtNumber"/>
                        </FormItem> -->
                        <FormItem label="送达类型：">
                            <Select style="width: 128px" v-model="formItem.sendType">
                                <Option v-for="(s, k) in sendTypes" :value="k" :key="k">{{ s }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button @click="query()" type="ghost">查询</Button>
                            <Button @click="formItem = {}" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                            <Button @click="expressDetail()" style="margin-left: 10px" type="ghost">查看快递详情</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            <!-- <div> -->
                <!-- 转至表格行末 -->
                <!-- <Button v-show="false" @click="$router.push({name:'send', params: { lawCaseId: selCaseId }})" size="large" type="text">查看</Button> -->
                <!-- <Button v-show="false" @click="$router.push({name:'sendDip', params: { lawCaseId: selCaseId }})" size="large" type="text">发送文书</Button> -->
                <!-- 该模块短信通知功能暂时不用 -->
                <!-- <Button v-show="false" @click="smShow" size="large" type="text">短信通知</Button> -->
            <!-- </div> -->
            <Table stripe ref="sendTable"  :columns="sendcol" :data="senddata" highlight-row>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPages" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
            
        </Card>
        <Modal title="短信通知" v-model="modal2">
            <Spin size="large" fix v-if="spinSMS"></Spin>
            <div style="line-height: 38px">
                <Row>
                    <Col span="3" style="text-align: center">手机号</Col>
                    <Col span="9">
                        <Select v-model="smsPhone" style="width:100%">
                            <Option v-for="item in phoneList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </Col>
                    <Col span="3" style="text-align: center">模板</Col>
                    <Col span="9">
                        <Select v-model="smsTp" @on-change="selST" style="width:100%">
                            <Option v-for="item in smsTpList" :value="item" :key="item.name">{{ item.name }}</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
            <div style="margin-top: 10px">
                <Input v-model="smsTpContent" type="textarea" :rows="4"></Input>
            </div>
            <div slot="footer" style="padding-left: 30px; padding-right: 30px">
                <Button type="info" size="large" long :loading="sms_loading" @click="smsSend">发 送</Button>
            </div>
        </Modal>
        <Modal title="EMS快递送达的信息列表" v-model="modal3" width="1000px">
                    <Form :model="formItemExpress" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="query()">
                        <FormItem label="案号：">
                            <Input style="width: 128px" v-model="formItemExpress.caseNo"/>
                        </FormItem>
                        
                        <FormItem label="当事人：">
                            <Input style="width: 128px" v-model="formItemExpress.litigantName"/>
                        </FormItem>
                        <FormItem label="立案时间：">
                            <DatePicker type="daterange"  placement="bottom-end":options="options" v-model="formItemExpress.daterange" placeholder="请选择您要查询的时间范围" style="width: 190px"></DatePicker>
                        </FormItem>
                        <!-- <FormItem label="庭审次数：">
                            <Input style="width: 128px" v-model="formItem.courtNumber"/>
                        </FormItem> -->
                        <FormItem label="送达地区：">
                            <Select style="width: 128px" v-model="formItemExpress.addressType">
                                <Option value="市内" >市内</Option>
                                <Option value="市外" >市外</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button @click="expressDetailQuery()" type="ghost">查询</Button>
                            <Button @click="formItemExpress = {}" style="margin-left: 10px" type="ghost">清空</Button>
                            <!-- <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button> -->
                        </FormItem>
                    </Form>
            <Button @click="downloadPath()" style="margin-bottom:10px;    margin-bottom: 10px;
    position: absolute;
    right: 20px;
    top: 65px;" type="ghost">下载</Button>
            <Table border :columns="sendDetailCol" :data="this.queryLawCaseSendInfoList" @on-selection-change="tableCheck" highlight-row>
              <Spin size="large" fix v-if="SendInfoListShow"></Spin>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPages1" :page-size="1" :current="pageNumber1" @on-change="changePage1"></Page>
                </div>
            </div>
        </Modal>
        <Modal title="物流详情" v-model="modal4" width="700px">
            <mySteps :current="0" direction="vertical" v-show="stepList.length >0">
                <myStep v-for="(item, index) in stepList" :icon="index == 0 ? 'compose' : '' " :status="index == 0 ? 'process' : 'finish'" :title="item.time" :content="item.context"></myStep>
            </mySteps>
             <div v-show="stepList.length == 0" style="text-align: center;color:#999;">
          暂无物流信息
        </div>
        </Modal>
    </div>
</template>
<script>
import { querySend, getPhones,queryLawCaseSendInfoList,getExpressSendInfo,postDeliveryBillList } from "../../api/send.js";
import { getBrief } from "../../api/global.js";
import { formatDate } from "../../libs/date.js";
import myStep from "@/components/step";
import mySteps from "@/components/steps";
export default {
    components: {
    mySteps: mySteps,
    myStep: myStep
  },
  data() {
    // var nowD = new Date();
    // const idtypes = ['身份证', '军官证', '护照'];
    const sendTypes = [
      // "现场领取",
      // "ems送达",
      // "工作人员上门送达",
      // "电子邮件送达",
      // "公告",
      // "H5确认阅读",
      // "委托送达"

      "现场领取",
      "EMS送达",
      "工作人员上门送达",
      "电子邮件送达",
      "公告",
      "H5确认阅读",
      "委托送达",
      '电话送达',
      '微信送达',
      "平台送达",
    ];
    const sendStates = ["取消", "送达中", "已送达成功", "未外送达成功"];
    return {
      sms_loading: "",
      selCaseId: "",
      spinSMS: true,
      modal2: false,
      modal3:false,
      modal4:false,
      SendInfoListShow:false,
      smsPhone: "",
      phoneList: [],
      smsTp: "",
      smsTpList: [],
      smsTpContent: "",
      show1: true,
      briefList: [],
      spinShow: false,
      totalPages: 1,
      pageNumber: 1,
      totalPages1: 1,
      pageNumber1: 1,
      sendStates: sendStates,
      sendTypes: sendTypes,
      sendId:[],
      stepList:[],
      formItem: {
        caseNo: this.$store.getters.caseNo,
        briefName: "",
        litigantName: "",
        state: "",
        daterange: []
      },
      formItemExpress: {
        caseNo: this.$store.getters.caseNo,
        briefName: "",
        litigantName: "",
        state: "",
        daterange: []
      },
      sendcol: [
        // {
        //     type: 'selection',
        //     width: 40,
        //     align: 'center'
        // },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 200
        },
        // {
        //   title: "庭审次数",
        //   key: "courtNumber",
        //   align: "center",
        //   width: 100
        // },
        {
          title: "送达类型",
          key: "sendType",
          align: "center",
          width: 100,
          render: (h, params) => {
            var s = params.row.sendType;
            if (s == null) {
              return h("span", {}, "无");
            }
            if (!s && s !== 0) {
              return h("span", {}, s);
            }
            return h("span", {}, sendTypes[s]);
          }
        },
        {
          title: "案由",
          key: "briefName",
          align: "center",
          width: 110
        },
        {
          title: "送达状态",
          key: "sendState",
          align: "center",
          width: 100,
          render: (h, params) => {
            var s = params.row.sendState;
            if (s == null) {
              return h("span", {}, "无");
            }
            if (!s && s !== 0) {
              return h("span", {}, s);
            }
            return h("span", {}, sendStates[s - 0 + 1]);
          }
        },
        {
          title: "诉讼地位",
          key: "litigationStatusName",
          align: "center",
          width: 100
        },
        {
          title: "当事人",
          key: "litigantName",
          align: "center",
          width: 180
        },
        {
          title: "类型",
          key: "litigantType",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.litigantType ? "法人" : "自然人");
          }
        },
        {
          title: "性别",
          key: "litigantSex",
          align: "center",
          width: 80,
          render: (h, params) => {
            if (params.row.litigantType) {
              return h("span", "无");
            } else {
              return h("span", params.row.litigantSex ? "女" : "男");
            }
          }
        },
        {
          title: "手机号码",
          key: "litigantPhone",
          align: "center",
          width: 120
        },
        {
          title: "座机号码",
          key: "litigantTelPhone",
          align: "center",
          width: 120
        },
        {
          title: "证件号码/统一信用码",
          key: "identityCard",
          align: "center",
          width: 100
        },
        {
          title: "立案时间",
          key: "filingDate",
          align: "center",
          width: 100,
          render: (h, params) => {
            var d = new Date(params.row.filingDate - 0);
            var s = formatDate(d, "yyyy-MM-dd");
            return h("span", {}, s);
          }
        },
        {
          title: "结案时间",
          key: "closeDate",
          align: "center",
          width: 100,
          render: (h, params) => {
            if (params.row.closeDate == null) {
              return "无";
            } else {
              var d = new Date(params.row.closeDate - 0);
              var s = formatDate(d, "yyyy-MM-dd");
              return h("span", {}, s);
            }
          }
        },
        {
          title: "案件金额",
          key: "applyStandard",
          align: "center",
          width: 100
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 150,
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
                      this.$router.push({
                        name: "sendY",
                        params: { lawCaseId: params.row.id }
                      });
                    }
                  }
                },
                "查看"
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
                      this.$router.push({
                        name: "dip",
                        params: { lawCaseId: params.row.id }
                      });
                    }
                  }
                },
                "生成并发送文书"
              )
            ]);
          }
        }
      ],
      sendDetailCol: [
            {
          type: "selection",
          width: 40,
          align: "center",
           fixed: 'left'
        },
         {
           title: "序号",
            type: 'index',
            width: 60,
            align: 'center'
        },
          {
          title: "案号",
          key: "caseNo",
          align: "center",
          width:110
        },
         {
          title: "案由",
          key: "litigantBrief",
          align: "center",
          width: 200
        },
        {
          title: "快递单号",
          key: "oddNumbers",
          align: "center",
          width: 150
        },
        {
          title: "收件人",
          key: "consignee",
          align: "center",
          width: 200
        },
         {
          title: "收件地址",
          key: "receiveAddress",
          align: "center",
          width: 200
        },
        {
          title: "地区",
          key: "address",
          align: "center",
          width: 100
        },
         {
          title: "邮寄时间",
          key: "currentDate",
          align: "center",
          width: 150
        },
         {
          title: "寄件人签名",
          key: "",
          align: "center",
          width: 150
        },
         {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 150,
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
                      this.modal4=true;
                      // console.log('s'+JSON.stringify(params.row.sendId) )
                      this.stepList=[];
                       getExpressSendInfo(params.row.sendId).then(res=>{
                          this.stepList=res.data;
                          console.log(this.stepList.length)
                        })
                    }
                  }
                },
                "查看物流信息"
              )
            ]);
          }
        }
      ],
      senddata: [],
      queryLawCaseSendInfoList: [],
      options: {
        shortcuts: [
          {
            text: "一周",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "一个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "三个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.getBrief();
    this.query();
  },
  methods: {
    getBrief() {
      var that = this;
      getBrief()
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            that.briefList = data.result;
          }
        })
        .catch(() => {
          that.$Message.error("网络错误，获取案由列表失败。");
          that.saved = false;
        });
    },
    query(page) {
      var that = this;
      that.spinShow = true;
      var s = "";
      var e = "";
      if (that.formItem.daterange && that.formItem.daterange[0]) {
        s = that.formItem.daterange[0].getTime();
      }
      if (that.formItem.daterange && that.formItem.daterange[1]) {
        e = that.formItem.daterange[1].getTime();
      }
      var d = {
        caseNo: that.formItem.caseNo,
        briefName: that.formItem.briefName,
        litigantName: that.formItem.litigantName,
        state: that.formItem.state,
        sendType: that.formItem.sendType,
        courtNumber: that.formItem.courtNumber,
        filingDateStart: s,
        filingDateEnd: e,
        pageNumber: that.pageNumber,
        rows: 10
      };
      querySend(d)
        .then(res => {
          this.$store.commit("SET_CASENO", this.formItem.caseNo);
          var data = res.data;
          if (data.state - 0 === 100) {
            that.senddata = data.result.content;
            that.pageNumber = data.result.pageNumber;
            that.totalPages = data.result.totalPages;
          } else {
            that.$Message.info(data.message);
          }
          that.spinShow = false;
        })
        .catch(() => {
          that.$Message.error("网络错误，查询失败。");
          that.spinShow = false;
        });
    },
    selST(s) {
      this.smsTpContent = s.content;
    },
    selRow(r) {
      this.selCaseId = r.id;
    },
    changePage(p) {
      this.pageNumber = p;
      this.query(p);
    },
    changePage1(p) {
      this.pageNumber1 = p;
      this.expressDetail(p);
    },
    smShow() {
      var that = this;
      this.modal2 = true;
      this.spinSMS = true;
      getPhones(that.selCaseId)
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            that.phoneList = data.result.content;
          } else {
            that.$Message.info(data.message);
          }
          that.spinSMS = false;
        })
        .catch(() => {
          that.$Message.error("网络错误，当事人号码查询失败。");
          that.spinSMS = false;
        });
    },
    smsSend() {},
    // 查看EMS快递送达的信息列表
    expressDetail(p){
       var that = this;
       that.modal3=true;
       that.SendInfoListShow = false;
      var sendTimeStart = "";
      var sendTimeEnd = "";
      if (that.formItem.daterange && that.formItem.daterange[0]) {
        sendTimeStart = that.formItem.daterange[0].getTime();
      }
      if (that.formItem.daterange && that.formItem.daterange[1]) {
        sendTimeEnd = that.formItem.daterange[1].getTime();
      }
      var d = {
        caseNo: that.formItem.caseNo,
        addressType:'',
        sendTimeStart:sendTimeStart,
        sendTimeEnd: sendTimeEnd,
        litigantName: that.formItem.litigantName,
        pageNumber: that.pageNumber1,
        pageSize: 10
      };
      queryLawCaseSendInfoList(d).then(res=>{
          var data = res.data;
          if (data.state - 0 === 100) {
            that.queryLawCaseSendInfoList = data.result;
            that.pageNumber1 = data.pageNumber;
            that.totalPages1 =Math.ceil(data.total/data.pageSize) ;
            
          } else {
            that.$Message.info(data.message);
            
          }
           that.SendInfoListShow = false;
      })
     .catch(() => {
          that.$Message.error("网络错误，查询失败。");
           that.SendInfoListShow = false;
        });
    },
    expressDetailQuery(){
       var that = this;
    //    that.modal3=true;
    //    that.SendInfoListShow = false;
      var sendTimeStart = "";
      var sendTimeEnd = "";
      if (that.formItemExpress.daterange && that.formItemExpress.daterange[0]) {
        sendTimeStart = that.formItemExpress.daterange[0].getTime();
      }
      if (that.formItemExpress.daterange && that.formItemExpress.daterange[1]) {
        sendTimeEnd = that.formItemExpress.daterange[1].getTime();
      }
      var d = {
        caseNo: that.formItemExpress.caseNo,
        addressType:that.formItemExpress.addressType,
        sendTimeStart:sendTimeStart,
        sendTimeEnd: sendTimeEnd,
        litigantName: that.formItemExpress.litigantName,
        pageNumber: that.pageNumber1,
        pageSize: 10
      };
      queryLawCaseSendInfoList(d).then(res=>{
          var data = res.data;
          if (data.state - 0 === 100) {
            that.queryLawCaseSendInfoList = data.result;
            that.pageNumber1 = data.pageNumber;
            that.totalPages1 =Math.ceil(data.total/data.pageSize) ;
            
          } else {
            that.$Message.info(data.message);
            
          }
           that.SendInfoListShow = false;
      })
     .catch(() => {
          that.$Message.error("网络错误，查询失败。");
           that.SendInfoListShow = false;
        });
    },
    // 获取邮件交接单下载路径
    tableCheck(value){
     var arr = []
      for(let i = 0;i<value.length;i++){
           arr.push(value[i].sendId);
      }
      this.sendId = arr;
    },
    downloadPath(){
          if(this.sendId.length == 0){
            this.$Message.info("请选择案件");
            return false;
          }
          postDeliveryBillList(this.sendId).then(res=>{
              var data = res.data;
          if (data.state - 0 === 100) {
            window.open('/' + data.filePath);

            //  // 创建隐藏的可下载链接
            // var eleLink = document.createElement("a");
            // var strs = data.filePath.split("/");
            // for (var i = 0; i < strs.length; i++) {
            //     if (i == strs.length - 1) {
            //     var filename = strs[i];
            //     }
            // }
            // eleLink.download = filename;
            // eleLink.setAttribute("target", "_Blank");
            // eleLink.style.display = "none";
            // // 字符内容转变成blob地址
            // eleLink.href = data.filePath;
            // // 触发点击
            // document.body.appendChild(eleLink);
            // eleLink.click();
            // // 然后移除
            // document.body.removeChild(eleLink);
          } else {
            this.$Message.info(data.message);
            
          }
      
      })
     .catch(() => {
          this.$Message.error("网络错误，查询失败。");
        
        });
       
    }
  }
};
</script>
<style>
th .ivu-table-cell{
  display: block;
}
.ivu-table-cell{
  padding-left: 0;
  padding-right: 0;
}
</style>

