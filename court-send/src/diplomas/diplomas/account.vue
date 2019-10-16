<template>
    <div>
        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">个人台账页</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="query()">
                        <FormItem label="操作人：">
                            <Input style="width: 128px" v-model="formItem.name"/>
                        </FormItem>
                        <FormItem label="时间：">
                            <DatePicker type="daterange"  placement="bottom-end" :options="options" v-model="formItem.daterange" placeholder="请选择您要查询的时间范围" style="width: 190px"></DatePicker>
                        </FormItem>
                        <!-- <FormItem label="庭审次数：">
                            <Input style="width: 128px" v-model="formItem.courtNumber"/>
                        </FormItem> -->
                        <FormItem>
                            <Button @click="query()" type="ghost">查询</Button>
                            <Button @click="formItem = {};query()" style="margin-left: 10px" type="ghost">清空</Button>
                            <!-- <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button> -->
                            <!-- <Button @click="expressDetail()" style="margin-left: 10px" type="ghost">导出台账</Button> -->
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            <Button  style="margin-left: 10px;margin-bottom: 10px;" type="primary" @click="overCase">
                        导出台账
            </Button>
            <!-- <div> -->
                <!-- 转至表格行末 -->
                <!-- <Button v-show="false" @click="$router.push({name:'send', params: { lawCaseId: selCaseId }})" size="large" type="text">查看</Button> -->
                <!-- <Button v-show="false" @click="$router.push({name:'sendDip', params: { lawCaseId: selCaseId }})" size="large" type="text">发送文书</Button> -->
                <!-- 该模块短信通知功能暂时不用 -->
                <!-- <Button v-show="false" @click="smShow" size="large" type="text">短信通知</Button> -->
            <!-- </div> -->
            <Table stripe ref="sendTable"  :columns="sendcol" :data="senddata" @on-selection-change="tableCheck" highlight-row>
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
    </div>
</template>
<script>
import { querySend, getPhones,queryLawCaseSendInfoList,getExpressSendInfo,postDeliveryBillList,
    personalAccount,createMailExcel,accountForExcel } from "../../api/send.js";
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
      "现场领取",
      "ems送达",
      "工作人员上门送达",
      "电子邮件送达",
      "公告",
      "H5确认阅读",
      "委托送达"
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
      pageSize:10,
      sendStates: sendStates,
      sendTypes: sendTypes,
      stepList:[],
      caseIdList:[],
      formItem: {
        caseNo: this.$store.getters.caseNo,
        beginTime:"",
        endTime:"",
        name:"",
      },
      formItemExpress: {
        caseNo: this.$store.getters.caseNo,
        briefName: "",
        litigantName: "",
        state: "",
        daterange: []
      },
      sendcol: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        // {
        //     type: 'index',
        //     width: 60,
        //     align: 'center'
        // },
        {
          title: "案号",
          key: "case_no",
          align: "center",
          width: 220
        },
        // {
        //   title: "庭审次数",
        //   key: "courtNumber",
        //   align: "center",
        //   width: 100
        // },
        {
          title: "原告",
          key: "plaintiff",
          align: "center",
          width: 170
        },
        {
          title: "被告",
          key: "defendant",
          align: "center",
          width: 170
        },
        {
          title: "操作人",
          key: "operator_name",
          align: "center",
          width: 130
        },
        {
          title: "审判人",
          key: "judgeName",
          align: "center",
          width: 130
        },
        {
          title: "立案日期",
          key: "filingDate",
          align: "center",
          width: 170,
          render: (h, params) => {
            var d = new Date(params.row.larq);
            var s = formatDate(d, "yyyy-MM-dd");
            return h("span", {}, s);
          }
        },
        {
          title: "当事人|案由",
          key: "case_reason",
          align: "center",
        //   width: 100
        },
        // {
        //   title: "领导审批",
        //   key: "action",
        //   align: "center",
        //   fixed: "right",
        //   width: 150,
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "text",
        //             size: "small"
        //           },
        //           on: {
        //             click: () => {
        //               this.$router.push({
        //                 name: "sendY",
        //                 params: { lawCaseId: params.row.id }
        //               });
        //             }
        //           }
        //         },
        //         "查看"
        //       ),
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "text",
        //             size: "small"
        //           },
        //           on: {
        //             click: () => {
        //               this.$router.push({
        //                 name: "dip",
        //                 params: { lawCaseId: params.row.id }
        //               });
        //             }
        //           }
        //         },
        //         "生成并发送文书"
        //       )
        //     ]);
        //   }
        // }
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
    // this.getBrief();
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
        s = formatDate(new Date(that.formItem.daterange[0].getTime()), "yyyy-MM-dd hh:mm:ss");
      }
      if (that.formItem.daterange && that.formItem.daterange[1]) {
        e = formatDate(new Date(that.formItem.daterange[1].getTime()), "yyyy-MM-dd hh:mm:ss");;
      }
      console.log(s)
      var d = {
        name: that.formItem.name ? that.formItem.name : "",       
        beginTime: s, //开始时间
        endTime: e,   //结束时间
        pageNum: page ? page : that.pageNumber,   //页码
        pageSize: that.pageSize,   //每页数量
      };
      personalAccount(d)
        .then(res => {
          var data = res.data;
          if (data.state  == 100) {
            that.senddata = data.data.content;
            // that.pageNumber = data.pageNumber;
            that.totalPages = data.data.totalPages;
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
      console.log(p)
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
      var sendTimeStart = "";
      var sendTimeEnd = "";
      let isHaveTime = false;
      console.log(that.formItem.daterange)
      if (that.formItem.daterange && that.formItem.daterange[0]) {
          isHaveTime = true;
        sendTimeStart =formatDate(new Date(that.formItem.daterange[0].getTime()), "yyyy-MM-dd"); 
      }
      if (that.formItem.daterange && that.formItem.daterange[1]) {
        sendTimeEnd = formatDate(new Date(that.formItem.daterange[1].getTime()), "yyyy-MM-dd"); 
      }
      if(!isHaveTime){
          that.$Message.info('请选择邮寄时间范围');
          return false;
      }
      let onlySomeDay = "";
      if(sendTimeStart == sendTimeEnd){
          onlySomeDay = sendTimeStart;
          sendTimeStart = "";
          sendTimeEnd = "";
      }
      var d = {
        beginTime: sendTimeStart,
        endTime:sendTimeEnd,
        onlySomeDay:onlySomeDay
      };
      createMailExcel(d).then(res=>{
          var data = res.data;
          if (data.state == 100) {
            window.open("/" + data.outPath)
            
          } else {
            that.$Message.info(data.message);
            
          }
      })
     .catch(() => {
          that.$Message.error("网络错误，查询失败。");
           that.SendInfoListShow = false;
        });
    },
    overCase(){
    if(this.caseIdList.length == 0){
        this.$Message.info("请先选择案件！");
      }else{
          let dt = {
              caseIdList:this.caseIdList
          }
        // this.$Message.info("请先选择案件！");
        accountForExcel(dt).then(res => {
            if(res.data.state == 100){
                window.open('/' + res.data.data)
            }else{
                that.$Message.info(res.data.message);
            }
        })
      }
    },
    // 获取邮件交接单下载路径
    tableCheck(value){
     var arr = []
      for(let i = 0;i<value.length;i++){
           arr.push(value[i].unique_id);
      }
      this.caseIdList = arr;
      console.log(this.caseIdList)
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

