<template>
    <div>
        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700;margin-bottom:10px">诉前案件管理</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent ="getList(1)" >
                        <FormItem label="引调号：">
                            <Input style="width: 200px" v-model="formItem.caseNo"/>
                        </FormItem>
                        <FormItem label="回执编号：">
                            <Input style="width: 200px" v-model="formItem.code"/>
                        </FormItem>
                        <FormItem label="当事人：">
                            <Input style="width: 200px" v-model="formItem.defendantName"/>
                        </FormItem>
                        
                        <FormItem label="案件状态：">
                            <Select v-model="formItem.mediateType"  @on-foucus="changeyyyy" @on-change="changeyyyy" clearable style="width:170px">
                                <Option value="1">文书生成中</Option>
                                <Option value="2" >文书送达中</Option>
                                <Option value="3">诉前调解中</Option>
                                <Option value="4">已正式立案</Option>
                                <Option value="5">委派调解中</Option>
                                <Option value="6">撤诉申请中</Option>
                                <Option value="7">已撤诉</Option>
                                <Option value="8">驳回撤诉</Option>
                            </Select>
                        </FormItem>
                        <div style="display: inline-block;padding-right: 30px;float: right;">
                            <Button @click="getList(1)" type="ghost">查询</Button>
                            <Button @click="clean" style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
                <!-- <Col span="3" style="margin-bottom:15px;    width: 50%;">
                    <span style="color:#464c5b;font-size:16px;font-weight:700;margin-bottom:10px">诉前案件管理</span>

                    <Input v-model="value13" style="float: right;margin-right: 120px;width: 50%;">
                        <Select v-model="select3" slot="prepend" style="width: 80px">
                            <Option value="引调号">引调号</Option>
                            <Option value="回执编号">回执编号</Option>
                            <Option value="当事人">当事人</Option>
                        </Select>
                        <Button slot="append" icon="ios-search" @click.native='search'></Button>
                    </Input>
                    
                </Col> -->
                
            </Row>
            <Row style="margin:15px;">
                <Button type="info" style="" @click="createEmsExcelWindow=true">邮寄交接单打印</Button>
                <Button type="info" style="margin-right:10px" @click="showCaseInfo">案件信息导出</Button>
                <Button type="info" style="margin-right:10px" @click="inCaseInfo">案件导入内网</Button>
            </Row>
            
            <!-- <Button @click="uploadOCR" class="border-btn" style="margin-left: 10px;margin-bottom:10px;margin-top:10px">导入案件</Button> -->
            <Table stripe ref="judgeTable" :columns="judgecol" :data="casedata" @on-selection-change="tableCheck"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
            title="输入快递单号，多个单号请以‘，’隔开"
            v-model="createEmsExcelWindow"
            class-name="vertical-center-modal" cancel-text=""
          ok-text="关闭">
            <Input v-model="createEmsExcel" type="textarea" :autosize="{minRows: 5,maxRows: 8}" placeholder="输入快递单号" />
            <div  style="margin: 16px 0; text-align: center">
                <ButtonGroup size="large">
                    <Button @click="okcreateEmsExcel" style="width: 100px"  type="success">提交</Button>
                    <!-- <Button style="width: 150px" @click="downEMS">下载EMS交接单</Button> -->
                </ButtonGroup>
            </div>
        </Modal>
        <Modal
          v-model="wenmodal"
          title="发送文书"
          width="850"
          cancel-text=""
          ok-text="关闭">
          <Card>  
            <p slot="title">
                发送文书
            </p>
          <div slot="extra">
            <RadioGroup v-model="sendTo" @on-change="radioChange">
                <Radio label="3">
                    <span>全选</span>
                </Radio>
                <Radio label="0">
                    <span>全不选</span>
                </Radio>
            </RadioGroup>
        </div>
          <div v-for="item in defendantList" style="border-bottom: 1px solid #bbb;padding-bottom:5px;margin-bottom:15px">
            <Row>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  被告姓名：
              </Col>
              <Col span="5">
                  <Input v-model="item.litigantName" placeholder="姓名不能为空" style="width: 100%"></Input>
              </Col>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  联系电话：
              </Col>
              <Col span="5">
                  <Input v-model='item.legalManPhone?item.legalManPhone:item.litigantPhone' placeholder="联系电话不能为空" style="width: 100%"></Input>
              </Col>
              <Col span="3" style="text-align: right; padding-right: 5px">
                  送达方式：
              </Col>
              <Col span="5">
                  <Select v-model="item.sendType" :transfer="bodyt" style="width:100%">
                      <Option v-for="(st, key) in sendTypes" :value="key" :key="key">{{ st }}</Option>
                  </Select>
              </Col>
            </Row>
            <Row style="margin-top: 10px;">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  文书列表：
              </Col>
              <Col span="3">
                  告知书
              </Col>
            </Row> 
            <Row v-show="item.sendType === 3"  style="margin-top: 10px;">
              <Col span="3" style="text-align: right; padding-right: 5px" >
                  <span style="color: #ed3f14">*</span>
                  邮箱地址：
              </Col>
              <Col span="12">
                  <Input v-model="item.email" style="width: 100%"></Input>
              </Col>
          </Row>

          <Row v-if="item.sendType === 1"  style="margin-top: 10px;">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  快递单号：
              </Col>
              <Col span="10">
                  <Input v-model="item.oddNumbers" style="width: 100%"></Input>
              </Col>
              <!-- <Col span="3">
                  <Button type="info" @click="printBill(item)" long style="margin-left: 15px;">快递单打印</Button>
              </Col> -->
          </Row>
          <Row v-if="item.sendType === 1"  style="margin-top: 10px;">
              <Col span="3" style="text-align: right; padding-right: 5px;">
                  邮寄地址：
              </Col>
              <Col span="10" >
                  <!-- <Input v-model="item.address" style="width: 100%"></Input> -->
                  <Select v-model="item.addressSel" :transfer="bodyt" style="width:100%">
                      <Option v-for="rem in item.addressList" :value="rem" >{{ rem }}</Option>
                  </Select>
              </Col>
              <!-- <Col span="3">item.emsAddr
                  <Button type="info" @click="printBill(item)" long style="margin-left: 15px;">快递单打印</Button>
              </Col> -->
          </Row>
          <Row v-if="item.sendType === 1"  style="margin-top: 10px;">
              <Col span="3" style="text-align: right; padding-right: 5px">
                  打印快递单：
              </Col>
              <Col span="5">
                  <Select v-model="printType" transfer  style="width:100%">
                      <Option v-for="(pt, key) in printTypes" :value="pt.key" :key="key">{{ pt.name }}</Option>
                  </Select>
              </Col>
              <col><Button type="info" @click.native='printTypeBtn(item)' style="    margin-left: 20px;">打印</Button></col>
            </Row>
          <Row  style="margin-top: 10px;">
            <div style="float: right">
                <!-- <Button v-show="item.print != 0" @click="printSend(item)" type="success" style="margin-right: 16px">打印</Button> -->
                <Checkbox v-model="item.checked" @on-change="checkChange">选中</Checkbox>
            </div>
          </Row>
          </div>
      </Card>
        <div  style="margin: 16px 0; text-align: center">
          <ButtonGroup size="large">
              <Button @click="sendDio" style="width: 100px"  type="success">发送</Button>
              <!-- <Button style="width: 150px" @click="downEMS">下载EMS交接单</Button> -->
          </ButtonGroup>
      </div>
      </Modal>
      <Modal
          v-model="zhuanmodal"
          title="转正式案件"
          width="850"
          :loading="loading"
          @on-ok="submitCa"
          cancel-text="关闭"
          ok-text="确定">
          <div style="margin-top:30px;" >
            <Form  :label-width="100" inline>
                <FormItem label="案件编号:" style="width: 245px;" >
                    <Input v-model="addcaseNo" placeholder="请输入案件编号"></Input>
                </FormItem>
                <FormItem label="案由名称:" style="width: 245px;" >
                    <Select v-model="briefId" filterable transfer placeholder="请选择">
                        <Option v-for="item in bridfList" v-bind:value="item.name">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="承办部门:" style="width: 245px;" >
                    <Select v-model="courtId" filterable transfer placeholder="请选择">
                        <Option v-for="item in courtList" v-bind:value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="承办法官:" style="width: 245px;" >
                    <Select v-model="judgeId" filterable transfer placeholder="请选择">
                        <Option v-for="item in judgeList" v-bind:value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="书记员:" style="width: 245px;" >
                    <Select v-model="clerkId" filterable transfer placeholder="请选择">
                        <Option v-for="item in clerkList" v-bind:value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="立案日期:" style="width: 245px;">
                    <DatePicker type="date" transfer :value="filingDateStr" @on-change="changeDate2"></DatePicker>
                </FormItem>
                <FormItem label="当事人|事由:" style="width: 505px;" >
                    <Input v-model="litigantContent" placeholder="请输入当事人|事由"></Input>
                </FormItem>
                <FormItem label="诉讼费:" style="width: 305px;" >
                    <!-- <Input v-model="payMoney" placeholder="诉讼费（单位元）"  ></Input> -->
                    <input type="text" name="je" v-model="payMoney"  @input="clearNoNum" style="{
    display: inline-block;
    width: 80%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
}" />元 
                </FormItem>
            </Form>
            <div style="margin-top:10px">
                <span style="display:inline-block;width:100px;text-align:right">备注：</span>
                <Input style="width:80%"  v-model="remark" type="textarea" :autosize="{minRows: 3,maxRows: 3}" placeholder="备注"></Input>
            </div>
            <div style="margin-top:10px;margin-left: 30px;width:80%">
                <Upload action="/api/online/audit/diploms/uploadFiles.jhtml" :show-upload-list='false' :on-success="uploadSuccess"  >
                    <Button icon="ios-cloud-upload-outline">上传文书(可多次点击上传)</Button>
                </Upload>
                <div style="display:block;text-align:left;padding-right:5px;">
                    <p style="margin-top:5px" v-for="(item,index) in fileNlist" v-bind:key="index">{{item.name}}<span @click="delUpload(index,item.path)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                </div>
            </div>
        </div>
      </Modal>
       <Modal
            v-model="applyMol"
            :loading="loading"
            width="600px"
            :mask-closable="closeM"
            title="办理撤诉申请">
            <div>
                <Form  :label-width="130" inline>
                    <FormItem label="撤诉理由：" style="width: 505px;">
                        <span>{{applyReason}}</span>
                    </FormItem>
                    <FormItem label="附件：" style="width: 505px;">
                        <span> <a href="javascript:;" @click="modal1 = true;"  style="line-height:33px">撤诉申请书</a> </span>
                        <!-- download="文件名.txt" -->
                    </FormItem>
                    <FormItem label="处理意见：" style="width: 505px;">
                        <RadioGroup v-model="isAgreeApply">
                            <Radio label="1">
                                <span>同意</span>
                            </Radio>
                            <Radio label="2">
                                <span>驳回</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="上传撤诉裁定书：" style="width: 505px;" v-show="isAgreeApply == 1">
                        <Upload action="/api/online/lawCase/uploadWithdrawal.jhtml"  :show-upload-list='false' :on-success="uploadSuccess2"  >
                            <Button icon="ios-cloud-upload-outline">点击这里上传文件</Button>
                        </Upload>
                        <p style="margin-top:5px" v-for="(item,index) in fileNlist2" v-bind:key="index">{{item.name}}</p>
                    </FormItem>
                    <FormItem label="驳回理由：" style="width: 505px;" v-show="isAgreeApply == 2">
                        <Input style="width:100%;"  v-model="rejectReason" type="textarea" :autosize="{minRows: 3,maxRows: 3}" placeholder="理由"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="applyMol = false"  type="dashed" size="large">关闭</Button>
                <Button @click="submitReason"  type="primary" size="large">提交</Button>
            </div>
        </Modal>
      <Modal
            v-model="infoMol"
            cancel-text=""
            :loading="loading"
            ok-text="确定"
            @on-ok=""
            width="700px"
            :mask-closable="closeM"
            title="案件信息">
            <div v-if="infoMol">
                <Tabs  @on-click="changeTab" >
                     <TabPane label="案件信息">
                         <div v-show="caInfo">
                         <Row  style="margin-bottom:20px;margin-top:35px">
                            <Col span="6" style=" padding-right: 5px;text-align: right;">
                                案件类别：
                            </Col>
                            <Col span="6" style=" padding-right: 5px">
                                {{caseInfo.caseType == '' ? "无" : caseInfo.caseType}}
                            </Col>
                            <Col span="4" style=" padding-right: 5px">
                                标的金额：
                            </Col>
                            <Col span="6" style=" padding-right: 5px">
                                {{caseInfo.standardMoney == '' ? 0 : caseInfo.standardMoney}}元
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:20px;margin-top:15px">
                            <Col span="6" style=" padding-right: 5px;text-align: right;">
                                案件案由：
                            </Col>
                            <Col span="18" style=" padding-right: 5px">
                                {{caseInfo.briefName == '' ? "无" : caseInfo.briefName}}
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:5px">
                            <Col span="6" style=" padding-right: 5px;text-align: right;">
                                诉讼请求：
                            </Col>
                            <Col span="16" style=" padding-right: 5px">
                                {{caseInfo.factContent == '' ? "无" : caseInfo.factContent}}
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:5px">
                            <Col span="6" style=" padding-right: 5px;text-align: right;">
                                事实和理由：
                            </Col>
                            <Col span="16" style=" padding-right: 5px">
                                {{caseInfo.reasonContent == '' ? "无" : caseInfo.reasonContent}}
                            </Col>
                        </Row>
                        </div>
                    </TabPane>
                    <TabPane label="当事人信息" >
                        <div>
                            <div v-for="item in liniList">
                                <div class="info matr">
                                    <div class="bmbox" @click="getOneLini(item.id)"><span class="title" >查看详情</span></div>
                                    <p>名称：<span>{{item.name}}</span>（{{item.typeStatus}}）</p>
                                    <p>证件号：<span>{{item.card}}</span></p>
                                    <p>手机号码：<span>{{item.phone}}</span></p>
                                    <p>地址：<span>{{item.adress}}</span></p>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane  label="代理人信息"  >
                        <h5 style="text-align: center;" v-show="lawyerList.length == 0">暂无代理人信息</h5>
                        <div v-for="item in lawyerList">
                            <div class="info matr">
                                <div class="bmbox"  @click="getLaw(item.id)"><span class="title">查看详情</span></div>
                                <p>名称：{{item.name}}</p>
                                <p>证件号：{{item.card}}</p>
                                <p>手机号码：{{item.phone}}</p>
                                <p>地址：{{item.adress}}</p>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane label="附件信息"  >
                         <div style="margin-top:40px" v-show="fileInfo">
                             <Row  style="margin-bottom:5px">
                                <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:15px">
                                    起诉状：
                                </Col>
                                <Col span="18" style=" padding-right: 5px;margin-bottom:15px">
                                    <span v-if="qFileName.name == ''">无</span>
                                    <a v-else  @click="showDipmos(qFileName.path)" download="">{{ qFileName.name }}</a>
                                </Col>
                                <Col span="6" style=" padding-right: 5px;text-align: right;">
                                    身份证明材料：
                                </Col>
                                <Col span="6" style=" padding-right: 5px">
                                    <span v-if="fileName1.name == ''">无</span>
                                    <a v-else  @click="showDipmos(fileName1.path)" download="">{{ fileName1.name }}</a>
                                </Col>
                                <Col span="5" style=" padding-right: 5px;text-align: right;">
                                    授权委托材料：
                                </Col>
                                <Col span="7" style=" padding-right: 5px">
                                    <span v-if="fileName2.name == ''">无</span>
                                    <a v-else  @click="showDipmos(fileName2.path)" download="">{{ fileName2.name }}</a>
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
                                    <a v-else  @click="showDipmos(onlineEAIdShen1)" download="">{{ fileNameShen1 }}</a>
                                </Col>
                                <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    调查取证申请书：
                                </Col>
                                <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen2 == ''">无</span>
                                    <a v-else  @click="showDipmos(onlineEAIdShen2)" download="">{{ fileNameShen2 }}</a>
                                </Col>
                                <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    证据保全申请书：
                                </Col>
                                <Col span="6" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen3 == ''">无</span>
                                    <a v-else  @click="showDipmos(onlineEAIdShen3)" download="">{{ fileNameShen3 }}</a>
                                </Col>
                                <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    证人出庭申请书：
                                </Col>
                                <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen4 == ''">无</span>
                                    <a v-else  @click="showDipmos(onlineEAIdShen2)" download="">{{ fileNameShen4 }}</a>
                                </Col>
                                <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    现场勘验申请书：
                                </Col>
                                <Col span="6" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen5 == ''">无</span>
                                    <a v-else  @click="showDipmos(onlineEAIdShen5)" download="">{{ fileNameShen5 }}</a>
                                </Col>
                                <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    鉴定评估申请书：
                                </Col>
                                <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen6 == ''">无</span>
                                    <a v-else  @click="showDipmos(onlineEAIdShen6)" download="">{{ fileNameShen6 }}</a>
                                </Col>
                            </Row>
                            <div>
                                <p class="sdws">
                                    证据材料：
                                </p>
                                <Table :columns="columnsEvi" :data="EviList"></Table>
                            </div>
                        </div>
                    </TabPane>
                    <!-- <TabPane label="审查意见">
                        <span style="display:inline-block;width:100px;text-align:right">审查意见：</span>   
                        <span>{{auditStatusOld}}</span>
                        <div style="margin-top:10px">
                            <span style="display:inline-block;width:100px;text-align:right">备注：</span>
                            <span>{{remarkOld}}</span>
                        </div>
                    </TabPane> -->
                </Tabs>
            </div>
            <div slot="footer">
                <Button @click="closeInfo"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
        <!-- 当事人信息 -->
        <Modal
            v-model="completeMol"
            :loading="loading"
            width="560px"
            :mask-closable="closeM"
            title="当事人信息">
            <div>
                <Form :model="addFormItem" :label-width="100" inline>
                    <FormItem :label="addFormItem.litigantType == '自然人'? '姓名:' : '公司名称:'" style="width: 505px;">
                        <span>{{addFormItem.litigantName}}</span>
                    </FormItem>
                    <FormItem label="类型:" style="width: 245px;">
                        <span>{{addFormItem.litigantType}}</span>
                    </FormItem>
                    <FormItem label="诉讼地位:" style="width: 245px;">
                        <span>{{addFormItem.litigantStatus}}</span>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '身份证号码:' : '统一信用代码:'" style="width: 245px;">
                        <span>{{addFormItem.identityCard}}</span>
                    </FormItem>
                    <FormItem label="出生日期:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.birthday}}</span>
                    </FormItem>
                    <FormItem label="性别:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.litigantSex}}</span>
                    </FormItem>
                    <FormItem label="国籍:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.nationality}}</span>
                    </FormItem>
                    <FormItem label="民族:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.nation}}</span>
                    </FormItem>
                    <!-- <FormItem label="政治面貌:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.politicalStatus}}</span>
                    </FormItem> -->
                    <FormItem label="文化程度:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.education}}</span>
                    </FormItem>
                    

                    <FormItem label="当事人关系:" style="width: 245px;display:none">
                        <span>{{addFormItem.relationType}}</span>
                    </FormItem>
                    <FormItem label="当事人:" style="width: 245px;display:none">
                        <span>{{addFormItem.litigantName}}</span>
                    </FormItem>
                    
                    <FormItem label="手机号码:" style="width: 245px;" v-show="addFormItem.litigantType != '法人' && addFormItem.litigantType != '非法人组织'">
                        <span>{{addFormItem.litigantPhone}}</span>
                    </FormItem>
                    <!-- <FormItem label="固定电话:" style="width: 245px;">
                        <span>{{addFormItem.litigantTelPhone}}</span>
                    </FormItem>
                    <FormItem label="成立日期:" style="width: 245px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.birthday2}}</span>
                    </FormItem> -->

                    <FormItem v-bind:label="addFormItem.litigantType == '法人' ? '法定代表人:' : '负责人：'" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.legalManName}}</span>
                    </FormItem>
                    <FormItem v-bind:label="addFormItem.litigantType == '法人' ? '职务:' : '职务：'" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.legalManJob}}</span>
                    </FormItem>
                    <!-- <FormItem label="身份证号码：" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.legalManId}}</span>
                    </FormItem>
                    <FormItem label="手机号码：" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.legalManPhone}}</span>
                    </FormItem> -->

                    <FormItem label="工作单位：" style="width: 505px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.employer}}</span>
                    </FormItem>
                    <FormItem label="电子邮箱：" style="width: 505px" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.email}}</span>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '户籍地址：' : '公司注册地址：'" style="width: 505px">
                        <span>{{addFormItem.nativePlace}}</span>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '经常居住地址：' : '公司经营地址：'" style="width: 505px">
                        <span>{{addFormItem.address}}</span>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '确认送达地址：' : '确认送达地址：'" style="width: 505px">
                        <span>{{addFormItem.sendAddress}}</span>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="closeLiti"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
        <!-- 代理人信息 -->
         <Modal
            v-model="lawyerMol"
            :loading="loading"
            width="560px"
            :mask-closable="closeM"
            title="代理人信息">
            <div>
                <Form :model="addFormItem" :label-width="100" inline>
                    <FormItem label="代理人身份:" style="width: 245px;">
                        <span>{{addFormItem.lawerType}}</span>
                    </FormItem>
                    <FormItem label="当事人:" style="width: 245px;">
                        <span>{{addFormItem.name}}</span>
                    </FormItem>
                    <FormItem label="姓名:" style="width: 245px;">
                        <span>{{addFormItem.lawerName}}</span>
                    </FormItem>
                    <FormItem label="电话:" style="width: 245px;">
                        <span>{{addFormItem.lawermobile}}</span>
                    </FormItem>
                     <FormItem label="律所:" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{addFormItem.lawyerOfficeName}}</span>
                    </FormItem>
                    <FormItem label="公民身份证号码:" v-show="lawyerT1" style="width: 505px;">
                        <span>{{addFormItem.lawIdentiCard}}</span>
                    </FormItem>
                    <FormItem label="公民身份证号码:" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{addFormItem.lawIdentiCard2}}</span>
                    </FormItem>
                    <FormItem label="工作证件号码:" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{addFormItem.lawIdentiCard}}</span>
                    </FormItem>
                    <FormItem label="电子邮箱:" style="width: 505px">
                        <span>{{addFormItem.email}}</span>
                    </FormItem>
                    <FormItem label="联系地址:"  style="width: 505px;">
                        <span>{{addFormItem.address}}</span>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="cloaselawyer"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
        <!-- 查看案件文书 -->
        <Modal
            v-model="modal1"
            title="查看案件文书"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <iframe :src="ft_elect_pdfViewer" frameborder="0" width="100%" height="600px"></iframe>
            </div>
            <div slot="footer">
                <Button @click="modal1 = false"   type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
    <Modal
        v-model="yjMol"
        width="560px"
        :mask-closable="closeM"
        title="送达信息">
        <!-- <div v-html="yjcontent">
            
        </div> -->
        <!-- <mySteps :current="2" direction="vertical" v-show="stepList.length > 0">
            <myStep v-for="(item, index) in stepList" :icon="index == 0 ? 'compose' : '' " :status="index == 0 ? 'process' : 'finish'" :title="item.time" :content="item.content" ></myStep>
        </mySteps> -->
        <div v-show="stepList.length > 0">
            <Steps :current="0" direction="vertical">
                <Step v-for="(item, index) in stepList" :title="item.createDate" :content="item.remark" :icon="item.operationFlag"></Step>
                <!-- <Step title="已完成" content="这里是该步骤的描述信息"></Step>
                <Step title="进行中" content="这里是该步骤的描述信息"></Step>
                <Step title="待进行" content="这里是该步骤的描述信息"></Step> -->
            </Steps>
        </div>
        <div v-show="stepList.length == 0" style="text-align: center;color:#999;">
            暂无数据
        </div>
        <div slot="footer"> 
            <Button @click="yjMol = false"  type="dashed" size="large">关闭</Button>
        </div>
    </Modal>
     <!-- 证据查看 -->
    <Modal
        v-model="viewDipmos"
        title="查看"
        :mask-closable="false"
        :styles="{top: '20px'}"
        :width="modalWidth">
        <div class="components-container">
            <zh-viewer :viewerId="'1'" :fileUrls="filePathAry"></zh-viewer>
        </div>
        <div slot="footer">
            <Button @click="viewDipmos = false"   type="dashed" size="large">关闭</Button>
        </div>
    </Modal>
    
    </div>
</template>
<script>
import { findAllCase, buildDiploms,getOneLitigant,getLawyerInfo, 
sendmessage, emailList,getMediatedCase,deliveryDetails,handlingWithdrawal, createWord,sendDiploms,getJudgeBriefCourt,auditOnlineLawCase,printEMS,getOnlineLawCaseEdit,getLitigantInfo,getLitigantLawyerList,otherGetFiles,createEmsExcel,findOnlineCourt,findOnlineBrief,findWorkerNames,downloadExcel,setCase } from "../../api/finanseCase.js";
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import {  addressList,getWithdrawalInfo } from "../../api/templante.js";
import uploadMultiple from '@/components/upload-multiple1';
import { formatDate } from "../../libs/date.js";
import myStep from "@/components/step";
import mySteps from "@/components/steps";
import ZhViewer from "@/components/moreFileViewer/moreFileViewer.vue";
export default {
  components: {
        ClipLoader,
        'upload-multiple': uploadMultiple,
        mySteps: mySteps,
          myStep: myStep,
          ZhViewer
    },
  data() {
      var width = window.innerWidth - 430;
    return {
        modalWidth:width,
        filePathAry:[],
        viewDipmos:false,
        lawCaseIds:[],
        fileNlist:[],
          fileNlistFormData:[],
        createEmsExcelWindow:false,
        createEmsExcel:'',
        value13: '',
        stepList:[],
        yjMol:false,
        ft_elect_pdfViewer:"",
        modal1:false,
        downSrc:"",
        modalWidth:width,
        select1: 'http',
        select2: 'com',
        select3: '引调号',
      sendTypes:[
      "现场领取",
      "EMS送达",
      "工作人员上门送达",
      "电子邮件送达",
      "H5确认阅读"
    ],
    printType:1,
      printTypes:[
          {
              key:1,
              name:"Deli DE-620K"
          },
          {
              key:2,
              name:"EPSON LQ-82KF ESP/P2"
          },
      
    ],
      show1:true,
      addcaseNo:"",
      applyReason:"",
      rejectReason:'',
      applyMol:false,
      fileNlist2:[],
      isAgreeApply:1,
      briefId:"",
      bodyt:true,
      //infomodel
      infoMol:false,
      caseInfo:{
          caseType:"",
          standardMoney:"",
          briefName:"",
          factContent:"",
          reasonContent:"",
      },
      liniList:[],
      lawyerList:[],
      fileInfo:false,
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
      onlineEAIdShen1:"",
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
      auditStatusOld:"",
      remarkOld:"",
      closeM:false,
      caInfo:true,
      completeMol:false,
      lawyerMol:false,
      lawyerT1:false,
      addFormItem:{},
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

      bridfList:[],
      judgeId:"",
      judgeList:[],
      courtId:"",
      courtList:[],
      clerkId:"",
      clerkList:[],
      filingDateStr:"",
      litigantContent:"",
      payMoney:'',
      remark:"",
      zhuanmodal:false,

      OCRModal:false,
      OCRLoading:false,
      uploadOCRIsSuccess: false,
      uploadLitigantIsError:false,
      uploadLitigantIsSuccess:false,
      uploadLitigantIsWarning:false,
      wenmodal:false,
      sendTo: "0",
      lawCaseId:"",
      successList:"",
      fileUploadData:{},
      casesuccessNum:"",
      caseLi:[],
      defendantList:[],
      uploadLitigantMessage:'',
      errorNum:"",
      successNum:'',
      formItem: {
        id: "",
        caseNo:'',
        code:'',
        defendantName:"",
        mediateType:""
      },
      detailModal:false,
      loading:true,
      spinShow: false,
      totalPage: 1,
       pageNumber: 1,

       judgecol: [
           {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
          title: "申请人",
          key: "caseNo",
          align: "center",
        //   fixed: "left",
          width: 130,
          render:(h,params)=>{
            return h('span',{
            },params.row.admin ? params.row.admin.name : '')
        }
        },
        {
          title: "引调号",
          key: "caseNo",
          align: "center",
        //   fixed: "left",
          width: 190
        },
        {
          title: "回执编号",
          key: "code",
          align: "center",
          width: 150
        },
        {
          title: "案号",
          key: "caseNo2",
          align: "center",
          width: 180
        },
        {
          title: "原告",
          key: "plaimInfo",
          align: "center",
          width: 150
        },
        {
          title: "被告",
          key: "defendantInfo",
          align: "center",
          width: 150
        },
        {
          title: "案由",
          key: "onlineBrief",
          align: "center",
          width: 150,
        },
        {
            title: "案件状态",
            key: "mediateType",
            align: "center",
            width: 150,
            render:(h,params)=>{
                return h('span',{
                    style:{
                        color: (params.row.mediateType=='文书生成中')?"#000":(params.row.mediateType=='文书送达中'?"#009900":(params.row.mediateType=='已正式立案'?"#E53333":"#003399"))
                    }
                },params.row.mediateType)
            }
        },
        {
          title: "标的（元）",
          key: "standardMoney",
          align: "center",
          width: 125,
        },
       
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 300,
          render: (h, params) => {
            return h("div", [
                h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  class: [
                        "littleBtn",
                    ],
                  on: {
                    click: () => {
                        this.liniList = [];
                        this.lawyerList = [];
                        this.lawcaseId = params.row.id;
                        getOnlineLawCaseEdit(this.lawcaseId).then(res => {
                            if(res.data.state == 100){
                                    this.caseInfo.caseType =  res.data.result.type == 1 ? "民商案件" : "执行案件";
                                    this.caseInfo.standardMoney = res.data.result.standardMoney;
                                    // this.caseInfo.mediateType = res.data.result.mediateType;
                                    this.caseInfo.briefName =res.data.result.onlineBrief  ? res.data.result.onlineBrief.name : '';

                                    this.caseInfo.factContent = res.data.result.factContent;
                                    this.caseInfo.reasonContent = res.data.result.reasonContent;
                                    this.caInfo = true;
                                    this.infoMol = true;
                            }else{
                                this.$Message.info(res.data.message)
                            }
                            
                        })
                    }
                  }
                },
                "查看信息"
              ),
            //   h(
            //     "Button",
            //     {
            //       props: {
            //         type: "text",
            //         size: "small"
            //       },
            //       class: [
            //             "littleBtn",
            //         ],
            //       on: {
            //         click: () => {
            //           createWord(params.row.id).then(res => {
            //             if(res.data.state == 100){
            //               this.$Message.loading({
            //                   content: '文书生成中，请稍候',
            //                   duration: 2, // 给后台一点生成pdf文件的时间
            //                   onClose: () => {
            //                       window.open(res.data.pathList[0]);
            //                   }
            //               });
            //             }
            //           })
            //         }
            //       }
            //     },
            //     "生成告知书"
            //   ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  class: [
                        "littleBtn",
                    ],
                  on: {
                    click: () => {
                      this.defendantList = params.row.defendantList;
                      this.lawCaseId = params.row.id;
                      
                      this.wenmodal = true;
                      for(let i in this.defendantList){
                          let el = this.defendantList[i]
                          let ary = [];
                          el.addressList=[];
                          for(let y in el.onlineLitigantAddresses){
                              ary.push(el.onlineLitigantAddresses[y].address)
                          }
                          if(el.address != null &&
                            el.address != ""){
                              ary.push(el.address)
                          }
                          if(el.sendAddress != null &&
                            el.sendAddress != ""){
                              ary.push(el.sendAddress)
                          }
                          if(el.nativePlace != null &&
                            el.nativePlace != ""){
                              ary.push(el.nativePlace)
                          }
                          el.addressList = this.uniq(ary);

                      }
                    }
                  }
                },
                "生成并发送告知书"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  class: [
                        "littleBtn",
                    ],
                  on: {
                    click: () => {
                      deliveryDetails(params.row.id).then(res => {
                          if(res.data.state == 100){
                              this.$Message.success(res.data.message);
                              console.log(res.data.MsgList)
                              this.stepList = [];
                              res.data.msgList.map(item => {
                                  let data = {
                                      createDate:formatDate(new Date(item.createDate), 'yyyy-MM-dd hh:mm:ss'),
                                      operationFlag:item.operationFlag === 2 ? 'eye' :(item.operationFlag ? "paper-airplane" : "clipboard" ),
                                      remark:item.remark,
                                  }
                                  this.stepList.push(data)
                              })
                            //   this.stepList
                              console.log(this.stepList)
                              this.yjMol = true;
                          }else{
                              this.$Message.info(res.data.message);
                          }
                      })
                    }
                  }
                },
                "送达详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  class: [
                        "littleBtn",
                    ],
                    style:{
                        display: params.row.mediateType=='撤诉申请中'?'':'none'
                    },
                  on: {
                    click: () => {
                        // 
                        this.fileNlist2 = [];
                        this.rejectReason = "";
                        this.lawCaseId = params.row.id;
                        getWithdrawalInfo(params.row.caseNo).then(res => {
                            if(res.data.state == 100){
                                this.applyReason = res.data.reason;
                                let Envpro = location.protocol;
                                let EnvdoName = location.host;
                                let requestUrl = Envpro+'//'+EnvdoName
                                this.ft_elect_pdfViewer =requestUrl +  res.data.withdrawal;
                                this.applyMol = true;
                                // this.modal1 = true;
                            }else{
                                this.$Message.info(res.data.message);
                            }
                        })

                    }
                  }
                },
                "撤诉办理"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  class: [
                        "littleBtn",
                    ],
                    style:{
                        display: params.row.mediateType=='已正式立案'?'none':''
                    },
                  on: {
                    click: () => {
                        this.lawCaseId = params.row.id;
                        this.litigantContent = '原告' + params.row.plaimInfo + '与被告' + params.row.defendantInfo;
                        this.addcaseNo="";
                        this.briefId="";
                        this.courtId='';
                        this.judgeId='';
                        this.clerkId='';
                        this.filingDateStr='';
                        this.payMoney=''
                        this.remark = "";
                      this.zhuanmodal = true;
                      this.payMoney=''

                    }
                  }
                },
                "转正式案件"
              ),
              
            ]);
          }
        }
        
      ],
      casedata: [],
    };
  },
  mounted() {
    this.getList(1);
    this.getBList();
    
  },
  methods: {
      showDipmos(path){
        this.filePathAry = [];
        this.filePathAry.push(path);
        console.log(this.filePathAry)
        this.viewDipmos = true;
    },
      getFile(event){
            this.fileNlist = [];
            this.file = event.target.files[0];
            uploadFiles(this.file).then(res => {
                if(res.data.state == 100){
                    this.$Message.success('上传成功');
                    var datas = {
                        name:this.file.name,
                        id:res.data.evident.id
                    }
                    this.fileNlist.push(datas);
                }else{
                    this.$Message.info(res.data.message);
                }
            })
        },
        uploadSuccess(res,file){
            if (res.state==100) {
                this.$Message.success('上传成功');
                    var datas = {
                        name:file.name,
                        path:res.filePath
                    }
                    this.fileNlist.push(datas);
                    this.fileNlistFormData.push(res.filePath)
            }else{
                    this.$Message.info(res.data.message);
                }
        },
        delUpload(item,delePath){
            this.fileNlist.splice(item,1)
            this.fileNlistFormData.splice(item,1)
            delFiles(delePath).then(res=>{
                if (res.data.state==100) {
                    this.$Message.success('删除成功');
                }else{
                    this.$Message.info(res.data.message);
                }
            })

        },
        inCaseInfo(){
            if(this.lawCaseIds.length == 0){
                this.$Message.warning('请选择案件！');
                return false;
            }
            let showcaseId=this.lawCaseIds.join(",")
            setCase(showcaseId).then(res=>{
                if (res.data.state==100) {
                    // this.createEmsExcelWindow=false
                    this.$Message.success(res.data.message);
                    this.getList()
                }else{
                    this.$Message.info(res.data.message);
                }
            })
        },
        showCaseInfo(){
            if(this.lawCaseIds.length == 0){
                this.$Message.warning('请选择案件！');
                return false;
            }
            let showcaseId=this.lawCaseIds.join(",")
            downloadExcel(showcaseId).then(res=>{
                if (res.data.state==100) {
                    // this.createEmsExcelWindow=false
                    this.$Message.loading({
                        content: '案件信息表生成中，请稍候',
                        duration: 1, // 按照文书数量给后台一点生成pdf文件的时间
                        onClose: () => {
                            window.open("/"+res.data.data);
                        }
                    });
                }else{
                    this.$Message.info(res.data.message);
                }
            })
        },
      okcreateEmsExcel(){

          if (this.createEmsExcel=='') {
              this.$Message.info('快递单号不能为空');
            //   this.createEmsExcelWindow=true
          }else{
            createEmsExcel(this.createEmsExcel).then(res=>{
                if (res.data.state==100) {
                    this.createEmsExcelWindow=false
                    this.$Message.loading({
                        content: '快递单生成中，请稍候',
                        duration: 1, // 按照文书数量给后台一点生成pdf文件的时间
                        onClose: () => {
                            window.open(res.data.path);
                        }
                    });
                }else{
                    this.$Message.info(res.data.message);
                }
            })
          }

      },
      search(){
          this.getList(1)
      },
      uniq(array){
        var temp = {}, r = [], len = array.length, val, type;
        for (var i = 0; i < len; i++) {
            val = array[i];
            type = typeof val;
            if (!temp[val]) {
                temp[val] = [type];
                r.push(val);
            } else if (temp[val].indexOf(type) < 0) {
                temp[val].push(type);
                r.push(val);
            }
        }
        return r;
    },
      clearNoNum(e){  
        // 通过正则过滤小数点后两位
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null

        this.payMoney=e.target.value

        },
      closeLiti(){
          this.completeMol = false;
      },
      changeyyyy(t){
          console.log(t)
      },
      cloaselawyer(){
          this.lawyerMol = false;
      },
      clearAddfortem(){
            this.addFormItem.politicalStatus='';
            this.addFormItem.nationality='';
            this.addFormItem.education='';
            this.addFormItem.litigantName= '';
            this.addFormItem.onlineLitigantId= '';            
            this.addFormItem.litigantSex= '';
            this.addFormItem.litigantType= '自然人';
            this.addFormItem.litigantStatus='原告';
            this.addFormItem.employer= '';
            this.addFormItem.identityCard= '';
            this.addFormItem.nation= '';
            this.addFormItem.litigantPhone= '';
            this.addFormItem.litigantTelPhone= '';
            this.addFormItem.birthday= '';
            this.addFormItem.birthday2= '';
            this.addFormItem.email= '';
            this.addFormItem.nativePlace= '';
            this.addFormItem.address= '';
            this.addFormItem.legalManName= '';
            this.addFormItem.lawIdentiCard2= '';            
            this.addFormItem.legalManPhone= '';
            this.addFormItem.legalManId= '';
            this.addFormItem.sendAddress= '';
            this.addFormItem.agentId= '';
            this.addFormItem.lawerType= '';
            this.addFormItem.lawerName= '';
            this.addFormItem.lawermobile= '';
            this.addFormItem.lawIdentiCard= '';
            this.addFormItem.lawerNum= '';
            this.addFormItem.lawFirm= '';
            this.addFormItem.relationType= '';
            this.addFormItem.relationLitigantId= '';
            this.addFormItem.agentId1= "";
            this.addFormItem.lawerType1= "";
            this.addFormItem.lawerName1= "";
            this.addFormItem.lawermobile1= "";
            this.addFormItem.lawIdentiCard1= "";
            this.addFormItem.lawerNum1= ""
        },
      getOneLini(id){
          getOneLitigant(id).then(res => {
            if(res.data.state == 100){
                this.addFormItem.politicalStatus=res.data.onlineLitigant.politicalStatus;
                this.addFormItem.nationality=res.data.onlineLitigant.nationality;
                this.addFormItem.education=res.data.onlineLitigant.education;
                this.addFormItem.litigantName= res.data.onlineLitigant.litigantName;           
                this.addFormItem.litigantSex= res.data.onlineLitigant.litigantSex == 1 ? "女" : "男";
                this.addFormItem.litigantType= res.data.onlineLitigant.litigantType == 0 ? "自然人" : (res.data.onlineLitigant.litigantType == 1 ?  "法人" : "非法人组织");
                this.addFormItem.litigantStatus=res.data.onlineLitigant.litigationStatus.name;
                this.addFormItem.employer= res.data.onlineLitigant.employer;
                this.addFormItem.identityCard= res.data.onlineLitigant.identityCard;
                this.addFormItem.nation= res.data.onlineLitigant.nation;
                this.addFormItem.legalManJob = res.data.onlineLitigant.legalManJob ? res.data.onlineLitigant.legalManJob : "";
                this.addFormItem.litigantPhone= res.data.onlineLitigant.litigantPhone;
                this.addFormItem.litigantTelPhone= res.data.onlineLitigant.litigantTelPhone;
                this.addFormItem.birthday= formatDate(new Date(res.data.onlineLitigant.birthday), 'yyyy-MM-dd');
                this.addFormItem.birthday2= formatDate(new Date(res.data.onlineLitigant.birthday), 'yyyy-MM-dd');
                this.addFormItem.email= res.data.onlineLitigant.email;
                this.addFormItem.nativePlace= res.data.onlineLitigant.nativePlace;
                this.addFormItem.address= res.data.onlineLitigant.address;
                this.addFormItem.legalManName= res.data.onlineLitigant.legalManName;           
                this.addFormItem.legalManPhone= res.data.onlineLitigant.legalManPhone;
                this.addFormItem.legalManId= res.data.onlineLitigant.legalManId;
                this.addFormItem.sendAddress= res.data.onlineLitigant.sendAddress;
                this.completeMol = true;
            }else{
                this.$Message.info(res.data.message);
            }
        })
      },
      getLaw(id){
          this.clearAddfortem();
            getLawyerInfo(id).then(res => {
                if(res.data.state == 100){
                    this.addFormItem.name = res.data.onlineLitigant.litigantName;
                    this.addFormItem.lawerType= res.data.onlineLawyer.type;
                    if(res.data.onlineLawyer.type == 1){
                        this.addFormItem.lawerType = "律师";
                        this.lawyerT1 = false;
                    }else if(res.data.onlineLawyer.type == 2){
                        this.addFormItem.lawerType = "法律工作者";
                        this.lawyerT1 = false;
                    }else if(res.data.onlineLawyer.type == 3){
                        this.addFormItem.lawerType = "单位工作人员";
                        this.lawyerT1 = true;
                    }else if(res.data.onlineLawyer.type == 4){
                        this.addFormItem.lawerType = "近亲属";
                        this.lawyerT1 = true;
                    }else if(res.data.onlineLawyer.type == 5){
                        this.addFormItem.lawerType = "公民";
                        this.lawyerT1 = true;
                    }
                    this.addFormItem.lawerName= res.data.onlineLawyer.name;
                    this.addFormItem.lawermobile= res.data.onlineLawyer.phone;
                    this.addFormItem.email = res.data.onlineLawyer.email;
                    this.addFormItem.lawyerOfficeName  = res.data.onlineLawyer.lawyerOfficeName ? res.data.onlineLawyer.lawyerOfficeName : "";
                    this.addFormItem.lawIdentiCard= res.data.onlineLawyer.identicard;
                    this.addFormItem.lawIdentiCard2= res.data.onlineLawyer.identicard;
                    this.addFormItem.lawerNum = res.data.onlineLawyer.lawyerIdcard;
                    this.addFormItem.address = res.data.onlineLawyer.address;
                    this.lawyerMol = true;
                }else{
                    this.$Message.info(res.data.message);
                }
            })
      },
      changeTab(e){
        if(e == 0){
            if(this.caInfo == false){
                this.caInfo = true;
            }
        }else if(e == 1){ //当事人信息
            this.caInfo = false;
            if(this.liniList.length  != 0){
                return false;
            }
            this.liniList = [];
            getLitigantInfo(this.lawcaseId).then(res => {
                if(res.data.state == 100){
                    res.data.result.map(item => {
                        const data={
                            name:item.litigantName,
                            type:item.litigantType==0 ? "原告" : (item.litigantType==1 ? "被告" : "第三人"),
                            typeStatus:item.litigationStatus.name,
                            card:item.identityCard,
                            phone:item.litigantPhone,
                            adress:item.nativePlace,
                            id:item.id,
                        }
                        this.liniList.push(data);
                    }); 
                }
            })
        }else if (e == 2){  //代理人
            this.caInfo = false;
            if(this.lawyerList.length  != 0){
                return false;
            }
            this.lawyerList = [];
            getLitigantLawyerList(this.lawcaseId).then( res=>{
                if(res.data.state == 100){
                    res.data.result.map(item => {
                        const data={
                            name:item.name,
                            card:item.identicard,
                            phone:item.phone,
                            adress:item.address,
                            id:item.id,
                        }
                        this.lawyerList.push(data);
                    });
                }
            })
        }else if(e == 3){   //附件信息
            if(this.fileInfo == false){
                this.fileInfo = true;
            }
            this.caInfo = false;
            otherGetFiles(this.lawcaseId).then(res => {
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
                });
            }else if(e == 4){
                this.caInfo = false;
                this.fileInfo = false;
            }
        })
        }
      },
      closeInfo(){
          this.infoMol = false;
      },
      printTypeBtn(item){
        // let params ={
        //     litigantType:item.litigantType,
        //     lawCaseId:item.id,
        //     litigantName:item.litigantName,
        //     address:item.emsAddr,
        //     litigantPhone:item.litigantPhone,
        //     legalManName:item.legalManName,
        //     legalManPhone:item.legalManPhone,
        //     printType:this.printType
        // }
        
        printEMS(item.litigantType,this.lawCaseId,item.litigantName,item.addressSel,item.litigantPhone,item.legalManName,item.legalManPhone,this.printType).then(res => {
            if(res.data.state == 100){
                this.$Message.success('打印成功');
                window.open("/" + res.data.html);
            }else{
                this.$Message.info(res.data.message);
            }
        })
      },
    radioChange(){
       var key = this.sendTo;
       switch (key) {
          case "0":
          this.defendantList.forEach(el => {
            el.checked = false;
          });
          break;
          case "3":
          this.defendantList.forEach(el => {
            el.checked = true;
          });
          break;
       }
    },
    submitReason(){
        let path = '';
        if(this.isAgreeApply == 1){
            if(this.fileNlist2.length == 0){
                this.$Message.info('请上传撤诉裁定书');
                return false;
            }else{
                path = this.fileNlist2[0].path
            }
        }
        this.loading = true;
        handlingWithdrawal(this.isAgreeApply,path,this.rejectReason,this.lawCaseId).then(res => {
            this.loading = false;
            if(res.data.state == 100){
                this.$Message.success(res.data.message);
                this.applyMol = false;
                this.getList(1);
            }else{
                this.$Message.info(res.data.message);
            }
        })
    },
    changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
    submitCa(){
        if (this.payMoney=="") {
            this.changeLoading();
            this.$Message.info('诉讼费不能为空');
                return false;
        }
        var params ={
            onlineLawCaseId:this.lawCaseId,
            auditStatus:1,
            remark:this.remark,
            caseNo:this.addcaseNo,
            briefId:this.briefId,
            courtId:this.courtId,
            judgeId:this.judgeId,
            clerkId:this.clerkId,
            filingDate:this.filingDateStr,
            litigantContent:this.litigantContent,
            payMoney:parseInt(this.payMoney*100),
            files:this.fileNlistFormData
        }
        auditOnlineLawCase(params).then(res => {
            if(res.data.state == 100){
                this.$Message.success('提交成功');
                this.zhuanmodal = false;
                 this.changeLoading();
            }else{
                this.$Message.info(res.data.message);
                 this.changeLoading();
            }
        })
    },
    getBList(){
        this.bridfList=[];
        this.courtList=[];
        this.judgeList=[];
        this.clerkList=[];
        getJudgeBriefCourt().then(res => {
            if(res.data.state == 100){
                // res.data.briefList.map(item => {
                //     const data = {
                //         id:item.id,
                //         name:item.name,
                //     }
                //     this.bridfList.push(data);
                //     this.briefId = this.briefName;
                // })
                // res.data.clerkList.map(item => {
                //     const data1 = {
                //         id:item.id,
                //         name:item.name,
                //     }
                //     this.clerkList.push(data1);
                // })
                
                // res.data.judgeList.map(item => {
                //     const data3 = {
                //         id:item.id,
                //         name:item.name,
                //     }
                //     this.judgeList.push(data3);
                // })
            }
        })
        findWorkerNames('',1).then(res => {
            res.data.resul.map(item => {
                const data1 = {
                    id:item.id,
                    name:item.name,
                }
                this.clerkList.push(data1);
            })
        })
        findWorkerNames('',0).then(res => {

            res.data.resul.map(item => {
                const data3 = {
                    id:item.id,
                    name:item.name,
                }
                this.judgeList.push(data3);
            })
        })
        findOnlineCourt().then(res => {
            res.data.resul.map(item => {
                const data2 = {
                    id:item.id,
                    name:item.name,
                }
                this.courtList.push(data2);
            })
        })
        findOnlineBrief().then(res => {
            res.data.resul.map(item => {
                const data = {
                    id:item.id,
                    name:item.name,
                }
                this.bridfList.push(data);
                this.briefId = this.briefName;
            })
        })
    },
    uploadSuccess2(res,file){
        if (res.state==100) {
            this.$Message.success('上传成功');
                var datas = {
                    name:file.name,
                    path:res.file
                }
                this.fileNlist2.push(datas);
        }else{
            this.$Message.info(res.message);
        }
    },
    sendDio(){
      var fileds = [];
      for (let i = 0; i < this.defendantList.length; i++){
        const el = this.defendantList[i];
        let litigantPhoneSure=''
        
        if (el.checked === true) {
          var q = "'";
          if (el.legalManPhone) {
            litigantPhoneSure=el.legalManPhone
        }else{
            litigantPhoneSure=el.litigantPhone
        }
          var str =
          
          (el.litigantName || "") +
            q +
          (this.sendTypes[el.sendType] || "") +
            q +
          (el.oddNumbers || "") +
            q +
          (el.addressSel || "") +
            q +
          (litigantPhoneSure || "") +
            q +
          (el.email || "") 
          fileds.push(str);
        }
      }
      sendDiploms(this.lawCaseId,this.lawCaseId,fileds)
      .then(res => {
        if(res.data.state == 100){
          res.data.message=res.data.message.replace("等待确认领取","");
        this.$Message.success(res.data.message);
        this.$Message.loading({
            content: '文书生成中，请稍候',
            duration: 2, // 给后台一点生成pdf文件的时间
            onClose: () => {
                window.open(res.data.pdfAddress[0]);
            }
        });
      }else{
        this.$Message.info(res.data.message);
      }
        
      })
    },
    checkChange(e){
        if (e==true) {
            var count=0
               for(let i=0;i<this.defendantList.length;i++){
                   if (this.defendantList[i].checked==true) {
                       count++
                   }
               }
               if (count==this.defendantList.length) {
                   this.sendTo='3'
               }else{
                   this.sendTo='0'
               }
        }else{
               
                   this.sendTo='0'
               
        }
               
    //    switch (key) {
    //       case "0":
    //       this.defendantList.forEach(el => {
    //         el.checked = false;
    //       });
    //       break;
    //       case "3":
    //       this.defendantList.forEach(el => {
    //         el.checked = true;
    //       });
    //       break;
    //    }
    },
    printBill(){

    },
    showType(id,sendType){
      if(sendType == 3){
        emailList(this.lawCaseId,id).then(res => {
          if (res.data.state === 100){
            for(var i=0;i<this.defendantList.length;i++){
              if(this.defendantList[i].id == id){
                this.defendantList[i].emailListArr = res.data.result.content;
              }
            }
          }
        })
      }
      
    },

    
    asyncOK(){
      this.getList(1);
    },
    tableCheck(c){
              var arr = [];

      for (let i = 0; i < c.length; i++) {
        const el = c[i];
        arr.push(el.id);
      }

      this.lawCaseIds = arr;
    },
    clean(){
        this.formItem = {
        id: "",
        caseNo:'',
        code:'',
        defendantName:"",
        mediateType:""
      }
      this.getList(1);
    },
    changePage(num){
      this.getList(num);
    },
    changeDate2(date){
        this.filingDateStr = new Date(date).getTime();
    },
    onOkF(){

    },
    getList(page) {
        var that = this;
        let params={
            pageNumber: page,
            pageSize: 10,
            caseNo:this.formItem.caseNo,
            code:this.formItem.code,
            defendantName:this.formItem.defendantName,
            mediateType:this.formItem.mediateType
        
        }
        // if (this.select3=='引调号') {
        //     params.caseNo=this.value13
        // }else if(this.select3=='回执编号'){
        //     params.code=this.value13
        // }else if(this.select3=='当事人'){
        //     params.defendantName=this.value13
        // }
      this.casedata = [];
      getMediatedCase(params)
        .then(res => {
          var data = res.data;
          if (data.state === 100) {
            res.data.result.content.map((item,dex) => {
                let mediateContent=''
                if (item.mediateType==1) {
                    mediateContent='文书生成中'
                }else if (item.mediateType==2) {
                    mediateContent='文书送达中'
                }else if (item.mediateType==3) {
                    mediateContent='诉前调解中'
                }else if (item.mediateType==4) {
                    mediateContent='已正式立案'
                }else if(item.mediateType==5){
                     mediateContent='委派调解中'
                }else if(item.mediateType==6){
                     mediateContent='撤诉申请中'
                }else if(item.mediateType==7){
                     mediateContent='已撤诉'
                }else if(item.mediateType==8){
                     mediateContent='驳回撤诉'
                }
              let objectData = {
                id: item.id,
                code:item.code, //回执编号
                caseNo: item.caseNo, //引调号号
                standardMoney:item.standardMoney, //标的
                onlineBrief:item.onlineBrief ? item.onlineBrief.name : "", //案由
                mediateType:mediateContent,
                defendantList:[],
                defendantInfo:"",
                plaimInfo:"",
                admin:item.admin,
                caseNo2:res.data.caseNoList[dex]
              };
              let str1 = '';
              let str2 = '';
              item.onlineLitigants.map(i => {
                   if(i.litigationStatus.name == '被告'&&i.enable==true){
                       objectData.defendantList.push(i);
                       str1 = str1 + i.litigantName + "、";
                   }else if(i.litigationStatus.name == '原告'&&i.enable==true) {
                       str2 = str2 + i.litigantName + "、";
                   }
             })
            //  ;
            if (str1.substring(0,str1.length-1)) {
                objectData.defendantInfo = str1.substring(0,str1.length-1)
            }else{
                objectData.defendantInfo = '无'
            }
             objectData.plaimInfo = str2.substring(0,str2.length-1);
              this.casedata.push(objectData);
            });
            that.totalPage = data.result.totalPages;
          } else {
            that.$Message.info(data.message);
          }
        })
        .catch(() => {
          that.$Message.error("网络错误, 查询案件列表失败");
        });
    },
  }
};
</script>
<style>
.ivu-input-group {
    display: table;
    /* width: 50%; */
    border-collapse: separate;
    position: relative;
    font-size: 12px;
    top: -5px;
}
.ivu-col-span-3 {
    display: block;
    /* width: 50%; */
}
.littleBtn{
    padding: 2px 3px;
}
 .matr {
    width: 135px;
    height: 150px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 10px;
    margin: 10px;
    float: left;
}
.info{
    font-size: 0.2rem;
    color: #000;
    overflow:hidden; 
    word-wrap:break-word;
    text-align: left;
    position: relative;
    padding: 5px;
}
.info:before{
    content: "";
    width: 0;
    height: 100%;
    background: #000;
    padding: 14px 18px;
    position: absolute;
    top: 0;
    left: 50%;
    opacity: 0;
    transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
}
.info:hover:before{
    width: 100%;
    left: 0;
    opacity: 0.5;
}
.bmbox{
     width: 100%;
    padding: 14px 18px;
    color: #fff;
    position: absolute;
    top: 38%;
    left: 0;
    text-align: center;
    cursor: pointer;
}
.bmbox .title{
    opacity: 0;
}
.info:hover .title,
.info:hover .post{
    opacity: 1;
    transition-delay: 0.7s;
}
.ivu-table-cell b{
    background-image:url('../../images/download.png');
    background-size: 100% 100%; 
    display:inline-block;
    cursor: pointer;
    height: 30px;
    width:30px;
}
.sdws{
    display: block;
    text-align: left;
    line-height: 40px;
    padding-left: 10px;
    /* border-top:1px solid #dddee1;
    border-left:1px solid #dddee1;
    border-right:1px solid #dddee1; */
}
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
    }
        .vertical-center-modal .ivu-modal{

        
            top: 0;
        
    }
    .ivu-select-dropdown-list {
    max-height: 250px;
    overflow: visible;
}
</style>
