<template>
    <div>

        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">短信通知记录</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px;margin-bottom: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="getList(1)">
                        <FormItem label="案号：">
                            <Input style="width: 128px" v-model="formItem.caseNo"/>
                        </FormItem>
                        <FormItem label="案由：">
                            <Select style="width: 128px" v-model="formItem.brief">
                                <Option v-for="b in briefList" :value="b.brief" :key="b.brief">{{ b.brief }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="发送日期：">
                            <DatePicker type="daterange"  placement="bottom-end":options="options" v-model="formItem.daterange" placeholder="请选择您要查询的时间范围" style="width: 190px"></DatePicker>
                        </FormItem>
                        <FormItem label="姓名：">
                            <Input style="width: 128px" v-model="formItem.dstname"/>
                        </FormItem>
                        <FormItem label="身份类型：">
                            <Select style="width: 128px" v-model="formItem.litigationStatus">
                                <Option value="原告">原告</Option>
                                <Option value="被告">被告</Option>
                                <!-- <Option value="合议庭成员">合议庭成员</Option> -->
                            </Select>
                        </FormItem>
                        <FormItem label="手机号码：">
                            <Input style="width: 128px" v-model="formItem.phone"/>
                        </FormItem>
                        <FormItem>
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="formItem = {}" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            <Button @click="sendBtn" class="border-btn" style="margin-left: 10px;margin-bottom:10px;margin-top:10px">发送短信</Button>
            <Table stripe ref="smsTable" :columns="smscol" :data="smsdata" :ellipsis="true" @on-selection-change="tableCheck"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            v-model="smsModel"
            title="发送短信"
            :loading="loading"
            width="600"
            ok-text="发送"
            cancel-text="取消"
            @on-ok="smsOk"
            >
            <Row>
              <Col span="5" style="text-align: right; padding-left: 5px;line-height: 32px;">
                  手机号：<br>
                  
              </Col>
              <Col span="14" style="text-align: left; padding-left: 5px">
                  <!-- <Input v-model="sendPhone" style="height:35px"  placeholder="手机号码" /> -->
                  <Input v-model="sendPhone" style="min-height: 35px;" type="textarea" :autosize="{minRows: 1,maxRows: 5}" placeholder="手机号码"></Input>
              </Col>
              <Col span="5" style=" padding-left: 5px;line-height: 32px;">
                <span style="color:red;font-size:14px;">(多号码逗号隔开)</span>
              </Col>
          </Row>
          <Row style="margin-top:15px">
              <Col span="5" style="text-align: right; padding-left: 5px">
                  短信内容：
              </Col>
              <Col span="14" style="text-align: left; padding-left: 5px">
                  
                  <Input v-model="sendContent" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="短信内容"></Input>
              </Col>
          </Row>
        </Modal>
        <!-- <Modal v-model="modal2" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确认删除</span>
            </p>
            <div style="text-align:center">
                <p>您将删除</p>
                <span v-for="(n, k) in checkNames" :key="k">
                    【{{ n }}】
                </span>
                <p>共{{ checkNames.length }}条数据</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="del_loading" @click="delJudge">删除</Button>
            </div>
        </Modal> -->
    </div>
</template>
<script>
import { getBrief } from "../../api/global.js";
import { smslist, selfEditingSms } from "../../api/sms.js";
import { formatDate } from "../../libs/date.js";
export default {
  data() {
    // var nowD = new Date();
    var inWidth = window.innerWidth;
    var width = inWidth >= 1440 ? "" : 180;
    return {
      show1: false,
      smsModel:false,
      loading:true,
      sendPhone:"",
      sendContent:"",
      // del_loading: false,
      // modal2: false,
      spinShow: false,
      totalPage: 0,
      pageNumber: 0,
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        },
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
      },
      // checkIds: [],
      // checkNames: [],
      // departmentList: [{name: '司法部'}, {name: '综合部'}],
      formItem: {
        litigationStatus: "",
        brief: "",
        caseNo: this.$store.getters.caseNo,
        phone: "",
        dstname: "",
        startTime: "",
        endTime: ""
      },
      smscol: [
        // {
        //     type: 'selection',
        //     width: 40,
        //     align: 'center'
        // },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 140
        },
        {
          title: "案由",
          key: "brief",
          align: "center",
          width: 120
        },
        {
          title: "姓名",
          key: "dstName",
          align: "center",
          width: 100
        },
        {
          title: "身份类型",
          key: "litigationStatus",
          align: "center",
          width: 100
        },
        {
          title: "手机号码",
          key: "dstNum",
          align: "center",
          width: 160
        },
        {
          title: "内容",
          key: "msgStr",
          align: "center",
          width: width,
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: {
                  placement: "left-start",
                  transfer: true,
                  content: params.row.msgStr
                }
              },
              [
                h(
                  "p",
                  {
                    class: {
                      ellipsisText: true
                    }
                  },
                  params.row.msgStr
                )
              ]
            );
          }
        },
        {
          title: "送达状态",
          key: "status",
          align: "center",
          // width: 100,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.smsMessageState
            );
          }
        },
        {
          title: "发送时间",
          key: "status",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.modifyDate == null
                ? "无"
                : formatDate(new Date(params.row.modifyDate), "yyyy-MM-dd hh:mm:ss")
            );
          }
        }
      ],
      smsdata: [],
      briefList: []
    };
  },
  mounted() {
    this.getList(1);
    this.getBrief();
  },
  methods: {
    getList(page) {
      var that = this;
      this.$store.commit("SET_CASENO", this.formItem.caseNo);
      var params = this.formItem;
      params.daterange && (params = that.daterangeToSE(params));
      params.pageNo = page;
      smslist(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            that.smsdata = data.result.content;
            that.smsdata.map(item => {
              if(item.status == 0){
                item.smsMessageState = "未发送";
              }else if(item.status == 1){
                if(item.resultcode == null){
                  item.smsMessageState = "发送中";
                }else if(item.resultcode == 100){
                  item.smsMessageState = "发送成功";
                }else if(item.resultcode == 101){
                  item.smsMessageState = "验证失败";
                }else if(item.resultcode == 102){
                  item.smsMessageState = "短信不足";
                }else if(item.resultcode == 103){
                  item.smsMessageState = "操作失败";
                }else if(item.resultcode == 104){
                  item.smsMessageState = "非法字符";
                }else if(item.resultcode == 105){
                  item.smsMessageState = "内容过多";
                }else if(item.resultcode == 106){
                  item.smsMessageState = "号码过多";
                }else if(item.resultcode == 107){
                  item.smsMessageState = "频率过快";
                }else if(item.resultcode == 108){
                  item.smsMessageState = "号码内容空";
                }else if(item.resultcode == 109){
                  item.smsMessageState = "账号冻结";
                }else if(item.resultcode == 112){
                  item.smsMessageState = "号码错误";
                }else if(item.resultcode == 131){
                  item.smsMessageState = "手机空号";
                }else if(item.resultcode == 132){
                  item.smsMessageState = "手机停机";
                }else if(item.resultcode == 133){
                  item.smsMessageState = "手机关机";
                }else if(item.resultcode == 134){
                  item.smsMessageState = "无状态";
                }else{
                  item.smsMessageState = "发送失败";
                } 
              }
            })
            console.log(that.smsdata)
            that.pageNumber = data.result.pageNumber;
            that.totalPage = data.result.totalPages;
            that.$Message.info("查询成功");
          } else {
            that.$Message.info(data.message);
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 查询法官列表失败");
        });
    },
    changeLoading () {
        this.loading = false;
        this.$nextTick(() => {
            this.loading = true;
        });
    },
    sendBtn(){
      this.smsModel = true;
      this.sendPhone = "";
      this.sendContent = "";
    },
    smsOk(){
      var params = {
        phone:this.sendPhone,
        content:this.sendContent
      }
      selfEditingSms(params).then(res => {
        if(res.data.state == 100){
          this.$Message.success(res.data.message);
          this.getList(1);
          this.smsModel = false;
        }else{
          this.$Message.info(res.data.message)
          this.changeLoading();

        }
      })
    },
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
        });
    },
    tableCheck(c) {
      var arr = [];
      var arr2 = [];
      for (let i = 0; i < c.length; i++) {
        const el = c[i];
        arr.push(el.id);
        arr2.push(el.name);
      }
      this.checkNames = arr2;
      this.checkIds = arr;
    },
    changePage(p) {
      this.getList(p);
    },
    formatDate(d, fmt) {
      return formatDate(d, fmt);
    },
    // daterange转为开始时间 结束时间
    daterangeToSE(params) {
      var s = "";
      var e = "";
      // console.log(params.daterange);
      if (params.daterange[0]) {
        s = params.daterange[0];
      }
      if (params.daterange[1]) {
        e = params.daterange[1];
      }
      s && (params.startDate = formatDate(s, "yyyy-MM-dd"));
      e && (params.endDate = formatDate(e, "yyyy-MM-dd"));
      // delete params.daterange;
      return params;
    }
  },
  filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>
