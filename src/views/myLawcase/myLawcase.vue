<template>
    <div>
        <Card>
            <Row style="margin-bottom:15px;">
                <!-- <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">案件办理</span>
                </Col> -->
                <Col span="24">
                    <!-- <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button> -->
                    <Form :model="formItem" inline :label-width="100" >
                        <FormItem label="案号：">
                            <Input style="width: 200px" v-model="searchData.caseNo"/>
                        </FormItem>
                        <FormItem label="当事人：">
                            <Input style="width: 200px" v-model="searchData.litigantName"/>
                        </FormItem>
                        <FormItem label="诉讼状态：">
                            <Select v-model="searchData.litigantStates" style="width: 200px;vertical-align:middle;">
                              <Option value="1">举证</Option>
                              <Option value="2">质证</Option>
                              <Option value="3">已开庭</Option>
                              <Option value="4">已结案</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="案由：">
                            <Select v-model="searchData.briefName" style="width: 200px;vertical-align:middle;">
                              <Option v-for="item in briefList" :value="item.brief" :key="item.brief">{{ item.brief }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="立案时间：">
                            <DatePicker :options="options" v-model="searchData.filingDate" format="yyyy/MM/dd" type="daterange" placement="bottom-start" placeholder="请选择开庭时间" style="width: 200px"></DatePicker>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="serechL" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <!-- <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button> -->
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
            v-model="dealModal"
            width="1000px"
            cancel-text=""
            ok-text="关闭"
            title="案件处理">
            <courFocusInfo :lowCaseId="lowCaseId" :briefName="briefName" ref="fouceList"/>
        </Modal>
        <Modal
            v-model="fouceModal"
            width="1000px"
            cancel-text=""
            ok-text="关闭"
            title="争议焦点">
            <courFocusInfo :lowCaseId="lowCaseId" :briefName="briefName" ref="fouceList"/>
        </Modal>
         <Modal
            v-model="applyModal"
            title="延期申请"
            :loading="loading"
            cancel-text="取消"
            ok-text="提交"
            @on-ok="asyncOK"
            class="dadd"
            style="z-index:9999999">
            <Form  :label-width="85" inline>
                <FormItem label="申请事项:"  style="width: 435px">
                    <span>{{applyStr}}</span>
                </FormItem>
                <FormItem label="延期天数:"  style="width: 435px">
                    <Select v-model="delayTime"   style="width: 200px;vertical-align:middle;">
                        <Option v-for="item in days" :value="item" :key="item">{{ item }}天</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getBrief } from "@/api/global";
import { getEvi, getList, addApplication } from "@/api/witness/lawcaseInfo.js";
import { formatDate } from "@/libs/date";
import courFocusInfo from "@/components/focusInfo/courFocusInfo.vue";
export default {
  components: {
    courFocusInfo,
  },
  data() {
    // var nowD = new Date();
    return {
      searchData:{
        caseNo: "",
        litigantName: "",
        litigantStates:"",
        filingDate: [],
        briefName: "",
      },
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
      },
      applyModal:false,
      delayTime:"",
      applyStr:'',
      days:[1,2,3,4,5,6,7,8,9,10],
      briefList: [],
      lowCaseId:'',
      dealModal:false,
      briefName:"",
      fouceModal:false,
      cardState: 0,
      show1: false,
      saved: false,
      del_loading: false,
      modal2: false,
      spinShow: false,
      totalPage2: 0,
      totalPage:1,
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
      selectId:'',
      pageData: {
        pageNumber: 1,
        pageSize: 10
      },
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
          width: 200,
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
          key: "briefName",
          align: "center",
          ellipsis: true
        },
        {
          title: "原告",
          key: "plaintiffs",
          align: "center"
        },
        {
          title: "被告",
          key: "defendants",
          align: "center"
        },
        {
          title: "标的",
          key: "biaodi",
          align: "center"
        },
        {
          title: "时间",
          key: "servicePersonnelName",
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
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            if(params.row.processType=='举证期' || params.row.processType=='质证期'){
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
                            name: "myLawcaseInfo",
                            params: { lawCaseId: params.row.id }
                          });
                        }
                      }
                    },
                    "查看详情"
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "text",
                        size: "small",
                        clerkName:"shih"
                      },
                      on: {
                        click: () => {
                          this.lowCaseId = params.row.id;
                          if(params.row.processType=='举证期'){
                            this.applyStr = "举证延期"
                            this.applyModal = true;
                          }else if(params.row.processType=='质证期'){
                            this.applyStr = "质证延期"
                            this.applyModal = true;
                          }
                          
                        }
                      }
                    },
                    params.row.processType=='举证期' ? "举证期延期" : (params.row.processType=='质证期' ? '质证期延期' : '')
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
                            path: "/witness/application/index",
                            query: { caseNo: params.row.caseNo }
                          });
                        }
                      }
                    },
                    "处理申请"
                  ),
                ], "无");
            }else{
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
                            name: "myLawcaseInfo",
                            params: { lawCaseId: params.row.id }
                          });
                        }
                      }
                    },
                    "查看详情"
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
                            path: "/witness/application/index",
                            query: { caseNo: params.row.caseNo }
                          });
                        }
                      }
                    },
                    "处理申请"
                  ),
                ], "无");
            }
                
                  
                  
                  // h(
                  //   "Button",
                  //   {
                  //     props: {
                  //       type: "text",
                  //       size: "small"
                  //     },
                  //     on: {
                  //       click: () => {
                  //         this.fouceModal = true;
                  //         this.briefName = params.row.briefName + '　(' +params.row.caseNo + ')' ;
                  //         this.lowCaseId = params.row.id;
                  //         console.log(this.lowCaseId)
                  //         this.$refs.fouceList.getContents(this.lowCaseId);
                  //       }
                  //     }
                  //   },
                  //   "争议焦点"
          }
        }
      ],
    };
  },
  mounted() {
    this.getList(1);
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
    asyncOK(){
      var reason = "";
      addApplication(this.lowCaseId,this.applyStr, reason, this.delayTime).then(res => {
        if(res.data.state == 100){
          this.$Message.success(res.data.message);
          this.getList(this.pageNumber);
          this.applyModal = false;
        }else{
          this.$Message.info(res.data.message);
          this.changeLoading();
        }
      })
    },
    selectOne (e){
        this.selectId = e.id;
    },
    serechL(){ 
      if(this.searchData.filingDate !=''){
         this.searchData.filingDate = formatDate(this.searchData.filingDate, 'yyyy-MM-dd');
      }
       
      this.getList(1);

    },
    changeLoading () {
        this.loading = false;
        this.$nextTick(() => {
            this.loading = true;
        });
    },
    getList(page) {
      var params = {
        pageNumber: page,
        pageSize: 10
      };
      this.recordData = [];
       getList(this.searchData, params).then(res => {
            res.data.result2.map(item => {
                let str = "";
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
                    surplusDay:str,
                };
                this.recordData.push(objectData);
            });
            var arr = res.data.result; 
            this.totalPage =   res.data.totalCount;    
            for(var i=0;i<this.recordData.length;i++){
              for(var n=0;n<arr.length;n++){
                if(this.recordData[i].id==arr[n].id){
                  this.recordData[i].caseNo = arr[n].caseNo;
                  this.recordData[i].createDate = formatDate(new Date(arr[n].filingDate), 'yyyy-MM-dd');
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
                  this.recordData[i].plaintiffs = yStr.substring(0,yStr.length-1);
                  this.recordData[i].defendants = bStr.substring(0,bStr.length-1);
                }
              }
            }
      });
    },
    tableCheck(selection) {
      this.onSelectData = selection;
    },
    changePage(p) {
      this.pageNumber = p;
      this.getList(p);
    },
    changePage2(p){
        
    },
    clean() {
      searchData = {
        caseNo: "",
        litigantName: "",
        litigantStates:"",
        filingDate: [],
        briefName: "",
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
.ivu-table-cell p{
        text-align:left;
    }
    /* .ivu-table-cell button{
      display: block;
    } */
</style>