<template lang="html">
  <div>
    <Card class="search-wrapper">
      <Form class="search-form" :model="searchData" :label-width="80" inline @keydown.native.enter.prevent="searchList">
        <FormItem label="案号">
          <Input v-model="searchData.caseNo" placeholder="请输入案号" style="width: 200px" />
        </FormItem>
        <FormItem label="案由">
          <Select clearable filterable v-model="searchData.briefName" placeholder="请选择案由" style="width: 200px;vertical-align:middle;">
            <Option v-for="item in reasonList" :value="item.brief" :key="item.brief">{{ item.brief }}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态">
          <Select clearable v-model="searchData.state" placeholder="请选择状态" style="width: 200px;vertical-align:middle;">
            <Option value="0">待确认</Option>
            <!-- <Option value="1">调期待确认</Option> -->
            <Option value="2">已确认</Option>
          </Select>
        </FormItem>
        <FormItem label="法庭">
          <Input v-model="searchData.tribunalName" placeholder="请输入法庭" style="width: 200px" />
        </FormItem>
        <FormItem label="审判员">
          <Input v-model="searchData.judgeName" placeholder="请输入审判员" style="width: 200px" />
        </FormItem>
        <FormItem label="书记员">
          <Input v-model="searchData.clerkName" placeholder="请输入书记员" style="width: 200px" />
        </FormItem>
        <FormItem label="当事人">
          <Input v-model="searchData.litigantName" placeholder="请输入当事人" style="width: 200px" />
        </FormItem>
        <FormItem label="开庭时间">
          <DatePicker v-model="searchData.date" format="yyyy/MM/dd" type="daterange" placement="bottom-start" placeholder="请选择开庭时间" style="width: 200px"></DatePicker>
        </FormItem>
        <div style="text-align:right;" class="btn-group">
          <FormItem>
              <Button type="primary" @click="searchList">查询</Button>
              <Button type="ghost" @click="emptySearchList" style="margin-left: 8px">清空</Button>
          </FormItem>
        </div>
      </Form>
    </Card>
    <Card>
      <div class="table-btn-group">
        <Button @click="handleSelectAll(true)">全选</Button>
        <Button type="primary" @click="checkAllComfirm(1)">批量原告</Button>
        <Button type="primary" @click="checkAllComfirm(2)">批量被告</Button>
      </div>
      <Alert show-icon>已选择
        <span style="color: #40a9ff;font-weight:600;font-size:16px;margin: 0 3px;">{{ tableSelectedNum }}</span>项
        <a href="javascript:;" @click="handleSelectAll(false)" style="margin-left: 30px;">清空</a>
      </Alert>
      <Table
        ref="selection"
        border
        stripe
        :columns="columns"
        :data="tableData"
        @on-select="onSelect"
        @on-select-all="onSelectAll"
        @on-selection-change="onSelectChange"></Table>
        <div class="page-wrapper">
          <Page
            :total="Number(pageData.total)"
            :page-size="pageData.pageSize"
            :current="pageData.pageNumber"
            :page-size-opts="[5,10,20]"
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
            show-sizer></Page>
        </div>
    </Card>
    <Modal
        v-model="detailModal"
        width="630"
        :cancel-text="isDateState ? '驳回' : ''"
        :ok-text="isDateState ? '同意' : '关闭'"
        @on-cancel="changeDateCancel"
        title="确认排期详情">
        <table class="bookbuilding-table" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td>案号</td>
                <td>
                    <span>{{ caseInfo.caseNo }}</span>
                </td>
                <td>审判员</td>
                <td>
                    <span>{{ caseInfo.judge }}</span>
                </td>
            </tr>
            <tr>
                <td>开庭时间</td>
                <td style="position: relative;">
                    <span v-show="!isDateState">{{ caseInfo.time | formatStartDate }}</span>
                    <DatePicker v-show="isDateState" placement="bottom-start" type="date" confirm :options="dateOptions" :open="datePickerOpen" transfer @on-change="selectDate" @on-ok="submitDate" @on-clear="clearDate" style="width: 98%;vertical-align:baseline;">
                        <a href="javascript:void(0)" @click="handleClick">
                            <Icon type="ios-calendar-outline"></Icon>
                            <template v-if="caseInfo.time === ''">选择时间</template>
                            <template v-else>{{ caseInfo.time | formatStartDate }}</template>
                        </a>
                    </DatePicker>
                    <div class="ivu-select-dropdown time-wrapper" v-show="selectTime">
                        <ul>
                            <li v-for="(item, index) in timeList" :class="{ 'checked': item.isCheck, 'disable': !item.able }" @click="selectTimeVal(index)">{{ item.value }}</li>
                        </ul>
                    </div>
                </td>
                <td>开庭地址</td>
                <td>
                    <span>{{ caseInfo.court }}</span>
                </td>
            </tr>
            <tr>
              <tr>
                  <td>审判法庭</td>
                  <td>
                      <span v-show="!isDateState">{{ caseInfo.room }}</span>
                      <Select v-show="isDateState" v-model="caseInfo.room" style="width: 98%;vertical-align:middle;">
                          <Option v-for="item in roomList" :value="item" :key="item">{{ item }}</Option>
                      </Select>
                  </td>
              </tr>
            </tr>
        </table>
        <Table height="200" :columns="detailColumns" :data="detailData" style="margin-top: 10px;"></Table>
    </Modal>
  </div>
</template>

<script>
import {
  courtList2,
  confirmDetail,
  confirm,
  holiday,
  findDayTimes,
  modify,
  confirmOne
} from "@/api/courtDate";
import { formatDate } from "@/libs/date";
import { getBrief, getTribunal } from "@/api/global";
export default {
  data() {
    return {
      searchData: {
        caseNo: this.$store.getters.caseNo,
        judgeName: "",
        clerkName: "",
        tribunalName: "",
        briefName: "",
        state: "",
        startDate: "",
        endDate: "",
        date: "",
        litigantName: ""
      },
      pageData: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      onSelectData: [],
      reasonList: [],
      tableSelectedNum: 0,
      columns: [
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
          width: 200,
          fixed: "left"
        },
        {
          title: "案由",
          key: "brief",
          align: "center",
          width: 180
        },
        {
          title: "立案时间",
          key: "filingDate",
          align: "center",
          width: 150
        },
        {
          title: "法庭",
          key: "address",
          align: "center",
          width: 200
        },
        {
          title: "开庭时间",
          key: "startDate",
          align: "center",
          width: 160
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
        // {
        //     title: '状态',
        //     key: 'state',
        //     align: 'center',
        //     fixed: 'right',
        //     width: 100,
        //     render: (h, params) => {
        //         if (params.row.state == 2) {
        //             return h(
        //                 'Button',
        //                 {
        //                     props: {
        //                         type: 'success',
        //                         size: 'small'
        //                     }
        //                 },
        //                 '已确认'
        //             );
        //         } else if (params.row.state == 1) {
        //             return h(
        //                 'Button',
        //                 {
        //                     props: {
        //                         type: 'warning',
        //                         size: 'small'
        //                     }
        //                 },
        //                 '调期确认'
        //             );
        //         } else {
        //             return h(
        //                 'Button',
        //                 {
        //                     props: {
        //                         type: 'error',
        //                         size: 'small'
        //                     }
        //                 },
        //                 '待确认'
        //             );
        //         }
        //     }
        // },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 120,
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
                      this.isDateState = params.row.state == 1;
                      this.detailModal = true;
                      this.detailData = [];
                      confirmDetail(params.row.id).then(res => {
                        if (res.data.state == 100) {
                          res.data.result.detail.map(item => {
                            let objectData = {
                              name: item.name,
                              status: item.status,
                              isConfirm:
                                item.isConfirm == null ? "0" : item.isConfirm,
                              remark: item.remark == null ? "" : item.remark,
                              smsState: item.smsState,
                              litigantId: item.id
                            };
                            this.detailData.push(objectData);
                          });
                          this.caseInfo.schedulingId = params.row.id;
                          this.caseInfo.caseNo = res.data.result.case.caseNo;
                          this.caseInfo.judge = res.data.result.case.name;
                          this.caseInfo.judgeId = res.data.result.case.judgeId;
                          this.caseInfo.time = res.data.result.case.startDate;
                          this.time = res.data.result.case.startDate;
                          this.caseInfo.court = res.data.result.case.address;
                          this.caseInfo.room =
                            res.data.result.case.tribunalName;
                          this.caseInfo.courtId = res.data.result.case.courtId;
                          getTribunal(this.caseInfo.courtId).then(res => {
                            this.roomList = [];
                            this.roomListData = [];
                            res.data.result.map(item => {
                              let data = {
                                value: item.id,
                                name: item.name
                              };
                              this.roomList.push(item.name);
                              this.roomListData.push(data);
                            });
                          });
                        }
                      });
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      detailColumns: [
        {
          title: "姓名",
          key: "name",
          align: "center",
          width: 120
        },
        {
          title: "角色",
          key: "status",
          align: "center",
          width: 120
        },
        {
          title: "操作",
          key: "isConfirm",
          align: "center",
          width: 120,
          render: (h, params) => {
            if (params.row.smsState == 1) {
              return h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small"
                  }
                },
                "已发送"
              );
            } else if (params.row.smsState == 0) {
              return h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small"
                  }
                },
                "已发送"
              );
            } else {
              return h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      confirmOne(
                        this.caseInfo.schedulingId,
                        1,
                        params.row.litigantId
                      ).then(res => {
                        if (res.data.state == 100) {
                          this.$Message.success(res.data.message);
                          this.onRefreshList();
                          params.row.smsState = 0;
                        } else {
                          this.$Message.error(res.data.message);
                        }
                      });
                    }
                  }
                },
                "发送"
              );
            }
          }
        },
        {
          title: "短信状态",
          key: "isConfirm",
          align: "center",
          width: 120,
          render: (h, params) => {
            if (params.row.smsState == 1) {
              return h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  }
                },
                "已送达"
              );
            } else if (params.row.smsState == 0) {
              return h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  }
                },
                "发送中"
              );
            } else {
              return h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  }
                },
                "待送达"
              );
            }
          }
        },
        {
          title: "反馈",
          key: "remark",
          align: "center"
        }
      ],
      detailData: [],
      tableData: [],
      detailModal: false,
      caseInfo: {
        schedulingId: "",
        caseNo: "",
        judge: "",
        room: "",
        judgeId: "",
        time: "",
        court: "",
        courtId: ""
      },
      roomList: [],
      roomListData: [],
      dateOptions: {
        disabledDate: date => {
          let array = this.disabledDateArr;
          return (
            date &&
            (date.valueOf() < Date.now() ||
              array.indexOf(date.valueOf()) !== -1)
          );
        }
      },
      selectTime: false,
      datePickerOpen: false,
      timeList: [],
      loading: true,
      isDateState: false,
      time: ""
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
    changeLoading() {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    },
    handleClick() {
      this.disabledDateArr = [];
      let pushArr = [];
      this.datePickerOpen = !this.datePickerOpen;
      if (this.selectTime) {
        this.selectTime = false;
      }
      holiday(this.judgeId).then(res => {
        if (res.data.state == 100) {
          res.data.result.holidays.map((item, index) => {
            pushArr.push(item.date);
          });
          res.data.result.judgeVacations.map((item, index) => {
            let startDateHours = formatDate(
              new Date(item.leaveStartDate),
              "hh"
            );
            let endDateHours = formatDate(new Date(item.leaveCloseDate), "hh");
            let startDate = formatDate(
              new Date(item.leaveStartDate),
              "yyyy-MM-dd"
            );
            let endDate = formatDate(
              new Date(item.leaveCloseDate),
              "yyyy-MM-dd"
            );
            let oneDay = 60 * 60 * 24 * 1000;
            if (startDateHours == "08") {
              pushArr.push(new Date(startDate).getTime() - 60 * 60 * 8 * 1000);
            }
            if (endDateHours == "17") {
              pushArr.push(new Date(endDate).getTime() - 60 * 60 * 8 * 1000);
            }
            let stepDate = new Date(startDate).getTime() + oneDay;
            while (stepDate < new Date(endDate).getTime()) {
              pushArr.push(stepDate - 60 * 60 * 8 * 1000);
              stepDate += oneDay;
            }
          });
          this.disabledDateArr = pushArr;
        }
      });
    },
    selectDate(value) {
      const month = new Date(value).getMonth() + 1;
      if (!this.clear) {
        this.caseInfo.time = value;
        this.selectTime = true;
        let data = new Date(value).getTime();
        findDayTimes(data, this.caseInfo.judgeId).then(res => {
          if (res.data.state == 100) {
            let disableArr = res.data.result.split(",");
            if (
              month == 1 ||
              month == 2 ||
              month == 3 ||
              month == 4 ||
              month == 5 ||
              month == 10 ||
              month == 11 ||
              month == 12
            ) {
              this.timeList = [
                {
                  value: "08:45",
                  able: true,
                  isCheck: false
                },
                {
                  value: "10:20",
                  able: true,
                  isCheck: false
                },
                {
                  value: "15:00",
                  able: true,
                  isCheck: false
                }
              ];
            } else {
              this.timeList = [
                {
                  value: "08:45",
                  able: true,
                  isCheck: false
                },
                {
                  value: "10:20",
                  able: true,
                  isCheck: false
                },
                {
                  value: "15:30",
                  able: true,
                  isCheck: false
                }
              ];
            }
            disableArr.map(item => {
              if (item != 0) {
                this.timeList[item - 1].able = false;
              }
            });
          } else {
            this.$Message.error(res.data.message);
          }
        });
      } else {
        this.clear = false;
      }
    },
    selectTimeVal(selectIndex) {
      if (this.timeList[selectIndex].able) {
        this.timeList.map((item, index) => {
          if (selectIndex == index) {
            item.isCheck = true;
            this.selectTimer = item.value;
            this.caseInfo.time =
              this.caseInfo.time.split(" ")[0] + " " + this.selectTimer;
          } else {
            item.isCheck = false;
          }
        });
      }
    },
    clearDate() {
      this.clear = true;
      this.selectTime = false;
      this.datePickerOpen = false;
      this.caseInfo.time = this.time;
    },
    submitDate() {
      this.datePickerOpen = false;
      this.selectTime = false;
      if (this.selectTimer == "") {
        this.$Message.error("请选择开庭时间，否则将无法提交");
      }
    },
    changeDateOk() {
      if (this.isDateState) {
        var tribunalId;
        this.roomListData.map(item => {
          if (this.caseInfo.room == item.name) {
            tribunalId = item.value;
          }
        });
        modify(
          this.caseInfo.schedulingId,
          tribunalId,
          new Date(this.caseInfo.time).getTime()
        )
          .then(res => {
            if (res.data.state === 100) {
              this.$Message.success("修改成功！");
              this.changeLoading();
              this.detailModal = false;
              this.onRefreshList();
            } else {
              this.changeLoading();
              this.$Message.error(res.data.message);
            }
          })
          .catch(() => {
            this.changeLoading();
          });
      }
      // else {
      //   confirm(this.caseInfo.schedulingId, 1).then(res => {
      //     if (res.data.state == 100) {
      //       this.$Message.success(res.data.message);
      //       this.onRefreshList();
      //       this.changeLoading();
      //       this.detailModal = false;
      //     } else {
      //       this.$Message.error(res.data.message);
      //       this.changeLoading();
      //     }
      //   });
      // }
    },
    changeDateCancel() {
      if (this.isDateState) {
        this.$Modal.confirm({
          content: "是否直接确认排班？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            confirm(this.caseInfo.schedulingId, 1).then(res => {
              if (res.data.state == 100) {
                this.$Message.success(res.data.message);
                this.onRefreshList();
              } else {
                this.$Message.error(res.data.message);
              }
            });
          },
          onCancel: () => {}
        });
      } else {
      }
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    onSelect(selection, row) {
      this.tableSelectedNum = selection.length;
    },
    onSelectAll(selection) {
      this.tableSelectedNum = selection.length;
    },
    onSelectChange(selection) {
      this.onSelectData = selection;
      this.tableSelectedNum = selection.length;
    },
    checkAllComfirm(dex) {
      let schedulingId = "";
      this.onSelectData.map((item, index) => {
        if (index == this.onSelectData.length - 1) {
          schedulingId += item.id;
        } else {
          schedulingId += item.id + ",";
        }
      });
      confirm(schedulingId, 1, dex).then(res => {
        if (res.data.state == 100) {
          this.$Message.success(res.data.message);
          this.onRefreshList();
        } else {
          this.$Message.error(res.data.message);
        }
      });
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
    emptySearchList() {
      this.searchData.caseNo = "";
      this.searchData.judgeName = "";
      this.searchData.clerkName = "";
      this.searchData.state = "";
      this.searchData.briefName = "";
      this.searchData.tribunalName = "";
      this.searchData.startDate = "";
      this.searchData.endDate = "";
      this.searchData.litigantName = "";
      this.searchData.date = [];
      this.pageData.pageNum = 1;
      this.pageData.pageSize = 10;
      this.onRefreshList();
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
    onRefreshList() {
      console.log(this.searchData.litigantName);
      this.$store.commit("SET_CASENO", this.searchData.caseNo);
      courtList2(this.searchData, this.pageData).then(res => {
        this.tableData = [];
        if (res.data.state == 100) {
          let data = res.data.result.content;
          this.pageData.total = res.data.result.total;
          data.map(item => {
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
              id: item.id,
              caseNo: item.lawCase.caseNo,
              brief: item.lawCase.brief.name,
              filingDate: formatDate(
                new Date(item.lawCase.filingDate),
                "yyyy-MM-dd"
              ),
              startDate: startDateFormat,
              address: item.tribunal.name,
              judge: item.judge.name,
              clerk: item.clerk.name,
              state: item.state
            };
            this.tableData.push(contentData);
          });
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

<style lang="less" scoped>
.search-wrapper {
  margin-bottom: 10px;
}
.search-form .ivu-form-item {
  margin-bottom: 10px;
  display:inline-block
}
.btn-group .ivu-form-item {
  margin-bottom: 0px;
}
.table-btn-group {
  padding-bottom: 15px;
}

.page-wrapper {
  margin-top: 10px;
  text-align: right;
}
.bookbuilding-table {
  width: 100%;
  min-width: 600px;
  border: 1px solid #e9eaec;
  tr {
    td {
      border-left: 1px solid #e9eaec;
      border-bottom: 1px solid #e9eaec;
      line-height: 37px;
      text-align: left;
      padding-left: 8px;
    }
    td:first-child {
      border-left: none;
      width: 20%;
    }
    td:nth-child(2) {
      width: 30%;
    }
    td:nth-child(3) {
      width: 20%;
    }
    td:nth-of-type(odd) {
      background: #f8f8f9;
    }
  }
  tr:last-child {
    td {
      border-bottom: none;
    }
  }
}
td.ivu-table-expanded-cell {
  padding: 15px 50px 0px;
  background: #f8f8f9;
}
.time-wrapper {
  width: 150px;
  left: 230px;
  top: 26px;
  li {
    padding-left: 10px;
    cursor: pointer;
  }
  li:hover {
    color: #40a9ff;
  }
  li.checked {
    color: #fff;
    background-color: #40a9ff;
  }
  li.disable {
    color: #aaa;
    cursor: not-allowed;
  }
}
</style>
