<template>
    <div>
        <Card v-show="cardState" style="margin-bottom: 16px">
            <p slot="title">
                {{ op[cardState] }}法院信息
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
                        <Tooltip v-show="cardState > 1 && !info.adress" content="此项必填">
                            <Icon type="android-alert" style="color: #ed3f14"></Icon>
                        </Tooltip>
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
                    <span style="color:#464c5b;font-size:16px;font-weight:700">全国法院信息库</span>
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
                        <FormItem label="法院电话：">
                            <Input style="width: 200px" v-model="formItem.phone"/>
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
    </div>
</template>
<script>
import { list, addCourtInfo, delCourtInfo, updateCourtInfo } from "../../api/courtDate.js";
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
      cardState: 0,
      op: ["", "查看", "添加", "修改"],
      show1: false,
      saved: false,
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
      pageNumber: 0,
      checkIds: [],
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
          width: 180
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
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
            //   h(
            //     "Button",
            //     {
            //       props: {
            //         type: "primary",
            //         size: "small"
            //       },
            //       style: {
            //         marginRight: "5px"
            //       },
            //       on: {
            //         click: () => {
            //           var c = JSON.parse(JSON.stringify(params.row));
            //           this.info = c;
            //           this.info.departmentName = this.info.court.name;
            //           this.info.createDateD =
            //             this.info.createDate &&
            //             this.formatDate(
            //               new Date(this.info.createDate),
            //               "yyyy-MM-dd hh:mm:ss"
            //             );
            //           this.info.birthdayD =
            //             this.info.birthday &&
            //             this.formatDate(
            //               new Date(this.info.birthday),
            //               "yyyy-MM-dd"
            //             );
            //           this.cardState = 1;
            //         }
            //       }
            //     },
            //     "详情"
            //   ),
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
                      this.info.name = c.name;
                      this.info.phone = c.telephone;
                      this.info.address = c.address;
                      this.province2 = c.province;
                      this.city2 = c.city;
                      this.county2 = c.county;
                      this.courtId = c.id;
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
        address:""
      }
    };
  },
  mounted() {
    this.getList(1);
    this.getCourtList();
  },
  methods: {
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
        courtName: this.formItem.name,
        courtPhone: this.formItem.phone,
      };
      params.pageNumber = page;
      params.pageSize = 10;
      list(params)
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
        courtName: this.info.name,
        courtPhone: this.info.phone,
        courtAddress: this.info.address,
      };

      if (this.cardState === 2) {
        addCourtInfo(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              this.info.name = "";
              this.info.phone = "";
              this.info.address = "";
            }
            this.getList(1);
            that.saved = false;
          })
          .catch(() => {
            that.$Message.error("网络错误");
            that.saved = false;
          });
      } else {
          params.courtInfoId = this.courtId;
        updateCourtInfo(params)
          .then(res => {
            var data = res.data;
            that.$Message.info(data.message);
            if (data.state === 100) {
              that.getList(that.pageNumber);
              this.info.name = "";
              this.info.phone = "";
              this.info.address = "";
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
      delCourtInfo(params)
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
