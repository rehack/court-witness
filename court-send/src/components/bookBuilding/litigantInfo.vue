<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                {{ this.title }}
                <span class="right-btn" @click="add">
                    <Icon type="ios-plus-empty" style="margin-right:3px;" />添加</span>
            </p>
            <div v-show="this.caseLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index: 99;background: rgba(255,255,255,0.5)">
                <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px" color="#40a9ff" size="60px" />
            </div>
            <Table :columns="columns" :data="this.data"></Table>
            <div class="maininfo-col-label" style="display:inline-block;padding:10px;margin:10px;">当事人关系：</div>
            <template v-if="this.data.length>1"> <button type="button" class="ivu-btn ivu-btn-ghost"  @click="addLitigantRelation">添加</button> </template>
             <Table :columns="columns1"  :data="this.relation" width="100%"></Table>
             
        </Card>
        <Modal :title="this.type === 'plaintiff' ? this.litigantId != '' ? '修改原告' : '添加原告' : this.type === 'defendant' ? this.litigantId != '' ? '修改被告' : '添加被告' : this.litigantId != '' ? '修改第三人' : '添加第三人'" v-model="showAdd" width="546px" :loading="loading" ok-text="提交" @on-ok="submit" :mask-closable="false">
            <div>
                <Form :model="addFormItem" :label-width="100" inline>
                    <FormItem label="类型" style="width: 245px;">
                        <Select v-model="addFormItem.litigantType" transfer placeholder="请选择">
                            <Option value="自然人">自然人</Option>
                            <Option value="法人">法人</Option>
                            <Option value="非法人组织">非法人组织</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人'? '姓名' : '公司名称'" style="width: 505px;">
                        <!-- <Input v-model="addFormItem.litigantName" placeholder="请输入当事人"></Input> -->
                        <!-- <Select v-model="addFormItem.litigantName" placeholder="请选择案件" @on-change="selectLitiName" filterable remote :remote-method="acsearLiti" :loading="loading1">
                            <Option v-for="(item, key) in litigantData" :value="item.name" :key="key">{{ item.name + '(' + item.id + ")" }}</Option>
                            
                        </Select> -->
                        <!-- <AutoComplete v-model="addFormItem.litigantName" :data="litigantData" @on-search="acsearLiti" @on-select="selectLitiName" @on-blur="blurName" placeholder="请输入当事人" transfer></AutoComplete> -->
                        <Input v-model="addFormItem.litigantName" @on-focus="acsearLiti" @on-change="acsearLiti" @on-blur="changelss"  placeholder="请输入代理人一姓名"></Input>
                        <ul v-show="litigantData.length > 0" class="ivu-select-dropdown-list downSel"> 
                            <li class="ivu-select-item" v-for="item in litigantData" @click="selectLitiName(item)"> {{item}}</li>
                        </ul>
                    </FormItem>
                    
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '身份证号码' : '统一信用代码'" style="width: 245px;">
                        <Input v-model="addFormItem.identityCard" @on-blur="idCardtoBirth" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem label="性别" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <Select v-model="addFormItem.litigantSex" transfer placeholder="请选择">
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="出生日期" style="width: 245px !important;" v-show="addFormItem.litigantType == '自然人'">
                        <DatePicker type="date" transfer :value="addFormItem.birthday" @on-change="changeDate"></DatePicker>
                    </FormItem>
                    
                    <FormItem label="当事人关系" style="width: 245px;display:none">
                        <Select v-model="addFormItem.relationType" transfer placeholder="请选择">
                            <Option value="0">无</Option>
                            <Option value="1">夫妻</Option>
                            <Option value="2">同住成员家属</Option>
                            <Option value="3">其他</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="当事人" style="width: 245px;display:none">
                        <Select v-model="addFormItem.relationLitigantId" transfer placeholder="请选择">
                            <Option v-for="item in this.data" :value="item.id" :key="item.litigantName">{{ item.litigantName }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="民族" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <Input v-model="addFormItem.nation" placeholder="请输入民族" width="100px;"></Input>
                    </FormItem>
                    <FormItem label="手机号码" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <!-- <Input v-model="addFormItem.litigantPhone" placeholder="请输入手机号码" @input="clearNoNum"></Input> -->
                        <input type="text" name="je" v-model="addFormItem.litigantPhone"  @input="clearNoNum" style="{
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
}" />
                        <div style="color: #ed3f14;position:absolute;top:28px;left:5px;">多个手机号码请用逗号分隔</div>
                    </FormItem>
                    <FormItem label="固定电话" style="width: 245px;">
                        <Input v-model="addFormItem.litigantTelPhone" placeholder="请输入固定电话"></Input>
                    </FormItem>

                    <FormItem v-bind:label="addFormItem.litigantType == '法人' ? '法定代表人' : '负责人'" style="width: 245px;" v-show="addFormItem.litigantType != '自然人'">
                        <Input v-model="addFormItem.legalManName" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人姓名' : '请输入负责人姓名'" width="100px;"></Input>
                    </FormItem>
                    <FormItem label="身份证号码" style="width: 245px;" v-show="addFormItem.litigantType != '自然人'">
                        <Input v-model="addFormItem.legalManId" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人身份证号码' : '请输入负责人身份证号码'" width="100px;"></Input>
                    </FormItem>
                    <FormItem label="手机号码" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <Input v-model="addFormItem.legalManPhone" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人手机号码' : '请输入负责人手机号码'"></Input>
                    </FormItem>

                    <FormItem label="工作单位" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <Input v-model="addFormItem.employer" placeholder="请输入工作单位"></Input>
                    </FormItem>
                    <FormItem label="电子邮箱" style="width: 505px">
                        <Input v-model="addFormItem.email" placeholder="请输入电子邮箱"></Input>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '户籍地址' : '公司注册地址'" style="width: 505px">
                        <Input v-model="addFormItem.nativePlace" placeholder="请输入户籍地址"></Input>
                    </FormItem>
                    <FormItem label="备注" style="width: 505px">
                        <Input v-model="addFormItem.nativePlaceRemark" placeholder="请输入地址备注"></Input>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '经常居住地址' : '公司经营地址'" style="width: 505px">
                        <Input v-model="addFormItem.address" placeholder="请输入经常居住地址"></Input>
                    </FormItem>
                    <FormItem label="备注" style="width: 505px">
                        <Input v-model="addFormItem.addressRemark" placeholder="请地址备注"></Input>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '送达地址' : '确认公司经营地址'" style="width: 505px">
                        <Input v-model="addFormItem.sendAddress" placeholder="请输入送达地址"></Input>
                    </FormItem>
                    <FormItem label="备注" style="width: 505px">
                        <Input v-model="addFormItem.sendAddressRemark" placeholder="请输入地址备注"></Input>
                    </FormItem>
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
                        <div class="adds" @click="addAdress" style="text-align:center">
                            <Icon type="plus-round"></Icon>
                            <p>添加其他地址</p>
                        </div>
                    </FormItem>
                    
                    <div v-show="lawyerAdd1">
                    <FormItem label="代理人一身份" style="width: 505px;">
                        <Select v-model="addFormItem.lawerType" transfer @on-change="changeType" placeholder="请选择">
                            <Option v-for="item in lawerType" :value="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="姓名" style="width: 245px;" >
                        <!-- <Input v-model="addFormItem.lawerName" placeholder="请输入代理人一姓名"  width="100px;"></Input> -->
                        <!-- <AutoComplete v-model="addFormItem.lawerName" :data="agentData1" @on-search="queryAgents" @on-select="selectNamey" placeholder="请输入代理人一姓名" transfer></AutoComplete> -->
                        <Input v-model="addFormItem.lawerName" @on-focus="queryAgents" @on-change="queryAgents" @on-blur="changess"  placeholder="请输入代理人一姓名"></Input>
                        <ul v-show="agentData1.length > 0" class="ivu-select-dropdown-list downSel"> 
                            <li class="ivu-select-item" v-for="item in agentData1" @click="selectNamey(item)"> {{item.name}}</li>
                        </ul>
                    </FormItem>
                    <FormItem label="电话" style="width: 245px;">
                        <!-- <Input v-model="addFormItem.lawermobile"  placeholder="请输入代理人一电话" width="100px;"></Input> -->
                        <AutoComplete v-model="addFormItem.lawermobile" :data="phoneData1" placeholder="请输入代理人一电话" transfer></AutoComplete>
                    </FormItem>
                    <FormItem label="公民身份证号码" v-show="addFormItem.lawerType != 1 && addFormItem.lawerType != 2" style="width: 505px;">
                        <!-- <Input v-model="addFormItem.lawIdentiCard" placeholder="请输入代理人一公民身份证号码"  ></Input> -->
                        <AutoComplete v-model="addFormItem.lawIdentiCard" :data="numData1" @on-search="queryAgent1" placeholder="请输入代理人一公民身份证号码" transfer></AutoComplete>
                    </FormItem>
                    <FormItem label="工作证件号码" v-show="addFormItem.lawerType == 1 || addFormItem.lawerType == 2" style="width: 505px;">
                        <Input v-model="addFormItem.lawerNum" placeholder="请输入代理人一工作证件号码"  ></Input>
                        <!-- <AutoComplete v-model="addFormItem.lawerNum" :data="lawNumData1" @on-search="queryAgent1" placeholder="请输入代理人一工作证件号码" transfer></AutoComplete> -->
                    </FormItem>
                    <FormItem label="工作单位" v-show="addFormItem.lawerType == 1 || addFormItem.lawerType == 2" style="width: 505px;">
                        <Input v-model="addFormItem.lawFirm" placeholder="请输入代理人一工作证单位"  ></Input>
                    </FormItem>
                    </div>
                    <div v-show="lawyerAdd2">
                    <FormItem label="代理人二身份" style="width: 505px;">
                        <Select v-model="addFormItem.lawerType1" transfer @on-change="changeType1" placeholder="请选择">
                            <Option v-for="item in lawerType" :value="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="姓名" style="width: 245px;">
                        <!-- <Input v-model="addFormItem.lawerName1" placeholder="请输入代理人二姓名"  width="100px;"></Input> -->
                        <!-- <AutoComplete v-model="addFormItem.lawerName1" :data="agentData2" @on-search="queryAgent2" @on-select="selectName2" placeholder="请输入代理人二姓名" transfer></AutoComplete> -->
                        <Input v-model="addFormItem.lawerName1" @on-focus="queryAgent2" @on-change="queryAgent2" @on-blur="changesss"  placeholder="请输入代理人一姓名"></Input>
                        <ul v-show="agentData2.length > 0" class="ivu-select-dropdown-list downSel"> 
                            <li class="ivu-select-item" v-for="item in agentData2" @click="selectName2(item)"> {{item.name}}</li>
                        </ul>
                    </FormItem>
                    <FormItem label="电话" style="width: 245px;">
                        <!-- <Input v-model="addFormItem.lawermobile1" placeholder="请输入代理人二电话" width="100px;"></Input> -->
                        <AutoComplete v-model="addFormItem.lawermobile1" :data="phoneData2" @on-search="queryAgent3" placeholder="请输入代理人二电话" transfer></AutoComplete>
                    </FormItem>
                    <FormItem label="公民身份证号码" v-show="addFormItem.lawerType1 != 1 && addFormItem.lawerType1 != 2" style="width: 505px;">
                        <!-- <Input v-model="addFormItem.lawIdentiCard1" placeholder="请输入代理人二公民身份证号码"  ></Input> -->
                        <AutoComplete v-model="addFormItem.lawIdentiCard1" :data="numData2" @on-search="queryAgent3" placeholder="请输入代理人二公民身份证号码" transfer></AutoComplete>
                    </FormItem>
                    <FormItem label="工作证件号码" v-show="addFormItem.lawerType1 == 1 || addFormItem.lawerType1 == 2" style="width: 505px;">
                        <Input v-model="addFormItem.lawerNum1" placeholder="请输入代理人二工作证件号码"  ></Input>
                        <!-- <AutoComplete v-model="addFormItem.lawerNum1" :data="lawNumData2" @on-search="queryAgent3" placeholder="请输入代理人二工作证件号码" transfer></AutoComplete> -->
                    </FormItem>
                    <FormItem label="工作单位" v-show="addFormItem.lawerType1 == 1 || addFormItem.lawerType1 == 2" style="width: 505px;">
                        <Input v-model="addFormItem.lawFirm1" placeholder="请输入代理人二工作证单位"  ></Input>
                    </FormItem>
                    
                    </div>
                    <FormItem v-show="!lawyerAdd2">
                        <div class="adds"  @click="addShowLawyer" style="text-align:center">
                            <Icon type="plus-round"></Icon>
                            <p>添加代理人</p>
                        </div>
                    </FormItem>
                    <FormItem label="是否创建账号" style="width: 245px !important;" v-show="this.type === 'defendant'">
                        <RadioGroup v-model="addFormItem.iscreat">
                            <Radio label="是"></Radio>
                            <Radio label="否" style="margin-left:15px"></Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <Modal v-model="deleteModal" width="360" class-name="vertical-center-modal">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确认删除？</span>
            </p>
            <div style="text-align:center">
                <p>您将删除“{{ deleteName }}”</p>
                <p>是否继续删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteLitigant">删除</Button>
            </div>
        </Modal>
         <Modal v-model="deleteRelationModal" width="360" class-name="vertical-center-modal">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确认删除？</span>
            </p>
            <div style="text-align:center">
                <p>您将删除“{{ deleteName }}”</p>
                <p>是否继续删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteRelation">删除</Button>
            </div>
        </Modal>

        <!-- 当事人关系 -->
        <Modal v-model="addmodel" :title="this.type === 'plaintiff' ? this.litigantrelationId != '' ? '修改原告关系' : '添加原告关系' : this.type === 'defendant' ? this.litigantrelationId != '' ? '修改被告关系' : '添加被告关系' : this.litigantrelationId != '' ? '修改第三人关系' : '添加第三人关系'"  width="400px" :loading="loading" ok-text="提交" @on-ok="submitRelation" :mask-closable="false" class-name="vertical-center-modal">
           <Form :model="addLitigantRelationFormItem" :label-width="100" inline>
                 <FormItem label="当事人关系" style="width: 245px;">
                    <Select v-model="addLitigantRelationFormItem.relationType" transfer placeholder="请选择">
                        <Option v-for="item in relationType" :value="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label=" 当事人：" style="width:245px;">
                    <CheckboxGroup size="large" @on-change="checkLitigantName" v-model="addLitigantRelationFormItem.litigantIdArr">
                        <Row>
                            <Col  v-for="(d, key) in data" :key="key" >
                                <Checkbox :label="d.id" >{{d.litigantName}}</Checkbox>      
                            </Col>
                        </Row>
                    </CheckboxGroup>
                </FormItem>
           </Form>
            
        </Modal>
    </div>
</template>
<script type="text/javascript">
import { formatDate } from '@/libs/date';
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import {
    addLitigant,
    removeLitigant,
    detailLitigant,
    modiLitigant,
    NetworkKyc,
    findAgent,
    findLitigant,
    addLitigantRelation,
    deleteLitigantRelation,
    updateLitigantRelation,
    removeAddress
} from '@/api/case';
export default {
    components: {
        ClipLoader
    },
    data () {
        return {
            lawyerT1: true,
            lawyerT2: true,
            loading2: false,
            loading: true,
            lawyerAdd1:false,
            lawyerAdd2:false,
            litigantData:[],
            agentData1: [],
            phoneData1: [],
            adressList:[],
            numData1: [],
            idData1: [],
            idData2: [],
            lawNumData1: [],
            agentData2: [],
            phoneData2: [],
            numData2: [],
            lawNumData2: [],
            arr1: [],
            arr2: [],
            addmodel:false,
            addFormItem: {
                litigantName: '',
                litigantSex: '',
                sendAddressRemark:'',
                nativePlaceRemark:'',
                addressRemark:'',
                allOtherAddress:'',
                litigantType: '自然人',
                employer: '',
                identityCard: '',
                iscreat:'',
                nation: '',
                litigantPhone: '',
                litigantTelPhone: '',
                birthday: '',
                email: '',
                nativePlace: '',
                address: '',
                legalManName: '',
                legalManPhone: '',
                legalManId: '',
                sendAddress: '',
                agentId: '',
                lawerType: '',
                lawerName: '',
                lawermobile: '',
                lawIdentiCard: '',
                lawerNum: '',
                lawFirm: '',
                relationType: '',
                relationLitigantId: '',
                agentId1: "",
                lawerType1: "",
                lawerName1: "",
                lawermobile1: "",
                lawIdentiCard1: "",
                lawerNum1: ""

            },
            lawerType: [
                {
                    value: 1,
                    label: '律师'
                },
                {
                    value: 2,
                    label: '法律工作者'
                },
                {
                    value: 3,
                    label: '单位工作人员'
                },
                {
                    value: 4,
                    label: '近亲属'
                },
                {
                    value: 5,
                    label: '公民'
                }
            ],
            
            deleteName: '',
            acType: '',
            deleteId: '',
            deleteModal: false,
            litigantId: '',
            deleteRelationModal:false,
            loading1: false,
            deleteRelationName: '',
            deleteRelationId: '',
            showAdd: false,
            litigantrelationId:'',
            columns: [
                {
                    title: '当事人',
                    key: 'litigantName',
                    width: '180px',
                    align: 'center'
                },
                {
                    title: '身份证号/统一信用码',
                    key: 'identityCard',
                    width: '170px',
                    align: 'center'
                },
                {
                    title: '手机号码',
                    key: 'litigantPhone',
                    width: '130px',
                    align: 'center'
                },
                {
                    title: '地址',
                    key: 'address',
                    width: '280px',
                    align: 'center'
                },
                {
                    title: '操作',
                    width: '130px',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(this.relation)
                                            if (this.CaseInfoSaved()) {
                                                this.addFormItem.nativePlace = "";
                                                this.addFormItem.nativePlaceRemark = '';
                                                this.addFormItem.addressRemark = '';
                                                this.addFormItem.sendAddressRemark = '';
                                                this.addFormItem.allOtherAddress = '';
                                                this.addFormItem.address = "";
                                                this.addFormItem.sendAddress = "";
                                                this.adressList = [];
                                                this.lawyerAdd1 = false;
                                                this.lawyerAdd2 = false;
                                                detailLitigant(params.row.id)
                                                    .then(res => {
                                                        if (res.data.state === 100) {
                                                            this.showAdd = true;
                                                            this.litigantId = params.row.id;
                                                            this.addFormItem.litigantName = res.data.result.litigantName;
                                                            this.addFormItem.litigantSex = res.data.result.litigantSex == 0 ? '男' : (res.data.result.litigantSex == 1 ? '女' : "");
                                                            if (res.data.result.litigantType == 0) {
                                                                this.addFormItem.litigantType = '自然人';
                                                            } else if (res.data.result.litigantType == 1) {
                                                                this.addFormItem.litigantType = '法人';
                                                            } else {
                                                                this.addFormItem.litigantType = '非法人组织';
                                                            }
                                                            // this.addFormItem.litigantType =
                                                            //   res.data.result.litigantType == 1
                                                            //     ? "法人"
                                                            //     : "自然人";
                                                            this.addFormItem.employer = res.data.result.employer;
                                                            this.addFormItem.identityCard = res.data.result.identityCard;
                                                            this.addFormItem.nation = res.data.result.nation;
                                                            this.addFormItem.litigantPhone = res.data.phoneAll;
                                                            this.addFormItem.litigantTelPhone = res.data.result.litigantTelPhone;
                                                            this.addFormItem.birthday = res.data.result.birthday;
                                                            this.addFormItem.email = res.data.result.email;                                                           
                                                            var arys = res.data.result.litigantAddresses;
                                                            for(var i=0;i<arys.length;i++){
                                                                if(arys[i].type == 0){
                                                                    this.addFormItem.nativePlace = arys[i].address;
                                                                    this.addFormItem.nativePlaceRemark = arys[i].remark;
                                                                }else if(arys[i].type == 1){
                                                                    this.addFormItem.address = arys[i].address;
                                                                    this.addFormItem.addressRemark = arys[i].remark;
                                                                }else if(arys[i].type == 2){
                                                                    this.addFormItem.sendAddress = arys[i].address;
                                                                    this.addFormItem.sendAddressRemark = arys[i].remark;
                                                                }else{
                                                                    var data = {
                                                                        id:arys[i].id,
                                                                        name:arys[i].address,
                                                                        beizhu:arys[i].remark,
                                                                    }
                                                                    this.adressList.push(data)
                                                                }
                                                            }
                                                            res.data.result.litigantAddresses.map(item => {

                                                            })

                                                            this.addFormItem.legalManName = res.data.result.legalManName;
                                                            this.addFormItem.legalManPhone = res.data.result.legalManPhone;
                                                            this.addFormItem.legalManId = res.data.result.legalManId;
                                                            this.addFormItem.lawerType = res.data.result.lawyer.agentType;
                                                            this.addFormItem.lawerName = res.data.result.lawyer.agentName;
                                                            this.addFormItem.lawermobile = res.data.result.lawyer.agentMobile;
                                                            this.addFormItem.lawIdentiCard = res.data.result.lawyer.agentIdentiCard;
                                                            this.addFormItem.lawerNum = res.data.result.lawyer.lawerNum;
                                                            this.addFormItem.relationType = res.data.result.relationType;
                                                            this.addFormItem.relationLitigantId = res.data.result.relationLitigant;
                                                            var arry = res.data.result.lawyer;
                                                            if (arry != []) {
                                                                if (arry.length == 1) {
                                                                    this.lawyerAdd1 = true;
                                                                    this.addFormItem.agentId = arry[0].id;
                                                                    this.addFormItem.lawerType = arry[0].agentType;
                                                                    console.log(this.addFormItem.lawerType)
                                                                    this.addFormItem.lawerName = arry[0].agentName;
                                                                    this.addFormItem.lawermobile = arry[0].agentMobile;
                                                                    this.addFormItem.lawIdentiCard = arry[0].agentIdentiCard;
                                                                    this.addFormItem.lawerNum = arry[0].lawerNum;
                                                                    this.addFormItem.lawFirm = arry[0].lawFirm;
                                                                } else if (arry.length == 2) {
                                                                    this.lawyerAdd1 = true;
                                                                    this.lawyerAdd2 = true;
                                                                    this.addFormItem.agentId = arry[0].id;
                                                                    this.addFormItem.lawerType = arry[0].agentType
                                                                    this.addFormItem.lawerName = arry[0].agentName;
                                                                    this.addFormItem.lawermobile = arry[0].agentMobile;
                                                                    this.addFormItem.lawIdentiCard = arry[0].agentIdentiCard;
                                                                    this.addFormItem.lawerNum = arry[0].lawerNum;
                                                                    this.addFormItem.agentId1 = arry[1].id;
                                                                    this.addFormItem.lawerType1 = arry[1].agentType
                                                                    this.addFormItem.lawerName1 = arry[1].agentName;
                                                                    this.addFormItem.lawermobile1 = arry[1].agentMobile;
                                                                    this.addFormItem.lawIdentiCard1 = arry[1].agentIdentiCard;
                                                                    this.addFormItem.lawerNum1 = arry[1].lawerNum;
                                                                    this.addFormItem.lawFirm1 = arry[1].lawFirm;
                                                                }
                                                            } else {
                                                                this.addFormItem.agentId = "";
                                                                this.addFormItem.lawerType = "";
                                                                this.addFormItem.lawerName = '';
                                                                this.addFormItem.lawermobile = '';
                                                                this.addFormItem.lawIdentiCard = '';
                                                                this.addFormItem.lawerNum = '';
                                                                this.addFormItem.agentId1 = "";
                                                                this.addFormItem.lawerType1 = '';
                                                                this.addFormItem.lawerName1 = '';
                                                                this.addFormItem.lawermobile1 = '';
                                                                this.addFormItem.lawIdentiCard1 = '';
                                                                this.addFormItem.lawerNum1 = '';
                                                            }
                                                            this.acType = '修改';
                                                            
                                                        } else {
                                                            this.$Message.error(res.data.message);
                                                        }
                                                    })
                                                    .catch(() => { });
                                            }
                                        }
                                    }
                                },
                                '修改'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            if (this.CaseInfoSaved()) {
                                                // console.log(params)
                                                this.deleteModal = true;
                                                this.deleteName = params.row.litigantName;
                                                this.deleteId = params.row.id;
                                            }
                                        }
                                    }
                                },
                                '删除'
                            )
                        ]);
                    }
                }
            ],
            relationType:[
                {
                    value:1,
                    label:'夫妻',
                    
                },
                {
                    value:2,
                    label:'同住成员家属'
                },
                {
                    value:3,
                    label:'其他'
                }
            ],
            columns1:[
                {
                    title: '关系',
                    key: 'type',
                    width: '',
                    align: 'center'
                },
                 {
                    title: '当事人',
                    key: 'litigantNames',
                    width: '',
                    align: 'center'
                },
                 {
                    title: '操作',
                    width: '',
                    align: 'center',
                  render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            if (this.CaseInfoSaved()) {
                                                console.log(params.row)
                                                this.litigantrelationId = params.row.id;
                                                 this.addmodel = true;
                                                var litigantIds='';
                                                 const litigantNames = params.row.litigantNames.split('、');
                                                 for(let i=0;i<litigantNames.length;i++){
                                                        //  console.log(this.data)
                                                         for(let j=0;j<this.data.length;j++){
                                                             if(litigantNames[i] ==this.data[j].litigantName){
                                                                   litigantIds = litigantIds +','+this.data[j].id
                                                             }
                                                         }
                                                 }
                                                 litigantIds=litigantIds.substr(1)
                                                
                                                this.addLitigantRelationFormItem.relationType=params.row.typeNum,
                                                this.addLitigantRelationFormItem.litigationStatus=params.row.litigationStatus;
                                                this.addLitigantRelationFormItem.litigantId=litigantIds;
                                                this.addLitigantRelationFormItem.relationDataId = params.row.id
                                             
                                            }
                                        }
                                    }
                                },
                                '修改'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            if (this.CaseInfoSaved()) {
                                                console.log(params.row.litigantNames)
                                                this.deleteRelationModal = true;
                                                this.deleteRelationName = params.row.litigantNames;
                                                this.deleteRelationId = params.row.id;
                                                this.litigantrelationId='';
                                            }
                                        }
                                    }
                                },
                                '删除'
                            )
                        ]);
                    }
                }
            ],
            dipChecked:[],
            otherArr:[],
            litiArr:[],
            relation:[],           
            addLitigantRelationFormItem:{
                lawcaseId:'',
                relationType:'',
                litigationStatus:'',
                litigantId:'',
                relationDataId:'',
                litigantIdArr:[],
            }
        };
    },
    props: {
        title: String,
        lowCaseId: String,
        data: Array,
        changeCaseInfo: Boolean,
        caseLoading: Boolean,
        type: String,
        plaintiffRelation:Array,
        defendantRelation:Array,
        // relation:Array
    },
    methods: {
              clearNoNum(e){  
        // 通过正则过滤小数点后两位
      e.target.value = (e.target.value.match(/^[0-9\,]*/g)) || null

        console.log('e',e.target.value)
        this.addFormItem.litigantPhone=e.target.value

        },
        acsearLiti(e){
            let value = this.addFormItem.litigantName;
            clearTimeout(this.getLitiGant.timer);
            var that = this;
            var mustApplyTime = 1200;
            this.getLitiGant._cur=Date.now();  

            if(!this.getLitiGant._start){      
                this.getLitiGant._start=this.getLitiGant._cur;
            }
            if(this.getLitiGant._cur-this.getLitiGant._start>mustApplyTime){ 
                that.getLitiGant(value);
                that.getLitiGant._start=that.getLitiGant._cur;
            }else{
                this.getLitiGant.timer=setTimeout(function(){
                    that.getLitiGant(value);
                },1000);
            }
        },
        getRelation(value){
            this.relation = value;
        },
        getLitiGant(value){
            var acId = "";
            this.litigantData = !value ? [] : [
                value,
            ];
            var litype = 0;
            if(this.addFormItem.litigantType == "自然人"){
                litype = 0;
            }else if(this.addFormItem.litigantType == "法人"){
                litype = 1;
            }else if(this.addFormItem.litigantType == "非法人组织"){
                litype = 2;
            }
            this.loading1 = true;
            findLitigant(value,acId,litype).then(res => {
                this.loading1 = false;
                if(res.data.state == 100){
                    if(res.data.litigants != []){
                        this.arr1 = [];
                        this.litiArr = [];
                        this.otherArr = [];
                        // this.litigantData = [];
                        // var ary = res.data.litigants;
                        var ary = res.data.personnelMsgs;
                        for (var i = 0; i < ary.length; i++) {
                            if(ary[i].identityCard == null){
                                this.arr1.push(ary[i].litigantName + '(无)');
                            }else{
                                this.arr1.push(ary[i].litigantName + '(' + ary[i].identityCard + ')');
                            }
                            this.otherArr.push(ary[i].litigantName);
                        }
                        this.litiArr = res.data.personnelMsgs;
                        this.litigantData = this.arr1;
                        // this.litigantData = JSON.parse(JSON.stringify(this.litigantData));
                        console.log(this.litiArr)
                    }
                }
            })
        },
        changelss(e){
            let that = this;
            window.setTimeout(function(){
                that.litigantData = [];
            },500)
        },
        selectLitiName(value){
            var showName = value.split('(');
            console.log(555222)
            if(this.addFormItem.litigantName != showName[0]){
                this.addFormItem.litigantName = "";
                this.addFormItem.litigantName = showName[0];
                this.addFormItem.identityCard = showName[1].split(')')[0];
                
            }else{
                if(this.otherArr){
                    var that = this;
                    for(var i=0;i<this.otherArr.length;i++){
                        if(this.otherArr[i]==showName[0]){
                            console.log(111)
                            window.setTimeout(function(){
                                that.addFormItem.litigantName = showName[0];
                            },500)
                            
                            this.addFormItem.identityCard = showName[1].split(')')[0];
                            this.addFormItem = JSON.parse(JSON.stringify(this.addFormItem));
                            break;
                        }
                    }
                }
                this.addFormItem.litigantName = this.addFormItem.litigantName;
            }
            this.addFormItem.employer = ""; //工作单位
            this.addFormItem.nation = "";
            this.addFormItem.litigantPhone = "";    //手机号
            this.addFormItem.litigantTelPhone = ""; //固定电话
            this.addFormItem.birthday = "";
            this.addFormItem.email = ""; 
            this.addFormItem.nativePlace = "";   //自然人户籍地址/公司注册地址
            this.addFormItem.sendAddress = "";      //自然人送达地址/公司经营地址
            this.addFormItem.legalManName = ""; 
            this.addFormItem.legalManPhone =  "";                                    
            this.addFormItem.legalManId =  "";
            this.addFormItem.address = "";
            this.adressList = [];
            for(let i=0;i<this.litiArr.length;i++){
                if(this.litiArr[i].identityCard == this.addFormItem.identityCard){
                    this.addFormItem.litigantSex =this.litiArr[i].litigantSex == 0 ? '男' : '女';
                    if (this.litiArr[i].litigantType == 0) {
                        this.addFormItem.litigantType = '自然人';
                    } else if (this.litiArr[i].litigantType == 1) {
                        this.addFormItem.litigantType = '法人';
                    } else {
                        this.addFormItem.litigantType = '非法人组织';
                    }
                    this.addFormItem.employer = this.litiArr[i].employer;
                    this.addFormItem.identityCard = this.litiArr[i].identityCard;
                    this.addFormItem.nation = this.litiArr[i].nation;
                    this.addFormItem.litigantPhone = this.litiArr[i].litigantPhone;
                    this.addFormItem.litigantTelPhone = this.litiArr[i].litigantTelPhone;
                    this.addFormItem.birthday = this.litiArr[i].birthday;
                    this.addFormItem.email = this.litiArr[i].email; 
                    this.addFormItem.legalManName = this.litiArr[i].legalManName; 
                    this.addFormItem.legalManPhone =  this.litiArr[i].legalManPhone;                                    
                    this.addFormItem.legalManId =  this.litiArr[i].legalManId;  
                    this.addFormItem.address = this.litiArr[i].address;                                  
                    var arys = this.litiArr[i].personnelAddresses;
                    
                    this.addFormItem.nativePlace = this.litiArr[i].nativePlace;
                    this.addFormItem.sendAddress = this.litiArr[i].sendAddress;
                    for(var t=0;t<arys.length;t++){
                        if(arys[t].type == 0){
                            this.addFormItem.nativePlace = arys[t].address;
                            this.addFormItem.nativePlaceRemark = arys[t].remark;
                        }else if(arys[t].type == 1){
                            this.addFormItem.address = arys[t].address;
                            this.addFormItem.addressRemark = arys[t].remark;
                        }else if(arys[t].type == 2){
                            this.addFormItem.sendAddress = arys[t].address;
                            this.addFormItem.sendAddressRemark = arys[t].remark;
                        }else if(arys[t].type == 3){
                            var data = {
                                id:'',
                                name:arys[t].address,
                                beizhu:arys[t].remark,
                            }
                            this.adressList.push(data)
                        }
                    }
                    break;
                }
            }
            
            
        },
        blurName(value){
            console.log(value)
        },
        addAdress(){
            var da ={
                id:'',
                name:'',
                beizhu:''
            }
            this.adressList.push(da)
        },
        addShowLawyer(){
            if(this.lawyerAdd1 == false){
                this.lawyerAdd1 = true;
            }else if(this.lawyerAdd1 == true && this.lawyerAdd2 == false){
                this.lawyerAdd2 = true;

            }
        },
        delAdress(value){
            if(this.litigantId == ''){
                for(var i=0;i<this.adressList.length;i++){
                    if(this.adressList[i].name == value.name){
                        this.adressList.splice(i,1);
                    }
                }
            }else{
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定删除该地址？</p>',
                    onOk: () => {
                        removeAddress(value.id).then(res => {
                            if(res.data.state == 100){
                                this.$Message.success(res.data.message)
                                for(var i=0;i<this.adressList.length;i++){
                                    if(this.adressList[i].id == value.id){
                                        this.adressList.splice(i,1);
                                    }
                                }
                            }else{
                                this.$Message.info(res.data.message)
                            }
                        })
                    },
                    onCancel: () => {
                        
                    }
                });
                
            }
            
        },
        changeType (e) {
            if (e == 1 || e == 2) {
                this.lawyerT1 = false;
            } else {
                this.lawyerT1 = true;
            }
        },
        changeType1 (e) {
            if (e == 1 || e == 2) {
                this.lawyerT2 = false;
            } else {
                this.lawyerT2 = true;
            }
        },
        selectNamey (value) {
            console.log(value)
            this.addFormItem.lawerName =this.trimK(value.agentName);
            this.addFormItem.lawermobile = this.trimK(value.phone);
            this.addFormItem.lawerNum = value.lawerNum;
            this.addFormItem.agentId = value.agentId;
            this.addFormItem.lawIdentiCard = value.agentIdentiCard;
            this.agentData1 = [];
            return false;
            console.log(value)
            var that = this;
            if(value == undefined){
                let str = this.addFormItem.lawerName;
                window.setTimeout(function(){
                    console.log(9999)
                    console.log(str)
                    that.addFormItem.lawerName = str;
                },100)
                return false;
            }
            // this.addFormItem.lawerName = "";
            var showName = value.split('(')
            console.log(showName)
            this.addFormItem.lawerName = showName[0];
            console.log(this.addFormItem.lawerName)
            var index = this.arr1.indexOf(value);
            this.addFormItem.agentId = this.idData1[index];
            this.addFormItem.lawermobile = this.phoneData1[index];
            this.addFormItem.lawIdentiCard = this.numData1[index];
            this.agentData1 = [];
        },
        actins(value){
            clearTimeout(this.queryAgent.timer);
            var that = this;
            var mustApplyTime = 1000;
            this.queryAgent._cur=Date.now();  //记录当前时间

            if(!this.queryAgent._start){      //若该函数是第一次调用，则直接设置_start,即开始时间，为_cur，即此刻的时间
                this.queryAgent._start=this.queryAgent._cur;
            }
            if(this.queryAgent._cur-this.queryAgent._start>mustApplyTime){ 
            //当前时间与上一次函数被执行的时间作差，与mustApplyTime比较，若大于，则必须执行一次函数，若小于，则重新设置计时器
                that.queryAgent(value);
                that.queryAgent._start=that.queryAgent._cur;
            }else{
                this.queryAgent.timer=setTimeout(function(){
                    that.queryAgent(value);
                },500);
            }
            // this.queryAgent.timeoutId = setTimeout(function(){
            //     that.queryAgent(value);
            // },500);
        },
        isChn(str){
            var reg = /^[\u4E00-\u9FA5]+$/;
            if (!reg.test(str)){
                return false ;
            }else{
                return true ;
            }
        },
        changess(e){
            console.log(e);
            let that = this;
            window.setTimeout(function(){
                console.log(5555)
                that.agentData1 = [];
            },500)
            
        },
        changesss(){
            let that = this;
            window.setTimeout(function(){
                that.agentData2 = [];
            },500)
        },
        queryAgents (e) {
            let value = this.addFormItem.lawerName;
            let isCh = this.isChn(value);
            if(!isCh){
                this.agentData1 = [];
                return false;
            }
            
            this.agentData1 = !value ? [] : [
                value,
            ];
            console.log(this.agentData1)
            // this.agentData1 = [];
            var agentIdentiCard = '';
            var lawerNum = "";
            findAgent(value, agentIdentiCard, lawerNum).then(res => {
                if (res.data.state == 100) {
                    if (res.data.lawyers != []) {
                        this.arr1 = [];
                        this.numData1 = [];
                        this.phoneData1 = [];
                        this.lawNumData1 = [];
                        this.idData1 = [];
                        var ary = res.data.lawyers;

                        for (var i = 0; i < ary.length; i++) {
                            let drt = {
                                name:ary[i].agentName + '(' + ary[i].agentIdentiCard + ')',
                                agentName:ary[i].agentName,
                                phone:ary[i].agentMobile,
                                lawerNum:ary[i].lawerNum,
                                agentId:ary[i].id,
                                agentIdentiCard:ary[i].agentIdentiCard
                            }
                            this.arr1.push(drt)
                            // this.arr1.push(ary[i].agentName + '(' + ary[i].agentIdentiCard + ')')
                            this.numData1.push(ary[i].agentIdentiCard);
                            this.phoneData1.push(ary[i].agentMobile);
                            this.idData1.push(ary[i].id)
                            this.lawNumData1.push(ary[i].lawerNum)
                        }

                        this.agentData1 = this.arr1;
                        // console.log(this.agentData1)
                    }
                }
            })
        },
        queryAgent1 (value) {
            this.numData1 = !value ? [] : [
                value,
            ];
            var lawyerNam = '';
            var agentIdentiCard = '';
            var lawerNum = "";
            findAgent(lawyerNam, value, lawerNum).then(res => {
                if (res.data.state == 100) {
                    if (res.data.lawyers != []) {
                        var arr1 = [];
                        var ary = res.data.lawyers;

                        for (var i = 0; i < ary.length; i++) {
                            this.numData1.push(ary[i].agentIdentiCard);
                        }
                    }
                }
            })
        },

        selectName2 (value) {
            console.log(value)
            this.addFormItem.lawerName1 =this.trimK(value.agentName);
            this.addFormItem.lawermobile1 = this.trimK(value.phone);
            this.addFormItem.lawerNum1 = value.lawerNum;
            this.addFormItem.agentId1 = value.agentId;
            this.addFormItem.lawIdentiCard1 = value.agentIdentiCard;
            this.agentData1 = [];
            return false;
            var that = this;
            if(value == undefined){
                let str = this.addFormItem.lawerName1;
                window.setTimeout(function(){
                    console.log(9999)
                    console.log(str)
                    that.addFormItem.lawerName1 = str;
                },100)
                return false;
            }
            var showName1 = value.split('(')
            this.addFormItem.lawerName1 = showName1[0];
            var index1 = this.arr2.indexOf(value);
            this.addFormItem.agentId1 = this.idData2[index1];
            this.addFormItem.lawermobile1 = this.phoneData2[index1];
            this.addFormItem.lawIdentiCard1 = this.numData2[index1];
            console.log('agentId1为' + this.agentId1)
        },
        queryAgent2 (e) {
            let value = this.addFormItem.lawerName1;
            let isCh = this.isChn(value);
            if(!isCh){
                this.agentData1 = [];
                return false;
            }
            this.phoneData2 = [];
            this.numData2 = [];
            this.lawNumData2 = [];
            this.idData2 = [];
            this.agentData2 = !value ? [] : [
                value,
            ];
            console.log(this.agentData2)
            var numa = '';
            var lawerNum = "";
            findAgent(value, numa, lawerNum).then(res => {
                if (res.data.state == 100) {
                    if (res.data.lawyers != []) {
                        this.arr2 = [];
                        var ary = res.data.lawyers;

                        for (var i = 0; i < ary.length; i++) {
                            let drt = {
                                name:ary[i].agentName + '(' + ary[i].agentIdentiCard + ')',
                                agentName:ary[i].agentName,
                                phone:ary[i].agentMobile,
                                lawerNum:ary[i].lawerNum,
                                agentId:ary[i].id,
                                agentIdentiCard:ary[i].agentIdentiCard
                            }
                            this.arr2.push(drt)
                            // this.arr2.push(ary[i].agentName + '(' + ary[i].agentIdentiCard + ')')
                            this.numData2.push(ary[i].agentIdentiCard);
                            this.phoneData2.push(ary[i].agentMobile);
                            this.lawNumData2.push(ary[i].lawerNum);
                            this.idData2.push(ary[i].id)
                        }
                        this.agentData2 = this.arr2;
                        console.log(this.agentData1)
                    }
                }
            })
        },
        queryAgent3 (value) {

        },
        changeDate (date) {
            console.log(date)
            if(date != ''){
                this.addFormItem.birthday = new Date(date).getTime();
            }else{
                this.addFormItem.birthday = '';
            }
            
            console.log(this.addFormItem.birthday)
        },
        idCardtoBirth () {
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            let ster = this.trimK(this.addFormItem.identityCard);
            if (reg.test(ster)) {
                this.addFormItem.birthday =
                    this.trimK(this.addFormItem.identityCard).substring(6, 10) +
                    '-' +
                    this.trimK(this.addFormItem.identityCard).substring(10, 12) +
                    '-' +
                    this.trimK(this.addFormItem.identityCard).substring(12, 14);
            }
            let str = this.addFormItem.identityCard.substr(this.addFormItem.identityCard.length-2, 1);
            if(str == 1 || str == 3 || str == 5 || str == 7 || str == 9){
                this.addFormItem.litigantSex = '男';
            }else{
                this.addFormItem.litigantSex = '女';
            }
        },
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        add () {
            console.log(this.litigantId)
            if (this.CaseInfoSaved()) {
                console.log(this.addFormItem.nativePlaceRemark)
                this.showAdd = true;
                this.addFormItem.iscreat = '';
                this.litigantId = '';
                this.addFormItem.litigantName = '';
                this.addFormItem.litigantSex = '';
                this.addFormItem.identityCard = '';
                this.addFormItem.nation = '';
                this.addFormItem.litigantPhone = '';
                this.addFormItem.litigantTelPhone = '';
                this.addFormItem.birthday = '';
                this.addFormItem.email = '';
                this.addFormItem.address = '';
                this.addFormItem.legalManName = '';
                this.addFormItem.legalManPhone = '';
                this.addFormItem.legalManId = '';
                this.addFormItem.nativePlace = '';
                this.addFormItem.sendAddress = '';
                this.addFormItem.agentId = "";
                this.addFormItem.lawerType = '';
                this.addFormItem.lawerName = '';
                this.addFormItem.lawermobile = '';
                this.addFormItem.lawIdentiCard = '';
                this.addFormItem.lawerNum = '';
                this.addFormItem.relationType = "";
                this.addFormItem.lawFirm = '';
                this.addFormItem.relationLitigantId = '';
                this.addFormItem.agentId1 = "";
                this.addFormItem.lawerType1 = '';
                this.addFormItem.lawerName1 = '';
                this.addFormItem.lawermobile1 = '';
                this.addFormItem.lawIdentiCard1 = '';
                this.addFormItem.lawerNum1 = '';
                this.addFormItem.lawFirm1 = '';
                this.addFormItem.nativePlaceRemark = '';
                console.log(this.addFormItem.nativePlaceRemark)
                this.addFormItem.addressRemark = '';
                this.addFormItem.sendAddressRemark = '';
                this.addFormItem.allOtherAddress = '';
                this.lawyerAdd1 = false;
                this.lawyerAdd2 = false;
                this.adressList = [];
                this.addFormItem.lawIdentiCard1 = '';
                console.log(this.agentData1)
                this.acType = '添加';
            }
        },

        // 添加当事人关系
        addLitigantRelation(){
           this.addmodel = true;
           this.addLitigantRelationFormItem.litigantId = '';
           this.litigantrelationId='';
           this.addLitigantRelationFormItem.relationType='';
          this.litigantIdArr=[];
        },
         checkLitigantName(value){
            // this.litigantIdArr = [];
            this.litigantIdArr=value
            // this.addLitigantRelationFormItem.litigantId = litigantIdArr;
            // dipChecked
            console.log(value)
           
        },
        submitRelation(){
              var litigationStatus;
             
            
              
            if (this.type == 'plaintiff') {
                litigationStatus = '原告';
            } else if (this.type == 'defendant') {
                litigationStatus = '被告';
            } else {
                litigationStatus = '第三人';
            }
         
           if(this.litigantrelationId!=''){
           
               this.addLitigantRelationFormItem.litigantId ='';
            // console.log('修改LitigantrelationId'+this.addLitigantRelationFormItem.litigantId)
              for(let i = 0;i<this.litigantIdArr.length;i++){
                  this.addLitigantRelationFormItem.litigantId=this.addLitigantRelationFormItem.litigantId+','+this.litigantIdArr[i]
              }
            //   console.log(this.addLitigantRelationFormItem.litigantId)
              this.addLitigantRelationFormItem.litigantId = this.addLitigantRelationFormItem.litigantId.substr(1)
            updateLitigantRelation(this.lowCaseId,this.addLitigantRelationFormItem.relationType,this.addLitigantRelationFormItem.litigationStatus,this.addLitigantRelationFormItem.litigantId,this.addLitigantRelationFormItem.relationDataId)
                                            .then(res => {
                                                this.addmodel = false;
                                                console.log(res.data)
                                                if (res.data.state === 100) {  
                                                    this.$Message.success('修改成功');
                                                    this.addmodel = false;
                                                    this.$emit('refreshList');
                                                    this.changeLoading();
                                                } else {
                                                    this.changeLoading();
                                                    this.$Message.error(res.data.message);
                                                }
                                            })
                                            
           }else{
            //    添加
              this.addLitigantRelationFormItem.litigantId='';
               for(let i = 0;i<this.litigantIdArr.length;i++){
                  this.addLitigantRelationFormItem.litigantId=this.addLitigantRelationFormItem.litigantId+','+this.litigantIdArr[i]
              }
              this.addLitigantRelationFormItem.litigantId = this.addLitigantRelationFormItem.litigantId.substr(1)
            console.log('添加LitigantrelationId'+this.litigantrelationId)
            addLitigantRelation(
                                this.lowCaseId,
                                this.addLitigantRelationFormItem.relationType,
                                litigationStatus,
                                this.addLitigantRelationFormItem.litigantId
                                ).then(res=>{
                                    
                                    if(res.data.state==100){
                                        this.$Message.success('添加成功');
                                        this.addmodel = false;
                                        this.$emit('refreshList');
                                        this.changeLoading();
                                    }else if(res.data.state==101){
                                         this.changeLoading();
                                        this.$Message.error("请选择当事人");
                                    }else{
                                         this.changeLoading();
                                        this.$Message.error(res.data.message);
                                    }
                            }).catch(() => {
                                            this.$Message.error('服务器出错，请稍后再试');
                                            this.changeLoading();
                                                });
           }
            
           
        },
        trimK(s){
            return s ? s.replace(/(^\s*)|(\s*$)/g, "") : '' ;
        },
        submit () {
            var litigaStatus;
            var adrStr = '';
            console.log(this.adressList)
            if(this.litigantId == ''){
                if(this.adressList.length != 0){
                    for( var i=0;i<this.adressList.length;i++){
                        if(i == this.adressList.length-1){
                            adrStr = adrStr+this.adressList[i].name+','+this.adressList[i].beizhu;
                        }else{
                            adrStr = adrStr+this.adressList[i].name+','+this.adressList[i].beizhu+',';
                        }
                        
                    }
                }
            }else{
                
                if(this.adressList.length != 0){
                    for( var i=0;i<this.adressList.length;i++){
                        if(i == this.adressList.length-1){
                            adrStr = adrStr+this.adressList[i].id+','+this.adressList[i].name+','+this.adressList[i].beizhu;
                        }else{
                            adrStr = adrStr+this.adressList[i].id+','+this.adressList[i].name+','+this.adressList[i].beizhu+',';
                        }
                        console.log(adrStr + "sas")
                    }
                }
            }
            this.addFormItem.allOtherAddress = adrStr;
            console.log(adrStr)
            if (this.type == 'plaintiff') {
                litigaStatus = '原告';
                this.addFormItem.iscreat = '';
            } else if (this.type == 'defendant') {
                if(this.addFormItem.iscreat == ''){
                    this.$Message.info('请选择是否创建账号');
                    this.changeLoading();
                    return false;
                }
                if(this.addFormItem.iscreat == '是'){
                    this.addFormItem.iscreat = 1
                }else{
                    this.addFormItem.iscreat = 0
                }
                litigaStatus = '被告';
            } else {
                litigaStatus = '第三人';
                this.addFormItem.iscreat = '';
            }
            console.log(this.addFormItem.iscreat)
            const litigantSex = this.addFormItem.litigantSex == '男' ? 0 : 1;
            if (this.addFormItem.litigantType == '自然人') {
                var litigantType = 0;
            } else if (this.addFormItem.litigantType == '法人') {
                var litigantType = 1;
            } else {
                var litigantType = 2;
            }
            console.log(this.addFormItem.litigantPhone)
            if (
                this.addFormItem.litigantPhone == '' ||
                this.addFormItem.litigantPhone == undefined ||
                this.addFormItem.litigantPhone == null
            ) {
                console.log(3455)
                var litigantPhone = '';
            } else {
                console.log(777)
                var litigantPhone = this.addFormItem.litigantPhone.replace(/，/gi, ',');
                // var litigantPhone = this.addFormItem.litigantPhone;
            }
            var birthday =
                this.addFormItem.birthday &&
                formatDate(new Date(this.addFormItem.birthday), 'yyyy-MM-dd');
            if (birthday == 'NaN-aN-aN') {
                birthday = '';
            }
            if (birthday == 'NaN') {
                birthday = '';
            }
            if (this.litigantId != '') {
                if (this.addFormItem.litigantType == '自然人') {
                    var subNmae = this.addFormItem.litigantName;
                    var subCarId = this.trimK(this.addFormItem.identityCard);
                    var subPhone = litigantPhone;
                    var legalManName = '';
                    var legalManId = '';
                    var legalManPhone = '';
                } else {
                    var subNmae = this.addFormItem.litigantName;
                    var subCarId = this.trimK(this.addFormItem.identityCard);
                    var subPhone = '';
                    var legalManName = this.addFormItem.legalManName;
                    var legalManId = this.addFormItem.legalManId;
                    var legalManPhone = this.addFormItem.legalManPhone;
                }
                NetworkKyc(subNmae, subCarId, subPhone,legalManName, legalManPhone, legalManId, litigantType).then(res => {
                    console.log(1211)
                    if (res.data.state === 100) {
                        if (res.data.isTrue == true) {
                            modiLitigant(
                                this.addFormItem.iscreat,
                                this.addFormItem.nativePlaceRemark,
                                this.addFormItem.addressRemark,
                                this.addFormItem.sendAddressRemark,
                                this.addFormItem.allOtherAddress,
                                this.litigantId,
                                this.addFormItem.litigantName,
                                // this.addFormItem.identityCard,
                                this.trimK(this.addFormItem.identityCard),
                                litigantSex,
                                litigantType,
                                this.addFormItem.employer,
                                litigantPhone,
                                this.addFormItem.litigantTelPhone,
                                this.addFormItem.email,
                                this.addFormItem.nativePlace,
                                this.addFormItem.address,
                                this.addFormItem.nation,
                                birthday,
                                litigaStatus,
                                this.addFormItem.legalManName,
                                this.addFormItem.legalManPhone,
                                this.addFormItem.legalManId,
                                this.addFormItem.sendAddress,
                                this.addFormItem.agentId,
                                this.addFormItem.lawerType,
                                this.addFormItem.lawerName,
                                this.addFormItem.lawermobile,
                                this.addFormItem.lawIdentiCard,
                                this.addFormItem.lawerNum,
                                this.addFormItem.lawFirm,
                                this.addFormItem.relationType,
                                this.addFormItem.relationLitigantId,
                                this.addFormItem.agentId1,
                                this.addFormItem.lawerType1,
                                this.addFormItem.lawerName1,
                                this.addFormItem.lawermobile1,
                                this.addFormItem.lawIdentiCard1,
                                this.addFormItem.lawerNum1,
                                this.addFormItem.lawFirm1
                            )
                                .then(res => {
                                    if (res.data.state === 100) {
                                        this.$Message.success(res.data.message);
                                        this.litigantId = '';
                                        this.addFormItem.litigantName = '';
                                        this.addFormItem.litigantSex = '';
                                        this.addFormItem.litigantType = '自然人';
                                        this.addFormItem.employer = '';
                                        this.addFormItem.identityCard = '';
                                        this.addFormItem.nation = '';
                                        this.addFormItem.litigantPhone = '';
                                        this.addFormItem.litigantTelPhone = '';
                                        this.addFormItem.birthday = '';
                                        this.addFormItem.email = '';
                                        this.addFormItem.nativePlace = '';
                                        this.addFormItem.address = '';
                                        this.addFormItem.legalManName = '';
                                        this.addFormItem.legalManPhone = '';
                                        this.addFormItem.legalManId = '';
                                        this.addFormItem.sendAddress = '';
                                        this.addFormItem.lawerType = '';
                                        this.addFormItem.lawerName = '';
                                        this.addFormItem.lawermobile = '';
                                        this.addFormItem.lawIdentiCard = '';
                                        this.addFormItem.lawerNum = '';
                                        this.addFormItem.lawFirm = '';
                                        this.addFormItem.relationType = '';
                                        this.addFormItem.relationLitigantId = '';
                                        this.addFormItem.agentId = "";
                                        this.addFormItem.agentId1 = "";
                                        this.addFormItem.lawerType1 = '';
                                        this.addFormItem.lawerName1 = '';
                                        this.addFormItem.lawermobile1 = '';
                                        this.addFormItem.lawIdentiCard1 = '';
                                        this.addFormItem.lawerNum1 = '';
                                        this.addFormItem.lawFirm1 = '';
                                        this.addFormItem.lawIdentiCard1 = '';
                                        this.showAdd = false;
                                        this.$emit('refreshList');
                                    } else {
                                        this.changeLoading();
                                        this.$Message.error(res.data.message);
                                    }
                                })
                                .catch(() => {
                                    this.$Message.error('服务器出错，请稍后再试');
                                    this.changeLoading();
                                });
                        } else if (res.data.isTrue == false) {
                            this.$Modal.confirm({
                                title: '',
                                content: '<p>三网认证不一致</p>',
                                okText: '继续提交',
                                cancelText: '取消提交',
                                onOk: () => {
                                    console.log(this.addFormItem.lawFirm)
                                    modiLitigant(
                                        this.addFormItem.iscreat,
                                        this.addFormItem.nativePlaceRemark,
                                        this.addFormItem.addressRemark,
                                        this.addFormItem.sendAddressRemark,
                                        this.addFormItem.allOtherAddress,
                                        this.litigantId,
                                        this.addFormItem.litigantName,
                                        // this.addFormItem.identityCard,
                                        this.trimK(this.addFormItem.identityCard),
                                        litigantSex,
                                        litigantType,
                                        this.addFormItem.employer,
                                        litigantPhone,
                                        this.addFormItem.litigantTelPhone,
                                        this.addFormItem.email,
                                        this.addFormItem.nativePlace,
                                        this.addFormItem.address,
                                        this.addFormItem.nation,
                                        birthday,
                                        litigaStatus,
                                        this.addFormItem.legalManName,
                                        this.addFormItem.legalManPhone,
                                        this.addFormItem.legalManId,
                                        this.addFormItem.sendAddress,
                                        this.addFormItem.agentId,
                                        this.addFormItem.lawerType,
                                        this.addFormItem.lawerName,
                                        this.addFormItem.lawermobile,
                                        this.addFormItem.lawIdentiCard,
                                        this.addFormItem.lawerNum,
                                        this.addFormItem.lawFirm,
                                        this.addFormItem.relationType,
                                        this.addFormItem.relationLitigantId,
                                        this.addFormItem.agentId1,
                                        this.addFormItem.lawerType1,
                                        this.addFormItem.lawerName1,
                                        this.addFormItem.lawermobile1,
                                        this.addFormItem.lawIdentiCard1,
                                        this.addFormItem.lawerNum1,
                                        this.addFormItem.lawFirm1
                                    )
                                        .then(res => {
                                            if (res.data.state === 100) {
                                                this.$Message.success(res.data.message);
                                                this.litigantId = '';
                                                this.addFormItem.litigantName = '';
                                                this.addFormItem.litigantSex = '';
                                                this.addFormItem.litigantType = '自然人';
                                                this.addFormItem.employer = '';
                                                this.addFormItem.identityCard = '';
                                                this.addFormItem.nation = '';
                                                this.addFormItem.litigantPhone = '';
                                                this.addFormItem.litigantTelPhone = '';
                                                this.addFormItem.birthday = '';
                                                this.addFormItem.email = '';
                                                this.addFormItem.nativePlace = '';
                                                this.addFormItem.address = '';
                                                this.addFormItem.legalManName = '';
                                                this.addFormItem.legalManPhone = '';
                                                this.addFormItem.legalManId = '';
                                                this.addFormItem.sendAddress = '';
                                                this.addFormItem.lawerType = '';
                                                this.addFormItem.lawerName = '';
                                                this.addFormItem.lawermobile = '';
                                                this.addFormItem.lawIdentiCard = '';
                                                this.addFormItem.lawerNum = '';
                                                this.addFormItem.lawFirm = '';
                                                this.addFormItem.relationType = '';
                                                this.addFormItem.relationLitigantId = '';
                                                this.addFormItem.agentId = "";
                                                this.addFormItem.agentId1 = "";
                                                this.addFormItem.lawerType1 = '';
                                                this.addFormItem.lawerName1 = '';
                                                this.addFormItem.lawermobile1 = '';
                                                this.addFormItem.lawIdentiCard1 = '';
                                                this.addFormItem.lawerNum1 = '';
                                                this.addFormItem.lawFirm1 = '';
                                                this.addFormItem.lawIdentiCard1 = '';
                                                this.showAdd = false;
                                                this.$emit('refreshList');
                                            } else {
                                                this.changeLoading();
                                                this.$Message.error(res.data.message);
                                            }
                                        })
                                        .catch(() => {
                                            this.$Message.error('服务器出错，请稍后再试');
                                            this.changeLoading();
                                        });
                                },
                                onCancel: () => {
                                    this.changeLoading();
                                }
                            });
                        }
                    } else {
                        this.$Modal.confirm({
                            title: '',
                            content: '<p>三网认证失败</p>',
                            okText: '继续提交',
                            cancelText: '取消提交',
                            onOk: () => {
                                console.log(this.addFormItem.lawFirm)
                                modiLitigant(
                                    this.addFormItem.iscreat,
                                    this.addFormItem.nativePlaceRemark,
                                    this.addFormItem.addressRemark,
                                    this.addFormItem.sendAddressRemark,
                                    this.addFormItem.allOtherAddress,
                                    this.litigantId,
                                    this.addFormItem.litigantName,
                                    // this.addFormItem.identityCard,
                                    this.trimK(this.addFormItem.identityCard),
                                    litigantSex,
                                    litigantType,
                                    this.addFormItem.employer,
                                    litigantPhone,
                                    this.addFormItem.litigantTelPhone,
                                    this.addFormItem.email,
                                    this.addFormItem.nativePlace,
                                    this.addFormItem.address,
                                    this.addFormItem.nation,
                                    birthday,
                                    litigaStatus,
                                    this.addFormItem.legalManName,
                                    this.addFormItem.legalManPhone,
                                    this.addFormItem.legalManId,
                                    this.addFormItem.sendAddress,
                                    this.addFormItem.agentId,
                                    this.addFormItem.lawerType,
                                    this.addFormItem.lawerName,
                                    this.addFormItem.lawermobile,
                                    this.addFormItem.lawIdentiCard,
                                    this.addFormItem.lawerNum,
                                    this.addFormItem.lawFirm,
                                    this.addFormItem.relationType,
                                    this.addFormItem.relationLitigantId,
                                    this.addFormItem.agentId1,
                                    this.addFormItem.lawerType1,
                                    this.addFormItem.lawerName1,
                                    this.addFormItem.lawermobile1,
                                    this.addFormItem.lawIdentiCard1,
                                    this.addFormItem.lawerNum1,
                                    this.addFormItem.lawFirm,
                                )
                                    .then(res => {
                                        if (res.data.state === 100) {
                                            this.$Message.success(res.data.message);
                                            this.litigantId = '';
                                            this.addFormItem.litigantName = '';
                                            this.addFormItem.litigantSex = '';
                                            this.addFormItem.litigantType = '自然人';
                                            this.addFormItem.employer = '';
                                            this.addFormItem.identityCard = '';
                                            this.addFormItem.nation = '';
                                            this.addFormItem.litigantPhone = '';
                                            this.addFormItem.litigantTelPhone = '';
                                            this.addFormItem.birthday = '';
                                            this.addFormItem.email = '';
                                            this.addFormItem.nativePlace = '';
                                            this.addFormItem.address = '';
                                            this.addFormItem.legalManName = '';
                                            this.addFormItem.legalManPhone = '';
                                            this.addFormItem.legalManId = '';
                                            this.addFormItem.sendAddress = '';
                                            this.addFormItem.lawerType = '';
                                            this.addFormItem.lawerName = '';
                                            this.addFormItem.lawermobile = '';
                                            this.addFormItem.lawIdentiCard = '';
                                            this.addFormItem.lawerNum = '';
                                            this.addFormItem.lawFirm = '';
                                            this.addFormItem.relationType = '';
                                            this.addFormItem.relationLitigantId = '';
                                            this.addFormItem.agentId = "";
                                            this.addFormItem.agentId1 = "";
                                            this.addFormItem.lawerType1 = '';
                                            this.addFormItem.lawerName1 = '';
                                            this.addFormItem.lawermobile1 = '';
                                            this.addFormItem.lawIdentiCard1 = '';
                                            this.addFormItem.lawerNum1 = '';
                                            this.addFormItem.lawFirm1 = '';
                                            this.addFormItem.lawIdentiCard1 = '';
                                            this.showAdd = false;
                                            this.$emit('refreshList');
                                        } else {
                                            this.changeLoading();
                                            this.$Message.error(res.data.message);
                                        }
                                    })
                                    .catch(() => {
                                        this.$Message.error('服务器出错，请稍后再试');
                                        this.changeLoading();
                                    });
                            },
                            onCancel: () => {
                                this.changeLoading();
                            }
                        });
                    }
                });
                return false;
            } else {
                console.log(998)
                
                if (this.addFormItem.litigantType == '自然人') {
                    var subNmae = this.addFormItem.litigantName;
                    var subCarId = this.trimK(this.addFormItem.identityCard);
                    var subPhone = litigantPhone;
                    var legalManName = '';
                    var legalManId = '';
                    var legalManPhone = '';
                } else {
                    var subNmae = this.addFormItem.litigantName;
                    var subCarId = this.trimK(this.addFormItem.identityCard);
                    var subPhone = '';
                    var legalManName = this.addFormItem.legalManName;
                    var legalManId = this.addFormItem.legalManId;
                    var legalManPhone = this.addFormItem.legalManPhone;
                    console.log(legalManName)
                    console.log(legalManId)
                }
                NetworkKyc(subNmae, subCarId, subPhone,legalManName, legalManPhone, legalManId, litigantType).then(res => {
                    if (res.data.state === 100) {
                        if (res.data.isTrue == true) {
                            addLitigant(
                                this.addFormItem.iscreat,
                                this.addFormItem.nativePlaceRemark,
                                this.addFormItem.addressRemark,
                                this.addFormItem.sendAddressRemark,
                                this.addFormItem.allOtherAddress,
                                this.lowCaseId,
                                this.addFormItem.litigantName,
                                // this.addFormItem.identityCard,
                                this.trimK(this.addFormItem.identityCard),
                                litigantSex,
                                litigantType,
                                this.addFormItem.employer,
                                litigantPhone,
                                this.addFormItem.litigantTelPhone,
                                this.addFormItem.email,
                                this.addFormItem.nativePlace,
                                this.addFormItem.address,
                                this.addFormItem.nation,
                                birthday,
                                litigaStatus,
                                this.addFormItem.legalManName,
                                this.addFormItem.legalManPhone,
                                this.addFormItem.legalManId,
                                this.addFormItem.sendAddress,
                                this.addFormItem.agentId,
                                this.addFormItem.lawerType,
                                this.addFormItem.lawerName,
                                this.addFormItem.lawermobile,
                                this.addFormItem.lawIdentiCard,
                                this.addFormItem.lawerNum,
                                this.addFormItem.lawFirm,
                                this.addFormItem.relationType,
                                this.addFormItem.relationLitigantId,
                                this.addFormItem.agentId1,
                                this.addFormItem.lawerType1,
                                this.addFormItem.lawerName1,
                                this.addFormItem.lawermobile1,
                                this.addFormItem.lawIdentiCard1,
                                this.addFormItem.lawerNum1,
                                this.addFormItem.lawFirm1,
                            )
                                .then(res => {
                                    if (res.data.state === 100) {
                                        this.$Message.success(res.data.message);
                                        this.addFormItem.litigantName = '';
                                        this.addFormItem.litigantSex = '';
                                        this.addFormItem.litigantType = '自然人';
                                        this.addFormItem.identityCard = '';
                                        this.addFormItem.employer = '';
                                        this.addFormItem.nation = '';
                                        this.addFormItem.litigantPhone = '';
                                        this.addFormItem.litigantTelPhone = '';
                                        this.addFormItem.birthday = '';
                                        this.addFormItem.email = '';
                                        this.addFormItem.nativePlace = '';
                                        this.addFormItem.address = '';
                                        this.addFormItem.legalManName = '';
                                        this.addFormItem.legalManPhone = '';
                                        this.addFormItem.legalManId = '';
                                        this.addFormItem.sendAddress = '';
                                        this.addFormItem.lawerType = '';
                                        this.addFormItem.lawerName = '';
                                        this.addFormItem.lawermobile = '';
                                        this.addFormItem.lawIdentiCard = '';
                                        this.addFormItem.lawerNum = '';
                                        this.addFormItem.lawFirm = '';
                                        this.addFormItem.relationType = '';
                                        this.addFormItem.relationLitigantId = '';
                                        this.addFormItem.agentId = "";
                                        this.addFormItem.agentId1 = "";
                                        this.addFormItem.lawerType1 = '';
                                        this.addFormItem.lawerName1 = '';
                                        this.addFormItem.lawermobile1 = '';
                                        this.addFormItem.lawIdentiCard1 = '';
                                        this.addFormItem.lawerNum1 = '';
                                        this.addFormItem.lawFirm1 = '';
                                        this.addFormItem.lawIdentiCard1 = '';
                                        this.showAdd = false;
                                        this.$emit('refreshList');
                                    } else {
                                        this.changeLoading();
                                        this.$Message.error(res.data.message);
                                    }
                                })
                                .catch(() => {
                                    this.$Message.error('服务器出错，请稍后再试');
                                    this.changeLoading();
                                });
                        } else if(res.data.isTrue == false){
                            this.$Modal.confirm({
                                title: '',
                                content: '<p>三网认证不一致</p>',
                                okText: '继续提交',
                                cancelText: '取消提交',
                                onOk: () => {
                                    this.addFormItem.iscreat,
                                    addLitigant(
                                        this.addFormItem.iscreat,
                                        this.addFormItem.nativePlaceRemark,
                                        this.addFormItem.addressRemark,
                                        this.addFormItem.sendAddressRemark,
                                        this.addFormItem.allOtherAddress,
                                        this.lowCaseId,
                                        this.addFormItem.litigantName,
                                        // this.addFormItem.identityCard,
                                        this.trimK(this.addFormItem.identityCard),
                                        litigantSex,
                                        litigantType,
                                        this.addFormItem.employer,
                                        litigantPhone,
                                        this.addFormItem.litigantTelPhone,
                                        this.addFormItem.email,
                                        this.addFormItem.nativePlace,
                                        this.addFormItem.address,
                                        this.addFormItem.nation,
                                        birthday,
                                        litigaStatus,
                                        this.addFormItem.legalManName,
                                        this.addFormItem.legalManPhone,
                                        this.addFormItem.legalManId,
                                        this.addFormItem.sendAddress,
                                        this.addFormItem.agentId,
                                        this.addFormItem.lawerType,
                                        this.addFormItem.lawerName,
                                        this.addFormItem.lawermobile,
                                        this.addFormItem.lawIdentiCard,
                                        this.addFormItem.lawerNum,
                                        this.addFormItem.lawFirm,
                                        this.addFormItem.relationType,
                                        this.addFormItem.relationLitigantId,
                                        this.addFormItem.agentId1,
                                        this.addFormItem.lawerType1,
                                        this.addFormItem.lawerName1,
                                        this.addFormItem.lawermobile1,
                                        this.addFormItem.lawIdentiCard1,
                                        this.addFormItem.lawerNum1,
                                        this.addFormItem.lawFirm1,
                                    )
                                        .then(res => {
                                            if (res.data.state === 100) {
                                                this.$Message.success(res.data.message);
                                                this.addFormItem.litigantName = '';
                                                this.addFormItem.litigantSex = '';
                                                this.addFormItem.litigantType = '自然人';
                                                this.addFormItem.identityCard = '';
                                                this.addFormItem.employer = '';
                                                this.addFormItem.nation = '';
                                                this.addFormItem.litigantPhone = '';
                                                this.addFormItem.litigantTelPhone = '';
                                                this.addFormItem.birthday = '';
                                                this.addFormItem.email = '';
                                                this.addFormItem.nativePlace = '';
                                                this.addFormItem.address = '';
                                                this.addFormItem.legalManName = '';
                                                this.addFormItem.legalManPhone = '';
                                                this.addFormItem.legalManId = '';
                                                this.addFormItem.sendAddress = '';
                                                this.addFormItem.lawerType = '';
                                                this.addFormItem.lawerName = '';
                                                this.addFormItem.lawermobile = '';
                                                this.addFormItem.lawIdentiCard = '';
                                                this.addFormItem.lawerNum = '';
                                                this.addFormItem.lawFirm = '';
                                                this.addFormItem.relationType = '';
                                                this.addFormItem.relationLitigantId = '';
                                                this.addFormItem.agentId = "";
                                                this.addFormItem.agentId1 = "";
                                                this.addFormItem.lawerType1 = '';
                                                this.addFormItem.lawerName1 = '';
                                                this.addFormItem.lawermobile1 = '';
                                                this.addFormItem.lawIdentiCard1 = '';
                                                this.addFormItem.lawerNum1 = '';
                                                this.addFormItem.lawFirm1 = '';
                                                this.addFormItem.lawIdentiCard1 = '';
                                                this.showAdd = false;
                                                this.$emit('refreshList');
                                            } else {
                                                this.changeLoading();
                                                this.$Message.error(res.data.message);
                                            }
                                        })
                                        .catch(() => {
                                            this.$Message.error('服务器出错，请稍后再试');
                                            this.changeLoading();
                                        });
                                },
                                onCancel: () => {
                                    this.changeLoading();
                                }
                            });
                        }
                    } else {
                        this.$Modal.confirm({
                            title: '',
                            content: '<p>三网认证失败</p>',
                            okText: '继续提交',
                            cancelText: '取消提交',
                            onOk: () => {
                                addLitigant(
                                    this.addFormItem.iscreat,
                                    this.addFormItem.nativePlaceRemark,
                                    this.addFormItem.addressRemark,
                                    this.addFormItem.sendAddressRemark,
                                    this.addFormItem.allOtherAddress,
                                    this.lowCaseId,
                                    this.addFormItem.litigantName,
                                    // this.addFormItem.identityCard,
                                    this.trimK(this.addFormItem.identityCard),
                                    litigantSex,
                                    litigantType,
                                    this.addFormItem.employer,
                                    litigantPhone,
                                    this.addFormItem.litigantTelPhone,
                                    this.addFormItem.email,
                                    this.addFormItem.nativePlace,
                                    this.addFormItem.address,
                                    this.addFormItem.nation,
                                    birthday,
                                    litigaStatus,
                                    this.addFormItem.legalManName,
                                    this.addFormItem.legalManPhone,
                                    this.addFormItem.legalManId,
                                    this.addFormItem.sendAddress,
                                    this.addFormItem.agentId,
                                    this.addFormItem.lawerType,
                                    this.addFormItem.lawerName,
                                    this.addFormItem.lawermobile,
                                    this.addFormItem.lawIdentiCard,
                                    this.addFormItem.lawerNum,
                                    this.addFormItem.lawFirm,
                                    this.addFormItem.relationType,
                                    this.addFormItem.relationLitigantId,
                                    this.addFormItem.agentId1,
                                    this.addFormItem.lawerType1,
                                    this.addFormItem.lawerName1,
                                    this.addFormItem.lawermobile1,
                                    this.addFormItem.lawIdentiCard1,
                                    this.addFormItem.lawerNum1,
                                    this.addFormItem.lawFirm1
                                )
                                    .then(res => {
                                        if (res.data.state === 100) {
                                            this.$Message.success(res.data.message);
                                            this.addFormItem.litigantName = '';
                                            this.addFormItem.litigantSex = '';
                                            this.addFormItem.litigantType = '自然人';
                                            this.addFormItem.identityCard = '';
                                            this.addFormItem.employer = '';
                                            this.addFormItem.nation = '';
                                            this.addFormItem.litigantPhone = '';
                                            this.addFormItem.litigantTelPhone = '';
                                            this.addFormItem.birthday = '';
                                            this.addFormItem.email = '';
                                            this.addFormItem.nativePlace = '';
                                            this.addFormItem.address = '';
                                            this.addFormItem.legalManName = '';
                                            this.addFormItem.legalManPhone = '';
                                            this.addFormItem.legalManId = '';
                                            this.addFormItem.sendAddress = '';
                                            this.addFormItem.lawerType = '';
                                            this.addFormItem.lawerName = '';
                                            this.addFormItem.lawermobile = '';
                                            this.addFormItem.lawIdentiCard = '';
                                            this.addFormItem.lawerNum = '';
                                            this.addFormItem.lawFirm = '';
                                            this.addFormItem.relationType = '';
                                            this.addFormItem.relationLitigantId = '';
                                            this.addFormItem.agentId = "";
                                            this.addFormItem.agentId1 = "";
                                            this.addFormItem.lawerType1 = '';
                                            this.addFormItem.lawerName1 = '';
                                            this.addFormItem.lawermobile1 = '';
                                            this.addFormItem.lawIdentiCard1 = '';
                                            this.addFormItem.lawerNum1 = '';
                                            this.addFormItem.lawFirm1 = '';
                                            this.addFormItem.lawIdentiCard1 = '';
                                            this.showAdd = false;
                                            this.$emit('refreshList');
                                        } else {
                                            this.changeLoading();
                                            this.$Message.error(res.data.message);
                                        }
                                    })
                                    .catch(() => {
                                        this.$Message.error('服务器出错，请稍后再试');
                                        this.changeLoading();
                                    });
                            },
                            onCancel: () => {
                                this.changeLoading();
                            }
                        });
                    }
                });
            }
        },
        deleteLitigant () {
            removeLitigant(this.deleteId).then(res => {
                if (res.data.state === 100) {
                    this.$Message.success(res.data.message);
                    this.deleteModal = false;
                    this.$emit('refreshList');
                } else {
                    this.$Message.err(res.data.message);
                    this.deleteModal = false;
                }
            });
        },
         deleteRelation () {
            deleteLitigantRelation(this.deleteRelationId).then(res => {
                if (res.data.state === 100) {
                    this.$Message.success(res.data.message);
                    this.deleteRelationModal = false;
                    this.$emit('refreshList');
                } else {
                    this.$Message.err(res.data.message);
                    this.deleteRelationModal = false;
                }
            });
        },
        CaseInfoSaved () {
            if (this.changeCaseInfo === true) {
                this.$Modal.warning({
                    title: '警告',
                    content: '请先保存案件信息，再进行下一步'
                });
                return false;
            } else {
                return true;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.ivu-card {
  margin-bottom: 20px;
  .ivu-card-head {
    border-top: 2px solid #40a9ff;
    p {
      color: #fff;
    }
    .right-btn {
      position: absolute;
      right: 10px;
      cursor: pointer;
      color: #fff;
    }
  }
}
[v-cloak] {
  display: none;
}
.ivu-checkbox+span, .ivu-checkbox-wrapper+span{
    float: left;
}
.ivu-col{
    display: inline-block;
}
.ivu-form-item{
    width: 100% !important;
}
.ivu-select-single .ivu-select-selection{
    width: 70% !important;
    }
    .ivu-col{
        margin-right:12px;
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
.downSel{
    border: 1px solid #ccc;
    z-index: 99999;
    background: #fff;
    position: absolute;
}
.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>
