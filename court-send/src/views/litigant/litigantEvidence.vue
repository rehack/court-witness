<template>
  <div>
    <Card>
      <div class="searchWrapper">
        <h2 style="float: left">案件列表</h2>
        <div class="searchForm" style="float: right">
          <Input v-model="searchData.caseNo" placeholder="请输入案号" style="width: 300px"></Input>
          <Button type="primary" icon="ios-search" @click="search">搜索</Button>
        </div>
      </div>
      <Table stripe :columns="columns" :data="tableData"></Table>
    </Card>
    <Modal
        v-model="upEvidenceModal"
        width="800px"
        ok-text="上传"
        cancel-text="取消"
        @on-cancel="upEvidenceModalCancel"
        @on-ok="addEvidence"
        :loading="loading"
        title="材料上传">
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
                <td>材料提交人</td>
                <td>
                  <span> {{ caseInfo.litigantName }} </span>
                </td>
                <td>诉讼地位</td>
                <td>
                  <span> {{ caseInfo.litigantType }} </span>
                </td>
            </tr>
            <tr>
              <td>材料：</td>
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
                <div style="font-size:12px">(文件格式支持：doc、docx、xls、xlsx、jpg、png、jpeg、bmp)</div>
                <div class="pic_upload_list" v-show="value1">
                    <div class="titleType"> 证据</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId ? this.litigantId : '',lawyerId:this.lawyerId ? this.lawyerId : '', evidenceId: this.evidenceInfo.evidenceId,uploadType:1}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传材料文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value2" >
                    <div class="titleType"> 答辩状</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload2"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId ? this.litigantId : '',lawyerId:this.lawyerId ? this.lawyerId : '', evidenceId: this.evidenceInfo.evidenceId,uploadType:2}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传答辩状文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value3">
                    <div class="titleType"> 起诉状</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload3"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId ? this.litigantId : '',lawyerId:this.lawyerId ? this.lawyerId : '', evidenceId: this.evidenceInfo.evidenceId,uploadType:3}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传起诉状文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value4">
                    <div class="titleType"> 反诉状</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload4"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId ? this.litigantId : '',lawyerId:this.lawyerId ? this.lawyerId : '', evidenceId: this.evidenceInfo.evidenceId,uploadType:4}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传反诉状文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value5">
                    <div class="titleType"> 调查取证申请书</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload5"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId ? this.litigantId : '',lawyerId:this.lawyerId ? this.lawyerId : '', evidenceId: this.evidenceInfo.evidenceId,uploadType:5}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传调查取证申请书</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value6">
                    <div class="titleType"> 证人出庭申请书</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload6"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId ? this.litigantId : '',lawyerId:this.lawyerId ? this.lawyerId : '', evidenceId: this.evidenceInfo.evidenceId,uploadType:6}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传证人出庭申请书</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value7">
                    <div class="titleType"> 证据目录</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload7"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId ? this.litigantId : '',lawyerId:this.lawyerId ? this.lawyerId : '', evidenceId: this.evidenceInfo.evidenceId,uploadType:7}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传证据目录文件</Button>
                    </myUpload>
                </div>
                <div class="pic_upload_list"  v-show="value8">
                    <div class="titleType"> 其他</div>
                    <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload8"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.caseInfo.id,litigantId:this.litigantId ? this.litigantId : '',lawyerId:this.lawyerId ? this.lawyerId : '', evidenceId: this.evidenceInfo.evidenceId,uploadType:8}"
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
        ok-text="关闭"
        title="材料详情">
        <table class="bookbuilding-table" cellspacing="0" cellpadding="0" border="0" v-for="item in detailInfoList">
            <tr>
                <td>案号</td>
                <td>
                  <span>{{ item.lawCase.caseNo }}</span>
                </td>
                <td>提交时间</td>
                <td>
                  <span>{{ item.submitDate | formatStartDate }}</span>
                </td>
            </tr>
            <tr v-for="(item, index) in item.evidenceAttachments">
              <td>材料{{ index + 1 }}：</td>
              <td colspan="3">
                <span>
                  <a style="margin-right: 19px;" :href="'/api/court/evidenceManage/downAttachMent.jhtml?attachId='+item.id">{{ item.name }}</a>
                </span>
              </td>
            </tr>
        </table>
    </Modal>
  </div>
</template>

<script>
import myUpload from '@/components/upload';
import { litigantLawCaseList } from '@/api/litigantAPI/caseInfo.js';
import {
    findEvidenAbout,
    addEvidence,
    queryEvidenceDetail
} from '@/api/litigantAPI/evidence.js';
import { formatDate } from '@/libs/date';
export default {
    components: {
        myUpload: myUpload
    },
    data () {
        return {
            loading: true,
            upEvidenceModal: false,
            detailModal: false,
            fileType: '',
            litigantId:'',
            lawyerId:'',
            value1: false,
            value2: false,
            value3: false,
            value4: false,
            value5: false,
            value6: false,
            value7: false,
            value8: false,
            searchData: {
                caseNo: ''
            },
            pageData: {
                pageNumber: 1,
                pageSize: 10
            },
            columns: [
                {
                    title: '案号',
                    key: 'caseNo',
                    align: 'center',
                    width: 180
                },
                {
                    title: '案由',
                    key: 'briefName',
                    align: 'center',
                    width: 150
                },
                {
                    title: '开庭日期',
                    key: 'stateDate',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            formatDate(new Date(params.row.stateDate), 'yyyy-MM-dd hh:mm')
                        );
                    }
                },
                {
                    title: '开庭地址',
                    key: 'address',
                    align: 'center',
                    width: 250
                },
                {
                    title: '审判员',
                    key: 'judgeName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '书记员',
                    key: 'clerkName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '原告',
                    key: 'plaintiffName',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        if (params.row.plaintiffName == null) {
                            return h('span', {}, '无');
                        } else {
                            return h('span', {}, params.row.plaintiffName);
                        }
                    }
                },
                {
                    title: '被告',
                    key: 'defendantName',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        if (params.row.defendantName == null) {
                            return h('span', {}, '无');
                        } else {
                            return h('span', {}, params.row.defendantName);
                        }
                    }
                },
                {
                    title: '第三人',
                    key: 'thirdPeopleName',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        if (params.row.thirdPeopleName == null) {
                            return h('span', {}, '无');
                        } else {
                            return h('span', {}, params.row.thirdPeopleName);
                        }
                    }
                },
                {
                    title: '立案日期',
                    key: 'filingDate',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            formatDate(new Date(params.row.filingDate), 'yyyy-MM-dd')
                        );
                    }
                },
                // {
                //     title: '庭审阶段',
                //     key: 'phase',
                //     align: 'center',
                //     width: 100
                // },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    align: 'center',
                    width: 100,
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
                                                console.log(res);
                                                if (res.data.state == 100) {
                                                    if (res.data.result.length == 0) {
                                                        this.$Message.error('该案件没有证据详情');
                                                    } else {
                                                        this.detailModal = true;
                                                        this.detailInfoList = res.data.result;
                                                    }
                                                } else {
                                                    this.$Message.error(res.data.message);
                                                }
                                            });
                                        }
                                    }
                                },
                                '查看详情'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            findEvidenAbout(params.row.id).then(res => {
                                                if (res.data.state == 100) {
                                                    console.log(555)
                                                    if(res.data.result.litigant){
                                                    this.litigantId = res.data.result.litigant.id;
                                                    this.caseInfo.litigantName =
                                                        res.data.result.litigant.litigantName;
                                                    this.caseInfo.litigantType =
                                                        res.data.result.litigant.litigationStatus.name;
                                                    this.caseInfo.litigantId =
                                                        res.data.result.litigant.id;
                                                    }else if(res.data.result.lawyer){
                                                        this.caseInfo.litigantName = res.data.result.lawyer.agentName;
                                                        this.caseInfo.litigantType = '律师';
                                                        this.lawyerId = res.data.result.lawyer.id;
                                                    }
                                                    this.caseInfo.id = params.row.id;
                                                    this.caseInfo.caseNo =
                                                        res.data.result.evidence.lawCase.caseNo;
                                                    this.caseInfo.brief =
                                                        res.data.result.evidence.lawCase.brief.name;
                                                    this.caseInfo.expireDate =
                                                         res.data.result.evidence.lawCase.expireDate;
                                                    this.caseInfo.judge =
                                                        res.data.result.evidence.lawCase.judge.name;
                                                    this.caseInfo.clerk =
                                                        res.data.result.evidence.lawCase.clerk.name;
                                                    this.caseInfo.applyStandard =
                                                        res.data.result.evidence.lawCase.applyStandard;
                                                    this.caseInfo.openCourtTime =
                                                        res.data.result.openCourtTime;
                                                    this.caseInfo.openCourtAddress =
                                                        res.data.result.openCourtAddress;
                                                    this.upEvidenceModal = true;
                                                    this.$refs.evidenceUpload.clearFiles();
                                                    this.$refs.evidenceUpload2.clearFiles();
                                                    this.$refs.evidenceUpload3.clearFiles();
                                                    this.$refs.evidenceUpload4.clearFiles();
                                                    this.$refs.evidenceUpload5.clearFiles();
                                                    this.$refs.evidenceUpload6.clearFiles();
                                                    this.$refs.evidenceUpload7.clearFiles();
                                                    this.$refs.evidenceUpload8.clearFiles();
                                                    this.fileType = '';
                                                    this.value1 = false;
                                                    this.value2 = false;
                                                    this.value3 = false;
                                                    this.value4 = false;
                                                    this.value5 = false;
                                                    this.value6 = false;
                                                    this.value7 = false;
                                                    this.value8 = false;
                                                } else {
                                                    this.$Message.error(res.data.message);
                                                }
                                            });
                                        }
                                    }
                                },
                                '上传材料'
                            )
                        ]);
                    }
                }
            ],
            tableData: [],
            stepList: [],
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
                litigantName: '',
                litigantType: '',
                litigantId: ''
            },
            detailInfoList: [],
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
                litigantName: '',
                litigantType: '',
                litigantId: '',
                auditStatus: ''
            },
            evidenceInfo: {
                evidenceId: ''
            }
        };
    },
    created () {
        this.getList();
    },
    methods: {
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
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
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
            }
        },
        addEvidence () {
            addEvidence(this.evidenceInfo.evidenceId, this.caseInfo.litigantId).then(
                res => {
                    if (res.data.state == 100) {
                        this.$Message.success(res.data.message);
                        this.upEvidenceModal = false;
                        this.$refs.evidenceUpload.clearFiles();
                    } else {
                        this.$Message.error(res.data.message);
                    }
                }
            );
        },
        search () {
            this.getList();
        },
        getList () {
            this.tableData = [];
            litigantLawCaseList(this.searchData.caseNo, this.pageData).then(res => {
                if (res.data.state == 100) {
                    // this.tableData = res.data.result.content;
                    res.data.result.content.map(item => {
                        const data = {};
                        data.id = item.lawCaseId; 
                        data.caseNo = item.caseNo;
                        data.briefName = item.brief;
                        data.stateDate = item.startTime;
                        data.address = item.address;
                        data.judgeName = item.judgeName;
                        data.clerkName = item.clerkName;
                        // var yStr = "";
                        // var bStr = "";
                        // var sstr = "";
                        // for(var m=0;m<item.litigants.length;m++){
                        //     if(item.litigants[m].litigationStatus.name=="原告"){
                        //         yStr = yStr + item.litigants[m].litigantName + "、";
                        //     }else if(item.litigants[m].litigationStatus.name=="被告"){
                        //         bStr = bStr + item.litigants[m].litigantName + "、";
                        //     }else if(item.litigants[m].litigationStatus.name=="第三人"){
                        //         sstr = sstr + item.litigants[m].litigantName + "、";
                        //     }
                        // }

                        // data.plaintiffName =  yStr.substring(0,yStr.length-1);;
                        // data.defendantName = bStr.substring(0,bStr.length-1);
                        // data.thirdPeopleName = sstr.substring(0,sstr.length-1);
                        data.defendantName = item.beigaoName;
                        data.plaintiffName = item.yuangaoName;
                        data.thirdPeopleName = item.disanrenName;
                        data.filingDate = item.filingDate;
                        data.phase = "";
                        this.tableData.push(data);
                    })
                } else {
                    this.$Message.error(res.data.message);
                }
            });
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
.searchWrapper {
  height: 30px;
  margin-bottom: 15px;
  padding: 0px 10px;
}
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
  margin-bottom: 10px;
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
