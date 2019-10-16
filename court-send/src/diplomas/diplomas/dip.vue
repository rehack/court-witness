
<style>
.demo-badge-alone{
      background: green;
  }
  .ivu-badge{
      padding-top: 9px;
      /* margin-left: -15px; */
  }
  .a-upload {
    padding: 4px 10px;
    line-height: 20px;
    position: relative;
    cursor: pointer;
    color: #888;
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    *display: inline;
    *zoom: 1
}
.a-upload  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
}

.a-upload:hover {
    color: #444;
    background: #eee;
    border-color: #ccc;
    text-decoration: none
}
.ivu-btn{
    /* padding: 6px 5px; */
}
.selDipcs{
    cursor: pointer;
    color: #40a9ff;
    float: right;
}
</style>

<template>
    <div id="my-node" class="layoutM">
        <Card class="cardItem">
            <p slot="title">
                <Icon type="wrench"></Icon>
                案件搜索
            </p>
            <div style="width: 40px" slot="extra">
                <!-- <Row :gutter="8" justify="center">
                    <Col class="minus-icon" span="12">
                        <Icon type="minus-round"></Icon>
                    </Col>
                    <Col class="close-icon" span="12">
                        <Icon type="close-round"></Icon>
                    </Col>
                </Row> -->
            </div>
            <div style="margin-bottom: 16px">
                <Form :label-width="60" @keydown.native.enter.prevent="queryCase">
                    <FormItem label="案号">
                        <Input v-model="caseNo" placeholder="请输入案号"></Input>
                    </FormItem>
                    <FormItem label="原告姓名">
                        <Input v-model="plaintiffName"></Input>
                    </FormItem>
                    <FormItem label="被告姓名">
                        <Input v-model="defendantName"></Input>
                    </FormItem>
                    <Button type="info" :loading="queryLoading" @click="queryCase" long>
                        <span v-if="!queryLoading">查询</span>
                        <span v-else></span>
                    </Button>
                </Form>
            </div>
            <ButtonGroup vertical>
                <Button v-for="(item, key) in caseList" type="ghost" :key="key" v-show="parseInt(key/10) === (caseP - 1)" @click="showLeft(item.id)" class="caseBtn">
                    <p>
                        <Tooltip :content="item.caseNo">
                            案号：{{ item.caseNo }}
                        </Tooltip>
                    </p>
                    <p>
                        <Tooltip :content="'案由：' + item.briefName + '|' + item.litigationStatusName + ':' + item.litigantName" placement="bottom-start">
                            <p>案由：{{ item.briefName }} | {{ item.litigationStatusName }}:{{ item.litigantName }}</p>
                        </Tooltip>
                    </p>
                </Button>
            </ButtonGroup>
            <Page v-if="caseList.length > 10" :current="caseP" @on-change="changePage" :total="caseList.length" style="padding-left: 28px;padding-top: 10px" simple></Page>
        </Card>
        <Card v-if="info.length">
            <p slot="title">
                案件信息
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案号
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ info[0].caseNo }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案由
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ info[0].briefName }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        法官
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ judgeName }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        书记员
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ clerkName }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        建档时间
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ formatDate(new Date(info[0].filingDate - 0), 'yyyy-MM-dd') }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        结案时间
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ info[0].closeDate && formatDate(new Date(info[0].closeDate - 0), 'yyyy-MM-dd') }}
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        案件金额
                    </Col>
                    <Col span="21" class="maininfo-col">
                        {{ info[0].applyStandard }}元
                    </Col>
                </Row>
            </div>
            <div style="margin-top: 10px; text-align: right;">
              <!-- <Button @click="payKeyCreate()" type="info" style="background-color: #15A05D; border-color: #15A05D;"></Button> -->

              
              <a :href="downUrl"></a>
                    <Upload :show-upload-list="false" :on-success="uploadSuccess" :action='uploadUrl' style="float:right;margin-left:5px" :format="['doc','docx']" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                            <Button type="ghost" icon="ios-cloud-upload-outline">文书识别码生成</Button>
                    </Upload>

              <Button @click="editor('封皮',info[0])" type="info" style="background-color: #15A05D;float:right; margin-left:5px;border-color: #15A05D;" >封皮编辑并生成</Button>
              
                <Button @click="showFinace()" type="info" style="background-color: #15A05D; border-color: #15A05D;">查看诉前附件</Button>
                <Button @click="dipshowF('封皮')" type="info" style="background-color: #15A05D; border-color: #15A05D;">封皮生成</Button>

            </div>
        </Card>
        <Card v-if="info.length" v-for="(item, key) in info" :key="key" style="margin-top: 10px">
            <p slot="title">
                <span v-show="!item.isEdit" @click="changeEdit(item)" style="cursor:pointer;float:right">编辑</span>
                
                <span v-show="item.isEdit" @click="saveEdit(item)" style="cursor:pointer;float:right">保存</span>
                <span v-show="item.isEdit" @click="canselEdit(item)" style="cursor:pointer;float:right;margin-right:15px">取消</span>
            </p>
            <div class="maininfo-warp">
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        {{ item.litigationStatusName }}
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ item.litigantName }}
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        {{item.litigantType==0 ? '身份证号码' : '统一信用代码'}}
                    </Col>
                    <Col span="9" class="maininfo-col">
                        <span v-show="!item.isEdit">{{ item.identityCard }}</span>
                        <Input v-show="item.isEdit" v-model="item.identityCard"></Input>
                    </Col>
                    <!-- <Col span="3" class="maininfo-col maininfo-col-label">
                        电子邮箱
                    </Col>
                    <Col span="9" class="maininfo-col">
                        {{ item.email }}
                    </Col> -->
                </Row>
                <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        手机号码
                    </Col>
                    <Col span="9" class="maininfo-col">
                       <span v-show="!item.isEdit">{{ item.litigantPhone }}</span>
                        <Input v-show="item.isEdit" v-model="item.litigantPhone"></Input>
                    </Col>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        固定电话
                    </Col>
                    <Col span="9" class="maininfo-col">
                        <span v-show="!item.isEdit">{{ item.litigantTelPhone }}</span>
                        <Input v-show="item.isEdit" v-model="item.litigantTelPhone"></Input>
                    </Col>
                </Row>
                <!-- <Row>
                    <Col span="3" class="maininfo-col maininfo-col-label">
                        {{item.litigantType==0 ? '身份证号码' : '统一信用代码'}}
                    </Col>
                    <Col span="21" class="maininfo-col">
                        {{ item.identityCard }}
                    </Col>
                </Row> -->
                <div style="line-height: 38px;border-right:1px solid #e9eaec;border-bottom:1px solid #e9eaec;" >
                   <span > &nbsp;&nbsp; 送达方式：
                       <Select v-model="item.sendType"  @on-change="showType(item.litigantId, item.sendType)" style="width:200px">
                            <Option v-for="(st, key) in sendTypes" v-if="item.litigationStatusName == '被告'  ? true : (st == '委托送达' ? false :true)" :value="key" :key="key">{{ st }}</Option>
                        </Select>
                        <!-- v-if="item.litigationStatusName == '被告'" -->
                        <!-- <Select v-model="item.sendType" v-else @on-change="showType(item.litigantId, item.sendType)" style="width:200px">
                            <Option v-for="(st, key) in sendTypesLit" :value="key" :key="key">{{ st }}</Option>
                        </Select> -->
                   </span>
                    <span style="float:right;margin-right:15px;display:inline-block">
                        
                    </span>
                </div>
                <div style="line-height: 38px;border-right:1px solid #e9eaec;" v-if="item.diplomsName">

                    &nbsp;&nbsp; 文书列表选择
                    <Checkbox :indeterminate="item.indeterminate" :value="item.checkAll" @click.prevent.native="handleCheckAll(item)" style="float:right">全选</Checkbox>
                </div>
                <div v-if="item.diplist" class="maininfo-warp"  style="border-left:none">
                    <CheckboxGroup size="large" v-model="item.dipChecked" @on-change="dipCheckedChange(item,$event)">
                        <Row>

                            <Col v-if="item.diplist" v-for="(d, key) in item.diplist" :key="key" span="6" class="maininfo-col" style="overflow: hidden;">
                                <template v-if="d.ispro">
                                   <template   v-if="item.isproduct">
                                     <Checkbox @click="isCheckeds()" :label="d.name" class="created"></Checkbox>
                                   </template>
                                   <template   v-else>
                                     <Checkbox :label="d.name"></Checkbox>
                                   </template>
                               </template>
                                <template v-else>
                                   <Checkbox :label="d.name"></Checkbox>
                               </template>
                                <template v-if="d.edit">
                                    <Badge   count="已编辑" class-name="demo-badge-alone"></Badge>
                                </template>
                                <template v-if="d.name !='送达地址有关事项告知书'">
                                 <span v-if="d.name !='诉讼权利义务告知书' && d.name !='送达地址有关事项告知书'&& d.name !='审判流程信息公开告知内容' && d.name !='调解确认裁定书' && d.name != '领取诉讼文书通知书' " @click="editor(d.name,item)" class="edit">编辑</span>
                                </template>
                            </Col>
                        </Row>
                    </CheckboxGroup>
                </div>
                <div style="line-height: 38px;border-right:1px solid #e9eaec;border-top:1px solid #e9eaec;" >
                     &nbsp;&nbsp; 其他文书
                </div>
                <div v-if="item.diplist" style="border-top:1px solid #e9eaec;" >
                        <Row>
                            <CheckboxGroup v-model="item.disabledGroup" @on-change="otherdipCheckedChange(item)">
                                <Col span="4" class="maininfo-col">
                                    <Checkbox label="证据材料" ></Checkbox>
                                </Col>
                                <Col span="4" class="maininfo-col">
                                    <Checkbox label="起诉状" ></Checkbox>
                                </Col>
                                <Col span="4" class="maininfo-col">
                                    <Checkbox label="反诉状" ></Checkbox>
                                </Col>
                                <Col span="4" class="maininfo-col">
                                    <Checkbox label="答辩状" ></Checkbox>
                                </Col>
                                <Col span="4" class="maininfo-col">
                                    <Checkbox label="上诉状" ></Checkbox>
                                </Col>
                                <Col span="4" class="maininfo-col">
                                    <Checkbox label="民事裁定书" ></Checkbox>
                                </Col>
                            </CheckboxGroup>
                            <Col span="4" class="maininfo-col">
                                <Checkbox v-model="item.checkBo" ><Input v-model="item.other"  placeholder="其他" style="width: 110px;height:36px;display:inline-block"></Input></Checkbox>
                            </Col>
                            <CheckboxGroup v-model="item.otherGroup"  @on-change="dipOtherGroupChange(item)">
                            <Col span="6" class="otherCol">
                                <Checkbox label="上传证据"></Checkbox>
                                <Upload multiple :show-upload-list="false"  :on-success="uploadZhengJ" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px" >
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传证据</Button>
                                </Upload>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.ZhengJfileNlist">{{op.name}}<span @click="delZhengJFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                            </CheckboxGroup>
                        </Row>

                    <!-- <Row> -->

                    <!-- </Row> -->
                </div>
                <div style="line-height: 38px;border-right:1px solid #e9eaec;border-top:1px solid #e9eaec;" >
                     &nbsp;&nbsp; 裁判文书(上传文件格式支持：doc、docx、pdf)
                </div>
                <div v-if="item.diplist" style="border-top:1px solid #e9eaec;">
                    <Row>
                        <CheckboxGroup v-model="item.otherGroup" @on-change="dipOtherGroupChange(item)">
                            <Row>
                            <Col span="8" class="otherCol">
                                <Checkbox label="申请书" ></Checkbox>
                                
                                <Upload multiple :show-upload-list="false"  :on-success="uploadSuccessShen" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px" >
                                    <Button type="ghost"  icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'申请书')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.shenfileNlist">{{op.name}}<span @click="delShenFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                            
                            

                            <Col span="8" class="otherCol" >
                                <Checkbox label="支付令" ></Checkbox>
                                <Upload multiple :show-upload-list="false" :on-success="uploadSuccessZhi" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'支付令')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.zhifileNlist">{{op.name}}<span @click="delZhiFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                            <Col span="8" class="otherCol" >
                                <Checkbox label="支付令证据材料" ></Checkbox>
                                <Upload multiple :show-upload-list="false" :on-success="uploadSuccessZhizhen" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'支付令证据材料')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.zhizhenfileNlist">{{op.name}}<span @click="delZhizhenFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                             </Row>
                             

                            <Row style="margin-top:10px">
                            <Col span="8" class="otherCol" style="border-top: 1px solid #e9eaec;">
                                <Checkbox label="公告判决书" ></Checkbox>
                                <Upload multiple :show-upload-list="false"  :on-success="uploadSuccessPay" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'公告判决书')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.payfileNlist">{{op.name}}<span @click="delPayFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                            <Col span="8" class="otherCol" style="border-top: 1px solid #e9eaec;">
                                <Checkbox label="调解书" ></Checkbox>
                                <Upload multiple :show-upload-list="false" :on-success="uploadSuccessZhen" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'调解书')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.zhenfileNlist">{{op.name}}<span @click="delZhenFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                            <Col span="8" class="otherCol" style="border-top: 1px solid #e9eaec;">
                                <Checkbox label="裁定书" ></Checkbox>
                                <Upload multiple :show-upload-list="false" :on-success="uploadSuccessCai" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'裁定书')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.caifileNlist">{{op.name}}<span @click="delCaiFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                             </Row>

                             <Row style="margin-top:10px">
                            <Col span="8" class="otherCol" style="border-top: 1px solid #e9eaec;">
                                <Checkbox label="决定书" ></Checkbox>
                                <Upload multiple :show-upload-list="false" :on-success="uploadSuccessJue" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px" >
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'决定书')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.juefileNlist">{{op.name}}<span @click="delJueFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                            <Col span="8" class="otherCol" style="border-top: 1px solid #e9eaec;">
                                <Checkbox label="民事判决书" ></Checkbox>
                                <Upload multiple :show-upload-list="false" :on-success="uploadMinShi" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'民事判决书')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.minShifileNlist">{{op.name}}<span @click="delMinShiFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                            <Col span="8" class="otherCol" style="border-top: 1px solid #e9eaec;">
                                <Checkbox label="其他法律文书" ></Checkbox>
                                <Upload multiple :show-upload-list="false" :on-success="uploadSuccessQi" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'其他法律文书')">选择</span>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.qifileNlist">{{op.name}}<span @click="delQiFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                            <Col span="8" v-show="item.sendType === 7" class="otherCol" style="border-top: 1px solid #e9eaec;">
                                <Checkbox label="撤诉裁定书" ></Checkbox>
                                
                                <Upload multiple :show-upload-list="false" :on-success="uploadSuccessCq" :data="{id: item.litigantId}" action='/api/court/send/uploadZhifu.jhtml' style="float:right;margin-left:5px">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span class="selDipcs" @click="selectArc(item,'撤诉裁定书')">选择</span>
                                <Button @click="createCai()" style="float: right;margin-top: 4px;"  type="info">生成</Button>
                                <div style="display:block;text-align:right;padding-right:5px;">
                                    <p v-for="op in item.cqfileNlist">{{op.name}}<span @click="delCqFile(item,op.name)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                                </div>
                            </Col>
                             </Row>
                        </CheckboxGroup>
                    </Row>
                </div>
                <Row v-show="item.sendType === 3" style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;" >
                        <span style="color: #ed3f14">*</span>
                        邮箱地址：
                    </Col>
                    <Col span="10">
                        <Input v-model="item.email" style="width: 100%"></Input>
                    </Col>
                </Row>
                <Row v-show="item.sendType === 3" style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                    <span style="color: #ed3f14">*</span>
                        邮件模板：
                    </Col>
                    <Col span="10">
                        <Select style="width:100%" v-model="item.etListKey" @on-change="emailTpChange(item)">
                            <Option v-for="(it, key) in item.emailListArr" :value="key" :key="key">{{ it.name }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row v-show="item.sendType === 3"  style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                        模板内容：
                    </Col>
                    <Col span="12">
                        <div style="padding: 5px 6px;">
                            {{ item.emailContent }}
                        </div>
                    </Col>
                </Row>
                <Row v-show="item.sendType == 2"  style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                        <span style="color: #ed3f14">*</span>
                        收件地址：
                    </Col>
                    <Col span="9">
                        <Input v-model="item.address" style="width: 100%" v-show="item.addressList.length == 0"></Input>
                        <Select v-model="item.sendAddress"   style="width:100%" v-show="item.addressList.length != 0">
                            <Option v-for="(st, key) in item.addressList" :value="st" :key="key">{{ st }}</Option>
                        </Select>
                        <!-- <Icon @click.native="addOther(item.litigantId)" type="plus-round" style="font-size: 18px;margin-left: 10px;font-weight: 600;color: #40A9FF;cursor: pointer;"></Icon> -->
                    </Col>
                    <!-- <Col span="3" v-if="item.sendType === 1">
                        <Button type="info" @click="addAdreModel(item)" long style="margin-left: 15px;">添加地址</Button>
                    </Col> -->
                </Row>

                <Row v-show="item.sendType == 1"  style="margin-top:10px">
                    <div v-for=" eo in item.emsAdressList" >
                        <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;margin-top:5px;">
                            <span style="color: #ed3f14">*</span>
                            收件地址：
                        </Col>
                        <Col span="8" style="margin-top:5px;">
                            <Input v-model="eo.addressName" style="width: 100%" v-show="item.addressList.length == 0"></Input>
                            <Select v-model="eo.addressName"   style="width:100%" v-show="item.addressList.length != 0">
                                <Option v-for="(st, key) in item.addressList" :value="st" :key="key">{{ st }}</Option>
                            </Select>
                            
                        </Col>
                        <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;margin-top:5px;">
                            <span style="color: #ed3f14">*</span>
                            快递单号：
                        </Col>
                        <Col span="8" style="margin-top:5px;">
                            <Input v-model="eo.addressNumber" style="width: 100%"></Input>
                            
                        </Col>
                        <Col span="2" style="margin-top:5px;">
                            <Icon @click.native="delemsAdress(item, eo)" v-show="eo.id != 0" class="icoadress" type="trash-a"></Icon>
                            <Icon type="plus-round"  v-show="eo.id == item.adId - 1 && item.emsAdressList.length != item.addressList.length" @click.native="addemsAdress(item)" class="icoadress"></Icon>
                        </Col>
                    </div>                    
                </Row>

                <Row v-show="item.sendType === 6 && item.litigationStatusName == '被告'" style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                    <span style="color: #ed3f14">*</span>
                        户籍地址：
                    </Col>
                    <Col span="9">
                        <Input v-model="item.nativePlace" placeholder="请输入户籍地址" style="width: 100%"></Input>
                    </Col>
                    <Col span="8" style="text-align: right; padding-right: 5px;line-height:32px;">
                        是否将户籍地址更新到数据库：
                    </Col>
                    <Col span="4" style="line-height:32px;padding-left: 5px">
                        <RadioGroup  v-model="item.adressupdat">
                            <Radio @click.native="changeUp3(item.litigantId)" label="1">
                                <span>是</span>
                            </Radio>
                            <Radio @click.native="changeUp4(item.litigantId)" label="0">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row v-show="item.sendType === 6 && item.litigationStatusName == '被告'" style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                    <span style="color: #ed3f14">*</span>
                        承办部门：    
                    </Col>
                    <Col span="9">
                        <Input v-model="item.courtName" placeholder="请输入法院全称" style="width: 100%"></Input>
                    </Col>
                    <!-- <Col span="4" style="text-align: right; padding-right: 5px;line-height:32px;">
                    <span style="color: #ed3f14">*</span>
                        法院联系电话：    
                    </Col>
                    <Col span="8">
                        <Input v-model="item.courtPhone" style="width: 100%"></Input>
                    </Col> -->
                </Row>
                <Row v-show="item.sendType === 6 && item.litigationStatusName == '被告'" style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                    <span style="color: #ed3f14">*</span>
                        法院地址：
                    </Col>
                    <Col span="9">
                        <Input v-model="item.courtAdress" style="width: 100%"></Input>
                    </Col>
                    <Col span="8" style="text-align: right; padding-right: 5px;line-height:32px;">
                        是否将法院名称和地址更新到数据库：
                    </Col>
                    <Col span="4" style="text-align: left; padding-left: 5px;line-height:32px;">
                        <RadioGroup  v-model="item.updat">
                            <Radio @click.native="changeUp1(item.litigantId)" label="1">
                                <span>是</span>
                            </Radio>
                            <Radio @click.native="changeUp2(item.litigantId)" label="0">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row v-if="item.sendType === 6 && item.litigationStatusName == '被告'" style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                    <span style="color: #ed3f14">*</span>
                        快递单号：
                    </Col>
                    <Col span="9">
                        <Input v-model="item.oddNumbers" style="width: 100%"></Input>
                    </Col>
                    <!-- <Col span="3">
                        <Button type="info" @click="printBill(item)" long style="margin-left: 15px;">快递单打印</Button>
                    </Col> -->
                </Row>
                <!-- <Row v-if="item.sendType === 1" style="margin-top:10px">
                    <Col span="3">
                    </Col>
                    <Col span="3">
                        <Button type="info" @click="addAdreModel(item)" long style="margin-left: 15px;">添加地址</Button>
                    </Col>
                </Row> -->

                <Row v-show="item.sendType === 5" style="margin-top:10px">
                   <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;" >
                        <span style="color: #ed3f14">*</span>
                        微信号：
                    </Col>
                    <Col span="10">
                        <Select style="width:100%" v-model="item.wechatNumber" @on-change="wxNumberChange(item)">
                            <Option v-for="(it,dx) in item.wechatList" :value="it.admin" :key="dx">{{ it.name }}</Option>
                        </Select>
                        <!-- <Input v-model="item.wechatNumber" style="width: 100%"></Input> -->
                    </Col>
                    <Col span="11" style='padding-left:15px;line-height:32px'>
                        <span>{{item.weMessage}}</span>
                        <!-- <Input v-model="item.wechatNumber" style="width: 100%"></Input> -->
                    </Col>
                </Row>
                <Row v-show="item.sendType === 5" style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                    <span style="color: #ed3f14">*</span>
                        微信模板：
                    </Col>
                    <Col span="10">
                        <Select style="width:100%" v-model="item.weixinModelId" @on-change="wxTpChange(item)">
                            <Option v-for="it in emailModelList" :value="it.id" :key="it.id">{{ it.content }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row v-show="item.sendType === 5"  style="margin-top:10px">
                    <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                        模板内容：
                    </Col>
                    <Col span="12">
                        <div style="padding: 5px 6px;">
                            {{ item.wxContent }}
                        </div>
                    </Col>
                </Row>
            </div>
            <div style="margin-top: 10px; text-align: right;">
                <Button type="info" v-if="item.sendType === 1" @click="addAdreModel(item)"  style="margin-left: 15px;">添加地址</Button>
                <Button type="info" v-if="item.sendType === 1 || item.sendType === 6" @click="printBill(item)"  style="margin-right: 15px;">快递单打印</Button>
                <Button @click="dipshow(item)" :loading="item.creatLoading" type="info">生成并预览</Button>
                <Button v-show="item.print != 0 && item.sendType === 0" @click="sureSend(item)"  type="success">
                    确认领取
                </Button>
                <Button v-show="item.print != 0" @click="printSend(item)" type="success" style="margin-right: 16px">打印</Button>
                <Button @click="sendME(item)" style="width: 100px" :disabled="item.buttonP == false" :loading="item.sendMELoading" type="success">发送</Button>
                <!-- <Button type="success">打印</Button> -->
                <!-- <Button>取消</Button> -->
            </div>
        </Card>
        <Card style="margin-top:20px">
            <Row style="margin-top:10px">
                <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                <span style="color: #ed3f14">*</span>
                    受送达人：
                </Col>
                <Col span="9">
                    <Input v-model="name" style="width: 100%"></Input>
                </Col>
                <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;">
                <span style="color: #ed3f14">*</span>
                    邮箱：
                </Col>
                <Col span="9">
                    <Input v-model="email" style="width: 100%"></Input>
                </Col>
                <Col span="3" style="text-align: right; padding-right: 5px;line-height:32px;margin-top:10px">
                <span style="color: #ed3f14">*</span>
                    上传附件：
                </Col>
                <Col span="9" style="margin-top:10px">
                    <a href="javascript:;" class="a-upload">
                        <input type="file"  name="" @change="getFile($event)" id="upfil">点击这里上传文件
                    </a>
                    <div style="padding: 4px 10px;display:block;position: relative;top:-10px">
                        <p v-for="item in otherfileNlist" style="margin-top:15px">{{item.name}}</p>
                    </div>
                </Col>
            </Row>
            <div style="margin-top: 10px; text-align: right;">
                <Button @click="history()" style="width: 100px"  type="primary">历史记录</Button>
                <Button @click="otherSend()" style="width: 100px"  :loading="otherLoading" type="success">发送</Button>
                <!-- <Button type="success">打印</Button> -->
                <!-- <Button>取消</Button> -->
            </div>
        </Card>
        <Modal
            v-model="modal1"
            title="文书预览"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <!-- <Tabs v-model="index" type="card"> -->

                    <div class="components-container">

                        <div class="editor-container">
                            <receipt :backFill="backFill" ref="cita"  @model="modelIshid" v-if="panelList=='送达回证' && userCourtName == '殿前法庭'"></receipt>
                            <receiptHl :backFill="backFill" ref="cita"  @model="modelIshid" v-if="panelList=='送达回证' && userCourtName != '殿前法庭'"></receiptHl>
                            <citation :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='传票' && userCourtName == '殿前法庭'"></citation>
                            <citationHl :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='传票' && userCourtName != '殿前法庭'"></citationHl>
                            <joinLitigationAdviceNote :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='参加诉讼通知书'"></joinLitigationAdviceNote>
                            <sendAddressConfirm :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='送达地址确认书'&&courtId!=15"></sendAddressConfirm>
                            <sendAddressConfirmHuLi :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='送达地址确认书'&&courtId==15"></sendAddressConfirmHuLi>
                            <citationStub :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='传票(存根)'"></citationStub>
                            <phoneNotification :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='电话通知记录表'"></phoneNotification>
                            <ComponentMembers :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='合议庭组成人员通知书'"></ComponentMembers>
                            <proofNotice :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='举证通知书' && userCourtName == '殿前法庭'"></proofNotice>
                            <proofNoticeHl :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='举证通知书' && userCourtName != '殿前法庭'"></proofNoticeHl>
                            <superviseCard :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='廉政监督卡'"></superviseCard>
                            <caseAccept :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='受理案件通知书'"></caseAccept>
                            <apperanceNotice :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='应诉通知书' && userCourtName == '殿前法庭'"></apperanceNotice>
                            <apperanceNoticeHl :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='应诉通知书' && userCourtName != '殿前法庭'"></apperanceNoticeHl>
                            <envelope :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='封皮' && userCourtName == '殿前法庭'"></envelope>
                            <envelopeHl :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='封皮' && userCourtName != '殿前法庭'"></envelopeHl>
                            <entrustSend :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='委托送达函'"></entrustSend>
                            <bulletin :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='公告'"></bulletin>
                            <verdict :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='口头裁定笔录'"></verdict>
                            <citationOut :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='外出传票'"></citationOut>
                            <citationStubOut :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='外出传票(存根)'"></citationStubOut>
                            <bulletinJudgment :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='公告判决书'"></bulletinJudgment>
                            <draft :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='公告稿'"></draft>
                            <draftss :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='公告稿(保全)'"></draftss>
                            <!-- <UE v-if="modal1" :defaultMsg="dip.content || ''" :config="config" :ref="dip.name"></UE> -->
                        </div>
                        <div :style="{marginTop: '10px', textAlign: 'right', width: ueWidth}">

                            <Button  @click="produceDip(panelList,dipName)">生成</Button>
                        </div>


                    </div>


            <!-- </Tabs> -->
            <div slot="footer"></div>
        </Modal>
        <!-- 封皮生成被告地址超过6个时，弹出提示框 -->
        <Modal v-model="modal2"
            title="封皮被告地址补充"
            :mask-closable="false"
            width="546px">
                 <p>{{warn}}:</p>
                 <div v-for="(dip, key) in warn1">
                     <p  style="text-indent:2em ">{{key+1}}、{{dip}}</p>
                 </div>
        </Modal>
        <Modal 
            title="请填写请求判令"
            width="546px" v-model="RequestContentShow" @on-ok='RequestContentCommit' ok-text="保存"
            cancel-text="取消">
                 <textarea v-model="updateRequestContent" style="margin: 0px;width: 100%;height: 100px;border: none;resize:none" placeholder="请填写请求判令"></textarea>
        </Modal>
        <Modal
            v-model="addModel"
            title="添加地址"
            :loading="loading"
            width="600"
            ok-text="保存"
            cancel-text="取消"
            @on-ok="addAdr"
            >
            <Form :label-width="100" inline>
                <div class="addOtherAdress">
                <div v-for="item in adressList">
                    <FormItem label="其他地址" style="width: 455px">
                        <Input v-model="item.name" style="width:95%;" placeholder="请输入其他地址"></Input><Icon @click.native="delAdress(item)" type="trash-a"></Icon>
                    </FormItem>
                    <FormItem label="备注" style="width: 455px">
                        <Input v-model="item.beizhu"  style="width:95%;" placeholder="请地址备注"></Input>
                    </FormItem>
                </div>
            </div>
            <FormItem>
                <div class="adds" @click="addAdress" style="text-align:center;width: 350px;">
                    <Icon type="plus-round"></Icon>
                    <p>添加地址</p>
                </div> 
            </FormItem>
            </Form>
        </Modal>
        <Modal
            v-model="selModel"
            title="选择打印机型号"
            :loading="loading"
            width="400"
            ok-text="打印"
            cancel-text="取消"
            @on-ok="prillT"
            style="top: 200px;"
            >
            <RadioGroup v-model="printMechine">
                <Radio label="1">
                    <span>DE-620K打印机</span>
                </Radio>
                <Radio label="2">
                    <span>LQ-82KF打印机</span>
                </Radio>
            </RadioGroup>
        </Modal>
        <Modal
            v-model="infoMol"
            cancel-text=""
            ok-text="确定"
            @on-ok=""
            width="700px"
            :mask-closable="closeM"
            title="案件信息">
            <div v-if="infoMol">
                    <Row  style="margin-bottom:5px">
                        <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:15px">
                            起诉状：
                        </Col>
                        <Col span="18" style=" padding-right: 5px;margin-bottom:15px">
                            <span v-if="qFileName.name == ''">无</span>
                            <a v-else :href="qFileName.path" download="">{{ qFileName.name }}</a>
                        </Col>
                        <Col span="6" style=" padding-right: 5px;text-align: right;">
                            身份证明材料：
                        </Col>
                        <Col span="6" style=" padding-right: 5px">
                            <span v-if="fileName1.name == ''">无</span>
                            <a v-else :href="fileName1.path" download="">{{ fileName1.name }}</a>
                        </Col>
                        <Col span="5" style=" padding-right: 5px;text-align: right;">
                            授权委托材料：
                        </Col>
                        <Col span="7" style=" padding-right: 5px">
                            <span v-if="fileName2.name == ''">无</span>
                            <a v-else :href="fileName2.path" download="">{{ fileName2.name }}</a>
                        </Col>
                    </Row>
                <Row  style="margin-bottom:5px;margin-bottom:10px">
                    <p class="sdws">
                        申请书：
                    </p>
                    <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                        财产保全申请书：
                    </Col>
                    <Col span="6" style=" padding-right: 5px;margin-bottom:10px">
                        <span v-if="fileNameShen1 == ''">无</span>
                        <a v-else :href="onlineEAIdShen1" download="">{{ fileNameShen1 }}</a>
                    </Col>
                    <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                        调查取证申请书：
                    </Col>
                    <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                        <span v-if="fileNameShen2 == ''">无</span>
                        <a v-else :href="onlineEAIdShen2" download="">{{ fileNameShen2 }}</a>
                    </Col>
                    <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                        证据保全申请书：
                    </Col>
                    <Col span="6" style=" padding-right: 5px;margin-bottom:10px">
                        <span v-if="fileNameShen3 == ''">无</span>
                        <a v-else :href="onlineEAIdShen3" download="">{{ fileNameShen3 }}</a>
                    </Col>
                    <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                        证人出庭申请书：
                    </Col>
                    <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                        <span v-if="fileNameShen4 == ''">无</span>
                        <a v-else :href="onlineEAIdShen2" download="">{{ fileNameShen4 }}</a>
                    </Col>
                    <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                        现场勘验申请书：
                    </Col>
                    <Col span="6" style=" padding-right: 5px;margin-bottom:10px">
                        <span v-if="fileNameShen5 == ''">无</span>
                        <a v-else :href="onlineEAIdShen5" download="">{{ fileNameShen5 }}</a>
                    </Col>
                    <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                        鉴定评估申请书：
                    </Col>
                    <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                        <span v-if="fileNameShen6 == ''">无</span>
                        <a v-else :href="onlineEAIdShen6" download="">{{ fileNameShen6 }}</a>
                    </Col>
                </Row>
                <div>
                    <p class="sdws">
                        证据材料：
                    </p>
                    <Table :columns="columnsEvi" :data="EviList"></Table>
                </div>
            </div>
            <div slot="footer">
                <Button @click="closeInfo"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
        <Modal
        v-model="showHistoryModel"
        title="历史记录"
        width="720"
        ok-text="关闭"
        cancel-text="">
          <div v-for="(item, key) in historyInfo" :key="key" class="send-info">
              <Row>
                  <Col span="4" style="text-align: right; padding-right: 5px">
                      受送达人：
                  </Col>
                  <Col span="8">
                      {{ item.name }}
                  </Col>
                  <Col span="4" style="text-align: right; padding-right: 5px">
                      邮箱：
                  </Col>
                  <Col span="8">
                      {{ item.email }}
                  </Col>
              </Row>
              <Row>
                  <Col span="4" style="text-align: right; padding-right: 5px">
                      文书列表：
                  </Col>
                  <Col span="20" v-if="item.delivererFiles[0] != null">

                      <a v-for="item in item.delivererFiles" :href="item.url" download="">{{ item.name }}、</a>                        
                  </Col>
                  <Col span="20" v-else>
                      <span>无</span>
                  </Col>
              </Row>
        </div>
    </Modal>
    <!-- 卷宗选择 -->
    <Modal
        v-model="viewDipmos"
        title="查看"
        :mask-closable="false"
        :styles="{top: '20px'}"
        :width="modalWidth2">
        <div class="components-container">
            <archive :dipName="dipNameSel" @onChangeDips="onChangeDips" ref="arc"></archive>
        </div>
        <div slot="footer">
            <Button @click="viewDipmos = false"   type="dashed" size="large">关闭</Button>
            <Button @click="selAR"   type="primary" size="large">选中卷宗</Button>
        </div>
    </Modal>
    </div>
</template>
<script>
import UE from '../../components/ueditor/ueditor.vue';
import { list, toPdf,diplomsEditorPreview,queryDiplomsIsAdd, printer,uploadDelivererFiles,sendDeliverer,sendDelivererHistory } from '../../api/diplomas.js';
import { getUserInfo } from '../../api/user.js';
import {
  getInfo,
  getSendInfo,
  sendME,
  confirm,
  printBill,
  postDeliveryBill,
  litigantEvidenceList,
  getEntrustSend,
  addAdress,
  otherGetFiles,
  wechatMessageTemplate,
  getWeiXinInfo,
  sendEditLitigant
} from "../../api/send.js";
const R = require("ramda");
import { getBrief, queryCase, queryCaseInfo } from '../../api/global.js';
import { formatDate } from '../../libs/date.js';
import { senList, emailList, addressList,receiveWithdrawal } from "../../api/templante.js";
import html2canvas from 'html2canvas';
import citation from '../../components/diplomas/citation.vue';
import citationHl from '../../components/diplomas/citationHl.vue';
import receipt from '../../components/diplomas/receipt.vue';
import receiptHl from '../../components/diplomas/receiptHl.vue';
import sendAddressConfirm from '../../components/diplomas/sendAddressConfirm.vue';
import sendAddressConfirmHuLi from '../../components/diplomas/sendAddressConfirmHuLi.vue';
import joinLitigationAdviceNote from '../../components/diplomas/joinLitigationAdviceNote.vue';
import citationStub from '../../components/diplomas/citationStub.vue';
import phoneNotification from '../../components/diplomas/phoneNotification.vue';
import ComponentMembers from '../../components/diplomas/ComponentMembers.vue';
import proofNotice from '../../components/diplomas/proofNotice.vue';
import proofNoticeHl from '../../components/diplomas/proofNoticeHl.vue';
import superviseCard from '../../components/diplomas/superviseCard.vue';
import caseAccept from '../../components/diplomas/caseAccept.vue';
import apperanceNotice from '../../components/diplomas/apperanceNotice.vue';
import apperanceNoticeHl from '../../components/diplomas/apperanceNoticeHl.vue';
import envelope from '../../components/diplomas/envelope.vue';
import envelopeHl from '../../components/diplomas/envelopeHl.vue';
import entrustSend from '../../components/diplomas/entrustSend.vue';
import bulletin from '../../components/diplomas/bulletin.vue';
import verdict from '../../components/diplomas/verdict.vue';
import citationOut from '../../components/diplomas/citationOut.vue';
import citationStubOut from '../../components/diplomas/citationStubOut.vue';
import bulletinJudgment from '../../components/diplomas/bulletinJudgment.vue';
import draft from '../../components/diplomas/draft.vue';
import draftss from '../../components/diplomas/draftss.vue';
import Vue from 'vue';
import archive from "@/components/archive/archive.vue";

export default {
    components: { archive,UE,citation,citationHl,receipt,receiptHl,sendAddressConfirm,joinLitigationAdviceNote,citationStub,citationOut,citationStubOut,phoneNotification,
    ComponentMembers,draft,draftss,proofNotice,proofNoticeHl,superviseCard,caseAccept,apperanceNotice,apperanceNoticeHl,envelope,envelopeHl,entrustSend,bulletin,verdict,sendAddressConfirmHuLi,bulletinJudgment},
    data () {
        var width = window.innerWidth - 200;
        var width2 = window.innerWidth - 100;
        var ueWidth = width - 40 + 'px';
        return {
            infoMol:false,
            viewDipmos:false,
            closeM:false,
            qFileName:{
                name:'',
                path:''
            },
            fileName1:{
                name:'',
                path:''
            },
            fileName2:{
                name:'',
                path:''
            },
            fileNameShen1:"",
            judgeName:"",
            clerkName:"",
            onlineEAIdShen1:"",
            name:"",
            email:"",
            showHistoryModel:false,
            historyInfo:[],
            nist:[],
            otherfileNlist:[],
            userCourtName:this.$store.state.app.courtName,
            otherLoading:false,
            fileNameShen2:"",
            onlineEAIdShen2:"",
            fileNameShen3:"",
            onlineEAIdShen3:"",
            fileNameShen4:"",
            onlineEAIdShen4:"",
            fileNameShen5:"",
            onlineEAIdShen5:"",
            fileNameShen6:"",
            onlineEAIdShen6:"",
            EviList:[],
            emailModelList:[],
            columnsEvi:[
                {
                title: "证据名称",
                key: "name",
                width: 150,
                align: "center",
                },
                {
                title: "证明对象",
                key: "proves",
                width: 170,
                align: "center",
                },
                {
                title: "证明来源",
                key: "where",
                align: "center",
                },
                {
                title: "附件",
                key: "fileName",
                width: 100,
                align: "center",
                render: (h, params) => {
                    return h("div", [
                        h(
                            "b",
                            {
                            props: {
                                type: "img",
                                size: "small"
                            },
                            on: {
                                click: () => {
                                    var fileStr = params.row.filePa;
                                    if(fileStr == null){
                                        this.$Message.info("暂无附件");
                                        return false;
                                    }
                                    // 创建隐藏的可下载链接
                                    var eleLink = document.createElement("a");
                                    var strs = fileStr.split("/");
                                    for (var i = 0; i < strs.length; i++) {
                                        if (i == strs.length - 1) {
                                        var filename = strs[i];
                                        }
                                    }
                                    eleLink.download = filename;
                                    eleLink.style.display = "none";
                                    // 字符内容转变成blob地址
                                    eleLink.href = fileStr;
                                    // 触发点击
                                    document.body.appendChild(eleLink);
                                    eleLink.click();
                                    // 然后移除
                                    document.body.removeChild(eleLink);
                                }
                            }
                            },
                            ""
                        ),
                    ]);
                }
                },
            ],

            caseP: 1,
            sendTypes: [
                "现场领取",
                "EMS送达",
                "工作人员上门送达",
                "电子邮件送达",
                "H5确认阅读",
                '微信送达',
                "委托送达",
                "平台送达",
                "公告送达",
            ],
            sendTypesLit: [
                "现场领取",
                "EMS送达",
                "工作人员上门送达",
                "电子邮件送达",
                "H5确认阅读",
                '微信送达'
            ],
            modal1: false,
            printMechine:"1",
            selModel:false,
            modal2: false,
            modalWidth: width,
            modalWidth2: width2,
            isdq:this.$store.getters.isdq,
            ueWidth: ueWidth,
            queryLoading: false,
            caseLoading: false,
            infoLoading: false,
            sendMELoading:false,
            adressList:[],
            MELoading:false,
            searchForm: '',
            // filter1: '',
            // dateRange: '',
            briefName: '',
            briefList: [],
            disabledGroup:[],
            disabled:true,
            caseNo: this.$store.getters.caseNo,
            plaintiffName: '',
            defendantName: '',
            dipNameSel:"",
            value1: '1',
            elData:'',
            arcCaseObj:{},  //案件卷宗选择的时候承接的案件
            caseList: [],
            caseInfo: '',
            addModel:false,
            info: [],
            loading:true,
            diplist: [],
            index: '',
            config: {},
            lawCaseId:"",
            backFill:[],
            panelList:'',
            dipName:'',
            color:'#ADADAD',
            produceIsSuccess:'',
            editss:'',
            created:'created',
            litigantId:'',
            cased:'',
            check:[],
            warn:'',
            adId:0,
            warn1:'',
            file: null,
            loadingStatus: false,
            uploadUrl:"",
            downUrl:"",

            updateRequestContent:'',
            RequestContentShow:false,
            RequestContentItem:{},

            courtId:''
        };
    },
    mounted () {
        this.getBrief();
        if (this.$route.params) {
            var caseId = this.$route.params.lawCaseId;
            this.uploadUrl="/api/dp/createPayOrder.jhtml?lawCaseId="+caseId
            if (caseId) {
                this.lawCaseId = caseId;
                this.getInfo(caseId);
            }
        }
        console.log(this.lawCaseId)
        if (this.caseNo != '') {
            this.queryCase()
        
            
        }
        
    },
    methods: {
        closeInfo(){
          this.infoMol = false;
      },
      onChangeDips(ary,st) {
        console.log(ary);
        console.log(this.info);
        for(let i=0;i<this.info.length;i++){
            let d = this.info[i];
            if(d.litigantId == this.arcCaseObj.litigantId){
                if(st == '申请书'){
                    ary.map(item => {
                        d.shenfileNlist.push(item)
                    })
                }else if(st == '支付令'){
                    ary.map(item => {
                        d.zhifileNlist.push(item)
                    })
                }else if(st == '支付令证据材料'){
                    ary.map(item => {
                        d.zhizhenfileNlist.push(item)
                    })
                }else if(st == '公告判决书'){
                    ary.map(item => {
                        d.payfileNlist.push(item)
                    })
                }else if(st == '调解书'){
                    ary.map(item => {
                        d.zhenfileNlist.push(item)
                    })
                }else if(st == '裁定书'){
                    ary.map(item => {
                        d.caifileNlist.push(item)
                    })
                }else if(st == '决定书'){
                    ary.map(item => {
                        d.juefileNlist.push(item)
                    })
                }else if(st == '民事判决书'){
                    ary.map(item => {
                        d.minShifileNlist.push(item)
                    })
                }else if(st == '其他法律文书'){
                    ary.map(item => {
                        d.qifileNlist.push(item)
                    })
                }else if(st == '撤诉裁定书'){
                    ary.map(item => {
                        d.cqfileNlist.push(item)
                    })
                }
                this.viewDipmos = false;
                break;
            }
        }
        
        console.log(st);
      },
      selAR(){
          this.$refs.arc.NowSel();
      },
      selectArc(dt,str){
          console.log(dt)
          this.dipNameSel = str;
          this.arcCaseObj = dt;
          this.$refs.arc.getCaseList(dt.caseNo);
          this.viewDipmos = true;
      },
      showFinace(){
          this.infoMol = true
          if(this.fileInfo == false){
                this.fileInfo = true;
            }
            this.caInfo = false;
            otherGetFiles(this.$route.params.lawCaseId).then(res => {
            if(res.data.state == 100){
                this.EviList = [];
                this.qFileName = {
                    path:"",
                    name:"",
                };
                this.fileName1 = {
                    path:'',
                    name:''
                };
                this.fileName2 = {
                    path:'',
                    name:''
                };
                this.fileNameShen1="";
                this.onlineEAIdShen1="";
                this.fileNameShen2="";
                this.onlineEAIdShen2="";
                this.fileNameShen3="";
                this.onlineEAIdShen3="";
                this.fileNameShen4="";
                this.onlineEAIdShen4="";
                this.fileNameShen5="";
                this.onlineEAIdShen5="";
                this.fileNameShen6="";
                this.onlineEAIdShen6="";
                res.data.file.map(item => {
                    if(item.type == 1){
                        this.fileName1 = {
                            path:item.path,
                            name:item.name
                        };
                        // this.qisuShow1 = false;
                    }else if(item.type == 2){
                        this.fileName2 = {
                            path:item.path,
                            name:item.name
                        };
                        // this.qisuShow2 = false;
                    }else if(item.type == 3){
                        const data = {
                            name:item.eviName,
                            proves:item.eviProve,
                            where:item.eviSource,
                            filePa:item.path,
                            id:item.id
                        }
                        this.EviList.push(data);
                    }else if(item.type == 4){
                        if(item.applyType == 1){
                            this.fileNameShen1 = item.name;
                            this.qisuShowShen1 = false;
                            this.onlineEAIdShen1 = item.path;
                        }else if(item.applyType == 2){
                            this.fileNameShen2 = item.name;
                            this.qisuShowShen2 = false;
                            this.onlineEAIdShen2 = item.path;
                        }else if(item.applyType == 3){
                            this.fileNameShen3 = item.name;
                            this.qisuShowShen3 = false;
                            this.onlineEAIdShen3 = item.path;
                        }else if(item.applyType == 4){
                            this.fileNameShen4 = item.name;
                            this.qisuShowShen4= false;
                            this.onlineEAIdShen4 = item.path;
                        }else if(item.applyType == 5){
                            this.fileNameShen5 = item.name;
                            this.qisuShowShen5 = false;
                            this.onlineEAIdShen5 = item.path;
                        }else if(item.applyType == 6){
                            this.fileNameShen6 = item.name;
                            this.qisuShowShen6 = false;
                            this.onlineEAIdShen6 = item.path;
                        }
                    }else if(item.type == 5){
                        this.qFileName = {
                            path:item.path,
                            name:item.name
                        };
                        // this.qisuShow1 = false;
                    }
                })
            }
        })
            
      },
        getBrief () {
            var that = this;
            getBrief().then(res => {
                var data = res.data;
                if (data.state - 0 === 100) {
                    that.briefList = data.result;
                }
            }).catch(() => {
                that.$Message.error('网络错误，获取案由列表失败。');
            });
        },
        uploadSuccess (res, file) { // 文件上传回调 上传成功后删除待上传文件
            if(res.state==100){
                this.$Message.loading({
                    content: "文书识别码生成中，请稍候",
                    duration: 1, 
                    onClose: () => {
                        var fileStr = res.file;
                        if(fileStr == null){
                            this.$Message.info("暂无附件");
                            return false;
                        }
                        var eleLink = document.createElement("a");
                        var strs = fileStr.split("/");
                        for (var i = 0; i < strs.length; i++) {
                            if (i == strs.length - 1) {
                            var filename = strs[i];
                            }
                        }
                        eleLink.download = filename;
                        eleLink.style.display = "none";
                        eleLink.href = fileStr;
                        document.body.appendChild(eleLink);
                        eleLink.click();
                        document.body.removeChild(eleLink);
                    }
                });
              
            }else{
              this.$Message.error(res.message);
            }
        },

        uploadSuccessShen(res, file){
            // alert(1)
            if(res.state == 100){
                this.$Message.success(res.message);
                console.log(res)
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].ShenfileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].ShenfileNlist.push(dat);
                        break;
                    }
                }
               
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delShenFile(data,str){
            for(let i=0;i<data.ShenfileNlist.length;i++){
                if(data.ShenfileNlist[i].name == str){
                    data.ShenfileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        uploadZhengJ(res, file){
            // alert(1)
            if(res.state == 100){
                this.$Message.success(res.message);
                console.log(res)
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].ShenfileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].ZhengJfileNlist.push(dat);
                        break;
                    }
                }
               
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delZhengJFile(data,str){
            for(let i=0;i<data.ZhengJfileNlist.length;i++){
                if(data.ZhengJfileNlist[i].name == str){
                    data.ZhengJfileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        
        
        
        
        
        uploadSuccessShen(res, file){
            // alert(1)
            console.log(res)
            console.log(this.info)
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].shenfileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].shenfileNlist.push(dat);
                        break;
                    }
                }
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
            
                             
                             
        },
        delShenFile(data,str){
            for(let i=0;i<data.shenfileNlist.length;i++){
                if(data.shenfileNlist[i].name == str){
                    data.shenfileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        uploadSuccessZhi(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].zhifileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].zhifileNlist.push(dat);
                        break;
                    }
                }
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delZhiFile(data,str){
            for(let i=0;i<data.zhifileNlist.length;i++){
                if(data.zhifileNlist[i].name == str){
                    data.zhifileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        uploadSuccessZhizhen(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].zhizhenfileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].zhizhenfileNlist.push(dat);
                        break;
                    }
                }
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delZhizhenFile(data,str){
            for(let i=0;i<data.zhizhenfileNlist.length;i++){
                if(data.zhizhenfileNlist[i].name == str){
                    data.zhizhenfileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },

        uploadSuccessPay(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].payfileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].payfileNlist.push(dat);
                        break;
                    }
                }
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delPayFile(data,str){
            for(let i=0;i<data.payfileNlist.length;i++){
                if(data.payfileNlist[i].name == str){
                    data.payfileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        uploadSuccessZhen(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].zhenfileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].zhenfileNlist.push(dat);
                        break;
                    }
                }
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delZhenFile(data,str){
            for(let i=0;i<data.zhenfileNlist.length;i++){
                if(data.zhenfileNlist[i].name == str){
                    data.zhenfileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        uploadSuccessCai(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].caifileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].caifileNlist.push(dat);
                        break;
                    }
                }
               
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delCaiFile(data,str){
            for(let i=0;i<data.caifileNlist.length;i++){
                if(data.caifileNlist[i].name == str){
                    data.caifileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        uploadSuccessJue(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].juefileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].juefileNlist.push(dat);
                        break;
                    }
                }
               
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        uploadMinShi(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].juefileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].minShifileNlist.push(dat);
                        break;
                    }
                }
               
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delMinShiFile(data,str){
            for(let i=0;i<data.minShifileNlist.length;i++){
                if(data.minShifileNlist[i].name == str){
                    data.minShifileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        delJueFile(data,str){
            for(let i=0;i<data.juefileNlist.length;i++){
                if(data.juefileNlist[i].name == str){
                    data.juefileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        uploadSuccessQi(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        // this.info[i].qifileNlist = [];
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].qifileNlist.push(dat);
                        break;
                    }
                }
               
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delQiFile(data,str){
            for(let i=0;i<data.qifileNlist.length;i++){
                if(data.qifileNlist[i].name == str){
                    data.qifileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        uploadSuccessCq(res, file){
            if(res.state == 100){
                this.$Message.success(res.message);
                for(let i=0;i<this.info.length;i++){
                    if(this.info[i].litigantId == res.id){
                        const dat = {
                            name:file.name,
                            urlName:res.result
                        }
                        this.info[i].cqfileNlist.push(dat);
                        break;
                    }
                }
               
                this.info = JSON.parse(JSON.stringify(this.info));
            }else{
                this.$Message.error(res.message);
            }
        },
        delCqFile(data,str){
            for(let i=0;i<data.cqfileNlist.length;i++){
                if(data.cqfileNlist[i].name == str){
                    data.cqfileNlist.splice(i,1);
                    break;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        //生成撤诉裁定书
        createCai(){
            receiveWithdrawal(this.info[0].caseNo).then(res => {
                if(res.data.state == 100){
                    this.$Message.success('生成成功');
                    window.open(res.data.data.nolle_url)
                }
            })
        },
        queryCase () {
            var that = this;
            that.queryLoading = true;
            this.$store.commit('SET_CASENO', this.caseNo);
            queryCase(that.caseNo, that.plaintiffName, that.defendantName).then(res => {
                var data = res.data;
                if (data.state - 0 === 100) {
                    that.caseList = data.result;
                } else {
                    that.$Message.info(data.message);
                }
                that.queryLoading = false;
            }).catch(() => {
                that.$Message.error('网络错误，查询失败。');
                that.queryLoading = false;
            });
        },
        printSend(item){
            if (item.dipChecked.length) {
                if(item.sendTy == "现场领取"){
                var str = 0;
                }else if(item.sendTy == "工作人员上门送达"){
                var str = 2;
                }else{
                var str = 3;
                }
                printer(item.litigantId, item.dipChecked.join(","), str, item.sendId)
                .then(res => {
                    var data = res.data;
                    if (data.state - 0 === 100) {
                    this.$Message.loading({
                        content: "文书生成中，请稍候",
                        duration: item.dipChecked.length * 0.6, // 按照文书数量给后台一点生成pdf文件的时间
                        onClose: () => {
                        window.open("/" + data.result);
                        }
                    });
                    } else {
                    this.$Message.error(res.data.message);
                    }
                })
                .catch(() => {
                    this.$Message.error("网络错误，获取" + name + "失败。");
                });
            } else {
                this.$Message.error("未选择文书");
            }
        },
        noRepeat2(arr){
            var newArr = [];
            for(var i = 0; i < arr.length; i++){
                if(newArr.indexOf(arr[i]) == -1){
                            newArr.push(arr[i]);
                    }
            }
            return newArr;
        },
        prillT(){
            let el = this.elData;
            let arys = JSON.parse(JSON.stringify(el.dipChecked));
            console.log( el)
            for(let i=0;i<arys.length;i++){
                if(arys[i] == '送达地址有关事项告知书'){
                    arys[i] = '送达地址告知书'
                }
                if(arys[i] == '审判流程信息公开告知内容'){
                    arys[i] = '审判流程告知书'
                }
            }
            if(el.disabledGroup.length > 0){
                for(let i=0;i<el.disabledGroup.length;i++){
                    arys.push(el.disabledGroup[i])
                }
            }
            let newarr = this.noRepeat2(arys);
            if(el.checkBo){
                newarr.push(el.other)
            }
            this.loading = true;
            if(el.checkBo ==true){
                el.dipChecked.push(el.other)
            }
            var str = "";
                
               
                for(var i=0;i<el.emsAdressList.length;i++){
                    if(i == el.emsAdressList.length -1){
                        str = str + el.emsAdressList[i].addressName;
                    }else{
                        str = str + el.emsAdressList[i].addressName + ',';
                    }
                    
                }
            var params = {
                oddNumbers: el.oddNumbers,
                lawCaseId: el.id,
                legalManName:el.legalManName ? el.legalManName : '',
                legalManPhone:el.legalManPhone ? el.legalManPhone : '',
                litigantName:el.sendType == 6 ? el.courtName : el.litigantName,
                sendAddress: el.sendType == 6 ? el.courtAdress : str,
                litigantPhone: el.sendType == 6 ? el.courtPhone : el.litigantPhone,
                litigantType: el.litigantType,
                diploms: newarr,
                printType:this.printMechine,
                istrust:el.sendType == 6 ? 1 : 0,
            };
            printBill(params)
            .then(res => {
                var data = res.data;
                this.changeLoading();
                if (data.state - 0 === 100) {
                    for(let t=0;t<this.info.length;t++){
                        if(this.info[t].id == el.id){
                            console.log(this.info[t])
                            console.log(555)
                            for(var i=0;i<this.info[t].dipChecked.length;i++){
                                if(this.info[t].dipChecked[i] == el.other){
                                    console.log("chengg")
                                    this.info[t].dipChecked.splice(i,1)
                                }
                            }
                        }
                    }
                    this.selModel = false;
                    window.open("/" + data.html);
                    
                } else {
                    for(let t=0;t<this.info.length;t++){
                        if(this.info[t].id == el.id){
                            console.log(this.info[t])
                            for(var i=0;i<this.info[t].dipChecked.length;i++){
                                if(this.info[t].dipChecked[i] == el.other){
                                    console.log("chengg")
                                    this.info[t].dipChecked.splice(i,1)
                                }
                            }
                        }
                    }
                    this.$Message.info(data.message);
                }
                this.queryLoading = false;
            })
            .catch(() => {
                this.$Message.error("网络错误，打印失败。");
                this.queryLoading = false;
            });
        },
        printBill(el){
            
            if(el.emsAdressList[0].addressName == '' && el.sendType != 6 && el.sendType != 5){
                this.$Message.info('收件地址不能为空!');
                return false;
            }else if(el.sendType == 6 && el.courtAdress == ''){
                this.$Message.info('法院收件地址不能为空!');
                return false;
            }
            this.selModel = true;
            this.elData = el;
            return false;
            if(el.checkBo ==true){
                el.dipChecked.push(el.other)
            }
            var str = "";
                
               
                for(var i=0;i<el.emsAdressList.length;i++){
                    if(i == el.emsAdressList.length -1){
                        str = str + el.emsAdressList[i].addressName;
                    }else{
                        str = str + el.emsAdressList[i].addressName + ',';
                    }
                    
                }
            var params = {
                oddNumbers: el.oddNumbers,
                lawCaseId: el.id,
                legalManName:el.legalManName ? el.legalManName : '',
                legalManPhone:el.legalManPhone ? el.legalManPhone : '',
                litigantName:el.sendType == 6 ? el.courtName : el.litigantName,
                sendAddress: el.sendType == 6 ? el.courtAdress : str,
                litigantPhone: el.sendType == 6 ? el.courtPhone : el.litigantPhone,
                litigantType: el.litigantType,
                diploms: el.dipChecked
            };
            printBill(params)
            .then(res => {
                var data = res.data;
                if (data.state - 0 === 100) {
                    for(var i=0;i<el.dipChecked.length;i++){
                        if(el.dipChecked[i] == el.other){
                            console.log("chengg")
                            el.dipChecked.splice(i,1)
                        }
                    }
                    window.open("/" + data.html);
                } else {
                    for(var i=0;i<el.dipChecked.length;i++){
                        if(el.dipChecked[i] == el.other){
                            el.dipChecked.splice(i,1)
                        }
                    }
                    this.$Message.info(data.message);
                }
                this.queryLoading = false;
            })
            .catch(() => {
                this.$Message.error("网络错误，查询失败。");
                this.queryLoading = false;
            });

        },
        showType(litigantId, sendType){
            console.log(sendType)
            console.log(this.sendTypes[sendType])

            for (var i = 0; i < this.info.length; i++) {
                const el = this.info[i];
                this.info[i].disabledGroup = ["证据材料","起诉状"];
                if (litigantId == this.info[i].litigantId) {
                    let ar = this.info[i].defoultChecked;
                    this.info[i].dipChecked = JSON.parse(JSON.stringify(ar));
                    this.info[i].print = 0;
                }
                if (this.info[i].sendTy == this.sendTypes[el.sendType]) {
                    this.info[i].print = 1;
                }
            }
            // for (var i = 0; i < this.info.length; i++){
            //     if (litigantId == this.info[i].litigantId && this.info[i].litigationStatusName == '被告'){
            //         var ary = [ '传票', '应诉通知书', '诉讼权利义务告知书', '送达地址确认书', '送达地址有关事项告知书', '举证通知书', '廉政监督卡', '传票(存根)', '送达回证','证据材料', '起诉状（反诉状）']
            //         this.info[i].dipChecked = ary;
            //         // var ary1 = ['证据材料', '起诉状（反诉状）'];
            //         // this.info[i].disabledGroup = ary1;
            //     }
            //     else{
            //         // this.info[i].dipChecked = [];
            //         this.info[i].disabledGroup = [];
            //     }
            // }
                    // this.info[i].dipChecked = [];
            //         this.info[i].disabledGroup = [];
            //     }
            // };
            // if(sendType == 3 || sendType == 3){

            // }
            if(sendType == 5){
                wechatMessageTemplate(this.lawCaseId,litigantId).then(res => {
                    if(res.data.state == 100){
                        this.emailModelList = res.data.result;
                    }else{
                        this.$Message.info("获取微信信息模板失败。");
                    }
                }) .catch(() => {
                        this.$Message.error("网络错误，微信信息模板失败。");
                });
                 getWeiXinInfo(litigantId).then(res => {
                     if(res.data.state == 100){
                         for (var i = 0; i < this.info.length; i++){
                                if(litigantId == this.info[i].litigantId){
                                    this.info[i].wechatList = res.data.data.map((item,index) => {
                                        if(item.admin == ''){
                                            item.admin = index
                                        }
                                        return item;
                                    });
                                    this.info[i].wechatNumber = "";
                                    this.info[i].weMessage = "";
                                    
                                    // this.info[i].weixinModelId = "";
                                    // this.info[i].wxContent = "";
                                    console.log(this.info[i].wechatList)
                                    Vue.set(this.info, i, this.info[i]);
                                }
                        }
                     }
                })
            }
            if(sendType == 2){
               for (var i = 0; i < this.info.length; i++) {
                    const el = this.info[i];
                    if (litigantId == this.info[i].litigantId) {
                        this.info[i].dipChecked.push("外出传票","外出传票(存根)");
                    }

                }
            }
            if(sendType == 3){
                emailList(this.lawCaseId, litigantId)
                    .then(res => {
                        var data = res.data;
                        if (data.state === 100) {
                            for (var i = 0; i < this.info.length; i++){
                                if(litigantId == this.info[i].litigantId){
                                    // this.info[i].emailId = "";
                                    this.info[i].emailListArr = data.result.content;
                                    Vue.set(this.info, i, this.info[i]);
                                }
                            }

                        } else {
                            this.$Message.info(data.message);
                        }
                        })
                        .catch(() => {
                        this.$Message.error("网络错误，获取邮件模板失败。");
                });
            }
            if(sendType == 6){
                getEntrustSend(litigantId).then(res => {
                if(res.data.state == 100){
                    for (var i = 0; i < this.info.length; i++){
                    if(litigantId == this.info[i].litigantId){
                        var ary = ['传票', '应诉通知书', '诉讼权利义务告知书', '送达地址确认书', '送达地址有关事项告知书', '举证通知书', '廉政监督卡', '传票(存根)', '送达回证', '委托送达函','证据材料', '起诉状','审判流程信息公开告知内容'];
                        this.info[i].dipChecked = ary;
                        this.info[i].courtName = res.data.courtName;
                        // this.info[i].courtPhone = res.data.telephone;
                        this.info[i].courtAdress = res.data.address;
                        this.info = JSON.parse(JSON.stringify(this.info));
                    }
                    }
                }else{
                    for (var i = 0; i < this.info.length; i++){
                    if(litigantId == this.info[i].litigantId){
                        var ary = ['传票', '应诉通知书', '诉讼权利义务告知书', '送达地址确认书', '送达地址有关事项告知书', '举证通知书', '廉政监督卡', '传票(存根)', '送达回证', '委托送达函','证据材料', '起诉状','审判流程信息公开告知内容'];
                        this.info[i].dipChecked = ary;
                        this.info = JSON.parse(JSON.stringify(this.info));
                    }
                    }
                }
                })
            }
            if(sendType == 7){
                for (var i = 0; i < this.info.length; i++){
                    if(litigantId == this.info[i].litigantId){
                        var ary = ["调解确认裁定书"];
                        this.info[i].dipChecked = ary;
                        this.info[i].disabledGroup = [];
                        this.info[i].buttonP = true;
                        this.info[i].buttonpf = true;
                        this.info = JSON.parse(JSON.stringify(this.info));
                    }
                }
            }
            if(sendType == 8){
                for (var i = 0; i < this.info.length; i++){
                    if(litigantId == this.info[i].litigantId){
                        var ary = ["公告稿"];
                        this.info[i].dipChecked = ary;
                        this.info[i].disabledGroup = [];
                        // this.info[i].buttonP = true;
                        // this.info[i].buttonpf = true;
                        this.info = JSON.parse(JSON.stringify(this.info));
                    }
                }
            }
        },
        //编辑当事人信息
        changeEdit(data){
            
            data.isEdit = true;
            for (var i = 0; i < this.info.length; i++) {
                if (data.litigantId == this.info[i].litigantId) {
                    
                    this.info[i].isEdit = true;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info))
        },
        saveEdit(data){
            sendEditLitigant(data.litigantId,data.identityCard,data.litigantPhone,data.litigantTelPhone).then(res => {
                if(res.data.state == 100){
                    this.$Message.success(res.data.message);
                    this.canselEdit(data);
                }
            })
        },
        canselEdit(data){
            console.log(666)
            data.isEdit = false;
            for (var i = 0; i < this.info.length; i++) {
                if (data.litigantId == this.info[i].litigantId) {
                    
                    this.info[i].isEdit = false;
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info))
        },
        showLeft (caseId) {
            this.cased = caseId;
            this.uploadUrl="/api/dp/createPayOrder.jhtml?lawCaseId="+caseId
            this.getInfo(caseId);

        },
        getCaseInfo (caseId) {
            this.lawCaseId = caseId;
            var that = this;
            that.caseLoading = true;
            queryCaseInfo(caseId).then(res => {
                var data = res.data;
                if (data.state - 0 === 100) {
                    that.caseInfo = data.result;
                } else {
                    that.$Message.info('案件详情查询:' + data.message);
                }
                that.caseLoading = false;
            }).catch(() => {
                that.$Message.error('网络错误，查询案件详情失败。');
                that.caseLoading = false;
            });
        },
        getInfo (caseId) {
            this.nist = [];
            this.otherfileNlist = [];
            getUserInfo().then(res => {
                console.log(res.data)
                if (res.data.state==100) {
                    this.courtId=res.data.court.id
                    console.log(this.courtId)
                                this.lawCaseId = caseId;
            var that = this;
            that.infoLoading = true;
            getInfo(caseId).then(res => {
                // alert(1)
                var data = res.data;
                 console.log(data.result)
                if (data.state - 0 === 100) {
                    this.clerkName = data.clerk;
                    this.judgeName = data.judge;
                    that.info = data.result;
                    for (let i = 0; i < that.info.length; i++) {
                        var el = that.info[i];
                        el.addressList = [];
                        console.log(that.courtId)
                        if (that.courtId!=1) {
                            if (el.litigationStatusName == '原告') {
                                el.diplomsName = '送达地址确认书,送达回证,诉讼权利义务告知书,应诉通知书,电话通知记录表,传票,传票(存根),外出传票,外出传票(存根),廉政监督卡,合议庭组成人员通知书,参加诉讼通知书,举证通知书,受理案件通知书,送达地址有关事项告知书,公告,口头裁定笔录,审判流程信息公开告知内容,公告判决书,调解确认裁定书,领取诉讼文书通知书,公告稿,公告稿(保全)'
                            } else {
                                el.diplomsName = '送达地址确认书,送达回证,诉讼权利义务告知书,应诉通知书,电话通知记录表,传票,传票(存根),外出传票,外出传票(存根),廉政监督卡,合议庭组成人员通知书,参加诉讼通知书,举证通知书,受理案件通知书,送达地址有关事项告知书,委托送达函,公告,口头裁定笔录,审判流程信息公开告知内容,公告判决书,调解确认裁定书,领取诉讼文书通知书,公告稿,公告稿(保全)'
                            }
                        }else{
                            if (el.litigationStatusName == '原告') {
                                el.diplomsName = '送达地址确认书,送达回证,诉讼权利义务告知书,应诉通知书,电话通知记录表,传票,传票(存根),外出传票,外出传票(存根),廉政监督卡,合议庭组成人员通知书,参加诉讼通知书,举证通知书,受理案件通知书,送达地址有关事项告知书,公告,口头裁定笔录,公告判决书,调解确认裁定书,领取诉讼文书通知书'
                            } else {
                                el.diplomsName = '送达地址确认书,送达回证,诉讼权利义务告知书,应诉通知书,电话通知记录表,传票,传票(存根),外出传票,外出传票(存根),廉政监督卡,合议庭组成人员通知书,参加诉讼通知书,举证通知书,受理案件通知书,送达地址有关事项告知书,委托送达函,公告,口头裁定笔录,公告判决书,调解确认裁定书,领取诉讼文书通知书'
                            }
                        }
                        
                        el.checkAll = false;
                        el.indeterminate = false;
                        el.buttonP = false;
                        el.buttonpf = false;
                        el.checkBo = false;
                        el.creatLoading = false;
                        el.sendMELoading = false;
                        el.dipChecked = [];
                        el.oldCkecked = [];
                        el.sendTy = "";
                        el.sendTshow = 0;
                        el.other = "";
                        el.updat = "1";
                        el.adressupdat = "1";
                        el.otherAdress = [];
                        el.print = 0;
                        el.nativePlace = "";
                        el.courtName = "";
                        el.sendId = "";
                        el.courtPhone = "";
                        el.courtAdress = "";
                        el.diplist = [];
                        el.isEdit = false,
                        el.etListKey = "";
                        el.checkedLen="";
                        el.disabledGroup = [];
                        el.emailListArr = [];
                        el.emsAdressList = [];
                        el.shenfileNlist = [];
                        el.zhifileNlist = [];
                        el.zhizhenfileNlist = [];
                        el.ZhengJfileNlist = [];
                        el.payfileNlist = [];
                        el.zhenfileNlist = [];
                        el.caifileNlist = [];
                        el.juefileNlist = [];
                        el.qifileNlist = [];
                        el.cqfileNlist = [];
                        el.minShifileNlist=[];
                        el.otherGroup = [];
                        el.adId = 1;
                        el.defoultChecked=[];   //缓存默认选择的
                        
                        var exam = {
                            id:0,
                            addressName : '',
                            addressNumber : ""
                        }
                        el.emsAdressList.push(exam);
                        el.emailContent = "";
                        var strs = "";
                        if (el.diplomsName) {
                            var arr = el.diplomsName.split(',');

                            for (let j = 0; j < arr.length; j++) {
                                const ee = arr[j];
                                el.diplist.push({
                                    name: ee,
                                    checked: false,
                                    ispro:false,
                                    edit:false,
                                });
                                if (el.litigationStatusName == '原告') {
                                    if (ee == '传票' || ee == '传票(存根)') {
                                        el.dipChecked.push(ee);
                                        el.defoultChecked.push(ee);
                                        if(el.dipChecked.length > 1){
                                            strs =strs + ee;
                                        }else{
                                            strs =strs + ee + ",";
                                        }
                                    }

                                }
                                // else if(el.litigationStatusName == "第三人"){
                                //     if (ee == '送达地址确认书' || ee == '诉讼权利义务告知书' || ee == "应诉通知书" || ee == "传票" || ee == "廉政监督卡" || ee == "举证通知书" || ee == "送达地址有关事项告知书") {
                                //         el.dipChecked.push(ee);
                                //         if(el.dipChecked.length > 8){
                                //             strs =strs + ee;
                                //         }else{
                                //             strs =strs + ee + ",";
                                //         }
                                //     }
                                //     var ary1 = ['证据材料', '起诉状'];
                                //     el.disabledGroup = ary1;
                                    
                                // }
                                else  {
                                    if (ee != '受理案件通知书' && ee != '合议庭组成人员通知书' && ee != "参加诉讼通知书" && ee != "电话通知记录表" && ee != "委托送达函"&& ee != "公告"&& ee != "口头裁定笔录"&& ee != "公告判决书"&& ee != "外出传票"&& ee != "外出传票(存根)" && ee != "调解确认裁定书" && ee != '领取诉讼文书通知书' && ee != '公告稿' && ee != "公告稿(保全)") {
                                        el.dipChecked.push(ee);
                                        el.defoultChecked.push(ee);
                                        if(el.dipChecked.length > 8){
                                            strs =strs + ee;
                                        }else{
                                            strs =strs + ee + ",";
                                        }
                                    }
                                    var ary1 = ['证据材料', '起诉状'];
                                    el.disabledGroup = ary1;
                                }

                            }
                        }
                        el.checkedLen = el.dipChecked.length;
                        el.oldCkecked  = el.dipChecked;
                        el.stars = strs;
                        if(el.litigationStatusName != '原告'){
                            el.dipChecked.push('证据材料');
                            el.dipChecked.push('起诉状');
                        }

                        if(el.sendType != null && el.sendType != ''){
                            this.showType(el.litigantId,el.sendType);
                        }
                    }
                    for(let i = 0; i < that.info.length; i++){
                        queryDiplomsIsAdd(that.info[i].litigantId,that.info[i].stars).then(res => {
                            if(res.data.state == 100){
                                if(res.data.result.length == 0){
                                    that.info[i].buttonP = true;
                                    that.info[i].buttonpf = true;
                                    Vue.set(that.info, i, that.info[i]);
                                }else{
                                    that.info[i].buttonP = false;
                                    that.info[i].buttonpf = false;
                                    Vue.set(that.info, i, that.info[i]);
                                }
                            }
                        })
                    }
                    for(let i = 0; i < that.info.length; i++){
                        addressList( that.info[i].litigantId)
                        .then(res => {
                        var datas = res.data;
                        if (datas.state === 100) {
                            if (
                            datas.result.address != null &&
                            datas.result.address != ""
                            ) {
                            that.info[i].addressList.push(datas.result.address);
                            }
                            if (
                            datas.result.nativePlace != null &&
                            datas.result.nativePlace != ""
                            ) {
                                that.info[i].nativePlace = datas.result.nativePlace;
                            that.info[i].addressList.push(
                                datas.result.nativePlace
                            );
                            }
                            if (
                            datas.result.sendAddress != null &&
                            datas.result.sendAddress != ""
                            ) {
                            that.info[i].addressList.push(
                                datas.result.sendAddress
                            );
                            }
                            if(datas.result.allAddress != null &&  datas.result.allAddress != []){
                                for(let o=0;o<datas.result.allAddress.length;o++){
                                    if(datas.result.allAddress[o].type == 3){
                                        that.info[i].addressList.push(datas.result.allAddress[o].address);
                                    }
                                }
                            }
                            that.info[i].addressList = Array.from(
                            new Set(that.info[i].addressList)
                            );
                            that.info[i].sendAddress = [];
                            
                            Vue.set(that.info, i, that.info[i]);
                        } else {
                            this.$Message.info(datas.message);
                        }
                        })
                        .catch(() => {
                        this.$Message.error("网络错误，获取当事人地址失败。");
                        });
                    }
                    console.log(that.info)
                } else {
                    that.$Message.info('送达查询:' + data.message);
                }
                that.infoLoading = false;
            }).catch(() => {
                that.$Message.error('网络错误，查询送达信息失败。');
                that.infoLoading = false;
            });
                }else{
                    // alert('获取用户信息失败')
                    that.$Message.error('获取用户信息失败');
                }
            })

        },
        changeUp1(id){
            for (var i = 0; i < this.info.length; i++){
                if(id == this.info[i].litigantId){
                this.info[i].updat = "1";
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        changeUp2(id){
            for (var i = 0; i < this.info.length; i++){
                if(id == this.info[i].litigantId){
                this.info[i].updat = "0";
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        changeUp3(id){
            for (var i = 0; i < this.info.length; i++){
                if(id == this.info[i].litigantId){
                this.info[i].adressupdat = "1";
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        changeUp4(id){
            for (var i = 0; i < this.info.length; i++){
                if(id == this.info[i].litigantId){
                this.info[i].adressupdat = "0";
                }
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        handleCheckAll (item) {
            // console.log('item'+item)

            if (item.indeterminate) {
                item.checkAll = false;
            } else {
                item.checkAll = !item.checkAll;
            }
            item.indeterminate = false;

            if (item.checkAll) {
                item.dipChecked = [];
                for (let i = 0; i < item.diplist.length; i++) {
                    const el = item.diplist[i];
                    item.diplist[i].checked = true;
                    item.dipChecked.push(el.name);
                }
                for(let j = 0;j<this.check.length;j++){
                    for(let d = 0;d<this.info.length;d++){
                        for(let k = 0;k<this.info[d].diplist.length;k++){
                            this.info[d].diplist[k].ispro=false;
                        }
                    }
                }
            } else {
                for (let i = 0; i < item.diplist.length; i++) {
                    item.diplist[i].checked = false;
                }
                item.dipChecked = [];
            }
            // if(item.disabledGroup){
            //     for(var i = 0;i<item.disabledGroup.length;i++){
            //         item.dipChecked.push(item.disabledGroup[i])
            //     }
            // }
            console.log(item.dipChecked);
            var str = "";
            for(let i = 0;i<item.dipChecked.length;i++){
                if(item.dipChecked[i] != "证据材料" && item.dipChecked[i] != "起诉状" && item.dipChecked[i] != "答辩状" && item.dipChecked[i] != "上诉状"&& item.dipChecked[i] != "民事裁定书" ){
                    if(i == item.dipChecked.length - 1){
                        str =str + item.dipChecked[i];
                    }else{
                        str =str + item.dipChecked[i] + ",";
                    }
                }
            }
            queryDiplomsIsAdd(item.litigantId,str).then(res => {
                if(res.data.state == 100){
                    console.log(res.data.result.length)
                    if(res.data.result.length == 0 || res.data.result[0] == ""){
                        for(var i = 0;i<this.info.length;i++){
                            if(this.info[i].litigantId == item.litigantId){
                                this.info[i].buttonP = true;
                                this.info[i].buttonpf = true;
                                Vue.set(this.info, i, this.info[i]);
                            }
                        }
                    }else{
                        for(var i = 0;i<this.info.length;i++){
                            if(this.info[i].litigantId == item.litigantId){
                                this.info[i].buttonP = false;
                                this.info[i].buttonpf = false;
                                Vue.set(this.info, i, this.info[i]);
                            }
                        }
                    }
                }else if(res.data.state == 101 && res.data.message == '请选择要查询的文书!'){
                    for(var i = 0;i<this.info.length;i++){
                        if(this.info[i].litigantId == item.litigantId){
                            this.info[i].buttonP = false;
                            this.info[i].buttonpf = false;
                            Vue.set(this.info, i, this.info[i]);
                        }
                    }
                }
            })
            this.info = JSON.parse(JSON.stringify(this.info));


        },
        wxTpChange(data){
            for(let i=0;i<this.emailModelList.length;i++){
                if(this.emailModelList[i].id == data.weixinModelId){
                    data.wxContent = this.emailModelList[i].content2
                    
                }
            }
            data = JSON.parse(JSON.stringify(data))
        },
        wxNumberChange(data){

            data.wechatList.map(item => {
                if(item.admin == data.wechatNumber){
                    data.weMessage = item.message;
                    // console.log(data.weMessage)
                    // data = JSON.parse(JSON.stringify(data))
                }
            })
            for (var i = 0; i < this.info.length; i++){
                if(data.litigantId == this.info[i].litigantId){
                    this.info[i].weMessage = data.weMessage;
                    Vue.set(this.info, i, this.info[i]);
                }
            }
            
        },
        emailTpChange(data){
            data.emailContent = data.emailListArr[data.etListKey].content;
            data.emailId = data.emailListArr[data.etListKey].id;
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        addAdreModel(value){
            this.litigantId = value.litigantId;
            this.adressList = [];
            this.adId = 0;
            var da ={
                id:this.adId,
                name:'',
                beizhu:''
            }
            this.adressList.push(da);
            this.adId = this.adId+1;
            this.addModel = true;
        },
        addAdr(){
            var adressStr = "";
            var rmarkStr = "";
            if(this.adressList.length != 0){
                for( var i=0;i<this.adressList.length;i++){
                    // if(i == this.adressList.length-1){
                    //     adressStr = adressStr+this.adressList[i].name;
                    //     rmarkStr = rmarkStr+this.adressList[i].beizhu;
                    // }else{
                        adressStr = adressStr+this.adressList[i].name+',';
                        rmarkStr = rmarkStr+this.adressList[i].beizhu+',';
                    // }

                }
            }
            addAdress(this.litigantId,adressStr,rmarkStr).then(res => {
                if(res.data.state == 100){
                    this.$Message.success(res.data.message);
                    for(var i = 0; i < this.info.length; i++){
                    if (this.litigantId == this.info[i].litigantId){
                        for(var t=0;t<this.adressList.length;t++){
                        this.info[i].addressList.push(this.adressList[t].name);
                        }
                    }
                    }
                    this.addModel = false;
                }else{
                    this.$Message.info(res.data.message);
                    this.changeLoading();
                }
            })
        },
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        delAdress(value){
            for(var i=0;i<this.adressList.length;i++){
                if(this.adressList[i].id == value.id){
                    this.adressList.splice(i,1);
                }
            }
        },
        delemsAdress(data,value){
            for(var i=0;i<data.emsAdressList.length;i++){
                if(data.emsAdressList[i].id == value.id){
                    data.emsAdressList.splice(i,1);
                    // if(value.id == data.adId - 1){
                    //     data.adId = data.adId - 1;
                    // }
                }
            }
            if(data.emsAdressList[data.emsAdressList.length - 1].id != data.adId-1){
                data.adId = data.emsAdressList[data.emsAdressList.length - 1].id + 1;
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        addAdress(){
            var da ={
                id:this.adId,
                name:'',
                beizhu:''
            }
            this.adressList.push(da);
            this.adId = this.adId+1;
        },
        addemsAdress(data){
            if(data.emsAdressList.length == data.addressList.length){
                return false;
            }
            var da ={
                id:data.adId,
                addressName:'',
                addressNumber:''
            }
            data.emsAdressList.push(da);
            data.adId = data.adId+1;
            console.log(data)
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        otherdipCheckedChange(data){
            for(var p = 0;p<data.dipChecked.length;p++){
                if(data.dipChecked[p] == "证据材料" || data.dipChecked[p] == "起诉状" || data.dipChecked[p] == "答辩状" || data.dipChecked[p] == "上诉状" || data.dipChecked[p] == "民事裁定书" || data.dipChecked[p] == ""){
                    data.dipChecked.splice(p,1)
                    p = p - 1;    //改变循环变量
                }
            }
            console.log(data.disabledGroup)
            // for(let i = 0;i<data.disabledGroup.length;i++){
            //     if(data.disabledGroup[i] != ""){
            //         data.dipChecked.push(data.disabledGroup[i]);
            //     }
            // }
            console.log(data.dipChecked)
            // vue对象数据更新
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        dipOtherGroupChange(data){
            console.log(data)
            console.log(data.otherGroup)
            if(data.otherGroup.length != 0){
                data.buttonP = true;
            }else if(data.otherGroup.length == 0 && data.buttonpf == false){
                data.buttonP = false;
            }
            this.info = JSON.parse(JSON.stringify(this.info));
        },
        isCheckeds(e){
            console.log(e)
        },
        dipCheckedChange (data,e) {
            if(data.dipChecked.length > 0){
               let aryss =  R.difference(data.oldCkecked,data.dipChecked);
                if(aryss.length != 0 && aryss[0] == "外出传票"){
                    let isOdd = (n) => n == "传票" || n == "传票(存根)" || n == "外出传票(存根)";
                    data.dipChecked = R.reject(isOdd)(data.dipChecked)
                }else{
                    if(data.dipChecked[data.dipChecked.length - 1] == "外出传票"){
                        let isOdd = (n) => n == "传票" || n == "传票(存根)" || n == "外出传票(存根)";
                        data.dipChecked = R.reject(isOdd)(data.dipChecked)
                        let arrr  = ["传票","传票(存根)","外出传票(存根)"]
                        data.dipChecked.push(...arrr)
                    }
                }
                
            }
            this.editss = '';
            var str = "";
            let count=0
            for(let i = 0;i<data.dipChecked.length;i++){
                if(data.dipChecked[i] != "证据材料" && data.dipChecked[i] != "起诉状" && data.dipChecked[i] != "答辩状" && data.dipChecked[i] != "上诉状" && data.dipChecked[i] != "民事裁定书"){
                    if(i == data.dipChecked.length - 1){
                        str =str + data.dipChecked[i];
                    }else{
                        str =str + data.dipChecked[i] + ",";
                    }
                }
                
                if (data.dipChecked[i]=='受理案件通知书') {
                    
                    
                    count = 1;

                }
                for(let j = 0;j<this.check.length;j++){
                     if(data.dipChecked[i] == this.check[j]){
                        //    console.log('hdhsjd'+this.check[j])
                           var index = j;
                          for(let d = 0;d<this.info.length;d++){
                            if(this.info[d].litigantId == this.dipName){
                                  for(let k = 0;k<this.info[d].diplist.length;k++){
                                      if(this.check[j] == this.info[d].diplist[k].name){
                                            this.info[d].diplist[k].ispro=false;
                                      }
                                  }
                            }}
                     }
                }

            }
            let count1=0
            if (data.dipChecked[data.dipChecked.length-1] =='受理案件通知书' ) {

                for (let c = 0; c < data.dipChecked.length; c++) {
                    // const element = array[c];
                    if (data.dipChecked[c]=='诉讼权利义务告知书') {
                        
                    }else{
                        
                        count1++
                    }
                }
                if (count1==data.dipChecked.length && data.checkedLen < data.dipChecked.length) {
                    data.dipChecked.push('诉讼权利义务告知书')
                }
            }
            data.checkedLen = data.dipChecked.length;
            if (data.dipChecked.length === data.diplist.length) {
                data.indeterminate = false;
                data.checkAll = true;
            } else if (data.dipChecked.length > 0) {
                data.indeterminate = true;
                data.checkAll = false;
            } else {
                data.indeterminate = false;
                data.checkAll = false;
            }
            queryDiplomsIsAdd(data.litigantId,str).then(res => {
                if(res.data.state == 100){
                    console.log(res.data.result.length)
                    if(res.data.result.length == 0 || res.data.result[0] == ""){
                        for(var i = 0;i<this.info.length;i++){
                            if(this.info[i].litigantId == data.litigantId){
                                this.info[i].buttonP = true;
                                this.info[i].buttonpf = true;
                                Vue.set(this.info, i, this.info[i]);
                            }
                        }
                    }else{
                        for(var i = 0;i<this.info.length;i++){
                            if(this.info[i].litigantId == data.litigantId){
                                this.info[i].buttonP = false;
                                this.info[i].buttonpf = false;
                                Vue.set(this.info, i, this.info[i]);
                            }
                        }
                        // data.buttonP = false;
                        // this.info = JSON.parse(JSON.stringify(this.info));
                    }
                }
            })
            data.oldCkecked = data.dipChecked;
            // vue对象数据更新
            this.info = JSON.parse(JSON.stringify(this.info));
            // console.log('info'+JSON.stringify(this.info))
        },
        sureSend(item){
            if (item.dipChecked.length){
                confirm(this.lawCaseId,item.litigantId,item.sendId).then(res => {
                if(res.data.state == 100){
                    this.$Message.success(res.data.message);
                }else{
                    this.$Message.info(res.data.message);
                }
                })
            }
        },
        sendME(el){
            var fileds = [];
            el.checkeds = [];
            // el.sendMELoading = true;
            // this.info = JSON.parse(JSON.stringify(this.info));
            var checks = 0;
            var adressStr = "";
            var adressNum = "";
            var isReturn = 0;
            var otherCh = "";
            var evidenceListStr = ""
            if(el.sendType == 1){   //地址
                for(let i=0;i<el.emsAdressList.length;i++){
                    if(i == el.emsAdressList.length-1){
                        adressStr = adressStr + el.emsAdressList[i].addressName;
                        adressNum = adressNum + el.emsAdressList[i].addressNumber;
                    }else{
                        adressStr = adressStr + el.emsAdressList[i].addressName + ",";
                        adressNum = adressNum + el.emsAdressList[i].addressNumber + ",";
                    }
                    if(el.emsAdressList[i].addressName == "" || el.emsAdressList[i].addressNumber == ""){
                        isReturn = 1;
                    }
                }
            }else if(el.sendType != 5 && el.sendType != 7 && el.sendType != 8){
                if(el.addressList.length == 0){
                    adressStr = el.address;
                }else{
                    adressStr =el.sendAddress;
                }
                adressNum = el.oddNumbers;
                if(adressStr == "" || adressNum == ""){
                    isReturn = 1;
                }
            }
            if(el.checkBo ==true){
                el.disabledGroup.push(el.other)
            }
            for(let o=0;o<el.disabledGroup.length;o++){
                if(el.otherGroup.length == 0 && o == el.disabledGroup.length - 1){
                    evidenceListStr = evidenceListStr + el.disabledGroup[o];
                }else{
                    evidenceListStr = evidenceListStr + el.disabledGroup[o] + ",";
                }
            }
            console.log(el.disabledGroup)
            if(el.sendType == 0 || el.sendType == 3 || el.sendType == 4){
                isReturn = 0;
            }
            let ret = "已传";
            for(let y=0;y<el.otherGroup.length;y++){
                let strTest = '';
                if(el.otherGroup[y] == "裁判文书"){
                    if(el.ShenfileNlist.length == 0){
                        ret = "请上传裁判文书";
                    }
                    for(let u=0;u<el.ShenfileNlist.length;u++){
                        if(u == el.ShenfileNlist.length - 1){
                            strTest = strTest + el.ShenfileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.ShenfileNlist[u].urlName + ";"
                        }
                    }
                }else if(el.otherGroup[y] == "公告判决书"){
                    if(el.payfileNlist.length == 0){
                        ret = "请上传公告判决书";
                    }
                    for(let u=0;u<el.payfileNlist.length;u++){
                        if(u == el.payfileNlist.length - 1){
                            strTest = strTest + el.payfileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.payfileNlist[u].urlName + ";"
                        } 
                    }
                }
                else if(el.otherGroup[y] == "申请书"){
                    if(el.shenfileNlist.length == 0){
                        ret = "请上传申请书";
                    }
                    for(let u=0;u<el.shenfileNlist.length;u++){
                        if(u == el.shenfileNlist.length - 1){
                            strTest = strTest + el.shenfileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.shenfileNlist[u].urlName + ";"
                        } 
                    }
                }
                else if(el.otherGroup[y] == "上传证据"){
                    if(el.ZhengJfileNlist.length == 0){
                        ret = "请上传证据";
                    }
                    for(let u=0;u<el.ZhengJfileNlist.length;u++){
                        if(u == el.ZhengJfileNlist.length - 1){
                            strTest = strTest + el.ZhengJfileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.ZhengJfileNlist[u].urlName + ";"
                        } 
                    }
                }
                else if(el.otherGroup[y] == "支付令"){
                    if(el.zhifileNlist.length == 0){
                        ret = "请上传支付令";
                    }
                    for(let u=0;u<el.zhifileNlist.length;u++){
                        if(u == el.zhifileNlist.length - 1){
                            strTest = strTest + el.zhifileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.zhifileNlist[u].urlName + ";"
                        } 
                    }
                }
                else if(el.otherGroup[y] == "支付令证据材料"){
                    if(el.zhizhenfileNlist.length == 0){
                        ret = "请上传支付令证据材料";
                    }
                    for(let u=0;u<el.zhizhenfileNlist.length;u++){
                        if(u == el.zhizhenfileNlist.length - 1){
                            strTest = strTest + el.zhizhenfileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.zhizhenfileNlist[u].urlName + ";"
                        } 
                    }
                }

                else if(el.otherGroup[y] == "调解书"){
                    if(el.zhenfileNlist.length == 0){
                        ret = "请上传调解书";
                    }
                    for(let u=0;u<el.zhenfileNlist.length;u++){
                        if(u == el.zhenfileNlist.length - 1){
                            strTest = strTest + el.zhenfileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.zhenfileNlist[u].urlName + ";"
                        }   
                    }  
                }else if(el.otherGroup[y] == "裁定书"){
                    if(el.caifileNlist.length == 0){
                        ret = "请上传裁定书";
                    }
                    for(let u=0;u<el.caifileNlist.length;u++){
                        if(u == el.caifileNlist.length - 1){
                            strTest = strTest + el.caifileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.caifileNlist[u].urlName + ";"
                        }   
                    }  
                }else if(el.otherGroup[y] == "决定书"){
                    if(el.juefileNlist.length == 0){
                        ret = "请上传决定书";
                    }
                    for(let u=0;u<el.juefileNlist.length;u++){
                        if(u == el.juefileNlist.length - 1){
                            strTest = strTest + el.juefileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.juefileNlist[u].urlName + ";"
                        }   
                    }  
                }else if(el.otherGroup[y] == "其他法律文书"){
                    if(el.qifileNlist.length == 0){
                        ret = "请上传其他法律文书";
                    }
                    for(let u=0;u<el.qifileNlist.length;u++){
                        if(u == el.qifileNlist.length - 1){
                            strTest = strTest + el.qifileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.qifileNlist[u].urlName + ";"
                        }   
                    }  
                }else if(el.otherGroup[y] == "民事判决书"){
                    if(el.minShifileNlist.length == 0){
                        ret = "请上传民事判决书";
                    }
                    for(let u=0;u<el.minShifileNlist.length;u++){
                        if(u == el.minShifileNlist.length - 1){
                            strTest = strTest + el.minShifileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.minShifileNlist[u].urlName + ";"
                        }   
                    }  
                }else if(el.otherGroup[y] == "撤诉裁定书"){
                    if(el.cqfileNlist.length == 0){
                        ret = "请上传撤诉裁定书";
                    }
                    for(let u=0;u<el.cqfileNlist.length;u++){
                        if(u == el.cqfileNlist.length - 1){
                            strTest = strTest + el.cqfileNlist[u].urlName;
                        }else{
                            strTest = strTest + el.cqfileNlist[u].urlName + ";"
                        }   
                    }  
                }
                if(strTest != ""){
                    if(y == el.otherGroup.length - 1){
                        if(el.otherGroup[y] == "支付令证据材料"){
                            otherCh = otherCh + "证据材料" + ";" + strTest;
                        }else{
                            otherCh = otherCh + el.otherGroup[y] + ";" + strTest;
                        }
                    }else{
                        if(el.otherGroup[y] == "支付令证据材料"){
                            otherCh = otherCh + "证据材料" + ";" + strTest + ",";
                        }else{
                            otherCh = otherCh + el.otherGroup[y] + ";" + strTest + ",";
                        }
                    }
                    
                }else{
                    
                    if(y == el.otherGroup.length - 1){
                        if(el.otherGroup[y] == "支付令证据材料"){
                            otherCh = otherCh + "证据材料";
                        }else{
                            otherCh = otherCh + el.otherGroup[y];
                        }
                        
                    }else{
                        if(el.otherGroup[y] == "支付令证据材料"){
                            otherCh = otherCh + "证据材料" + ",";
                        }else{
                            otherCh = otherCh + el.otherGroup[y] + ",";
                        }
                    }
                }
            }
            if(ret != "已传"){
                this.$Message.info(ret);
                el.sendMELoading = false;
                return false;
            }
            if(el.sendType == 6){
                if(el.courtAdress != ""){
                    isReturn = 0;
                }
            }
            if(isReturn == 1){
                this.$Message.info("送达地址或者快递单号不能为空！");
                el.sendMELoading = false;
                return false;
            }
            console.log(otherCh)
            var q = "'";
            var pramas = {
                lawCaseId:el.id,                                        //案件id
                litigantId:el.litigantId,                               //当事人id
                sendType:this.sendTypes[el.sendType],                   //送达类型
                oddNumbers:adressNum ? adressNum : "",                                   //快递单号
                sendAddress:adressStr ? adressStr : "",                                  //收件地址
                email:el.email ? el.email : "",                         //邮件
                emailModelId:el.emailId ? el.emailId : "",              //邮件id
                sendPhone:el.litigantPhone ? el.litigantPhone : "",     //当事人手机号码
                sendCourtName:el.courtName ? el.courtName : "",         //委托送达法院
                sendCourtAddress:el.courtAdress ? el.courtAdress : "",  //委托送达法院地址
                sendCourtTelephone:el.courtPhone ? el.courtPhone : "",  //委托送达法院电话
                isUpdateCourtInfo:el.updat == 1 ? true : false,         //委托送达法信息是否更新
                nativePlace:el.nativePlace ? el.nativePlace : "",       //当事人户籍地址
                isUpdateNativePlace:el.adressupdat == 1 ? true : false,  //当事人户籍地址是否更新
                diplmosList:el.dipChecked ? el.dipChecked.join(",") : "",         //文书名称列表使用
                excuteDiplomsList:otherCh ? otherCh : "",               //裁判文书列表
                evidenceList:evidenceListStr,    //其他文书列表
                wechatNumber:typeof(el.wechatNumber) == 'number' ? "" : el.wechatNumber,    //微信号
                weixinModelId:el.weixinModelId ? el.weixinModelId : "",    //其他文书列表
            }
            var str =
                (el.litigantId || "") +
                q +
                (el.litigantName || "") +
                q +
                (this.sendTypes[el.sendType] || "") +
                q +
                (adressNum || "") +
                q +
                (el.email || "") +
                q +
                (el.emailId || "") +
                q +
                (el.litigantPhone || "") +
                q +
                (adressStr || "") +
                q +
                (el.dipChecked ? el.dipChecked.join("$") : "") +
                q +
                (el.checkedEvidenceIds ? el.checkedEvidenceIds.join("$") : "") +
                q +
                (el.courtName || "") +
                q +
                (el.courtAdress || "") +
                q +
                (el.courtPhone || "") +
                q +
                (el.updat || "") +
                q +
                (el.nativePlace || "") +
                q +
                (el.adressupdat || "") +
                q +
                (otherCh || "");
            fileds.push(str);

            if (
                this.sendTypes[el.sendType] == "现场领取" ||
                this.sendTypes[el.sendType] == "工作人员上门送达" ||
                this.sendTypes[el.sendType] == "EMS送达" ||
                this.sendTypes[el.sendType] == "电子邮件送达" ||
                this.sendTypes[el.sendType] == "委托送达" ||
                this.sendTypes[el.sendType] == "H5确认阅读"
            ) {
                el.sendTshow = 1;
                if (this.sendTypes[el.sendType] == "现场领取") {
                el.sendTy = "现场领取";
                } else if (this.sendTypes[el.sendType] == "工作人员上门送达") {
                el.sendTy = "工作人员上门送达";
                }
            } else {
                el.sendTy = "";
                el.sendTshow = 0;
                el.print = 0;
            }
            // for(var pp=0;pp<el.dipChecked.length;pp++){
            //     if(el.dipChecked[pp] == el.other){
            //         el.dipChecked.splice(pp,1)
                    
            //     }
            // }
            for(let j=0;j<el.disabledGroup.length;j++){
                if(el.disabledGroup[j] == el.other){
                    el.disabledGroup.splice(j,1)
                }
            }
            // console.log(pramas)
            sendME(pramas)
                .then(res => {
                var data = res.data;
                this.$Message.info(data.message);
                if(data.state == 100){
                    var mm = data.data;
                    for (var m = 0; m < mm.length; m++) {
                        if (
                            mm[m].litigantId == el.litigantId &&
                            el.sendTshow == 1
                        ) {
                            el.print = 1;
                            el.sendId = mm[m].sendId;
                        }
                        window.open("/" + mm[m].diplomsPathList);
                    }
                    // if(mm[0].diplomsPathList != ""){
                    //     window.open("/" + mm[0].diplomsPathList);
                    // }
                    
                    // this.$Message.loading({
                    //     content: "文书生成中，请稍候",
                    //     duration: 1,
                    //     onClose: () => {
                        
                    //     }
                    // });
                }
                el.sendMELoading = false;
                // el = JSON.parse(JSON.stringify(el));
                this.info = JSON.parse(JSON.stringify(this.info));
            })
            .catch(() => {
            // this.$Message.error("网络错误，查询失败。");
                el.sendMELoading = false;
                this.info = JSON.parse(JSON.stringify(this.info));
            });
        },
        history(){
            sendDelivererHistory(this.lawCaseId).then(res => {
                if(res.data.state == 100){
                    this.showHistoryModel = true;
                    this.historyInfo = res.data.data;
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        },
        otherSend(){
            if(this.name == ''){
                this.$Message.info('请填写受送达人');
                return false;
            }
            if(this.email == ''){
                this.$Message.info('请填写受送达人邮箱');
                return false;
            }
            if(this.nist.length == 0){
                this.$Message.info('请上传文件');
                return false;
            }
            let data = {
                lawCaseId:this.lawCaseId,
                name:this.name,
                email:this.email,
                url:this.nist.join(',')
            }
            this.otherLoading = true;
            sendDeliverer(data).then(res => {
                this.otherLoading = false;
                if(res.data.state == 100){
                    this.$Message.success(res.data.message);
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        },
        getFile(event){
           let file = event.target.files[0];
            for(var i=0;i<this.otherfileNlist.length;i++){
                if(file.name==this.otherfileNlist[i]){
                    return false;
                }
            }
            console.log(file)
            // this.files.push(this.file)
            // this.fileN = file.name;
            var datas = {
                name:file.name,
                id:''
            }
            uploadDelivererFiles(file).then(res => {
                if(res.data.state == 100){
                    this.$Message.success(res.data.message);
                    this.nist.push(res.data.filePath)
                    this.otherfileNlist.push(datas);
                }else{
                    this.$Message.error(res.data.message);
                }
            })
            
        },
        delFile(){

        },
        // 等艺冬改好接口
        dipshow (item) {
            console.log(item)
            this.RequestContentShow=false
            if (item.dipChecked.length) {
                var that = this;
                this.index = item.dipChecked[0];
                var br = [];
                this.diplist = [];
                this.backFill=[];
                this.panelList =[];
                item.creatLoading = true;
                let programType = '';
                for (let i = 0; i < item.dipChecked.length; i++) {
                    var name = item.dipChecked[i];
                     for(let f = 0;f<item.diplist.length;f++){
                        if(item.diplist[f].edit == true && item.diplist[f].name == name){
                            name = name + "-add";
                        }
                    }
                    this.diplist.push({
                        name: name,
                        spin: true
                    });
                    if(name != '证据材料' && name != '起诉状'){
                        br.push(name);
                    }
                    
                    if(name == '公告稿'){
                        programType = '5';
                    }else if(name == '公告稿(保全)'){
                        programType = '6';
                    }
                    if (i === item.dipChecked.length - 1) {
                        for(let k=0;k<item.disabledGroup.length;k++){
                            br.push(item.disabledGroup[k])
                        }
                        list(item.litigantId.toString(), br.join(','),"","","",programType,item.courtName,item.nativePlace).then(res => {
                            var data = res.data;
                            if (data.state - 0 === 100) {
                                that.$Message.loading({
                                    content: '文书生成中，请稍候',
                                    duration: 1, // 按照文书数量给后台一点生成pdf文件的时间
                                    onClose: () => {
                                        window.open('/' + data.result);
                                    }
                                });
                                item.buttonP = true;
                                item.buttonpf = true;
                                for(let p = 0; p < item.dipChecked.length; p++){
                                    var namee = item.dipChecked[p];
                                    for(let m = 0;m<item.diplist.length;m++){
                                        if(item.diplist[m].edit == true && item.diplist[m].name == namee ){
                                            item.diplist[m].edit = false;
                                        }
                                    }
                                }
                                item.creatLoading  = false;
                                that.diplist.spin = false;
                                this.info = JSON.parse(JSON.stringify(this.info));
                            }else{
                                item.creatLoading  = false;
                                this.info = JSON.parse(JSON.stringify(this.info));
                                if (data.requestContent=='') {
                                    if (data.requestContentResult!='') {
                                        this.updateRequestContent=data.requestContentResult
                                    }
                                    this.RequestContentShow=true
                                    this.RequestContentItem=item
                                    //这里打开模态框，修改诉讼请求，点击确定发送修改的接口
                                }else{
                                    item.creatLoading  = false;
                                    this.info = JSON.parse(JSON.stringify(this.info));
                                    that.$Message.info(data.message);
                                    
                                }
                            }
                        }).catch(() => {
                            item.creatLoading  = false;
                            this.info = JSON.parse(JSON.stringify(this.info));
                            that.$Message.error('网络错误，获取' + name + '失败。');
                            that.diplist.spin = false;
                        });

                    }
                }


            } else {
                this.$Message.error('未选择文书');
            }
        },
        RequestContentCommit(){
            console.log(this.RequestContentItem)
            this.RequestContentShow=false
            if (this.RequestContentItem.dipChecked.length) {
                var that = this;
                this.index = this.RequestContentItem.dipChecked[0];
                var br = [];
                this.diplist = [];
                this.backFill=[];
                this.panelList =[];
                this.RequestContentItem.creatLoading = true;
                for (let i = 0; i < this.RequestContentItem.dipChecked.length; i++) {
                    var name = this.RequestContentItem.dipChecked[i];
                     for(let f = 0;f<this.RequestContentItem.diplist.length;f++){
                        if(this.RequestContentItem.diplist[f].edit == true && this.RequestContentItem.diplist[f].name == name){
                            name = name + "-add";
                        }
                    }
                    this.diplist.push({
                        name: name,
                        spin: true
                    });
                    br.push(name);

                    if (i === this.RequestContentItem.dipChecked.length - 1) {
                        list(this.RequestContentItem.litigantId.toString(), br.join(','),that.updateRequestContent).then(res => {
                            var data = res.data;
                            if (data.state - 0 === 100) {
                                that.$Message.loading({
                                    content: '文书生成中，请稍候',
                                    duration: 1, // 按照文书数量给后台一点生成pdf文件的时间
                                    onClose: () => {
                                        window.open('/' + data.result);
                                    }
                                });
                                this.RequestContentItem.buttonP = true;
                                this.RequestContentItem.buttonpf = true;
                                for(let p = 0; p < this.RequestContentItem.dipChecked.length; p++){
                                    var namee = this.RequestContentItem.dipChecked[p];
                                    for(let m = 0;m<this.RequestContentItem.diplist.length;m++){
                                        if(this.RequestContentItem.diplist[m].edit == true && this.RequestContentItem.diplist[m].name == namee ){
                                            this.RequestContentItem.diplist[m].edit = false;
                                        }
                                    }
                                }
                                this.RequestContentItem.creatLoading  = false;
                                that.diplist.spin = false;
                                this.info = JSON.parse(JSON.stringify(this.info));
                            }else{
                                
                                if (data.requestContent=='') {
                                    this.RequestContentShow=true
                                    //这里打开模态框，修改诉讼请求，点击确定发送修改的接口
                                }else{
                                    this.RequestContentItem.creatLoading  = false;
                                    this.info = JSON.parse(JSON.stringify(this.info));
                                    that.$Message.info(data.message);
                                    
                                }
                            }
                        }).catch(() => {
                            this.RequestContentItem.creatLoading  = false;
                            this.info = JSON.parse(JSON.stringify(this.info));
                            that.$Message.error('网络错误，获取' + name + '失败。');
                            that.diplist.spin = false;
                        });

                    }
                }


            } else {
                this.$Message.error('未选择文书');
            }
        },
        // 编辑
        editor(value,item){
            if(value == '领取诉讼文书通知书'){
                this.$Message.info('领取诉讼文书通知书暂时不可编辑！')
                return false;
            }
            console.log(value)
            this.panelList = '';
           this.panelList = value
           this.dipName = item.litigantId
            diplomsEditorPreview(value,item.litigantId).then(res=>{
                        var data = res.data;
                    if (data.state - 0 === 100) {
                        console.log(item.dipChecked)
                        this.backFill = data.result;
                        let ayr=['传票(存根)',"委托送达函"];
                        let artt = R.difference(item.dipChecked,ayr)
                        console.log(artt)
                        this.backFill.defendantDiplomsNameList = artt.join(',')
                        if(this.userCourtName == '殿前法庭'){
                            this.backFill.sendDiploms = item.dipChecked.join('一份,') + "一份";
                        }else{
                            this.backFill.sendDiploms = item.dipChecked.join(',');
                        }
                        this.backFill.entrustedCourt = item.courtName;
                        console.log(this.panelList)
                        this.modal1 = true;
                    }else{
                        this.$Message.info(res.data.message)
                    }
        })

        },
        // 生成
        produceDip(panelList,value,litigantId){
            this.$refs.cita.dipPro(value,panelList);

        },
        modelIshid(value,result,title){
          this.$Message.loading({
                content: '文书生成中，请稍候',
                duration: 0.6, // 按照文书数量给后台一点生成pdf文件的时间
                onClose: () => {
                    window.open('/' + result);
                }
            });
            console.log(value+111111111)
            console.log(result)
            console.log(title)
              this.modal1 = value;
               this.editss = title;
             for(let i=0;i<this.info.length;i++){
                if(this.info[i].litigantId == this.dipName){
                    this.info[i].isproduct = true;
                    console.log(this.info[i].diplist)
                    // this.info[i].dipChecked.push(title)
                     for(let j = 0;j<this.info[i].dipChecked.length;j++){
                         
                         if(this.info[i].dipChecked[j]==title){
                             var index = j;
                             this.check.push(title);
                            //  console.log('check'+this.check)
                             this.info[i].dipChecked.splice(index,1)
                             this.info = JSON.parse(JSON.stringify(this.info));
                         }
                          for(let f = 0;f<this.info[i].diplist.length;f++){
                             if(this.info[i].dipChecked[j] == this.info[i].diplist[f].name){
                                this.info[i].diplist[f].ispro = false;

                                // console.log('ddd'+JSON.stringify(this.info[i].diplist[f]))
                                this.info = JSON.parse(JSON.stringify(this.info));
                            }
                            console.log(this.info[i].diplist[f].name)
                            console.log(title)
                            if(this.info[i].diplist[f].name == title){
                                this.info[i].diplist[f].edit = true;
                            }
                         }

                     }
                     for(let j = 0;j<this.info[i].diplist.length;j++){
                         if(this.info[i].diplist[j].name==title){
                             var index = j;
                             this.check.push(title);

                             this.info = JSON.parse(JSON.stringify(this.info));
                         }

                     }

                     for(let k = 0;k<this.check.length;k++){
                         for(let f = 0;f<this.info[i].diplist.length;f++){
                             if(this.check[k] == this.info[i].diplist[f].name){
                                this.info[i].diplist[f].ispro = true;
                                this.info = JSON.parse(JSON.stringify(this.info));
                                for(let j = 0;j<this.info[i].dipChecked.length;j++){
                                    for(let f = 0;f<this.info[i].diplist.length;f++){
                             if(this.info[i].dipChecked[j] == this.info[i].diplist[f].name){
                                this.info[i].diplist[f].ispro = false;
                                this.info = JSON.parse(JSON.stringify(this.info));

                            }
                         }
                                }
                            }
                         }

                      }

                }
             }

        },
        dipshowF (str) {
            var that = this;
            this.modal1 = false;
            console.log(this.info[0])
            console.log(this.info)
            var br = [];
            list(this.info[0].litigantId.toString(), str).then(res => {
                var data = res.data;
                if (data.state - 0 === 100) {
                    that.$Message.loading({
                        content: '文书生成中，请稍候',
                        duration: 3, // 给后台一点生成pdf文件的时间
                        onClose: () => {
                            window.open('/' + data.result);
                        }
                    });
                    that.diplist.spin = false;
                    if(data.warn.length>0){
                      this.modal2 = true;
                      var warn = data.warn.split(':');
                      this.warn = warn[0];
                      this.warn1 = warn[1].split(';');
                     this.warn1.pop();
                      console.log( this.warn1)

                   }else{
                     this.modal2 = false;
                   }
                }else{
                    this.$Message.info(data.state.message)
                }
                // 当被告地址超过6个时的消息提示

            }).catch(() => {
                that.$Message.error('网络错误，获取' + name + '失败。');
                that.diplist.spin = false;
            });

        },
        formatDate (d, fmt) {
            return formatDate(d, fmt);
        },
        changePage (p) {
            this.caseP = p;
        }
    },
    filters: {
        formatSex (value) {
            return value ? '女' : '男';
        },
        formatType (value) {
            return value ? '法人' : '自然人'
        }
    }
};
</script>
<style lang="less" scoped>
  .edit{
      font-size: 10px;
      cursor: pointer;
  }
  .maininfo-col{
      display:flex;
      justify-content:space-between;
  }
  .created{
      color: silver;
  }
  .adds {
        border:1px solid #ccc;
        cursor: pointer;
    }
.adds .ivu-icon{
    font-size: 30px;
    display: block;
    margin-top: 5px;
}
.adds p{
    display: inline-block;
    line-height: 11px;
}
.addOtherAdress .ivu-icon{
    font-size: 18px;
    margin-left: 5px;
    cursor: pointer;
}
.icoadress{
    font-size: 20px;
    line-height: 32px;
    margin-left: 5px;
    cursor: pointer;
}
.otherCol{
    line-height: 38px;
    padding: 0 4px;
    border-right: 1px solid #e9eaec;
    border-left: 1px solid #e9eaec;
    border-bottom: 1px solid #e9eaec;
}
</style>
