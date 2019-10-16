<style>
.ivu-upload-list{
  display: inline-block;
}
.ivu-upload-select{
  float: left;
  margin-top: 10px;
}
.ivu-upload-list li{
  margin-left:10px;
  float: left;
}
.ivu-upload{
  display: block;
}
</style>

<template>
    <div>
        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">公告送达管理</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="getNoticeList(formItem, 1)">
                        <FormItem label="案号：">
                            <Input style="width: 128px" v-model="formItem.caseNo"/>
                        </FormItem>
                        <FormItem label="案由：">
                            <Select style="width: 128px" v-model="formItem.briefName">
                                <Option v-for="b in briefList" :value="b.brief" :key="b.brief">{{ b.brief }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="发行日期：">
                            <DatePicker type="daterange"  placement="bottom-end" :options="options" v-model="daterange" placeholder="请选择您要查询的日期范围" style="width: 190px"></DatePicker>
                        </FormItem>
                        <FormItem label="创建人：">
                            <Input style="width: 128px" v-model="formItem.creator"/>
                        </FormItem>
                        <FormItem label="发布状态：">
                            <Select style="width: 128px" v-model="formItem.isRelease">
                                <Option value="false">未发布</Option>
                                <Option value="true">已发布</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="报纸刊号：">
                            <Input style="width: 128px" v-model="formItem.newspaper"/>
                        </FormItem>
                        <div style="display: inline-block; padding-left: 20px">
                            <Button @click="getNoticeList(formItem, 1)" type="ghost">查询</Button>
                            <Button style="margin-left: 10px" type="ghost" @click='cleanForm()'>清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ButtonGroup style="margin-top: 10px; margin-bottom: 10px">
                <!-- <Button @click="$router.push('../dip')" size="large" type="info">查看</Button> -->
                <Button @click=" openAdd" size="large" type="primary">添加</Button>
                <!-- <Button size="large" type="success">修改</Button> -->
                <Button @click="toDel" size="large" type="ghost">删除</Button>
            </ButtonGroup>
            <Table stripe ref="noticeTable" :columns="noticecol" :data="noticedata" @on-selection-change="tableCheck"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPages" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            v-model="cardState"
            :title="op[cardState] + '公告信息'"
            :mask-closable="false"
            class-name="vertical-center-modal"
            :width="modalWidth">
            <Spin size="large" fix v-if="caseSpin"></Spin>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>案号
                    </Col>
                    <Col v-show="cardState === 2" span="9" class="maininfo-col">
                        <Select v-model="caseN.caseInfo" placeholder="请选择案件" @on-change="selCase" filterable remote :remote-method="searchCase" :loading="loading1">
                            <Option v-for="(item, key) in caseList" :value="key" :key="key">{{ item.label }}</Option>
                            <!-- <Page v-if="caseTotal" :current="casePage" :page-size="1" @on-change="changeCasePage" :total="caseTotal" simple></Page> -->
                        </Select>
                    </Col>
                    <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ caseN.caseNo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>案件案由
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseN.brief }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>原告
                    </Col>
                    <Col span="9" class="maininfo-col ellipsisText">
                        {{ caseN.plaintiff }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>公告对象
                    </Col>
                    <Col v-show="cardState === 2" span="9" class="maininfo-col ellipsisText">
                        <!-- <Select v-model="caseN.noticedNamePhone" multiple>
                            <Option v-for="(name, key) in caseN.dlist" :value="key" :key="key">{{ name }}</Option>
                        </Select> -->
                        <CheckboxGroup v-model="caseN.noticedNames">
                            <Checkbox @click.native="changeLiti" v-for="(name, key) in caseN.dlist" :label="name" :key="key">{{ name }}</Checkbox>
                        </CheckboxGroup>
                    </Col>
                    <Col span="9" v-show="cardState !== 2" class="maininfo-col ellipsisText">
                        {{ caseN.noticeNames }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        报纸刊号
                    </Col>
                    <Col span="9" v-show="cardState !== 1" class="maininfo-col">
                        <Input v-model="caseN.newspaper" placeholder="" style="width: 100%" :disabled="!caseN.caseNo"></Input>
                    </Col>
                    <Col span="9" v-show="cardState === 1" class="maininfo-col">
                        {{ caseN.newspaper }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>发行日期
                    </Col>
                    <Col span="9" v-show="cardState === 1" class="maininfo-col">
                        {{ caseN.releaseDate | formatDate }}
                    </Col>
                    <Col span="9" v-show="cardState !== 1" class="maininfo-col">
                        <DatePicker v-model="caseN.releaseDate" type="date" style="width: 100%" :disabled="!caseN.caseNo"></DatePicker>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>发布状态
                    </Col>
                    <Col span="9" v-show="cardState !== 1" class="maininfo-col">
                        <Select v-model="caseN.isRelease" :disabled="!caseN.caseNo">
                            <Option value="false">公告未发布</Option>
                            <Option value="true">公告已发布</Option>
                        </Select>
                    </Col>
                    <Col span="9" v-show="cardState === 1" class="maininfo-col">
                        {{ caseN.isRelease ? '公告已发布' : '公告未发布' }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        公告链接
                    </Col>
                    <Col span="9" v-show="cardState !== 1" class="maininfo-col">
                        <Input v-model="caseN.newsurl" :disabled="!caseN.caseNo" placeholder="请填写完整公告链接" style="width: 100%"></Input>
                    </Col>
                    <Col span="9" v-show="cardState === 1" class="maininfo-col">
                        {{ caseN.newsurl }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>公告通知发送对象
                    </Col>
                    <Col v-show="cardState === 2" span="9" class="maininfo-col">
                        <RadioGroup v-model="caseN.sendId">
                            <Radio  v-for="(i, key) in caseN.pilist" :label="i" :key="key">
                                {{ caseN.plist[key] }}({{ caseN.pplist[key] }})
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col span="9" v-show="cardState !== 2" class="maininfo-col">
                        {{ caseN.sendInfo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                      预计开庭时间
                    </Col>
                    <Col span="9" class="maininfo-col">
                       <templante v-if="caseN.expectStartTime!=null"> {{ caseN.expectStartTime | formatDate }}</templante>
                    </Col>
                </Row>
                <Row>
                  <Col span="3" style="position:absolute;top:0px;bottom:0px;" class="maininfo-col maininfo-col-label">
                    <span style="color:red">*</span>诉讼请求
                  </Col>
                  <Col push="3" style="height: auto;" span="21" class="maininfo-col">
                    <Input v-model="caseN.claim" :disabled="!caseN.caseNo" placeholder="请填写诉讼请求" style="width: 100%"></Input>
                  </Col>
                </Row>
                <Row v-show="haveLiti">
                    <Col span="3" style="position:absolute;top:0px;bottom:0px;" class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>公告模板
                    </Col>
                    <Col push="3" v-show="cardState === 2" style="height: auto;" span="21" class="maininfo-col">
                        <Select v-model="caseN.msgTplId" :disabled="!caseN.caseNo" @on-change="selectNoticeEdut">
                            <!-- <Option v-for="item in noticeTList" :value="item.id" :key="item.id">{{ item.name + ': ' + item.content }}</Option> -->
                            <Option v-for="item in noticeTList" :value="item.id" :key="item.id">{{ item.name}}</Option>
                            <Page v-if="noticeTT > 10" :current="noticeTP" @on-change="changeNTPage" :total="noticeTT" simple></Page>
                        </Select>
                    </Col>
                    <Col v-show="cardState !== 2" span="21" class="maininfo-col" style="height: auto;margin-left:150px">
                        {{ caseN.msgtpl }}
                    </Col>
                </Row>
                <Row v-show="isNoticeEdit">
                    <Col span="3" style="height: 550px" class="maininfo-col maininfo-col-label">
                        公告编辑
                    </Col>
                    <Col span="21"  style="height: 550px;" class="maininfo-col">
                        <!-- <Input type="textarea" :disabled="!caseN.caseNo" :autosize="false" element-id="ntcRemark" v-model="notice.remark"></Input> -->
                        <div style="width:100%" v-show="mubanCourt">
                            <p style="text-align:center"><Input type="text" v-model="courtName" placeholder="法院名称" style="width:30%"> </Input></p>
                            <h3  style="text-align:center;font-size:18px">公告</h3>
                            <p style="text-align:right">{{caseNo}}</p>
                            <p><Input type="text" placeholder="公告发送对象" v-model="litigantName" style="width:20%"></Input>：</p>
                            <p style="">　　本院受理原告<Input type="text" v-model="plaintiffName" placeholder="原告名称" style="width:20%"></Input>诉被告<Input type="text" v-model="defendantName" placeholder="被告名称" style="width:20%"></Input><Input v-model="briefName" type="text" placeholder="案由" style="width:20%"></Input>(案由)一案，原告请求判令：<Input type="text" v-model="requestContent" placeholder="原告请求判令" style="width:20%"></Input>
                                。因你下落不明，现依法向你公告送达<Input type="text" v-model="diplomsName" placeholder="送达文件	" style="width:50%"></Input>。自本公告发出之日起，经过60日即视为送达。提出答辩状和举证的期限分别为公告期满后的十五日内（遇节假日顺延）。并定于举证期满后的次日上午8时45分（遇节假日顺延），在
                                <Input type="text" v-model="courtName" placeholder="法院名称" style="width:20%"></Input><Input v-model="tribunalName" type="text" placeholder="" style="width:20%"></Input>公开开庭审理，逾期将依法裁判。
                            </p>
                            <p>　　特此公告。</p>
                            <p style="text-align:right"> <Input type="text" v-model="noticeTime" placeholder="公告时间" style="width:13%"></Input>　　</p>
                            <p style="text-align:right">（院印）　　</p>
                            <p>联系人：<Input type="text" v-model="contactName" placeholder="联系人" style="width:10%"></Input>　　
                                电话：<Input type="text" v-model="contactPhone" placeholder="电话" style="width:10%"></Input>。
                            </p>
                            <p>公告报纸回邮地址：<Input type="text" v-model="contactAddress" placeholder="法院地址" style="width:20%"></Input>
                                <Input type="text" v-model="courtAllName" placeholder="法院名称" style="width:20%"></Input>，邮编：361006。
                            </p>
                        </div>
                        <div style="width:100%" v-show="!mubanCourt">
                            <p style="text-align:center;font-size:18px;font-weight:600">福建省厦门市湖里区人民法院</Input></p>
                            <h3  style="text-align:center;font-size:18px">公告</h3>
                            <p style="text-align:right">{{caseNo}}</p>
                            <p><Input type="text" placeholder="公告发送对象" v-model="litigantName" style="width:20%"></Input>：</p>
                            <p style="">　　本院受理原告<Input type="text" v-model="plaintiffName" placeholder="原告名称" style="width:20%"></Input>与被告<Input type="text" v-model="defendantName" placeholder="被告名称" style="width:20%"></Input><Input v-model="briefName" type="text" placeholder="案由" style="width:20%"></Input>一案，现依法向你公告送达<Input type="text" v-model="diplomsName" placeholder="送达文件 " style="width:50%"></Input>。自公告之日起六十日，即视为送达。提出答辩状和举证的期限分别为公告期满后的15日和30日内。并定于举证期满后的次日上午八时三十分（遇节假日顺延），在本院
                                </Input><Input v-model="tribunalName" type="text" placeholder="" style="width:20%"></Input>公开开庭审理，逾期将依法缺席裁判。
                            </p>
                            <p>　　特此公告。</p>
                            <p style="text-align:right"> <Input type="text" v-model="noticeTime" placeholder="公告时间" style="width:13%"></Input>　　</p>
                            <p style="text-align:left">承办法庭：厦门市湖里区法院立案庭　　</p>
                            <p style="text-align:left">邮寄地址：厦门市湖里区金尚路1789号115办公室 <Input type="text" v-model="contactName" placeholder="联系人" style="width:10%"></Input>  收　　</p>
                            <p style="text-align:left">电话：0592-5308644　　</p>
                            <p style="text-align:left">
                            承办法官：<Input type="text" v-model="judgeName" placeholder="法官名称" style="width:10%"></Input>　
                            <span style="display:inline-block;margin-left:10px;">书记员：</span><Input type="text" v-model="clerkName" placeholder="书记员名称" style="width:10%"></Input>　　
                            </p>
                        </div>
                    </Col>
                    <Col span="21" v-show="cardState === 1" style="height: 120px" class="maininfo-col">
                        {{ caseN.remark }}
                    </Col>
                </Row>
                <Row v-show="uploadPicture">
                    <Col span="3" style="min-height:80px"  class="maininfo-col maininfo-col-label">
                        <span style="color:red">*</span>照片上传
                    </Col>
                    <Col span="21" style="min-height:80px"  class="maininfo-col">
                        <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/notice/uploadImg.jhtml"
                      :data="{}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">照片上传</Button>
                    </myUpload>
                    </Col>
                </Row>
                <Row v-show="cardState === 1">
                    <Col span="3" style="height: 120px" class="maininfo-col maininfo-col-label">
                        备注
                    </Col>
                    <Col span="21" v-show="cardState !== 1" style="height: 500px;" class="maininfo-col">
                        <!-- <Input type="textarea" :disabled="!caseN.caseNo" :autosize="false" element-id="ntcRemark" v-model="notice.remark"></Input> -->
                    </Col>
                    <Col span="21" v-show="cardState === 1" style="height: 120px" class="maininfo-col">
                        {{ caseN.remark }}
                    </Col>
                </Row>
                <Row v-show="cardState === 1">
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        创建人
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseN.creator }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        创建时间
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseN.createTime }}
                    </Col>
                </Row>
                <Row v-show="cardState === 1">
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        最后修改人
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseN.updator }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        最后修改时间
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseN.modifyTime }}
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button @click="sendConfirm = true" icon="android-share-alt" size="large" type="primary" v-show="cardState === 3">再次发送</Button>
                <Button :loading="loading2" @click="noticeEdit" icon="android-upload" size="large" v-show="cardState === 3">保存</Button>
                <Button :loading="loading3" @click="noticeCreat" size="large" type="primary" v-show="cardState === 2">生成公告</Button>
                <Button :loading="loading3" @click="noticeAdd" :disabled="disabled" size="large" type="primary" v-show="cardState === 2">确认</Button>
                <Button @click="noticeConfirmation" type="primary" size="large" v-show="cardState === 1">公告内容确认</Button>
                <Button @click="cardState = false; caseN.msgTplId = ''; caseN.caseInfo = '' " type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="sendConfirm" width="360">
            <!-- <p slot="header" style="color:#407bff;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确定再次发送通知公告短信</span>
            </p> -->
            <div style="text-align:center; font-size: 16px">
                <p>
                    <Icon style="color:#407bff;" type="information-circled"></Icon>
                    确定再次发送通知公告短信？
                </p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" icon="android-share-alt" long :loading="loading1" @click="sendMsg">确定发送</Button>
            </div>
        </Modal>
        <Modal v-model="modal2" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确认删除</span>
            </p>
            <div style="text-align:center">
                <p>您将删除的公告序号为</p>
                <p>
                    {{ checkIds }}
                </p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="del_loading" @click="delNotice">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { getBrief, searchCase } from "../api/global.js";
import { senList } from "../api/templante.js";
import UE from "../components/ueditor/ueditor.vue";
import Vue from 'vue';
import {
  list,
  del,
  add,
  edit,
  getById,
  sendById,
  NoticeSendConfirmation,
  listTemplate,
  createWord
} from "../api/notice.js";
import myUpload from '@/components/upload';
import { formatDate } from "../libs/date.js";
export default {
  components: { UE,myUpload: myUpload },
  data() {
    // var nowD = new Date();
    var width = window.innerWidth - 200;
    return {
      yg: [],
      bg: [],
      courtName: "",
      judgeName:"",
      caseNo:"",
      uploadPicture:false,
      clerkName:"",
      loading1: false,
      filePath:"",
      filePathList:[],
      litigantName: "",
      plaintiffName: "",
      defendantName: "",
      mubanCourt:true,
      disabled:true,
      briefName: "",
      requestContent: "",
      diplomsName: "",
      courtName: "",
      tribunalName: "",
      noticeTime: "",
      contactName: "",
      contactPhone: "",
      contactAddress: "",
      courtAllName: "",
      haveLiti:false,
      show1: true,
      modalWidth: width,
      cardState: false,
      op: ["", "查看", "添加", "修改"],
      modal2: false,
      isNoticeEdit: false,
      sendConfirm: false,
      del_loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      sendLoading: false,
      caseSpin: true,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 1000
      },
      daterange: [],
      formItem: {
        caseNo: this.$store.getters.caseNo,
        briefName: "",
        newspaper: "",
        creator: "",
        isRelease: "",
        releaseDate: ""
      },
      caseList: [],
      caseTotal: 0,
      casePage: 1,
      noticeTList: [],
      noticeTT: 0,
      noticeTP: 0,
      briefList: [],
      pageNumber: 1,
      totalPages: 1,
      checkIds: "",
      checkNames: [],
      selId: "",
      noticecol: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "序号",
          key: "id",
          align: "center",
          width: 100
        },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("span", params.row.lawCase.caseNo);
          }
        },
        {
          title: "案由",
          key: "brief",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("span", params.row.lawCase.brief.name);
          }
        },
        {
          title: "发布状态",
          key: "isRelease",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.isRelease ? "已发布" : "未发布");
          }
        },
        {
          title: "发行日期",
          key: "releaseDate",
          align: "center",
          width: 150
        },
        {
          title: "报纸刊号",
          key: "newspaper",
          align: "center",
          width: 100
        },
        {
          title: "公告链接",
          key: "newsurl",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h(
              "a",
              {
                props: {
                  href: params.row.newsurl
                }
              },
              params.row.newsurl
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
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
                        this.uploadPicture = false;
                      this.isNoticeEdit = false;
                      this.getNoticeInfo(params.row.id, 1);
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
                  style: {
                    marginLeft: "5px",
                    color: "#118877"
                  },
                  on: {
                    click: () => {
                    this.haveLiti =true;
                      this.isNoticeEdit = false;
                      this.selId = params.row.id;
                      this.getNoticeInfo(params.row.id, 3);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    loading: this.sendLoading
                  },
                  style: {
                    marginLeft: "5px",
                    color: "#3399ff"
                  },
                  on: {
                    click: () => {
                      this.selId = params.row.id;
                      this.caseN.sendPhone = params.row.sendPhone;
                      this.sendConfirm = true;
                    }
                  }
                },
                "再次发送"
              )
            ]);
          }
        }
      ],
      noticedata: [],
      sendId: "",
      plaintiffIds: "",
      notice: {
        name: "",
        content: "",
        remark: "",
        issues: "",
        IssuesDate: "",
        isRelease: "",
        noticeTo: []
      },
      caseN: {},
      options: {
        // daterange 配置
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
    this.getSENList();
    this.getNoticeList(this.formItem, 1);
    this.getCaseList(1);
  },
  methods: {
      noticeCreat(){

        const params = {
            lawCaseId: this.selId,
            courtName: this.courtName,
            caseNo:this.caseNo,
            litigantName:this.litigantName,     //公告对象
            plaintiffName:this.plaintiffName,
            diplomsName:this.diplomsName,
            defendantName:this.defendantName,
            briefName:this.briefName,
            requestContent:this.requestContent,
            tribunalName:this.tribunalName,
            noticeTime:this.noticeTime,
            contactName: this.contactName,
            litigantId:this.caseN.sendId
        };
        createWord(params).then(res => {
            console.log(res)
            if(res.data.state == 100){
                this.filePath = res.data.result;
                
                this.$Message.loading({
                    content: '公告生成中，请稍候',
                    duration: 2, 
                    onClose: () => {
                        window.open('/' + res.data.result);
                    }
                });
                this.uploadPicture = true;

            }else{
                this.$Message.info(res.data.message);
            }
        })
      },
      cleanForm(){
          this.formItem.caseNo=''
          this.formItem.briefName=''
          this.formItem.creator=''
          this.formItem.isRelease=''
          this.formItem.newspaper=''
          this.daterange=''
      },
      searchCase(value){
        clearTimeout(this.getcase.timer);
        var that = this;
        var mustApplyTime = 1500;
        this.getcase._cur=Date.now();  //记录当前时间

        if(!this.getcase._start){      //若该函数是第一次调用，则直接设置_start,即开始时间，为_cur，即此刻的时间
            this.getcase._start=this.getcase._cur;
        }
        if(this.getcase._cur-this.getcase._start>mustApplyTime){ 
        //当前时间与上一次函数被执行的时间作差，与mustApplyTime比较，若大于，则必须执行一次函数，若小于，则重新设置计时器
            that.getcase(value);
            that.getcase._start=that.getcase._cur;
        }else{
            this.getcase.timer=setTimeout(function(){
                that.getcase(value);
            },800);
        }
      },
      getcase(value){
      var that = this;
      this.loading1 = true;
      this.caseList = [];
        searchCase(value)
        .then(res => {
        this.loading1 = false;
          var data = res.data;
          if (data.state - 0 === 100) {
            // that.caseList = data.result;
            data.result.map(item => {
                const data =  {
                    value: item,
                    label: item.caseNo
                };

                that.caseList.push(data)
            })
            console.log(that.caseList);
            // that.casePage = data.result.pageNumber;
            // that.caseTotal = data.result.totalPage;
          } else {
            that.$Message.info(data.message);
          }
          that.caseSpin = false;
        })
      },
    uploadSuccess (response) {
        if (response.state == 100) {
            this.$Message.success(response.message);
            this.disabled = false;
            this.filePathList.push(response.filePath)
        } else {
            this.$Message.error(response.message);
        }
    },
    changeLiti(){
       this.haveLiti = true;
    },
    openAdd() {
      this.cardState = 2;
      this.caseN = {};
      this.caseN.caseInfo = "";
      // this.caseN.noticedNames = [];
      this.isNoticeEdit = false;
      this.selId = "";
      this.plaintiffIds = "";
      this.courtName = "";
      this.litigantName = "";
      this.plaintiffName = "";
      this.defendantName = "";
      this.briefName = "";
      this.requestContent = "";
      this.diplomsName = "";
      this.courtName = "";
      this.tribunalName = "";
      this.noticeTime = "";
      this.contactName = "";
      this.contactPhone = "";
      this.contactAddress = "";
      this.courtAllName = "";
      // Vue.set(this.caseN, 'noticedNames', [])
      this.haveLiti = false;
      this.uploadPicture =false;
      this.disabled = true;
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
          that.saved = false;
        });
    },
    getListMUban() {
      listTemplate().then(res => {});
    },
    getCaseList() {
      var that = this;
      this.caseList = [];
      searchCase()
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            // that.caseList = data.result;
            data.result.map(item => {
                const data =  {
                    value: item,
                    label: item.caseNo
                };
                that.caseList.push(data)
            })
            console.log(that.caseList);
            // that.casePage = data.result.pageNumber;
            // that.caseTotal = data.result.totalPage;
          } else {
            that.$Message.info(data.message);
          }
          that.caseSpin = false;
        })
        .catch(() => {
          that.$Message.error("网络错误，查询案件列表失败。");
          that.caseSpin = false;
        });
    },
    getNoticeList(params, page) {
      this.$store.commit("SET_CASENO", this.formItem.caseNo);
      var that = this;
      var s = "";
      var e = "";
      if (that.daterange[0]) {
        s = that.daterange[0];
      }
      if (that.daterange[1]) {
        e = that.daterange[1];
      }
      s && (params.startDate = formatDate(s, "yyyy-MM-dd hh:mm:ss"));
      e && (params.endDate = formatDate(e, "yyyy-MM-dd hh:mm:ss"));
      params.pageNo = page;
      list(params)
        .then(res => {
          var data = res.data;
          that.$Message.info(data.message);
          if (data.state === 100) {
            that.noticedata = data.result.content;
            that.pageNumber = data.result.pageNumber;
            that.totalPages = data.result.totalPages;
          }
        })
        .catch(() => {
          that.$Message.error("网络错误");
        });
    },
    getNoticeInfo(id, s) {
      var that = this;
      // var msg = this.$Message.loading({
      //     content: '加载中...',
      //     duration: 0
      // });
      getById(id)
        .then(res => {
          var data = res.data;
          that.caseN = {};
          if (data.state - 0 === 100) {
            var n = data.result;
            that.sendId = n.sendId;
            that.caseN.expectStartTime = n.expectStartTime;
            that.caseN.caseId = n.notice.lawCase.id;
            that.caseN.noticeId = n.notice.id;
            that.caseN.caseNo = n.notice.lawCase.caseNo;
            that.caseN.brief = n.brief;
            that.caseN.plaintiff = n.litiAll;
            that.caseN.litigantId = n.litiname[0].litigantId;
            that.caseN.noticeNames = n.notice.bgName;
            that.caseN.newspaper = n.notice.newspaper;
            that.caseN.releaseDate = n.notice.releaseDate;
            that.caseN.isRelease = n.notice.isRelease;
            that.caseN.sendInfo =
              n.litiname[0].name + " " + n.litiname[0].phone;
            that.caseN.msgtpl = n.msgtpl;
            that.caseN.msgTplId = n.notice.msgTplId;
            that.caseN.newsurl = n.notice.newsurl;
            that.caseN.claim = n.notice.claim;
            that.caseN.remark = n.notice.remark;
            that.caseN.creator = n.creator;
            that.caseN.createTime =
              n.notice.createDate &&
              formatDate(new Date(n.notice.createDate), "yyyy-MM-dd hh:mm:ss");
            that.caseN.updator = n.updator;
            that.caseN.modifyTime =
              n.notice.modifyDate &&
              formatDate(new Date(n.notice.modifyDate), "yyyy-MM-dd hh:mm:ss");
            that.caseN.sendPhone = n.notice.sendPhone;
            that.cardState = s;
          } else {
            that.$Message.info(data.message);
          }
          // msg = null;
        })
        .catch(() => {
          that.$Message.error("网络错误");
          // msg = null;
        });
    },
    getSENList(p) {
      var that = this;
      senList(2, p)
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            that.noticeTList = data.result.content;
            that.noticeTP = data.result.pageNumber;
            that.noticeTT = data.result.total;
          } else {
            that.$Message.info(data.message);
          }
          that.queryLoading = false;
        })
        .catch(() => {
          that.$Message.error("网络错误");
        });
    },
    noticeAdd() {
      var that = this;
      console.log(this.caseN.sendId);
      if(this.caseN.sendId){
        if(this.caseN.sendId == ""){
          this.$Message.info("请选择公告通知发送对象");
          return false;
        }
      }else{
        this.$Message.info("请选择公告通知发送对象");
        return false;
        
      }
      console.log(this.caseN.claim)
      console.log(this.caseN.noticedNames && this.caseN.noticedNames.join(","));
      const params = {
        msgTplId: this.caseN.msgTplId,
        litigantId: this.caseN.sendId, // 你以为要传phone，其实传的是ID哒！ 因为一些沟通的问题。。变成这样别扭的样子
        bgname: this.caseN.plaintiff,
        // litigantId: this.plaintiffIds,
        caseId: this.caseN.id,
        isRelease: this.caseN.isRelease,
        releaseDate:
          this.caseN.releaseDate &&
          formatDate(this.caseN.releaseDate, "yyyy-MM-dd"),
        newspaper: this.caseN.newspaper,
        newsurl: this.caseN.newsurl,
        remark: this.caseN.remark,
        claim: this.caseN.claim,
        // bgname: this.caseN.noticedNames && this.caseN.noticedNames.join(','),
        courtName: this.courtName,
        litigantName: this.litigantName,
        plaintiffName: this.plaintiffName,
        defendantName: this.defendantName,
        briefName: this.briefName,
        requestContent: this.requestContent,
        diplomsName: this.diplomsName,
        courtName: this.courtName,
        tribunalName: this.tribunalName,
        noticeTime: this.noticeTime,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        contactAddress: this.contactAddress,
        courtAllName: this.courtAllName,
        filePath:this.filePathList.join(',')
      };
      console.log(params);
      add(params)
        .then(res => {
          var data = res.data;
          that.$Message.info(data.message);
          if (data.state === 100) {
            this.getNoticeList({});
            that.cardState = false;
          }else{
            this.$Message.info(res.data.message)
          }
         
                               
        })
        .catch(() => {
          that.$Message.error("网络错误, 添加失败");
        });
    },
    selectNoticeEdut(value) {
      if (!this.caseN.caseNo) {
        return false;
      }
      this.caseNo = this.caseN.caseNo;
      console.log(value)
      console.log(this.noticeTList)
      for(var i=0;i<this.noticeTList.length;i++){
        if(value == this.noticeTList[i].id){
            if(this.noticeTList[i].name == '公告模板（本部）'){
                this.mubanCourt = false;
            }else{
                this.mubanCourt = true;
            }
        }
      }
      const params = {
        lawCaseId: this.selId,
        litigantId: this.plaintiffIds,
        litigantName:this.caseN.noticedNames.join(",")
      };
      console.log(params);
      listTemplate(params).then(res => {
        if (res.data.state == 100) {
          console.log(res.data.result);
          this.courtName = res.data.result[0].courtName;
          this.litigantName = res.data.result[0].litigantName;
          this.plaintiffName = res.data.result[0].plaintiffName;
          this.defendantName = res.data.result[0].defendantName;
          this.briefName = res.data.result[0].briefName;
          this.requestContent = res.data.result[0].requestContent;
          this.diplomsName = res.data.result[0].diplomsName;
          this.courtName = res.data.result[0].courtName;
          this.tribunalName = res.data.result[0].tribunalName;
          this.noticeTime = res.data.result[0].noticeTime;
          this.contactName = res.data.result[0].contactName;
          this.contactPhone = res.data.result[0].contactPhone;
          this.contactAddress = res.data.result[0].contactAddress;
          this.courtAllName = res.data.result[0].courtAllName;
          this.judgeName = res.data.result[0].judge;
          this.clerkName = res.data.result[0].clerk;
          if (this.cardState === 2) {
            this.isNoticeEdit = true;
          }
        }else{
            this.$Message.info(res.data.message)
        }
      });
    },
    noticeEdit() {
      var that = this;
      const params = {
        id: this.caseN.noticeId,
        // msgTplId: this.caseN.msgTplId,
        // sendPhone: this.caseN.sendId,
        // caseId: this.caseN.id,
        isRelease: this.caseN.isRelease,
        releaseDate:
          this.caseN.releaseDate &&
          formatDate(this.caseN.releaseDate, "yyyy-MM-dd"),
        newspaper: this.caseN.newspaper,
        newsurl: this.caseN.newsurl,
        claim: this.caseN.claim,
        remark: this.caseN.remark
        // bgname: this.caseN.noticedNames && this.caseN.noticedNames.join(',')
      };
      edit(params)
        .then(res => {
          var data = res.data;
          that.$Message.info(data.message);
          if (data.state === 100) {
            this.getNoticeList({});
            that.cardState = false;
          }else{
            this.$Message.info(res.data.message)
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 添加失败");
        });
    },
    noticeConfirmation() {
      NoticeSendConfirmation(
        this.caseN.caseId,
        this.caseN.litigantId,
        this.sendId
      ).then(res => {
        if (res.data.state == 100) {
          this.$Message.success(res.data.message);
          that.cardState = false;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    toDel() {
      if (this.checkNames.length) {
        this.modal2 = true;
      } else {
        this.$Message.warning("请至少选择一条数据");
      }
    },
    delNotice() {
      var that = this;
      that.del_loading = true;
      del(that.checkIds)
        .then(res => {
          var data = res.data;
          that.$Message.info(data.message);
          if (data.state === 100) {
            that.getNoticeList(that.formItem, 1);
            that.modal2 = false;
          }
          that.del_loading = false;
        })
        .catch(() => {
          that.$Message.error("网络错误");
          that.del_loading = false;
        });
    },
    sendMsg() {
      var that = this;
      that.sendLoading = true;
      sendById(this.selId)
        .then(res => {
          var data = res.data;
          that.sendLoading = false;
          that.sendConfirm = false;
          that.cardState = false;
          that.$Message.info(data.message);
        })
        .catch(() => {
          that.sendLoading = false;
          that.$Message.error("网络错误，发送失败。");
        });
    },
    changePage(p) {
      this.getNoticeList(this.formItem, p);
    },
    changeNTPage(p) {
      this.getSENList(p);
    },
    changeCasePage(p) {
      this.getCaseList(p);
    },
    inputClean() {
      this.notice = {
        name: "",
        content: "",
        remark: ""
      };
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
      this.checkIds = arr.join(",");
    },
    selCase(k) {
      var c = this.caseList[k].value;
      console.log(c);
      c.dlist = []; // 被告列表
      c.dplist = []; // 被告phone列表
      c.pplist = []; // 原告phone列表
      c.plist = []; // 原告列表
      c.pilist = []; // 原告ID列表
      if (c.defendant) {
        c.dlist = c.defendant.split(",");
        c.dplist = c.defendantPhone.split(",");
        c.pplist = c.plaintiffPhone.split(",");
        c.plist = c.plaintiff.split(",");
        c.pilist = c.plaintiffIds.split(",");
      }
      this.haveLiti = false;
      this.isNoticeEdit = false;
      this.uploadPicture = false;
      this.caseN.msgTplId = '';
      this.$refs.evidenceUpload.clearFiles();
      this.disabled = true;
      this.caseN = c;
      this.selId = c.id;
      this.filePath = "";
      this.filePathList = [];
      this.plaintiffIds = c.plaintiffIds;
      console.log(this.selId);
    },
    formatDate(d, fmt) {
      return formatDate(d, fmt);
    }
  },
  filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      try {
        var date = new Date(time.replace(/-/g, "/"));
      } catch (e) {
        var date = new Date(time);
      }
      return formatDate(date, "yyyy-MM-dd");
    },
    formatStartDate(time) {
      if (time == "") {
        return "";
      }
      try {
        var date = new Date(time.replace(/-/g, "/"));
      } catch (e) {
        var date = new Date(time);
      }
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  }
};
</script>
