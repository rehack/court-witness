<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                {{ op[cardState] }}案件分配
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        工号
                        <Tooltip v-show="cardState > 1 && !info.jobNumber" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.jobNumber" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.jobNumber }}
                    </Col>

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
                        性别
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.sex" style="width:100%">
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                        </Select>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.sex }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        身份证号
                        <Tooltip v-show="cardState > 1 && !info.identity" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState === 2" span="9" class="maininfo-col">
                        <Input v-model="info.identity" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ info.identity }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.phone" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.phone }}
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
                    <span style="color:#464c5b;font-size:16px;font-weight:700">案件管理</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent ="getList(1)" >
                        <FormItem label="案号：">
                            <Input style="width: 200px" v-model="formItem.caseNo"/>
                        </FormItem>
                        <FormItem label="法官姓名：">
                            <!-- <AutoComplete
                                v-model="judgeName"
                                placeholder=""
                                style="width:200px">
                                
                                <Option v-for="item in judgeNameList" :value="item.name" :key="item.name"></Option>
                            </AutoComplete> -->
                            <Select v-model="judgeName" filterable placeholder="请选择">
                                <Option v-for="item in judgeNameList" v-bind:value="item.name">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="案由：">
                            <Select v-model="brief" filterable placeholder="请选择">
                                <Option v-for="item in briefList" v-bind:value="item.name">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="书记员姓名：">
                            <Select v-model="clerkName" filterable placeholder="请选择">
                                <Option v-for="item in clerkNameList" v-bind:value="item.name">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="送达人员姓名：">
                            <Select v-model="servicePersonnelName" filterable placeholder="请选择">
                                <Option v-for="item in servicePersonnelNameList" v-bind:value="item.name">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="cleanCase" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ButtonGroup style="margin-top: 10px; margin-bottom: 10px">
                <Button @click="distributive" size="large" type="primary">分配送达人员</Button>
                <Button @click="leadIn" size="large" style="margin-left:20px" type="primary">案件导入</Button>
            </ButtonGroup>
            <Table stripe ref="judgeTable" :columns="judgecol" :data="judgedata" @on-selection-change="tableCheck"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>

        <Modal
        v-model="detailModal"
        :loading="loading"
        width="360"
        cancel-text=""
        ok-text="确认分配"
        @on-ok="onOkF"
        title="案件送达人员分配">
        <!-- <Form class="search-form"  :label-width="100" inline style="border-bottom:1px solid #e9eaec;margin-bottom: 12px;" @keydown.native.enter.prevent ="searchServerviceList">
          <FormItem label="送达人员姓名">
            <Input  placeholder="送达人员姓名" style="width: 150px" v-model="searchConnectData.name" />
            <Button type="primary" @click="searchServerviceList">查询</Button>
          </FormItem>
        </Form>
            <Table height="250" @on-current-change="selectOne" highlight-row :columns="detailColumns" :data="detailData" style="margin-top: 10px;height:250px"></Table>
            <div style="margin: 5px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage2" :page-size="1" :current="pageNumber2" @on-change="changePage2"></Page>
                </div>
            </div> -->
            <Tree :data="data1" @on-select-change="treeChange()" ref="tree"></Tree>
        </Modal>
        <Modal
            title="一键导入"
            v-model="leadInModal"
            cancel-text=""
            ok-text="关闭"
            :mask-closable="false">
            <Alert v-show="uploadAllIsError" type="error" show-icon>{{ uploadAllMessage }}</Alert>
            <Alert v-show="uploadAllIsSuccess" type="success" show-icon>{{ uploadAllMessage }}</Alert>
            <Alert v-show="uploadAllIsWarning" type="warning" show-icon>成功：{{ successNum }}条，错误{{ errorNum }}条，{{ uploadAllMessage }}<a style="margin-left:10px;" :href="errorDown">错误数据下载</a></Alert>
            <Upload
                multiple
                type="drag"
                :on-success="uploadAllSuccess"
                :show-upload-list="false"
                action="/api/court/case/createCase.jhtml">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽文件上传</p>
                </div>
            </Upload>
            <!-- <div style="text-align:right;padding-top:5px;"><a href="/upload/demo/creatdemo.xls">下载导入模板</a></div> -->
        </Modal>
    </div>
</template>
<script>
import {
  list,
  add,
  update,
  del,
  serviceList,
  distri,
  findWorkerNames,
  findBriefNames,
  queryServicePersonnel
} from "../../api/caseManage.js";
import { courtList } from "../../api/global.js";
import { formatDate } from "../../libs/date.js";
export default {
  data() {
    // var nowD = new Date();
    return {
        data1: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ],
        judgeName:'',
        judgeNameList:[],
        clerkName:'',
        clerkNameList:[],
        servicePersonnelName:'',
        servicePersonnelNameList:[],
        brief:'',
        briefList:[],
      cardState: 0,
      op: ["", "查看", "添加", "修改"],
      show1: true,
      leadInModal:false,
      uploadAllIsError: false,
      uploadAllIsSuccess: false,
      uploadAllIsWarning: false,
      errorDown: '',
      successNum: '',
      errorNum: '',
      uploadAllMessage: '',
      saved: false,
      del_loading: false,
      modal2: false,
      spinShow: false,
      totalPage2: 1,
      totalPage: 1,
      searchConnectData: {
        jobNumber: "",
        name: "",
        phone: "",
        identity: "",
        sex: ""
      },
      pageNumber: 1,
      pageNumber2: 1,
      checkIds: [],
      checkNames: [],
      loading: false,
      detailModal: false,
      departmentList: [],
      detailData: [],
      selectId: "",
      formItem: {
        id: "",
        caseNo: "",
        judgeName: "",
        brief: "",
        clerkName: "",
        servicePersonnelName: ""
      },
      detailColumns: [
        {
          title: "工号",
          key: "jobNumber",
          align: "center",
          width: 150
        },
        {
          title: "姓名",
          key: "name",
          align: "center",
          width: 120
        },
        {
          title: "在办案件",
          key: "count",
          align: "center",
          width: 120
        },
        {
          title: "手机号码",
          key: "phone",
          align: "center",
          width: 193
        }
      ],
      judgecol: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 220
        },
        {
          title: "法官姓名",
          key: "judgeName",
          align: "center",
          ellipsis: true
        },
        {
          title: "案由",
          key: "brief",
          align: "center"
        },
        {
          title: "书记员姓名",
          key: "clerkName",
          align: "center"
        },
        {
          title: "送达人员姓名",
          key: "servicePersonnelName",
          align: "center"
        }
      ],
      lawCaseIds: [],
      judgedata: [],
      onSelectData: [],
      info: {
        jobNumber: "",
        name: "",
        phone: "",
        identity: "",
        sex: ""
      }
    };
  },
    watch: {
//         judgeName(curVal,oldVal){
// 　　　　　　console.log(curVal,oldVal);
//             findWorkerNames(curVal,0).then(res=>{
//                 console.log(res.data.resul)
//                 this.judgeNameList=res.data.resul
//             // console.log(res)
//             // if (condition) {
                
//             // }
//         })
// 　　　　},
//         clerkName(curVal,oldVal){
// 　　　　　　console.log(curVal,oldVal);
//             findWorkerNames(curVal,1).then(res=>{
//             this.clerkNameList=res.data.resul
//         })
// 　　　　},
//         servicePersonnelName(curVal,oldVal){
// 　　　　　　console.log(curVal,oldVal);
//             findWorkerNames(curVal).then(res=>{
//             this.servicePersonnelNameList=res.data.resul
//         })
// 　　　　},
//         brief(curVal,oldVal){
// 　　　　　　console.log(curVal,oldVal);
//             findBriefNames(curVal).then(res=>{
//                 this.briefList=res.data.resul
//             })
// 　　　　},
    },
    mounted() {
        
        this.getList(1);
        findWorkerNames('',0).then(res=>{
            console.log(res.data.resul)
            this.judgeNameList=res.data.resul
        })
        findWorkerNames('',1).then(res=>{
            console.log(res.data.resul)
            this.clerkNameList=res.data.resul
        })
        findWorkerNames('').then(res=>{
            console.log(res.data.resul)
            this.servicePersonnelNameList=res.data.resul
        })
        findBriefNames('').then(res=>{
            this.briefList=res.data.resul
        })
        queryServicePersonnel().then(res=>{
            console.log(res)
            this.data1=[]
            var a = res.data.courtNames.split(',');
            a.map(item => {
                let dataPersonnel={}
                dataPersonnel.title=item
                // dataPersonnel.expand=true
                dataPersonnel.children=[]
                res.data.resul.map(itemS =>{
                    if (itemS.courtName==item) {
                        itemS.title="姓名："+itemS.name+','+'在办案件数量：'+(itemS.count?itemS.count:'暂无')
                        dataPersonnel.children.push(itemS)
                    }
                })
                this.data1.push(dataPersonnel)
            });
        })

    },
    methods: {
        treeChange(){
            console.log(this.$refs.tree.getSelectedNodes())
            this.selectId=this.$refs.tree.getSelectedNodes()[0].id
            
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
    // selectOne(e) {
    //   this.selectId = e.id;
    //   console.log(this.selectId);
    // },
    getList(page) {
      var that = this;
      var params = {
        caseNo: this.formItem.caseNo,
        judgeName: this.judgeName,
        brief: this.brief,
        clerkName: this.clerkName,
        servicePersonnelName: this.servicePersonnelName
      };
      params.pageNumber = page;
      params.pageSize = 10;
      this.judgedata = [];
      list(params)
        .then(res => {
          var data = res.data;
          if (data.state === 1) {
            res.data.result.content.map(item => {
              let objectData = {
                id: item.id,
                caseNo: item.caseNo,
                judgeName: item.judge.name,
                brief: item.brief.name,
                clerkName: item.clerk.name,
                servicePersonnelName:
                  item.servicePersonnel == null
                    ? "暂无"
                    : item.servicePersonnel.name
              };
              this.judgedata.push(objectData);
            });
            console.log(this.judgedata);
            that.pageNumber = data.result.pageNumber;
            that.totalPage = data.result.totalPages;
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
    uploadAllSuccess(response, file, fileList){
        this.uploadAllIsError = false;
        this.uploadAllIsSuccess = false;
        this.uploadAllIsWarning = false;
        this.uploadAllMessage = '';
        this.successNum = '';
        this.errorNum = '';
        if (response.state == 100) {
            this.uploadAllIsSuccess = true;
            this.uploadAllMessage = response.message;
            setTimeout(function () {
                this.uploadAllIsSuccess = false;
            }, 2000);
        }else{
            this.uploadAllIsError = true;
            this.uploadAllMessage = response.message;
        }
    },
    leadIn(){
        this.uploadAllIsError = false;
        this.uploadAllIsSuccess = false;
        this.uploadAllIsWarning = false;
        this.uploadAllMessage = '';
        this.successNum = '';
        this.errorNum = '';
        this.leadInModal = true;
    },
    searchServerviceList() {
      var that = this;
      var params = this.searchConnectData;
      params.pageNumber = 1;
      params.pageSize = 10;
      serviceList(params).then(res => {
        var data = res.data;
        if (data.state === 100) {
          that.detailData = data.result.content;
          that.pageNumber2 = data.result.pageNumber;
          that.totalPage2 = data.result.totalPage;
        } else {
          that.$Message.info(data.message);
        }
      });
    },
    distributive() {
      if (this.onSelectData == "") {
        this.$Message.info("请选择需要分配的案件");
        return false;
      }
      this.selectId = "";
      var that = this;
      this.detailModal = true;
      this.searchConnectData.name = "";
      var params = {
        jobNumber: "",
        name: "",
        phone: "",
        identity: "",
        sex: ""
      };
      params.pageNumber = 1;
      params.pageSize = 10;
      serviceList(params).then(res => {
        var data = res.data;
        if (data.state === 100) {
            that.detailData = data.result.content;
            for (let index = 0; index < that.detailData.length; index++) {
                if (that.detailData[index].count) {
                    
                }else{
                    that.detailData[index].count='暂无'
                }
                
            }
            that.pageNumber2 = data.result.pageNumber;
            that.totalPage2 = data.result.totalPage;
        } else {
            that.$Message.info(data.message);
        }
      });
    },
    onOkF() {
      let lawCaseIds = "";
      this.loading = true;
      this.onSelectData.map((item, index) => {
        if (index == this.onSelectData.length - 1) {
          lawCaseIds += item.id;
        } else {
          lawCaseIds += item.id + ",";
        }
      });
      distri(this.selectId, lawCaseIds).then(res => {
        if (res.data.state == 100) {
          this.$Message.success(res.data.message);
          this.loading = false;
          this.onSelectData == "";
          this.getList(1);
        } else {
          this.$Message.info(res.data.message);
        }
      });
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
        jobNumber: this.info.jobNumber,
        name: this.info.name,
        phone: this.info.phone,
        identity: this.info.identity,
        sex: this.info.sex
      };

      if (this.cardState === 2) {
        params.identity = this.info.identity; // 添加信息要传身份证号
        add(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
              this.info.jobNumber = "";
              this.info.name = "";
              this.info.phone = "";
              this.info.identity = "";
              this.info.sex = "";
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
              this.info.jobNumber = "";
              this.info.name = "";
              this.info.phone = "";
              this.info.identity = "";
              this.info.sex = "";
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
    tableCheck(selection) {
      this.onSelectData = selection;
      console.log(this.onSelectData);
    },
    changePage(p) {
      this.getList(p);
    },
    changePage2(p) {},
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
    cleanCase() {
      this.formItem = {
        clerkNo: "",
      };
      this.judgeName=''
        this.brief=''
        this.clerkName=''
        this.servicePersonnelName=''
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
      this.info.birthdayD = d;
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
<style>
th .ivu-table-cell{
  display: block;
}
.ivu-form .ivu-form-item-label{
  padding: 10px 2px 10px 0;
}
.ivu-select-dropdown-list{
    max-height: 250px;
    overflow: scroll;
    
}
.ivu-select-dropdown-list {
    max-height: 250px;
    overflow: visible;
}
.ivu-tree-title {
    font-weight: bold;
    display: inline-block;
    margin: 0;
    padding: 0 4px;
    border-radius: 3px;
    cursor: pointer;
    vertical-align: top;
    color: #495060;
    transition: all .2s ease-in-out;
}
</style>
