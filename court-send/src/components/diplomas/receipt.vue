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
                <Col span="4" class="maininfo-col maininfo-col-label">
                    案由
                </Col>
                <Col span="20" class="maininfo-col">
                    <Input v-model="backFill.briefName"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col grid60 maininfo-col-label">
                  
                       受送达人
      
                </Col>
                <Col span="5" class="maininfo-col grid60">
                    <Input v-model="backFill.litigantName"></Input>
                </Col>
                <Col span="5" class="maininfo-col grid60">
                    <!-- <FormItem  style="width: 100%;"> -->
                        <!-- <Input></Input> -->
                    <!-- </FormItem> -->
                </Col>
                <Col span="5" class="maininfo-col grid60">
                    <!-- <FormItem  style="width: 100%;"> -->
                        <!-- <Input></Input> -->
                    <!-- </FormItem> -->
                </Col>
                <Col span="5" class="maininfo-col grid60">
                    <!-- <FormItem  style="width: 100%;"> -->
                        <!-- <Input></Input> -->
                    <!-- </FormItem> -->
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label">
                  送达地点
                </Col>
                <Col span="5" class="maininfo-col">
                     <Input v-model="backFill.sendAddress"></Input>
                </Col>
                <Col span="5" class="maininfo-col">
                   
                </Col>
                <Col span="5" class="maininfo-col">
                   
                </Col>
                <Col span="5" class="maininfo-col">
                   
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col grid100 maininfo-col-label">
                    送达文书名称和件数
                </Col>
                <Col span="5" class="maininfo-col grid100">
                     <Input v-model="backFill.sendDiploms"></Input>
                </Col>
                 <Col span="5" class="maininfo-col grid100">
                   
                </Col>
                 <Col span="5" class="maininfo-col grid100">
                   
                </Col>
                 <Col span="5" class="maininfo-col grid100">
                   
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col grid60 maininfo-col-label">
                   受送达人签名或盖章
                </Col>
                <Col span="5" class="maininfo-col grid60">
                   
                </Col>
                  <Col span="5" class="maininfo-col grid60">
                   
                </Col>
                 <Col span="5" class="maininfo-col grid60">
                   
                </Col>
                 <Col span="5" class="maininfo-col grid60">
                   
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label ">
                   签收日期
                </Col>
                <Col span="5" class="maininfo-col">
                    
                </Col>
                  <Col span="5" class="maininfo-col">
                   
                </Col>
                 <Col span="5" class="maininfo-col">
                   
                </Col>
                 <Col span="5" class="maininfo-col">
                   
                </Col>
            </Row>

            <Row>
                <Col span="4" class="maininfo-col grid60 maininfo-col-label ">
                   代收人与受送达人的关系
                </Col>
                <Col span="5" class="maininfo-col grid60">
                    
                </Col>
                  <Col span="5" class="maininfo-col grid60">
                   
                </Col>
                 <Col span="5" class="maininfo-col grid60">
                   
                </Col>
                 <Col span="5" class="maininfo-col grid60">
                   
                </Col>
            </Row>

            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label ">
                   送达人
                </Col>
                <Col span="5" class="maininfo-col">
                    
                </Col>
                  <Col span="5" class="maininfo-col">
                   
                </Col>
                 <Col span="5" class="maininfo-col">
                   
                </Col>
                 <Col span="5" class="maininfo-col">
                   
                </Col>
            </Row>

            <Row>
                <Col span="4" class="maininfo-col grid60 maininfo-col-label ">
                   备注
                </Col>
                <Col span="5" class="maininfo-col grid60">
                    
                </Col>
                  <Col span="5" class="maininfo-col grid60">
                   
                </Col>
                 <Col span="5" class="maininfo-col grid60">
                   
                </Col>
                 <Col span="5" class="maininfo-col grid60">
                   
                </Col>
            </Row>
         </div>
         <div>
            填发人：
         </div>
       </Form>
       <div class="label">
           <p>注：1.如果送达人不在时将文书给他的成年家属或所在单位的负责人签收；</p>
           <p>2.如果代收，收件人应在收件人栏内签名或盖章，并注明与受送达人的关系；</p>
           <p>3.受送达人或代收人拒绝接收或签名、盖章时，送达人可邀请有关基层组织或者所在单位的代表到场，说明情况，在送达
               回证上记明拒收事由和日期，由送达人、见证人签名或盖章，把诉讼文书留在受送达人的住所；也可以把诉讼文书留在受
               送达人的住所，并采用拍照、录像等方式记录送达过程，即视为送达。
           </p>
       </div>
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