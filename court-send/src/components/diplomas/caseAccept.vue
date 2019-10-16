<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市湖里区人民法院</h2>
             <h2>受理案件通知书</h2>
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
                <!-- <Col span="8" class="maininfo-col headerCase"> -->
                    <div style="width: 30%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.litigantName"></div>：
                <!-- </Col> -->
           </Row>
            
                <div class="lineHeight">
                     &emsp;&emsp;
                    <div style="width: 35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.plaintiffName"></div>
                    与<div style="width: 35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.defendantNameBriefName"></div>
                    一案，本院已立案。现将受理案件的有关事项通知如下：
                </div>
                <div class="textIndent">一、在诉讼过程中，当事人必须依法行使诉讼权利，有权行使《中华人民共和国民事诉讼法》第四十九条、第五十条、第五十一条等规定的诉讼权利，同时也必须遵守诉讼秩序，履行诉讼义务。</div>
                <div class="textIndent">二、自然人应当提交身份证或者通行证、护照复印件；法人或者其他组织应当提交营业执照或者事业单位法人代码证复印件、法定代表人或者主要负责人身份证明书。</div>
                <div class="textIndent">三、当事人、法定代理人可以委托一至二人作为诉讼代理人。</div>
                <div class="textIndent">委托他人代为诉讼，必须向人民法院提交由委托人签名或者盖章的授权委托书。授权委托书必须记明委托事项和权限。
                                      诉讼代理人代为承认、放弃、变更诉讼请求，进行和解，提起反诉或者上诉，必须有委托人的特别授权。
                </div>
                <div class="textIndent">
                    侨居在国外的中华人民共和国公民从国外寄交或者托交的授权委托书，必须经中华人民共和国驻该国的使领馆证明；没有使领馆的，
                    由与中华人民共和国有外交关系的第三国驻该国的使领馆证明，再转由中华人民共和国驻该第三国使领馆证明，或者由当地的爱国华侨团体证明。
                </div>
                <div> &emsp;&emsp;四、应在接到本通知书后七日内，向本院预交案件受理费 <div style="width: 8%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.costMoney"></Input></div>元。</div>
                <div class="textIndent">
                    五、根据《最高人民法院关于人民法院在互联网公布裁判文书的规定》，本院作出的生效裁判文书将在中国裁判文书网上公布。如果你认为案件涉及个人隐私或商业秘密，申请对裁判文书中的有关内容进行技术处理或者申请不予公布的，
                    至迟应在裁判文书送达之日起三日内以书面形式提出并说明具体理由。经本院审查认为理由正当的，可以在公布裁判文书时隐去相关内容或不予公布。
                </div>
                <div class="textIndent">特此通知。联系人：沈春福，0592-2621015。</div>
 
                <Row>
                    <Col span="8" push="18" class="maininfo-col headerCase" style="margin-top:36px;">
                        <p>{{backFill.noticeTime}}</p>
                        <p>（院印）</p>
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
        title:'受理案件通知书'
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
  }
.headerCase{
    border:none !important;
    background-color: white !important;
}
 .textIndent{
      text-indent:2em;  
  }
.lineHeight{
    line-height: 26px;
}
.ivu-form-item{
    margin-bottom:11px;
}
  .underline100{
    border-bottom: 1px solid black; 
    display: inline-block;
    width: 5%;
  }
   input{
      width: 100%;
      height: 30px;
      border: none;
      font-size: 15px;
      text-align: center;
  }
</style>