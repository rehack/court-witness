<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                修改EMS信息
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案号
                    </Col>
                    <Col  span="9" class="maininfo-col">
                        <Input v-model="info.caseNo" style="width: 100%"></Input>
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        当事人
                    </Col>
                    <Col  span="9" class="maininfo-col">
                        <Input v-model="info.litigantName" style="width: 100%"></Input>
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        地址
                    </Col>
                    <Col  span="9" class="maininfo-col">
                        <Input v-model="info.address" style="width: 100%"></Input>
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        是否市内外
                    </Col>
                    <Col  span="9" class="maininfo-col">
                        <Select v-model="info.isInsideCity" clearable style="width:100%">
                              <Option v-for="item in cityornot" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        身份证号
                    </Col>
                    <Col  span="9" class="maininfo-col">
                        <Input v-model="info.identityCard" style="width: 100%"></Input>
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        固定电话
                    </Col>
                    <Col  span="9" class="maininfo-col">
                        <Input v-model="info.phone" style="width: 100%"></Input>
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码
                    </Col>
                    <Col  span="9" class="maininfo-col">
                        <Input v-model="info.telephone" style="width: 100%"></Input>
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        备注
                    </Col>
                    <Col  span="9" class="maininfo-col">
                        <Input v-model="info.remark" style="width: 100%"></Input>
                    </Col>

                </Row>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <!-- <Button v-show="cardState === 1" @click="cardState = 3" type="warning" size="large">修改</Button> -->
                    <Button @click="save"  type="success" size="large">保存</Button>
                    <Button @click="cardState = false" type="text" size="large">取消</Button>
                </div>
            </div>
        </Card>
        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700;margin-bottom:10px">EMS记录查询</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent ="getList(1)" >
                        <FormItem label="引调号：">
                            <Input style="width: 200px" v-model="formItem.caseNo"/>
                        </FormItem>
                        <FormItem label="当事人：">
                            <Input style="width: 200px" v-model="formItem.litigantName"/>
                        </FormItem>
                        <FormItem label="邮单号：">
                            <Input style="width: 200px" v-model="formItem.emsNo"/>
                        </FormItem>
                        <FormItem label="交邮日期：">
                            <DatePicker style="width: 200px" type="daterange" v-model="formItem.handoverDate"></DatePicker>
                        </FormItem>
                        <FormItem label="送达状态：">
                            <Select v-model="formItem.sendType" clearable style="width:200px">
                                <Option v-for="item in sendTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
            
            <Row class-name="regFormat" >
              <Col span="7">
                <Button @click="uploadOCR" class="border-btn" style="margin-left: 10px;margin-bottom:10px;margin-top:10px">导入EMS记录</Button>
                <Button @click="sureSend" type="primary" style="margin-left: 10px;margin-bottom:10px;margin-top:10px">批量确认送达</Button>
              </Col>
              <Col span="3" class="numsTy"><span style="color: green;">已送达数量：{{sendtyone}}</span></Col>
              <Col span="3"  class="numsTy"><span style="color: #2196F3;">已签收数量：{{sendtytwo}}</span></Col>
              <Col span="3" class="numsTy"><span>送达中数量：{{sendtythree}}</span></Col>
              <Col span="3" class="numsTy"><span  style="color: red;">已退件数量：{{sendtyfour}}</span></Col>
              <Col span="4" class="numsTy"><span  style="color: #ff9800;">单号错误数量：{{sendtyfive}}</span></Col>
            </Row>
            <Table stripe ref="judgeTable" :columns="judgecol" :data="casedata" @on-selection-change="tableCheck"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            title="导入EMS记录"
            v-model="OCRModal"
            @on-ok="asyncOK"
            cancel-text=""
            ok-text="关闭"
            :mask-closable="false">
            <Alert v-show="uploadLitigantIsError" type="error" show-icon>{{ uploadLitigantMessage }}</Alert>
            <Alert v-show="uploadLitigantIsSuccess" type="success" show-icon>{{ uploadLitigantMessage }}</Alert>
            <div v-show="uploadLitigantIsWarning">
              <Alert  type="warning" show-icon>成功：{{ successNum }}条，错误：{{ errorNum }}条，{{ uploadLitigantMessage }}</Alert>
              <div style="margin-bottom:10px;padding:5px">错误案件：
                <p v-for="item in caseLi" style="font-size:12px;">案号：<span style="color:#38B3FF">{{item.caseNo}}</span> <span style="color:red;display:inline-block;margin-left:15px;">{{item.reason}}</span></p>
              </div>
            </div>
            <upload-multiple
                multiple
                type="drag"
                :data="fileUploadData"
                :before-upload="beforeUploadOCR"
                :on-success="uploadOCRSuccess"
                name="file"
                :show-upload-list="false"
                action="/api/court/emsRecord/uploadFile.jhtml">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽文件上传</p>
                </div>
            </upload-multiple>
            <p style="text-align:right;margin-top: 15px;"><Button type="primary" style="margin-right:15px" @click="buildRecord">下载模板</Button></p>
            <div v-show="OCRLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;background: rgba(255,255,255,0.5)">
              <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
              <div style="position:absolute;bottom: 60px;left:50%;margin-left:-60px;color:#3399ff">上传识别中请稍后。。。</div>
            </div>
            <Alert type="success" show-icon closable style="margin-top:10px;" v-show="uploadOCRIsSuccess">
                导入成功
              <div>共导入{{casesuccessNum}}件案件
                <Button type="text" @click="" v-for="item in successList.split(',')" style="color:#3399ff;">
                  {{item}}
                </Button>

              </div>
            </Alert>
        </Modal>
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
import { findAllCase, buildDiploms, sendmessage, emailList } from "../../api/finanseCase.js";
import { findAllRecord,updateSendType, updateEmsRecord } from "../../api/emsRecord.js";
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import uploadMultiple from '@/components/upload-multiple2';
import { formatDate } from "../../libs/date.js";
export default {
  components: {
        ClipLoader,
        'upload-multiple': uploadMultiple,
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
      show1:false,
      OCRModal:false,
      info:{},
      OCRLoading:false,
      uploadOCRIsSuccess: false,
      uploadLitigantIsError:false,
      uploadLitigantIsSuccess:false,
      uploadLitigantIsWarning:false,
      wenmodal:false,
      closeM:false,
      yjMol:false,
      cardState:false,
      sendtyone:0,
      sendtytwo:0,
      sendtythree:0,
      sendtyfour:0,
      sendtyfive:0,
      sendTo: "0",
      yjcontent:"",
      cityornot:[
        {
          id:1,
          name:"是"
        },
        {
          id:0,
          name:"否"
        },
      ],
      sendTypeList:[
          {
              id:1,
              name:'已送达'
          },
          {
              id:2,
              name:'已签收'
          },
          {
              id:3,
              name:'送达中'
          },
          {
              id:4,
              name:'已退件'
          },
          {
              id:5,
              name:'单号错误'
          },
      ],
      lawCaseId:"",
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
        caseNo: "",
        litigantName: "",
        emsNo: "",
        handoverDate: "",
        sendType: "",
        startDate:"",
        endDate:""
      },
      detailModal:false,
      loading:true,
      spinShow: false,
      totalPage: 1,
       pageNumber: 1,
       judgecol: [
         {
          type: "selection",
          fixed: "left",
          align: "center",
          width: 60
        },
        {
          title: "引调号",
          key: "caseNo",
          align: "center",
          fixed: "left",
          width: 160
        },
        {
          title: "当事人",
          key: "litigantName",
          align: "center",
          width: 150
        },
        {
          title: "身份证号码",
          key: "identityCard",
          align: "center",
          width: 150
        },
        {
          title: "送达状态",
          key: "sendType",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("span", {
              class:params.row.sendType == 1 ? "success" : (params.row.sendType == 2 ? "blue" : (params.row.sendType == 3 ? "black" : (params.row.sendType == 4 ? "red" : 'rred')))
            }, params.row.sendType == 1 ? "已送达" : (params.row.sendType == 2 ? "已签收" : (params.row.sendType == 3 ? "送达中" : (params.row.sendType == 4 ? "已退件" : '单号错误'))))
          }
        },
        {
          title: "邮单号",
          key: "emsNo",
          align: "center",
          width: 150
        },
        {
          title: "邮寄详情",
          key: "xqing",
          align: "center",
          width: 170,
          render: (h, params) => {
            let texts = "";
            let tes = "";
            let aryt = [];
            let sary = [];
            if (params.row.content !== null) {
                if (params.row.content.length > 13) {
                    sary = params.row.content.split("    ;");
                    texts = sary[0];
                    // tes = sary.join("<br/>"); 
                    if(sary.length > 0){
                      for(let u=0;u<sary.length;u++){
                        let shh = sary[u].split("  |  ");
                        const da = {
                          time:shh[0],
                          content:shh[1],
                        }
                        aryt.push(da)
                      }
                    }               
                } else {
                    texts = params.row.content;
                }
            }
            return h("div", {
              props: {
              },
            },[
                // texts,
                h(
                "p",
                {
                  props: {
                    type: "success",
                    size: "small",
                    display:'block',
                  },
                  on: {
                    click: () => {
                    }
                  }
                },texts),
                h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                    display:'block',
                  },
                  on: {
                    click: () => {
                      this.yjMol = true;
                      this.stepList = aryt;
                      this.yjcontent = tes;
                    }
                  }
                },'查看更多'),
                // h('div',{
                //   slot:'content',
                //   style:{
                //     whiteSpace: 'normal',
                //     'max-width':'450px;'
                //   }
                // }, tes)
              ]);
          }
        },
        {
          title: "固定电话",
          key: "phone",
          align: "center",
          width: 150
        },
        {
          title: "手机号码",
          key: "telephone",
          align: "center",
          ellipsis: true,
          width: 150,
        },
        {
          title: "地址",
          key: "address",
          align: "center",
          width: 150
        },
        {
          title: "交邮日期",
          key: "handoverDate",
          align: "center",
          width: 160
        },
        {
          title: "地址类型",
          key: "remark",
          align: "center",
          width: 150
        },
        {
          title: "是否市外",
          key: "isInsideCity",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("span", {}, params.row.isInsideCity == true ? "是" : "否" );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style:{
                    display:params.row.sendType == 2 ? "" : "none"
                  },
                  on: {
                    click: () => {
                      if(params.row.sendType != 2){
                        return false;
                      }
                      updateSendType(params.row.id).then(res => {
                        if(res.data.state == 100){
                          this.caseIdList = [];
                          this.$Message.success(res.data.message);
                          this.getList(this.pageNumber);
                        }else{
                          this.$Message.info(res.data.message);
                        }
                      })
                    }
                  }
                },
                params.row.sendType == 2 ? "确认送达" : ""
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style:{
                    display:params.row.sendType == 1 ? "none" : (params.row.sendType == 2 ? "none" : ""),
                  },
                  on: {
                    click: () => {
                      this.cardState = true;
                      this.info = {
                        emsRecordId:params.row.id,
                        caseNo:params.row.caseNo,
                        emsNo:params.row.emsNo,
                        litigantName:params.row.litigantName,
                        address:params.row.address,
                        isInsideCity:params.row.isInsideCity == true ? 1 : 0,
                        identityCard:params.row.identityCard,
                        phone:params.row.phone,
                        telephone:params.row.telephone,
                        remark:params.row.remark,
                      }
                    }
                  }
                },
                params.row.sendType == 1 ? "" : (params.row.sendType == 2 ? "" : "修改")
              ),
            ]);
          }
        }
        
      ],
      casedata: [],
    };
  },
  mounted() {
    let myDate = Date.parse(new Date());
    let myDate1 = formatDate(new Date(myDate),'yyyy-MM-dd') ;
    console.log(myDate)
    let upWeek =formatDate(new Date(myDate -  7*24*3600*1000),'yyyy-MM-dd');
    // console.log(formatDate(new Date(myDate -  7*24*3600*1000),'yyyy-MM-dd'))
    this.formItem.handoverDate.push(upWeek,myDate1)
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
    save(){
      updateEmsRecord(this.info).then(res => {
        if(res.data.state == 100){
          this.$Message.success(res.data.message);
          this.cardState = false;
        }else{
          this.$Message.info(res.data.message);
        }
      })
    },
    buildRecord(){
      window.open('/upload/demo/emsdemo.xlsx')
    },
    cloaselawyer(){
      this.yjMol = false;
    },
    sureSend(){
      if(this.caseIdList.length == 0){
        this.$Message.info('请选择案件');
        return false;
      }
      let str= this.caseIdList.join(',');
      updateSendType(str).then(res =>{
        if(res.data.state == 100){
          this.caseIdList = [];
          this.$Message.success(res.data.message);
          this.getList(this.pageNumber);
        }else{
          this.$Message.info(res.data.message);
        }
      })
    },
    sendDio(){
      var fileds = [];
      for (let i = 0; i < this.defendantList.length; i++){
        const el = this.defendantList[i];
        if (el.checked === true) {
          var q = "'";
          var str =
          (el.litigantName || "") +
            q +
          (this.sendTypes[el.sendType] || "") +
            q +
          (el.oddNumbers || "") +
            q +
          (el.address || "") +
            q +
          (el.phone || "") +
            q +
          (el.email || "")
          fileds.push(str);
        }
      }
      sendmessage(this.lawCaseId,fileds).then(res => {
      if(res.data.state == 100){
        this.$Message.success(res.data.message);
      }else{
        this.$Message.info(res.data.message);
      }
        
      })
    },
    checkChange(){

    },
    printBill(){

    },
    showType(id,sendType){
      if(sendType == 3){
        emailList(this.lawCaseId,id).then(res => {
          if (res.data.state === 100){
            for(var i=0;i<this.defendantList.length;i++){
              if(this.defendantList[i].id == id){
                this.defendantList[i].emailListArr = res.data.result.content;
              }
            }
          }
        })
      }
      
    },
    uploadOCR(){
      this.OCRModal = true;
      this.uploadLitigantIsWarning = false;
      this.uploadLitigantIsError = false;
      this.uploadOCRIsSuccess = false;
      this.uploadLitigantIsSuccess = false;
    },
    beforeUploadOCR () {
        this.OCRLoading = true;
    },
    uploadOCRSuccess(response, file, fileList){
      this.uploadLitigantIsWarning = false;
      this.uploadLitigantIsError = false;
      this.uploadOCRIsSuccess = false;
      this.uploadLitigantIsSuccess = false;
      this.OCRLoading = false;
      this.caseLi = [];
      console.log(response)
      console.log(file)
      console.log(fileList)
      if (response.state == 100) {
         this.uploadOCRIsSuccess = true;
         this.casesuccessNum = response.successNum;
          this.successList = response.emsNoList;
      }else if(response.state == 103){
         this.uploadLitigantIsWarning = true;
         this.successNum = response.successNum;
         this.errorNum = response.errorNum;
         response.errorList.map(item => {
           var data = {
             caseNo:item[1],
             reason:item[10],
           }
           this.caseLi.push(data);
         })       
      }else{
        this.uploadLitigantIsError = true;
        this.uploadLitigantMessage = response.message;
      }
    },
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
        caseNo: "",
        litigantName: "",
        emsNo: "",
        handoverDate: "",
        sendType: "",
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
      console.log(this.formItem.handoverDate)
      if(this.formItem.handoverDate.length != 0 && this.formItem.handoverDate[0] != null){
        this.formItem.startDate =formatDate(new Date(this.formItem.handoverDate[0]),'yyyy-MM-dd');
        this.formItem.endDate =formatDate(new Date(this.formItem.handoverDate[1]),'yyyy-MM-dd');
      }else{
        this.formItem.startDate = ""
        this.formItem.endDate = ""
      }
      var params = {
        caseNo: this.formItem.caseNo,
        litigantName: this.formItem.litigantName,
        emsNo: this.formItem.emsNo,
        // handoverDate:this.formItem.handoverDate ? formatDate(new Date(this.formItem.handoverDate),'yyyy-MM-dd') : "",
        startDate:this.formItem.startDate,
        endDate:this.formItem.endDate,
        sendType: this.formItem.sendType,
        pageNo: page,
        pageSize: 10,
      };
      this.casedata = [];
      findAllRecord(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            this.casedata = data.result.content;
            for(let i=0;i<this.casedata.length;i++){
              if(this.casedata[i].sendType != 2){
                this.casedata[i]._disabled = true;
              }
            }
            for(let p=0;p<data.counts.length;p++){
              if(data.counts[p].send_type == 1){
                this.sendtyone = data.counts[p].count;
              }else if(data.counts[p].send_type == 2){
                this.sendtytwo = data.counts[p].count;
              }else if(data.counts[p].send_type == 3){
                this.sendtythree = data.counts[p].count;
              }else if(data.counts[p].send_type == 4){
                this.sendtyfour = data.counts[p].count;
              }else if(data.counts[p].send_type == 5){
                this.sendtyfive = data.counts[p].count;
              }
            }
            this.totalPage = res.data.result.totalPages;
          } else {
            that.$Message.info(data.message);
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 查询ems记录列表失败");
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
  color: #2196F3;
}
.ivu-table-cell .red{
  color: red;
}
.ivu-table-cell .rred{
  color: #ff9800;
}
.ivu-tooltip-inner div {
  /* width:450px */
}
.numsTy{
  line-height: 52px;
  font-weight: 600;
}
</style>
