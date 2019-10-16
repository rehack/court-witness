<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                {{ op[cardState] }}当事人信息
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        名称
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.litigantName" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.litigantName }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        诉讼地位
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <RadioGroup v-model="info.litigationStatus">
                            <Radio label="原告"></Radio>
                            <Radio label="被告"></Radio>
                            <Radio label="第三人"></Radio>
                        </RadioGroup>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.litigationStatus }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        出生年月
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <DatePicker :value="info.birthdayD" type="date" style="width:100%" @on-change="birthdayChange"></DatePicker>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.birthdayD }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        性别
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <RadioGroup v-model="info.litigantSex">
                            <Radio label="男"></Radio>
                            <Radio label="女"></Radio>
                        </RadioGroup>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.litigantSex }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        人员类型
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                      <RadioGroup v-model="info.litigantType">
                          <Radio label="自然人"></Radio>
                          <Radio label="法人"></Radio>
                      </RadioGroup>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.litigantType }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        身份证号/统一信用码
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.identityCard" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.identityCard }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码
                    </Col>
                    <Col v-show="cardState > 1" span="3" class="maininfo-col"  >
                        <Input v-model="info.litigantPhone" style="width: 100%;"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="3" class="maininfo-col">
                        {{ info.litigantPhone }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        固定电话
                    </Col>
                    <Col v-show="cardState > 1" span="3" class="maininfo-col">
                        <Input v-model="info.litigantTelPhone" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="3" class="maininfo-col">
                        {{ info.litigantTelPhone }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        微信号
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.openNum" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.openNum }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        邮箱
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.email" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.email }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label" >
                        工作单位
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col" style='    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;'>
                        <Input v-model="info.employer" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.employer }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        现住地址
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.address" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.address }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        户籍地址
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.nativePlace" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.nativePlace }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        代理律师
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.agant" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.agant }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        代理律师联系方式
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.agantPhone" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.agantPhone }}
                    </Col>
                </Row>
                <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      关联案件
                  </Col>
                  <Col span="21" class="maininfo-col">
                      {{ info.caseNo }}
                  </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        备注
                    </Col>
                    <Col v-show="cardState > 1" span="21" class="maininfo-col">
                        <Input v-model="info.remark" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="21" class="maininfo-col">
                        {{ info.remark }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        最后修改人
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ info.lastModifyPeople }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        最后修改时间
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ info.lastModifyDate && formatDate(new Date(info.lastModifyDate), 'yyyy-MM-dd hh-mm-ss') }}
                    </Col>
                </Row>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Button v-show="cardState === 1" @click="cardState = 3" type="warning" size="large">修改</Button>
                    <Button v-show="cardState > 1" @click="save" :loading="saved" type="success" size="large">保存</Button>
                    <Button @click="cardState = 0" type="text" size="large">取消</Button>
                </div>
            </div>
        </Card>
        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">当事人信息库</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="getList(1)">
                        <FormItem label="案号：">
                            <Input style="width: 200px" v-model="formItem.caseNo"/>
                        </FormItem>
                        <FormItem label="当事人姓名：">
                            <Input style="width: 200px" v-model="formItem.litigantName"/>
                        </FormItem>
                        <FormItem label="身份类型：">
                            <Select v-model="formItem.litigationStatus" style="width:200px">
                                <Option value="原告">原告</Option>
                                <Option value="被告">被告</Option>
                                <Option value="第三人">第三人</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="手机号码：">
                            <Input style="width: 200px" v-model="formItem.litigantPhone"/>
                        </FormItem>
                        <FormItem label="生日：">
                            <DatePicker style="width: 200px" type="date" v-model="formItem.birthday"></DatePicker>
                        </FormItem>
                        <FormItem label="证件号：">
                            <Input style="width: 200px" v-model="formItem.identityCard"/>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ButtonGroup style="margin-top: 10px; margin-bottom: 10px">
                <Button @click="modal2 = true" size="large" type="ghost">批量删除</Button>
            </ButtonGroup>
            <Table stripe ref="clerkTable" :columns="clerkcol" :data="tableData" @on-selection-change="tableCheck"></Table>
            
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal v-model="modal2" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确认删除</span>
            </p>
            <div style="text-align:center">
                <p>您将删除</p>
                <span v-for="(n, k) in checkNames" :key="k">
                    【{{ n }}】
                </span>
                <p>共{{ checkNames.length }}条数据</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="del_loading" @click="delClerk">删除</Button>
            </div>
        </Modal>
        <Modal v-model="phoneModal" width="620">
            <iframe :src="callPhone" frameborder="0" width="600" height="400"></iframe>
        </Modal>
    </div>
</template>
<script>
import { list, add, update, del } from "../../api/litigantInfo.js";
import { formatDate } from "../../libs/date.js";
// import expandRow from '../../components/litiganrinfo/table-expand.vue';
export default {
  data() {
    // var nowD = new Date();
    return {
      cardState: 0,
      op: ["", "查看", "添加", "修改"],
      show1: false,
      saved: false,
      del_loading: false,
      modal2: false,
      phoneModal: false,
      callPhone: "",
      spinShow: false,
      totalPage: 0,
      pageNumber: 0,
      checkIds: [],
      checkNames: [],
      formItem: {
        caseNo: "",
        litigantName: "",
        litigationStatus: "",
        birthday: "",
        identityCard: "",
        litigantPhone: ""
      },
      clerkcol: [
        //   {
        //     type: 'expand',
        //     width: 50,
        //     render: (h, params) => {
        //         return h(expandRow, {
        //             props: {
        //                 row: params.row.mobilepPhones
        //             }
        //         })
        //     }
        // },
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "当事人",
          key: "litigantName",
          align: "center",
          width: 100
        },
        {
          title: "人员类型",
          key: "litigantType",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.litigantType == "1" ? "法人" : "自然人"
            );
          }
        },
        {
          title: "诉讼地位",
          key: "litigantStatus",
          align: "center",
          width: 100,
          render: (h, params) => {
            console.log(params.row.mobilepPhones);
            return h("span", {}, params.row.litigantStatus);
          }
        },
        {
          title: "身份证号/统一信用码",
          key: "identityCard",
          align: "center",
          width: 180
        },
        {
          title: "手机号码",
          key: "litigantPhone",
          align: "center",
          width: 160,
          render: (h, params) => {
               return h("div", [
              h(
                "p",
                {
                   style: {
                    textDecoration: "underline",
                    color: "#40a9ff",
                    cursor: "pointer"
                },
                  on: {
                    click: () => {
                      this.phoneModal = true;
                        this.callPhone =
                    //   "../../src/components/webPhone/testconnect.htm?phone=" +
                      "/testconnect.htm?phone=" +
                      params.row.litigantPhone;
                    }
                  }
                },
               params.row.litigantPhone ? params.row.litigantPhone : ""
              ),
            //   h(
            //     "p",
            //     {
            //        style: {
            //         textDecoration: "underline",
            //         color: "#40a9ff",
            //         cursor: "pointer"
            //     },
            //       on: {
            //         click: () => {
            //           this.phoneModal = true;
            //             this.callPhone =
            //         //   "../../src/components/webPhone/testconnect.htm?phone=" +
            //           "/testconnect2.htm?phone=" +
            //           params.row.litigantPhone;
            //         }
            //       }
            //     },
            //     params.row.litigantPhone ? params.row.litigantPhone+'(测试2)' : ""
            //   ),
            ]);
            // return h([
            //   "span",
            //   {
            //     style: {
            //       textDecoration: "underline",
            //       color: "#40a9ff",
            //       cursor: "pointer"
            //     },
            //     on: {
            //       click: () => {
            //         this.phoneModal = true;
            //         this.callPhone =
            //         //   "../../src/components/webPhone/testconnect.htm?phone=" +
            //           "/testconnect.htm?phone=" +
            //           params.row.litigantPhone;
            //         // localStorage.setItem("ph-sqLawCaseId",params.row.sqLawCaseId);
            //         // localStorage.setItem("ph-litigant",params.row.id);
            //         // localStorage.setItem("registerNo",params.row.registerNo);
            //       }
            //     }
            //   },
            //   params.row.litigantPhone
            // ]);
          }
        },
        {
          title: "三证合一验证",
          key: "identityValidate",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.identityValidate == null ||
              params.row.identityValidate == 0
                ? "未验证"
                : params.row.identityValidate == 1
                  ? "验证通过"
                  : params.row.identityValidate == 2
                    ? "验证不通过"
                    : "验证信息不全"
            );
          }
        },
        {
          title: "地址",
          key: "address",
          align: "center",
          width: 200
        },
        {
          title: "采集时间",
          key: "createDate",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h(
              "span",
              {},
              formatDate(new Date(params.row.createDate), "yyyy-MM-dd hh:mm:ss")
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      var c = JSON.parse(JSON.stringify(params.row));
                      this.info = c;
                      this.info.litigationStatus =
                        params.row.litigationStatus;
                      this.info.litigantSex =
                        params.row.litigantSex == "1" ? "女" : "男";
                      this.info.litigantType =
                        params.row.litigantType == "1" ? "法人" : "自然人";
                      this.info.departmentName =
                        this.info.department && this.info.department.name;
                      this.info.createDateD =
                        this.info.createDate &&
                        this.formatDate(
                          new Date(this.info.createDate),
                          "yyyy-MM-dd hh:mm:ss"
                        );
                      this.info.birthdayD =
                        this.info.birthday &&
                        this.formatDate(
                          new Date(this.info.birthday),
                          "yyyy-MM-dd"
                        );
                      this.cardState = 1;
                    }
                  }
                },
                "详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      var c = JSON.parse(JSON.stringify(params.row));
                      this.info = c;
                      this.info.litigationStatus =
                        params.row.litigationStatus;
                      this.info.litigantSex =
                        params.row.litigantSex == "1" ? "女" : "男";
                      this.info.litigantType =
                        params.row.litigantType == "1" ? "法人" : "自然人";
                      this.info.departmentName =
                        this.info.department && this.info.department.name;
                      this.info.createDateD = this.formatDate(
                        new Date(this.info.createDate),
                        "yyyy-MM-dd hh:mm:ss"
                      );
                      this.info.birthdayD = this.formatDate(
                        new Date(this.info.birthday),
                        "yyyy-MM-dd"
                      );
                      this.cardState = 3;
                    }
                  }
                },
                "修改"
              )
            ]);
          }
        }
      ],
      tableData: [],
      info: {
        litigantName: "",
        litigationStatus: "",
        birthdayD: "",
        litigantSex: "",
        litigantType: "",
        identityCard: "",
        litigantPhone: "",
        litigantTelPhone: "",
        openNum: "",
        email: "",
        employer: "",
        address: "",
        agant: "",
        agantPhone: "",
        workYear: "",
        remark: "",
        lastModifyPeople: "",
        lastModifyDate: ""
      }
    };
  },
  mounted() {
    this.getList(1);
    console.log(this.cardState)
  },
  methods: {
    getList(page) {
      var that = this;
      var params = this.formItem;
      params.birthday =
        this.formItem.birthday && new Date(this.formItem.birthday).getTime();
      params.pageNumber = page;
      list(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            that.tableData = data.result.content;
            that.pageNumber = data.result.pageNumber;
            that.totalPage = data.result.totalPage;
          } else {
            that.$Message.info(data.message);
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 请稍后再试");
        });
    },
    addClerk() {
      this.$refs.clerkTable.clearCurrentRow();
    },
    save() {
      var that = this;
      that.saved = true;
      const litigantSex = this.info.litigantSex == "男" ? 0 : 1;
      const litigantType = this.info.litigantType == "自然人" ? 0 : 1;
      var params = {
        litigantId: this.info.id,
        litigantName: this.info.litigantName,
        litigationStatus: this.info.litigationStatus,
        birthday:
          this.info.birthdayD && new Date(this.info.birthdayD).getTime(),
        litigantSex,
        litigantType,
        identityCard: this.info.identityCard,
        litigantPhone: this.info.litigantPhone,
        litigantTelPhone: this.info.litigantTelPhone,
        openNum: this.info.openNum,
        email: this.info.email,
        employer: this.info.employer,
        address: this.info.address,
        nativePlace: this.info.nativePlace,
        agant: this.info.agant,
        agantPhone: this.info.agantPhone,
        remark: this.info.remark
      };

      if (this.cardState === 2) {
        add(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
            }
            that.saved = false;
          })
          .catch(() => {
            that.$Message.error("网络错误");
            that.saved = false;
          });
      } else {
        update(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
              this.cardState = 0;
            }
            that.saved = false;
          })
          .catch(() => {
            that.$Message.error("网络错误");
            that.saved = false;
          });
      }
    },
    delClerk() {
      this.spinShow = true;
      this.modal2 = false;
      var that = this;
      del(that.checkIds)
        .then(res => {
          that.spinShow = false;
          var data = res.data;
          that.$Message.info(data.message);
          if (data.state === 100) {
            that.getList(that.pageNumber);
          }
        })
        .catch(() => {
          that.spinShow = false;
          that.$Message.error("网络错误");
        });
    },
    tableCheck(c) {
      var arr = [];
      var arr2 = [];
      for (let i = 0; i < c.length; i++) {
        const el = c[i];
        arr.push(el.id);
        arr2.push(el.litigantName);
      }
      this.checkNames = arr2;
      this.checkIds = arr;
    },
    changePage(p) {
      this.getList(p);
    },
    clean() {
      this.formItem = {
        litigantName: "",
        litigationStatus: "",
        birthday: "",
        identityCard: "",
        litigantPhone: ""
      };
      this.getList(1);
    },
    toAdd() {
      this.cardState = 2;
      this.info = {
        judgeNo: "",
        name: "",
        birthdayD: "",
        identity: "",
        phone: "",
        openNum: "",
        department: "",
        emergencyContact: "",
        emergencyPhone: "",
        createDateD: "",
        changeNum: "",
        workYear: "",
        remark: "",
        lastModifyPeople: "",
        lastModifyDate: ""
      };
    },
    birthdayChange(d) {
      this.info.birthdayD = d;
    },
    createDateChange(d) {
      this.info.createDateD = d;
    },
    exportExcel() {},
    formatDate(d, fmt) {
      return formatDate(d, fmt);
    }
  }
};
</script>
<style>
.maininfo-col {
    height: 38px;
    line-height: 38px;
    padding: 0 4px;
    border-right: 1px solid #e9eaec;
    border-bottom: 1px solid #e9eaec;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

