<template>
    <div>
        <Card>
            <Row>
                <Col span="3" style="margin-bottom:15px;width: 50%;">
                    <span style="color:#464c5b;font-size:16px;font-weight:700;margin-bottom:10px">诉前案件时间统计</span>
                    <div style="margin-top: 30px;margin-bottom: 25px;">
                        <DatePicker type="daterange" :start-date="new Date(2018, 12, 12)" v-model="handoverDate" placeholder="选择时间段检索" style="width: 200px"></DatePicker>
                    </div>
                </Col>
            </Row>
            <Table stripe ref="judgeTable" :columns="judgecol" :data="casedata" ></Table>
        </Card>
    </div>
</template>
<script>
import {countTime} from "../../api/finanseCase.js";
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import {  addressList } from "../../api/templante.js";
import uploadMultiple from '@/components/upload-multiple1';
import { formatDate } from "../../libs/date.js";
export default {
  components: {
        ClipLoader,
        'upload-multiple': uploadMultiple
    },
    data() {
        return {
            handoverDate:'',
            judgecol: [
                {
                    title: "所有案件的平均时间(天)",
                    key: "averageTime",
                    align: "center",
                },
                {
                    title: "用时最快的案件时间(天)",
                    key: "minTime",
                    align: "center",
                },
                {
                    title: "用时最慢的案件时间(天)",
                    key: "maxTime",
                    align: "center",
                },
            ],
            casedata:[],
        };
    },
    mounted() {
        countTime().then(res=>{
            console.log(res)
        })
    },
    watch: {
        handoverDate(cur,old){
            var timestamp1 = Date.parse(new Date(cur[0]));
            var timestamp2 = Date.parse(new Date(cur[1]));
            console.log(timestamp1)
            console.log(old)
            this.getData(timestamp1,timestamp2)
        }
    },
    methods: {
        getData(timestamp1,timestamp2){
            countTime(timestamp1,timestamp2).then(res=>{
                console.log(res)
                if (res.data.state==100) {
                    this.casedata=[]
                    this.casedata.push(res.data.data)
                    this.$Message.info(res.data.message);
                }else{
                    this.$Message.info(res.data.message);
                }
            })
        }
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
</style>
