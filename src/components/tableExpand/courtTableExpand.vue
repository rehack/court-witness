<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Card style="margin-bottom:10px;margin-top:15px">
            <Collapse v-model="courtContent" v-for="(item,index) in row2">
                <Panel name="index">
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
                <Panel name="1">
                    <!-- <span  :class="item.dsrStatus =='被告' ? 'begaBtn' : 'ygBtn' " style="margin-left:10px">{{item.dsrStatus}}</span>  -->
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
                        <Row  style="">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                               <span style="font-weight:600">原因：</span>
                            </Col>
                            <!-- <Col span="4" >
                                <span  v-bind:class="item.guan != 1 ? 'red' : 'green'">{{item.guan != 1 ? "不认可" : "认可"}}</span>
                            </Col> -->
                           
                            <Col span="18" >
                                <span>{{item.content}}</span>
                            </Col>
                             <Col span="1" >
                                
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:15px;">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                                其他意见：
                            </Col>
                            <Col span="19" >
                                <span>{{item.content2 == "" ? "无" : item.content2}}</span>
                            </Col>
                        </Row>
                    </div>
                </Panel>
                <Panel name="" style="display:none">
                    <span  :class="item.dsrStatus =='被告' ? 'begaBtn' : 'ygBtn' " style="margin-left:10px">{{item.dsrStatus}}</span> <span  style="margin-left:10px">{{item.dsrName}}</span><span  style="margin-left:10px">2018-01-11 14:43</span>
                    <div slot="content">
                        <Row  style="margin-bottom:5px">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                               真实性：
                            </Col>
                            <Col span="19" >
                                <!-- {{ formatDate(new Date(item.send.createDate), 'yyyy-MM-dd hh:mm') }} -->
                                <span  v-bind:class="item.zhen != 1 ? 'red' : 'green'">{{item.zhen != 1 ? "不认可" : "认可"}}</span>
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:5px">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                              合法性：
                            </Col>
                            <Col span="19" >
                                <span v-bind:class="item.he != 1 ? 'red' : 'green'">{{item.he != 1 ? "不认可" : "认可"}}</span>
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:5px;">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                                关联性：
                            </Col>
                            <Col span="4" >
                                <span  v-bind:class="item.guan != 1 ? 'red' : 'green'">{{item.guan != 1 ? "不认可" : "认可"}}</span>
                            </Col>
                            <Col span="9" >
                                <span>原因：{{item.content}}</span>
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:15px;">
                            <Col span="3" style="text-align: right; padding-right: 5px">
                                其他意见：
                            </Col>
                            <Col span="19" >
                                <span>与本案无任何关联</span>
                            </Col>
                        </Row>
                    </div>
                </Panel>
            </Collapse>
           
            
        </Card>
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
                suggessContent:[0,1,2,3],
                courtContent:[0,1,2,3],
            }
        },
        methods:{
            ssw(){
                console.log(this.row)
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
</style>
