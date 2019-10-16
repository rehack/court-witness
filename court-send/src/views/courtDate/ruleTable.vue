<template>
    <div>
        <Card class="search-wrapper">
            <Form class="search-form" :label-width="100" inline>
                <FormItem label="是否组合排班">
                    <Select clearable placeholder='请选择是否组合排班' style="width: 200px;vertical-align:middle;" @on-change="togetherChange" @on-clear="clearTogether">
                        <Option v-for="item in isTogether" :value="item.value" :key="item.index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="时令">
                    <Select clearable placeholder='请选择时令' style="width: 200px;vertical-align:middle;" @on-change="seasonChange" @on-clear="clearseason">
                        <Option v-for="item in isSeason" :value="item.value" :key="item.index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Card>
        <Card>
            <Row style="padding-bottom: 10px;">
				<Col span="4">
				<span style="color:#464c5b;font-size:16px;font-weight:700">排班规则表</span>
				</Col>
				<Col span="20" style="text-align:right">
				<Button style="margin: 10px" type="primary" @click="showAdd()">
				    添加排班规则
				</Button>
				</Col>
			</Row>
            <Table border stripe :columns="columns" :data="tableData">
            </Table>
            <div class="page-wrapper">
                <Page :total="Number(pageData.total)" :page-size="pageData.pageSize" :current="pageData.pageNumber" :page-size-opts="[5,10,20]" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer></Page>
            </div>
        </Card>
	    <Modal v-model="mymodal.modal" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="ios-information-circle"></Icon>
	            <span>{{mymodal.title}}</span>
	        </p>
	        <div style="text-align:center">
	            {{mymodal.msg}}
	        </div>
	        <div slot="footer">
	            <Button type="error" size="large" long :loading="mymodal.modal_loading" @click="removeRule(nowRuleId)">{{mymodal.footerBtn}}</Button>
	        </div>
	    </Modal>
        <Modal v-model="mymodal2.modal" width="500">
	        <p slot="header" style="color:black;text-align:center">
	            <Icon type="ios-information-circle"></Icon>
	            <span>{{mymodal2.title}}</span>
	        </p>
	        <div style="text-align:center">
	            <Form :label-width="150">
	            	<FormItem label="选择法庭">
                    <Select clearable placeholder='请选择法庭' style="width: 270px;vertical-align:middle;" @on-change="tribunalIdModeChange" @on-clear="" v-model="mymodal2.ruleInfo.tribunalId">
                        <Option v-for="item in mymodal2.tribunalIdMode" :value="item.id" :key="item.index">{{ item.name }}</Option>
                    </Select>
                    </FormItem>
	            	<FormItem label="排班令时">
                    <Select clearable placeholder='请选择令时' style="width: 270px;vertical-align:middle;" @on-change="seasonModeChange" @on-clear="" v-model="mymodal2.ruleInfo.season">
                        <Option v-for="item in mymodal2.seasonMode" :value="item.value" :key="item.index">{{ item.label }}</Option>
                    </Select>
                    </FormItem>
	            	<FormItem label="排班方式">
                    <Select clearable placeholder='请选择排班方式' style="width: 270px;vertical-align:middle;" @on-change="ruleModeChange" @on-clear="" v-model="mymodal2.ruleInfo.mode">
                        <Option v-for="item in mymodal2.ruleMode" :value="item.value" :key="item.index">{{ item.label }}</Option>
                    </Select>
                    </FormItem>
	            	<FormItem label="选择已有规则（多选）" v-if='mymodal2.isDayTimeSelect'>
                    <Select  multiple :placeholder='mymodal2.ruleListDefault' style="width: 270px;vertical-align:middle;"  @on-change="ruleListModeChange" @on-clear="" :value="mymodal2.ruleInfo.groupDayTime">
                        <Option v-for="item in mymodal2.ruleListMode" :value="item.dayTime" :key="item.index">{{ item.hour }}:{{ item.minute }}（{{item.seasonEnum=="WINTER"?"冬令时":"夏令时"}}）</Option>
                    </Select>
                    </FormItem>
                    <FormItem label="设置冬令时" v-if='mymodal2.isWinterDayTimeSet'>
                         <TimePicker format="HH:mm" placeholder="请选择时间" style="width: 270px;vertical-align:middle;" confirm @on-change='winterDayTimeChange'></TimePicker>
                    </FormItem>
                    <FormItem label="设置夏令时" v-if='mymodal2.isSummerDayTimeSet'>
                         <TimePicker format="HH:mm" placeholder="请选择时间" style="width: 270px;vertical-align:middle;" confirm @on-change='summerDayTimeChange'></TimePicker>
                    </FormItem>
                    <FormItem label="绑定已有冬时令（单选）" v-if='mymodal2.isWinterDayTimeBind'>
                        <Select clearable :placeholder='mymodal2.ruleListBindDefault' :disabled='mymodal2.isTimeBind' style="width: 270px;vertical-align:middle;" @on-open-change="ruleListModeClick" v-model="mymodal2.ruleInfo.groupId">
                            <!-- 普通排班 -->
                            <Option v-if='mymodal2.ruleInfo.mode=="false"' v-for="item in mymodal2.ruleListMode" :value="item.id" :key="item.index">{{ item.hour }}:{{ item.minute }}</Option>
                            <!-- 组合排班 -->
                            <Option v-if='mymodal2.ruleInfo.mode=="true"' v-for="item in mymodal2.ruleListMode" :value="item.id" :key="item.index">{{ item.startTime}}</Option>
                        </Select>
                    </FormItem>
	            </Form>
	        </div>
	        <div slot="footer">
	            <Button type="info" size="large" long :loading="mymodal2.modal_loading" @click="setRule">{{mymodal2.footerBtn}}</Button>
	        </div>
	    </Modal>
    </div>
</template>
<script>
import {
    getRuleList,
    delateComfirm,
    delateRule,
    addRule,
    getWinterRule,
    getTribunalList,
    getTribunalWinterRuleList,
} from "@/api/courtDate";
export default {
    data() {
        return {
            pageData: {
                groupRule: "",
                season: "",
                pageNumber: 1,
                pageSize: 10,
                total: 0,
            },
            columns: [{
                    title: 'ID',
                    key: 'id',
                    align: 'center',
                },
                // {
                //     title: '排班序号',
                //     key: 'id',
                //     align: 'center',
                // },
                {
                    title: '所属法庭',
                    key: 'tribunalName',
                    align: 'center',
                },
                {
                    title: '是否组合排班',
                    key: 'groupRule',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.groupRule === true ? '是' : '否')
                    }
                },
                // {
                //     title: '组合排班规则',
                //     key: 'groupDayTime',
                //     align: 'center',
                // },
                {
                    title: '令时',
                    key: 'season',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.season === 'WINTER' ? '冬令时' : '夏令时')
                    }
                },
                {
                    title: '排班时间',
                    key: 'startTime',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
	                    return h('div', [
	                        // h('Button', {
	                        //     props: {
	                        //         type: 'primary',
	                        //         size: 'small'
	                        //     },
	                        //     style: {
	                        //         marginRight: '5px'
	                        //     },
	                        //     on: {
	                        //         click: () => {
	                        //             this.showAdd();
	                        //         }
	                        //     }
	                        // }, '修改'),
	                        h('Button', {
	                            props: {
	                                type: 'error',
	                                size: 'small'
	                            },
	                            on: {
	                                click: () => {
	                                    this.removeRuleComfirm(params.row.id)
	                                }
	                            }
	                        }, '删除')
	                    ]);
	                }
                },

            ],
            tableData: [],
            isTogether: [
                {
                    value: "true",
                    label: '是'
                },
                {
                    value: "false",
                    label: '否'
                }
            ],
            isSeason: [
                {
                    value: "WINTER",
                    label: '冬令时'
                },
                {
                    value: "SUMMER",
                    label: '夏令时'
                }
            ],
            mymodal:{
            	modal: false,
                modal_loading: false,
                title:'提示',
                msg:'',
                footerBtn:'删除'
            },
            mymodal2:{
            	modal: false,
                modal_loading: false,
                title:'增加排班规则',
                footerBtn:'提交',
                ruleInfo:{
                	mode:'false',
                	season:'WINTER',
                	tribunalId:'',
                	groupDayTime:[],
                    aryStr:'',
                	groupId:'',
                	summerDayTime:'',
                	winterDayTime:'',
                },
                ruleMode:[
                    {
                    	value: "false",
                        label: '普通排班'
                    },
                    {
                    	value: "true",
                        label: "组合排班"
                    },
                ],
                seasonMode:[
                    {
                    	value: "WINTER",
                        label: '冬令时'
                    },
                    {
                    	value: "SUMMER",
                        label: '夏令时'
                    },
                ],
                tribunalIdMode:[],
                ruleListMode:[],
                ruleListDefault:"请选择已有排班进行组合",
                ruleListBindDefault:"请选择已有冬时令排班进行绑定",
                isDayTimeSelect:false,
                isWinterDayTimeSet:true,
                isWinterDayTimeBind:false,
                isDayTimeSelect:false,
                ruleListModeValue:"",
                isTimeBind:false,

            },
            nowRuleId:'',
        }
    },
    mounted() {
        this.getNowPageContent();
    },
    methods: {
        pageChange(pageNum) {//页码改变
            this.pageData.pageNumber = pageNum;
            this.getNowPageContent();
        },
        pageSizeChange(pageSize) {//页码大小改变
            this.pageData.pageSize = pageSize;
            this.getNowPageContent();
        },
        getNowPageContent() {//获取当前页内容
        	// console.log(this.pageData.groupRule, this.pageData.season, this.pageData.pageNumber, this.pageData.pageSize);
            getRuleList(this.groupRule, this.season, this.pageData.pageNumber, this.pageData.pageSize)
                .then(res => {
                    if (res.data.state == 100) {
                        let data = res.data.data;
                        this.tableData = res.data.data.content;
                        this.setPageData(data.pageNumber, data.pageSize, data.total);
                    }
                });
        },
        setPageData(pageNumber, pageSize, total) {//设置分页参数
            this.pageData = {
                pageNumber,
                pageSize,
                total
            }
        },
        togetherChange(value) {//是否排班选项改变
            this.groupRule = value;
            this.getNowPageContent();
        },
        seasonChange(value) {//时令选项改变
            this.season = value;
            this.getNowPageContent();
        },
        clearTogether() {//清除是否排班选项
            this.groupRule = "";
            this.getNowPageContent();
        },
        clearseason() {//清除时令选项
            this.season = "";
            this.getNowPageContent();
        },
        removeRuleComfirm(id){//删除前确认是否被组合关联
        	this.$Modal.confirm({
                title: '删除提示',
                content: '<p>确认是否删除该项？</p>',
                loading: true,
                onOk: () => {
				    delateComfirm(id)
			        .then(res => {
			        	console.log(res.data);
	                	switch (res.data.state){
	                		//无关联直接删除
			            	case 100:
		                      this.removeRule(id);
			            	break;
			            	//查找不到该项
			            	case 101:
			            	  this.$Modal.remove();
		                      this.$Message.info(res.data.message);
			            	break;
			            	//有关联则提示
			            	case 103:
			            	  this.$Modal.remove();
					          this.mymodal.modal=true;
					          this.mymodal.msg=res.data.message;
					          this.nowRuleId=id;
			            	break;
			            }
			        });
                }
            });
        },
        removeRule(id){//删除规则
        	this.mymodal.modal_loading=true;
		    delateRule(id)
	        .then(res => {
	        	console.log(res.data);
	        	this.mymodal.modal_loading=false;
	        	this.mymodal.modal = false;
	        	this.$Modal.remove();
	            this.$Message.info(res.data.message);
	            this.getNowPageContent();
	        });
        },
        showAdd(){//添加规则
        	this.$Message.loading({
                    content: '正在加载数据...',
                    duration: 0
            });
        	//获取所有法庭
        	getTribunalList()
            .then(res => {
                if (res.data.state == 100) {
                    let data = res.data.data;
                    this.mymodal2.tribunalIdMode=data;
                    this.mymodal2.modal=true;
                    this.$Message.destroy();
                }
            });
            
        },
        seasonModeChange(){//时令改变
            //清空数据
            // this.mymodal2.ruleInfo.mode='false'
            //         mode:'false',
            //         season:'WINTER',
            //         tribunalId:'',
            //         groupDayTime:[],
            //         aryStr:'',
            //         groupId:'',
            //         summerDayTime:'',
            //         winterDayTime:'',
            this.checkChange();
        },
        ruleModeChange(){//规则改变
            this.checkChange();
        },
        tribunalIdModeChange(){//法庭改变
            this.checkChange();
        },
        ruleListModeChange(value){//已有排班规则改变
            this.mymodal2.ruleInfo.aryStr=value;
            this.mymodal2.isTimeBind=false;//启用冬令时时间绑定
            console.log(this.mymodal2.ruleInfo.aryStr);
        },
        ruleListModeClick(e){//绑定冬时令规则下拉框点击
            //下拉框展开时触发
            if(e){
                //判断是否为夏时令组合排班
                if(this.mymodal2.ruleInfo.season=='SUMMER' && this.mymodal2.ruleInfo.mode=='true'){
                    let groupId=this.mymodal2.ruleInfo.aryStr;
                    //获取已有冬时令规则用来绑定
                    getWinterRule(this.mymodal2.ruleInfo.tribunalId,"true",groupId.join(',')).then(res=>{
                        console.log(res);
                        if (res.data.state == 100) {
                            this.mymodal2.ruleListMode=res.data.data;//获取冬令时时间绑定列表
                        }else{
                            //清除绑定内容
                            this.mymodal2.ruleInfo.groupId="";
                            this.$Modal.error({content: res.data.message});
                        }
                    })
                }
            }
        },
        winterDayTimeChange(value){
           this.mymodal2.ruleInfo.winterDayTime=value;
        },
        summerDayTimeChange(value){
           this.mymodal2.ruleInfo.summerDayTime=value;
        },
        checkChange(){//检查改变
            //初始化
            this.mymodal2.isWinterDayTimeSet=false;
            this.mymodal2.isDayTimeSelect=false;
            this.mymodal2.isWinterDayTimeBind=false;
            this.mymodal2.isSummerDayTimeSet=false;
            this.mymodal2.ruleListMode=[];
            this.mymodal2.ruleInfo.groupId="";

        	//判断是否为普通冬时令排班
        	if(this.mymodal2.ruleInfo.mode=='false' && this.mymodal2.ruleInfo.season=='WINTER'){
                //显示冬时令排班时间设置
                this.mymodal2.isWinterDayTimeSet=true;
        	}

            //判断是否为普通夏时令排班
            if(this.mymodal2.ruleInfo.mode=='false' && this.mymodal2.ruleInfo.season=='SUMMER' && this.mymodal2.ruleInfo.tribunalId!='' ){
                //获取冬时令排班数据
                this.getWinterList(this.mymodal2.ruleInfo.tribunalId);
                //绑定冬令时的排班时间选择
                this.mymodal2.isWinterDayTimeBind=true;
                //显示夏令时的排班时间设置
                this.mymodal2.isSummerDayTimeSet=true;
        	}


        	//判断是否为冬时令组合排班
        	if(this.mymodal2.ruleInfo.mode=='true' && this.mymodal2.ruleInfo.season=='WINTER' && this.mymodal2.ruleInfo.tribunalId!='' ){
        		//获取冬时令排班数据
                this.getWinterList(this.mymodal2.ruleInfo.tribunalId);
                //显示已有冬时令排班选项
                this.mymodal2.isDayTimeSelect=true;
        	}

            //判断是否为夏令时组合排班
        	if(this.mymodal2.ruleInfo.mode=='true' && this.mymodal2.ruleInfo.season=='SUMMER' && this.mymodal2.ruleInfo.tribunalId!='' ){
                //获取冬时令排班数据
                this.getWinterList(this.mymodal2.ruleInfo.tribunalId,"SUMMER");
                //显示已有冬时令排班选项
                this.mymodal2.isDayTimeSelect=true;
                //绑定冬令时的排班时间选择
                this.mymodal2.isWinterDayTimeBind=true;
                //禁用冬令时的排班时间选择
                this.mymodal2.isTimeBind=true;
        	} 

        },
        getWinterList(id,season){
        	this.$Message.loading({
                    content: '正在加载数据...',
                    duration: 0
            });
        	getTribunalWinterRuleList(id,season)
        	.then(res =>{
        		console.log(res);
        		this.$Message.destroy();
        		if (res.data.state == 100) {
		            let data = res.data.data;
                    console.log(data);
	                this.mymodal2.ruleListMode=data;
	                this.mymodal2.ruleListDefault="请选择已有排班进行组合";
	                this.mymodal2.ruleListBindDefault="请选择已有冬时令排班进行绑定";
        		}else{
        			this.$Message.error(res.data.message);
        			this.mymodal2.ruleListDefault="该法庭暂无已有排班数据";
        			this.mymodal2.ruleListBindDefault="该法庭暂无已有排班数据";
        		}
        	});
        },
        setRule(){
        	//判断是否为普通冬时令排班
        	if(this.mymodal2.ruleInfo.mode=='false' && this.mymodal2.ruleInfo.season=='WINTER' && this.mymodal2.ruleInfo.tribunalId!=''){
                let winterDayTime =this.mymodal2.ruleInfo.winterDayTime.split(":");
                this.addRuleList(winterDayTime[0],winterDayTime[1],"","","",this.mymodal2.ruleInfo.tribunalId,"")
        	}

            //判断是否为普通夏时令排班
            if(this.mymodal2.ruleInfo.mode=='false' && this.mymodal2.ruleInfo.season=='SUMMER' && this.mymodal2.ruleInfo.tribunalId!='' ){
               let summerDayTime =this.mymodal2.ruleInfo.summerDayTime.split(":");
               this.addRuleList(summerDayTime[0],summerDayTime[1],"","","SUMMER",this.mymodal2.ruleInfo.tribunalId,this.mymodal2.ruleInfo.groupId)
        	}

            //判断是否为冬时令组合排班
            if(this.mymodal2.ruleInfo.mode=='true' && this.mymodal2.ruleInfo.season=='WINTER' && this.mymodal2.ruleInfo.tribunalId!=''){
                let groupId=this.mymodal2.ruleInfo.aryStr;
                this.addRuleList("","","true",groupId.join(','),"",this.mymodal2.ruleInfo.tribunalId,"")
        	}

            //判断是否为夏令时组合排班
        	if(this.mymodal2.ruleInfo.mode=='true' && this.mymodal2.ruleInfo.season=='SUMMER' && this.mymodal2.ruleInfo.tribunalId!='' ){
                let groupId=this.mymodal2.ruleInfo.aryStr;
                this.addRuleList("","","true",groupId.join(','),"SUMMER",this.mymodal2.ruleInfo.tribunalId,this.mymodal2.ruleInfo.groupId)
        	}
        },
        addRuleList(hour,minute,groupRule,groupDayTime,season,tribunalId,groupId){
        	this.$Message.loading({
                content: '正在提交数据...',
                duration: 0
            });
            addRule(hour,minute,groupRule,groupDayTime,season,tribunalId,groupId).then(res=>{   
            	console.log(res);
            	this.$Message.destroy();
            	if (res.data.state == 100){
                    this.mymodal2.modal=false;
            		this.$Message.success(res.data.message);
            	}else{
            		this.$Message.error(res.data.message);
            	}
            });
        }
    }
}
</script>
<style lang="less" scoped>
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

.page-wrapper {
    margin-top: 10px;
    text-align: right;
}

.bookbuilding-table {
    width: 100%;
    min-width: 600px;
    border: 1px solid #e9eaec;

    tr {
        td {
            border-left: 1px solid #e9eaec;
            border-bottom: 1px solid #e9eaec;
            line-height: 37px;
            text-align: left;
            padding-left: 8px;
        }

        td:first-child {
            border-left: none;
            width: 20%;
        }

        td:nth-child(2) {
            width: 30%;
        }

        td:nth-child(3) {
            width: 20%;
        }

        td:nth-of-type(odd) {
            background: #f8f8f9;
        }
    }

    tr:last-child {
        td {
            border-bottom: none;
        }
    }
}

td.ivu-table-expanded-cell {
    padding: 15px 50px 0px;
    background: #f8f8f9;
}

.time-wrapper {
    width: 150px;
    left: 230px;
    top: 26px;

    li {
        padding-left: 10px;
        cursor: pointer;
    }

    li:hover {
        color: #40a9ff;
    }

    li.checked {
        color: #fff;
        background-color: #40a9ff;
    }

    li.disable {
        color: #aaa;
        cursor: not-allowed;
    }
}
</style>