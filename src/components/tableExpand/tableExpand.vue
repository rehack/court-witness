<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Card style="margin-bottom:10px;margin-top:15px">
            <Collapse v-model="courtContent" v-for="(item,index) in row2">
                <Panel name="1">
                    <span   class="ygBtn" style="margin-left:10px">{{item.dsrStatus}}</span> <span  style="margin-left:10px">{{item.dsrName}}</span><span  style="margin-left:10px">{{item.time}}</span>
                    <div slot="content">
                        <Row  style="margin-bottom:5px">
                            <Col span="19" style=" padding-right: 5px">
                               <CheckboxGroup v-model="item.ary">
                                    <Checkbox label="真实性" style="margin-left:50px"></Checkbox>
                                    <Checkbox label="合法性" style="margin-left:50px"></Checkbox>
                                    <Checkbox label="关联性" style="margin-left:50px"></Checkbox>
                                 </CheckboxGroup>
                            </Col>
                        </Row>
                        <Row  style="">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                               <span style="font-weight:600">提醒：</span>
                            </Col>
                            <Col span="9" >
                                <span>{{item.content}}</span>
                            </Col>
                             <Col span="1" >
                                
                            </Col>
                        </Row>
                        <Row  style="">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                               <span style="font-weight:600">其他提醒：</span>
                            </Col>
                            <Col span="9" >
                                <span>{{item.content2 == "" ? "无" : item.content2}}</span>
                            </Col>
                             <Col span="1" >
                                
                            </Col>
                        </Row>
                    </div>
                </Panel>
            </Collapse>
            <Collapse v-model="suggessContent" v-for="(item,index) in row">
                <Panel name="2">
                    <!-- <span   class="begaBtn" style="margin-left:10px">{{item.dsrStatus}}</span>  -->
                    <span  style="margin-left:10px">{{item.dsrName}}</span><span  style="margin-left:10px">{{item.time}}</span>
                    <div slot="content">
                        <Row  style="margin-bottom:5px">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                               真实性：
                            </Col>
                            <Col span="4" >
                                <!-- {{ formatDate(new Date(item.send.createDate), 'yyyy-MM-dd hh:mm') }} -->
                                <span  v-bind:class="item.zhen != 1 ? 'red' : 'green'">{{item.zhen != 1 ? "不认可" : "认可"}}</span>
                            </Col>
                             <Col span="3" style="text-align: right; padding-right: 5px">
                              合法性：
                            </Col>
                            <Col span="4" >
                                <span v-bind:class="item.he != 1 ? 'red' : 'green'">{{item.he != 1 ? "不认可" : "认可"}}</span>
                            </Col>
                            <Col span="3" style="text-align: right; padding-right: 5px">
                                关联性：
                            </Col>
                            <Col span="4" >
                                <span  v-bind:class="item.guan != 1 ? 'red' : 'green'">{{item.guan != 1 ? "不认可" : "认可"}}</span>
                            </Col>
                        </Row>
                        <!-- <Row  style="margin-bottom:5px">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                              合法性：
                            </Col>
                            <Col span="19" >
                                <span v-bind:class="item.he != 1 ? 'red' : 'green'">{{item.he != 1 ? "不认可" : "认可"}}</span>
                            </Col>
                        </Row> -->
                        <Row  style="">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                               <span style="font-weight:600">原因：</span>
                            </Col>
                            <!-- <Col span="4" >
                                <span  v-bind:class="item.guan != 1 ? 'red' : 'green'">{{item.guan != 1 ? "不认可" : "认可"}}</span>
                            </Col> -->
                           
                            <Col span="9" >
                                <span>{{item.content}}</span>
                            </Col>
                             <Col span="1" >
                                
                            </Col>
                            <!-- <Col span="5" >
                                <Button type="ghost">发表补充意见</Button>
                            </Col> -->
                        </Row>
                        <Row  style="margin-bottom:15px;">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                                其他意见：
                            </Col>
                            <Col span="19" >
                                <span>{{item.content2 == "" ? "无" : item.content2}}</span>
                            </Col>
                        </Row>
                        <!-- <div  style="margin-bottom:5px;border-top:1px solid #ccc;padding-top:10px">
                            <Row  style="margin-bottom:5px"  v-for="i in item.revertChild">
                                <Col span="2" style="text-align: right; padding-right: 5px">
                                    <span  v-bind:class="i.dsr != 1 ? 'begaBtn' : 'ygBtn'">{{i.dsrStatus}}</span>
                                </Col>
                                <Col span="2"  style="text-align: right; padding-right: 5px">
                                    {{i.dsrName}}
                                </Col>
                                <Col span="2" >
                                    <span style="color:#008BCD">回复小何</span>
                                </Col>
                                <Col span="12" >
                                    <span style="cursor:pointer" @click="show">{{i.content}}</span>
                                </Col>
                                <Col span="6" >
                                    {{i.time}}
                                </Col>
                            </Row>
                        </div> -->
                    </div>
                </Panel>
                <Panel name="2" style="display:none">
                    <span  class="begaBtn" style="margin-left:10px">被告二</span> <span  style="margin-left:10px">小何</span><span  style="margin-left:10px">2018-01-11 14:43</span>
                    <div slot="content">
                        <Row  style="margin-bottom:5px">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                                真实性：
                            </Col>
                            <Col span="19" >
                                <!-- {{ formatDate(new Date(item.send.createDate), 'yyyy-MM-dd hh:mm') }} -->
                                <span style="color:green">认可</span>
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:5px">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                                合法性：
                            </Col>
                            <Col span="19" >
                                <span style="color:green">认可</span>
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:15px;">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                                关联性：
                            </Col>
                            <Col span="4" >
                                <span style="color:red">不认可</span>
                            </Col>
                            <Col span="9" >
                                <span><span style="font-weight:600">原因：</span>原因内容原因内容原因内容</span>
                            </Col>
                            <Col span="6" >
                                <Button type="ghost">发表补充意见</Button>
                            </Col>
                        </Row>
                        <div  style="margin-bottom:5px;border-top:1px solid #ccc;padding-top:10px">
                            <Row  style="margin-bottom:5px">
                                <Col span="2" style="text-align: right; padding-right: 5px">
                                    <span  class="ygBtn">原告一</span>
                                </Col>
                                <Col span="2"  style="text-align: right; padding-right: 5px">
                                    小唐
                                </Col>
                                <Col span="2" >
                                    <span style="color:#008BCD">回复小何</span>
                                </Col>
                                <Col span="12" >
                                    <span>回复内容回复内容</span>
                                </Col>
                                <Col span="6" >
                                    2018-01-11 14:43
                                </Col>
                            </Row>
                            <Row  style="margin-bottom:5px">
                                <Col span="2" style="text-align: right; padding-right: 5px">
                                    <span  class="begaBtn">被告一</span>
                                </Col>
                                <Col span="2"  style="text-align: right; padding-right: 5px">
                                    小唐
                                </Col>
                                <Col span="2" >
                                    <span style="color:#008BCD">回复小何</span>
                                </Col>
                                <Col span="12" >
                                    <span>回复内容回复内容</span>
                                </Col>
                                <Col span="6" >
                                    2018-01-11 14:43
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Panel>
            </Collapse>
            
        </Card>
         <!-- <Modal
            v-model="modalre"
            title="回复"
            :loading="loading"
            cancel-text=""
            width='720'
            ok-text="确认回复"
            @on-ok="asyncOK">
            <Row>
                 <Col span="3">
                    
                </Col>
                <Col span="16">
                    回复内容：
                </Col>
            </Row>
            <Row style="min-height:60px;margin-bottom:20px">
                 <Col span="3">
                    
                </Col>
                <Col span="16">
                    <Input v-model="value8" type="textarea" :autosize="{minRows: 3,maxRows: 7}" placeholder="请输入证据不认可理由.."></Input>
                </Col>
            </Row>
        </Modal> -->
    </div>
</template>
<script>
    export default {
        props: {
            row: Array,
            row2:Array
        },
        data (){
            return{
                suggessContent:[1,2,3],
                courtContent:[1,2,3],
                modalre:false,
            }
        },
        methods:{
            ssw(){
                console.log(this.row)
            },
            show(){
                this.modalre = true;
            }
        }

    };
</script>
<style>
.red{
    color:red;
}
.green{
    color:green;
}
.ivu-col{
    min-width: 30px;
}
</style>
