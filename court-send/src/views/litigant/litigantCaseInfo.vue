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
        v-model="showStep"
        width="630"
        ok-text="关闭"
        title="案件进展详情">
        <mySteps :current="2" direction="vertical" v-show="stepList.length > 0">
            <myStep v-for="(item, index) in stepList" :icon="index == 0 ? 'compose' : '' " :status="index == 0 ? 'process' : 'finish'" :title="item.createDate | formatStartDate" :content="item.operatorContent" :people="item.operatorName"></myStep>
        </mySteps>
        <div v-show="stepList.length == 0" style="text-align: center;color:#999;">
          暂无数据
        </div>
    </Modal>
    <Modal
        v-model="showSend"
        width="950"
        ok-text="关闭"
        @on-ok="showSendDetail = false"
        @on-cancel="showSendDetail = false"
        title="送达详情">
        <Row>
          <Col span="5">
            <ButtonGroup vertical>
                <Button v-if="item.current.length != 0" v-for="(item,index) in litigantSendList" type="ghost" @click="selectLitigant(index)" :key="index">
                  {{ item.current.litigationStatusName }}: {{ item.current.litigantName }} <br>
                  送达方式：{{ item.current.sendType | formatSendType }}
                </Button>
                <Row v-if="item.current.length == 0" v-for="(item,index) in litigantSendList"> {{ item.other[0].litigantName }} 无当前送达详情</Row>
            </ButtonGroup>
          </Col>
          <Col span="19" v-show="showSendDetail">
            <Row>
                <Col span="3" style="text-align: right; padding-right: 5px">
                    姓名：
                </Col>
                <Col span="5">
                    {{ selectSendInfo.litigantName }}
                </Col>
                <Col span="3" style="text-align: right; padding-right: 5px">
                    联系电话：
                </Col>
                <Col span="5">
                    {{ selectSendInfo.litigantPhone }}
                </Col>
                <Col span="3" style="text-align: right; padding-right: 5px">
                    送达方式：
                </Col>
                <Col span="5">
                    {{ selectSendInfo.sendType | formatSendType }}
                </Col>
            </Row>
            <Row>
                <Col span="3" style="text-align: right; padding-right: 5px">
                    文书列表：
                </Col>
                <Col v-if="selectSendInfo.diplomsName" span="21">
                    {{ selectSendInfo.diplomsName.split(',').join('、') }}
                </Col>
            </Row>
            <Row>
                <Col span="3" style="text-align: right; padding-right: 5px">
                    {{ selectSendInfo.sendType == 3 ? '收件地址' : '邮箱地址' }}：
                </Col>
                <Col span="21">
                    {{ selectSendInfo.sendType == 3 ? selectSendInfo.sendAddress : selectSendInfo.email }}
                </Col>
            </Row>
            <Row v-if="selectSendInfo.sendType == 3">
                <Col span="3" style="text-align: right; padding-right: 5px">
                    快递单号：
                </Col>
                <Col span="21">
                    {{ selectSendInfo.oddNumbers }}
                </Col>
            </Row>
            <Row v-if="selectSendInfo.sendType == 3">
                <Col span="3" style="text-align: right; padding-right: 5px">
                    物流信息：
                </Col>
                <Col v-if="selectSendInfo.logisticsInfo" span="21">
                    <p v-for="(p, key) in selectSendInfo.logisticsInfo.split(';')" :key="key" v-show="!key || lc" @click="!key && (lc = !lc)">
                        <span style="color: #4e576b">{{ p.split('|')[0] }} &nbsp;&nbsp;</span>
                        {{ p.split('|')[1] }}
                        <Icon v-if="!key" type="arrow-down-b"></Icon>
                    </p>
                    <p v-if="!selectSendInfo.logisticsInfo.split(';').length">'暂无信息</p>
                </Col>
            </Row>
            <Row>
                <Col span="3" style="text-align: right; padding-right: 5px">
                    送达情况：
                </Col>
                <Col span="21">
                    <span :style="{color: sendStates[selectSendInfo.sendState + 1].c}">{{ (selectSendInfo.sendState !== 0 && !selectSendInfo.sendState) ? '未发送' : sendStates[selectSendInfo.sendState + 1].s }}</span>
                </Col>
            </Row>
            <Row v-if="selectSendInfo.sendHistory">
                <Col span="3" style="text-align: right; padding-right: 5px">
                    发送记录：
                </Col>
                <Col span="21">
                    <Row v-for="(sh, key) in selectSendInfo.sendHistory" :key="key">
                        <Col span="6">{{ sh.modifyDate | formatStartDate }}</Col>
                        <Col span="5">{{ sh.sendType | formatSendType }}</Col>
                        <Col span="7">{{ ((sh.sendState !== 0 && !sh.sendState) ? '未发送' : sendStates[sh.sendState + 1].s) }}</Col>
                    </Row>
                </Col>
            </Row>
          </Col>
        </Row>
    </Modal>
  </div>
</template>

<script>
import myStep from '@/components/step';
import mySteps from '@/components/steps';
import {
    litigantLawCaseList,
    queryDiplomsSendList
} from '@/api/litigantAPI/caseInfo.js';
import { queryProcessNote } from '@/api/global.js';
import { formatDate } from '@/libs/date';

export default {
    components: {
        mySteps: mySteps,
        myStep: myStep
    },
    data () {
        return {
            sendStates: [
                { s: '取消', c: '#495060' },
                { s: '送达中', c: '#2d8cf0' },
                { s: '已送达成功', c: '#19be6b' },
                { s: '送达失败！', c: '#ed3f14' }
            ],
            sendTypes: [
                '现场领取',
                'ems送达',
                '工作人员上门送达',
                '电子邮件送达',
                '公告',
                'H5确认阅读'
            ],
            showStep: false,
            showSend: false,
            showSendDetail: false,
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
                                            queryDiplomsSendList(params.row.id).then(res => {
                                                if (res.data.state == 100) {
                                                    if (res.data.result.length == 0) {
                                                        this.$Message.error('查无送达数据');
                                                    } else {
                                                        this.showSend = true;
                                                        this.litigantSendList = res.data.result;
                                                    }
                                                } else {
                                                    this.$Message.error(res.data.message);
                                                }
                                            });
                                        }
                                    }
                                },
                                '送达详情'
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
                                            queryProcessNote(params.row.id).then(res => {
                                                if (res.data.state == 100) {
                                                    this.stepList = res.data.result;
                                                    this.showStep = true;
                                                } else {
                                                    this.$Message.error(res.data.message);
                                                }
                                            });
                                        }
                                    }
                                },
                                '案件进展'
                            )
                        ]);
                    }
                }
            ],
            tableData: [],
            stepList: [],
            litigantSendList: [],
            selectSendInfo: {
                litigantName: '',
                litigantPhone: '',
                sendType: '',
                diplomsName: '',
                sendAddress: '',
                email: '',
                oddNumbers: '',
                logisticsInfo: '',
                sendState: '',
                sendHistory: []
            }
        };
    },
    created () {
        this.getList();
    },
    methods: {
        search () {
            this.getList();
        },
        getList () {
            litigantLawCaseList(this.searchData.caseNo, this.pageData).then(res => {
                if (res.data.state == 100) {
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

                       data.defendantName = item.beigaoName;
                        data.plaintiffName = item.yuangaoName;
                        data.thirdPeopleName = item.disanrenName;
                     
                        // data.plaintiffName =  yStr.substring(0,yStr.length-1);;
                        // data.defendantName = bStr.substring(0,bStr.length-1);
                        // data.thirdPeopleName = sstr.substring(0,sstr.length-1);
                        data.filingDate = item.filingDate;
                        data.phase = "";
                        this.tableData.push(data);
                    })
                } else {
                    this.$Message.error(res.data.message);
                }
            });
        },
        selectLitigant (index) {
            this.selectSendInfo.litigantName = this.litigantSendList[
                index
            ].current.litigantName;
            this.selectSendInfo.litigantPhone = this.litigantSendList[
                index
            ].current.litigantPhone;
            this.selectSendInfo.sendType = this.litigantSendList[
                index
            ].current.sendType;
            this.selectSendInfo.diplomsName = this.litigantSendList[
                index
            ].current.diplomsName;
            this.selectSendInfo.sendAddress = this.litigantSendList[
                index
            ].current.sendAddress;
            this.selectSendInfo.email = this.litigantSendList[index].current.email;
            this.selectSendInfo.oddNumbers = this.litigantSendList[
                index
            ].current.oddNumbers;
            this.selectSendInfo.logisticsInfo = this.litigantSendList[
                index
            ].current.logisticsInfo;
            this.selectSendInfo.sendState = this.litigantSendList[
                index
            ].current.sendState;
            this.selectSendInfo.sendHistory = this.litigantSendList[index].other;
            this.showSendDetail = true;
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
        },
        formatSendType (val) {
            if (val == 0) {
                return '现场领取';
            } else if (val == 1) {
                return 'EMS送达';
            } else if (val == 2) {
                return '工作人员上门送达';
            } else if (val == 3) {
                return '电子邮件送达';
            } else {
                return 'H5确认阅读';
            }
        }
    }
};
</script>

<style lang="css">
.searchWrapper {
  height: 30px;
  margin-bottom: 15px;
  padding: 0px 10px;
}
</style>
