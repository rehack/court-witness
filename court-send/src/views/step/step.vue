<template>
  <div style="position:relative;">
    <Affix :offset-top="100">
    <Card class="side-bar">
        <p slot="title">
            <Icon type="navicon"></Icon>
            案件搜索
            <span class="close-icon">
                <Icon type="close-round"></Icon>
            </span>
        </p>
        <div class="card-content">
            <Form :model="searchData" :label-width="40" @keydown.native.enter.prevent="searchList">
                <FormItem label="案号">
                    <Input v-model="searchData.caseNo" placeholder="请输入案号" />
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button type="ghost" @click="resetSearch">重置</Button>
                    <Button type="primary" style="margin-left: 8px" @click="searchList">查询</Button>
                </FormItem>
            </Form>
            <div class="search-list">
                <li v-for="item in searchContent" @click="selectCase(item.id)">案号：<br>{{ item.caseNo }}</li>
                <Page @on-change="pageChange" :current="pageData.pageNumber" :total="pageData.total" :page-size="pageData.pageSize" simple style="position:absolute;bottom:10px;left: 50%;margin-left: -80px;"></Page>
            </div>
            <div v-show="emptyData" style="text-align: center;color:#999;">暂无数据</div>
        </div>
    </Card>
    </Affix>
    <div class="right-wrapper" v-show="selectCaseComplete">
      <button style="float:right;z-index: 999;position: absolute;right:30px;top:30px;cursor: pointer;" class="ivu-btn ivu-btn-primary" type="primary" @click="printF">打印</button>
      <Card  id="printArea">
        <!--startprint-->
        <div class="title">案号: {{ caseNo }} </div>
        <mySteps :current="2" direction="vertical" v-show="stepList.length > 0">
            <myStep v-for="(item, index) in stepList" :icon="index == 0 ? 'compose' : '' " :status="index == 0 ? 'process' : 'finish'" :title="item.createDate | formatStartDate" :content="item.operatorContent" :people="item.operatorName"></myStep>
        </mySteps>
        <div v-show="stepList.length == 0" style="text-align: center;color:#999;">
          暂无数据
        </div>
        <!--endprint-->
      </Card>
    </div>
    
  </div>
</template>

<script>
import myStep from "@/components/step";
import mySteps from "@/components/steps";
import { queryProcessNote } from "@/api/global.js";
import { queryCaseNo } from "@/api/case.js";
import { formatDate } from "@/libs/date";
export default {
  components: {
    mySteps: mySteps,
    myStep: myStep
  },
  data() {
    return {
      stepList: [],
      searchData: {
        caseNo: this.$store.getters.caseNo
      },
      pageData: {
        pageNumber: 1,
        pageSize: 5,
        total: 0
      },
      caseNo:'',
      emptyData: false,
      searchContent: [],
      // loading
      selectCaseComplete: false
    };
  },
  created() {
    this.searchList();
  },
  methods: {
    searchList() {
      this.pageData.pageSize = 5;
      this.searchContent = [];
      this.$store.commit("SET_CASENO", this.searchData.caseNo);
      queryCaseNo(this.searchData.caseNo, this.pageData).then(res => {
        if (res.data.state == 100) {
          
          if (res.data.result.content.length == 0) {
            this.emptyData = true;
          } else {
            this.emptyData = false;
            this.pageData.total = res.data.result.total;
            res.data.result.content.map((item, index) => {
              let contentData = {
                id: item.id,
                caseNo: item.caseNo
              };
              this.searchContent.push(contentData);
            });
            this.selectCase(res.data.result.content[0].id);
          }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    resetSearch() {
      this.searchData.caseNo = "";
      this.searchContent = [];
    },
    pageChange(pageNum) {
      this.pageData.pageNumber = pageNum;
      this.searchList();
    },
    printF() {
      let subOutputRankPrint = document.getElementById("printArea");
      console.log(subOutputRankPrint.innerHTML);
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
      // var bdhtml=window.document.body.innerHTML;
      // var sprnstr="<!--startprint-->";
      // var eprnstr="<!--endprint-->";
      // var prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+18);
      // prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
      // window.document.body.innerHTML=prnhtml;
      // window.print();
      // window.document.body.innerHTML=bdhtml;
    },
    selectCase(id) {
      queryProcessNote(id).then(res => {
        if (res.data.state == 100) {
          this.caseNo = res.data.caseNo;
          this.stepList = res.data.result;
          this.selectCaseComplete = true;
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
.side-bar {
  display: inline-block;
  width: 250px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 99;
  transition: all 0.5s;
}
.ivu-card .ivu-card-head {
  padding: 8px 16px;
}
.close-icon {
  margin-left: 130px;
  cursor: pointer;
}
.close-icon:hover {
  color: #40a9ff;
}
.card-content {
  min-height: 480px;
  .ivu-form-item {
    margin-bottom: 8px;
  }
}
#courtdate li {
  margin-bottom: 6px;
  font-size: 14px;
  cursor: pointer;
}
.search-list {
  padding: 10px;
  max-height: 360px;
  overflow-y: auto;
  li {
    margin-bottom: 8px;
    font-size: 14px;
    cursor: pointer;
    list-style: none;
  }
  li:hover {
    color: #40a9ff;
  }
}
#courtdate li:hover {
  color: #40a9ff;
}
.right-wrapper {
  display: inline-block;
  width: 100%;
  padding-left: 260px;
  position: absolute;
  top: 0px;
  left: 0px;
  transition: all 0.5s;
  .ivu-card {
    margin-bottom: 20px;
    .ivu-card-head {
      border-top: 2px solid #40a9ff;
      p {
        color: #fff;
      }
      .right-btn {
        float: right;
        cursor: pointer;
        color: #fff;
      }
    }
  }
}
.title {
  font-size: 20px;
  font-weight: 600;
  padding: 0px 15px 10px;
}
</style>
