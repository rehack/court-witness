<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                法院信息库
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        法院名称
                        <Tooltip v-show="cardState > 1 && !info.birthdayD" content="此项必填">
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
                        法院全称
                        <!-- <Tooltip v-show="cardState > 1 && !info.birthdayD" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip> -->
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.allName" style="width: 100%"></Input>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.allName }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        上级法院
                        <Tooltip v-show="cardState > 1 && !info.birthdayD" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14" ></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.parentId" >
                                <Option v-for="item in parentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.parentId }}
                    </Col>


                    <Col span="3" class="maininfo-col maininfo-col-label">
                        法院类型
                        <Tooltip v-show="cardState > 1 && !info.birthdayD" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14" ></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Select v-model="info.type" >
                                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.type }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        省/市/区
                        <Tooltip v-show="cardState > 1 && !info.birthdayD" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14" ></Icon>
                        </Tooltip>
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <cityData style="width:100%" @model="cityDs"  ref="courtAdr"></cityData>
                    </Col>
                    <Col v-show="cardState <= 1" span="9" class="maininfo-col">
                        {{ info.birthdayD }}
                    </Col>

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        地址
                        <!-- <Tooltip v-show="cardState > 1 && !info.adress" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip> -->
                    </Col>
                    <Col v-show="cardState > 1" span="9" class="maininfo-col">
                        <Input v-model="info.address" style="width: 100%"></Input>
                    </Col>
                    <!-- <Col v-show="cardState !== 2" span="9" class="maininfo-col">
                        {{ info.adress }}
                    </Col> -->

                    <Col span="3" class="maininfo-col maininfo-col-label">
                        电话
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
                    <span style="color:#464c5b;font-size:16px;font-weight:700">法院信息库</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="getList(1)">
                        <FormItem label="省/市/区：">
                            <cityData @model="cityD"></cityData>
                            <!-- <Input style="width: 200px" v-model="formItem.judgeNo"/> -->
                        </FormItem>
                        <FormItem label="法院名称：">
                            <Input style="width: 200px" v-model="formItem.name"/>
                        </FormItem>
                        <FormItem label="法院类型：">
                            <Select v-model="formItem.type" style="width:200px">
                                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="上级法院：">
                            <Select v-model="formItem.parentId" style="width:200px">
                                <Option v-for="item in parentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ButtonGroup style="margin-top: 10px; margin-bottom: 10px">
                <Button @click="toAdd" size="large" type="primary">添加</Button>
                <Button @click="modal2 = true" size="large" type="ghost">删除</Button>
            </ButtonGroup>
            <Table stripe ref="judgeTable" :columns="judgecol" :data="courtData" @on-selection-change="tableCheck"></Table>
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
                <Button type="error" size="large" long :loading="del_loading" @click="delJudge">删除</Button>
            </div>
        </Modal>
        <Modal v-model="connectModal" width="950" :ok-text="'保存'" :mask-closable='false' :loading="loading" @on-ok="saveCourtId" title="配置法庭">

            <div class="leftCon">
                <div class="table-btn-group" style="border-bottom:1px solid #e9eaec;padding-bottom:20px;padding-left:5px">
                    <h4 style="display:inline-block;margin-top:5px">已配置法庭</h4>
                    <Button type="primary" @click="cancelConnection" style="float:right">取消配置</Button>
                </div>
                <div class="adnd">
                    <Table ref="selection" height="220" :columns="connectedCol" :data="connectedData" @on-selection-change="onSelectChangeConed" style="margin-top: 10px;"></Table>
                </div>
                
            </div>

            <div class="rightCon">
                <Form class="search-form" :label-width="60" inline style="border-bottom:1px solid #e9eaec;">
                    <Button type="primary" @click="connection">配置绑定</Button>
                    <FormItem >
                        <Input placeholder="请输入法庭名称" style="width: 150px" v-model="courtName" />
                        <!-- <Input  style="width: 200px" enter-button clearable search  v-model="seachName" @on-change="searchDta" placeholder="请输入法庭名称" /> -->
                        <Button type="primary" @click="searchConnectList">查询</Button>
                        <Button style="margin-left: 10px" type="ghost" @click="emptySearchList">清空</Button>
                    </FormItem>
                </Form>
                <!-- <div class="table-btn-group" style="margin-top:5px;">
          
        </div> -->
        <div class="adnd">
            <Table height="220" ref="selection" :columns="detailColumns" :data="noneData" @on-select="onSelectCon" @on-selection-change="onSelectChangeCon" style="margin-top: 10px;"></Table>
        </div>
                
            </div>
        </Modal>
    </div>
</template>
<script>
import { delCourtInfo,
    findCourt,getParentCourt,addCourt,updateCourt,delCourt,
    queryTribunalList,setTribunalList
 } from "../../api/courtDate.js";
import { courtList } from "../../api/global.js";
import { formatDate } from "../../libs/date.js";
import cityData from "@/components/cityData/cityData.vue";
export default {
  components: {
    cityData
  },
  data() {
    // var nowD = new Date();
    return {
      typeList:[
          {
              id:0,
              name:"最高院",
          },
          {
              id:1,
              name:"高级人民法院",
          },
          {
              id:2,
              name:"中级人民法院",
          },
          {
              id:3,
              name:"基层人民法院",
          },
          {
              id:4,
              name:"法庭",
          },
      ],
      connectedCol:[
          {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "法庭名称",
          key: "name",
          align: "center",
          width: 220,
        },
        {
          title: "法庭地址",
          key: "address",
          align: "center",
          width: 150
        }
      ],
      connectedData:[],
      detailColumns:[
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "法庭名称",
          key: "name",
          align: "center",
          width: 220
        },
        {
          title: "法庭地址",
          key: "address",
          align: "center",
          width: 150
        }
      ],
      noneData:[],
      oldNoneData:[],
      parentList:[],
      courtName:"",
      cardState: 0,
      op: ["", "查看", "添加", "修改"],
      show1: false,
      saved: false,
      loading:true,
      connectModal:false,
      del_loading: false,
      modal2: false,
      province:"",
      city:"",
      county:"",
      province2:"",
      city2:"",
      county2:"",
      passType1: "password",
      passType2: "password",
      icon1: "ios-eye-outline",
      icon2: "ios-eye-outline",
      spinShow: false,
      totalPage: 0,
      seachName:'',
      pageNumber: 1,
      checkIds: [],
      onSelectData:[],
      selectData:[],
      checkNames: [],
      departmentList: [],
      formItem: {
        name: "",
        phone: "",
      },
      judgecol: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "法院名称",
          key: "name",
          align: "center",
          width: 150
        },
        {
          title: "法院全称",
          key: "allName",
          align: "center",
          width: 180
        },
        {
          title: "上级法院",
          key: "alname",
          align: "center",
          width: 130,
          render: (h, params) => {
            return h("span", {}, params.row.parent ? params.row.parent.name : "");
          }
        },
        {
          title: "省份",
          key: "province",
          align: "center",
          width: 100,
        },
        {
          title: "城市",
          key: "city",
          align: "center",
          width: 100,
        },
        {
          title: "县区",
          key: "county",
          width: 100,
          align: "center",
        },
        {
          title: "地址",
          key: "address",
          align: "center",
          
        },
        {
          title: "电话",
          key: "telephone",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 120,
        //   fixed: "right",
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
                    marginRight: "5px",
                    marginTop:'5px'
                  },
                  on: {
                    click: () => {
                        var c = JSON.parse(JSON.stringify(params.row));
                      this.noneData = [];
                      this.connectedData = [];
                      this.onSelectData = [];
                      this.selectData = [];
                      this.oldNoneData = [];
                      this.courtId = c.id;
                      queryTribunalList(c.id).then(res => {
                        if(res.data.state == 100){
                            res.data.unselectedTribunalList.map(item => {
                              const data = {
                                name:item.name,
                                address:item.address,
                                id:item.id
                              }
                              this.noneData.push(data)
                            })
                            res.data.selectedTribunal.map(item => {
                              const data2 = {
                                name:item.name,
                                address:item.address,
                                id:item.id
                              }
                              this.connectedData.push(data2)
                            })
                            console.log(this.connectedData)
                            this.oldNoneData = this.noneData;
                            this.connectModal = true;
                        }else{
                          this.$Message.info(res.data.message);
                        }
                      })
                      
                    }
                  }
                },
                "配置法庭"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    marginBottom:'5px',
                    marginTop:'5px'
                  },
                  on: {
                    click: () => {
                      var c = JSON.parse(JSON.stringify(params.row));
                      this.info.name = c.name;
                      this.info.phone = c.telephone;
                      this.info.address = c.address;
                      this.province2 = c.province;
                      this.city2 = c.city;
                      this.county2 = c.county;
                      this.courtId = c.id;
                      this.info.allName = c.allName;
                      this.info.parentId = c.parent ? c.parent.id : "";
                      this.info.type = c.type;
                    //   this.courtId = c.id;
                    console.log(this.info)
                      var arr = [];
                      arr.push(c.province,c.city,c.county);
                      this.$refs.courtAdr.getValue(arr);
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
      courtData: [],
      courtId:"",
      info: {
        name: "",
        phone: "",
        address:"",
        allName:"",
        parentId:"",
      }
    };
  },
  mounted() {
    this.getList(1);
    this.getCourtList();
    getParentCourt().then(res => {
        if(res.data.state == 100){
            this.parentList = res.data.courtList
        }
    })
  },
  methods: {
    cancelConnection(){
      if(this.selectData.length == 0){
        this.$Message.info('请选择取消配置的法庭！');
        return false;
      }
      console.log(this.noneData)
      for (let dex in this.selectData){
        this.noneData.push(this.selectData[dex]);
        // this.oldNoneData.push(this.selectData[dex]);
        for(let tex in this.connectedData){
          if(this.connectedData[tex].id == this.selectData[dex].id){
            this.connectedData.splice(tex,1)
          }
        }  
      }
      this.selectData = [];
      console.log(this.noneData)
      
    },
    saveCourtId(){
      // this.loading = true;
      console.log(this.loading)
      let str = '';
      for(let dex in this.connectedData){
        if (dex == this.connectedData.length - 1){
          str = str + this.connectedData[dex].id
        }else{
           str = str + this.connectedData[dex].id + ','
        }
      }
      setTribunalList(this.courtId,str).then(res => {
        if(res.data.state == 100){
          this.$Message.success(res.data.message);
          this.connectModal = false;
        }else{
          this.$Message.info(res.data.message);
          this.changeLoading();
        }
      })
    },
    changeLoading() {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    },
    searchDta(){

    },
    onSelectChangeConed(selection){
      this.selectData = selection;
      console.log(this.noneData)
    },
    connection(){
      if(this.onSelectData.length == 0){
        this.$Message.info('请选择需要配置的法庭！');
        return false;
      }
      for (var dex in this.onSelectData){
        this.connectedData.push(this.onSelectData[dex])
        for(var tex in this.noneData){
          if(this.noneData[tex].id == this.onSelectData[dex].id){
            this.noneData.splice(tex,1)
          }
        }
        for(let rex in this.oldNoneData){
          if(this.oldNoneData[rex].id == this.onSelectData[dex].id){
            this.oldNoneData.splice(rex,1)
          }
        }  
      }
      this.onSelectData = []
      console.log(this.noneData)
      
    },
    searchConnectList(){
      this.noneData = [];
      for(let dex in this.oldNoneData){
        if(this.oldNoneData[dex].name.indexOf(this.courtName) >= 0){
          this.noneData.push(this.oldNoneData[dex]);
        }
        
      }
      console.log()
    },
    emptySearchList(){
      this.courtName = '';
      this.noneData = this.oldNoneData;
    },
    onSelectCon(){

    },
    onSelectChangeCon(selection){
       console.log(selection)
      this.onSelectData = selection;
    },
    cityD(value){
        console.log(value.length)
        if(value.length > 0){
            if(value.length == 1){
                this.province = value[0]
            }else if(value.length == 2){
                this.province = value[0];
                this.city = value[1];
            }else if(value.length == 3){
                this.province = value[0];
                this.city = value[1];
                this.county = value[2];
            }
        }else if(value.length == 0){
            this.province = "";
            this.city = "";
            this.county = "";
        }
    },
    cityDs(value){
        if(value.length > 0){
            if(value.length == 1){
                this.province2 = value[0]
            }else if(value.length == 2){
                this.city2 = value[0];
                this.county2 = value[1];
            }else if(value.length == 3){
                this.province2 = value[0];
                this.city2 = value[1];
                this.county2 = value[2];
            }
        }else if(value.length == 0){
            this.province2 = "";
            this.city2 = "";
            this.county2 = "";
        }
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
    getList(page) {
      var that = this;
      this.departmentList.map(item => {
        if (item.name == this.formItem.departmentName) {
          this.formItem.departmentId = item.id;
        }
      });
      var params = {
        province: this.province,
        city: this.city,
        county: this.county,
        name: this.formItem.name,
        type: this.formItem.type,
        parentId:this.formItem.parentId,
      };
      params.pageNumber = page;
      params.pageSize = 10;
      findCourt(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            that.courtData = data.result.content;
            that.pageNumber = data.result.pageNumber;
            that.totalPage = data.result.totalPage;
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
    save() {
      var that = this;
      that.saved = true;
      var params = {
        province: this.province2,
        city: this.city2,
        county: this.county2,
        name: this.info.name,
        telephone: this.info.phone,
        address: this.info.address,
        type: this.info.type,
        parentId:this.info.parentId,
        allName:this.info.allName,
      };

      if (this.cardState === 2) {
        addCourt(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              this.info.name = "";
              this.info.phone = "";
              this.info.address = "";
              this.info.type = "";
              this.info.parentId = "";
              this.info.allName = "";
            }
            this.getList(1);
            that.saved = false;
          })
          .catch(() => {
            that.$Message.error("网络错误");
            that.saved = false;
          });
      } else {
          params.courtId = this.courtId;
        updateCourt(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
              this.info.name = "";
              this.info.phone = "";
              this.info.address = "";
              this.info.type = "";
              this.info.parentId = "";
              this.info.allName = "";
              this.cardState = 0;
              this.getList(1);
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
      var params = {
        ids: that.checkIds,
      };
      let ids = that.checkIds;
      delCourt(ids)
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
        arr.push(el.id);
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
        judgeNo: "",
        name: "",
        birthdayD: "",
        telephone:'',
        identity: "",
        phone: "",
        openNum: "",
        department: "",
        emergencyContact: "",
        emergencyPhone: "",
        createDateD: "",
        changeNum: "",
        workYear: "",
        remark: "",
        lastModifyPeople: "",
        lastModifyDate: ""
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

