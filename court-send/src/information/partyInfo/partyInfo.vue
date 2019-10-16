<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                {{ op[cardState] }}当事人信息
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        当事人编号
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ info.clerkNo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        姓名
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.name" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.name }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        出生年月
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <DatePicker :value="info.birthday" type="date" style="width:100%"></DatePicker>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.birthday }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        身份证号
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.identity" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.identity }}
                    </Col>
                </Row>
                <Row>
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
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        所属部门
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.department" style="width:100%">
                            <Option v-for="item in departmentList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.department }}
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
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        采集时间
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <DatePicker :value="info.createDate" type="date" style="width:100%"></DatePicker>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.createDate }}
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
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        变更次数
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.changeNum" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
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
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.lastModifyPeople" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.lastModifyPeople }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        最后修改时间
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.lastModifyDate" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.lastModifyDate }}
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
                        <FormItem label="当事人编号：">
                            <Input style="width: 128px" v-model="formItem.clerkNo"/>
                        </FormItem>
                        <FormItem label="当事人姓名：">
                            <Input style="width: 128px" v-model="formItem.name"/>
                        </FormItem>
                        <FormItem label="手机号码：">
                            <Input style="width: 128px" v-model="formItem.phone"/>
                        </FormItem>
                        <FormItem label="工作部门：">
                            <Select style="width: 128px" v-model="formItem.department">
                                <Option value="0">XXXX部</Option>
                                <Option value="1">OOOO部</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="工作年限：">
                            <Input style="width: 128px" v-model="formItem.workYear"/>
                        </FormItem>
                        <FormItem label="采集时间：">
                            <DatePicker style="width: 128px" type="date" v-model="formItem.createDate"></DatePicker>
                        </FormItem>
                        <div style="display: inline-block; padding-left: 20px">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <div>
                <Button @click="toAdd" size="large" type="text">添加</Button>
                <Button @click="exportExcel" size="large" type="text">导出excel</Button>
                <Button @click="modal2 = true" size="large" type="text">删除</Button>
            </div>
            <Table stripe ref="clerkTable" :columns="clerkcol" :data="clerkdata" @on-selection-change="tableCheck"></Table>
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
    </div>
</template>
<script>
import { list, add, update, del } from "../../api/clerkInfo.js";
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
      totalPage: 0,
      pageNumber: 0,
      checkIds: [],
      checkNames: [],
      departmentList: ["司法部"],
      formItem: {
        clerkNo: "",
        name: "",
        phone: "",
        department: "",
        workYear: "",
        createDate: ""
      },
      clerkcol: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "当事人编号",
          key: "clerkNo",
          align: "center",
          width: 100
        },
        {
          title: "当事人姓名",
          key: "name",
          align: "center",
          ellipsis: true
        },
        {
          title: "出生年月",
          key: "birthday",
          align: "center"
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
          align: "center"
        },
        {
          title: "采集时间",
          key: "createDate",
          align: "center"
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
                      this.info = JSON.parse(JSON.stringify(c));
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
                      this.info = JSON.parse(JSON.stringify(c));
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
      clerkdata: [],
      info: {
        clerkNo: "",
        name: "",
        birthday: "",
        identity: "",
        phone: "",
        openNum: "",
        department: "",
        emergencyContact: "",
        emergencyPhone: "",
        createDate: "",
        changeNum: "",
        workYear: "",
        remark: "",
        lastModifyPeople: "",
        lastModifyDate: ""
      }
    };
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    getList(page) {
      var that = this;
      var params = this.formItem;
      params.pageNumber = page;
      list(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            that.clerkdata = data.result.content;
            that.pageNumber = data.result.pageNumber;
            that.totalPage = data.result.totalPage;
          } else {
            that.$Message.info(data.message);
          }
        })
        .catch(() => {
          that.$Message.error("网络错误");
        });
    },
    addClerk() {
      this.$refs.clerkTable.clearCurrentRow();
    },
    save() {
      var that = this;
      that.saved = true;
      if (this.cardState === 2) {
        add(that.info)
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
        update(that.info)
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
        arr.push(el.clerkNo);
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
        clerkNo: "",
        name: "",
        birthday: "",
        identity: "",
        phone: "",
        openNum: "",
        department: "",
        emergencyContact: "",
        emergencyPhone: "",
        createDate: "",
        changeNum: "",
        workYear: "",
        remark: "",
        lastModifyPeople: "",
        lastModifyDate: ""
      };
    },
    exportExcel() {}
  }
};
</script>
