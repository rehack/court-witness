<template lang="html">
  <div class="layoutM">
    <Card class="cardItem">
        <p slot="title">
            <Icon type="wrench"></Icon>
            案件搜索
        </p>
        <div style="margin-bottom: 16px">
            <Form :label-width="60">
                <FormItem label="案号">
                    <Input v-model="searchData.caseNo" placeholder="请输入案号"></Input>
                </FormItem>
                <FormItem label="原告姓名">
                    <Input v-model="searchData.plaintiffName"></Input>
                </FormItem>
                <FormItem label="被告姓名">
                    <Input v-model="searchData.defendantName"></Input>
                </FormItem>
                <Button type="info" :loading="queryLoading" @click="queryCase" long>
                    <span v-if="!queryLoading">查询</span>
                    <span v-else></span>
                </Button>
            </Form>
        </div>
        <ButtonGroup vertical>
            <Button v-for="(item, key) in caseList" type="ghost" :key="key" v-show="parseInt(key/10) === (pagenumber - 1)" @click="getCaseInfo(item.id)" class="caseBtn">
                <p>
                    <Tooltip :content="item.caseNo">
                        案号：{{ item.caseNo }}
                    </Tooltip>
                </p>
                <p>
                    <Tooltip :content="'案由：' + item.briefName + '|' + item.litigationStatusName + ':' + item.litigantName">
                        案由：{{ item.briefName }} | {{ item.litigantName }}
                    </Tooltip>
                </p>
            </Button>
        </ButtonGroup>
        <Page v-if="caseList.length > 10" :current="pagenumber" @on-change="changeSearchPage" :total="caseList.length" style="padding-left: 28px;padding-top: 10px" simple></Page>
    </Card>
    <Card v-if="caseInfo.length != 0">
        <p slot="title">
            案件信息
        </p>
        <div class="maininfo-warp">
            <!-- <Spin size="large" fix v-if="caseLoading"></Spin> -->
            <Row>
                <Col span="3" class="maininfo-col maininfo-col-label">
                    案号
                </Col>
                <Col span="9" class="maininfo-col">
                    {{ caseInfo[0].caseNo }}
                </Col>
                <Col span="3" class="maininfo-col maininfo-col-label">
                    案由
                </Col>
                <Col span="9" class="maininfo-col">
                    {{ caseInfo[0].briefName }}
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col maininfo-col-label">
                    原告
                </Col>
                <Col span="9" class="maininfo-col">
                        <div class="ellipsisText">
                            <span v-for="(ci, k) in caseInfo" v-if="ci.litigationStatusName === '原告'" :key="k">
                                {{ ci.litigantName + '　'}}
                            </span>
                        </div>
                </Col>
                <Col span="3" class="maininfo-col maininfo-col-label">
                    被告
                </Col>
                <Col span="9" class="maininfo-col">
                        <div class="ellipsisText">
                            <span v-for="(ci, k) in caseInfo" v-if="ci.litigationStatusName === '被告'" :key="k">
                                {{ci.litigantName +  '　'}}
                            </span>
                        </div>
                </Col>
            </Row>
            <Row style="display:none">
                <Col span="3" class="maininfo-col maininfo-col-label">
                    手机号码(原告)
                </Col>
                <Col span="9" class="maininfo-col">
                    <div class="ellipsisText">
                        <span v-for="(ci, k) in caseInfo" v-if="ci.litigationStatusName === '原告'" :key="k">
                            {{ ci.litigantPhone + '、' }}
                        </span>
                    </div>
                </Col>
                <Col span="3" class="maininfo-col maininfo-col-label">
                    手机号码(被告)
                </Col>
                <Col span="9" class="maininfo-col">
                    <div class="ellipsisText">
                        <span v-for="(ci, k) in caseInfo" v-if="ci.litigationStatusName === '被告'" :key="k">
                          {{ci.litigantPhone + (k + 1 !== caseInfo.length ?'、':'') }}
                        </span>
                    </div>
                </Col>
            </Row>
            <Row style="display:none">
                <Col span="3" class="maininfo-col maininfo-col-label">
                    建档时间
                </Col>
                <Col span="9" class="maininfo-col">
                    {{ formatDate(new Date(caseInfo[0].filingDate - 0), 'yyyy-MM-dd') }}
                </Col>
                <Col span="3" class="maininfo-col maininfo-col-label">
                    完结时间
                </Col>
                <Col span="9" class="maininfo-col">
                    {{ caseInfo[0].closeDate && formatDate(new Date(caseInfo[0].closeDate - 0), 'yyyy-MM-dd') }}
                </Col>
            </Row>
            <Row style="display:none">
                <Col span="3" class="maininfo-col maininfo-col-label">
                    案由
                </Col>
                <Col span="9" class="maininfo-col">
                    {{ caseInfo[0].briefName }}
                </Col>
                <Col span="3" class="maininfo-col maininfo-col-label">
                    案件金额
                </Col>
                <Col span="9" class="maininfo-col">
                    {{ caseInfo[0].applyStandard }}元
                </Col>
            </Row>
        </div>
    </Card>
    <Card v-if="caseInfo.length" style="margin-top: 10px">
        <p slot="title">
            送达详情
        </p>
        <div slot="extra">
            <RadioGroup v-model="sendTo" @on-change="radioChange">
                <Radio label="3">
                    <span>全选</span>
                </Radio>
                <Radio label="1">
                    <span>仅原告</span>
                </Radio>
                <Radio label="2">
                    <span>仅被告</span>
                </Radio>
                <Radio label="0">
                    <span>全不选</span>
                </Radio>
            </RadioGroup>
        </div>
        
        <div v-for="(item, key) in caseInfo" :key="key" class="send-info">
          <Row>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  {{ item.litigationStatusName }}姓名：
              </Col>
              <Col span="5">
                  <Input v-model="item.litigantName" placeholder="姓名不能为空" style="width: 100%"></Input>
              </Col>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  联系电话：
              </Col>
              <Col span="5">
                  <Input v-model="item.litigantPhone" placeholder="联系电话不能为空" style="width: 100%"></Input>
              </Col>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  送达方式：
              </Col>
              <Col span="5">
                  <Select v-model="item.sendType" @on-change="showType(item.litigantId, item.sendType)" style="width:100%">
                      <Option v-for="(st, key) in sendTypes" :value="key" :key="key">{{ st }}</Option>
                  </Select>
              </Col>
          </Row>
          <Row>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  文书列表：
              </Col>
              <Col span="21">
                  <!-- <Checkbox
                  :indeterminate="indeterminate"
                  :value="item.checkAll"
                  
                  @click.prevent.native="handleCheckAll(item.litigantId)">全选</Checkbox> -->
                  <Checkbox
                  :indeterminate="item.indeterminate"
                  v-model="item.checkAll"
                  @click.prevent.native="handleCheckAll(item.litigantId)">全选</Checkbox>
                  <CheckboxGroup :name="item.litigantId" v-if="item.diplomsName" v-model="item.dips">
                      <Checkbox v-for="(d, key) in item.diplomsName.split(',')" @click.native="changestatus(item.litigantId)"  :label="d" :key="key"></Checkbox>
                      <!-- <Checkbox  @click.native="changestatus"  :label="item.other"><Input v-model="item.other" v-on:input="inputOther(item.litigantId,item.other)" placeholder="其他" style="width: 100px;display:inline-block"></Input></Checkbox> -->
                  </CheckboxGroup>
                  <!-- <Checkbox  v-show="item.sendType === 5" v-model="item.sendType === 5">委托送达函</Checkbox>                                     -->
                  <Checkbox @click.native="changestatus(item.litigantId)"  v-model="item.checkBo"><Input v-model="item.other"  placeholder="其他" style="width: 100px;display:inline-block"></Input></Checkbox>                  
              </Col>
          </Row>
          <Row>
            <Col span="3" style="text-align: right; padding-right: 5px">
                证据材料：
            </Col>
            <Col span="21">
              <span v-for="(item, index) in item.checkedEvidenceNames" :key="index">{{ item }}、</span>
              <Button type="default" @click="choseEvidence(item, key)">选择证据</Button>
            </Col>
          </Row>
          <Row v-show="item.sendType === 3">
              <Col span="3" style="text-align: right; padding-right: 5px" >
                  <span style="color: #ed3f14">*</span>
                  邮箱地址：
              </Col>
              <Col span="12">
                  <Input v-model="item.email" style="width: 100%"></Input>
              </Col>
          </Row>
          <Row v-show="item.sendType === 3">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  邮件模板：
              </Col>
              <Col span="10">
                  <Select style="width:100%" v-model="item.etListKey" @on-change="emailTpChange(item)">
                      <Option v-for="(item, key) in item.emailListArr" :value="key" :key="key">{{ item.name }}</Option>
                  </Select>
              </Col>
          </Row>
          <Row v-show="item.sendType === 3">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  模板内容：
              </Col>
              <Col span="12">
                  <div style="padding: 5px 6px;">
                      {{ item.emailContent }}
                  </div>
              </Col>
          </Row>
          <Row v-show="item.sendType == 1 || item.sendType == 2">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  <span style="color: #ed3f14">*</span>
                  收件地址：
              </Col>
              <Col span="12">
                  <Input v-model="item.address" style="width: 90%" v-show="item.addressList.length == 0"></Input>
                  <Select v-model="item.sendAddress"   style="width:90%" v-show="item.addressList.length != 0">
                      <Option v-for="(st, key) in item.addressList" :value="st" :key="key">{{ st }}</Option>
                  </Select>
                <!-- <Icon @click.native="addOther(item.litigantId)" type="plus-round" style="font-size: 18px;margin-left: 10px;font-weight: 600;color: #40A9FF;cursor: pointer;"></Icon> -->
              </Col>
          </Row>
          <div  v-for="i in item.otherAdress">
            <Row>
                <Col span="3" style="text-align: right; padding-right: 5px">
                    <span style="color: #ed3f14">*</span>
                    　
                </Col>
                <Col span="12">
                  <Input v-model="i.ad" style="width: 90%" ></Input>
                </Col>
            </Row>
          </div> 
          <Row v-show="item.sendType === 5">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  法院名称：
              </Col>
              <Col span="9">
                  <Input v-model="item.courtName" placeholder="请输入法院全称" style="width: 100%"></Input>
              </Col>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  法院联系电话：
              </Col>
              <Col span="9">
                  <Input v-model="item.courtPhone" style="width: 100%"></Input>
              </Col>
          </Row>
          <Row v-show="item.sendType === 5">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  法院地址：
              </Col>
              <Col span="9">
                  <Input v-model="item.courtAdress" style="width: 100%"></Input>
              </Col>
          </Row>
           <Row v-if="item.sendType === 1 || item.sendType === 5">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  快递单号：
              </Col>
              <Col span="9">
                  <Input v-model="item.oddNumbers" style="width: 100%"></Input>
              </Col>
              <Col span="3">
                  <Button type="info" @click="printBill(item)" long style="margin-left: 15px;">快递单打印</Button>
              </Col>
          </Row>
          <Row v-if="item.sendType === 1">
            <Col span="3">
            </Col>
              <Col span="3">
                  <Button type="info" @click="addAdreModel(item)" long style="margin-left: 15px;">添加地址</Button>
              </Col>
          </Row>
          <Row v-show="item.sendType === 5">
              <Col span="8" style="text-align: left; padding-left: 5px">
                  是否将法院名称和地址更新到数据库：
              </Col>
              <Col span="9" style="text-align: left; padding-left: 5px">
                  <RadioGroup  v-model="item.updat">
                    <Radio @click.native="changeUp1(item.litigantId)" label="1">
                        <span>是</span>
                    </Radio>
                    <Radio @click.native="changeUp2(item.litigantId)" label="0">
                        <span>否</span>
                    </Radio>
                </RadioGroup>
              </Col>
          </Row>
          <Row>
            <div style="float: right">
                <Button v-show="item.print != 0 && item.sendType === 0" @click="sureSend(item)"  type="success">
                    确认领取
                </Button>
                <Button v-show="item.print != 0" @click="printSend(item)" type="success" style="margin-right: 16px">打印</Button>
                <Checkbox v-model="item.checked" @on-change="checkChange(item)">选中</Checkbox>
            </div>
          </Row>
        </div>
    </Card>
    <div v-if="caseInfo.length" style="margin: 16px 0; text-align: center">
        <ButtonGroup size="large">
            <Button @click="sendME" style="width: 100px" :loading="sendMELoading" type="success">发送</Button>
            <!-- <Button style="width: 150px" @click="downEMS">下载EMS交接单</Button> -->
        </ButtonGroup>
    </div>
    <Modal
        v-model="evidenceModel"
        title="选择证据"
        width="600"
        ok-text="确定"
        cancel-text="取消"
        @on-ok="evidenceOk"
        >
        <Row v-for="(item, index) in evidenceList" :key="index">
          <CheckboxGroup v-model="checkedEvidenceNames">
          <fieldset class="field site-title">
            <legend><a name="get">{{ item.litigationStatusName }}: {{ item.litigantName }}</a></legend>
          </fieldset>
          <div class="evidenceCheckWrapper" v-show="item.evidenceAttachment == 0 || item.evidenceAttachment == null">
              无证据材料
          </div>
          <div class="evidenceCheckWrapper" v-show="item.evidenceAttachment != 0">
            <Checkbox v-for="(item, index) in item.evidenceAttachment" :label="item.name"></Checkbox>
          </div>
          </CheckboxGroup>
        </Row>
    </Modal>
    <Modal
        v-model="addModel"
        title="添加地址"
        :loading="loading"
        width="600"
        ok-text="保存"
        cancel-text="取消"
        @on-ok="addAdr"
        >
        <Form :label-width="100" inline>
            <div class="addOtherAdress">
              <div v-for="item in adressList">
                  <FormItem label="其他地址" style="width: 455px">
                      <Input v-model="item.name" style="width:95%;" placeholder="请输入其他地址"></Input><Icon @click.native="delAdress(item)" type="trash-a"></Icon>
                  </FormItem>
                  <FormItem label="备注" style="width: 455px">
                      <Input v-model="item.beizhu"  style="width:95%;" placeholder="请地址备注"></Input>
                  </FormItem>
              </div>
          </div>
          <FormItem>
              <div class="adds" @click="addAdress" style="text-align:center;width: 350px;">
                  <Icon type="plus-round"></Icon>
                  <p>添加地址</p>
              </div>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import { getBrief, queryCase } from "../../api/global.js";
import {
  getInfo,
  getSendInfo,
  sendME,
  confirm,
  printBill,
  postDeliveryBill,
  litigantEvidenceList,
  getEntrustSend,
  addAdress
} from "../../api/send.js";
import { senList, emailList, addressList } from "../../api/templante.js";
import { formatDate } from "../../libs/date.js";
import { list, printer } from "../../api/diplomas.js";
import Vue from 'vue';

export default {
  data() {
    const sendStates = ["取消", "送达中", "已送达成功", "未外送达成功"];
    const sendTypes = [
      "现场领取",
      "快递送达",
      "工作人员上门送达",
      "电子邮件送达",
      "H5确认阅读"
    ];
    return {
      sendTo: "0",
      litigantId:"",
      searchData: {
        caseNo: "",
        plaintiffName: "",
        defendantName: ""
      },
      addModel:false,
      indeterminate: false,
      otherAdress:[],
      loading:true,
      adressList:[],
      checkboxO:true,
      checkAll: false,
      pagenumber: 1,
      queryLoading: false,
      sendMELoading: false,
      evidenceModel: false,
      caseList: [],
      printShow: false,
      caseInfo: [],
      sendTypes: [
        "现场领取",
        "快递送达",
        "工作人员上门送达",
        "电子邮件送达",
        "H5确认阅读",
        "委托送达"
      ],
      evidenceList: [],
      checkedEvidenceNames: [],
      evidenceListData: [],
      adId:0,
      lawCaseId:"",
    };
  },
  mounted() {
    if (this.$route.params) {
      var caseId = this.$route.params.lawCaseId;
      if (caseId) {
        this.lawCaseId = caseId;
        this.getCaseInfo(caseId);
      }
    }
    this.getBrief();
  },
  methods: {
    changeLoading () {
        this.loading = false;
        this.$nextTick(() => {
            this.loading = true;
        });
    },
    changestatus(id){
      for (var i = 0; i < this.caseInfo.length; i++){
        if(id == this.caseInfo[i].litigantId){
          var ary = this.caseInfo[i].diplomsName.split(',');
          if(this.caseInfo[i].dips.length != ary.length+1){
            this.caseInfo[i].checkAll = false;
          }
          Vue.set(this.caseInfo, i, this.caseInfo[i]);
        }
      }
      
    },
    addAdreModel(value){
      console.log(value)
      this.litigantId = value.litigantId;
      this.adressList = [];
      this.adId = 0;
      this.addModel = true;
    },
    addAdress(){
      var da ={
          id:this.adId,
          name:'',
          beizhu:''
      }
      this.adressList.push(da);
      this.adId = this.adId+1;
    },
    delAdress(value){
      for(var i=0;i<this.adressList.length;i++){
          if(this.adressList[i].id == value.id){
              this.adressList.splice(i,1);
          }
      }
    },
    addAdr(){
      var adressStr = "";
      var rmarkStr = "";
      if(this.adressList.length != 0){
          for( var i=0;i<this.adressList.length;i++){
              // if(i == this.adressList.length-1){
              //     adressStr = adressStr+this.adressList[i].name;
              //     rmarkStr = rmarkStr+this.adressList[i].beizhu;
              // }else{
                  adressStr = adressStr+this.adressList[i].name+',';
                  rmarkStr = rmarkStr+this.adressList[i].beizhu+',';
              // }
              
          }
      }
      addAdress(this.litigantId,adressStr,rmarkStr).then(res => {
          if(res.data.state == 100){
            this.$Message.success(res.data.message);
            for(var i = 0; i < this.caseInfo.length; i++){
              if (this.litigantId == this.caseInfo[i].litigantId){
                for(var t=0;t<this.adressList.length;t++){
                  this.caseInfo[i].addressList.push(this.adressList[t].name);
                }
              }
            }
            this.addModel = false;
          }else{
            this.$Message.info(res.data.message);
            this.changeLoading();
          }
      })
    },
    inputOther(id,value){
      console.log(this.caseInfo)
    },
    changeUp1(id){
      for (var i = 0; i < this.caseInfo.length; i++){
        if(id == this.caseInfo[i].litigantId){
          this.caseInfo[i].updat = "1";
          Vue.set(this.caseInfo, i, this.caseInfo[i]);
        }
      }
    },
    changeUp2(id){
      for (var i = 0; i < this.caseInfo.length; i++){
        if(id == this.caseInfo[i].litigantId){
          this.caseInfo[i].updat = "0";
          Vue.set(this.caseInfo, i, this.caseInfo[i]);
        }
      }
    },
    showType(litigantId, sendType) {
      for (var i = 0; i < this.caseInfo.length; i++) {
        const el = this.caseInfo[i];
        if (litigantId == this.caseInfo[i].litigantId) {
          this.caseInfo[i].print = 0;
        }
        if (this.caseInfo[i].sendTy == this.sendTypes[el.sendType]) {
          console.log(this.caseInfo[i].sendTy);
          this.caseInfo[i].print = 1;
        }
      }
        for (var i = 0; i < this.caseInfo.length; i++){
          if (litigantId == this.caseInfo[i].litigantId && this.caseInfo[i].litigationStatusName == '被告'){
            var ary = [ '传票', '应诉通知书', '诉讼权利义务告知书', '送达地址确认书', '送达地址有关事项告知书', '举证通知书', '廉政监督卡', '证据材料', '起诉状（反诉状）']
            this.caseInfo[i].dips = ary;
          }else{
            this.caseInfo[i].dips = [];
          }
        }
      if(sendType == 5){
        getEntrustSend(litigantId).then(res => {
          if(res.data.state == 100){
            for (var i = 0; i < this.caseInfo.length; i++){
              if(litigantId == this.caseInfo[i].litigantId){
                var ary = ['委托送达函'];
                 this.caseInfo[i].dips = ary;
                this.caseInfo[i].courtName = res.data.courtName;
                this.caseInfo[i].courtPhone = res.data.telephone;
                this.caseInfo[i].courtAdress = res.data.address;
                 Vue.set(this.caseInfo, i, this.caseInfo[i]);
              }
            }
          }else{
            for (var i = 0; i < this.caseInfo.length; i++){
              if(litigantId == this.caseInfo[i].litigantId){
                var ary = ['委托送达函'];
                 this.caseInfo[i].dips = ary;
                 Vue.set(this.caseInfo, i, this.caseInfo[i]);
              }
            }
          }
        })
      }
    },
    addOther(litigantId){
      console.log(litigantId)
      for (var i = 0; i < this.caseInfo.length; i++) {
        const el = this.caseInfo[i];
        if (litigantId == this.caseInfo[i].litigantId) {
          var sed = {
            label:"",
            ad:'',
          }
          this.otherAdress.push(sed)
          this.caseInfo[i].otherAdress.push(sed);
          Vue.set(this.caseInfo, i, this.caseInfo[i]);
          console.log(this.caseInfo[i].otherAdress)
        }
      }
    },
    handleCheckAll(id){
      for(let i = 0; i < this.caseInfo.length; i++){
          if(id == this.caseInfo[i].litigantId){
           if(this.caseInfo[i].checkAll == true){
             this.caseInfo[i].checkAll = false;
             this.caseInfo[i].checkBo = false;
             this.caseInfo[i].dips = [];
             Vue.set(this.caseInfo, i, this.caseInfo[i]);
           }else{
             this.caseInfo[i].dips = [];
             this.caseInfo[i].checkAll = true;
            //  this.caseInfo[i].indeterminate = true;
             this.caseInfo[i].checkBo = true;
             var ary = this.caseInfo[i].diplomsName.split(',');
             this.caseInfo[i].dips = ary;
             Vue.set(this.caseInfo, i, this.caseInfo[i]);
           }
          }
        }
    },
    getBrief() {
      getBrief()
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            this.briefList = data.result;
          }
        })
        .catch(() => {
          this.$Message.error("网络错误，获取案由列表失败。");
          this.saved = false;
        });
    },
    getCaseInfo(caseId) {
      getInfo(caseId)
        .then(res => {
          if (res.data.state == 100) {
            this.caseInfo = res.data.result;
            for (let i = 0; i < this.caseInfo.length; i++) {
              if (this.caseInfo[i].diplomsName == null) {
                this.caseInfo[i].diplomsName = null;
              } else {
                this.caseInfo[i].diplomsName +=
                  ",证据材料,起诉状（反诉状）,答辩状,上诉状";
              }
              this.caseInfo[i].addressList = [];
              this.caseInfo[i].other = "";
              this.caseInfo[i].checkBo = false;
              this.caseInfo[i].tweother = '';
              this.caseInfo[i].otherAdress = [];              
              this.caseInfo[i].print = 0;
              this.caseInfo[i].checkAll = false;  
              this.caseInfo[i].indeterminate = false;
              this.caseInfo[i].courtName = "";
              this.caseInfo[i].courtPhone = "";
              this.caseInfo[i].courtAdress = "";           
              this.caseInfo[i].sendTshow = 0;
              this.caseInfo[i].sendTy = "";
              this.caseInfo[i].sendId = "";
              this.caseInfo[i].updat = '1';
              emailList(this.caseInfo[i].id, this.caseInfo[i].litigantId)
                .then(res => {
                  var data = res.data;
                  if (data.state === 100) {
                    this.caseInfo[i].emailId = "";
                    this.caseInfo[i].emailListArr = data.result.content;
                  } else {
                    this.$Message.info(data.message);
                  }
                })
                .catch(() => {
                  this.$Message.error("网络错误，获取邮件模板失败。");
                });
              addressList(res.data.result[i].litigantId)
                .then(res => {
                  var data = res.data;
                  if (data.state === 100) {
                    if (
                      data.result.address != null &&
                      data.result.address != ""
                    ) {
                      this.caseInfo[i].addressList.push(data.result.address);
                    }
                    if (
                      data.result.nativePlace != null &&
                      data.result.nativePlace != ""
                    ) {
                      this.caseInfo[i].addressList.push(
                        data.result.nativePlace
                      );
                    }
                    if (
                      data.result.sendAddress != null &&
                      data.result.sendAddress != ""
                    ) {
                      this.caseInfo[i].addressList.push(
                        data.result.sendAddress
                      );
                    }
                    this.caseInfo[i].addressList = Array.from(
                      new Set(this.caseInfo[i].addressList)
                    );
                    this.caseInfo[i].sendAddress = [];
                    console.log(this.caseInfo)
                  } else {
                    this.$Message.info(data.message);
                  }
                })
                .catch(() => {
                  this.$Message.error("网络错误，获取当事人地址失败。");
                });
            }
          }
        })
        .catch(err => {
          this.$Message.error("网络错误，获取案件信息失败。");
        });
    },
    queryCase() {
      this.queryLoading = true;
      queryCase(
        this.searchData.caseNo,
        this.searchData.plaintiffName,
        this.searchData.defendantName
      )
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            this.caseList = data.result;
          } else {
            this.$Message.info(data.message);
          }
          this.queryLoading = false;
        })
        .catch(() => {
          this.$Message.error("网络错误，查询失败。");
          this.queryLoading = false;
        });
    },
    choseEvidence(item, key) {
      litigantEvidenceList(item.id, item.litigantId)
        .then(res => {
          if (res.data.state == 100) {
            this.evidenceListData = [];
            this.evidenceList = res.data.result;
            for (var i = 0; i < res.data.result.length; i++) {
              for (
                var j = 0;
                j < res.data.result[i].evidenceAttachment.length;
                j++
              ) {
                var obj = {};
                obj.id = res.data.result[i].evidenceAttachment[j].id;
                obj.name = res.data.result[i].evidenceAttachment[j].name;
                this.evidenceListData.push(obj);
              }
            }
            this.choseEvidenceKey = key;
            try {
              this.checkedEvidenceNames = this.caseInfo[
                key
              ].checkedEvidenceNames;
            } catch (e) {
              this.checkedEvidenceNames = [];
            }
            this.evidenceModel = true;
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误，获取证据失败。");
        });
    },
    evidenceOk() {
      this.caseInfo[
        this.choseEvidenceKey
      ].checkedEvidenceNames = this.checkedEvidenceNames;
      this.caseInfo[this.choseEvidenceKey].checkedEvidenceIds = [];
      for (var i = 0; i < this.checkedEvidenceNames.length; i++) {
        this.evidenceListData.map(item => {
          if (item.name == this.checkedEvidenceNames[i]) {
            this.caseInfo[this.choseEvidenceKey].checkedEvidenceIds.push(
              item.id
            );
          }
        });
      }
    },
    printBill(item) {
      item.checkeds = [];
      if(item.checkBo ==true){
        var checks = 0;
        if(item.dips){
          for(var i=0;i<item.dips.length;i++){
            if(item.tweother == item.dips[i] && item.tweother != item.other){
              item.dips.splice(i,1)
            }else{
              item.checkeds.push(item.dips[i]);
            }
            if(item.dips[i] == item.other){
              checks = 1;
            }
          }
          if(checks != 1){
            item.dips.push(item.other)
            item.checkeds.push(item.other)
          }
        }else{
          item.checkeds.push(item.other)
        }
        
      }else if(item.checkBo ==false){
        if(item.dips){
          for(var i=0;i<item.dips.length;i++){
            if(item.dips[i] == item.other){
              item.dips.splice(i,1)
            }else{
              item.checkeds.push(item.dips[i]);
            }
          }
        }
        
      }
      item.tweother = item.other;
      var str = "";
      console.log(item.sendType)
      if(item.addressList.length == 0){
        str = item.address
      }else{
        console.log(item.sendAddress)
        // if(item.sendType == 5){
        //   str = item.courtAdress;
        // }else{
          str = item.sendAddress;
        // }
        
        // for(var i=0;i<item.sendAddress.length;i++){
        //   str = str + item.sendAddress[i] + ','
        // }
      }
      for(var i=0; i<item.otherAdress.length;i++){
        str = str + item.otherAdress[i].ad + ',';
      }
      // console.log(str)
      console.log(item.courtAdress)      
      var params = {
        oddNumbers: item.oddNumbers,
        lawCaseId: item.id,
        litigantName:item.sendType == 5 ? item.courtName : item.litigantName,
        sendAddress: item.sendType == 5 ? item.courtAdress : str,
        litigantPhone: item.sendType == 5 ? item.courtPhone : item.litigantPhone,
        litigantType: item.litigantType,
        diploms: item.checkeds
      };
      printBill(params)
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            window.open("/" + data.html);
          } else {
            this.$Message.info(data.message);
          }
          this.queryLoading = false;
        })
        .catch(() => {
          this.$Message.error("网络错误，查询失败。");
          this.queryLoading = false;
        });
    },
    sendME() {
      var fileds = [];
      this.sendMELoading = true;
      console.log(this.caseInfo.length)
      for (let i = 0; i < this.caseInfo.length; i++) {
        const el = this.caseInfo[i];
        if (el.checked === true) {
          console.log(1212)
          console.log(1212+"sdsad"+i)
          el.checkeds = [];
          if(el.checkBo ==true){
            console.log(198989)
            var checks = 0;
            if(el.dips){
              for(var p=0;p<el.dips.length;p++){
                if(el.tweother == el.dips[p] && el.tweother != el.other){
                  el.dips.splice(p,1)
                }else{
                  el.checkeds.push(el.dips[p]);
                }
                if(el.dips[p] == el.other){
                  checks = 1;
                }
              }
              if(checks != 1 ){
                el.dips.push(el.other)
                el.checkeds.push(el.other)
              }
            }else{
              el.checkeds.push(el.other)
            }  
          }else if(el.checkBo ==false){
            if(el.dips){
              for(var t=0;t<el.dips.length;t++){
                if(el.dips[t] == el.other){
                  el.dips.splice(t,1)
                }else{
                  el.checkeds.push(el.dips[t]);
                }
              }
            }
            
          }
          el.tweother = el.other;
          var str1 = "";
          if(el.addressList.length == 0){
            str1 = el.address
          }else{
            str1 =el.sendAddress
            // for(var z=0;z<el.sendAddress.length;z++){
            //   str1 = str1 + el.sendAddress[z] + ','
            // }
          }
          for(var m=0; m<el.otherAdress.length;m++){
            str1 = str1 + el.otherAdress[m].ad + ',';
          }
          var q = "'";
          var str =
            (el.litigantName || "") +
            q +
            (this.sendTypes[el.sendType] || "") +
            q +
            (el.oddNumbers || "") +
            q +
            (el.email || "") +
            q +
            (el.emailId || "") +
            q +
            (el.litigantPhone || "") +
            q +
            (str1 || "") +
            q +
            (el.checkeds ? el.checkeds.join("$") : "") +
            q +
            (el.checkedEvidenceIds ? el.checkedEvidenceIds.join("$") : "") +
            q +
            (el.courtName || "") +
            q +
            (el.courtAdress || "") +
            q +
            (el.courtPhone || "") +
            q + 
            (el.updat || "");
          fileds.push(str);
          if (
            this.sendTypes[el.sendType] == "现场领取" ||
            this.sendTypes[el.sendType] == "工作人员上门送达" ||
            this.sendTypes[el.sendType] == "快递送达" ||
            this.sendTypes[el.sendType] == "电子邮件送达" ||
            this.sendTypes[el.sendType] == "委托送达" ||
            this.sendTypes[el.sendType] == "H5确认阅读"
          ) {
            el.sendTshow = 1;

            if (this.sendTypes[el.sendType] == "现场领取") {
              el.sendTy = "现场领取";
            } else if (this.sendTypes[el.sendType] == "工作人员上门送达") {
              el.sendTy = "工作人员上门送达";
            }
          } else {
            el.sendTy = "";
            el.sendTshow = 0;
            el.print = 0;
          }
          
        }
        
      }
      sendME(this.caseInfo[0].id, fileds)
        .then(res => {
          var data = res.data;
          this.$Message.info(data.message);
          this.sendMELoading = false;
          var mm = data.sendList;
          for (var i = 0; i < this.caseInfo.length; i++) {
            for (var m = 0; m < mm.length; m++) {
              if (
                mm[m].litigantId == this.caseInfo[i].litigantId &&
                this.caseInfo[i].sendTshow == 1
              ) {
                this.caseInfo[i].print = 1;
                this.caseInfo[i].sendId = mm[m].sendId;
              }
            }
          }
        })
        .catch(() => {
          // this.$Message.error("网络错误，查询失败。");
          this.sendMELoading = false;
        });
    },
    printSend(item) {
      if (item.dips.length) {
        if(item.sendTy == "现场领取"){
          var str = 0;
        }else if(item.sendTy == "工作人员上门送达"){
          var str = 2;
        }else{
          var str = 3;
        }
        
        printer(item.litigantId, item.dips.join(","), str, item.sendId)
          .then(res => {
            var data = res.data;
            if (data.state - 0 === 100) {
              this.$Message.loading({
                content: "文书生成中，请稍候",
                duration: item.dips.length * 0.6, // 按照文书数量给后台一点生成pdf文件的时间
                onClose: () => {
                  window.open("/" + data.result);
                }
              });
            } else {
              this.$Message.error(res.data.message);
            }
          })
          .catch(() => {
            this.$Message.error("网络错误，获取" + name + "失败。");
          });
      } else {
        this.$Message.error("未选择文书");
      }
    },
    sureSend(item){
      if (item.dips.length){
        confirm(this.lawCaseId,item.litigantId,item.sendId).then(res => {
          if(res.data.state == 100){
            this.$Message.success(res.data.message);
          }else{
            this.$Message.info(res.data.message);
          }
        })
      }
    },
    downEMS() {
      var that = this;
      var fileds = [];
      for (let i = 0; i < this.caseInfo.length; i++) {
        const el = this.caseInfo[i];
        if (el.checked === true) {
          var q = "、";
          if (el.oddNumbers != "" && el.oddNumbers != null) {
            var str =
              (el.oddNumbers || "") +
              q +
              (el.litigantName || "") +
              q +
              (el.sendAddress || "");
            fileds.push(str);
          }
        }
      }
      postDeliveryBill(this.caseInfo[0].id, fileds).then(res => {
        if (res.data.state == 100) {
          this.$Message.success(res.data.message);
          window.open("/" + res.data.filePath);
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    emailTpChange(item) {
      item.emailContent = item.emailListArr[item.etListKey].content;
      item.emailId = item.emailListArr[item.etListKey].id;
    },
    radioChange() {
      var key = this.sendTo;
      switch (key) {
        case "0":
          this.caseInfo.forEach(el => {
            el.checked = false;
          });
          break;
        case "1":
          this.caseInfo.forEach(el => {
            el.checked = false;
            el.litigationStatusName === "被告" || (el.checked = true);
          });
          break;
        case "2":
          this.caseInfo.forEach(el => {
            el.checked = false;
            el.litigationStatusName === "被告" && (el.checked = true);
          });
          break;
        case "3":
          this.caseInfo.forEach(el => {
            el.checked = true;
          });
          break;
        default:
          break;
      }
    },
    checkChange(obj) {
      var l = this.caseInfo;
      var p = 0; // 原告总数
      var d = 0; // 被告总数
      var pc = 0; // 选择原告数
      var dc = 0; // 选择被告数
      for (let i = 0; i < l.length; i++) {
        const c = l[i].checked;
        const sn = l[i].litigationStatusName;
        if (sn === "被告") {
          d++;
          c && dc++;
        } else {
          p++;
          c && pc++;
        }
      }

      if (p + d === pc + dc) {
        this.sendTo = "3";
      } else if (pc + dc === 0) {
        this.sendTo = "0";
      } else if (p !== 0 && pc === p) {
        this.sendTo = "1";
      } else if (d !== 0 && dc === d) {
        this.sendTo = "2";
      } else {
        this.sendTo = "-1";
      }
    },
    changeSearchPage(p) {
      this.pagenumber = p;
    },
    formatDate(d, fmt) {
      return formatDate(d, fmt);
    }
  }
};
</script>

<style lang="css">
.ivu-tooltip-rel {
  display: block;
  width: 100%;
  word-wrap: break-word;
  white-space: normal;
}
.send-info .ivu-row {
  padding: 5px 0px;
}
.site-title {
  margin: 15px 0 10px;
  border: 1px solid #e6e6e6;
  border-width: 1px 0 0;
}
.field legend {
  margin-left: 20px;
  padding: 0 10px;
  font-size: 20px;
  font-weight: 300;
}
.field a {
  color: #000;
  font-size: 18px;
}
.evidenceCheckWrapper {
  padding-left: 30px;
}
.adds {
        border:1px solid #ccc;
        cursor: pointer;
    }
.adds .ivu-icon{
    font-size: 30px;
    display: block;
    margin-top: 5px;
}
.adds p{
    display: inline-block;
    line-height: 11px;
}
.addOtherAdress .ivu-icon{
    font-size: 18px;
    margin-left: 5px;
    cursor: pointer;
}
</style>
