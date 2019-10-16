<template>
    <div>
        <Card style='height:100vh'>
            <Row  style="margin-bottom:10px">
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700;margin-bottom:10px">电话拨打记录查询</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent ="getList(1)" >
                        <FormItem label="案号：">
                            <Input style="width: 200px" v-model="formItem.lawCaseNum"/>
                        </FormItem>
                        <FormItem label="当事人：">
                            <Input style="width: 200px" v-model="formItem.litigantName"/>
                        </FormItem>
                        <FormItem label="接听电话：">
                            <Input style="width: 200px" v-model="formItem.answerPhone"/>
                        </FormItem>
                        <FormItem label="拨打日期：">
                            <DatePicker style="width: 200px" type="daterange" v-model="formItem.handoverDate"></DatePicker>
                        </FormItem>
                        <FormItem label="是否接听：">
                            <Select v-model="formItem.isAnswer" clearable style="width:200px">
                                <Option v-for="item in isAnswerList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="未接通原因：">
                            <Select v-model="formItem.noAnswerReason" clearable style="width:200px">
                                <Option v-for="item in reasonList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <!-- <Button @click="uploadOCR" class="border-btn" style="margin-left: 10px;margin-bottom:10px;margin-top:10px">导入EMS记录</Button> -->
            <!-- <Button @click="sureSend" type="primary" style="margin-left: 10px;margin-bottom:10px;margin-top:10px">批量确认送达</Button> -->
            <Table stripe ref="judgeTable" :columns="judgecol"  :data="casedata" @on-selection-change="tableCheck"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            v-model="yjMol"
            width="560px"
            :mask-closable="closeM"
            title="邮寄信息">
            <!-- <div v-html="yjcontent">
                
            </div> -->
            <mySteps :current="2" direction="vertical" v-show="stepList.length > 0">
              <myStep v-for="(item, index) in stepList" :icon="index == 0 ? 'compose' : '' " :status="index == 0 ? 'process' : 'finish'" :title="item.time" :content="item.content" ></myStep>
           </mySteps>
           <div v-show="stepList.length == 0" style="text-align: center;color:#999;">
              暂无数据
            </div>
            <div slot="footer"> 
                <Button @click="cloaselawyer"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import myStep from "@/components/step";
import mySteps from "@/components/steps";
import { queryCallLog } from "../../api/emsRecord.js";
import { formatDate } from "../../libs/date.js";
export default {
  components: {
         mySteps: mySteps,
          myStep: myStep
    },
  data() {
    // var nowD = new Date();
    return {
      sendTypes:[
      "现场领取",
      "EMS送达",
      "工作人员上门送达",
      "电子邮件送达",
      "H5确认阅读"
    ],
      show1:true,
      closeM:false,
      yjMol:false,
      sendTo: "0",
      yjcontent:"",
      isAnswerList:[
          {
              id:1,
              name:'已接听'
          },
          {
              id:0,
              name:'未接听'
          },
      ],
      reasonList:[
          {
              id:0,
              name:'空号'
          },
          {
              id:1,
              name:'未接'
          },
          {
              id:2,
              name:'停机'
          },
          {
              id:3,
              name:'关机'
          },
      ],
      // lawCaseId:"",
      successList:"",
      fileUploadData:{},
      casesuccessNum:"",
      caseLi:[],
      caseIdList:[],
      defendantList:[],
      stepList:[],
      uploadLitigantMessage:'',
      errorNum:"",
      successNum:'',
      formItem: {
        lawCaseNum: "",
        litigantName: "",
        answerPhone: "",
        isAnswer:"",
        noAnswerReason:"",
        startTime: "",
        endTime: "",
        handoverDate:""
      },
      detailModal:false,
      loading:true,
      spinShow: false,
      totalPage: 1,
       pageNumber: 1,
       judgecol: [
        //  {
        //   type: "selection",
        //   fixed: "left",
        //   align: "center",
        //   width: 60
        // },
        {
          title: "案号",
          key: "registerNo",
          align: "center",
          fixed: "left",
          width: 180,
          render: (h, params) => {
            return h("span", {
            }, params.row.lawCase.caseNo)
          }
        },
        {
          title: "当事人",
          key: "litigantName",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("span", {
            }, params.row.litigant.litigantName)
          }
        },
        {
          title: "身份证号码",
          key: "identityCard",
          align: "center",
          width: 170,
          render: (h, params) => {
            return h("span", {
            }, params.row.litigant.identityCard)
          }
        },
        {
          title: "当事人联系电话",
          key: "answerPhone",
          align: "center",
          ellipsis: true,
          width: 150,
        },
        {
          title: "接通状态",
          key: "sendType",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("span", {
              class:params.row.isAnswer == "已接听" ? "success" : "red"
            }, params.row.isAnswer)
          }
        },
        {
          title: "未接通原因",
          key: "sendType",
          align: "center",
          width: 130,
          render: (h, params) => {
            return h("span", {
              class:params.row.noAnswerReason == "" ? "" : "red"
            }, params.row.noAnswerReason == "" ? '无' : params.row.noAnswerReason)
          }
        },
        {
          title: "操作人员",
          key: "callerName",
          align: "center",
          width: 150
        },
        {
          title: "所属法院",
          key: "courtName",
          align: "center",
          width: 150
        },
        {
          title: "时间",
          key: "time",
          align: "center",
          width: 170,
          render: (h, params) => {
            return h("span", {
            }, formatDate(new Date(params.row.createDate),'yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 140,
        //   
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    
                  },
                  style: {
                        // marginRight: '500px',
                        color:'#40A9FF'
                    },
                  on: {
                    click: () => {
                      if(params.row.isAnswer != "已接听"){
                        return false;
                      }
                      if(params.row.recordAddress != null){
                          this.$Modal.confirm({
                                title: '提示',
                                content: '<p>确定要下载么</p>',
                                onOk: () => {
                                    // this.$Message.info('Clicked ok');
                                    let str = params.row.recordAddress.substr(0,1);
                                    console.log(str)
                                    if(str == '/'){
                                    window.open(params.row.recordAddress)
                                    }else{
                                    window.open('/'+params.row.recordAddress)
                                    }
                                },
                                onCancel: () => {
                                    // this.$Message.info('Clicked cancel');
                                }
                            });
                        
                      }else{
                        this.$Message.info('没有录音文件');
                      }
                    }
                  }
                },
                params.row.isAnswer == "已接听" ? '下载录音文件' : ""
              )
            ]);
          }
        }
        
      ],
      casedata: [],
    };
  },
  mounted() {
    this.getList(1);
    
  },
  methods: {
    radioChange(){
       var key = this.sendTo;
       switch (key) {
          case "0":
          this.defendantList.forEach(el => {
            el.checked = false;
          });
          break;
          case "3":
          this.defendantList.forEach(el => {
            el.checked = true;
          });
          break;
       }
    },
    cloaselawyer(){
      this.yjMol = false;
    },
    checkChange(){

    },
    printBill(){

    },
    // showType(id,sendType){
    //   if(sendType == 3){
    //     emailList(this.lawCaseId,id).then(res => {
    //       if (res.data.state === 100){
    //         for(var i=0;i<this.defendantList.length;i++){
    //           if(this.defendantList[i].id == id){
    //             this.defendantList[i].emailListArr = res.data.result.content;
    //           }
    //         }
    //       }
    //     })
    //   }
      
    // },
  
    asyncOK(){
      this.getList(1);
    },
    tableCheck(value){
      
      let arr = [];
      for(let i = 0;i<value.length;i++){
        arr.push(value[i].id); 
      }
      this.caseIdList = arr;
      console.log(this.caseIdList)
    },
    clean(){
      this.formItem = {
        lawCaseNum: "",
        litigantName: "",
        answerPhone: "",
        isAnswer:"",
        noAnswerReason:"",
        startTime: "",
        endTime: "",
        handoverDate:""
      }
    },
    changePage(num){
      this.getList(num);
    },
    onOkF(){

    },
    getList(page) {
      var that = this;
      this.pageNumber = page;
      if(this.formItem.handoverDate .length != 0 && this.formItem.handoverDate[0] != null){
        this.formItem.startTime =formatDate(new Date(this.formItem.handoverDate[0]),'yyyy-MM-dd');
        this.formItem.endTime =formatDate(new Date(this.formItem.handoverDate[1]),'yyyy-MM-dd');
      }else{
        this.formItem.startTime = ""
        this.formItem.endTime = ""
      }
      var params = {
        lawCaseNum: this.formItem.lawCaseNum,
        litigantName: this.formItem.litigantName,
        answerPhone: this.formItem.answerPhone,
        noAnswerReason: this.formItem.noAnswerReason,
        isAnswer: this.formItem.isAnswer,
        // handoverDate:this.formItem.handoverDate ? formatDate(new Date(this.formItem.handoverDate),'yyyy-MM-dd') : "",
        startTime:this.formItem.startTime,
        endTime:this.formItem.endTime,
        systemId:1,
        pageNumber: page,
        pageSize: 10,
      };
      this.casedata = [];
      queryCallLog(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            this.casedata = data.case;
            this.totalPage = data.count;
          } else {
            that.$Message.info(data.message);
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 查询列表失败");
        });
    },
  }
};
</script>
<style>
.ivu-table-cell .success{
  color: green;
}
.ivu-table-cell .blue{
  color: blue;
}
.ivu-table-cell .red{
  color: red;
}
.ivu-tooltip-inner div {
  /* width:450px */
}
</style>
