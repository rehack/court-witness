<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                {{ op[cardState] }}法官信息
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        法官编号
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ info.judgeNo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        姓名
                        <Tooltip v-show="cardState > 1 && !info.name" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.name" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.name }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        出生年月
                        <Tooltip v-show="cardState > 1 && !info.birthdayD" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <DatePicker :value="info.birthdayD" type="date" style="width:100%" @on-change="birthdayChange"></DatePicker>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.birthdayD }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        身份证号
                        <Tooltip v-show="cardState > 1 && !info.identity" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState === 2" span="9" class="maininfo-col">
                        <Input v-model="info.identity" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ info.identity }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.phone" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.phone }}
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

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        所属部门
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.departmentName" :disabled="cardState != 2" filterable clearable style="width:100%">
                            <Option v-for="item in departmentList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.departmentName }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        紧急联系人
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.emergencyContact" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.emergencyContact }}
                    </Col>

                    <Col v-show="cardState !== 2" span="3" class="maininfo-col maininfo-col-label">
                        采集时间
                    </Col>
                    <!-- <Col v-show="cardState > 2" span="9" class="maininfo-col">
                        <DatePicker :value="info.createDateD" type="datetime" style="width:100%" @on-change="createdDateChange"></DatePicker>
                    </Col> -->
                    <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ info.createDateD }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        紧急联系人号码
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.emergencyPhone" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.emergencyPhone }}
                    </Col>

                    <Col v-show="cardState !== 2" span="3" class="maininfo-col maininfo-col-label">
                        变更次数
                    </Col>
                    <!-- <Col v-show="cardState > 2" span="9" class="maininfo-col">
                        <Input v-model="info.changeNum" style="width: 100%"></Input>
                    </Col> -->
                    <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ info.changeNum }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        工作年限
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.workYear" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.workYear }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        备注
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.remark" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.remark }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        固定电话
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.telephone" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.telephone }}
                    </Col>

                    <Col span="3" v-show="cardState > 1" class="maininfo-col maininfo-col-label">
                        新密码
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input :type="passType1"  v-model="info.newPassword" style="width: 100%" ></Input>
                    </Col>
                    <Col span="3" v-show="cardState > 1" class="maininfo-col maininfo-col-label">
                        确认密码
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input :type="passType2"  v-model="info.rePassword" style="width: 100%"></Input>
                    </Col>

                    <Col v-show="cardState !== 2" span="3" class="maininfo-col maininfo-col-label">
                        最后修改人
                    </Col>
                    <!-- <Col v-show="cardState > 2" span="9" class="maininfo-col">
                        <Input v-model="info.lastModifyPeople" style="width: 100%"></Input>
                    </Col> -->
                    <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ info.lastModifyPeople }}
                    </Col>
                    <Col v-show="cardState !== 2" span="3" class="maininfo-col maininfo-col-label">
                        最后修改时间
                    </Col>
                    <!-- <Col v-show="cardState > 2" span="9" class="maininfo-col">
                        <Input v-model="info.lastModifyDate" style="width: 100%"></Input>
                    </Col> -->
                    <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ info.lastModifyDate && formatDate(new Date(info.lastModifyDate), 'yyyy-MM-dd hh-mm-ss') }}
                    </Col>
                </Row>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <!-- <Button v-show="cardState === 1" @click="cardState = 3" type="warning" size="large">修改</Button> -->
                    <Button v-show="cardState > 1" @click="save" :loading="saved" type="success" size="large">保存</Button>
                    <Button @click="cardState = 0" type="text" size="large">取消</Button>
                </div>
            </div>
        </Card>
        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">法官信息库</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="getList(1)">
                        <FormItem label="法官编号：">
                            <Input style="width: 200px" v-model="formItem.judgeNo"/>
                        </FormItem>
                        <FormItem label="法官姓名：">
                            <Input style="width: 200px" v-model="formItem.name"/>
                        </FormItem>
                        <FormItem label="手机号码：">
                            <Input style="width: 200px" v-model="formItem.phone"/>
                        </FormItem>
                        <FormItem label="工作部门：">
                            <Select v-model="formItem.departmentName" filterable clearable style="width:200px">
                                <Option v-for="item in departmentList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="工作年限：">
                            <Input style="width: 200px" v-model="formItem.workYear"/>
                        </FormItem>
                        <FormItem label="采集时间：">
                            <DatePicker style="width: 200px" type="date" v-model="formItem.createDate"></DatePicker>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <!-- <ButtonGroup style="margin-top: 10px; margin-bottom: 10px">
                <Button @click="toAdd" size="large" type="primary">添加</Button>
                <Button @click="modal2 = true" size="large" type="ghost">删除</Button>
            </ButtonGroup> -->
            <Table stripe ref="judgeTable" :columns="judgecol" :data="judgedata" @on-selection-change="tableCheck" style="margin-top:10px"></Table>
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
                <Button type="error" size="large" long :loading="del_loading" @click="delJudge">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { list, add, update, del } from "../../api/judgeInfo.js";
import { courtList } from "../../api/global.js";
import { formatDate } from "../../libs/date.js";
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
      passType1: "password",
      passType2: "password",
      icon1: "ios-eye-outline",
      icon2: "ios-eye-outline",
      spinShow: false,
      totalPage: 0,
      pageNumber: 0,
      checkIds: [],
      checkNames: [],
      departmentList: [],
      formItem: {
        judgeNo: "",
        name: "",
        phone: "",
        department: "",
        departmentName: "",
        departmentId: "",
        workYear: "",
        createDate: ""
      },
      judgecol: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "法官编号",
          key: "judgeNo",
          align: "center",
          width: 100
        },
        {
          title: "法官账号",
          key: "admin",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", {}, params.row.admin.name);
          }
        },
        {
          title: "法官姓名",
          key: "name",
          align: "center",
          ellipsis: true
        },
        {
          title: "出生年月",
          key: "birthday",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.birthday &&
                formatDate(new Date(params.row.birthday), "yyyy-MM-dd")
            );
          }
        },
        {
          title: "工作年限",
          key: "workYear",
          align: "center",
          width: 100
        },
        {
          title: "手机号码",
          key: "phone",
          align: "center"
        },
        {
          title: "工作部门",
          key: "department",
          align: "center",
          render: (h, params) => {
            return h("span", {}, params.row.court.name);
          }
        },
        {
          title: "采集时间",
          key: "createDate",
          align: "center",
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
                      this.info.departmentName = this.info.court.name;
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
            //   h(
            //     "Button",
            //     {
            //       props: {
            //         type: "warning",
            //         size: "small"
            //       },
            //       on: {
            //         click: () => {
            //           var c = JSON.parse(JSON.stringify(params.row));
            //           this.info = c;
            //           this.info.departmentName = this.info.court.name;
            //           this.info.createDateD = this.formatDate(
            //             new Date(this.info.createDate),
            //             "yyyy-MM-dd hh:mm:ss"
            //           );
            //           this.info.birthdayD = this.formatDate(
            //             new Date(this.info.birthday),
            //             "yyyy-MM-dd"
            //           );
            //           this.cardState = 3;
            //         }
            //       }
            //     },
            //     "修改"
            //   )
            ]);
          }
        }
      ],
      judgedata: [],
      info: {
        judgeNo: "",
        name: "",
        telephone:'',
        birthdayD: "",
        identity: "",
        phone: "",
        openNum: "",
        department: "",
        departmentName: "",
        departmentId: "",
        emergencyContact: "",
        emergencyPhone: "",
        createDate: "",
        changeNum: "",
        workYear: "",
        remark: "",
        lastModifyPeople: "",
        lastModifyDate: "",
        newPassword: "",
        rePassword: ""
      }
    };
  },
  mounted() {
    this.getList(1);
    this.getCourtList();
  },
  methods: {
    changeInput(id) {
      alert(1);
      if (id == 1) {
        if (this.passType1 == "password") {
          this.passType1 = "text";
          this.icon1 = "ios-eye";
        } else {
          this.passType1 = "password";
          this.icon1 = "ios-eye-outline";
        }
      } else {
        if (this.passType2 == "password") {
          this.passType2 = "text";
          this.icon2 = "ios-eye";
        } else {
          this.passType2 = "password";
          this.icon2 = "ios-eye-outline";
        }
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
    getList(page) {
      var that = this;
      this.departmentList.map(item => {
        if (item.name == this.formItem.departmentName) {
          this.formItem.departmentId = item.id;
        }
      });
      var params = {
        judgeNo: this.formItem.judgeNo,
        name: this.formItem.name,
        phone: this.formItem.phone,
        courtId: this.formItem.departmentId,
        workYear: this.formItem.workYear,
        createDate:
          this.formItem.createDate &&
          new Date(this.formItem.createDate).getTime()
      };
      params.pageNumber = page;
      list(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            that.judgedata = data.result.content;
            that.pageNumber = data.result.pageNumber;
            that.totalPage = data.result.totalPage;
          } else {
            that.$Message.info(data.message);
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 查询法官列表失败");
        });
    },
    addJudge() {
      this.$refs.judgeTable.clearCurrentRow();
    },
    save() {
      var that = this;
      that.saved = true;
      this.departmentList.map(item => {
        if (item.name == this.info.departmentName) {
          this.info.departmentId = item.id;
        }
      });
      if (this.info.newPassword != null) {
        if (
          this.info.newPassword.length > 0 &&
          this.info.newPassword.length < 6
        ) {
          this.$Message.error("密码需大于6位");
          this.saved = false;
          return false;
        }
        if (this.info.newPassword != this.info.rePassword) {
          this.$Message.error("两次密码不一致");
          this.saved = false;
          return false;
        }
      } else if (this.info.rePassword != null) {
        console.log(this.info.rePassword);
        if (this.info.rePassword.length < 6) {
          this.$Message.error("密码需大于6位");
          this.saved = false;
          return false;
        }
        if (this.info.newPassword != this.info.rePassword) {
          this.$Message.error("两次密码不一致");
          this.saved = false;
          return false;
        }
      }

      var params = {
        judgeNo: this.info.judgeNo,
        name: this.info.name,
        birthday:
          this.info.birthdayD && new Date(this.info.birthdayD).getTime(),
        phone: this.info.phone,
        telephone: this.info.telephone,
        openNum: this.info.openNum,
        identity: this.info.identity,
        courtId: this.info.departmentId ? this.info.departmentId : "",
        emergencyContact: this.info.emergencyContact,
        emergencyPhone: this.info.emergencyPhone,
        workYear: this.info.workYear,
        remark: this.info.remark,
        newPassword: this.info.newPassword,
        rePassword: this.info.rePassword
      };

      if (this.cardState === 2) {
        params.identity = this.info.identity; // 添加信息要传身份证号
        add(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
              this.info.judgeNo = "";
              this.info.name = "";
              this.info.telephone = "";
              this.info.birthdayD = "";
              this.info.phone = "";
              this.info.openNum = "";
              this.info.departmentName = "";
              this.info.emergencyContact = "";
              this.info.emergencyPhone = "";
              this.info.workYear = "";
              this.info.remark = "";
              this.info.identity = "";
              this.info.newPassword = "";
              this.info.rePassword = "";
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
              this.info.judgeNo = "";
              this.info.name = "";
              this.info.birthdayD = "";
              this.info.phone = "";
              this.info.telephone = "";
              this.info.openNum = "";
              this.info.departmentName = "";
              this.info.emergencyContact = "";
              this.info.emergencyPhone = "";
              this.info.workYear = "";
              this.info.remark = "";
              this.info.identity = "";
              this.info.newPassword = "";
              this.info.rePassword = "";
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
    delJudge() {
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
          that.checkIds=[]
          that.checkNames=[]
          console.log(that.checkIds)
          
        //   for (let index = 0; index < that.checkIds.length; index++) {
        //       const element = array[index];
              
        //   }
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
        arr2.push(el.name);
      }
      this.checkNames = arr2;
      this.checkIds = arr;
    },
    changePage(p) {
      this.getList(p);
    },
    clean() {
      this.formItem = {
        clerkNo: "",
        name: "",
        phone: "",
        department: "",
        workYear: "",
        createDate: ""
      };
    },
    toAdd() {
      this.cardState = 2;
      this.info = {
        judgeNo: "",
        name: "",
        birthdayD: "",
        telephone:'',
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
