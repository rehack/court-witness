<template>
    <div>
        <Card>
            <Row style="margin-bottom:15px">
                <!-- <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">申请处理</span>
                </Col> -->
                <Col span="24">
                    <!-- <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button> -->
                    <Form :model="formItem" inline :label-width="100">
                        <FormItem label="案号：">
                            <Input style="width: 200px" v-model="searchData.lawCaseNo"/>
                        </FormItem>
                        <FormItem label="申请事项：">
                            <Select v-model="searchData.flags" style="width: 200px;vertical-align:middle;">
                              <Option value="0">管辖异议</Option>
                              <Option value="1">举证延期</Option>
                              <Option value="2">庭审排期</Option>
                              <Option value="3">财产保险</Option>
                              <Option value="4">调查取证</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="申请人：">
                            <Input style="width: 200px" v-model="searchData.litigantName"/>
                        </FormItem>
                        <FormItem label="案由：">
                            <Select v-model="searchData.caseBrief" style="width: 200px;vertical-align:middle;">
                              <Option v-for="item in briefList" :value="item.brief" :key="item.brief">{{ item.brief }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="处理结果：">
                            <Select v-model="searchData.processResults" style="width: 200px;vertical-align:middle;">
                              <Option value="1">同意</Option>
                              <Option value="2">驳回</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="立案时间：">
                            <DatePicker v-model="searchData.caseCreateTime" format="yyyy/MM/dd" type="daterange" placement="bottom-start" placeholder="请选择开庭时间" style="width: 200px"></DatePicker>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="searchL" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Table
        ref="judgeTable"
        border
        stripe
        :columns="recordList"
        :data="recordData"
        @on-selection-change="tableCheck"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            v-model="addModal"
            title="待处理"
            :loading="loading"
            cancel-text="取消"
            ok-text="提交"
            @on-ok="asyncOK"
            class="dadd"
            style="z-index:9999999">
            <Form :model="addFormItem" :label-width="85" inline>
                <FormItem label="申请人:"  style="width: 435px">
                    <span>{{lininame}}</span>
                </FormItem>
                <FormItem label="申请时间:"  style="width: 435px">
                    <span>{{adtime}}</span>
                </FormItem>
                <FormItem label="申请事项:"  style="width: 435px">
                    <span>{{dealtype}}</span>
                </FormItem>
                <FormItem label="申请理由:"  style="width: 435px">
                    <span>{{addReason}}</span>
                </FormItem>
                <FormItem label="处理结果:"  style="width: 435px">
                    <RadioGroup v-model="result">
                        <Radio label="同意"></Radio>
                        <Radio label="驳回"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="意见:"  style="width: 435px">
                    <Input name="fouce" v-model="addFormItem.reason" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="处理意见"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getBrief } from "@/api/global";
import { judgeQuest, ediApplication } from "@/api/courtWitness/lawCase.js"
export default {
  data() {
    // var nowD = new Date();
    return {
      result:"同意",
      addFormItem:{},
      searchData:{
        lawCaseNo: "",
        flags: "",
        litigantName:"",
        caseBrief: "",
        processResults: "",
        caseCreateTime:""
      },
      addModal: false,
      briefList: [],
      cardState: 0,
      show1: false,
      saved: false,
      del_loading: false,
      modal2: false,
      spinShow: false,
      totalPage2: 0,
      lawCaseId:"",
      totalPage:0,
      lininame:'',
      adtime:"",
      dealtype:"",
      addReason:"",

      searchConnectData:{
        jobNumber: "",
        name: "",
        phone: "",
        identity: "",
        sex: ""
      },
      pageNumber: 1,
      pageNumber2: 0,
      checkIds: [],
      checkNames: [],
      loading: true,
      detailModal:false,
      departmentList: [],
      detailData:[],
      recordData:[],
      applicationId:'',
      selectId:'',
      formItem: {
        id:"",
        caseNo: "",
        judgeName: "",
        brief: "",
        clerkName: "",
        servicePersonnelName:""
      },
      recordList: [
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 180,
          fixed: "left",
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
                            name: "myLawcaseInfo",
                            params: { lawCaseId: params.row.id }
                          });
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
          key: "CaseBrief",
          align: "center",
          width: 100,
          ellipsis: true
        },
        {
          title: "申请人",
          key: "LitiganName",
          width:100,
          align: "center"
        },
        {
          title: "类型",
          key: "LitigantType",
          width:100,
          align: "center"
        },
        {
          title: "手机号码",
          key: "LitigantPhone",
          width:200,
          align: "center"
        },
        {
          title: "立案时间",
          key: "CaseCreateTime",
          width:150,
          align: "center"
        },
        {
          title: "标的",
          key: "ApplyStandard",
          width:180,
          align: "center"
        },
        {
          title: "申请事项",
          key: "Applyflag",
          width:220,
          align: "center"
        },
        {
          title: "申请时间",
          key: "ApplyTime",
          width:150,
          align: "center"
        },
        {
          title: "处理结果",
          key: "ApplyDealState",
          width:150,
          align: "center"
        },
        {
          title: "申请内容",
          key: "ApplyDealReason",
          width:180,
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width:100,
          fixed: "right",
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
                      if(params.row.ApplyDeal == "待处理"){
                        this.lininame = params.row.LitiganName;
                        this.adtime =  params.row.ApplyTime,
                        this.dealtype =  params.row.Applyflag,
                        this.applicationId = params.row.id;
                        this.lawCaseId = params.row.CaseId;
                        this.addReason =  params.row.ApplyDealReason,
                        this.addModal = true;
                      }
                    }
                  }
                },
                params.row.ApplyDeal
              )
            ]);
          }
        }
      ],
    };
  },
  mounted() {
    if(this.$route.query){
      console.log(595);
      console.log(this.$route.query);
      if(this.$route.query.caseNo){
        this.searchData.lawCaseNo = this.$route.query.caseNo;
        this.getList(1);
      }else{
        this.getList(1);
      }
    }else{
      this.getList(1);
    }
    // this.getCourtList();
  },
  created() {
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
    getCourtList() {
      courtList()
        .then(res => {
          if (res.data.state == 100) {
            res.data.result.map(item => {
              this.departmentList.push({ name: item.name, id: item.id });
            });
          }
        })
        .catch(err => {});
    },
    selectOne (e){
        this.selectId = e.id;
        console.log(this.selectId)
    },
    searchL(){
      if(this.searchData.caseCreateTime !=''){
         this.searchData.caseCreateTime = new Date(this.searchData.caseCreateTime).getTime();
      }
      this.getList(1);
    },
    compare(property){
      return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
      }
    },
    getList(page) {
      var that = this;
      var params = {
        pageNumber: page,
        pageSize: 10
      };
      this.recordData=[];
      judgeQuest(this.searchData, params)
        .then(res => {
          console.log(res.data.state)
          if (res.data.state === 100) {
            console.log(res.data.application.sort(this.compare('ApplyDealState')))
            res.data.application.map(item => {
                let objectData = {
                    id:item.ID,
                    CaseId:item.CaseId,
                    caseNo: item.caseNo,
                    CaseBrief: item.CaseBrief,
                    LitiganName: item.LitiganName,
                    LitigantType: item.LitigantType,
                    LitigantPhone: item.LitigantPhone,
                    CaseCreateTime: item.CaseCreateTime,
                    ApplyStandard: item.ApplyStandard,
                    Applyflag: item.Applyflag,
                    ApplyTime: item.ApplyTime,
                    ApplyDealState: item.ApplyDealState == 0 ? "未处理" : (item.ApplyDealState == 1 ? "同意" : "驳回"),
                    ApplyDeal: item.ApplyDealState == 0 ? "待处理" : "已处理",
                    ApplyDealReason:item.ApplyReason,
                };
                this.recordData.push(objectData);
            });
            // console.log(this.recordData)
            // that.pageNumber = data.result.pageNumber;
            // that.totalPage = data.result.totalPages;
          } else {
            that.$Message.info(data.message);
          }
        })
    },
    addJudge() {
      this.$refs.judgeTable.clearCurrentRow();
    },
    searchServerviceList(){
        var that = this;
        var params = this.searchConnectData;
        params.pageNumber = 1;
        params.pageSize = 10;
        serviceList(params).then(res => {
            var data = res.data;
          if (data.state === 100) {
            that.detailData = data.result.content;
            that.pageNumber2 = data.result.pageNumber;
            that.totalPage2 = data.result.totalPage;
          } else {
            that.$Message.info(data.message);
          }
        })
    },
    distributive(){
        if(this.onSelectData==""){
            this.$Message.info("请选择需要分配的案件");
            return false;
        }
        this.selectId = "";
        var that = this;
        this.detailModal = true;
        this.searchConnectData.name="";
        var params = {
            jobNumber: "",
            name: "",
            phone: "",
            identity: "",
            sex: "",
        };
        params.pageNumber = 1;
        params.pageSize = 10;
        serviceList(params).then(res => {
            var data = res.data;
          if (data.state === 100) {
            that.detailData = data.result.content;
            that.pageNumber2 = data.result.pageNumber;
            that.totalPage2 = data.result.totalPage;
          } else {
            that.$Message.info(data.message);
          }
        })
    },
    onOkF(){
        let lawCaseIds = "";
        this.loading = true;
        this.onSelectData.map((item, index) => {
            if (index == this.onSelectData.length - 1) {
            lawCaseIds += item.id;
            } else {
            lawCaseIds += item.id + ",";
            }
        });
        distri(this.selectId, lawCaseIds).then(res => {
            if(res.data.state==100){
                this.$Message.success(res.data.message);
                this.loading = false;
                this.onSelectData=="";
                this.getList(1);

            }else{
                this.$Message.info(res.data.message);
            }
        })
    },
    save() {
      var that = this;
      that.saved = true;
      this.departmentList.map(item => {
        if (item.name == this.info.departmentName) {
          this.info.departmentId = item.id;
        }
      });
      var params = {
        jobNumber: this.info.jobNumber,
        name: this.info.name,
        phone: this.info.phone,
        identity: this.info.identity,
        sex:this.info.sex
      };

      if (this.cardState === 2) {
        params.identity = this.info.identity; // 添加信息要传身份证号
        add(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
              this.info.jobNumber = "";
              this.info.name = "";
              this.info.phone = "";
              this.info.identity = "";
              this.info.sex=""
            }
            that.saved = false;
          })
          .catch(() => {
            that.$Message.error("网络错误");
            that.saved = false;
          });
      } else {
        update(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
              this.info.jobNumber = "";
              this.info.name = "";
              this.info.phone = "";
              this.info.identity = "";
              this.info.sex=""
              this.cardState = 0;
            }
            that.saved = false;
          })
          .catch(() => {
            that.$Message.error("网络错误");
            that.saved = false;
          });
      }
    },
    asyncOK(){
      if(this.result == "同意"){
        this.result = 1
      }else{
        this.result = 2
      }
      if(this.addFormItem.reason ==""){
        this.$Message.info("处理意见不能为空");
        return false;
      }
      ediApplication(this.lawCaseId, this.result, this.addFormItem.reason, this.applicationId).then(res => {
        if(res.data.state == 100){
              this.$Message.success(res.data.message);
              this.changeLoading();
              this.addModal = false;
              this.getList(1);
        }else{
            this.$Message.error(res.data.message);
            this.changeLoading();
        }
      })
    },
    delJudge() {
      this.spinShow = true;
      this.modal2 = false;
      var that = this;
      del(that.checkIds)
        .then(res => {
          that.spinShow = false;
          var data = res.data;
          that.$Message.info(data.message);
          if (data.state === 100) {
            that.getList(that.pageNumber);
          }
        })
        .catch(() => {
          that.spinShow = false;
          that.$Message.error("网络错误");
        });
    },
    tableCheck(selection) {
      this.onSelectData = selection;
      console.log(this.onSelectData)
    },
    changePage(p) {
      this.getList(p);
    },
    changePage2(p){

    },
    clean() {
      this.searchData = {
        lawCaseNo: "",
        flags: "",
        litigantName:"",
        caseBrief: "",
        processResults: "",
        caseCreateTime:""
      }
    },
    toAdd() {
      this.cardState = 2;
      this.info = {
        jobNumber: "",
        name: "",
        phone: "",
        identity: "",
        sex: ""
      };
    },
    birthdayChange(d) {
      this.info.birthdayD = d;
    },
    createDateChange(d) {
      this.info.createDateD = d;
    },
    exportExcel() {},
    formatDate(d, fmt) {
      return formatDate(d, fmt);
    }
  }
};
</script>
<style>
.ivu-form-item{
  margin-bottom:15px;
}
</style>
