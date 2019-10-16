<template>
  <div>
    <Card style="min-width: 1300px;min-height: 600px">
      <Row style="padding-bottom: 10px;">
        <Col span="4">
        <span style="color:#464c5b;font-size:16px;font-weight:700">文书批量管理</span>
        </Col>
        <Col span="20">
        <Button style="margin-left: 10px" type="primary" @click="openAddModal">
          添加多个案件到工作列表
        </Button>
        <Button style="margin-left: 10px" type="error" @click="clearBatchCache">
          清空工作列表
        </Button>
        </Col>
      </Row>
      <Row style="padding-bottom: 10px;">
        <table class="batchbeta-table" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <th width="3%">序号</th>
            <th width="15%">案号</th>
            <th width="200">生成文书</th>
            <th width="6%">受送达人</th>
            <th width="16%">送达地址</th>
            <th width="6%">邮单收件人</th>
            <th width="17%">邮单地址</th>
            <th width="9%">收件电话</th>
            <th width="9%">邮单号</th>
            <th width="4%">操作</th>
          </tr>
          <tr v-for="(item,key) in batchCache" :key="key" :data-id="item.lawCaseId" :data-litigantId="item.litigantId">
            <td>{{key+1}}</td>
            <td>{{item.lawCaseNo}}</td>
            <td class="dip-table-operate" width="200" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.name.join('、')}}
              <div class="dip-operate" @click="editDip(key)">编辑</div>
            </td>
            <td>{{item.litigantName}}</td>
            <td>{{item.litigantAddress}}</td>
            <td>
              <Input v-model="item.recipients" />
            </td>
            <td>
              <Input v-model="item.emsAddress" />
            </td>
            <td>{{item.litigantPhone}}</td>
            <td>
              <Input v-model="item.oddNumbers" />
            </td>
            <td>
              <Button size="small" type="error" @click="delectBatchCacheItem(key)">
                删除
              </Button>
            </td>
          </tr>
        </table>
      </Row>
      <Row style="text-align: right">
        <Button style="margin-left: 10px" :disabled="this.batchCache.length==0" type="primary" @click="batchBuildFp('ggg')">
          批量生成公告稿
        </Button>
        <Button style="margin-left: 10px" :disabled="this.batchCache.length==0" type="primary" @click="batchBuildFp('fp')">
          批量生成封皮
        </Button>
        <Button style="margin-left: 10px" :disabled="this.batchCache.length==0" type="primary" @click="batchBuild">
          生成并下载所有文书
        </Button>
        <Button style="margin-left: 10px" :disabled="this.batchCache.length==0" type="primary" @click="batchEMS">
          打印所有邮单
        </Button>
        <Button style="margin-left: 10px" :disabled="this.batchCache.length==0 || canSend" type="primary" @click="batchSend(1)">
          发送(EMS)
        </Button>
        <Button style="margin-left: 10px" :disabled="this.batchCache.length==0" type="primary" @click="batchSend(2)">
          发送(现场领取)
        </Button>
      </Row>
    </Card>
    <Modal v-model="editDipModal" title="文书编辑" :mask-closable="false" :styles="{top: '20px'}" width="800px" @on-ok="editDipSubmit">
      <div>
        <Row class="row-margin-bottom checkgroup-wrapper">
          <CheckboxGroup v-model="editSimpleDip">
            <Row>
              <Col span="4" class="checkgroup-item-title">文书选择</Col>
              <Col span="20" class="checkgroup-item-content">
              <Checkbox label="送达回证">
                <span>送达回证</span>
              </Checkbox>
              <Checkbox label="传票(存根)">
                <span>传票(存根)</span>
              </Checkbox>
              <Checkbox label="传票">
                <span>传票</span>
              </Checkbox>
              <Checkbox label="举证通知书">
                <span>举证通知书x2</span>
              </Checkbox>
              <Checkbox label="应诉通知书">
                <span>应诉通知书x2</span>
              </Checkbox>
              <Checkbox label="诉讼权利义务告知书">
                <span>诉讼权利义务告知书x2</span>
              </Checkbox>
              <Checkbox label="送达地址确认书">
                <span>送达地址确认书</span>
              </Checkbox>
              <Checkbox label="廉政监督卡">
                <span>廉政监督卡</span>
              </Checkbox>
              <Checkbox label="小额诉讼须知">
                <span>小额诉讼须知x2</span>
              </Checkbox>
              <Checkbox label="参加诉讼通知书">
                <span>参加诉讼通知书</span>
              </Checkbox>
              <Checkbox label="电话通知记录表">
                <span>电话通知记录表</span>
              </Checkbox>
              <Checkbox label="合议庭组成人员通知书">
                <span>合议庭组成人员通知书</span>
              </Checkbox>
              <Checkbox label="送达地址有关事项告知书">
                <span>送达地址有关事项告知书</span>
              </Checkbox>
              <Checkbox label="受理案件通知书">
                <span>受理案件通知书</span>
              </Checkbox>
              <Checkbox label="委托送达函">
                <span>委托送达函</span>
              </Checkbox>
              <Checkbox label="审判流程信息公开告知内容">
                <span>审判流程信息公开告知内容</span>
              </Checkbox>
              </Col>
            </Row>
            <Row style="margin-top: 15px;">
              <Col span="4" class="checkgroup-item-title">快递单文书</Col>
              <Col span="20" class="checkgroup-item-content">
              <Checkbox label="证据">
                <span>证据</span>
              </Checkbox>
              <Checkbox label="起诉状">
                <span>起诉状</span>
              </Checkbox>
              <Checkbox label="追加被告申请书">
                <span>追加被告申请书</span>
              </Checkbox>
              <Checkbox label="民事裁定书">
                <span>民事裁定书</span>
              </Checkbox>
              <Checkbox label="其他">
                <span>
                  其他
                  <Input v-model="editOthersDip" style="width:300px" />
                </span>
              </Checkbox>
              </Col>
            </Row>
          </CheckboxGroup>
        </Row>
      </div>
    </Modal>
    <Modal v-model="addModal" title="案件添加" :mask-closable="false" :styles="{top: '20px'}" width="800px" @on-ok="addSubmit">
      <div>
        <Row class="row-margin-bottom">
          <Col span="2">
          <div style="height: 32px;line-height: 32px;">案号：</div>
          </Col>
          <Col span="18">
          <Input v-model="searchValue" placeholder="(请输入要添加的所有案号，例如：5788，5790，6201)" />
          </Col>
          <Col span="4" style="text-align: center;">
          <Button type="primary" @click="searchCaseNo">查询</Button>
          </Col>
        </Row>
        <Row class="row-margin-bottom" style="padding: 0px 35px;">
          <Row style="text-align:left;" class="row-margin-bottom">
            <Button style="margin-left: 10px" type="default" @click="selectAll">
              全选
            </Button>
            <Button style="margin-left: 10px" type="default" @click="selectEmpty">
              清空
            </Button>
          </Row>
          <Col span="11">
          <Table border ref="selection1" :columns="columns" :data="data1" @on-selection-change="selectChange1" class="batch-table"></Table>
          </Col>
          <Col span="2">&nbsp;</Col>
          <Col span="11">
          <Table border ref="selection2" :columns="columns" :data="data2" @on-selection-change="selectChange2" class="batch-table"></Table>
          </Col>
        </Row>
        <Row class="row-margin-bottom" style="padding: 25px 35px;border: 1px dashed #e9eaec">
          <Row class="row-margin-bottom checkgroup-wrapper">
            <Col span="4" class="checkgroup-item-title">受送达人批量选择</Col>
            <Col span="20" class="checkgroup-item-content">
            <RadioGroup v-model="litigant">
              <Radio label="1">
                <span>所有原告</span>
              </Radio>
              <Radio label="2">
                <span>所有被告</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
          <Row class="row-margin-bottom checkgroup-wrapper">
            <Col span="4" class="checkgroup-item-title">受送达人特殊规则</Col>
            <Col span="20" class="checkgroup-item-content">
            <RadioGroup v-model="litigantRules">
              <Radio label="0">
                <span>无规则</span>
              </Radio>
              <Radio label="1">
                <span>将夫妻关系的受送达人合并送达</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
          <Row class="row-margin-bottom checkgroup-wrapper">
            <Row>
              <Col span="4" class="checkgroup-item-title">文书批量选择</Col>
              <Col span="20" class="checkgroup-item-content">
              <CheckboxGroup v-model="simpleDip">
                <Checkbox label="送达回证">
                  <span>送达回证</span>
                </Checkbox>
                <Checkbox label="传票(存根)">
                  <span>传票(存根)</span>
                </Checkbox>
                <Checkbox label="传票">
                  <span>传票</span>
                </Checkbox>
                <Checkbox label="举证通知书">
                  <span>举证通知书x2</span>
                </Checkbox>
                <Checkbox label="应诉通知书">
                  <span>应诉通知书x2</span>
                </Checkbox>
                <Checkbox label="诉讼权利义务告知书">
                  <span>诉讼权利义务告知书x2</span>
                </Checkbox>
                <Checkbox label="送达地址确认书">
                  <span>送达地址确认书</span>
                </Checkbox>
                <Checkbox label="廉政监督卡">
                  <span>廉政监督卡</span>
                </Checkbox>
                <Checkbox label="小额诉讼须知">
                  <span>小额诉讼须知x2</span>
                </Checkbox>
                <Checkbox label="参加诉讼通知书">
                  <span>参加诉讼通知书</span>
                </Checkbox>
                <Checkbox label="电话通知记录表">
                  <span>电话通知记录表</span>
                </Checkbox>
                <Checkbox label="合议庭组成人员通知书">
                  <span>合议庭组成人员通知书</span>
                </Checkbox>
                <Checkbox label="送达地址有关事项告知书">
                  <span>送达地址有关事项告知书</span>
                </Checkbox>
                <Checkbox label="受理案件通知书">
                  <span>受理案件通知书</span>
                </Checkbox>
                <Checkbox label="委托送达函">
                  <span>委托送达函</span>
                </Checkbox>
                <Checkbox label="审判流程信息公开告知内容">
                  <span>审判流程信息公开告知内容</span>
                </Checkbox>
              </CheckboxGroup>
              </Col>
            </Row>
            <Row style="margin-top: 15px;">
              <Col span="4" class="checkgroup-item-title">快递单文书</Col>
              <Col span="20" class="checkgroup-item-content">
              <CheckboxGroup v-model="EMSDip">
                <Checkbox label="证据">
                  <span>证据</span>
                </Checkbox>
                <Checkbox label="起诉状">
                  <span>起诉状</span>
                </Checkbox>
                <Checkbox label="追加被告申请书">
                  <span>追加被告申请书</span>
                </Checkbox>
                <Checkbox label="民事裁定书">
                  <span>民事裁定书</span>
                </Checkbox>
                <Checkbox label="其他">
                  <span>
                    其他
                    <Input v-model="othersDip" style="width: 300px" />
                  </span>
                </Checkbox>
              </CheckboxGroup>
              </Col>
            </Row>
            <!-- <Row style="padding: 10px 20px;">
                <Col span="4" class="checkgroup-item-title">
                <Radio label="2">
                  <span>公告材料</span>
                </Radio>
                </Col>
                <Col v-show="programType == 2" span="20" class="checkgroup-item-content">
                <CheckboxGroup v-model="noticeDip">
                  <Checkbox label="公告稿">
                    <span>公告稿</span>
                  </Checkbox>
                  <Checkbox label="送达回证">
                    <span>送达回证</span>
                  </Checkbox>
                  <Checkbox label="传票">
                    <span>传票(原、被告各一套)</span>
                  </Checkbox>
                  <Checkbox label="传票(存根)">
                    <span>传票(存根)(原、被告各一套)</span>
                  </Checkbox>
                  <Checkbox label="合议庭组成人员通知书">
                    <span>合议庭组成人员通知书(原告x2、被告x1)</span>
                  </Checkbox>
                  <Checkbox label="公告正文">
                    <span>公告正文x2</span>
                  </Checkbox>
                  <Checkbox label="举证通知书">
                    <span>举证通知书</span>
                  </Checkbox>
                </CheckboxGroup>
                </Col>
              </Row>
              <Row style="padding: 10px 20px;">
                <Col span="4" class="checkgroup-item-title">
                <Radio label="3">
                  <span>委托材料</span>
                </Radio>
                </Col>
                <Col v-show="programType == 3" span="20" class="checkgroup-item-content">
                <CheckboxGroup v-model="entrustDip">
                  <Checkbox label="送达回证">
                    <span>送达回证(被告)</span>
                  </Checkbox>
                  <Checkbox label="传票">
                    <span>传票(仅被告)</span>
                  </Checkbox>
                  <Checkbox label="传票(存根)">
                    <span>传票(存根)(仅被告)</span>
                  </Checkbox>
                  <Checkbox label="合议庭组成人员通知书">
                    <span>合议庭组成人员通知书(被告x2)</span>
                  </Checkbox>
                  <Checkbox label="委托送达函">
                    <span>委托送达函</span>
                  </Checkbox>
                </CheckboxGroup>
                </Col>
              </Row> -->
          </Row>
          <Row class="row-margin-bottom checkgroup-wrapper">
            <Col span="4" class="checkgroup-item-title">送达地址</Col>
            <Col span="20" class="checkgroup-item-content">
            <CheckboxGroup v-model="address">
              <Checkbox label="0">
                <span>所有地址</span>
              </Checkbox>
              <Checkbox label="1">
                <span>户籍地址</span>
              </Checkbox>
              <Checkbox label="2">
                <span>居住地址</span>
              </Checkbox>
              <Checkbox label="3">
                <span>确认送达地址</span>
              </Checkbox>
            </CheckboxGroup>
            </Col>
          </Row>
          <Row class="row-margin-bottom checkgroup-wrapper">
            <Col span="4" class="checkgroup-item-title">送达地址例外规则</Col>
            <Col span="20" class="checkgroup-item-content">
            <CheckboxGroup v-model="addressRules">
              <Checkbox label="0">
                <span>无例外</span>
              </Checkbox>
              <Checkbox label="1">
                <span>去除湖里区地址</span>
              </Checkbox>
              <Checkbox label="2">
                <span>去除思明区地址</span>
              </Checkbox>
              <Checkbox label="3">
                <span>去除厦门市地址</span>
              </Checkbox>
            </CheckboxGroup>
            </Col>
          </Row>
          <Row class="row-margin-bottom checkgroup-wrapper">
            <Col span="4" class="checkgroup-item-title">收件电话</Col>
            <Col span="20" class="checkgroup-item-content">
            <RadioGroup v-model="phone">
              <Radio label="0">
                <span>所有号码</span>
              </Radio>
              <Radio label="1">
                <span>仅手机号码</span>
              </Radio>
              <Radio label="2">
                <span>仅固定电话</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
        </Row>
      </div>
    </Modal>
    <Modal
        v-model="selUsualLaw"
        width="520px"
        :mask-closable="false"
        title="下载">
        <div style="height:150px;overflow-x:hidden; overflow-y:visible">
            <Table :columns="columnsUsualLaw" highlight-row  :data="usualList"></Table>
        </div>
          <div style="margin-top: 10px; " slot="footer">
            <Button type="dashed"  @click="selUsualLaw = false"  >关闭</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import {
  findCaseNo,
  getCaseInfo,
  batchBuildDiploms,
  batchBuildExpressNew,
  sendEMS
} from "@/api/batch.js";
import { formatDate } from "../../libs/date.js";
export default {
  data () {
    return {
      addModal: false,
      selUsualLaw:false,
      editDipModal: false,
      editKey: "",
      batchCache: this.$store.getters.batchCache,
      searchValue: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "案号",
          key: "caseNo",
          align: "center"
        }
      ],
      data: [],
      data1: [],
      data2: [],
      caseSelectionAll: [],
      caseSelection1: [],
      caseSelection2: [],
      litigant: "2",
      litigantRules: "0",
      address: ["0", "1", "2", "3"],
      addressRules: ["0"],
      phone: "0",
      editProgramType: "",
      editSimpleDip: [],
      editOthersDip: "",
      editNoticeDip: [],
      editEntrustDip: [],
      columnsUsualLaw:[
        {
            title: "文件名字",
            key: "docNmae",
            width: 350,
            align: "center",
        },
        {
          title: "操作",
          key: "attachment",
          // width: 100,
          align: "center",
          render: (h, params) => {
              return h("div", [
              h(
                  "Button",
                  {
                  props: {
                      type: "text",
                      size: "small"
                  },
                  style:{
                      cursor:"pointer",
                      color:"#2d8cf0"
                  },
                  on: {
                      click: () => {
                          console.log(params.row.path)
                          let a = document.createElement("a");
                          a.href = params.row.path;
                          a.download =params.row.docNmae;
                          a.click();
                          // document.body.removeChild(a);
                      }
                  }
                  },
                  "下载"
              )
              ]);
          }
        }
      ],
      usualList:[],
      programType: "1",
      simpleDip: [
        "送达回证",
        "传票",
        "传票(存根)",
        "举证通知书",
        "应诉通知书",
        "诉讼权利义务告知书",
        "送达地址确认书",
        "廉政监督卡",
        // "合议庭组成人员通知书",
        "送达地址有关事项告知书",
        '审判流程信息公开告知内容'
      ],
      EMSDip: ["证据", "起诉状",'民事裁定书'],
      othersDip: "",
      noticeDip: [
        "公告稿",
        "送达回证",
        "传票",
        "传票(存根)",
        "合议庭组成人员通知书",
        "公告正文"
      ],
      entrustDip: ["送达回证", "传票", "传票(存根)", "委托送达函"]
    };
  },
  computed: {
      
    canSend () {
      for (let i = 0; i < this.batchCache.length; i++) {
        if (this.batchCache[i].oddNumbers == "") {
          return true;
        }
      }
      return false;
    }
  },
  created () {
    // console.log(this.batchCache)  
  },
  watch: {
      batchCache(cur,old){
        //   console.log(cur)
        //   console.log(old)
          
      }
  },
  methods: {
    openAddModal () {
      var msg = this.$Message.loading({
        content: "载入案件中。。",
        duration: 0
      });
      this.simpleDip = [
        "送达回证",
        "传票",
        "传票(存根)",
        "举证通知书",
        "应诉通知书",
        "诉讼权利义务告知书",
        "送达地址确认书",
        "廉政监督卡",
        // "合议庭组成人员通知书",
        "送达地址有关事项告知书",
        '审判流程信息公开告知内容'
      ];
      this.EMSDip = ["证据", "起诉状"];
      this.othersDip = "";
      this.noticeDip = [
        "公告稿",
        "送达回证",
        "传票",
        "传票(存根)",
        "合议庭组成人员通知书",
        "公告正文"
      ];
      this.entrustDip = ["送达回证", "传票", "传票(存根)", "委托送达函"];
      this.programType = "1";
      this.findCaseNoApi().then(res => {
        msg();
        if (res) {
          this.addModal = true;
          this.caseSelectionAll = [];
          this.caseSelection1 = [];
          this.caseSelection2 = [];
        }
      });
    },
    searchCaseNo () {
      this.findCaseNoApi();
    },
    selectAll () {
      this.$refs.selection1.selectAll(true);
      this.$refs.selection2.selectAll(true);
    },
    selectEmpty () {
      this.$refs.selection1.selectAll(false);
      this.$refs.selection2.selectAll(false);
    },
    selectChange1 (selection) {
      this.caseSelection1 = selection;
      this.caseSelectionAll = this.caseSelection1.concat(this.caseSelection2);
    },
    selectChange2 (selection) {
      this.caseSelection2 = selection;
      this.caseSelectionAll = this.caseSelection1.concat(this.caseSelection2);
    },
    addSubmit () {
      let lawCaseIds = [];
      let litigantType = this.litigant;
      let litigantRule = this.litigantRules;
      let address = this.address.join(",");
      let addressRule = this.addressRules.join(",");
      let phone = this.phone;
      this.caseSelectionAll.map(item => {
        lawCaseIds.push(item.id);
      });
      lawCaseIds = lawCaseIds.join(",");

      getCaseInfo({
        lawCaseIds,
        litigantType,
        litigantRule,
        address,
        addressRule,
        phone
      })
        .then(res => {
          if (res.data.state == 100) {
            res.data.result.map(item => {
              item.programType = this.programType;
              let simpleDipArr=[]
              if (this.programType == 1) {
                item.name = this.simpleDip.concat(this.EMSDip);
                // for (let z = 0; z < this.EMSDip.length; z++) {
                //     simpleDipArr.push(this.EMSDip[z])
                // }

                // item.name = this.simpleDip
              } else if (this.programType == 2) {
                item.name = this.noticeDip;
              } else {
                item.name = this.entrustDip;
              }
              item.recipients = item.litigantName;
              item.emsAddress = item.litigantAddress;
              item.oddNumbers = "";
              item.othersDip = this.othersDip;
              
            });
            
            for (let i = 0; i < res.data.result.length; i++) {
              for (let j = 0; j < this.batchCache.length; j++) {
                try {
                  if (
                        res.data.result[i].lawCaseId ==
                        this.batchCache[j].lawCaseId &&
                        res.data.result[i].litigantId ==
                        this.batchCache[j].litigantId &&
                        res.data.result[i].litigantAddressId ==
                        this.batchCache[j].litigantAddressId
                  ) {
                      alert(this.programType)
                    res.data.result[i].programType = this.programType;
                    if (this.programType == 1) {
                      res.data.result[i].name = this.simpleDip.concat(this.EMSDip);
                    }
                    else if (this.programType == 2) {
                      res.data.result[i].name = this.noticeDip;
                    } else {
                      res.data.result[i].name = this.entrustDip;
                    }
                    this.batchCache[j] = res.data.result[i];
                    res.data.result = this.removeElementInArray(
                      res.data.result,
                      i
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            }
            console.log(this.batchCache)
            this.batchCache = this.batchCache.concat(res.data.result);
            console.log(this.batchCache)
            this.$store.commit("SET_BATCHCACHE", this.batchCache);
            if (res.data.error != "") {
              this.$Message.info({ content: res.data.error, duration: 3 });
            }
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$Message.error("服务器错误，请稍后再试");
        });
    },
    delectBatchCacheItem (index) {
      this.batchCache.splice(index, 1);
    },
    editDip (key) {
        // console.log(this.batchCache[key])
      this.editDipModal = true;
      this.editProgramType = this.batchCache[key].programType;
      this.editOthersDip = this.batchCache[key].othersDip;
      if (this.batchCache[key].programType == 1) {
        this.editSimpleDip = this.batchCache[key].name;
      } else if (this.batchCache[key].programType == 2) {
        this.editNoticeDip = this.batchCache[key].name;
      } else {
        this.editEntrustDip = this.batchCache[key].name;
      }
      this.editKey = key;
    },
    editDipSubmit () {
      this.batchCache[this.editKey].programType = this.editProgramType;
      if (this.editProgramType == 1) {
        this.batchCache[this.editKey].name = this.editSimpleDip;
      } else if (this.editProgramType == 2) {
        this.batchCache[this.editKey].name = this.editNoticeDip;
      } else {
        this.batchCache[this.editKey].name = this.editEntrustDip;
      }
      this.batchCache[this.editKey].othersDip = this.editOthersDip;
    },
    batchBuildFp(st){
      let result = [];
        console.log(this.batchCache)
        this.batchCache.map(item => {
            let objectData=[]
            let object = {};
        
        
        object.programType = item.programType;
        object.name=this.deepClone(item.name, objectData);
        if (object.name.indexOf("其他") != -1) {
          object.name.push(item.othersDip);
        }
        this.removeInArray(object.name, "其他");
        object.name = object.name.join(",");
        object.caseNo = item.lawCaseNo;
        object.litigantId = item.litigantId;
        object.caseId = item.lawCaseId;
        result.push(object);
      });
      let data = JSON.stringify({ result });
      var msg = this.$Message.loading({
        content: "文书生成中请稍后。。",
        duration: 0
      });
      this.usualList = [];
      batchBuildDiploms({ result: data,paper:st == 'fp' ? '封皮' : "公告稿" })
        .then(res => {
          msg();
          if (res.data.state == 100) {
            if (res.data.path == "") {
              this.$Message.info({
                content: res.data.message,
                duration: 5
              });
            } else {
              
              if(st != 'fp'){
                let data1 = {
                  docNmae:"批量公告稿(" + formatDate(new Date(), "MM-dd hh:mm:ss") + ")",
                  path:res.data.path
                }
                this.usualList.push(data1)

                let aryss = res.data.docPath.split(".");
                let xar = aryss[aryss.length-2].split("/");
                let type = aryss[aryss.length-1];
                let name = xar[xar.length-1];
                let data2 = {
                  docNmae:name + "." + type,
                  path:res.data.docPath
                }
                this.usualList.push(data2);
                this.selUsualLaw = true;
              }else{
                var a = document.createElement("a");
                a.href = res.data.path;
                a.download =
                  "批量封皮(" + formatDate(new Date(), "MM-dd hh:mm:ss") + ")";
                a.click();
              }
              
              this.$Message.success("生成成功！");
            }
          } else {
            this.$Message.info(res.data.message);
          }
        })
        .catch(err => {
          msg();
          this.$Message.error("服务器错误请稍后再试");
        });
    },
    batchBuild () {
        
        // console.log(objectData)
        // object.name=this.deepClone(item.name, objectData);
        let result = [];
        console.log(this.batchCache)
        this.batchCache.map(item => {
            let objectData=[]
            let object = {};
        
        
        object.programType = item.programType;
        object.name=this.deepClone(item.name, objectData);
        if (object.name.indexOf("其他") != -1) {
          object.name.push(item.othersDip);
        }
        this.removeInArray(object.name, "其他");
        object.name = object.name.join(",");
        object.caseNo = item.lawCaseNo;
        object.litigantId = item.litigantId;
        object.caseId = item.lawCaseId;
        result.push(object);
      });
      let data = JSON.stringify({ result });
      var msg = this.$Message.loading({
        content: "文书生成中请稍后。。",
        duration: 0
      });
      batchBuildDiploms({ result: data })
        .then(res => {
          msg();
          if (res.data.state == 100) {
            if (res.data.path == "") {
              this.$Message.info({
                content: res.data.message,
                duration: 5
              });
            } else {
              var a = document.createElement("a");
              a.href = res.data.path;
              a.download =
                "批量文书(" + formatDate(new Date(), "MM-dd hh:mm:ss") + ")";
              a.click();
              this.$Message.success("生成成功！");
            }
          } else {
            this.$Message.info(res.data.message);
          }
        })
        .catch(err => {
          msg();
          this.$Message.error("服务器错误请稍后再试");
        });
    },
    batchEMS () {
      let result = [];
      
        this.batchCache.map(item => {
            let objectData=[]
            let object = {};
        
        // this.removeInArray(item.name, "其他");
        // object.diploms = item.name.join(",");
        object.diploms=this.deepClone(item.name, objectData);
        if (object.diploms.indexOf("其他") != -1) {
          object.diploms.push(item.othersDip);
        }
        for(let i=0;i<object.diploms.length;i++){
          if(object.diploms[i] == '送达地址有关事项告知书'){
              object.diploms[i] = '送达地址告知书'
          }
          if(object.diploms[i] == '审判流程信息公开告知内容'){
              object.diploms[i] = '审判流程告知书'
          }
        }
        this.removeInArray(object.diploms, "其他");
        object.diploms = object.diploms.join(",");
        object.caseNo = item.lawCaseNo;
        object.recipients = item.recipients;
        object.emsAddress = item.emsAddress;
        object.telephone = item.litigantPhone;
        object.judgeName = item.judge;
        result.push(object);
      });
      let data = JSON.stringify(result);
      var msg = this.$Message.loading({
        content: "快递单生成中请稍后。。",
        duration: 0
      });
      batchBuildExpressNew({ result: data })
        .then(res => {
          msg();
          if (res.data.state == 100) {
            window.open(res.data.path);
          } else {
            this.$Message.info({ content: res.data.message, duration: 5 });
          }
        })
        .catch(err => {
          msg();
          this.$Message.error("服务器错误请稍后再试");
        });
    },

deepClone(origin, target) {
    var target = target || {};
    var toStr = Object.prototype.toString;
    for (var key in origin) {
        if (origin.hasOwnProperty(key)) {
            var res = toStr.call(origin[key]);
            if (res === '[object Object]') {
                target[key] = {};
                deepClone(origin[key], target[key]);
            } else if (res === '[object Array]') {
                target[key] = [];
                deepClone(origin[key], target[key]);
            } else {
                target[key] = origin[key];
            }
        }
    }
    return target;
},
    batchSend (type) {
      let result = [];
      this.batchCache.map(item => {
        let object = {};
        let otherArr = [];
        let objectData=[]
        console.log(objectData)
        object.name=this.deepClone(item.name, objectData);
        if (object.name.indexOf("证据") != -1) {
          otherArr.push("证据");
          this.removeInArray(object.name, "证据");
        }
        if (object.name.indexOf("起诉状") != -1) {
          otherArr.push("起诉状");
          this.removeInArray(object.name, "起诉状");
        }
        if (object.name.indexOf("追加被告申请书") != -1) {
          otherArr.push("追加被告申请书");
          this.removeInArray(object.name, "追加被告申请书");
        }
        if (object.name.indexOf("民事裁定书") != -1) {
          otherArr.push("民事裁定书");
          this.removeInArray(object.name, "民事裁定书");
        }
        if (object.name.indexOf("其他") != -1) {
          otherArr.push(item.othersDip);
          this.removeInArray(object.name, "其他");
        }
        object.otherName = otherArr.join(",");
        object.name = object.name.join(",");
        
        object.caseNo = item.lawCaseNo;
        object.caseId = item.lawCaseId;
        object.litigant = item.litigantName;
        object.address = item.emsAddress;
        object.phone = item.litigantPhone;
        object.litigantId = item.litigantId;
        object.oddNumbers = item.oddNumbers;
        result.push(object);
      });
      let data = JSON.stringify(result);
      var msg = this.$Message.loading({
        content: "发送中请稍后。。",
        duration: 0
      });
      sendEMS({ result: data, type })
        .then(res => {
          msg();
          if (res.data.state == 100) {
            if (res.data.error != "") {
              this.$Message.error({ content: res.data.error, duration: 5 });
            }
            var a = document.createElement("a");
            a.href = res.data.path;
            a.download =
              "批量文书(" + formatDate(new Date(), "MM-dd hh:mm:ss") + ")";
            a.click();
            this.$Message.info(res.data.message);
            this.clearBatchCache();
          } else {
            this.$Message.info(res.data.message);
          }
        })
        .catch(err => {
          msg();
          this.$Message.error("服务器错误请稍后再试");
        });
    },
    findCaseNoApi () {
      return findCaseNo({ caseNo: this.searchValue })
        .then(res => {
          if (res.data.state === 100) {
            let temporary1 = [];
            let temporary2 = [];
            for (
              let i = 0;
              i < parseInt((res.data.result.length + 1) / 2);
              i++
            ) {
              temporary1[i] = res.data.result[i];
              if (
                i + parseInt((res.data.result.length + 1) / 2) <
                res.data.result.length
              ) {
                temporary2[i] =
                  res.data.result[
                  i + parseInt((res.data.result.length + 1) / 2)
                  ];
              }
            }
            this.data1 = temporary1;
            this.data2 = temporary2;
            return true;
          } else {
            this.$Message.error(res.data.message);
            return false;
          }
        })
        .catch(err => {
          this.$Message.error("服务器错误,请稍后再试！");
          return false;
        });
    },
    removeElementInArray (tempArray, n) {
      if (n < 0) {
        return tempArray;
      } else {
        return tempArray
          .slice(0, n)
          .concat(tempArray.slice(n + 1, tempArray.length));
      }
    },
    removeInArray (arr, str) {
      var index = arr.indexOf(str);
      if (index != -1) {
        return arr.splice(index, 1);
      } else {
        return arr;
      }
      console.log(arr);
    },
    clearBatchCache () {
      this.batchCache = [];
      this.$store.commit("SET_BATCHCACHE", []);
    }
  },
  destroyed () {
    console.log("destroyed");
  }
};
</script>
<style>
.batchbeta-table {
  width: 100%;
  min-width: 1200px;
  border: 1px solid #e9eaec;
  table-layout: fixed;
}
.batchbeta-table th {
  border-right: 1px solid #e9eaec;
  border-bottom: 1px solid #e9eaec;
  background: #f8f8f9;
  overflow: hidden;
  font-size: 14px;
  height: 36px;
  line-height: 20px;
}
.batchbeta-table th:last-child {
  border: none;
  border-bottom: 1px solid #e9eaec;
}
.batchbeta-table td {
  overflow: hidden;
  border-right: 1px solid #e9eaec;
  border-bottom: 1px solid #e9eaec;
  text-align: center;
  height: 60px;
  line-height: 25px;
  background: #fff;
  font-size: 14px;
}
.batchbeta-table td:last-child {
  border: none;
  border-bottom: 1px solid #e9eaec;
}
.row-margin-bottom {
  text-align: center;
  margin-bottom: 10px;
}
.batch-table .ivu-table-header .ivu-checkbox {
  display: none;
}
.checkgroup-wrapper {
  text-align: left;
}
.checkgroup-wrapper .checkgroup-item-title {
  font-weight: 600;
}
.checkgroup-wrapper .checkgroup-item-content {
  padding-left: 60px;
}
.dip-table-operate {
  position: relative;
}
.dip-table-operate:hover .dip-operate {
  bottom: 0px;
}
.dip-table-operate .dip-operate {
  position: absolute;
  left: 0px;
  bottom: -20px;
  background: #40a9ff;
  color: #fff;
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  width: 100%;
  cursor: pointer;
  transition: bottom 0.5;
  -moz-transition: bottom 0.5s;
  -webkit-transition: bottom 0.5s;
  -o-transition: bottom 0.5s;
}
</style>

