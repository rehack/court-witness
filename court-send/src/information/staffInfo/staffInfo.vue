<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                {{ op[cardState] }}工作人员信息
            </p>
            <div class="maininfo-warp">
                <Row>
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
                        出生日期
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <DatePicker :value="info.birthday" type="date" style="width:100%" @on-change="birthdayChange"></DatePicker>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.birthday }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        身份证号
                        <Tooltip v-show="cardState > 1 && !info.identity" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.identity" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 2" span="9" class="maininfo-col">
                        {{ info.identity }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码
                        <Tooltip v-show="cardState > 1 && !info.telephone" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.telephone" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.telephone }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        角色类型
                        <Tooltip v-show="cardState > 1 && !info.type" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.type" clearable style="width:100%">
                              <Option v-for="item in staffTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.typename }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        所属部门
                        <Tooltip v-show="cardState > 1 && !info.courtId" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.courtId" clearable filterable style="width:100%">
                            <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.courtname }}
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
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        紧急联系人电话
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.emergencyPhone" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.emergencyPhone }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        工作年限
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.workYear" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.workYear + '年' }}
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
                        备注
                    </Col>
                    <Col v-show="cardState > 1" span="21" class="maininfo-col">
                        <Input v-model="info.remark" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="21" class="maininfo-col">
                        {{ info.remark }}
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
                    <span style="color:#464c5b;font-size:16px;font-weight:700">工作人员信息库</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="getList(1)">
                        <FormItem label="编号：">
                            <Input style="width: 200px" v-model="formItem.staffNo"/>
                        </FormItem>
                        <FormItem label="姓名：">
                            <Input style="width: 200px" v-model="formItem.name"/>
                        </FormItem>
                        <FormItem label="手机号码：">
                            <Input style="width: 200px" v-model="formItem.telephone"/>
                        </FormItem>
                        <FormItem label="所属部门：">
                          <Select v-model="formItem.courtId" clearable filterable style="width:200px">
                              <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                          </Select>
                        </FormItem>
                        <FormItem label="类型：">
                          <Select v-model="formItem.staffType" clearable style="width:200px">
                              <Option v-for="item in staffTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                          </Select>
                        </FormItem>
                        <FormItem label="工作年限：">
                            <Input style="width: 200px" v-model="formItem.workYear"/>
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
import { list, add, update, del } from "../../api/staffInfo.js";
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
      spinShow: false,
      totalPage: 1,
      pageNumber: 1,
      checkIds: [],
      checkNames: [],
      departmentList: [],
      staffTypeList:[
          {
              id:1,
              name:'工作人员类型'
          },
          {
              id:2,
              name:'诉前工作承办人员'
          },
          {
              id:3,
              name:'系统管理员'
          },
      ],
      formItem: {
        staffNo: "",
        name: "",
        telephone: "",
        courtId: "",
        staffType: "",
        workYear: ""
      },
      judgecol: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "编号",
          key: "staffNo",
          align: "center",
          width: 100
        },
        {
          title: "姓名",
          key: "name",
          align: "center",
          ellipsis: true
        },
        {
          title: "手机号码",
          key: "telephone",
          align: "center"
        },
        {
          title: "身份证号",
          key: "identity",
          align: "center"
        },
        {
          title: "所属部门",
          key: "identity",
          align: "center",
          render:(h,params) => {
              return h("span", {}, params.row.court.name);
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
                      this.info.departmentName = c.court.name;
                      this.info.birthday = c.birthday;
                      this.info.identity = c.identity;
                      this.info.telephone = c.telephone;
                      this.info.type = c.court.name;
                      this.info.typename = c.court.name == 1 ? "窗口登记工作人员" : (c.court.name == 2 ? "诉前工作承办人员" :"系统管理员");
                      this.info.courtId = c.court.id;
                      this.info.courtname = c.court.name;
                      this.info.openNum = c.openNum;                      
                      this.info.emergencyContact = c.emergencyContact;                      
                      this.info.emergencyPhone = c.emergencyPhone;                      
                      this.info.workYear = c.workYear;                      
                      this.info.remark = c.remark;   
                      this.info.staffNo = c.staffNo;                   
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
            //           this.info.departmentName = c.court.name;
            //           this.info.birthday = c.birthday;
            //           this.info.identity = c.identity;
            //           this.info.telephone = c.telephone;
            //           this.info.type = c.type;
            //           this.info.typename = c.court.name == 1 ? "窗口登记工作人员" : (c.court.name == 2 ? "诉前工作承办人员" :"系统管理员");
            //           this.info.courtId = c.court.id;
            //           this.info.courtname = c.court.name;
            //           this.info.openNum = c.openNum;                      
            //           this.info.emergencyContact = c.emergencyContact;                      
            //           this.info.emergencyPhone = c.emergencyPhone;                      
            //           this.info.workYear = c.workYear;                      
            //           this.info.remark = c.remark;   
            //           this.info.staffNo = c.staffNo;
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
          staffNo:"",
        name:"",
        birthday: "",
        identity:"",
        telephone: "",
        type: "",
        courtId: "",
        openNum: "",
        emergencyContact: "",
        emergencyPhone: "",
        workYear: "",
        remark: "",
      }
    };
  },
  mounted() {
    this.getList(1);
    this.getCourtList();
  },
  methods: {
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
      var params = {
        staffNo: this.formItem.staffNo,
        name: this.formItem.name,
        telephone: this.formItem.telephone,
        courtId: this.formItem.courtId,
        staffType: this.formItem.staffType,
        workYear: this.formItem.workYear,
      };
      params.pageNumber = page;
      params.pageSize = 10;
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
      var params = {
        staffNo:this.info.staffNo,
        name:this.info.name,
        birthday: this.info.birthday,
        identity:this.info.identity,
        telephone: this.info.telephone,
        type: this.info.type,
        courtId: this.info.courtId,
        openNum: this.info.openNum,
        emergencyContact: this.info.emergencyContact,
        emergencyPhone: this.info.emergencyPhone,
        workYear: this.info.workYear,
        remark: this.info.remark,
      };

      if (this.cardState === 2) {
        add(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
              this.info ={
                  staffNo:"",
                    name:"",
                    birthday: "",
                    identity:"",
                    telephone: "",
                    type: "",
                    courtId: "",
                    openNum: "",
                    emergencyContact: "",
                    emergencyPhone: "",
                    workYear: "",
                    remark: "",
              }
              this.getList(1);
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
              this.info ={
                  staffNo:"",
                    name:"",
                    birthday: "",
                    identity:"",
                    telephone: "",
                    type: "",
                    courtId: "",
                    openNum: "",
                    emergencyContact: "",
                    emergencyPhone: "",
                    workYear: "",
                    remark: "",
              }
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
        staffNo: "",
        name: "",
        telephone: "",
        courtId: "",
        staffType: "",
        workYear: "",
      };
    },
    toAdd() {
      this.cardState = 2;
      this.info = {
        jobNumber: "",
        name: "",
        phone: "",
        identity: "",
        sex: ""
      };
    },
    birthdayChange(d) {
      this.info.birthday = d;
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
