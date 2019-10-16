<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                {{ op[cardState] }}审判庭信息
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        法庭编号
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ info.tribunalNo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        法庭名称
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
                        归属
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.courtName" style="width:100%">
                            <Option v-for="item in courtNameList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.courtName }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        地址
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.address" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.address }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        使用状态
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <!-- <Select v-model="info.state" style="width:100%">
                            <Option value="0">不可用</Option>
                            <Option value="1">正常使用</Option>
                        </Select> -->
                        <RadioGroup v-model="info.state">
                            <Radio label="1">
                                <span>正常使用</span>
                            </Radio>
                            <Radio label="0">
                                <span>不可用</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.state ? '正常使用' : '不可用' }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        法庭类型
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <!-- <Select v-model="info.type" style="width:100%">
                            <Option value="0">普通法庭</Option>
                            <Option value="1">科技法庭</Option>
                        </Select> -->
                        <RadioGroup v-model="info.type">
                            <Radio label="0">
                                <span>普通法庭</span>
                            </Radio>
                            <Radio label="1">
                                <span>科技法庭</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.type ? '科技法庭' : '普通法庭' }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        是否自动排期
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <RadioGroup v-model="info.isAuto">
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="0">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.isAuto ? '是' : '否' }}
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
                    <span style="color:#464c5b;font-size:16px;font-weight:700">审判庭信息库</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="getList(1)">
                        <FormItem label="法庭编号：">
                            <Input style="width: 200px" v-model="formItem.tribunalNo"/>
                        </FormItem>
                        <FormItem label="法庭名称：">
                            <Input style="width: 200px" v-model="formItem.name"/>
                        </FormItem>
                        <FormItem label="归属：">
                            <Select style="width: 200px" v-model="formItem.courtName">
                                <Option v-for="item in courtNameList" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="使用状态：">
                            <Select v-model="formItem.state" style="width: 200px">
                                <Option value="true">不可用</Option>
                                <Option value="false">正常使用</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="法庭类型：">
                            <Select v-model="formItem.type" style="width: 200px">
                                <Option value="0">普通法庭</Option>
                                <Option value="1">科技法庭</Option>
                            </Select>
                        </FormItem>
                        <div style="display: inline-block; padding-left: 20px">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ButtonGroup style="margin-top: 10px; margin-bottom: 10px">
                <Button @click="toAdd" size="large" type="primary">添加</Button>
                <!-- <Button @click="exportExcel" size="large">导出excel</Button> -->
                <Button @click="modal2 = true" size="large" type="ghost">删除</Button>
            </ButtonGroup>
            <Table stripe ref="tribunalTable" :columns="tribunalcol" :data="tribunaldata" @on-selection-change="tableCheck"></Table>
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
                <Button type="error" size="large" long :loading="del_loading" @click="deltribunal">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
var tr = require("../../api/tribunalInfo.js");
import { courtList } from "../../api/global.js";
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
      courtNameList: [],
      formItem: {
        tribunalNo: "",
        name: "",
        courtName: "",
        state: "",
        type: ""
      },
      tribunalcol: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "法庭编号",
          key: "tribunalNo",
          align: "center",
          width: 100
        },
        {
          title: "法庭名称",
          key: "name",
          align: "center",
          ellipsis: true
        },
        {
          title: "地址",
          key: "address",
          align: "center"
        },
        {
          title: "归属",
          key: "court",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.court.name);
          }
        },
        {
          title: "使用状态",
          key: "state",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.state ? "正常使用" : "不可用");
          }
        },
        {
          title: "法院类型",
          key: "type",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.type ? "科技法庭" : "普通法庭");
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
                      this.info = JSON.parse(JSON.stringify(c));
                      this.info.courtName = c.court.name;
                      
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
                      this.info.courtName = c.court.allName;
                      this.info.state = c.state ? '1' : '0';
                      this.info.type = c.type ? '1' : '0';
                      this.info.isAuto = c.isAuto ? '1' : '0';
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
      tribunaldata: [],
      info: {
        tribunalNo: "",
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
      this.formItem.state=""
    this.getList(1);
    
    courtList().then(res => {
        res.data.result.map(item => {
            this.courtNameList.push(item.name);
        });
    })
  },
  methods: {
    getList(page) {
      var that = this;
      var params = this.formItem;
      console.log(params.state)
      if (this.formItem.state=="") {
          params.state=''
      }else{
          params.state = params.state == "true" ? "0" : "1";
      }
      
      params.pageNumber = page;
      tr
        .list(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            that.tribunaldata = data.result.content;
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
    addtribunal() {
      this.$refs.tribunalTable.clearCurrentRow();
    },
    save() {
      var that = this;
      that.saved = true;
      console.log(that.info);
      if (this.cardState === 2) {
        tr
          .add(that.info)
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
        tr
          .update(that.info)
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
    deltribunal() {
      this.spinShow = true;
      this.modal2 = false;
      var that = this;
      tr
        .del(that.checkIds)
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
        arr.push(el.tribunalNo);
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
        tribunalNo: "",
        name: "",
        courtName: "",
        state: "",
        type: ""
      };
      this.getList(1);
    },
    toAdd() {
      this.cardState = 2;
      this.info = {
        tribunalNo: "",
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
