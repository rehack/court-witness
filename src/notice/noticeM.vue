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
                    <Form :model="formItem" inline :label-width="100" v-show="show1">
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
                            <Button style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ButtonGroup style="margin-top: 10px; margin-bottom: 10px">
                <!-- <Button @click="$router.push('../dip')" size="large" type="info">查看</Button> -->
                <Button @click="cardState = 2; caseN = {}" size="large" type="primary">添加</Button>
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
                        案号
                    </Col>
                    <Col v-show="cardState === 2" span="9" class="maininfo-col">
                        <Select v-model="caseN.caseInfo" placeholder="请选择案件" @on-change="selCase" filterable>
                            <Option v-for="(item, key) in caseList" :value="key" :key="key">{{ item.caseNo }}</Option>
                            <!-- <Page v-if="caseTotal" :current="casePage" :page-size="1" @on-change="changeCasePage" :total="caseTotal" simple></Page> -->
                        </Select>
                    </Col>
                    <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ caseN.caseNo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案件案由
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ caseN.brief }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        原告
                    </Col>
                    <Col span="9" class="maininfo-col ellipsisText">
                        {{ caseN.plaintiff }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        公告对象
                    </Col>
                    <Col v-show="cardState === 2" span="9" class="maininfo-col ellipsisText">
                        <!-- <Select v-model="caseN.noticedNamePhone" multiple>
                            <Option v-for="(name, key) in caseN.dlist" :value="key" :key="key">{{ name }}</Option>
                        </Select> -->
                        <CheckboxGroup v-model="caseN.noticedNames">
                            <Checkbox v-for="(name, key) in caseN.dlist" :label="name" :key="key">{{ name }}</Checkbox>
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
                        发行日期
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
                        发布状态
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
                        公告通知发送对象
                    </Col>
                    <Col v-show="cardState === 2" span="9" class="maininfo-col">
                        <RadioGroup v-model="caseN.sendId">
                            <Radio v-for="(i, key) in caseN.pilist" :label="i" :key="key">
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
                      {{ caseN.expectStartTime | formatDate }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="position:absolute;top:0px;bottom:0px;" class="maininfo-col maininfo-col-label">
                        公告模板
                    </Col>
                    <Col v-show="cardState === 2" style="height: auto;margin-left:150px" span="21" class="maininfo-col">
                        <Select v-model="caseN.msgTplId" :disabled="!caseN.caseNo">
                            <Option v-for="item in noticeTList" :value="item.id" :key="item.id">{{ item.name + ': ' + item.content }}</Option>
                            <Page v-if="noticeTT > 10" :current="noticeTP" @on-change="changeNTPage" :total="noticeTT" simple></Page>
                        </Select>
                    </Col>
                    <Col v-show="cardState !== 2" span="21" class="maininfo-col" style="height: auto;margin-left:150px">
                        {{ caseN.msgtpl }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" style="height: 120px" class="maininfo-col maininfo-col-label">
                        备注
                    </Col>
                    <Col span="21" v-show="cardState !== 1" style="height: 120px" class="maininfo-col">
                        <Input type="textarea" :disabled="!caseN.caseNo" :autosize="false" element-id="ntcRemark" v-model="notice.remark"></Input>
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
                <Button :loading="loading3" @click="noticeAdd" size="large" type="primary" v-show="cardState === 2">确认</Button>
                <Button @click="noticeConfirmation" type="primary" size="large" v-show="cardState === 1">公告内容确认</Button>
                <Button @click="cardState = false" type="dashed" size="large">关闭</Button>
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
import {
  list,
  del,
  add,
  edit,
  getById,
  sendById,
  NoticeSendConfirmation
} from "../api/notice.js";
import { formatDate } from "../libs/date.js";
export default {
  components: { UE },
  data() {
    // var nowD = new Date();
    var width = window.innerWidth - 200;
    return {
      yg: [],
      bg: [],
      show1: true,
      modalWidth: width,
      cardState: false,
      op: ["", "查看", "添加", "修改"],
      modal2: false,
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
    getCaseList() {
      var that = this;
      searchCase()
        .then(res => {
          var data = res.data;
          if (data.state - 0 === 100) {
            that.caseList = data.result;
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
      const params = {
        msgTplId: this.caseN.msgTplId,
        sendPhone: this.caseN.sendId, // 你以为要传phone，其实传的是ID哒！ 因为一些沟通的问题。。变成这样别扭的样子
        caseId: this.caseN.id,
        isRelease: this.caseN.isRelease,
        releaseDate:
          this.caseN.releaseDate &&
          formatDate(this.caseN.releaseDate, "yyyy-MM-dd"),
        newspaper: this.caseN.newspaper,
        newsurl: this.caseN.newsurl,
        remark: this.caseN.remark,
        bgname: this.caseN.noticedNames && this.caseN.noticedNames.join(",")
      };
      add(params)
        .then(res => {
          var data = res.data;
          that.$Message.info(data.message);
          if (data.state === 100) {
            this.getNoticeList({});
            that.cardState = false;
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 添加失败");
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
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 添加失败");
        });
    },
    noticeConfirmation() {
      NoticeSendConfirmation(this.caseN.caseId, this.caseN.litigantId).then(
        res => {
          if (res.data.state == 100) {
            this.$Message.success(res.data.message);
          } else {
            this.$Message.error(res.data.message);
          }
        }
      );
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
      var c = this.caseList[k];
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
      this.caseN = c;
      this.selId = c.id;
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
