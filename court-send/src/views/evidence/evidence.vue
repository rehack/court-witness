<template>
  <div>
    <Card class="search-wrapper">
      <Form class="search-form" :model="searchData" :label-width="80" inline>
          <FormItem label="案号">
            <Input style="width: 200px" v-model="searchData.caseNo"/>
        </FormItem>
        <FormItem label="部门：">
            <Select v-model="searchData.courtId" style="width:200px">
                <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="当事人">
          <Input v-model="searchData.litigantName" placeholder="请输入当事人" style="width: 200px" />
        </FormItem>
        <FormItem label="身份类型">
          <Select v-model="searchData.litigantType" placeholder="请选择身份类型" style="width: 200px;vertical-align:middle;">
            <Option value="0">原告</Option>
            <Option value="1">被告</Option>
          </Select>
        </FormItem>
        <FormItem label="处理状态">
          <Select v-model="searchData.state" placeholder="请选择处理状态" style="width: 200px;vertical-align:middle;">
            <Option value="0">待处理</Option>
            <Option value="1">已处理</Option>
          </Select>
        </FormItem>
        <div style="text-align:right;" class="btn-group">
          <FormItem>
              <Button type="primary" @click="searchList">查询</Button>
              <Button type="ghost" @click="emptySearchList" style="margin-left: 8px">清空</Button>
          </FormItem>
        </div>
      </Form>
    </Card>
    <Card>
      <div class="table-btn-group">
        <Button icon="plus" type="primary" @click="showAddModal">添加</Button>
      </div>
      <Table
        ref="selection"
        border
        :columns="columns"
        :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="pageData.total" :page-size="1" :current="pageData.pageNumber" @on-change="changePage"></Page>
            </div>
        </div>

    </Card>
    <Modal
        v-model="addModal"
        ok-text="关闭"
        cancel-text=""
        title="添加案件证据">
        <Form :model="addFormSearch" :label-width="80">
          <FormItem label="案号">
            <Input v-model="addFormSearch.searchValue" @on-change="queryCaseNo" placeholder="请输入查询案号" style="width: 300px"></Input>
          </FormItem>
        </Form>
        <Table highlight-row @on-current-change="currentRow" :columns="caseColumns" :data="caseData"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="pageData1.total" :page-size="1" :current="pageData1.pageNumber" @on-change="changePage1"></Page>
            </div>
        </div>
    </Modal>
    <Modal
        v-model="upEvidenceModal"
        width="800px"
        ok-text="上传"
        cancel-text="取消"
        @on-cancel="upEvidenceModalCancel"
        @on-ok="addEvidence"
        :loading="loading"
        title="证据上传">
        <table class="bookbuilding-table" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td>案号</td>
                <td>
                  <span>{{ caseInfo.caseNo }}</span>
                </td>
                <td>案由</td>
                <td>
                  <span>{{ caseInfo.brief }}</span>
                </td>
            </tr>
            <tr>
                <td>开庭时间</td>
                <td>
                  <span>{{ caseInfo.openCourtTime | formatStartDate }}</span>
                </td>
                <td>开庭地点</td>
                <td>
                  <span>{{ caseInfo.openCourtAddress }}</span>
                </td>
            </tr>
            <tr>
                <td>立案日期</td>
                <td>
                  <span>{{ caseInfo.expireDate | formatDate }}</span>
                </td>
                <td>审判员</td>
                <td>
                  <span>{{ caseInfo.judge }}</span>
                </td>
            </tr>
            <tr>
                <td>书记员</td>
                <td>
                  <span>{{ caseInfo.clerk }}</span>
                </td>
                <td>案件标的</td>
                <td>
                  <span>{{ caseInfo.applyStandard }}</span>
                </td>
            </tr>
            <tr>
                <td>证据提交人</td>
                <td>
                  <Select v-model="caseInfo.litigant" @on-change="selectLitigant" style="width: 98%;vertical-align:middle;">
                      <Option v-for="item in caseInfo.litigantList" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </td>
                <td>诉讼地位</td>
                <td>
                  <span> {{ caseInfo.litigantType }} </span>
                </td>
            </tr>
            <tr>
              <td>证据：（合法的文件格式如doc,docx,xls,xlsx,bmp,jpg,jpeg,png）</td>
              <td colspan="3">
                <span>文件类型：</span>
                <Select v-model="fileType" @on-change="showType"  style="vertical-align:middle;display: inline-block;width:200px">
                    <Option  value=1 >证据</Option>
                    <Option  value=2 >答辩状</Option>
                    <Option  value=3 >起诉状</Option>
                    <Option  value=4 >反诉状</Option>
                    <Option  value=5 >调查取证申请书</Option>
                    <Option  value=6 >证人出庭申请书</Option>
                    <Option  value=7 >证据目录</Option>
                    <Option  value=8 >其他</Option>
                </Select>
                <div class="pic_upload_list" v-show="value1">
                    <div class="titleType"> 证据</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId, evidenceId: this.evidenceInfo.evidenceId,uploadType:1}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传证据文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value2" >
                    <div class="titleType"> 答辩状</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId, evidenceId: this.evidenceInfo.evidenceId,uploadType:2}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传答辩状文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value3">
                    <div class="titleType"> 起诉状</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId, evidenceId: this.evidenceInfo.evidenceId,uploadType:3}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传起诉状文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value4">
                    <div class="titleType"> 反诉状</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId, evidenceId: this.evidenceInfo.evidenceId,uploadType:4}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传反诉状文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value5">
                    <div class="titleType"> 调查取证申请书</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId, evidenceId: this.evidenceInfo.evidenceId,uploadType:5}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传调查取证申请书</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value6">
                    <div class="titleType"> 证人出庭申请书</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId, evidenceId: this.evidenceInfo.evidenceId,uploadType:6}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传证人出庭申请书</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value7">
                    <div class="titleType"> 证据目录</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId, evidenceId: this.evidenceInfo.evidenceId,uploadType:7}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传证据目录文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value8">
                    <div class="titleType"> 其他</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId, evidenceId: this.evidenceInfo.evidenceId,uploadType:8}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传其他文件</Button>
                    </myUpload>
                </div>
              </td>
            </tr>
        </table>
    </Modal>
    <Modal
        v-model="detailModal"
        width="800px"
        cancel-text="取消"
        :ok-text="this.detailInfo.auditStatus == 0 ? '处理': '关闭'"
        @on-ok="submitEvidence"
        :loading="loading"
        title="证据详情">
        <table class="bookbuilding-table" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td>案号</td>
                <td>
                  <span>{{ detailInfo.caseNo }}</span>
                </td>
                <td>案由</td>
                <td>
                  <span>{{ detailInfo.brief }}</span>
                </td>
            </tr>
            <tr>
                <td>开庭时间</td>
                <td>
                  <span>{{ detailInfo.openCourtTime | formatStartDate }}</span>
                </td>
                <td>开庭地点</td>
                <td>
                  <span>{{ detailInfo.openCourtAddress }}</span>
                </td>
            </tr>
            <tr>
                <td>立案日期</td>
                <td>
                  <span>{{ detailInfo.expireDate | formatDate }}</span>
                </td>
                <td>审判员</td>
                <td>
                  <span>{{ detailInfo.judge }}</span>
                </td>
            </tr>
            <tr>
                <td>书记员</td>
                <td>
                  <span>{{ detailInfo.clerk }}</span>
                </td>
                <td>案件标的</td>
                <td>
                  <span>{{ detailInfo.applyStandard }}</span>
                </td>
            </tr>
            <tr>
                <td>证据提交人</td>
                <td>
                  <span> {{ detailInfo.litigant }} </span>
                </td>
                <td>诉讼地位</td>
                <td>
                  <span> {{ detailInfo.litigantType }} </span>
                </td>
            </tr>
            <tr v-for="(item, index) in detailInfo.evidenceList">
              <td>证据{{ index + 1 }}：</td>
              <td colspan="3">
                <span>
                  <a style="margin-right: 19px;"  @click="showDipmos(item.id)" >{{ item.name }}</a>
                  <Button v-show="item.auditHandle == 0" type="primary" shape="circle" size="small" style="margin-right:5px;" @click="passAudit(item.id)">通过</Button>
                  <Button v-show="item.auditHandle == 0" type="default" shape="circle" size="small" @click="nopassAudit(item.id)">驳回</Button>
                  <span v-show="item.auditHandle == 1" style="color: #19be6b">通过</span>
                  <span v-show="item.auditHandle == 2" style="color: #ed3f14">驳回</span>
                </span>
              </td>
            </tr>
        </table>
    </Modal>
     <!-- 证据查看 -->
    <Modal
        v-model="viewDipmos"
        title="查看"
        :mask-closable="false"
        :styles="{top: '20px'}"
        :width="modalWidth">
        <div class="components-container">
            <zh-viewer :viewerId="'1'" :fileUrls="filePathAry"></zh-viewer>
        </div>
        <div slot="footer">
            <Button @click="viewDipmos = false"   type="dashed" size="large">关闭</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import { queryCaseNo } from '@/api/case.js';
import {
    queryEvidence,
    findEvidenAbout,
    addEvidence,
    queryEvidenceDetail,
    dealAttachMent,
    dealEvidenceAbout,
    downAttachMent,
} from '@/api/evidence.js';
import ZhViewer from "@/components/moreFileViewer/moreFileViewer.vue";
import { formatDate } from '@/libs/date';
import { courtList } from "../../api/global.js";
import myUpload from '@/components/upload';
import UploadList from '@/components/upload/upload-list.vue';
export default {
    components: {
        myUpload: myUpload,
        ZhViewer
    },
    data () {
        var width = window.innerWidth - 350;
        return {
            modalWidth:width,
            filePathAry:[],
            viewDipmos:false,

            loading: true,
            litigantId:'',
            addModal: false,
            upEvidenceModal: false,
            detailModal: false,
            passSuccess: false,
            fileLists: [],
            departmentList: [],
            fileType: '',
            value1: false,
            value2: false,
            value3: false,
            value4: false,
            value5: false,
            value6: false,
            value7: false,
            value8: false,
            addFormSearch: {
                searchValue: ''
            },
            searchData: {
                caseNo:'',
                courtId:"",
                litigantName: '',
                litigantType: '',
                state: ''
            },
            pageData: {
                pageNumber: 1,
                pageSize: 10,
                total: 0
            },
            pageData1:{
                pageNumber: 1,
                pageSize: 10,
                total: 0
            },
            caseInfo: {
                id: '',
                caseNo: '',
                brief: '',
                openCourtTime: '',
                openCourtAddress: '',
                expireDate: '',
                judge: '',
                clerk: '',
                applyStandard: '',
                litigantList: [],
                litigantData: [],
                litigant: '',
                litigantType: '',
                litigantId: ''
            },
            detailInfo: {
                id: '',
                caseNo: '',
                brief: '',
                openCourtTime: '',
                openCourtAddress: '',
                expireDate: '',
                judge: '',
                clerk: '',
                applyStandard: '',
                evidenceList: [],
                litigantData: [],
                litigant: '',
                litigantType: '',
                litigantId: '',
                auditStatus: ''
            },
            evidenceInfo: {
                evidenceId: ''
            },
            tableData: [],
            columns: [
                {
                    title: '案号',
                    key: 'caseNo',
                    align: 'center',
                    width: 200
                },
                {
                    title: '证据提交人',
                    key: 'litigantName',
                    align: 'center',
                    width: 180
                },
                {
                    title: '身份类型',
                    key: 'litigantType',
                    align: 'center',
                    width: 100
                },
                {
                    title: '案件阶段',
                    key: 'stage',
                    align: 'center',
                    // width: 200
                },
                {
                    title: '提交日期',
                    key: 'date',
                    align: 'center',
                    width: 150
                },
                {
                    title: '处理状态',
                    key: 'state',
                    align: 'center',
                    // width: 120
                },
                {
                    title: '审核人',
                    key: 'checkName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    // fixed: 'right',
                    width: 120,
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            queryEvidenceDetail(params.row.id).then(res => {
                                                if (res.data.state == 100) {
                                                    this.detailModal = true;
                                                    this.detailInfo.id = params.row.id;
                                                    this.detailInfo.caseNo = res.data.result.caseNo;
                                                    this.detailInfo.brief = res.data.result.briefName;
                                                    this.detailInfo.openCourtTime =
                            res.data.result.startTime;
                                                    this.detailInfo.openCourtAddress =
                            res.data.result.startAddress;
                                                    this.detailInfo.expireDate =
                            res.data.result.filingDate;
                                                    this.detailInfo.judge = res.data.result.judgeName;
                                                    this.detailInfo.clerk = res.data.result.clerkName;
                                                    this.detailInfo.applyStandard =
                            res.data.result.applyStandard;
                                                    this.detailInfo.litigant =
                            res.data.result.submitPeople;
                                                    this.detailInfo.litigantType =
                            res.data.result.peopleStatus;
                                                    this.detailInfo.evidenceList =
                            res.data.result.evidenceAttachments;
                                                    this.detailInfo.auditStatus =
                            res.data.result.auditStatus;
                                                } else {
                                                    this.$Message.error(res.data.message);
                                                }
                                            });
                                        }
                                    }
                                },
                                '查看'
                            )
                        ]);
                    }
                }
            ],
            caseColumns: [
                {
                    title: '案号',
                    key: 'caseNo',
                    align: 'center'
                },
                {
                    title: '立案时间',
                    key: 'filingDate',
                    align: 'center',
                    width: 200
                }
            ],
            caseData: []
        };
    },
    created: function () {
        this.onRefreshList();
        this.getCourtList();
    },
    methods: {
        showDipmos(id){
            downAttachMent(id).then(res => {
                if(res.data.state == 100){
                    this.filePathAry = [];
                    this.filePathAry.push(res.data.path);
                    console.log(this.filePathAry)
                    this.viewDipmos = true;
                }
            })
        },
        changePage(num) {
            this.pageData.pageNumber = num;
            this.onRefreshList();
        },
        changePage1(num){
            this.pageData1.pageNumber = num;
            this.queryCaseNo();
        },
        showType (value) {
            if (value == 1) {
                this.value1 = true;
            } else if (value == 2) {
                this.value2 = true;
            } else if (value == 3) {
                this.value3 = true;
            } else if (value == 4) {
                this.value4 = true;
            } else if (value == 5) {
                this.value5 = true;
            } else if (value == 6) {
                this.value6 = true;
            } else if (value == 7) {
                this.value7 = true;
            } else if (value == 8) {
                this.value8 = true;
            }
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
        showAddModal () {
            this.addModal = true;
            this.addFormSearch.searchValue = '';
            this.caseData = [];
        },
        searchList () {
            this.onRefreshList();
        },
        emptySearchList () {
            this.searchData.caseNo = '';
            this.searchData.courtId = '';
            this.searchData.litigantName = '';
            this.searchData.litigantType = '';
            this.searchData.state = '';
            this.onRefreshList();
        },
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        queryCaseNo () {
            queryCaseNo(this.addFormSearch.searchValue, this.pageData1).then(res => {
                if (res.data.state == 100) {
                    this.caseData = res.data.result.content;
                    this.pageData1.total = res.data.result.totalPages;
                }
            });
        },
        currentRow (currentRow) {
            this.caseInfo.id = currentRow.id;
            findEvidenAbout(currentRow.id).then(res => {
                if (res.data.state == 100) {
                    this.caseInfo.caseNo = res.data.result.evidence.lawCase.caseNo;
                    this.caseInfo.brief = res.data.result.evidence.lawCase.brief.name;
                    this.caseInfo.openCourtTime = res.data.result.openCourtTime;
                    this.caseInfo.openCourtAddress = res.data.result.openCourtAddress;
                    this.caseInfo.expireDate =
            res.data.result.evidence.lawCase.expireDate;
                    this.caseInfo.judge = res.data.result.evidence.lawCase.judge.name;
                    this.caseInfo.clerk = res.data.result.evidence.lawCase.clerk.name;
                    this.caseInfo.applyStandard =
            res.data.result.evidence.lawCase.applyStandard;
                    this.caseInfo.litigantList = [];
                    this.caseInfo.litigantData = [];
                    this.caseInfo.litigantData = res.data.result.litigant;
                    res.data.result.litigant.map(item => {
                        this.caseInfo.litigantList.push(item.litigantName);
                    });
                    this.upEvidenceModal = true;
                    this.evidenceInfo.evidenceId = '';
                } else {
                    this.$Message.error(res.data.message);
                }
            });
        },
        selectLitigant (value) {
            this.caseInfo.litigantData.map(item => {
                if (item.litigantName == value) {
                    this.litigantId = item.id;
                    this.caseInfo.litigantType = item.litigationStatus.name;
                }
            });
            console.log(this.litigantId)
        },
        upEvidenceModalCancel () {
            this.$refs.evidenceUpload.clearFiles();
            this.evidenceInfo.evidenceId = '';
        },
        uploadSuccess (response) {
            if (response.state == 100) {
                this.evidenceInfo.evidenceId = response.result.evidenceId;
            } else {
                this.$Message.error(response.message);
                this.$refs.evidenceUpload.clearFiles();
            }
        },
        addEvidence () {
            this.caseInfo.litigantData.map(item => {
                if (item.litigantName == this.caseInfo.litigant) {
                    this.caseInfo.litigantId = item.id;
                }
            });
            if (this.caseInfo.litigantId == '') {
                this.$Message.error('请选择提交证据的当事人');
                this.changeLoading();
            } else {
                addEvidence(
                    this.evidenceInfo.evidenceId,
                    this.caseInfo.litigantId
                ).then(res => {
                    if (res.data.state == 100) {
                        this.$Message.success(res.data.message);
                        this.upEvidenceModal = false;
                        this.$refs.evidenceUpload.clearFiles();
                    } else {
                        this.$Message.error(res.data.message);
                        this.$refs.evidenceUpload.clearFiles();
                    }
                });
            }
        },
        onRefreshList () {
            queryEvidence(this.searchData, this.pageData).then(res => {
                console.log(this.searchData);
                this.tableData = [];
                if (res.data.state == 100) {
                    let data = res.data.result.content;
                    // this.pageData.total = res.data.result.total;
                    data.map(item => {
                        let contentData = {
                            id: item.id,
                            caseNo: item.caseNo,
                            litigantName: item.litigantName,
                            litigantType: item.name,
                            stage: item.allCheckState == 0 ? '未处理' : '已处理',
                            evidence: item.evidenceAttachments,
                            date: formatDate(new Date(item.submitDate), 'yyyy-MM-dd hh:mm'),
                            state: item.auditStatus == 0 ? '未审核' : '已审核',
                            checkName: item.auditStaff
                        };
                        this.tableData.push(contentData);
                    });
                    this.pageData.total = res.data.result.totalPage;
                }
            });
        },
        passAudit (id) {
            dealAttachMent(id, 1).then(res => {
                if (res.data.state == 100) {
                    this.$Message.success(res.data.message);
                    queryEvidenceDetail(this.detailInfo.id).then(res => {
                        if (res.data.state == 100) {
                            this.detailModal = true;
                            this.detailInfo.caseNo = res.data.result.caseNo;
                            this.detailInfo.brief = res.data.result.briefName;
                            this.detailInfo.openCourtTime = res.data.result.startTime;
                            this.detailInfo.openCourtAddress = res.data.result.startAddress;
                            this.detailInfo.expireDate = res.data.result.filingDate;
                            this.detailInfo.judge = res.data.result.judgeName;
                            this.detailInfo.clerk = res.data.result.clerkName;
                            this.detailInfo.applyStandard = res.data.result.applyStandard;
                            this.detailInfo.litigant = res.data.result.submitPeople;
                            this.detailInfo.litigantType = res.data.result.peopleStatus;
                            this.detailInfo.evidenceList =
                res.data.result.evidenceAttachments;
                        } else {
                            this.$Message.error(res.data.message);
                        }
                    });
                } else {
                    this.$Message.error(res.data.message);
                }
            });
        },
        nopassAudit (id) {
            dealAttachMent(id, 2).then(res => {
                if (res.data.state == 100) {
                    this.$Message.success(res.data.message);
                    queryEvidenceDetail(this.detailInfo.id).then(res => {
                        if (res.data.state == 100) {
                            this.detailModal = true;
                            this.detailInfo.caseNo = res.data.result.caseNo;
                            this.detailInfo.brief = res.data.result.briefName;
                            this.detailInfo.openCourtTime = res.data.result.startTime;
                            this.detailInfo.openCourtAddress = res.data.result.startAddress;
                            this.detailInfo.expireDate = res.data.result.filingDate;
                            this.detailInfo.judge = res.data.result.judgeName;
                            this.detailInfo.clerk = res.data.result.clerkName;
                            this.detailInfo.applyStandard = res.data.result.applyStandard;
                            this.detailInfo.litigant = res.data.result.submitPeople;
                            this.detailInfo.litigantType = res.data.result.peopleStatus;
                            this.detailInfo.evidenceList =
                res.data.result.evidenceAttachments;
                        } else {
                            this.$Message.error(res.data.message);
                        }
                    });
                } else {
                    this.$Message.error(res.data.message);
                }
            });
        },
        submitEvidence () {
            if (this.detailInfo.auditStatus != 0) {
                this.changeLoading();
                this.detailModal = false;
            } else {
                dealEvidenceAbout(this.detailInfo.id, 1).then(res => {
                    if (res.data.state == 100) {
                        this.changeLoading();
                        this.$Message.success(res.data.message);
                        this.detailModal = false;
                        this.onRefreshList();
                    } else {
                        this.changeLoading();
                        this.$Message.error(res.data.message);
                    }
                });
            }
        }
    },
    filters: {
        formatDate (time) {
            if (time == '') {
                return '';
            }
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd');
        },
        whether (boole) {
            return boole ? '是' : '否';
        },
        filCheck (boole) {
            return boole == 0 ? '未确认' : '已确认';
        },
        formatStartDate (time) {
            if (time == '') {
                return '';
            }
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    }
};
</script>

<style lang="less">
.search-wrapper {
  margin-bottom: 10px;
}
.search-form .ivu-form-item {
  margin-bottom: 10px;
}
.btn-group .ivu-form-item {
  margin-bottom: 0px;
}
.table-btn-group {
  padding-bottom: 15px;
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
.titleType {
  height: 30px;
  background-color: #f8f8f9;
  border-bottom: 1px solid #e9eaec;
  border-top: 1px solid #e9eaec;
  margin-left: -8px;
  line-height: 30px;
  padding-left: 8px;
}
</style>
