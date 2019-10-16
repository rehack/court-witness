<template>
    <div>
        <Card>
            <Row>
                
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700;margin-bottom:10px">诉前案件管理</span>
                </Col>
                <!-- <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent ="getList(1)" >
                        <FormItem label="案号：">
                            <Input style="width: 200px" v-model="formItem.caseNo"/>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col> -->
            </Row>
            <Button @click="uploadOCR" class="border-btn" style="margin-left: 10px;margin-bottom:10px;margin-top:10px">导入案件</Button>
            <Table stripe ref="judgeTable" :columns="judgecol" :data="casedata" @on-selection-change="tableCheck"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            title="导入案件"
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
                <p v-for="item in caseLi" style="font-size:12px;">案件：<span style="color:#38B3FF">{{item.caseNo}}</span> <span style="color:red;display:inline-block;margin-left:15px;">{{item.reason}}</span></p>
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
                action="/api/caselist/uploadFile.jhtml">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽文件上传</p>
                </div>
            </upload-multiple>
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
          v-model="wenmodal"
          title="发送文书"
          width="850"
          cancel-text=""
          ok-text="关闭">
          <Card>  
            <p slot="title">
                发送文书
            </p>
          <div slot="extra">
            <RadioGroup v-model="sendTo" @on-change="radioChange">
                <Radio label="3">
                    <span>全选</span>
                </Radio>
                <Radio label="0">
                    <span>全不选</span>
                </Radio>
            </RadioGroup>
        </div>
          <div v-for="item in defendantList" style="border-bottom: 1px solid #bbb;padding-bottom:5px;margin-bottom:15px">
            <Row>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  被告姓名：
              </Col>
              <Col span="5">
                  <Input v-model="item.litigantName" placeholder="姓名不能为空" style="width: 100%"></Input>
              </Col>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  联系电话：
              </Col>
              <Col span="5">
                  <Input v-model="item.phone" placeholder="联系电话不能为空" style="width: 100%"></Input>
              </Col>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  送达方式：
              </Col>
              <Col span="5">
                  <Select v-model="item.sendType"  style="width:100%">
                      <Option v-for="(st, key) in sendTypes" :value="key" :key="key">{{ st }}</Option>
                  </Select>
              </Col>
            </Row>
            <Row style="margin-top: 10px;">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  文书列表：
              </Col>
              <Col span="3">
                  告知书
              </Col>
            </Row> 
            <Row v-show="item.sendType === 3"  style="margin-top: 10px;">
              <Col span="3" style="text-align: right; padding-right: 5px" >
                  <span style="color: #ed3f14">*</span>
                  邮箱地址：
              </Col>
              <Col span="12">
                  <Input v-model="item.email" style="width: 100%"></Input>
              </Col>
          </Row>

          <Row v-if="item.sendType === 1"  style="margin-top: 10px;">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  快递单号：
              </Col>
              <Col span="9">
                  <Input v-model="item.oddNumbers" style="width: 100%"></Input>
              </Col>
              <!-- <Col span="3">
                  <Button type="info" @click="printBill(item)" long style="margin-left: 15px;">快递单打印</Button>
              </Col> -->
          </Row>
          <Row  style="margin-top: 10px;">
            <div style="float: right">
                <!-- <Button v-show="item.print != 0" @click="printSend(item)" type="success" style="margin-right: 16px">打印</Button> -->
                <Checkbox v-model="item.checked" @on-change="checkChange(item)">选中</Checkbox>
            </div>
          </Row>
          </div>
      </Card>
        <div  style="margin: 16px 0; text-align: center">
          <ButtonGroup size="large">
              <Button @click="sendDio" style="width: 100px"  type="success">发送</Button>
              <!-- <Button style="width: 150px" @click="downEMS">下载EMS交接单</Button> -->
          </ButtonGroup>
      </div>
      </Modal>
    </div>
</template>
<script>
import { findAllCase, buildDiploms, sendmessage, emailList } from "../../api/finanseCase.js";
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import uploadMultiple from '@/components/upload-multiple1';
import { formatDate } from "../../libs/date.js";
export default {
  components: {
        ClipLoader,
        'upload-multiple': uploadMultiple
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
      OCRLoading:false,
      uploadOCRIsSuccess: false,
      uploadLitigantIsError:false,
      uploadLitigantIsSuccess:false,
      uploadLitigantIsWarning:false,
      wenmodal:false,
      sendTo: "0",
      lawCaseId:"",
      successList:"",
      fileUploadData:{},
      casesuccessNum:"",
      caseLi:[],
      defendantList:[],
      uploadLitigantMessage:'',
      errorNum:"",
      successNum:'',
      formItem: {
        id: "",
        caseNo: "",
        judgeName: "",
        brief: "",
        clerkName: "",
        servicePersonnelName: ""
      },
      detailModal:false,
      loading:true,
      spinShow: false,
      totalPage: 1,
       pageNumber: 0,
       judgecol: [
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          fixed: "left",
          width: 200
        },
        {
          title: "原告",
          key: "plaintiff",
          align: "center",
          width: 150
        },
        {
          title: "被告",
          key: "defendant",
          align: "center",
          width: 150
        },
        {
          title: "被告电子邮箱地址",
          key: "defendantEmail",
          align: "center",
          width: 150
        },
        {
          title: "违约年月日",
          key: "contract",
          align: "center",
          ellipsis: true,
          width: 120,
        },
        {
          title: "计息年月日",
          key: "interest",
          align: "center",
          width: 120,
        },
        {
          title: "欠款本金",
          key: "principal",
          align: "center",
          width: 120,
        },
        {
          title: "利息",
          key: "interestMoney",
          align: "center",
          width: 120,
        },
        {
          title: "逾期利息",
          key: "interestOverdue",
          align: "center",
          width: 120,
        },
        {
          title: "欠款合计",
          key: "arrearsAll",
          align: "center",
          width: 120,
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
                      buildDiploms(params.row.caseNo).then(res => {
                        if(res.data.state == 100){
                          this.$Message.loading({
                              content: '文书生成中，请稍候',
                              duration: 3, // 给后台一点生成pdf文件的时间
                              onClose: () => {
                                  window.open('/' + res.data.result);
                              }
                          });
                        }
                      })
                    }
                  }
                },
                "生成文书"
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
                      this.wenmodal = true;
                      this.defendantList = params.row.defendantList;
                      this.lawCaseId = params.row.id;
                    }
                  }
                },
                "发送文书"
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
          this.successList = response.caseNoList;
      }else if(response.state == 103){
         this.uploadLitigantIsWarning = true;
         this.successNum = response.successNum;
         this.errorNum = response.errorNum;
         response.errorList.map(item => {
           var data = {
             caseNo:item[0],
             reason:item[16],
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
    tableCheck(){

    },
    clean(){

    },
    changePage(num){
      this.getList(num);
    },
    onOkF(){

    },
    getList(page) {
      var that = this;
      var params = {
        pageNumber: page,
        pageSize: 10,
      };
      this.casedata = [];
      findAllCase(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            res.data.result.content.map(item => {
              let objectData = {
                id: item.id,
                caseNo:item.caseNo,
                plaintiff: item.plaintiff,
                defendant:item.defendant,
                defendantList:item.caseLitigants,
                defendantEmail: item.defendantEmail,
                contract:item.contractYear+'-'+item.contractMonth+'-'+item.contractDay,
                interest:item.interestYear+'-'+item.interestMonth+'-'+item.interestDay,
                principal:item.principal+'元',  //欠款本金
                interestMoney:item.interest+'元', //利息
                interestOverdue:item.interestOverdue+'元', //逾期利息
                arrearsAll: item.arrearsAll+'元'  //欠款合计
              };
              this.casedata.push(objectData);
            });

            that.pageNumber = data.result.pageNumber;
            that.totalPage = data.result.totalPage;
          } else {
            that.$Message.info(data.message);
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 查询法官列表失败");
        });
    },
  }
};
</script>


