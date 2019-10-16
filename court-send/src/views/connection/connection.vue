<template>
    <div>
        <Card class="search-wrapper">
            <Row>
                <!-- <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">案件关联</span>
                </Col> -->
                <Col span="24">
                    <Button v-show="!searchFormShow" @click.native="searchFormShow = true" style="margin-bottom: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="searchData" inline :label-width="75" v-show="searchFormShow" @keydown.native.enter.prevent ="searchList">
                        <FormItem label="案号：">
                            <Input style="width: 200px" v-model="searchData.caseNo" />
                        </FormItem>
                        <FormItem label="案由：">
                            <Select v-model="searchData.brief" style="width: 200px;vertical-align:middle;">
                                <Option v-for="item in reasonList" :value="item.brief" :key="item.brief">{{ item.brief }}</Option>
                            </Select>
                        </FormItem>
                        <!-- <FormItem label="法庭">
                <Input style="width: 200px" v-model="searchData.court"/>
                </FormItem> -->
                        <FormItem label="审判员：">
                            <Input style="width: 200px" v-model="searchData.judge" />
                        </FormItem>
                        <FormItem label="书记员：">
                            <Input style="width: 200px" v-model="searchData.clerk" />
                        </FormItem>
                        <FormItem label="开庭时间：">
                            <DatePicker style="width: 200px" type="datetimerange" placement="bottom-start" v-model="searchData.date"></DatePicker>
                        </FormItem>
                        <FormItem label="绑定状态：">
                            <Select style="width: 200px" v-model="searchData.isMaster">
                                <Option value="-1">未绑定</Option>
                                <Option value="1">已绑定</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="关联编号：">
                            <Input style="width: 200px" v-model="searchData.associate" />
                        </FormItem>
                        <FormItem label="当事人：">
                            <Input style="width: 200px" v-model="searchData.litigantName" />
                        </FormItem>
                        <div style="text-align: right; padding-left: 20px">
                            <Button type="ghost" @click="searchList">查询</Button>
                            <Button style="margin-left: 10px" type="ghost" @click="emptySearchList">清空</Button>
                            <Button @click.native="searchFormShow = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        <!-- </Card>
        <Card> -->
            <div class="table-btn-group">
                <!-- <Button type="primary" @click="connection">关联绑定</Button> -->
                <Button type="primary" @click="connectionM">添加关联</Button>
                <!-- <Button type="error" @click="cancelConnection">取消绑定</Button> -->
            </div>
            <!-- <Alert show-icon>已选择
        <span style="color: #40a9ff;font-weight:600;font-size:16px;margin: 0 3px;">{{ tableSelectedNum }}</span>项
        <a href="javascript:;" @click="handleSelectAll(false)" style="margin-left: 30px;">清空</a>
      </Alert> -->
            <Table ref="selection" stripe :columns="col" :data="colData" @on-select="onSelect" @on-selection-change="onSelectChange"></Table>
            <div class="page-wrapper">
                <Page :total="Number(pageData.total)" :page-size="pageData.pageSize" :current="pageData.pageNumber" :page-size-opts="[5,10,20]" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer></Page>
            </div>
        </Card>
        <Modal v-model="connectModal" width="950" :ok-text="'确认'" @on-ok="" title="案件关联">

            <div class="leftCon">
                <div class="table-btn-group" style="border-bottom:1px solid #e9eaec;padding-bottom:20px;padding-left:5px">
                    <h4 style="display:inline-block;margin-top:5px">已关联案件</h4>
                    <Button type="primary" @click="cancelConnection" style="float:right">取消关联</Button>
                </div>
                <div class="adnd">
                    <Table ref="selection" height="220" :columns="connectedCol" :data="connectedData" @on-selection-change="onSelectChangeConed" style="margin-top: 10px;"></Table>
                </div>
                
            </div>

            <div class="rightCon">
                <Form class="search-form" :label-width="60" inline style="border-bottom:1px solid #e9eaec;">
                    <Button type="primary" @click="connection">关联绑定</Button>
                    <FormItem label="案号">
                        <Input placeholder="请输入案号" style="width: 150px" v-model="searchConnectData.caseNo" @keydown.native.enter.prevent ="searchConnectList" />
                        <Button type="primary" @click="searchConnectList">查询</Button>
                        <Button style="margin-left: 10px" type="ghost" @click="emptySearchListFu">清空</Button>
                    </FormItem>
                </Form>
                <!-- <div class="table-btn-group" style="margin-top:5px;">
          
        </div> -->
        <div class="adnd">
            <Table height="220" ref="selection" :columns="detailColumns" :data="noneData" @on-select="onSelectCon" @on-selection-change="onSelectChangeCon" style="margin-top: 10px;"></Table>
        </div>
                
            </div>
        </Modal>
        <Modal v-model="connectionModal" :loading="loading" ok-text="关联" @on-ok="connectionSubmit" width="630" title="案件关联">
            <Form :model="searchData" inline :label-width="100">
                <FormItem label="请选择主案件">
                    <RadioGroup v-model="master">
                        <Radio v-for="item in onSelectData" :label="item.id">{{ item.caseNo }}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import {
  bindList,
  associate,
  associateCancel,
  lawCaseSchedulding,
  lawCaseConnectGet,
  connectList
} from "@/api/connection.js";
import { formatDate } from "@/libs/date";
import { getBrief } from "@/api/global";
export default {
  data() {
    return {
      loading: true,
      searchFormShow: true,
      connectionModal: false,
      master: "",
      connectModal: false,
      reasonList: [],
      noneData: [],
      connectType: 1,
      connectedData: [],
      searchData: {
        caseNo: this.$store.getters.caseNo,
        brief: "",
        court: "",
        judge: "",
        clerk: "",
        date: [],
        startDate: "",
        endDate: "",
        isMaster: "",
        associate: "",
        litigantName: ""
      },
      searchConnectData: {
        caseNo: ""
      },
      pageData: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      tableSelectedNum: 0,
      onSelectData: [],
      nowLawCaseId: "",
      connectedCol: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 210,
          render: (h, params) => {
            if (params.row.isMaster == "主") {
              return h(
                "span",
                {
                  props: {
                    type: "default",
                    size: "small"
                  }
                },
                params.row.caseNo + " (主)"
              );
            } else {
              return h(
                "span",
                {
                  props: {
                    type: "success",
                    size: "small"
                  }
                },
                params.row.caseNo
              );
            }
          }
        },
        {
          title: "案由",
          key: "brief",
          align: "center",
          width: 160
        }
      ],
      detailColumns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 210
        },
        {
          title: "案由",
          key: "brief",
          align: "center",
          width: 160
        }
      ],
      col: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          title: "案号",
          key: "caseNo",
          width: 220,
          align: "center",
          fixed: "left",
          render: (h, params) => {
            if (params.row.isMaster == "关联") {
              return h(
                "a",
                {
                  props: {
                    type: "default",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.connectModal = true;
                      var id = params.row.id;
                      this.master = params.row.id;
                      lawCaseConnectGet(id).then(res => {
                        this.noneData = [];
                        this.searchConnectData.caseNo = "";
                        this.connectedData = [];
                        this.searchhistory = "";
                        this.connectType = 2;
                        if (res.data.state == 100) {
                          let data = res.data.result;
                          console.log(data);
                          data.associateLawCase.map(item => {
                            console.log(item);
                            let contentData = {
                              id: item.id,
                              caseNo: item.caseNo,
                              brief: item.brief.name,
                              isMaster: item.isMaster,
                              isMaster: item.isMaster == true ? "主" : ""
                            };
                            this.connectedData.push(contentData);
                          });
                        } else {
                          this.$Message.error(res.data.message);
                        }
                      });
                    }
                  }
                },
                params.row.caseNo + " (关联)"
              );
            } else {
              return h(
                "a",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      // this.connectModal = true;
                    }
                  }
                },
                params.row.caseNo
              );
            }
          }
        },
        {
          title: "案由",
          key: "brief",
          align: "center",
          width: 120
        },
        {
          title: "立案时间",
          key: "filingDate",
          align: "center",
          width: 120
        },
        {
          title: "法庭",
          key: "tribunal",
          align: "center",
          width: 150
        },
        {
          title: "开庭时间",
          key: "startDate",
          align: "center",
          width: 150
        },
        {
          title: "审判员",
          key: "judge",
          align: "center",
          width: 120
        },
        {
          title: "书记员",
          key: "clerk",
          align: "center",
          width: 120
        },
        {
          title: "绑定状态",
          key: "colIsMaster",
          align: "center",
          width: 120
        },
        {
          title: "关联编码",
          key: "associate",
          align: "center",
          width: 120
        }
        // {
        //   title: '操作',
        //   key: 'action',
        //   align: 'center',
        //   fixed: 'right',
        //   width: 120,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('Button', {
        //         props: {
        //           type: 'text',
        //           size: 'small'
        //         },
        //         on:{
        //           click: () => {
        //             }
        //           }
        //       }, '查看')
        //     ])
        //   }
        // }
      ],
      colData: [],
      searchhistory: ""
    };
  },
  created() {
    this.onRefreshList();
    getBrief()
      .then(res => {
        if (res.data.state === 100) {
          this.reasonList = res.data.result;
        }
      })
      .catch(error => {});
  },
  methods: {
    connectionM() {
      this.noneData = [];
      this.searchhistory = "";
      this.searchConnectData.caseNo = "";
      this.connectedData = [];
      this.onSelectData = [];
      this.connectType = 1;
      this.connectModal = true;
    },

    searchConnectList() {
      this.pageData.pageNumber = 1;
      if (this.searchhistory == this.searchConnectData.caseNo) {
        return false;
      }
      this.searchhistory = this.searchConnectData.caseNo;
      console.log(this.searchhistory);
      connectList(this.searchConnectData.caseNo).then(res => {
        // this.noneData = [];
        if (res.data.state == 1) {
          let data = res.data.result;
          console.log(data);
          this.pageData.total = data.total;
          data.map(item => {
            let contentData = {
              id: item.id,
              caseNo: item.caseNo,
              brief: item.brief.name,
              filingDate: formatDate(new Date(item.filingDate), "yyyy-MM-dd"),
              isMaster: item.isMaster,
              colIsMaster: item.isMaster == null ? "未绑定" : "已绑定",
              associate: item.associate == null ? "无" : item.associate,
              isMaster: item.isMaster == null ? " " : "关联"
            };
            this.noneData.push(contentData);
          });
        }
      });
    },
    changeLoading() {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    pageChange(pageNum) {
      this.pageData.pageNumber = pageNum;
      this.tableSelectedNum = 0;
      this.onRefreshList();
    },
    pageSizeChange(pageSize) {
      this.pageData.pageSize = pageSize;
      this.tableSelectedNum = 0;
      this.onRefreshList();
    },
    onSelect(selection, row) {
      this.tableSelectedNum = selection.length;
    },
    onSelectCon(selection, row) {},
    onSelectChangeCon(selection) {
      this.onSelectData = selection;
    },
    onSelectChangeConed(selection) {
      this.onSelectData = selection;
    },
    onSelectChange(selection) {
      this.onSelectData = selection;
      this.tableSelectedNum = selection.length;
    },
    searchList() {
      if (this.searchData.date.length == 2) {
        if (this.searchData.date[0] == "") {
          this.searchData.startDate = this.searchData.date[0];
        } else {
          this.searchData.startDate = new Date(
            this.searchData.date[0]
          ).getTime();
        }
        if (this.searchData.date[1] == "") {
          this.searchData.endDate = this.searchData.date[1];
        } else {
          this.searchData.endDate =
            new Date(this.searchData.date[1]).getTime() +
            60 * 60 * 23 * 1000 +
            59 * 60 * 1000 +
            59 * 1000;
        }
      }
      this.onRefreshList();
    },
    emptySearchListFu(){
        this.searchConnectData.caseNo = "";
    },
    emptySearchList() {
      this.searchData.caseNo = "";
      this.searchData.brief = "";
      this.searchData.court = "";
      this.searchData.judge = "";
      this.searchData.clerk = "";
      this.searchData.isMaster = "";
      this.searchData.startDate = "";
      this.searchData.endDate = "";
      this.searchData.date = [];
      this.searchData.associate = "";
      this.searchData.litigantName = "";
      this.pageData.pageNum = 1;
      this.pageData.pageSize = 10;
      this.onRefreshList();
      this.noneData = [];
      
    },
    onRefreshList() {
      this.$store.commit("SET_CASENO", this.searchData.caseNo);
      bindList(this.searchData, this.pageData).then(res => {
        this.colData = [];
        if (res.data.state == 100) {
          let data = res.data.result;
          this.pageData.total = data.total;
          data.content.map(item => {
            try {
              var startDateFormat = formatDate(
                new Date(item.startDate.replace(/-/g, "/")),
                "yyyy-MM-dd hh:mm"
              );
            } catch (e) {
              var startDateFormat = formatDate(
                new Date(item.startDate),
                "yyyy-MM-dd hh:mm"
              );
            }
            let contentData = {
              id: item.lawCase.id,
              caseNo: item.lawCase.caseNo,
              brief: item.lawCase.brief.name,
              filingDate: formatDate(
                new Date(item.lawCase.filingDate),
                "yyyy-MM-dd"
              ),
              tribunal: item.tribunal.name,
              startDate: startDateFormat,
              address: item.tribunal.name,
              judge: item.judge.name,
              clerk: item.clerk.name,
              isMaster: item.lawCase.isMaster,
              colIsMaster: item.lawCase.isMaster == null ? "未绑定" : "已绑定",
              associate:
                item.lawCase.associate == null ? "无" : item.lawCase.associate,
              isMaster: item.lawCase.isMaster == null ? " " : "关联"
            };
            this.colData.push(contentData);
          });
        }
      });
    },
    connection() {
      if (this.connectType == 1) {
        // 选主案件
        if (this.onSelectData.length == 0) {
          this.$Message.info("请选择需要关联的案件");
        } else {
          this.connectionModal = true;
        }
      } else {
        // 发送绑定id
        let slaveIds = "";
        this.onSelectData.map((item, index) => {
          if (index != this.onSelectData.length - 1) {
            slaveIds += item.id + ",";
          } else {
            slaveIds += item.id;
          }
        });
        associate(slaveIds, this.master).then(res => {
          if (res.data.state == 100) {
            this.connectionModal = false;
            this.$Message.success(res.data.message);
            this.changeLoading();
            console.log(this.onSelectData);
            for (var i = 0; i < this.onSelectData.length; i++) {
              this.connectedData.push(this.onSelectData[i]);
            }
            for (var i = 0; i < this.noneData.length; i++) {
              for (var m = 0; m < this.onSelectData.length; m++) {
                if (this.onSelectData[m].id == this.noneData[i].id) {
                  this.noneData.splice(i, 1);
                }
              }
            }
          } else {
            this.$Message.error(res.data.message);
            this.changeLoading();
          }
        });
      }
    },
    cancelConnection() {
      if (this.onSelectData.length == 0) {
        this.$Message.error("请选择需要取消关联的案件");
      } else {
        var connectIds = "";
        var idArr = [];
        this.onSelectData.map((item, index) => {
          if (index != this.onSelectData.length - 1) {
            connectIds += item.id + ",";
          } else {
            connectIds += item.id;
          }
          idArr.push(item.id);
        });
        associateCancel(connectIds, this.master).then(res => {
          if (res.data.state == 100) {
            this.$Message.success(res.data.message);
            this.onRefreshList();
            // this.connectedData
            for (var i = 0; i < this.connectedData.length; i++) {
              for (var m = 0; m < idArr.length; m++) {
                if (idArr[m] == this.connectedData[i].id) {
                  this.connectedData.splice(i, 1);
                }
              }
            }
          } else {
            this.$Message.error(res.data.message);
          }
        });
      }
    },
    connectionSubmit() {
      let slaveIds = "";
      this.onSelectData.map((item, index) => {
        if (item.id != this.master) {
          if (index != this.onSelectData.length - 1) {
            slaveIds += item.id + ",";
          } else {
            slaveIds += item.id;
          }
        }
      });
      associate(slaveIds, this.master).then(res => {
        if (res.data.state == 100) {
          this.connectionModal = false;
          this.$Message.success(res.data.message);
          this.changeLoading();
          console.log(this.onSelectData);
          for (var i = 0; i < this.onSelectData.length; i++) {
            if (this.master == this.onSelectData[i].id) {
              this.onSelectData[i].isMaster = "主";
            }
            this.connectedData.push(this.onSelectData[i]);
          }
          for (var i = 0; i < this.noneData.length; i++) {
            for (var m = 0; m < this.onSelectData.length; m++) {
              if (this.onSelectData[m].id == this.noneData[i].id) {
                this.noneData.splice(i, 1);
              }
            }
          }
        } else {
          this.$Message.error(res.data.message);
          this.changeLoading();
        }
      });
    }
  },
  filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    whether(boole) {
      return boole ? "是" : "否";
    },
    filCheck(boole) {
      return boole == 0 ? "未确认" : "已确认";
    },
    formatStartDate(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  }
};
</script>

<style lang="less">
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
.leftCon {
  width: 49%;
  display: inline-block;
  border: 1px solid #e9eaec;
  min-height: 300px;
  padding: 5px;
}
.rightCon {
  width: 49%;
  display: inline-block;
  float: right;
  border: 1px solid #e9eaec;
  min-height: 300px;
  padding: 5px;
}
.page-wrapper {
  margin-top: 10px;
  text-align: right;
}
.adnd .ivu-checkbox-inner {
  border: 1px solid black;
}
</style>
