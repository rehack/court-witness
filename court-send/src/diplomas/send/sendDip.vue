<template>
    <div class="layoutM" ref="layout">
        <Card class="cardItem" v-show="cardItemShow">
            <p slot="title">
                <Icon type="wrench"></Icon>
                案件搜索
            </p>
            <div style="width: 40px" slot="extra">
                <!-- <Row :gutter="8" justify="center">
                    <Col class="minus-icon" span="12">
                        <Icon type="minus-round"></Icon>
                    </Col>
                    <Col class="close-icon" span="12">
                        <Icon type="close-round" @click.native="closeClick"></Icon>
                    </Col>
                </Row> -->
            </div>
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
                        <Tooltip :content="'案由：' + item.briefName + '|' + item.litigationStatusName + ':' + item.litigantName">
                            案由：{{ item.briefName }} | {{ item.litigationStatusName }}:{{ item.litigantName }}
                        </Tooltip>
                    </p>
                </Button>
            </ButtonGroup>
            <Page v-if="caseList.length > 10" :current="caseP" @on-change="changePage" :total="caseList.length" style="padding-left: 28px;padding-top: 10px" simple></Page>
        </Card>
        <Card v-if="caseInfo">
            <p slot="title">
                案件信息
            </p>
            <div class="maininfo-warp">
                <Spin size="large" fix v-if="caseLoading"></Spin>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案号
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo[0].caseNo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案件名称
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo[0].caseName }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        原告姓名
                    </Col>
                    <Col span="9" class="maininfo-col">
                        <!-- <Tooltip :content="caseInfo[0].plaintiffs"> -->
                            <div class="ellipsisText">
                                <span v-for="(ci, k) in caseInfo" v-if="ci.litigationStatusName === '原告'" :key="k">
                                    {{(k?'、':'') + ci.litigantName }}
                                </span>
                            </div>
                        <!-- </Tooltip> -->
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        被告姓名
                    </Col>
                    <Col span="9" class="maininfo-col">
                        <!-- <Tooltip :content="caseInfo[0].defendants"> -->
                            <div class="ellipsisText">
                                <span v-for="(ci, k) in caseInfo" v-if="ci.litigationStatusName === '被告'" :key="k">
                                    {{ci.litigantName + (k + 1 !== caseInfo.length ?'、':'')}}
                                </span>
                            </div>
                        <!-- </Tooltip> -->
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码(原告)
                    </Col>
                    <Col span="9" class="maininfo-col">
                        <!-- <Tooltip :content="caseInfo[0].plaintiffsPhone"> -->
                            <div class="ellipsisText">
                                <span v-for="(ci, k) in caseInfo" v-if="ci.litigationStatusName === '原告'" :key="k">
                                    {{(k?'、':'') + ci.litigantPhone }}
                                </span>
                            </div>
                        <!-- </Tooltip> -->
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码(被告)
                    </Col>
                    <Col span="9" class="maininfo-col">
                        <!-- <Tooltip :content="caseInfo[0].defendantsPhone"> -->
                            <div class="ellipsisText">
                                <span v-for="(ci, k) in caseInfo" v-if="ci.litigationStatusName === '被告'" :key="k">
                                    {{ci.litigantPhone + (k + 1 !== caseInfo.length ?'、':'') }}
                                </span>
                            </div>
                        <!-- </Tooltip> -->
                    </Col>
                </Row>
                <!-- <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        证件类型
                    </Col>
                    <Col span="9" class="maininfo-col">
                        身份证
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        证件号码
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseInfo[0].identityCard }}
                    </Col>
                </Row> -->
                <Row>
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
                <Row>
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
                <!-- <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        备注
                    </Col>
                    <Col span="21" class="maininfo-col">
                        {{ caseInfo.remark }}
                    </Col>
                </Row> -->
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
                        <Select v-model="item.sendType" style="width:100%">
                            <Option v-for="(st, key) in sendTypes" :value="key" :key="key">{{ st }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        文书列表：
                    </Col>
                    <Col span="21">
                        <CheckboxGroup v-if="item.diplomsName" v-model="item.dips">
                            <Checkbox v-for="(d, key) in item.diplomsName.split(',')" :label="d" :key="key"></Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        <span style="color: #ed3f14" v-show="item.sendType === 3">*</span>
                        邮箱地址：
                    </Col>
                    <Col span="12">
                        <Input v-model="item.email" style="width: 100%"></Input>
                    </Col>
                </Row>
                <Row v-if="item.sendType === 3">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        邮件模板：
                    </Col>
                    <Col span="10">
                        <Select v-model="item.etListKey" @on-change="tpChange(item)" style="width:100%">
                            <Option v-for="(t, key) in item.etList" :value="key" :key="key">{{ t.name }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row v-if="item.sendType === 3">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        模板内容：
                    </Col>
                    <Col span="12">
                        <div style="padding: 5px 6px;">
                            {{ item.emailContent }}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        <span style="color: #ed3f14" v-show="item.sendType !== 3">*</span>
                        收件地址：
                    </Col>
                    <Col span="12">
                        <Input v-model="item.sendAddress" style="width: 100%" v-show="item.addressList.length == 0"></Input>
                        <Select v-model="item.sendAddress" style="width:100%" v-show="item.addressList.length != 0">
                            <Option v-for="(st, key) in item.addressList" :value="key" :key="key">{{ st }}</Option>
                        </Select>
                        {{ item.sendAddress }}
                    </Col>
                </Row>
                <Row v-if="item.sendType === 1">
                    <Col span="3" style="text-align: right; padding-right: 5px">
                        快递单号：
                    </Col>
                    <Col span="9">
                        <Input v-model="item.oddNumbers" style="width: 100%"></Input>
                    </Col>
                    <Col span="3">
                        <Button type="info" @click="printBill(item)" long>快递单打印</Button>
                    </Col>
                </Row>
                <div style="position: absolute; bottom: 4px; right: 5%;">
                    <Button v-show="item.sendType != 3" @click="printSend(item)" type="success" style="margin-right: 16px">打印</Button>
                    <Checkbox v-model="item.checked" @on-change="checkChange(item)">选中</Checkbox>
                </div>
            </div>
        </Card>
        <div v-if="caseInfo.length" style="margin: 16px 0; text-align: center">
            <ButtonGroup size="large">
                <!-- <Button style="width: 100px" type="info">短信通知</Button> -->
                <Button @click="sendME" style="width: 100px" :loading="sendMELoading" type="success">发送</Button>
                <Button style="width: 150px" @click="downEMS">下载EMS交接单</Button>
            </ButtonGroup>
        </div>
    </div>
</template>
<script>
import { getBrief, queryCase } from "../../api/global.js";
import {
  getInfo,
  getSendInfo,
  sendME,
  printBill,
  postDeliveryBill
} from "../../api/send.js";
import { formatDate } from "../../libs/date.js";
import { senList, emailList, addressList } from "../../api/templante.js";
import { list } from "../../api/diplomas.js";
export default {
  data() {
    const sendStates = ["取消", "送达中", "已送达成功", "未外送达成功"];
    const sendTypes = [
      "现场领取",
      "EMS送达",
      "工作人员上门送达",
      "电子邮件送达",
      "H5确认阅读"
    ];
    return {
      caseP: 1,
      sendTo: 0,
      cardItemShow: true,
      queryLoading: false,
      caseLoading: false,
      infoLoading: false,
      sendMELoading: false,
      // filter1: '',
      // dateRange: '',
      // briefName: '',
      // briefList: [],
      caseNo: "",
      plaintiffName: "",
      defendantName: "",
      value1: "1",
      etList: [], // 短信模板列表, 因为做了分页，可能会有不同，info里的对象都要有该属性
      addressList: [],
      // etListKey: '',
      // emailContent: '',
      caseList: [],
      caseInfo: "",
      // info: [],
      sendTypes: sendTypes,
      sendStates: sendStates
    };
  },
  mounted() {
    if (this.$route.params) {
      var caseId = this.$route.params.lawCaseId;
      if (caseId) {
        this.showLeft(caseId);
      }
    }
    this.getBrief();
  },
  methods: {
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
    showLeft(caseId) {
      this.getCaseInfo(caseId);
      // this.getSendInfo(caseId);
    },
    getCaseInfo(caseId) {
      var that = this;
      that.caseLoading = true;
      getInfo(caseId)
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            that.caseInfo = data.result;
            for (let i = 0; i < that.caseInfo.length; i++) {
              if (that.caseInfo[i].diplomsName == null) {
                that.caseInfo[i].diplomsName = null;
              } else {
                that.caseInfo[i].diplomsName +=
                  ",证据材料,起诉状（反诉状）,答辩状,上诉状";
              }
              emailList(res.data.result[i].id, res.data.result[i].litigantId)
                .then(res => {
                  var data = res.data;
                  if (data.state === 100) {
                    const el = that.caseInfo[i];
                    el.tid = ""; // 邮件模板ID
                    el.etList = data.result.content;
                    if (i === that.caseInfo.length - 1) {
                      that.caseInfo = JSON.parse(JSON.stringify(that.caseInfo));
                    }
                  } else {
                    that.$Message.info(data.message);
                  }
                })
                .catch(() => {
                  that.$Message.error("网络错误，获取短信模板失败。");
                });
              addressList(res.data.result[i].litigantId)
                .then(res => {
                  var data = res.data;
                  if (data.state === 100) {
                    that.caseInfo[i].addressList = [];
                    if (
                      data.result.address != null &&
                      data.result.address != ""
                    ) {
                      that.caseInfo[i].addressList.push(data.result.address);
                    }
                    if (
                      data.result.nativePlace != null &&
                      data.result.nativePlace != ""
                    ) {
                      that.caseInfo[i].addressList.push(
                        data.result.nativePlace
                      );
                    }
                    if (
                      data.result.sendAddress != null &&
                      data.result.sendAddress != ""
                    ) {
                      that.caseInfo[i].addressList.push(
                        data.result.sendAddress
                      );
                    }
                    that.caseInfo[i].addressList = Array.from(
                      new Set(that.caseInfo[i].addressList)
                    );
                    that.caseInfo[i].sendAddress = "";
                  } else {
                    that.$Message.info(data.message);
                  }
                })
                .catch(() => {
                  that.$Message.error("网络错误，获取当事人地址失败。");
                });
            }
          } else {
            that.$Message.info("案件详情查询:" + data.message);
          }
          that.caseLoading = false;
        })
        .catch(() => {
          that.$Message.error("网络错误，查询案件详情失败。");
          that.caseLoading = false;
        });
    },
    // 数据都整理由getCaseInfo方法获得，该方法暂时无用
    // getSendInfo (caseId) {
    //     var that = this;
    //     that.infoLoading = true;
    //     getSendInfo(caseId).then(res => {
    //         var data = res.data;
    //         if (data.state - 0 === 100) {
    //             that.info = data.result;
    //         } else if (data.state - 0 === 102) {
    //             that.info = that.caseInfo;
    //         } else {
    //             that.$Message.info('送达查询:' + data.message);
    //         }
    //         that.infoLoading = false;
    //     }).catch(() => {
    //         that.$Message.error('网络错误，查询送达信息失败。');
    //         that.infoLoading = false;
    //     });
    // },
    queryCase() {
      var that = this;
      that.queryLoading = true;
      queryCase(that.caseNo, that.plaintiffName, that.defendantName)
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            that.caseList = data.result;
          } else {
            that.$Message.info(data.message);
          }
          that.queryLoading = false;
        })
        .catch(() => {
          that.$Message.error("网络错误，查询失败。");
          that.queryLoading = false;
        });
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        for (let i = 0; i < this.diplist.length; i++) {
          var el = this.diplist[i];
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
    dipCheckedChange(data) {
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
    dipshow() {
      if (this.dipChecked.length) {
        this.index = this.dipChecked[0];
        this.modal1 = true;
      } else {
        this.$Message.error("未选择文书");
      }
    },
    formatDate(d, fmt) {
      return formatDate(d, fmt);
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
    tpChange(item) {
      item.emailContent = item.etList[item.etListKey].content;
      item.tid = item.etList[item.etListKey].id;
    },
    sendME() {
      var that = this;
      var fileds = [];
      that.sendMELoading = true;
      for (let i = 0; i < this.caseInfo.length; i++) {
        const el = this.caseInfo[i];
        if (el.checked === true) {
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
            (el.tid || "") +
            q +
            (el.litigantPhone || "") +
            q +
            (el.sendAddress || "") +
            q +
            (el.dips ? el.dips.join("$") : "");
          fileds.push(str);
        }
      }
      sendME(this.caseInfo[0].id, fileds)
        .then(res => {
          var data = res.data;
          that.$Message.info(data.message);
          that.sendMELoading = false;
        })
        .catch(() => {
          that.$Message.error("网络错误，查询失败。");
          that.sendMELoading = false;
        });
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
    changePage(p) {
      this.caseP = p;
    },
    printBill(item) {
      var that = this;
      var params = {
        oddNumbers: item.oddNumbers,
        lawCaseId: item.id,
        litigantName: item.litigantName,
        sendAddress: item.sendAddress,
        litigantPhone: item.litigantPhone,
        litigantType: item.litigantType,
        diploms: item.dips
      };
      printBill(params)
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            window.open("/" + data.html);
          } else {
            that.$Message.info(data.message);
          }
          that.queryLoading = false;
        })
        .catch(() => {
          that.$Message.error("网络错误，查询失败。");
          that.queryLoading = false;
        });
    },
    printSend(item) {
      if (item.dips.length) {
        var that = this;
        list(item.litigantId, item.dips.join(","), item.sendType)
          .then(res => {
            var data = res.data;
            if (data.state - 0 === 100) {
              that.$Message.loading({
                content: "文书生成中，请稍候",
                duration: item.dips.length * 0.6, // 按照文书数量给后台一点生成pdf文件的时间
                onClose: () => {
                  window.open("/" + data.result);
                }
              });
            } else {
              that.$Message.error(res.data.message);
            }
          })
          .catch(() => {
            that.$Message.error("网络错误，获取" + name + "失败。");
          });
      } else {
        this.$Message.error("未选择文书");
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
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  },
  filters: {
    formatSex(value) {
      return value ? "女" : "男";
    },
    formatType(value) {
      return value ? "法人" : "自然人";
    }
  }
};
</script>
