<template>
    <div>
      <Modal  style="margin-bottom: 16px;width:800px" width="760" v-model="cardStateModal"
            title="修改案件状态"
           footer-hide 
            >
            <p slot="title">
                修改案件状态
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案号
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        <Input v-model="info.name" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        {{ info.name }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案件状态
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.process" filterable clearable style="width:100%">
                            <Option v-for="item in processtList" :disabled="item.sel" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        <!-- <cityData style="width:100%" @model="cityDs"  ref="courtAdr"></cityData> -->
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.birthdayD }}
                    </Col>
                </Row>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Button @click="cardStateModal = false" type="text" size="large">取消</Button>
                    <Button v-show="cardState === 1" @click="cardState = 3" type="warning" size="large">修改</Button>
                    <Button v-show="cardState > 1" @click="save" :loading="saved" type="success" size="large">保存</Button>
                    
                </div>
            </div>
        </Modal>
        <Modal v-model="mymodal.modal2" width="360">
            <p slot="header" style="color:black;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>{{mymodal.title}}</span>
            </p>
            <div style="text-align:center">
              <Form class="search-form" :label-width="100">
                <FormItem label="结案方式">
                    <Select clearable placeholder='请选择结案方式' style="width: 200px;vertical-align:middle;" @on-change="" @on-clear="" v-model="caseInfo.mode">
                        <Option v-for="item in closeMode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="结案时间">
                    <DatePicker type="date" placeholder="请选择结案时间" style="width: 200px" v-model="caseInfo.date">
                    </DatePicker>
                </FormItem>
                <FormItem label="结案金额">
                  <Input style="width: 200px" v-model.number="caseInfo.money" number/>
                </FormItem>
              </Form>
            </div>
            <div slot="footer">
                <Button type="info" size="large" long :loading="mymodal.modal_loading" @click="editCase">{{mymodal.footerBtn1}}</Button>
            </div>
        </Modal>
        <Card>
            <Row style="padding-bottom: 10px;">
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">案件信息库</span>
                </Col>
                <Col span="21">
                    
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="searchData" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="search">
                        <FormItem label="案号">
                            <Input style="width: 200px" v-model="searchData.caseNo"/>
                        </FormItem>
                        <FormItem label="部门：">
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
                        <FormItem label="立案时间">
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
<!--             <Button  style="margin-left: 10px;margin-bottom: 10px;" type="ghost" @click="withdrawn">
                        撤案
            </Button> -->
            <Button  style="margin-left: 10px;margin-bottom: 10px;" type="primary" @click="overCase">
                        结案
            </Button>
            <Table stripe :columns="dipcol" :data="dipdata" @on-selection-change="tableCheck" ></Table>
            
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="searchData.pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            v-model="modal1"
            title="修改案号"
            @on-ok="ok"
            @on-cancel="cancel">
            <Input  type="text" v-model="caseNoUpdate" />
        </Modal>
    </div>
</template>
<script>
import { queryLawCase, backoutCase,downloadZip,updateLawCaseState,overLawCase,updatecaseNo } from "@/api/caseInfo.js";
import { courtList } from "../../api/global.js";
// import { updatecaseNo } from "../../api/updatecaseNo.js";
import { formatDate } from "@/libs/date";
import { getBrief } from "@/api/global";
export default {
  data() {
    // var nowD = new Date();
    const idtypes = ["身份证", "军官证", "护照"];
    return {
        modal1:false,
        caseNoUpdate:'',
        nowcaseId:'',
        cardStateModal:false,
      lawCaseIds: [],
      show1: false,
      totalPage: 0,
      cardState: 0,
      saved: false,
      briefList: [],
      lawcaseId:"",
      processtList:[
        {
          id:2,
          name:'排期',
          sel:false,
        },
        {
          id:3,
          name:'文书送达',
          sel:false,
        },
        {
          id:4,
          name:'举证阶段',
          sel:false,
        },
        {
          id:5,
          name:'质证阶段',
          sel:false,
        },
        {
          id:6,
          name:'开庭阶段',
          sel:false,
        },
        {
          id:7,
          name:'已开庭',
          sel:false,
        },
        {
          id:8,
          name:'已结案',
          sel:false,
        },
      ],
      departmentList: [],
      info:{

      },
      searchData: {
        caseNo: this.$store.getters.caseNo,
        briefName: "",
        date: "",
        filingDate1: "",
        filingDate2: "",
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
          key: "briefName",
          align: "center",
          width: 120
        },
        {
          title: "案件状态",
          key: "process",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", {}, params.row.process == null ?  "无状态" : params.row.process)
          },
        },
        {
          title: "部门",
          key: "courtName",
          align: "center",
          width: 100
        },
        {
          title: "审判员",
          key: "judgeName",
          align: "center",
          width: 120
        },
        {
          title: "书记员",
          key: "clerkName",
          align: "center",
          width: 120
        },
        {
          title: "原告",
          key: "plaintiffs",
          align: "center",
          width: 150
        },
        {
          title: "被告",
          key: "defendants",
          align: "center",
          width: 150
        },
        {
          title: "立案日期",
          key: "filingDate",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {},
              formatDate(new Date(params.row.filingDate), "yyyy-MM-dd")
            );
          }
        },
        {
          title: "结案日期",
          key: "closeDate",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.closeDate?(formatDate(new Date(params.row.closeDate), "yyyy-MM-dd")):''
            );
          }
        },
        {
          title: "标的金额",
          key: "applyStandard",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", {}, params.row.applyStandard + "元");
          }
        },
        {
          title: "结案金额",
          key: "closeMoney",
          align: "center",
          width: 100,
          render: (h, params) => {
              if (params.row.closeMoney) {
                  return h("span", {}, params.row.closeMoney + "元");
              }else {
                  return h("span", {}, '无');
              }
            
          }
        },
        {
          title: "操作",
          key: "attachment",
          width: 100,
          fixed: "right",
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
                  style:{
                    margin:'3px',
                  },
                  on: {
                      click: () => {
                        const par = {
                          lawCaseId:params.row.id,
                        }
                          downloadZip(par).then(res => {
                            if(res.data.state == 100){
                              this.$Message.success(res.data.message);
                              window.open('/' + res.data.path);
                              // var fileStr = res.data.path;
                              // if(fileStr == null){
                              //     this.$Message.info("暂无附件");
                              //     return false;
                              // }
                              // // 创建隐藏的可下载链接
                              // var eleLink = document.createElement("a");
                              // var strs = fileStr.split("/");
                              // for (var i = 0; i < strs.length; i++) {
                              //     if (i == strs.length - 1) {
                              //     var filename = strs[i];
                              //     }
                              // }
                              // eleLink.download = filename;
                              // eleLink.style.display = "none";
                              // // 字符内容转变成blob地址
                              // eleLink.href = "http://court2.ptnetwork001.com/" + fileStr;
                              // // 触发点击
                              // document.body.appendChild(eleLink);
                              // eleLink.click();
                              // // 然后移除
                              // document.body.removeChild(eleLink);
                            }else{
                              this.$Message.info(res.data.message);
                            }
                          })
                      }
                  }
                  },
                  "卷宗导出"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style:{
                    // marginTop:5,
                    margin:'3px',
                  },
                  on: {
                    click: () => {
                      console.log(params.row.process);
                      this.lawcaseId = params.row.id;
                      this.info.name = params.row.caseNo;
                      this.info.process = params.row.process;
                      let prdess = '';
                      if(params.row.processMax != null && params.row.processMax != ''){
                        prdess = params.row.processMax;
                      }else{
                        prdess = params.row.process;
                      }
                      for(let i=0;i<this.processtList.length;i++){
                        if(this.processtList[i].id > prdess){
                          this.processtList[i].sel = true;
                        }else{
                          this.processtList[i].sel = false;
                        }
                      }
                      this.cardState = 3;
                      
                      this.info = JSON.parse(JSON.stringify(this.info));
                      this.processtList = JSON.parse(JSON.stringify(this.processtList));
                      console.log(this.processtList)
                      this.cardStateModal=true
                    }
                  }
                },
                "状态修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style:{
                    // marginTop:5,
                    margin:'3px',
                  },
                  on: {
                    click: () => {
                        this.caseNoUpdate=params.row.caseNo
                        this.modal1=true
                        this.nowcaseId=params.row.id
                      console.log(params.row.caseNo)
                    }
                  }
                },
                "修改案号"
              )
              ]);
          }
        }
      ],
      dipdata: [],
      mymodal:{
        modal2: false,
        modal_loading: false,
        title:'结案',
        footerBtn1:'修改',
      },
      closeMode:[
        {
            value: "调解",
            label: '调解'
        },
        {
            value: "已撤诉",
            label: '已撤诉'
        },
        {
            value: "按撤诉处理",
            label: '按撤诉处理'
        },
        {
            value: "驳回起诉",
            label: '驳回起诉'
        },
        {
            value: "已判决",
            label: '已判决'
        },
        {
            value: "按撤案处理",
            label: '按撤案处理'
        },
        {
            value: "裁定保全",
            label: '裁定保全'
        },
        {
            value: "移送",
            label: '移送'
        },
        {
            value: "准予申请",
            label: '准予申请'
        },
        {
            value: "其他",
            label: '其他'
        }
      ],
      caseInfo:{
        mode:"",
        date:"",
        money:""
      }
    };
  },
  created() {
    this.onRefreshList();
    this.getCourtList();
    getBrief()
      .then(res => {
        if (res.data.state === 100) {
          this.briefList = res.data.result;
        }
      })
      .catch(error => {});
  },
  methods: {
      ok () {
        // this.$Message.info('Clicked ok');
              updatecaseNo(this.nowcaseId,this.caseNoUpdate).then(res => {
                console.log(res)
                if(res.data.state == 100){
                this.$Message.success(res.data.message);
                // this.caseNoUpdate=
                // this.onRefreshList();
                }else{
                this.$Message.info(res.data.message);
                }
            });
    },
    cancel () {
        // this.$Message.info('Clicked cancel');
    },
    search() {
      this.onRefreshList();
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
    save(){
      console.log(this.info.process)
      this.saved = true;
      updateLawCaseState(this.lawcaseId,this.info.process).then(res => {
      this.saved = false;     
        if (res.data.state == 100) {
          this.cardState = 0;
          this.cardStateModal=false
          this.$Message.success(res.data.message);
          this.onRefreshList();
        }else{
          this.$Message.info(res.data.message);
        }
      })
    },
    empty() {
      this.searchData.caseNo = "";
      this.searchData.briefName = "";
      this.searchData.litigantName = "";
      this.searchData.date = "";
      this.searchData.filingDate1 = "";
      this.searchData.filingDate2 = "";
      this.searchData.pageNumber = 1;
      this.onRefreshList();
    },
    onRefreshList() {
      this.$store.commit("SET_CASENO", this.searchData.caseNo);
      if(this.searchData.date != "" && this.searchData.date[0] != null){
        console.log(this.searchData.date[0])
        this.searchData.filingDate1 =new Date(this.searchData.date[0]).getTime();
        this.searchData.filingDate2 =new Date(this.searchData.date[1]).getTime();
      }else{
        this.searchData.filingDate1 = ""
        this.searchData.filingDate2 = ""
      }
      // this.searchData.filingDate1 =
      //   this.searchData.date == "" ? "" : this.searchData.date[0].getTime();
      // this.searchData.filingDate2 =
      //   this.searchData.date == "" ? "" : this.searchData.date[1].getTime();
      queryLawCase(this.searchData).then(res => {
        if ((res.data.state = 100)) {
          this.dipdata = res.data.result.content;
          this.totalPage = res.data.result.totalPage;
          this.searchData.pageNumber = res.data.result.pageNumber;
        }
      });
    },

    tableCheck(c) {
      var arr = [];

      for (let i = 0; i < c.length; i++) {
        const el = c[i];
        arr.push(el.id);
      }

      this.lawCaseIds = arr;
      console.log(this.lawCaseIds);
    },
    //  撤案
    withdrawn() {
      var _this = this;
      backoutCase(_this.lawCaseIds).then(res => {
        if(res.data.state == 100){
          this.$Message.success(res.data.message);
          this.onRefreshList();
        }else{
          this.$Message.info(res.data.message);
        }
      });
    },
    //结案
    overCase(){
      console.log(this.lawCaseIds);
      if(this.lawCaseIds.length!=0){
        this.mymodal.modal2=true;
      }else{
        this.$Message.info("请先选择案件！");
      }
      
    },
    //批量修改结案信息
    editCase() {
      console.log(this.caseInfo);
      this.mymodal.modal_loading=true;
      overLawCase(this.lawCaseIds,this.caseInfo.mode,new Date(this.caseInfo.date).getTime(),this.caseInfo.money).then(res => {
        this.mymodal.modal_loading=false;
        console.log(res);
        if(res.data.state == 100){
          this.mymodal.modal2=false;
          this.$Message.success(res.data.message);
          this.onRefreshList();
        }else{
          this.$Message.info(res.data.message);
        }
      });
    },
    changePage(num) {
      this.searchData.pageNumber = num;
      this.onRefreshList();
    }
  }
};
</script>
