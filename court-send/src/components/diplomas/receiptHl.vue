<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市湖里区人民法院</h2>
             <h2>送达回证</h2>
       </div>
    <div>
     <Form>
         <Row>
                <Col span="8" push="14"  class="maininfo-col headerCase">
                   <input type="text" v-model="backFill.caseNo">
                </Col>
               
         </Row>
      <div class="main">
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label row60">
                    案由
                </Col>
                <Col span="8" class="maininfo-col row60">
                    <Input v-model="backFill.briefName"></Input>
                </Col>
                <Col span="4" class="maininfo-col maininfo-col-label row60">
                    案号
                </Col> 
                <Col span="8" class="maininfo-col row60">
                    <Input v-model="backFill.caseNo"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col grid360 maininfo-col-label">
                  
                       送达文书名称
      
                </Col>
                <Col span="20" class=" grid360">
                    <Row>
                         <Col  span="24" class="maininfo-col row60">
                         <Input v-model="backFill.sendDiploms"></Input>
                        </Col>
                    </Row>
                    <Row>
                         <Col  span="24" class="maininfo-col row60">
                         
                        </Col>
                    </Row>
                    <Row>
                         <Col  span="24" class="maininfo-col row60">
                         
                        </Col>
                    </Row>
                    <Row>
                         <Col  span="24" class="maininfo-col row60">
                         
                        </Col>
                    </Row>
                    <Row>
                         <Col  span="24" class="maininfo-col row60">
                         
                        </Col>
                    </Row>
                    <Row>
                         <Col  span="24" class="maininfo-col row60">
                         
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label row60">
                    受送达人
                </Col>
                <Col span="8" class="maininfo-col row60">
                    <Input v-model="backFill.litigantName"></Input>
                </Col>
                <Col span="4" class="maininfo-col maininfo-col-label row60">
                    送达地点
                </Col>
                <Col span="8" class="maininfo-col row60">
                    <Input v-model="backFill.sendAddress"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col row60 maininfo-col-label">
                  
                       受送达人签名或捺印
      
                </Col>
                <Col span="20" class="maininfo-col row60">
                   
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col row60 maininfo-col-label">
                  
                       代收人
      
                </Col>
                <Col span="20" class="maininfo-col row60">
                   
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col row60 maininfo-col-label">
                  
                       备注
      
                </Col>
                <Col span="20" class="maininfo-col row60">
                   
                </Col>
            </Row>
         </div>
         
       </Form>
     </div> 
   </div>

</template>

<script type="text/javascript">
import { dbList } from '@/api/diplomas.js';
export default {
    data(){
        return{
        //   backFill:{
        //         caseNo:'',
        //         briefName:'',
        //         litiganName:'',
        //         startTime:'',
        //         tribunalAddress:''

        //     }
        modelHid:true,
        title:'送达回证'
        }
    },
     props: {
        backFill:[Array,Object]
        // produceIsSuccess:Number
    },
    methods: {
           
        dipPro(litigantId,panelList){
            // var _this = this;
            // console.log(panelList);
            // console.log('组件调用') 
                let data = {
                    litigantId:litigantId.toString(),
                    name:panelList,
                    caseNo:this.backFill.caseNo,
                    briefName:this.backFill.briefName,
                    litigantName:this.backFill.litigantName,
                    startTime:this.backFill.startTime,
                    tribunalAddress:this.backFill.tribunalAddress,
                    contactPhone:this.backFill.contactPhone,
                    judgeName:this.backFill.judgeName,
                    clerkName:this.backFill.clerkName,
                    noticeTime:this.backFill.noticeTime,
                    plaintiffName:this.backFill.plaintiffName,
                    defendantName:this.backFill.defendantName,
                    defendantNameBriefName:this.backFill.defendantNameBriefName,
                    litigantStatusName:this.backFill.litigantStatusName,
                    allMembers:this.backFill.allMembers,
                    department:this.backFill.department,
                    sendAddress:this.backFill.sendAddress,
                    sendDiploms:this.backFill.sendDiploms,
                    costMoney:this.backFill.costMoney,
                    converCaseNo:this.backFill.converCaseNo,
                    plaintiffNamePhone:this.backFill.plaintiffNamePhone,
                    defendantNamePhone:this.backFill.defendantNamePhone,
                    plaintiffLawyerNamePhone:this.backFill.plaintiffLawyerNamePhone,
                    defendantLawyerNamePhone:this.backFill.defendantLawyerNamePhone,
                    closeDate:this.backFill.closeDate,
                    converStartDate:this.backFill.converStartDate,
                    startDate:this.backFill.startDate,
                    proofPeriod:this.backFill.proofPeriod,
                    filingDate:this.backFill.filingDate,
                    type:'add',
                }  
              dbList(
                  data
              ).then(res=>{
               if(res.data.state == 100){
                    this.modelHid = false;
                     this.$emit('model',this.modelHid,res.data.result,this.title);
               }
          }).catch(() => {
                this.$Message.error('网络错误，生成失败。');  
            });
        }
        
    }
}

</script>
<style lang="less" scoped>
  .box{
      margin: 0 auto;
      width: 700px;
      height: 100%;
      display: block;
    font-size: 15px;
  }
  .header{
      width:100%;
      text-align: center;
  }
  .main{
      width: 100%;
      height: 100%;
      border:1px solid black;
  }
  .maininfo-col{
     border-right:1px solid black !important;
     border-bottom:1px solid black !important;
  }
 
  .maininfo-col{
      text-align: center;
      line-height:25px;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .ivu-form-item{
      margin-bottom: 3px;
  }
  .grid360{
     height:360px;
 }
 .row60{
    height: 60px;
 }
  .grid60{
      height: 70px;
  }
   .grid100{
      height: 100px;
  }
  .label{
      font-size: 15px;
  }
    input{
      width: 100%;
      height: 30px;
      border: none;
      font-size: 15px;
      text-align: center;
  }
  .headerCase{
    border:none !important;
    background-color: white !important;
}
</style>