<template>
   <div class="box">
       <div class="header">
             <!-- <h2>福建省厦门市湖里区人民法院</h2> -->
             <h2>殿前法庭电话通知当事人情况记录表</h2>
       </div>
    <div>
     <Form>
          <Row>
                <Col span="3"  class="maininfo-col headerCase">
                   案号:
                </Col>
                <Col span="10"  class="maininfo-col headerCase">
                   <Input v-model="backFill.caseNo"></Input>
                </Col>
                <Col span="3" push="3" class="maininfo-col  headerCase">
                    通知电话:
                </Col>
                <Col span="5" push="3" class="maininfo-col headerCase">
                    2621015
                </Col>
         </Row>
      <div class="main">
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    通知时间
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    当事人姓名/名称
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    当事人电话号码
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    通知情况
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    通知人
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    证明人
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                &nbsp;月 &nbsp;&nbsp;日 ：
               
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
                <Col span="6" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
            </Row>
             <Row>
                <Col span="3" class="maininfo-col grid70">
                &nbsp;月 &nbsp;&nbsp;日 ：
               
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
                <Col span="6" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
            </Row>
             <Row>
                <Col span="3" class="maininfo-col grid70">
                &nbsp;月 &nbsp;&nbsp;日 ：
               
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
                <Col span="6" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
            </Row>
             <Row>
                <Col span="3" class="maininfo-col grid70">
                &nbsp;月 &nbsp;&nbsp;日 ：
               
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
                <Col span="6" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
            </Row>
             <Row>
                <Col span="3" class="maininfo-col grid70">
                &nbsp;月 &nbsp;&nbsp;日 ：
               
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
                <Col span="6" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
            </Row>
             <Row>
                <Col span="3" class="maininfo-col grid70">
                &nbsp;月 &nbsp;&nbsp;日 ：
               
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
                <Col span="6" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
            </Row>
             <Row>
                <Col span="3" class="maininfo-col grid70">
                &nbsp;月 &nbsp;&nbsp;日 ：
               
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
                <Col span="6" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
            </Row>
             <Row>
                <Col span="3" class="maininfo-col grid70">
                &nbsp;月 &nbsp;&nbsp;日 ：
               
                </Col>
                <Col span="6" class="maininfo-col grid70">
                    
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
                <Col span="6" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                   
                </Col>
                <Col span="3" class="maininfo-col grid70">
                    
                </Col>
            </Row>
             
            

            <Row>
                <Col span="3" class="maininfo-col  grid70">
                   备注
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    
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
        title:'电话通知记录表'
        }
    },
     props: {
        backFill:[Array,Object]
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
  .grid70{
      height: 65px;
  }
   .grid100{
      height: 100px;
  }
 
.headerCase{
    border:none !important;
    background-color: white !important;
}


</style>