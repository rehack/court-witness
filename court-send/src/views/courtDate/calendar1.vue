<template lang="html">
  <div>
    <div class="ivu-table-wrapper" ref="tableWrapper" :style="{'width': '99%', 'height': tableHeight}">
      <div class="ivu-table ivu-table-border ivu-table-with-fixed-top">
        <div class="ivu-table-headerFu">
          <table cellspacing="0" cellpadding="0" border="0" class="calendar-table">
            <tr>
              <th>
                <Select v-model="month" style="width:80px" @on-change="changeMonth">
                    <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </th>
              <th v-for="(item, index) in tableTh" :key="index">{{ item }}</th>
              <th style="width: 15px; height: 41px;"></th>
            </tr>
             <tr v-for="(item, i) in tableData" :key="i">
              <td>{{ item.day | formatDateDay }}</td>
              <td v-for="(userItem, index) in tableTh" :key="index">
                <div v-for="(dayItem, i) in item.dayResult" :key="i">
                  <span v-if="dayItem.scheduldingList[index].schedulding == null"></span>
                  <span v-else>
                    {{ dayItem.time | formatDateTime }},{{ dayItem.scheduldingList[index].schedulding.lawCase.caseNo }} 
                  </span>
                </div> 
              </td>
            </tr>
          </table>
        </div>
        <!-- <div class="ivu-table-body ivu-table-overflowY sss" style="height: 90%">
          <table cellspacing="0" cellpadding="0" border="0" class="calendar-table">
           
          </table>
        </div> -->
        <!-- <div class="ivu-table-fixed" :style="{'width': '150px','height': tableHeight}">
          <div class="ivu-table-fixed-body" style="height: 90%">
            <table cellspacing="0" cellpadding="0" border="0">
              <tr v-for="(item, i) in tableData" :key="i" class="ivu-table-row">
                <td class="ivu-table-hidden">{{ item.day | formatDateDay }}</td>
              </tr>
            </table>
          </div>
        </div> -->
      </div>
    </div>
  </div>

</template>

<script>
import { orderByTimes } from "@/api/courtDate.js";
import { formatDate } from "@/libs/date.js";
import { calendarList } from "@/api/courtDate.js";
import Vue from "vue";

export default {
  data() {
    return {
      tableTh: [],
      tableData: [],
      month: new Date().getMonth(),
      monthList: [
        {
          value: 0,
          label: "一月"
        },
        {
          value: 1,
          label: "二月"
        },
        {
          value: 2,
          label: "三月"
        },
        {
          value: 3,
          label: "四月"
        },
        {
          value: 4,
          label: "五月"
        },
        {
          value: 5,
          label: "六月"
        },
        {
          value: 6,
          label: "七月"
        },
        {
          value: 7,
          label: "八月"
        },
        {
          value: 8,
          label: "九月"
        },
        {
          value: 9,
          label: "十月"
        },
        {
          value: 10,
          label: "十一月"
        },
        {
          value: 11,
          label: "十二月"
        }
      ]
    };
  },
  created: function() {
    this.getCalendatList();
  },
  computed: {
    tableHeight() {
      return document.body.clientHeight - 150 + "px";
    }
  },
  methods: {
    changeMonth() {
      this.getCalendatList();
    },
    getCalendatList() {
      const now = new Date();
      calendarList(now.getFullYear(), this.month + 1, [], "hl").then(res => {
        if (res.data.state == 100) {
          console.log(res.data.result)
          this.tableTh = [];
          this.tableData = res.data.result;
          res.data.result[0].dayResult[0].scheduldingList.map(item => {
            this.tableTh.push(item.judgeName);
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
    formatDateDay(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "MM月dd日");
    },
    formatDateTime(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "hh:mm");
    }
  }
};
</script>

<style lang="less">
.calendar-table {
  width: 100%;
  min-width: 600px;
  tr {
    td {
      text-align: center;
    }
  }
}
td.ivu-table-expanded-cell {
  padding: 15px 50px 0px;
  background: #f8f8f9;
}
.ivu-table-overflowY {
  overflow-y: scroll;
}
.ivu-table-overflowX {
  overflow-x: scroll;
}
.ivu-table-fixed-right-header {
  position: absolute;
  top: -1px;
  right: 0;
  background-color: #f8f8f9;
  border-top: 1px solid #dddee1;
  border-bottom: 1px solid #e9eaec;
}
.ivu-table {
  width: 100%;
}
.ivu-table-headerFu {
    // overflow: scroll;
  tr {
    th {
      text-align: center;
      width: 100px;
    }
  }
}
.ivu-table {
    width: 100%;
    overflow: scroll;
}
</style>
