<template>
    <div style="position:relative;">
        <Card class="side-bar" :style="{left: sideBarShow? '220px' : '-280px'}" >
            <p slot="title">
                <Icon type="navicon"></Icon>
                功能菜单
                <span class="close-icon" @click="toggleCloseSideBar">
                  <Icon type="close-round"></Icon>
                </span>
            </p>
            <div class="card-content" style="height: 455px;">
                <Button class="border-btn" long @click="leadIn">一键导入</Button>
                <div class="search-wrapper">
                    <Input v-model="searchValue" @on-change="queryCaseNo" placeholder="请输入关键字" />
                </div>
                <ul v-show="!searchListEmpty" class="search-list-wrapper">
                    <li v-for="item in searchResultList" @click="showCase(item.id)">
                        {{ item.caseNo }}
                    </li>
                    <Page @on-change="pageChange" :current="pageData.pageNumber" :total="pageData.total" :page-size="pageData.pageSize" simple style="position:absolute;bottom:10px;left: 50%;margin-left: -80px;"></Page>
                </ul>
                <div v-show="searchListEmpty" class="search-list-empty">
                  没有找到相关案件
                </div>
            </div>
        </Card>
        <div v-show="showCaseInfo" class="btn-group" :style="{paddingLeft: sideBarShow? '270px' : '0px'}" style="width: 100%;">
            <Button class="border-btn" v-show="!sideBarShow" @click="toggleCloseSideBar">功能菜单</Button>
            <Button @click="uploadOCR" class="border-btn" style="margin-left: 10px;">OCR识别</Button>
            <!-- <Button @click="uploadLitigant" class="border-btn" style="margin-left: 10px;">当事人信息导入</Button> -->
            <!-- <Button @click="diploms" class="border-btn" style="float: right">一键生成文书并排期</Button> -->
        </div>
        <div v-show="showCaseInfo" class="right-wrapper moreHei" :style="{paddingLeft: sideBarShow? '270px' : '0px'}">
            <Card>
                <p slot="title" style="height: 33px;">
                    <Icon type="ios-bookmarks"></Icon>
                    案件信息
                    <Button @click="dipshowF('封皮')" type="info" style="background-color: #15A05D; border-color: #15A05D;margin-left:20px;">封皮生成</Button>
                    <span style="line-height: 33px;" class="right-btn" @click="toggleChangeCaseInfo">{{ changeCaseInfo ? '保存' : '修改' }}</span>
                </p>
                <div v-show="caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;background: rgba(255,255,255,0.5)">
                  <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px"/>
                </div>
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
                          <span class="cc"  v-show="!changeCaseInfo">{{ caseInfo.judge }}</span>
                          <Select  v-show="changeCaseInfo"  v-model="caseInfo.judge" style="width:100%">
                              <Option v-for="item in judgeList" :value="item.judgeListName" :key="item.judgeListId">{{ item.judgeListName }}</Option>
                          </Select>
                        </td>
                        <td>书记员</td>
                        <td>
                          <span v-show="!changeCaseInfo">{{ caseInfo.clerk }}</span>
                          <Select  v-show="changeCaseInfo"  v-model="caseInfo.clerk" style="width:100%">
                              <Option v-for="item in clerkList" :value="item.clerkListName" :key="item.clerkListId">{{ item.clerkListName }}</Option>
                          </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>立案日期</td>
                        <td>
                          <span>{{ caseInfo.filingDate | formatDate }}</span>
                          <!-- <DatePicker type="date" :value="caseInfo.filingDate" @on-change="changeDate" style="width: 98%;vertical-align:baseline;" v-show="changeCaseInfo"></DatePicker> -->
                        </td>
                        <td>审限届满日期</td>
                        <td>
                          <span v-show="!changeCaseInfo">{{ caseInfo.expireDate | formatDate }}</span>
                          <DatePicker type="date" :value="caseInfo.expireDate" @on-change="changeDate2" style="width: 98%;vertical-align:baseline;" v-show="changeCaseInfo"></DatePicker>
                        </td>
                    </tr>
                    <tr>
                        <td>立案案由</td>
                        <td>
                          <span v-show="!changeCaseInfo">{{ caseInfo.brief }}</span>
                          <Select v-model="caseInfo.brief" style="width: 98%;vertical-align:middle;" v-show="changeCaseInfo">
                            <Option v-for="item in reasonList" :value="item.brief" :key="item.brief">{{ item.brief }}</Option>
                          </Select>
                        </td>
                        <td>申请标的</td>
                        <td>
                          <span v-show="!changeCaseInfo">{{ caseInfo.applyStandard }}元</span>
                          <Input v-model="caseInfo.applyStandard" clearable style="width: 98%;vertical-align:baseline;" v-show="changeCaseInfo"></Input>
                        </td>
                    </tr>
                    <tr>
                        <td>合议庭成员</td>
                        <td colspan="3">
                          <span v-show="!changeCaseInfo">{{ caseInfo.allMembers }}</span>
                          <Input v-model="caseInfo.allMembers" type="textarea" :rows="2" style="width: 98%;margin: 3px;vertical-align:middle;" v-show="changeCaseInfo"></Input>
                        </td>
                    </tr>
                </table>
            </Card>
            <litigantInfo @refreshList="onRefreshList" title="原告信息" type="plaintiff" :lowCaseId="caseInfo.id" :data="plaintiffList" :changeCaseInfo="changeCaseInfo" :caseLoading="caseLoading" ref="revertsList1" />
            <litigantInfo @refreshList="onRefreshList" title="被告信息" type="defendant" :lowCaseId="caseInfo.id" :data="defendantList" :changeCaseInfo="changeCaseInfo" :caseLoading="caseLoading" ref="revertsList2" />
            <litigantInfo @refreshList="onRefreshList" title="第三人信息" type="third" :lowCaseId="caseInfo.id" :data="thirdList" :changeCaseInfo="changeCaseInfo" :caseLoading="caseLoading" ref="revertsList3" />
        </div>
        <Modal
            title="一键导入"
            v-model="leadInModal"
            cancel-text=""
            ok-text="关闭"
            :mask-closable="false">
            <Alert v-show="uploadAllIsError" type="error" show-icon>{{ uploadAllMessage }}</Alert>
            <Alert v-show="uploadAllIsSuccess" type="success" show-icon>{{ uploadAllMessage }}</Alert>
            <Alert v-show="uploadAllIsWarning" type="warning" show-icon>成功：{{ successNum }}条，错误{{ errorNum }}条，{{ uploadAllMessage }}<a style="margin-left:10px;" :href="errorDown">错误数据下载</a></Alert>
            <Upload
                multiple
                type="drag"
                :on-success="uploadAllSuccess"
                :show-upload-list="false"
                action="/api/court/estFile/uploadAll.jhtml">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽文件上传</p>
                </div>
            </Upload>
            <div style="text-align:right;padding-top:5px;"><a href="/upload/demo/creatdemo.xls">下载导入模板</a></div>
        </Modal>
        <Modal
            title="当事人信息导入"
            v-model="uploadLitigantModal"
            cancel-text=""
            ok-text="关闭"
            :mask-closable="false">
            <Alert v-show="uploadLitigantIsSuccess" type="success" show-icon>{{ uploadLitigantMessage }}</Alert>
            <Alert v-show="uploadLitigantIsWarning" type="warning" show-icon>{{ uploadLitigantMessage }}<a style="margin-left:10px;" :href="errorDown">错误数据下载</a></Alert>
            <Upload
                multiple
                type="drag"
                :data="fileUploadData"
                :on-success="uploadLitigantSuccess"
                :show-upload-list="false"
                action="/api/court/createCase/uploadLitigant.jhtml">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽文件上传</p>
                </div>
            </Upload>
            <div style="text-align:right;padding-top:5px;"><a href="/upload/model.xls">下载导入模板</a></div>
        </Modal>
        <Modal
            title="OCR识别"
            v-model="OCRModal"
            cancel-text=""
            ok-text="关闭"
            :mask-closable="false">
            <Alert v-show="uploadLitigantIsError" type="error" show-icon>{{ uploadLitigantMessage }}</Alert>
            <Alert v-show="uploadLitigantIsSuccess" type="success" show-icon>{{ uploadLitigantMessage }}</Alert>
            <Alert v-show="uploadLitigantIsWarning" type="warning" show-icon>成功：{{ successNum }}条，错误：{{ errorNum }}条，{{ uploadLitigantMessage }}</Alert>
            <upload-multiple
                multiple
                type="drag"
                :data="fileUploadData"
                :before-upload="beforeUploadOCR"
                :on-success="uploadOCRSuccess"
                name="ocrImg"
                :show-upload-list="false"
                action="/api/court/estFile/ocrKnowMore.jhtml">
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
                识别成功
              <div>共识别{{ plaintiffNum }}名原告
                <Button type="text" @click="addParties(1, n-1)" style="color:#3399ff;" v-for="n in plaintiffNum">
                  {{n}}、{{ ocrData.plaintiffStr[n-1].litigantName }}
                </Button>
              </div>
              <div>共识别{{ defendantNum }}名被告
                <Button type="text" @click="addParties(2, n-1)" style="color:#3399ff;" v-for="n in defendantNum">
                  {{n}}、{{ ocrData.defendantStr[n-1].litigantName }}
                </Button>
              </div>
            </Alert>
        </Modal>
        <Modal
          :title="this.litigaStatus"
          v-model="showAdd"
          width="546px"
          :loading="loading"
          ok-text="提交"
          @on-ok="submit"
          :mask-closable="false">
          <div>
            <Form :model="addFormItem" :label-width="85" inline>
                <FormItem :label="addFormItem.litigantType == '自然人'? '姓名' : '公司名称'" style="width: 505px;">
                      <Input v-model="addFormItem.litigantName" placeholder="请输入当事人"></Input>
                </FormItem>
                <FormItem label="类型"  style="width: 245px;">
                  <Select v-model="addFormItem.litigantType" transfer placeholder="请选择">
                      <Option value="自然人">自然人</Option>
                      <Option value="法人">法人</Option>
                      <Option value="法人">非法人组织</Option>       
                  </Select>
                </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人' ? '身份证号码' : '统一信用代码'" style="width: 245px;">
                    <Input v-model="addFormItem.identityCard" @on-blur="idCardtoBirth" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="性别" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                    <Select v-model="addFormItem.litigantSex" placeholder="请选择">
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                    </Select>
                </FormItem>
                <FormItem label="出生日期" style="width: 245px  !important;" v-show="addFormItem.litigantType == '自然人'">
                    <DatePicker type="date" :value="addFormItem.birthday" @on-change="changeDate"></DatePicker>
                </FormItem>
                <FormItem label="是否创建账号" style="width: 245px !important;" v-show="this.litigaStatus == '被告'">
                        <RadioGroup v-model="addFormItem.iscreat">
                            <Radio label="是"></Radio>
                            <Radio label="否" style="margin-left:15px"></Radio>
                        </RadioGroup>
                </FormItem>
                <FormItem label="民族" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                    <Input v-model="addFormItem.nation" placeholder="请输入民族" width="100px;"></Input>
                </FormItem>
                <FormItem label="手机号码" style="width: 245px;">
                    <Input v-model="addFormItem.litigantPhone" placeholder="请输入手机号码"></Input>
                    <div style="color: #ed3f14;position:absolute;top:28px;left:5px;">多个手机号码请用逗号分隔</div>
                </FormItem>

                <FormItem v-bind:label="addFormItem.litigantType == '法人' ? '法定代表人' : '负责人'" style="width: 245px;" v-show="addFormItem.litigantType != '自然人'">
                    <Input v-model="addFormItem.legalManName" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人姓名' : '请输入负责人姓名'"  width="100px;"></Input>
                </FormItem>
                <FormItem label="身份证号码" style="width: 245px;" v-show="addFormItem.litigantType != '自然人'">
                    <Input v-model="addFormItem.legalManId" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人身份证号码' : '请输入负责人身份证号码'" width="100px;"></Input>
                </FormItem>
                <FormItem label="手机号码" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                    <Input v-model="addFormItem.legalManPhone" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人手机号码' : '请输入负责人手机号码'"  ></Input>
                </FormItem>

                <FormItem label="固定电话" style="width: 245px;">
                    <Input v-model="addFormItem.litigantTelPhone" placeholder="请输入固定电话"></Input>
                </FormItem>
                <FormItem label="工作单位" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                    <Input v-model="addFormItem.employer" placeholder="请输入工作单位"></Input>
                </FormItem>
                <FormItem label="电子邮箱" style="width: 505px">
                    <Input v-model="addFormItem.email" placeholder="请输入电子邮箱"></Input>
                </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人' ? '户籍地址' : '公司注册地址'" style="width: 505px">
                    <Input v-model="addFormItem.nativePlace" placeholder="请输入地址"></Input>
                </FormItem>
                <FormItem label="备注" style="width: 505px">
                        <Input v-model="addFormItem.nativePlaceRemark" placeholder="请输入地址备注"></Input>
                    </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人' ? '经常居住地址' : '公司经营地址'" style="width: 505px">
                    <Input v-model="addFormItem.address" placeholder="请输入经常居住地址"></Input>
                </FormItem>
                <FormItem label="备注" style="width: 505px">
                    <Input v-model="addFormItem.addressRemark" placeholder="请地址备注"></Input>
                </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人' ? '送达地址' : '确认公司经营地址'" style="width: 505px">
                    <Input v-model="addFormItem.sendAddress" placeholder="请输入送达地址"></Input>
                </FormItem>
                <FormItem label="备注" style="width: 505px">
                    <Input v-model="addFormItem.sendAddressRemark" placeholder="请输入地址备注"></Input>
                </FormItem>
                <div>
                    <div v-for="item in adressList">
                        <FormItem label="其他地址" style="width: 505px">
                            <Input v-model="item.name" placeholder="请输入其他地址"></Input>
                        </FormItem>
                        <FormItem label="备注" style="width: 505px">
                            <Input v-model="item.beizhu" placeholder="请地址备注"></Input>
                        </FormItem>
                    </div>
                </div>
                <FormItem>
                    <div class="adds" @click="addAdress" style="text-align:center">
                        <Icon type="plus-round"></Icon>
                        <p>添加其他地址</p>
                    </div>
                </FormItem>
                <FormItem label="代理人一身份" style="width: 505px;">
                  <Select v-model="addFormItem.lawerType" transfer @on-change="changeType" placeholder="请选择">
                       <Option value="1">律师</Option>
                        <Option value="2">法律工作者</Option>
                        <Option value="3">单位工作人员</Option>
                        <Option value="4">近亲属</Option>
                        <Option value="5">公民</Option>
                  </Select>
                </FormItem>
                <FormItem label="姓名" style="width: 245px;">
                    <AutoComplete v-model="addFormItem.lawerName" :data="agentData1" @on-search="queryAgent"  @on-select="selectName" placeholder="请输入代理人一姓名"  width="100px;" transfer></AutoComplete>
                </FormItem>
                <FormItem label="电话" style="width: 245px;">
                    <AutoComplete v-model="addFormItem.lawermobile" placeholder="请输入代理人一电话" width="100px;" transfer></AutoComplete>
                </FormItem>
                <FormItem label="公民身份证号"  v-show="lawyerT1"  style="width: 505px;">
                    <AutoComplete v-model="addFormItem.lawIdentiCard" placeholder="请输入代理人一身份证号码"  transfer></AutoComplete>
                </FormItem>
                <FormItem label="工作证件号码" v-show="!lawyerT1" style="width: 245px;">
                    <AutoComplete v-model="addFormItem.lawIdentiCard" placeholder="请输入代理人一工作证件号码"  ></AutoComplete>
                </FormItem>

                <FormItem label="代理人二身份" style="width: 505px;">
                  <Select v-model="addFormItem.lawerType1" transfer @on-change="changeType1" placeholder="请选择">
                        <Option value="1">律师</Option>
                        <Option value="2">法律工作者</Option>
                        <Option value="3">单位工作人员</Option>
                        <Option value="4">近亲属</Option>
                        <Option value="5">公民</Option>
                  </Select>
                </FormItem>
                <FormItem label="姓名" style="width: 245px;">
                    <AutoComplete v-model="addFormItem.lawerName1" :data="agentData2" @on-search="queryAgent2" @on-select="selectName2" placeholder="请输入代理人二姓名"  width="100px;" transfer></AutoComplete>
                </FormItem>
                <FormItem label="电话" style="width: 245px;">
                    <AutoComplete v-model="addFormItem.lawermobile1" placeholder="请输入代理人二电话" width="100px;" transfer></AutoComplete>
                </FormItem>
                <FormItem label="公民身份证号" v-show="lawyerT2" style="width: 505px;">
                    <AutoComplete v-model="addFormItem.lawIdentiCard1" placeholder="请输入代理人二身份证号码"  transfer></AutoComplete>
                </FormItem>
               <FormItem label="工作证件号码" v-show="!lawyerT2" style="width: 245px;">
                    <AutoComplete v-model="addFormItem.lawIdentiCard1" placeholder="请输入代理人一工作证件号码"  ></AutoComplete>
                </FormItem>
            </Form>
          </div>
      </Modal>
    </div>
</template>

<script>
import store from '@/store';
import { formatDate } from '@/libs/date';
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import expandRow from './accuser-expand.vue';
import litigantInfo from '@/components/bookBuilding/litigantInfo.vue';
import uploadMultiple from '@/components/upload-multiple';
import { getBrief } from '@/api/global';
import { list } from '@/api/diplomas.js';
import {
    findByCaseLitigant,
    modifyCaseInfo,
    addLitigant,
    createDiploms,
    queryCaseNo,
    NetworkKyc,
    listJudgeAndClerk,
    findAgent,
    litigantRelation,
    removeAddress
} from '@/api/case';

export default {
    components: {
        litigantInfo,
        ClipLoader,
        'upload-multiple': uploadMultiple
    },
    data () {
        return {
            lawyerT1:true,
            lawyerT2:true,
            loading: true,
            fileUploadData: {
                lawCaseId: ''
            },
            sideBarShow: true,
            searchValue: this.$store.getters.caseNo,
            changeCaseInfo: false,
            showAddPlaintiff: false,
            showCaseInfo: false,
            caseLoading: true,
            adressList:[],
            courtId: '',
            caseInfo: {
                id: '',
                caseNo: '',
                court: '',
                judge: '',
                clerk: '',
                filingDate: '',
                expireDate: '',
                brief: '',
                applyStandard: '',
                allMembers: '',
                judgeId: '',
                clerkId: ''
            },
            pageData: {
                pageNumber: 1,
                pageSize: 10,
                total: 0
            },
            reasonList: [],
            searchResultList: [],
            searchListEmpty: false,
            plaintiffList: [],
            defendantList: [],
            thirdList: [],
            leadInModal: false,
            uploadAllMessage: '',
            uploadAllIsError: false,
            uploadAllIsSuccess: false,
            uploadAllIsWarning: false,
            errorDown: '',
            successNum: '',
            errorNum: '',
            uploadLitigantModal: false,
            uploadLitigantIsError: false,
            uploadLitigantIsSuccess: false,
            uploadLitigantIsWarning: false,
            uploadLitigantMessage: '',
            OCRModal: false,
            OCRLoading: false,
            agentData1: [],
            phoneData1: [],
            numData1: [],
            idData1:[],
             idData2:[],
            lawNumData1: [],
            agentData2: [],
            phoneData2: [],
            numData2: [],
            lawNumData2: [],
            arr1:[],
            arr2:[],
            addFormItem: {
                litigantName: '',
                litigantSex: '',
                sendAddressRemark:'',
                nativePlaceRemark:'',
                addressRemark:'',
                allOtherAddress:'',
                iscreat:'',
                litigantType: '自然人',
                employer: '',
                identityCard: '',
                nation: '',
                litigantPhone: '',
                litigantTelPhone: '',
                birthday: '',
                email: '',
                nativePlace: '',
                address: '',
                legalManName: '',
                legalManPhone: '',
                legalManId: '',
                sendAddress: '',
                lawerType: '',
                lawerName: '',
                lawermobile: '',
                lawIdentiCard: '',
                lawerNum: '',
                lawFirm: '',
                agentId:'',
                agentId1:'',
                lawerType1:'',
                lawerName1:'',
                lawermobile1: '',
                lawIdentiCard1: ''

            },
            plaintiffRelation:[],
            defendantRelation:[],
            thirdRelation:[],
            litigaStatus: '',
            showAdd: false,
            uploadOCRIsSuccess: false,
            plaintiffNum: 0,
            defendantNum: 0,
            tab0: true,
            tab1: true,
            tab2: true,
            clerkList: [],
            judgeList: [],
            ocrData: {
                plaintiff: [],
                defendant: []
            }
        };
    },
    created: function () {
        getBrief()
            .then(res => {
                if (res.data.state === 100) {
                    this.reasonList = res.data.result;
                }
            })
            .catch(error => {});
        if (this.searchValue != '') {
            this.queryCaseNo();
        }
    },
    methods: {
         changeType (e) {
            console.log('e为'+e)
            if (e == 1 || e == 2) {
                this.lawyerT1 = false;
            } else {
                this.lawyerT1 = true;
            }
        },
        dipshowF(str){
            let id ='';
            if(this.plaintiffList != []){
                id = this.plaintiffList[0].id;
            }else if (this.defendantList != []){
                id = this.defendantList[0].id;
            }
            if(id == ''){
                this.$Message.info('请添加当事人');
                return false;
            }
            list(id, str).then(res => {
                var data = res.data;
                if (data.state - 0 === 100) {
                    this.$Message.loading({
                        content: '封皮生成中，请稍候',
                        duration: 1, // 给后台一点生成pdf文件的时间
                        onClose: () => {
                            window.open('/' + data.result);
                        }
                    });
                }else{
                    this.$Message.info(data.state.message)
                }
                // 当被告地址超过6个时的消息提示

            }).catch(() => {
                this.$Message.error('网络错误，获取' + name + '失败。');
            });
        },
        addAdress(){
            var da ={
                name:'',
                beizhu:''
            }
            this.adressList.push(da)
        },
        changeType1 (e) {
            if (e == 1 || e == 2) {
                this.lawyerT2 = false;
            } else {
                this.lawyerT2 = true;
            }
        },
        // 代理人一回填
         selectName(value){
            this.addFormItem.lawerName="";
            var showName = value.split('(')
            this.addFormItem.lawerName = showName[0];
            var index = this.arr1.indexOf(value);
            this.addFormItem.agentId = this.idData1[index]; 
           console.log('lawerName为'+showName[0]) 
            this.addFormItem.lawermobile = this.phoneData1[index];
            this.addFormItem.lawIdentiCard = this.numData1[index];
            console.log('phone为'+this.addFormItem.lawIdentiCard)
        },
        queryAgent (value) {
            console.log(989)
            this.numData1 = [];
            this.phoneData1 = [];
            this.lawNumData1 = [];
            this.idData1 = [];
            this.agentData1 = !value ? [] : [
                value,
            ];
            var agentIdentiCard = '';
            var lawerNum = "";
            findAgent(value, agentIdentiCard, lawerNum).then(res => {
                if (res.data.state == 100) {
                    if (res.data.lawyers != []) {
                        this.arr1 = [];
                        var ary = res.data.lawyers;

                        for (var i = 0; i < ary.length; i++) {
                           
                            this.arr1.push(ary[i].agentName +'('+ ary[i].agentIdentiCard+')')
                            this.numData1.push(ary[i].agentIdentiCard);
                            this.phoneData1.push(ary[i].agentMobile);
                            this.idData1.push(ary[i].id)
                            //this.lawNumData1.push(ary[i].lawerNum)
                        }

                        this.agentData1 = this.arr1;
                        console.log(this.agentData1)
                    }
                }
            })
        },

    //   代理人二回填
      selectName2(value){
            var showName1 = value.split('(')
            this.addFormItem.lawerName1 = showName1[0];
            var index1 = this.arr2.indexOf(value);
            this.addFormItem.agentId1 = this.idData2[index1];     
            this.addFormItem.lawermobile1 = this.phoneData2[index1];
            this.addFormItem.lawIdentiCard1 = this.numData2[index1];
            console.log('agentId1为'+this.agentId1)
        },
        queryAgent2 (value) {
            this.phoneData2 = [];
            this.numData2 = [];
            this.lawNumData2 = [];
            this.idData2 = [];
            this.agentData2 = !value ? [] : [
                value,
            ];
            var numa = '';
            var lawerNum = "";
            findAgent(value, numa, lawerNum).then(res => {
                if (res.data.state == 100) {
                    if (res.data.lawyers != []) {
                       this.arr2 = [];
                        var ary = res.data.lawyers;

                        for (var i = 0; i < ary.length; i++) {
                            this.arr2.push(ary[i].agentName+'('+ ary[i].agentIdentiCard+')')
                            this.numData2.push(ary[i].agentIdentiCard);
                            this.phoneData2.push(ary[i].agentMobile);
                            this.lawNumData2.push(ary[i].lawerNum);
                             this.idData2.push(ary[i].id)
                        }
                        this.agentData2 =this.arr2;
                        
                    }
                }
            })
        },
    


        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        toggleCloseSideBar () {
            this.sideBarShow = !this.sideBarShow;
        },
        toggleChangeCaseInfo () {
            if (this.changeCaseInfo === true) {
                this.judgeList.map(item => {
                    if (item.judgeListName == this.caseInfo.judge) {
                        this.caseInfo.judgeId = item.judgeListId;
                    }
                });
                this.clerkList.map(item => {
                    if (item.clerkListName == this.caseInfo.clerk) {
                        this.caseInfo.clerkId = item.clerkListId;
                    }
                });
                modifyCaseInfo(
                    this.caseInfo.id,
                    this.caseInfo.allMembers,
                    this.caseInfo.filingDate,
                    this.caseInfo.expireDate,
                    this.caseInfo.applyStandard,
                    this.caseInfo.brief,
                    this.caseInfo.judgeId,
                    this.caseInfo.clerkId
                )
                    .then(res => {
                        if (res.data.state === 100) {
                            this.$Message.success(res.data.message);
                            clerk: '', (this.changeCaseInfo = false);
                        } else {
                            this.$Message.error(res.data.message);
                        }
                    })
                    .catch(() => {});
            } else {
                console.log(this.courtId);
                var that = this;
                listJudgeAndClerk(this.courtId).then(res => {
                    this.clerkList = [];
                    this.judgeList = [];
                    const constList1 = res.data.clerkList;
                    constList1.map((item, index) => {
                        console.log(item.name);
                        const data = {};
                        data.clerkListName = item.name;
                        data.clerkListId = item.id;
                        that.clerkList.push(data);
                    });
                    const constList2 = res.data.judgeList;
                    constList2.map((item, index) => {
                        console.log(item.name);
                        const data = {};
                        data.judgeListName = item.name;
                        data.judgeListId = item.id;
                        that.judgeList.push(data);
                    });
                });
                this.changeCaseInfo = true;
            }
        },
        changeDate (date) {
            this.caseInfo.filingDate = new Date(date).getTime();
        },
        changeDate2 (date) {
            this.caseInfo.expireDate = new Date(date).getTime();
        },
        changeDate3 (date) {
            this.addFormItem.birthday = new Date(date).getTime();
        },
        idCardtoBirth () {
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (reg.test(this.addFormItem.identityCard)) {
                this.addFormItem.birthday =
          this.addFormItem.identityCard.substring(6, 10) +
          '-' +
          this.addFormItem.identityCard.substring(10, 12) +
          '-' +
          this.addFormItem.identityCard.substring(12, 14);
            }
        },
        addPlaintiff () {
            if (this.CaseInfoSaved()) {
                this.showAddPlaintiff = true;
            }
        },
        CaseInfoSaved () {
            if (this.changeCaseInfo === true) {
                this.$Modal.warning({
                    title: '警告',
                    content: '请先保存案件信息，再进行下一步'
                });
                return false;
            } else {
                return true;
            }
        },
        leadIn () {
            if (this.CaseInfoSaved()) {
                this.leadInModal = true;
                this.uploadAllIsError = false;
                this.uploadAllIsSuccess = false;
                this.uploadAllIsWarning = false;
            }
        },
        uploadLitigant () {
            if (this.CaseInfoSaved()) {
                this.fileUploadData.lawCaseId = this.caseInfo.id;
                this.uploadLitigantModal = true;
                this.uploadLitigantIsError = false;
                this.uploadLitigantIsSuccess = false;
                this.uploadLitigantIsWarning = false;
            }
        },
        pageChange (pageNum) {
            this.pageData.pageNumber = pageNum;
            queryCaseNo(this.searchValue, this.pageData)
                .then(res => {
                    if (res.data.state === 100) {
                        this.searchResultList = res.data.result.content;
                        this.pageData.pageNumber = res.data.result.pageNumber;
                        this.pageData.total = res.data.result.total;
                        if (this.searchResultList.length == 0) {
                            this.searchListEmpty = true;
                        } else {
                            this.searchListEmpty = false;
                        }
                    } else if (res.data.state === 102) {
                        this.searchListEmpty = true;
                    }
                })
                .catch(() => {});
        },
        queryCaseNo () {
            if (this.CaseInfoSaved()) {
                this.pageData.pageNumber = 1;
                queryCaseNo(this.searchValue, this.pageData)
                    .then(res => {
                        if (res.data.state === 100) {
                            this.$store.commit('SET_CASENO', this.searchValue);
                            this.searchResultList = res.data.result.content;
                            this.pageData.pageNumber = res.data.result.pageNumber;
                            this.pageData.total = res.data.result.total;
                            if (this.searchResultList.length == 0) {
                                this.searchListEmpty = true;
                            } else {
                                this.searchListEmpty = false;
                            }
                        } else if (res.data.state === 102) {
                            this.searchListEmpty = true;
                        }
                    })
                    .catch(() => {});
            }
        },
        onRefreshList () {
             this.plaintiffRelation=[];
            this.defendantRelation=[];
            this.thirdRelation=[];
            this.caseLoading = true;
            findByCaseLitigant(this.caseInfo.id)
                .then(res => {
                    this.plaintiffList = [];
                    this.defendantList = [];
                    this.thirdList = [];
                    if (res.data.state === 100) {
                        this.showCaseInfo = true;
                        this.caseLoading = false;
                        const caseInfo = res.data.result.caseInfo;
                        const defendantList = res.data.result.defendantList;
                        const plaintiffList = res.data.result.plaintiffList;
                        const thirdList = res.data.result.thirdList;
                        this.caseInfo.id = caseInfo.id.toString();
                        this.caseInfo.caseNo = caseInfo.caseNo;
                        this.caseInfo.court = caseInfo.court.name;
                        this.caseInfo.judge = caseInfo.judge.name;
                        this.caseInfo.clerk = caseInfo.clerk.name;
                        this.caseInfo.filingDate = caseInfo.filingDate;
                        this.caseInfo.expireDate = caseInfo.expireDate;
                        this.caseInfo.brief = caseInfo.brief.name;
                        this.caseInfo.applyStandard = caseInfo.applyStandard;
                        this.caseInfo.allMembers =
              caseInfo.allMembers == null ? '' : caseInfo.allMembers;
                        plaintiffList.map((item, index) => {
                            const data = {};
                            data.id = item.id;
                            data.litigantName = item.litigantName;
                            data.identityCard = item.identityCard;
                            data.litigantPhone = item.litigantPhone;
                            data.address = item.address;
                            this.plaintiffList.push(data);
                        });
                        // console.log('this.plaintiffList'+this.plaintiffList)
                        defendantList.map((item, index) => {
                            const data = {};
                            data.id = item.id;
                            data.litigantName = item.litigantName;
                            data.identityCard = item.identityCard;
                            data.litigantPhone = item.litigantPhone;
                            data.address = item.address;
                            this.defendantList.push(data);
                        });
                        thirdList.map((item, index) => {
                            const data = {};
                            data.id = item.id;
                            data.litigantName = item.litigantName;
                            data.identityCard = item.identityCard;
                            data.litigantPhone = item.litigantPhone;
                            data.address = item.address;
                            this.thirdList.push(data);
                        });
                    }
                })
                .catch(() => {});
                   console.log(1111)
                litigantRelation(this.caseInfo.id,'原告').then(res => {
                         if(res.data.state == 100){
                             console.log(res.data.litigantRelations)
                            const plaintiffRelation = res.data.litigantRelations
                            plaintiffRelation.map((item, index) => {
                                const data = {};
                                data.id = item.id;
                                data.litigantNames = item.litigantNames;
                                  data.litigationStatus = '原告';
                                data.typeNum = item.type;
                                 if(item.type == 1){
                                   data.type ='夫妻'
                                }else if(item.type == 2){
                                    data.type ='同住成员家属'
                                }else if(item.type == 3){
                                     data.type ='其他'
                                }
                                this.plaintiffRelation.push(data); 
                                console.log(111)
                                console.log(this.plaintiffRelation)
                                })
                                // console.log('原告'+this.plaintiffRelation);
                        }
                     }).catch(() => {});

                      litigantRelation(this.caseInfo.id,'被告').then(res => {
                        if(res.data.state == 100){
                            // console.log(res.data.litigantRelations)
                            var defendantRelation = res.data.litigantRelations;
                           
                              defendantRelation.map((item, index) => {
                                //    console.log(defendantRelation)
                                //   console.log(item);
                                var data = {};
                                data.id = item.id;
                                data.litigantNames = item.litigantNames;
                                  data.litigationStatus = '被告';
                                data.typeNum = item.type;
                                 if(item.type == 1){
                                   data.type ='夫妻'
                                }else if(item.type == 2){
                                    data.type ='同住成员家属'
                                }else if(item.type == 3){
                                     data.type ='其他'
                                }
                                this.defendantRelation.push(data);
                                
                            });
                            // console.log('dsd'+this.litigantRelations);
                        }
                     }).catch(() => {});

                      litigantRelation(this.caseInfo.id,'第三人').then(res => {
                          if(res.data.state == 100){
                              const thirdRelation= res.data.litigantRelations
                                thirdRelation.map((item, index) => {
                                const data = {};
                                data.id = item.id;
                                data.litigantNames = item.litigantNames;
                                data.litigationStatus = '第三人';
                                data.typeNum = item.type;
                                if(item.type == 1){
                                   data.type ='夫妻'
                                }else if(item.type == 2){
                                    data.type ='同住成员家属'
                                }else if(item.type == 3){
                                     data.type ='其他'
                                }
                                              
                                this.thirdRelation.push(data);
                            });
                            // console.log('第三人'+this.thirdRelation);
                        }
                     }).catch(() => {});
                    
       
       
       },
        showCase (id) {
            if (this.CaseInfoSaved()) {
                this.caseLoading = true;
                findByCaseLitigant(id)
                    .then(res => {
                        this.plaintiffRelation=[];
                         this.defendantRelation=[];
                         this.thirdRelation=[];
                        this.plaintiffList = [];
                        this.defendantList = [];
                        this.thirdList = [];
                        if (res.data.state === 100) {
                            this.showCaseInfo = true;
                            this.caseLoading = false;
                            const caseInfo = res.data.result.caseInfo;
                            const defendantList = res.data.result.defendantList;
                            const plaintiffList = res.data.result.plaintiffList;
                            const thirdList = res.data.result.thirdList;
                            this.courtId = res.data.result.caseInfo.court.id;
                            this.caseInfo.id = caseInfo.id.toString();
                            // console.log('caseInfo.id1' +this.caseInfo.id)
                            this.caseInfo.caseNo = caseInfo.caseNo;
                            this.caseInfo.court = caseInfo.court.name;
                            this.caseInfo.judge = caseInfo.judge.name;
                            this.caseInfo.clerk = caseInfo.clerk.name;
                            this.caseInfo.filingDate = caseInfo.filingDate;
                            this.caseInfo.expireDate = caseInfo.expireDate;
                            this.caseInfo.brief = caseInfo.brief.name;
                            this.caseInfo.applyStandard = caseInfo.applyStandard;
                            this.caseInfo.allMembers =
                caseInfo.allMembers == null ? '' : caseInfo.allMembers;
                            //原告信息 
                            plaintiffList.map((item, index) => {
                                const data = {};
                                data.id = item.id;
                                data.litigantName = item.litigantName;
                                data.identityCard = item.identityCard;
                                data.litigantPhone = item.litigantPhone;
                                data.address = item.address;
                                this.plaintiffList.push(data);
                            });
                            // 被告信息
                            // console.log(defendantList)
                            defendantList.map((item, index) => {
                                // console.log(item)
                                const data = {};
                                data.id = item.id;
                                data.litigantName = item.litigantName;
                                data.identityCard = item.identityCard;
                                data.litigantPhone = item.litigantPhone;
                                data.address = item.address;
                                this.defendantList.push(data);
                            });
                            // 第三人信息
                            thirdList.map((item, index) => {
                                const data = {};
                                data.id = item.id;
                                data.litigantName = item.litigantName;
                                data.identityCard = item.identityCard;
                                data.litigantPhone = item.litigantPhone;
                                data.address = item.address;
                                this.thirdList.push(data);
                            });
                            // console.log(this.plaintiffList)
                            // console.log(this.defendantList)
                            // console.log(this.thirdList)
                        }
                    })
                    .catch(() => {});

                    // 当事人关系
      
                     litigantRelation(id,'原告').then(res => {
                         if(res.data.state == 100){
                             console.log(res.data.litigantRelations)
                            const plaintiffRelation = res.data.litigantRelations
                            plaintiffRelation.map((item, index) => {
                                const data = {};
                                data.id = item.id;
                                data.litigantNames = item.litigantNames;
                                  data.litigationStatus = '原告';
                                data.typeNum = item.type;
                                 if(item.type == 1){
                                   data.type ='夫妻'
                                }else if(item.type == 2){
                                    data.type ='同住成员家属'
                                }else if(item.type == 3){
                                     data.type ='其他'
                                }
                                this.plaintiffRelation.push(data); 
                                })
                                this.$refs.revertsList1.getRelation(this.plaintiffRelation);
                                // console.log('原告'+this.plaintiffRelation);
                        }
                     }).catch(() => {});

                      litigantRelation(id,'被告').then(res => {
                        if(res.data.state == 100){
                            var defendantRelation = res.data.litigantRelations;
                           
                              defendantRelation.map((item, index) => {
                                var data = {};
                                data.id = item.id;
                                data.litigantNames = item.litigantNames;
                                  data.litigationStatus = '被告';
                                data.typeNum = item.type;
                                 if(item.type == 1){
                                   data.type ='夫妻'
                                }else if(item.type == 2){
                                    data.type ='同住成员家属'
                                }else if(item.type == 3){
                                     data.type ='其他'
                                }
                                this.defendantRelation.push(data);
                                this.$refs.revertsList2.getRelation(this.defendantRelation);
                            });
                            
                        }
                     }).catch(() => {});

                      litigantRelation(id,'第三人').then(res => {
                          if(res.data.state == 100){
                              const thirdRelation= res.data.litigantRelations
                                thirdRelation.map((item, index) => {
                                const data = {};
                                data.id = item.id;
                                data.litigantNames = item.litigantNames;
                                data.litigationStatus = '第三人';
                                data.typeNum = item.type;
                                if(item.type == 1){
                                   data.type ='夫妻'
                                }else if(item.type == 2){
                                    data.type ='同住成员家属'
                                }else if(item.type == 3){
                                     data.type ='其他'
                                }
                                              
                                this.thirdRelation.push(data);
                                this.$refs.revertsList3.getRelation(this.thirdRelation);                                
                            });
                            // console.log('第三人'+this.thirdRelation);
                        }
                     }).catch(() => {});
                    
            }
        },
     

        uploadAllSuccess (response, file, fileList) {
            this.uploadAllIsError = false;
            this.uploadAllIsSuccess = false;
            this.uploadAllIsWarning = false;
            this.uploadAllMessage = '';
            this.successNum = '';
            this.errorNum = '';
            if (response.state == 100) {
                this.uploadAllIsSuccess = true;
                this.uploadAllMessage = response.message;
                setTimeout(function () {
                    this.uploadAllIsSuccess = false;
                }, 2000);
            } else if (response.state == 102) {
                this.uploadAllIsError = true;
                this.uploadAllMessage = response.message;
            } else if (response.state == 101) {
                this.uploadAllIsWarning = true;
                this.uploadAllMessage = response.message;
                this.successNum = response.successNum;
                this.errorNum = response.errorNum;
                this.errorDown =
          '/api/court/estFile/downErro.jhtml?fileName=' + response.fileName;
            } else if (response.state == 103) {
                this.uploadAllIsWarning = true;
                this.uploadAllMessage = response.message;
                this.successNum = response.successNum1;
                this.errorNum = response.errorNum1;
                this.errorDown =
          '/api/court/estFile/downErro.jhtml?fileName=' + response.fileName;
            } else if (response.state == 104) {
                this.uploadAllIsWarning = true;
                this.uploadAllMessage = response.message;
                this.successNum =
          parseInt(response.successNum1) + parseInt(response.successNum);
                this.errorNum =
          parseInt(response.errorNum1) + parseInt(response.errorNum);
                this.errorDown =
          '/api/court/estFile/downErro.jhtml?fileName=' + response.fileName;
            }
        },
        uploadLitigantSuccess (response, file, fileList) {
            this.uploadLitigantIsError = false;
            this.uploadLitigantIsSuccess = false;
            this.uploadLitigantIsWarning = false;
            this.uploadLitigantMessage = '';
            this.successNum = '';
            this.errorNum = '';
            if (response.state == 100) {
                this.uploadLitigantIsSuccess = true;
                this.uploadLitigantMessage = response.message;
                setTimeout(function () {
                    this.uploadLitigantIsSuccess = false;
                }, 2000);
                this.onRefreshList();
            } else if (response.state == 102) {
                this.uploadLitigantIsError = true;
                this.uploadLitigantMessage = response.message;
            } else if (response.state == 101) {
                this.uploadLitigantIsWarning = true;
                this.uploadLitigantIsError = response.message;
                this.errorDown =
          '/api/court/createCase/downErro.jhtml?fileName=' + response.fileName;
            }
        },
        uploadOCR () {
            if (this.CaseInfoSaved()) {
                this.fileUploadData.lawCaseId = this.caseInfo.id;
                this.OCRModal = true;
                this.uploadOCRIsSuccess = false;
            }
        },
        beforeUploadOCR () {
            this.OCRLoading = true;
            this.ocrData.plaintiffStr = [];
            this.ocrData.defendantStr = [];
            this.plaintiffNum = 0;
            this.defendantNum = 0;
        },
        uploadOCRSuccess (response, file, fileList) {
            if (!response.result) {
                this.$Message.error('识别错误！');
            } else {
                this.ocrData.plaintiffStr = this.ocrData.plaintiffStr.concat(
                    response.result.plaintiffStr
                );
                this.ocrData.defendantStr = this.ocrData.defendantStr.concat(
                    response.result.defendantStr
                );
                this.uploadOCRIsSuccess = true;
                this.plaintiffNum +=
          (response.result.plaintiffStr &&
            response.result.plaintiffStr.length) ||
          0;
                this.defendantNum +=
          (response.result.defendantStr &&
            response.result.defendantStr.length) ||
          0;
                this.OCRLoading = false;
            }
        },
        handleTabRemove (name) {
            this['tab' + name] = false;
        },
        addParties (type, n) {
            if (type == 1) {
                this.litigaStatus = '原告';
                this.addFormItem.litigantName = this.ocrData.plaintiffStr[
                    n
                ].litigantName;
                this.addFormItem.litigantSex =
          this.ocrData.plaintiffStr[n].litigantSex == 0 ? '男' : '女';
                this.addFormItem.litigantType =
          this.ocrData.plaintiffStr[n].litigantType == 1 ? '法人' : '自然人';
                this.addFormItem.identityCard = this.ocrData.plaintiffStr[
                    n
                ].identityCard;
                this.addFormItem.employer = this.ocrData.plaintiffStr[n].employer;
                this.addFormItem.nation = this.ocrData.plaintiffStr[n].nation;
                this.addFormItem.litigantPhone = this.ocrData.plaintiffStr[
                    n
                ].litigantPhone;
                this.addFormItem.litigantTelPhone = this.ocrData.plaintiffStr[
                    n
                ].litigantTelPhone;
                this.addFormItem.birthday = this.ocrData.plaintiffStr[n].birthday;
                this.addFormItem.email = this.ocrData.plaintiffStr[n].email;
                this.addFormItem.nativePlace = this.ocrData.plaintiffStr[n].nativePlace;
                this.addFormItem.address = this.ocrData.plaintiffStr[n].address;
            } else {
                this.litigaStatus = '被告';
                this.addFormItem.litigantName = this.ocrData.defendantStr[
                    n
                ].litigantName;
                this.addFormItem.litigantSex =
          this.ocrData.defendantStr[n].litigantSex == 0 ? '男' : '女';
                this.addFormItem.litigantType =
          this.ocrData.defendantStr[n].litigantType == 1 ? '法人' : '自然人';
                this.addFormItem.identityCard = this.ocrData.defendantStr[
                    n
                ].identityCard;
                this.addFormItem.employer = this.ocrData.defendantStr[n].employer;
                this.addFormItem.nation = this.ocrData.defendantStr[n].nation;
                this.addFormItem.litigantPhone = this.ocrData.defendantStr[
                    n
                ].litigantPhone;
                this.addFormItem.litigantTelPhone = this.ocrData.defendantStr[
                    n
                ].litigantTelPhone;
                this.addFormItem.birthday = this.ocrData.defendantStr[n].birthday;
                this.addFormItem.email = this.ocrData.defendantStr[n].email;
                this.addFormItem.nativePlace = this.ocrData.defendantStr[n].nativePlace;
                this.addFormItem.address = this.ocrData.defendantStr[n].address;
            }
            this.showAdd = true;
        },
        submit () {
            const litigantSex = this.addFormItem.litigantSex == '男' ? 0 : 1;
            if(this.litigaStatus == "被告"){
                if(this.addFormItem.iscreat == ''){
                    this.$Message.info('请选择是否创建账号');
                    this.changeLoading();
                    return false;
                }
                if(this.addFormItem.iscreat == '是'){
                    this.addFormItem.iscreat = 1
                }else{
                    this.addFormItem.iscreat = 0
                }
            }else{
                this.addFormItem.iscreat = '';
            }
            var adrStr = '';
            if(this.adressList.length != 0){
                for( var i=0;i<this.adressList.length;i++){
                    if(i == this.adressList.length-1){
                        adrStr = adrStr+this.adressList[i].name+','+this.adressList[i].beizhu;
                    }else{
                        adrStr = adrStr+this.adressList[i].name+','+this.adressList[i].beizhu+',';
                    }
                    
                }
            }
            this.addFormItem.allOtherAddress = adrStr;
            if (this.addFormItem.litigantType == '自然人') {
                var litigantType = 0;
            } else if (this.addFormItem.litigantType == '法人') {
                var litigantType = 1;
            } else {
                var litigantType = 2;
            }
            console.log(this.addFormItem.litigantPhone)
            if (
                this.addFormItem.litigantPhone == '' ||
                this.addFormItem.litigantPhone == undefined ||
                this.addFormItem.litigantPhone == null
            ) {
                console.log(555)
                var litigantPhone = '';
            } else {
                // var litigantPhone = this.addFormItem.litigantPhone.replace(/，/gi, ',');
                var litigantPhone = this.addFormItem.litigantPhone;
            }
            var birthday =
        this.addFormItem.birthday &&
        formatDate(new Date(this.addFormItem.birthday), 'yyyy-MM-dd');
            if (birthday == 'NaN-aN-aN') {
                birthday = '';
            }
            if (birthday == 'NaN') {
                birthday = '';
            }
            console.log('caseInfo.id2' +this.caseInfo.id)
            if (this.addFormItem.litigantType == '自然人') {
                var subNmae = this.addFormItem.litigantName;
                var subCarId = this.addFormItem.identityCard;
                var subPhone = litigantPhone;
                var legalManName = '';
                var legalManId = '';
                var legalManPhone = '';
            } else {
                var subNmae = this.addFormItem.litigantName;
                var subCarId = this.addFormItem.identityCard;
                var subPhone = '';
                var legalManName = this.addFormItem.legalManName;
                var legalManId = this.addFormItem.legalManId;
                var legalManPhone = this.addFormItem.legalManPhone;
            }
            NetworkKyc(subNmae,subCarId,subPhone,legalManName,legalManPhone,legalManId,litigantType).then(res => {
                if (res.data.state === 100) {
                    if (res.data.isTrue == true) {
                       console.log('caseInfo.id3' +this.caseInfo.id) 
                        addLitigant(
                            this.addFormItem.iscreat,
                            this.addFormItem.nativePlaceRemark,
                            this.addFormItem.addressRemark,
                            this.addFormItem.sendAddressRemark,
                            this.addFormItem.allOtherAddress,
                            this.caseInfo.id,
                            this.addFormItem.litigantName,
                            this.addFormItem.identityCard,
                            litigantSex,
                            litigantType,
                            this.addFormItem.employer,
                            litigantPhone,
                            this.addFormItem.litigantTelPhone,
                            this.addFormItem.email,
                            this.addFormItem.nativePlace,
                            this.addFormItem.address,
                            this.addFormItem.nation,
                            birthday,
                            this.litigaStatus,
                            this.addFormItem.legalManName,
                            this.addFormItem.legalManPhone,
                            this.addFormItem.legalManId,
                            this.addFormItem.sendAddress,
                            this.addFormItem.agentId,
                            this.addFormItem.lawerType,
                            this.addFormItem.lawerName,
                            this.addFormItem.lawermobile,
                            this.addFormItem.lawIdentiCard,
                            this.addFormItem.lawerNum,
                            this.addFormItem.relationType,
                            this.addFormItem.relationLitigantId,
                            this.addFormItem.agentId1,
                            this.addFormItem.lawerType1,
                            this.addFormItem.lawerName1,
                            this.addFormItem.lawermobile1,
                            this.addFormItem.lawIdentiCard1,
                            this.addFormItem.lawerNum1
                          

                        )
                            .then(res => {
                                if (res.data.state === 100) {
                                    this.$Message.success(res.data.message);
                                    this.addFormItem.nativePlaceRemark = '';
                                    this.addFormItem.addressRemark= '';
                                    this.addFormItem.sendAddressRemark = '';
                                    this.addFormItem.allOtherAddress = '';
                                    this.adressList = [];    
                                    this.addFormItem.litigantName = '';
                                    this.addFormItem.litigantSex = '';
                                    this.addFormItem.litigantType = '自然人';
                                    this.addFormItem.identityCard = '';
                                    this.addFormItem.employer = '';
                                    this.addFormItem.nation = '';
                                    this.addFormItem.litigantPhone = '';
                                    this.addFormItem.litigantTelPhone = '';
                                    this.addFormItem.birthday = '';
                                    this.addFormItem.email = '';
                                    this.addFormItem.nativePlace = '';
                                    this.addFormItem.address = '';
                                    this.addFormItem.legalManName = '';
                                    this.addFormItem.legalManPhone = '';
                                    this.addFormItem.legalManId = '';
                                    this.addFormItem.sendAddress = '';
                                    this.addFormItem.lawerType = '';
                                    this.addFormItem.lawerName = '';
                                    this.addFormItem.lawermobile = '';
                                    this.addFormItem.lawIdentiCard = '';
                                    this.addFormItem.lawerNum = '';
                                    this.addFormItem.lawFirm = '';
                                    this.addFormItem.relationType = '';
                                    this.addFormItem.relationLitigantId = '';
                                    this.addFormItem.agentId = "";
                                    this.addFormItem.agentId1 = "";
                                    this.addFormItem.lawerType1 = '';
                                    this.addFormItem.lawerName1 = '';
                                    this.addFormItem.lawermobile1 = '';
                                    this.addFormItem.lawIdentiCard1 = '';
                                    this.addFormItem.lawerNum1 = '';
                                    this.addFormItem.lawIdentiCard1 = '';
                                    this.showAdd = false;
                                    this.onRefreshList();
                                } else {
                                    this.changeLoading();
                                    this.$Message.error(res.data.message);
                                }
                            })
                            .catch(() => {
                                this.$Message.error('服务器出错，请稍后再试');
                                this.changeLoading();
                            });
                    } else {
                        this.$Modal.confirm({
                            title: '',
                            content: '<p>三网认证不成功</p>',
                            okText: '继续提交',
                            cancelText: '取消提交',
                            onOk: () => {
                                console.log(this.caseInfo.id)
                                addLitigant(
                                this.addFormItem.iscreat,
                                this.addFormItem.nativePlaceRemark,
                                this.addFormItem.addressRemark,
                                this.addFormItem.sendAddressRemark,
                                this.addFormItem.allOtherAddress,
                                this.caseInfo.id,
                                this.addFormItem.litigantName,
                                this.addFormItem.identityCard,
                                litigantSex,
                                litigantType,
                                this.addFormItem.employer,
                                litigantPhone,
                                this.addFormItem.litigantTelPhone,
                                this.addFormItem.email,
                                this.addFormItem.nativePlace,
                                this.addFormItem.address,
                                this.addFormItem.nation,
                                birthday,
                                this.litigaStatus,
                                this.addFormItem.legalManName,
                                this.addFormItem.legalManPhone,
                                this.addFormItem.legalManId,
                                this.addFormItem.sendAddress,
                                this.addFormItem.agentId,
                                this.addFormItem.lawerType,
                                this.addFormItem.lawerName,
                                this.addFormItem.lawermobile,
                                this.addFormItem.lawIdentiCard,
                                this.addFormItem.lawerNum,
                                this.addFormItem.relationType,
                                this.addFormItem.relationLitigantId,
                                this.addFormItem.agentId1,
                                this.addFormItem.lawerType1,
                                this.addFormItem.lawerName1,
                                this.addFormItem.lawermobile1,
                                this.addFormItem.lawIdentiCard1,
                                this.addFormItem.lawerNum1
                                )
                                    .then(res => {
                                        if (res.data.state === 100) {
                                            this.$Message.success(res.data.message);  
                                            this.addFormItem.litigantName = '';
                                            this.addFormItem.nativePlaceRemark = '';
                                            this.addFormItem.addressRemark= '';
                                            this.addFormItem.sendAddressRemark = '';
                                            this.addFormItem.allOtherAddress = '';
                                            this.adressList = [];
                                            this.addFormItem.litigantSex = '';
                                            this.addFormItem.litigantType = '自然人';
                                            this.addFormItem.identityCard = '';
                                            this.addFormItem.employer = '';
                                            this.addFormItem.nation = '';
                                            this.addFormItem.litigantPhone = '';
                                            this.addFormItem.litigantTelPhone = '';
                                            this.addFormItem.birthday = '';
                                            this.addFormItem.email = '';
                                            this.addFormItem.nativePlace = '';
                                            this.addFormItem.address = '';
                                            this.addFormItem.legalManName = '';
                                            this.addFormItem.legalManPhone = '';
                                            this.addFormItem.legalManId = '';
                                            this.addFormItem.sendAddress = '';
                                            this.addFormItem.lawerType = '';
                                            this.addFormItem.lawerName = '';
                                            this.addFormItem.lawermobile = '';
                                            this.addFormItem.lawIdentiCard = '';
                                            this.addFormItem.lawerNum = '';
                                            this.addFormItem.lawFirm = '';
                                             this.addFormItem.lawerType1 = '';
                                            this.addFormItem.lawerName1 = '';
                                            this.addFormItem.lawermobile1 = '';
                                            this.addFormItem.lawIdentiCard1 = '';
                                            this.showAdd = false;
                                            this.onRefreshList();
                                        } else {
                                            this.changeLoading();
                                            this.$Message.error(res.data.message);
                                        }
                                    })
                                    .catch(() => {
                                        this.$Message.error('服务器出错，请稍后再试');
                                        this.changeLoading();
                                    });
                            },
                            onCancel: () => {
                                this.changeLoading();
                            }
                        });
                    }
                } else {
                    this.$Modal.confirm({
                        title: '',
                        content: '<p>三网认证接口调用失败</p>',
                        okText: '继续提交',
                        cancelText: '取消提交',
                        onOk: () => {
                            console.log(this.caseInfo.id)
                            addLitigant(
                                this.addFormItem.iscreat,
                                this.addFormItem.nativePlaceRemark,
                                this.addFormItem.addressRemark,
                                this.addFormItem.sendAddressRemark,
                                this.addFormItem.allOtherAddress,
                                this.caseInfo.id,
                                this.addFormItem.litigantName,
                                this.addFormItem.identityCard,
                                litigantSex,
                                litigantType,
                                this.addFormItem.employer,
                                litigantPhone,
                                this.addFormItem.litigantTelPhone,
                                this.addFormItem.email,
                                this.addFormItem.nativePlace,
                                this.addFormItem.address,
                                this.addFormItem.nation,
                                birthday,
                                this.litigaStatus,
                                this.addFormItem.legalManName,
                                this.addFormItem.legalManPhone,
                                this.addFormItem.legalManId,
                                this.addFormItem.sendAddress,
                                this.addFormItem.agentId,
                                this.addFormItem.lawerType,
                                this.addFormItem.lawerName,
                                this.addFormItem.lawermobile,
                                this.addFormItem.lawIdentiCard,
                                this.addFormItem.lawerNum,
                                this.addFormItem.relationType,
                                this.addFormItem.relationLitigantId,
                                this.addFormItem.agentId1,
                                this.addFormItem.lawerType1,
                                this.addFormItem.lawerName1,
                                this.addFormItem.lawermobile1,
                                this.addFormItem.lawIdentiCard1,
                                this.addFormItem.lawerNum1
                            )
                                .then(res => {
                                    if (res.data.state === 100) {
                                        this.$Message.success(res.data.message);
                                        this.litigantId = '';
                                        this.addFormItem.nativePlaceRemark = '';
                                        this.addFormItem.addressRemark= '';
                                        this.addFormItem.sendAddressRemark = '';
                                        this.addFormItem.allOtherAddress = '';
                                        this.adressList = [];
                                        this.addFormItem.litigantName = '';
                                        this.addFormItem.litigantSex = '';
                                        this.addFormItem.litigantType = '自然人';
                                        this.addFormItem.identityCard = '';
                                        this.addFormItem.employer = '';
                                        this.addFormItem.nation = '';
                                        this.addFormItem.litigantPhone = '';
                                        this.addFormItem.litigantTelPhone = '';
                                        this.addFormItem.birthday = '';
                                        this.addFormItem.email = '';
                                        this.addFormItem.nativePlace = '';
                                        this.addFormItem.address = '';
                                        this.addFormItem.legalManName = '';
                                        this.addFormItem.legalManPhone = '';
                                        this.addFormItem.legalManId = '';
                                        this.addFormItem.sendAddress = '';
                                        this.addFormItem.lawerType = '';
                                        this.addFormItem.lawerName = '';
                                        this.addFormItem.lawermobile = '';
                                        this.addFormItem.lawIdentiCard = '';
                                        this.addFormItem.lawerNum = '';
                                        this.addFormItem.lawFirm = '';

                                         this.addFormItem.lawerType1 = '';
                                        this.addFormItem.lawerName1 = '';
                                        this.addFormItem.lawermobile1 = '';
                                        this.addFormItem.lawIdentiCard1 = '';
                                        this.showAdd = false;
                                        this.onRefreshList();
                                    } else {
                                        this.changeLoading();
                                        this.$Message.error(res.data.message);
                                    }
                                })
                                .catch(() => {
                                    this.$Message.error('服务器出错，请稍后再试');
                                    this.changeLoading();
                                });
                        },
                        onCancel: () => {
                            this.changeLoading();
                        }
                    });
                }
            });
        },
        diploms () {
            createDiploms(this.caseInfo.id)
                .then(res => {
                    if (res.data.state === 100) {
                        this.$Message.success(res.data.message);
                    } else {
                        this.$Message.error(res.data.message);
                    }
                })
                .catch(err => {
                    this.$Message.error('网络错误，请稍后再试');
                });
        }
    },
    filters: {
        formatDate (time) {
            if(time == null){
                  return "";
            }else{
                var date = new Date(time);
                 return formatDate(date, 'yyyy-MM-dd');
            }
           
        }
    }
};
</script>
<style lang="less" scoped>
.ivu-select-single .ivu-select-selection .ivu-select-selected-value,
.ivu-input {
  font-size: 14px;
}
.ivu-input {
  font-size: 14px;
}
.side-bar {
  display: inline-block;
  width: 250px;
  position: fixed;
  top: 173px;
  left: 220px;
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
  min-height: 400px;
  max-height: 600px;
  .search-wrapper {
    margin-top: 20px;
    .ivu-input-wrapper .ivu-icon {
      cursor: pointer;
    }
  }
}
.search-list-wrapper {
  margin-top: 20px;
  font-size: 13px;
  max-height: 340px;
  overflow: auto;
  li {
    line-height: 30px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }
  li:hover {
    color: #40a9ff;
  }
}
.search-list-empty {
  margin-top: 20px;
  font-size: 13px;
  text-align: center;
  color: #ed3f14;
}
.btn-group {
  display: inline-block;
  padding: 3px 18px;
  vertical-align: top;
  transition: all 0.5s;
}
.right-wrapper {
  display: inline-block;
  width: 100%;
  padding-left: 220px;
  position: absolute;
  top: 50px;
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
        position: absolute;
        right: 10px;
        cursor: pointer;
        color: #fff;
      }
    }
  }
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
.adds .ivu-icon{
    font-size: 30px;
    display: block;
    margin-top: 5px;
}
.adds p{
    display: inline-block;
    line-height: 11px;
}
.moreHei .ivu-card .ivu-card-head{
    padding: 8px 16px;
}
</style>
