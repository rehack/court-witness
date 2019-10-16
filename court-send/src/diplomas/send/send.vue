<template>
    <div class="layoutM" ref="layout">
        <Card class="cardItem" v-show="cardItemShow">
            <p slot="title">
                <Icon type="wrench"></Icon>
                案件搜索
            </p>
            <div style="margin-bottom: 16px">
                <Form :label-width="60">
                    <FormItem label="案号">
                        <Input v-model="caseNo" placeholder="请输入案号"></Input>
                    </FormItem>
                    <FormItem label="原告姓名">
                        <Input v-model="plaintiffName"></Input>
                    </FormItem>
                    <FormItem label="被告姓名">
                        <Input v-model="defendantName"></Input>
                    </FormItem>
                    <Button type="info" :loading="queryLoading" @click="queryCase" long>
                        <span v-if="!queryLoading">查询</span>
                        <span v-else></span>
                    </Button>
                </Form>
            </div>
            <ButtonGroup vertical>
                <Button v-for="(item, key) in caseList" type="ghost" :key="key" v-show="parseInt(key/10) === (caseP - 1)" @click="showLeft(item.id)" class="caseBtn">
                    <p>
                        <Tooltip :content="item.caseNo">
                            案号：{{ item.caseNo }}
                        </Tooltip>
                    </p>
                    <p>
                        <Tooltip :content="'案由：' + item.briefName + '|' + item.litigantName">
                            案由：{{ item.briefName }} | {{ item.litigantName }}
                        </Tooltip>
                    </p>
                </Button>
            </ButtonGroup>
            <Page v-if="caseList.length > 10" :current="caseP" @on-change="changePage" :total="caseList.length" style="padding-left: 28px;padding-top: 10px" simple></Page>
        </Card>

        <Card v-show="caseInfoShow">
            <p slot="title">
                案件信息
                <span class="case-finish" @click="caseFinish">案件送达完成</span>
            </p>
            <div class="maininfo-warp">
                <Spin size="large" fix v-if="caseLoading"></Spin>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案号
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo.caseNo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案件名称
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo.caseName }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        原告姓名
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo.plaintiffName }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        被告姓名
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo.defendantName }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码(原告)
                    </Col>
                    <Col span="9" class="maininfo-col">
                      {{ caseInfo.plaintiffPhone }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码(被告)
                    </Col>
                    <Col span="9" class="maininfo-col">
                      {{ caseInfo.defendantPhone }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                      证件号码(原告)
                    </Col>
                    <Col span="9" class="maininfo-col">
                      {{ caseInfo.plaintiffIdentityCard }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        证件号码(被告)
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo.defendantIdentityCard }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        建档时间
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ formatDate(new Date(caseInfo.filingDate), 'yyyy-MM-dd') }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        完结时间
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo.closeDate && formatDate(new Date(caseInfo.closeDate), 'yyyy-MM-dd') }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案由
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo.briefName }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案件金额
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo.applyStandard }}元
                    </Col>
                </Row>
            </div>

        </Card>
        <Card v-if="sendInfo.length" style="margin-top: 10px">
            <p slot="title">
                送达详情
            </p>
            <Spin size="large" fix v-if="infoLoading"></Spin>
            <div v-for="(item, key) in sendInfo" :key="key" class="send-info">
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        {{ item.current.litigationStatusName }}姓名：
                    </Col>
                    <Col span="5">
                        {{ item.current.litigantName }}
                    </Col>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        联系电话：
                    </Col>
                    <Col span="5">
                        {{ item.current.litigantPhone }}
                    </Col>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        送达方式：
                    </Col>
                    <Col span="5">
                        {{ sendTypes[item.current.sendType] }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        文书列表：
                    </Col>
                    <Col v-if="item.current.diplomsName" span="21">
                        {{ item.current.diplomsName.split(',').join('、') }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        {{ sendTypes[item.current.sendType] !== '电子邮件送达' ? '收件地址' : '邮箱地址' }}：
                    </Col>
                    <Col span="21">
                        {{ sendTypes[item.current.sendType] !== '电子邮件送达' ? item.current.sendAddress : item.current.email }}
                    </Col>
                </Row>
                <Row v-if="sendTypes[item.current.sendType] == 'EMS送达'">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        快递单号：
                    </Col>
                    <Col span="21">
                        {{ item.current.oddNumbers }}
                    </Col>
                </Row>
                <Row v-if="sendTypes[item.current.sendType] == 'EMS送达'">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        物流信息：
                    </Col>
                    <Col v-if="item.current.logisticsInfo" span="21">
                        <p v-for="(p, key) in item.current.logisticsInfo.split(';')" :key="key" v-show="!key || lc" @click="!key && (lc = !lc)">
                            <span style="color: #4e576b">{{ p.split('|')[0] }} &nbsp;&nbsp;</span>
                            {{ p.split('|')[1] }}
                            <Icon v-if="!key" type="arrow-down-b"></Icon>
                        </p>
                        <p v-if="!item.current.logisticsInfo.split(';').length">'暂无信息</p>
                    </Col>
                </Row>
               <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        送达情况：
                    </Col>
                    <Col span="21">
                        <span :style="{ color: sendStates[1].c }">{{ (item.current.sendState !== 0 && !item.current.sendState) ? '未发送' : sendStates[item.current.sendState + 1].s }}</span>
                        <Button v-if="(item.current.sendState - 0) === 0 && !item.current.logisticsInfo && item.current.oddNumbers" @click="cancelExp(item.current.oddNumbers)" type="warning">
                            取消发送
                        </Button>
                        <Button v-if="(item.current.sendState - 0) === 2" @click="sendAgain(item.current)" type="info">
                            再次发送
                        </Button>
                        <Button v-if="(item.current.sendState - 0) === 0 && item.current.sendType === 0" @click="confirmSend(caseInfo.id, item.current.litigantId)" :loading="confirmSendLoading" type="success">
                            确认领取
                        </Button>
                    </Col>
                </Row>
                <Row v-if="item.sendHistory">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        历史记录：
                    </Col>
                    <Col span="21">
                        <p v-for="(sh, key) in item.sendHistory" :key="key">
                            {{ formatDate(new Date(sh.sendDate), 'yyyy年MM月dd日 hh:mm') + '  ' + sendTypes[sh.sendType] + '  ' + ((sh.sendState !== 0 && !sh.sendState) ? '未发送' : sendStates[sh.sendState + 1].s) }}
                        </p>
                    </Col>
                </Row>
            </div>
        </Card>
        <Modal
            v-model="sendAgainModel"
            title="再次发送文书"
            width="720"
            ok-text="发送"
            cancel-text="取消"
            @on-ok="ok"
            @on-cancel="cancel">
            <div class="send-info" style="border: none">
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        {{ sa.litigationStatusName }}姓名：
                    </Col>
                    <Col span="5">
                        <Input v-model="sa.litigantName" placeholder="姓名不能为空" style="width: 100%"></Input>
                    </Col>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        联系电话：
                    </Col>
                    <Col span="5">
                        <Input v-model="sa.litigantPhone" placeholder="联系电话不能为空" style="width: 100%"></Input>
                    </Col>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        送达方式：
                    </Col>
                    <Col span="5">
                        <Select v-model="sa.sendType" style="width:100%">
                            <Option v-for="(st, key) in sendTypes" :value="key" :key="key">{{ st }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        文书列表：
                    </Col>
                    <Col span="21">
                        <CheckboxGroup v-if="sa.diplomsName" v-model="sa.dips">
                            <Checkbox v-for="(d, key) in sa.diplomsName.split(',')" :label="d" :key="key"></Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        <span style="color: #ed3f14" v-show="sendTypes[sa.sendType] === '电子邮件送达'">*</span>
                        邮箱地址：
                    </Col>
                    <Col span="18">
                        <Input v-model="sa.email" style="width: 100%"></Input>
                    </Col>
                </Row>
                <Row v-if="sa.sendType === 3">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        邮件模板：
                    </Col>
                    <Col span="10">
                        <Select v-model="etListKey" @on-change="tpChange" style="width:100%">
                            <Option v-for="(t, key) in etList" :value="key" :key="key">{{ t.name }}</Option>
                            <Page v-if="etTotal > 10" :current="etPage" @on-change="changeET" :total="etTotal" simple></Page>
                        </Select>
                    </Col>
                </Row>
                <Row v-if="sa.sendType === 3">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        模板内容：
                    </Col>
                    <Col span="12">
                        <div style="padding: 5px 6px;">
                            {{ emailContent }}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        <span style="color: #ed3f14" v-show="sendTypes[sa.sendType] !== '电子邮件送达'">*</span>
                        收件地址：
                    </Col>
                    <Col span="18">
                        <Input v-model="sa.sendAddress" style="width: 100%"></Input>
                    </Col>
                </Row>
                <Row v-if="sa.sendType !== 3">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        快递单号：
                    </Col>
                    <Col span="9">
                        <Input v-model="sa.oddNumbers" style="width: 100%"></Input>
                    </Col>
                    <Col span="3">
                        <Button type="info" @click="print(sa)" long>快递单打印</Button>
                    </Col>
                </Row>
            </div>
        </Modal>
    </div>
</template>
<script>
import { getBrief, queryCase } from '../../api/global.js';
import { getSendInfo, cancelExp, sendME, confirm, lawCaseSendComplete } from '../../api/send.js';
import { formatDate } from '../../libs/date.js';
import { senList } from '../../api/templante.js';
export default {
    data () {
        //         状态-1：取消，0：送达中，1：已送达成功，2：未外送达成功
        //         送达类型：0：现场领取，1：ems送达，2：工作人员上门送达，3：邮件送达，4：公告  5:H5确认阅读
        const sendStates = [{s: '取消', c: '#495060'}, {s: '送达中', c: '#2d8cf0'}, {s: '已送达成功', c: '#19be6b'}, {s: '送达失败！', c: '#ed3f14'}];
        const sendTypes = ['现场领取', 'EMS送达', '工作人员上门送达', '电子邮件送达', '公告', 'H5确认阅读'];
        return {
            nn: 1,
            caseId: null, // 页面当前案件ID
            courtTotal: null, // 页面当前案件总开庭次数，开庭次数等同于送达批数
            caseP: 1,
            lc: true,
            cardItemShow: true,
            sendAgainModel: false,
            // loading
            queryLoading: false,
            caseLoading: false,
            infoLoading: false,
            confirmSendLoading: false,
            // filter1: '',
            // dateRange: '',
            // briefName: '',
            // briefList: [],
            caseNo: '',
            plaintiffName: '',
            defendantName: '',
            value1: '1',
            caseList: [],
            etList: [], // 短信模板列表
            etTotal: 0,
            etPage: 0,
            etListKey: '',
            emailContent: '',
            caseInfo: {},
            caseInfoShow: false,
            sendInfo: [],
            info: [],
            sa: '',
            sendTypes: sendTypes,
            sendStates: sendStates
        };
    },
    mounted () {
        if (this.$route.params) {
            var caseId = this.$route.params.lawCaseId;
            if (caseId) {
                this.showLeft(caseId);
            }
        }
        // this.getBrief();
    },
    methods: {
        // 获取案由
        getBrief () {
            var that = this;
            getBrief().then(res => {
                var data = res.data;
                if (data.state == 100) {
                    that.briefList = data.result;
                }
            }).catch(() => {
                that.$Message.error('网络错误，获取案由列表失败。');
                that.saved = false;
            });
        },
        showLeft (caseId) {
            this.getCaseInfo(caseId);
        },
        getCaseInfo (caseId, n) {
            var that = this;
            that.caseLoading = true;
            this.sendInfo = [];
            getSendInfo(caseId, n).then(res => {
                var data = res.data;
                if (data.state == 100) {
                    this.caseInfoShow = true
                    this.caseInfo = data.result;
                    for (let i = 0; i < data.result.sendNote.length; i++) {
                        let object = {
                            current: {},
                            sendHistory: []
                        }
                        data.result.sendNote[i].litigantSendNote.map(item => {
                            if (item.currentType || item.currentType == null) {
                                object.current = item
                            } else {
                                object.sendHistory.push(item)
                            }
                        })
                        this.sendInfo.push(object)
                    }
                //     var cts = []; // currentType == true, 的对象数组集合
                //     // 整理出currentType为true的数据
                //     for (let i = 0; i < r.length; i++) {
                //         const el = r[i];
                //         if (el.currentType) {
                //             cts.push(el);
                //         }
                //     }
                //     // 将currentType不为true的数据放入cts中同一当事人的数据对象
                //     for (let i = 0; i < r.length; i++) {
                //         const el = r[i];
                //         if (!el.currentType) {
                //             for (let j = 0; j < cts.length; j++) {
                //                 const ct = cts[j];
                //                 if (ct.litigantId === el.litigantId) {
                //                     !ct.sendHistory && (ct.sendHistory = []);
                //                     ct.sendHistory.push(el);
                //                 }
                //             }
                //         }
                //     }
                //     that.sendInfo = cts;
                //     that.caseId = r[0].id;
                } else {
                    that.$Message.info('案件详情查询:' + data.message);
                }
                that.caseLoading = false;
            }).catch(() => {
                that.$Message.error('网络错误，查询案件详情失败。');
                that.caseLoading = false;
            });
            // queryCaseInfo(caseId).then(res => {
            //     var data = res.data;
            //     if (data.state - 0 === 100) {
            //         that.caseInfo = data.result;
            //     } else {
            //         that.$Message.info('案件详情查询:' + data.message);
            //     }
            //     that.caseLoading = false;
            // }).catch(() => {
            //     that.$Message.error('网络错误，查询案件详情失败。');
            //     that.caseLoading = false;
            // });
        },
        queryCase () {
            var that = this;
            that.queryLoading = true;
            queryCase(that.caseNo, that.plaintiffName, that.defendantName).then(res => {
                var data = res.data;
                if (data.state - 0 === 100) {
                    that.caseList = data.result;
                } else {
                    that.$Message.info(data.message);
                }
                that.queryLoading = false;
            }).catch(() => {
                that.$Message.error('网络错误，查询失败。');
                that.queryLoading = false;
            });
        },
        handleCheckAll () {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                for (let i = 0; i < this.diplist.length; i++) {
                    const el = this.diplist[i];
                    this.diplist[i].checked = true;
                    this.dipChecked.push(el.name);
                }
            } else {
                for (let i = 0; i < this.diplist.length; i++) {
                    this.diplist[i].checked = false;
                }
                this.dipChecked = [];
            }
        },
        dipCheckedChange (data) {
            if (data.length === 8) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        dipshow () {
            if (this.dipChecked.length) {
                this.index = this.dipChecked[0];
                this.modal1 = true;
            } else {
                this.$Message.error('未选择文书');
            }
        },
        formatDate (d, fmt) {
            return formatDate(d, fmt);
        },
        changePage (p) {
            this.caseP = p;
        },
        cancelExp (pi) {
            var that = this;
            cancelExp(pi).then(res => {
                this.getCaseInfo(caseInfo.id);
                that.$Message.info(data.message);
            }).catch(() => {
                that.$Message.error('网络错误，查询失败。');
            });
        },
        changeET (p) {
            var that = this;
            senList(1, p).then(res => {
                var data = res.data;
                if (data.state === 100) {
                    that.etList = data.result.content;
                    that.etTotal = data.result.total;
                    that.etPage = p;
                    that.sendAgainModel = true;
                } else {
                    that.$Message.info(data.message);
                }
            }).catch(() => {
                that.$Message.error('网络错误，获取短信模板失败。');
            });
        },
        sendAgain (item) {
            this.sa = item;
            this.sa.tid = '';
            this.changeET(1);
        },
        tpChange (k) {
            this.emailContent = this.etList[this.etListKey].content;
            this.sa.tid = this.etList[this.etListKey].id;
        },
        ok () {
            var that = this;
            var fileds = [];
            that.sendMELoading = true;

            const el = this.sa;

            var q = '\'';
            var str = (el.litigantName || '') + q + (this.sendTypes[el.sendType] || '') + q + (el.oddNumbers || '') + q + (el.email || '') + q + (el.tid || '') + q + (el.dips ? el.dips.join('$') : '');
            fileds.push(str);

            sendME(this.sa.id, fileds).then(res => {
                var data = res.data;
                that.$Message.info(data.message);
                that.sendMELoading = false;
            }).catch(() => {
                that.$Message.error('网络错误，查询失败。');
                that.sendMELoading = false;
            });
        },
        cancel () {
            this.sendAgainModel = false;
            this.sa = {};
        },
        confirmSend (cid, lid) {
            var that = this;
            that.confirmSendLoading = true;
            confirm(cid, lid, 2).then(res => {
                var data = res.data;
                that.$Message.info(data.message);
                this.getCaseInfo(caseInfo.id);
                that.confirmSendLoading = false;
            }).catch(() => {
                that.$Message.error('网络错误，提交失败。');
                that.confirmSendLoading = false;
            });
        },
        closeClick () {
            this.cardItemShow = false;
            this.$refs.layout.style.paddingLeft = '10px';
        },
        caseFinish () {
            lawCaseSendComplete(this.caseInfo.id).then(res => {
                if (res.data.state == 100) {
                    this.$Message.success(res.data.message)
                } else {
                    this.$Message.error(res.data.message)
                }
            })
        }
    }
};
</script>
<style>
  .case-finish {
    padding: 8px 15px;
    border-radius: 5px;
    display: inline-block;
    background-color: #19be6b;
    float: right;
    position: absolute;
    right: 10px;
    top: 7px;
    cursor: pointer;
  }
</style>
