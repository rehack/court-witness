<template>
  <div>
    <Card>
      <Row style="padding-bottom: 10px;">
        <Col span="3">
        <span style="color:#464c5b;font-size:16px;font-weight:700">文书批量管理</span>
        </Col>
        <Col span="21">
        <Button style="margin-left: 10px" type="ghost" @click="createSend">
          批量打印快递单
        </Button>
        <Button style="margin-left: 10px" type="ghost" @click="createDip">
          批量生成并下载文书
        </Button>
        <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
          查询展开
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <Form :model="searchData" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="search">
          <FormItem label="案号">
            <Input style="width: 200px" v-model="searchData.caseNo" />
          </FormItem>
          <FormItem label="法庭地点">
            <Select v-model="searchData.courtId" style="width:200px">
              <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="案由">
            <Select v-model="searchData.briefName" style="width: 200px;vertical-align:middle;">
              <Option v-for="item in briefList" :value="item.brief" :key="item.brief">{{ item.brief }}</Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="当事人">
                            <Input style="width: 200px" v-model="searchData.litigantName"/>
                        </FormItem> -->
          <FormItem label="开庭时间">
            <DatePicker style="width:175px;" type="daterange" placeholder="选择日期" v-model="searchData.date" />
          </FormItem>
          <div style="display: inline-block; padding-right: 30px;float: right;">
            <Button type="ghost" @click="search">查询</Button>
            <Button style="margin-left: 10px" type="ghost" @click="empty">清空</Button>
            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
          </div>
        </Form>
        </Col>
      </Row>
      <Table stripe :columns="dipcol" :data="dipdata" @on-selection-change="tableCheck"></Table>

      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalPage" :page-size="1" :current="searchData.pageNumber" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="model1" title="选择文书" :mask-closable="false" :closable="false" :styles="{top: '20px'}" width="800px" @on-ok="downDip">
      <div style="line-height: 38px;border:1px solid #e9eaec;border-bottom:none">
        &nbsp;&nbsp; 文书列表选择
        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll()" style="float:right">全选</Checkbox>
      </div>
      <div class="maininfo-warp">
        <CheckboxGroup size="large" v-model="dipChecked" @on-change="dipCheckedChange()">
          <Row>
            <Col v-for="(d, key) in diplist" :key="key" span="6" class="maininfo-col">
            <template>
              <Checkbox :label="d.name"></Checkbox>
            </template>
            </Col>
          </Row>
        </CheckboxGroup>
      </div>
    </Modal>
    <Modal v-model="model2" title="选择文书" :mask-closable="false" :styles="{top: '20px'}" width="800px" @on-ok="sendDip">
      <div style="line-height: 38px;border:1px solid #e9eaec;border-bottom:none">
        &nbsp;&nbsp; 文书列表选择
        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll()" style="float:right">全选</Checkbox>
      </div>
      <div class="maininfo-warp">
        <CheckboxGroup size="large" v-model="dipChecked" @on-change="dipCheckedChange()">
          <Row>
            <Col v-for="(d, key) in diplist" :key="key" span="6" class="maininfo-col">
            <template>
              <Checkbox :label="d.name"></Checkbox>
            </template>
            </Col>
          </Row>
        </CheckboxGroup>
      </div>
    </Modal>
    <Modal v-model="model3" title="填写快递单号" :mask-closable="false" :styles="{top: '20px'}" width="800px" @on-ok="submitOdd">
      <div style="line-height: 38px;border:1px solid #e9eaec;border-bottom:none">
        &nbsp;&nbsp; 填写快递单号
      </div>
      <div class="maininfo-warp">
        <Row v-for="(item, key1) in expressInfo" :key="key1">
          <Col span="24" class="maininfo-col"> 案号：{{item.caseNo}}
          </Col>
          <Row v-for="(d, key2) in item.litigants" :key="key2">
            <Col span="6" class="maininfo-col"> 当事人：{{d.litigant.litigantName}}
            </Col>
            <Col span="10" class="maininfo-col"> 地址：{{d.address}}
            </Col>
            <Col span="8" class="maininfo-col">
            <template>
              快递单号：
              <Input v-if="key1 == 0" v-model="temporaryOdd[key1+key2].oddNumbers" @on-change="importOdd" placeholder="请输入快递单号" style="width:160px" />
              <Input v-if="key1 == 1" v-model="temporaryOdd[key1+key2+expressInfo[key1-1].litigants.length-1].oddNumbers" @on-change="importOdd" placeholder="请输入快递单号" style="width:160px" />
              <Input v-if="key1 == 2" v-model="temporaryOdd[key1+key2+expressInfo[key1-1].litigants.length+expressInfo[key1-2].litigants.length-2].oddNumbers" @on-change="importOdd" placeholder="请输入快递单号" style="width:160px" />
              <Input v-if="key1 == 3" v-model="temporaryOdd[key1+key2+expressInfo[key1-1].litigants.length+expressInfo[key1-2].litigants.length+expressInfo[key1-3].litigants.length-3].oddNumbers" @on-change="importOdd" placeholder="请输入快递单号" style="width:160px" />
            </template>
            </Col>
          </Row>
        </Row>
      </div>
    </Modal>
  </div>
</template>
<script>
import { batchBuildDiplomsLawCaseList } from "@/api/caseInfo.js";
import { courtList } from "../../api/global.js";
import { formatDate } from "@/libs/date";
import { getBrief } from "@/api/global";
import {
  batchBuildDiploms,
  batchBuildExpress,
  getCaseLitigantInfo,
  sendAllEMS
} from "@/api/batch.js";
export default {
  data () {
    // var nowD = new Date();
    const idtypes = ["身份证", "军官证", "护照"];
    return {
      lawCaseIds: [],
      show1: false,
      totalPage: 0,
      briefList: [],
      departmentList: [],
      model1: false,
      model2: false,
      model3: false,
      expressInfo: [],
      batchCourt: 0,
      dipChecked: [],
      indeterminate: true,
      checkAll: false,
      temporaryOdd: [],
      diplist: [
        {
          name: "封皮",
          checked: true
        },
        {
          name: "送达地址确认书",
          checked: true
        },
        {
          name: "送达回证",
          checked: true
        },
        {
          name: "诉讼权利义务告知书",
          checked: true
        },
        {
          name: "应诉通知书",
          checked: true
        },
        {
          name: "电话通知记录表",
          checked: false
        },
        {
          name: "传票",
          checked: true
        },
        {
          name: "传票(存根)",
          checked: true
        },
        {
          name: "廉政监督卡",
          checked: true
        },
        {
          name: "合议庭组成人员通知书",
          checked: false
        },
        {
          name: "参加诉讼通知书",
          checked: false
        },
        {
          name: "举证通知书",
          checked: true
        },
        {
          name: "受理案件通知书",
          checked: false
        },
        {
          name: "送达地址有关事项告知书",
          checked: true
        },
        {
          name: "委托送达函",
          checked: false
        }
      ],
      searchData: {
        caseNo: "",
        courtId: "",
        briefName: "",
        date: "",
        startTime: "",
        endTime: "",
        pageNumber: 1
      },
      dipcol: [
        {
          type: "selection",
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 80
        },
        {
          // type: "selection",
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 180
        },
        {
          title: "案由",
          key: "brief.name",
          align: "center",
          width: 160,
          render: (h, params) => {
            return h("span", {}, params.row.brief.name);
          }
        },
        {
          title: "部门",
          key: "court.name",
          align: "center",
          width: 160,
          render: (h, params) => {
            return h("span", {}, params.row.court.name);
          }
        },
        {
          title: "审判员",
          key: "judge.name",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", {}, params.row.judge.name);
          }
        },
        {
          title: "书记员",
          key: "clerk.name",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", {}, params.row.clerk.name);
          }
        },
        {
          title: "原告",
          key: "litigants.name",
          align: "center",
          width: 100,
          render: (h, params) => {
            for (var i = 0; i < params.row.litigants.length; i++) {
              if (params.row.litigants[i].litigationStatus.name == "原告") {
                return h("span", {}, params.row.litigants[i].litigantName);
              }
            }
          }
        },
        {
          title: "被告",
          key: "litigants.name",
          align: "center",
          width: 100,
          render: (h, params) => {
            for (var i = 0; i < params.row.litigants.length; i++) {
              if (params.row.litigants[i].litigationStatus.name == "被告") {
                return h("span", {}, params.row.litigants[i].litigantName);
              }
            }
          }
        },
        {
          title: "立案日期",
          key: "filingDate",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h(
              "span",
              {},
              formatDate(new Date(params.row.filingDate), "yyyy-MM-dd")
            );
          }
        },
        {
          title: "标的金额",
          key: "applyStandard",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("span", {}, params.row.applyStandard + "元");
          }
        }
      ],
      dipdata: []
    };
  },
  created () {
    this.onRefreshList();
    this.getCourtList();
    getBrief()
      .then(res => {
        if (res.data.state === 100) {
          this.briefList = res.data.result;
        }
      })
      .catch(error => { });
    this.diplist.map(item => {
      if (item.checked) {
        this.dipChecked.push(item.name);
      }
    });
  },
  methods: {
    search () {
      this.onRefreshList();
    },
    getCourtList () {
      courtList()
        .then(res => {
          if (res.data.state == 100) {
            res.data.result.map(item => {
              this.departmentList.push({ name: item.name, id: item.id });
            });
          }
        })
        .catch(err => { });
    },
    empty () {
      this.searchData.caseNo = "";
      this.searchData.briefName = "";
      this.searchData.litigantName = "";
      this.searchData.date = "";
      this.searchData.startTime = "";
      this.searchData.endTime = "";
      this.searchData.pageNumber = 1;
      this.onRefreshList();
    },
    onRefreshList () {
      var msg = this.$Message.loading({
        content: "列表加载中，请稍候",
        duration: 0
      });
      this.searchData.startTime =
        this.searchData.date == ""
          ? ""
          : this.searchData.date[0] == ""
            ? ""
            : this.searchData.date[0].getTime();
      this.searchData.endTime =
        this.searchData.date == ""
          ? ""
          : this.searchData.date[1] == ""
            ? ""
            : this.searchData.date[1].getTime();
      batchBuildDiplomsLawCaseList(this.searchData).then(res => {
        if (res.data.state = 100) {
          msg();
          this.dipdata = res.data.result.content;
          this.totalPage = res.data.result.totalPages;
          this.searchData.pageNumber = res.data.result.pageNumber;
        }
      });
    },

    tableCheck (c) {
      var arr = [];

      for (let i = 0; i < c.length; i++) {
        const el = c[i];
        arr.push(el.id);
      }

      this.lawCaseIds = arr;
    },
    //  批量生成文书
    createDip () {
      if (this.lawCaseIds.length === 0) {
        this.$Message.error("请选择需要批量生成文书的案件");
      } else {
        this.model1 = true;
      }
    },
    createSend () {
      if (this.lawCaseIds.length === 0) {
        this.$Message.error("请选择需要批量打印快递单的案件");
      } else {
        this.model2 = true;
        let lawCaseIdList = this.lawCaseIds.join(",");
      }
    },
    changePage (num) {
      this.searchData.pageNumber = num;
      this.onRefreshList();
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        for (let i = 0; i < this.diplist.length; i++) {
          const el = this.diplist[i];
          this.diplist[i].checked = true;
          this.dipChecked.push(el.name);
        }
      } else {
        for (let i = 0; i < this.diplist.length; i++) {
          this.diplist[i].checked = false;
        }
        this.dipChecked = [];
      }
    },

    dipCheckedChange () {
      if (this.dipChecked.length === this.diplist.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (this.dipChecked.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    sendDip () {
      let lawCaseIdList = this.lawCaseIds.join(",");
      let name = this.dipChecked.join(",");
      var msg = this.$Message.loading({
        content: "快递单批量生成中，请稍候",
        duration: 0
      });
      batchBuildExpress({ lawCaseIdList, name })
        .then(res => {
          msg();
          if (res.data.state == 100) {
            // var a = document.createElement("a");
            window.open(res.data.path);
            // a.download = "批量文书(" + new Date().getTime() + ")";
            // a.click();
            this.$Message.success("生成成功！");
            this.model3 = true;
          } else {
            this.$Message.info({ content: res.data.message, duration: 5 });
          }
          this.dipChecked = [];
          this.diplist.map(item => {
            if (item.checked) {
              this.dipChecked.push(item.name);
            }
          });
        })
        .catch(err => {
          console.log(err);
          msg();
          this.$Message.error("服务器错误请稍后再试");
        });
      getCaseLitigantInfo({ lawCaseIdList })
        .then(res => {
          if (res.data.state == 100) {
            this.temporaryOdd = [];
            this.expressInfo = res.data.result;
            for (var i = 0; i < res.data.result.length; i++) {
              for (var j = 0; j < res.data.result[i].litigants.length; j++) {
                console.log(res.data.result[i].litigants);
                this.temporaryOdd.push({
                  lawCaseId: res.data.result[i].lawCaseId,
                  litigantId: res.data.result[i].litigants[j].litigant.id,
                  litigantName:
                    res.data.result[i].litigants[j].litigant.litigantName,
                  address: res.data.result[i].litigants[j].address,
                  oddNumbers: ""
                });
              }
            }
          } else {
            this.$Message.info({ content: res.data.message, duration: 5 });
          }
        })
        .catch(err => {
          console.log(err);
          msg();
          this.$Message.error("服务器错误请稍后再试");
        });
    },
    downDip () {
      let lawCaseIdList = this.lawCaseIds.join(",");
      let name = this.dipChecked.join(",");
      var msg = this.$Message.loading({
        content: "文书批量生成中，请稍候",
        duration: 0
      });
      batchBuildDiploms({ lawCaseIdList, name })
        .then(res => {
          if (res.data.state == 100) {
            var a = document.createElement("a");
            a.href = res.data.path;
            a.download = "批量文书(" + new Date().getTime() + ")";
            a.click();
            msg();
            this.$Message.success("生成成功！");
          } else {
            this.$Message.info(res.data.message);
          }
          this.dipChecked = [];
          this.diplist.map(item => {
            if (item.checked) {
              this.dipChecked.push(item.name);
            }
          });
        })
        .catch(err => {
          console.log(err);
          msg();
          this.$Message.error("服务器错误请稍后再试");
        });
    },

    importOdd () {
      console.log(this.temporaryOdd);
    },
    submitOdd () {
      console.log(this.temporaryOdd);
      var param = [];
      this.temporaryOdd.map(item => {
        param.push(
          item.lawCaseId +
          "," +
          item.litigantId +
          "," +
          item.litigantName +
          "," +
          item.address +
          "," +
          item.oddNumbers
        );
      });
      let name = this.dipChecked.join(",");
      sendAllEMS({ param, name })
        .then(res => {
          if (res.data.state == 100) {
            this.$Message.success("提交成功！");
          } else {
            this.$Message.info(res.data.message);
          }
        })
        .catch(err => {
          this.$Message.error("服务器错误请稍后再试");
        });
    }
  }
};
</script>
