<template lang="html">
  <div>
    <Card class="search-wrapper">
      <Form class="search-form" :model="searchForm" :label-width="80" inline @keydown.native.enter.prevent="searchList">
        <FormItem label="姓名">
          <Input v-model="searchForm.name" placeholder="请输入姓名" style="width: 200px" />
        </FormItem>
        <FormItem label="日期">
          <DatePicker v-model="searchForm.date" format="yyyy/MM/dd" type="daterange" placement="bottom-start" placeholder="请选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="身份">
          <Select v-model="searchForm.judgeType" style="width:200px">
            <Option value="0">审判员</Option>
            <Option value="1">书记员</Option>
          </Select>
        </FormItem>
        
         <FormItem label="状态">
          <Select v-model="searchForm.state" style="width:200px">
            <Option value="1">锁定</Option>
            <Option value="0">已取消</Option>
          </Select>
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
        <Button icon="plus" type="primary" @click="showAddModal">添加</Button>
      </div>
      <Table
        ref="selection"
        stripe
        border
        :columns="columns"
        :data="tableData" width=""></Table>
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
        v-model="addModal"
        @on-ok="submitAddForm"
        title="添加休息日" class-name="vertical-center-modal" width="430">
        <Form :model="addForm" :label-width="80"  style='margin-top:30px;margin-bottom:30px'>
          <FormItem label="选择时间：">
            <DatePicker v-model="addForm.time" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" style="width: 300px"></DatePicker>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script type="text/javascript">
import { vacationList, vacationCancel, addVacation } from "@/api/vacation";
import { formatDate } from "@/libs/date";
export default {
  data() {
    return {
      searchForm: {
        name: "",
        courtId: "",
        judgeType: "",
        state: "",
        startDate: "",
        endDate: "",
        date: []
      },
      addForm: {
        time: ""
      },
      pageData: {
        pageNumber: 1,
        pageSize: 10,
        total: ""
      },
      columns: [
        {
          title: "姓名",
          key: "name",
          align: "center",
          width: 150
        },
        {
          title: "所属部门",
          key: "courtName",
          align: "center",
          width: 200
        },
        {
          title: "身份",
          key: "judgeType",
          align: "center",
          width: 100,
          render: (h, params) => {
            if (params.row.judgeType == 0) {
              return h("span", {}, "审判员");
            } else {
              return h("span", {}, "书记员");
            }
          }
        },
        {
          title: "日期",
          key: "date",
          align: "center",
          width: 300
        },
        {
          title: "状态",
          key: "state",
          align: "center",
          width: 150,
          render: (h, params) => {
            if (params.row.state) {
              return h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  }
                },
                "锁定"
              );
            } else {
              return h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  }
                },
                "已取消"
              );
            }
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 250,
          render: (h, params) => {
            if (params.row.state) {
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
                        this.cancel(params.row.id);
                      }
                    }
                  },
                  "取消锁定"
                )
              ]);
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#999"
                  }
                },
                "无法操作"
              );
            }
          }
        }
      ],
      tableData: [],
      addModal: false
    };
  },
  created() {
    this.onRefreshList();
  },
  methods: {
    showAddModal() {
      this.addModal = true;
    },
    pageChange(pageNum) {
      this.pageData.pageNumber = pageNum;
      this.onRefreshList();
    },
    pageSizeChange(pageSize) {
      this.pageData.pageSize = pageSize;
      this.onRefreshList();
    },
    searchList() {
      if (this.searchForm.date.length == 2) {
        if (this.searchForm.date[0] == "") {
          this.searchForm.startDate = this.searchForm.date[0];
        } else {
          this.searchForm.startDate = new Date(
            this.searchForm.date[0]
          ).getTime();
        }
        if (this.searchForm.date[1] == "") {
          this.searchForm.endDate = this.searchForm.date[1];
        } else {
          this.searchForm.endDate =
            new Date(this.searchForm.date[1]).getTime() +
            60 * 60 * 23 * 1000 +
            59 * 60 * 1000 +
            59 * 1000;
        }
      }
      this.onRefreshList();
    },
    cancel(id) {
      vacationCancel(id).then(res => {
        if (res.data.state == 100) {
          this.$Message.success(res.data.message);
          this.onRefreshList();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    emptySearchList() {
      this.searchForm.name = "";
      this.searchForm.courtId = "";
      this.searchForm.judgeType = "";
      this.searchForm.state = "";
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.searchForm.date = [];
      this.pageData.pageNum = 1;
      this.pageData.pageSize = 10;
      this.onRefreshList();
    },
    submitAddForm() {
      let startDate = new Date(this.addForm.time[0]).getTime();
      let endDate = new Date(this.addForm.time[1]).getTime();
      addVacation(startDate, endDate).then(res => {
        if (res.data.state == 100) {
          this.$Message.success(res.data.message);
          this.onRefreshList();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    onRefreshList() {
      vacationList(this.searchForm, this.pageData).then(res => {
        this.tableData = [];
        if (res.data.state == 100) {
          let data = res.data.result.content;
          this.pageData.total = res.data.result.total;
          data.map(item => {
            let object = {
              id: item.id,
              name: item.judge.name,
              courtName: item.judge.court.name,
              judgeType: item.judge.judgeType,
              date:
                formatDate(new Date(item.leaveStartDate), "yyyy-MM-dd hh:mm") +
                " 至 " +
                formatDate(new Date(item.leaveCloseDate), "yyyy-MM-dd hh:mm"),
              state: item.state
            };
            this.tableData.push(object);
          });
        }
      });
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
.page-wrapper {
  margin-top: 10px;
  text-align: right;
}
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
    .ivu-table table {
    table-layout: fixed;
    width: 100%!important;
}
</style>
