<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市湖里区人民法院</h2>
             <h2>举证通知书</h2>
       </div>
    <div>
     <Form>
          <Row>
                <Col span="8" push="14"  class="maininfo-col headerCase">
                   <!-- <Input ></Input> -->
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
                    <div class="textIndent">依照《中华人民共和国民事诉讼法》及相关司法解释规定，现将举证事项通知如下：</div>
                    <div class="textIndent">1.当事人对自己提出的诉讼请求所依据的事实或者反驳对方诉讼请求所依据的事实，应当提供证据加以证明，但法律另有规定的除外。
                       <strong>在作出判决前，当事人未能提供证据或者证据不足以证明其事实主张的，由负有举证证明责任的当事人承担不利的后果。</strong> 
                    </div>
                    <div>&emsp;&emsp;2.当事人应在收到本通知书之日起 <div style="width: 10%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.otherProofPeriod"></div> 日内向本院提交证据材料。当事人在该期限内提供证据确有困难的，可以向本院申请延长期限，由本院根据当事人的申请适当延长。
                        <strong>当事人逾期提供证据的，拒不说明理由或者理由不成立的，人民法院根据不同情形可以不予采纳该证据，或者采纳该证据但予以训诫、罚款。</strong>
                    </div>
                    <div class="textIndent">
                        3.当事人向本院提供证据，应当提供原件或原物。如需自己保存证据原件、原物或者提供原件、原物确有困难的，可以提供复制件或复制品，<strong>但应当将原件、原物在开庭时带至本院进行核对</strong> ，携带原件、原物有困难的，可以申请本院派员前往核对。
                    </div>
                    <div class="textIndent">当事人应当对其提交的证据材料逐一分类编号，对证据材料的来源、证明对象和内容作简要说明，签名盖章，注明提交日期，并依照对方当事人人数提出副本。</div>
                    <div class="textIndent">4.当事人提供的证据系在中华人民共和国领域外形成的，该证据应当经所在国公证机关予以证明，并经中华人民共和国驻该国使领馆予以认证，或者履行中华人民共和国与该所在国订立的有关条约中规定的证明手续。</div>
                    <div class="textIndent">当事人提供的证据是在香港、澳门、台湾地区形成的，应当履行相关的证明手续。</div>
                    <div class="textIndent">当事人提供的外文书证或者外文说明资料，应当附有专业翻译机构翻译的中文译本。</div>
                    <div class="textIndent">5.与本案有关且符合下列情形之一的，当事人及其诉讼代理人可以在举证期限届满前书面申请本院调查收集证据：</div>
                    <div class="textIndent">（一）证据由国家有关部门保存，当事人及其诉讼代理人无权查阅调取的；</div>
                    <div class="textIndent">（二）涉及国家秘密、商业秘密或者个人隐私的；</div>
                    <div class="textIndent">（三）当事人及其诉讼代理人因客观原因不能自行收集的其他证据。</div>
                    <div class="textIndent">6.当事人依法申请保全证据的，可以在举证期限届满前书面提出。</div>
                    <div class="textIndent">7.当事人申请鉴定，可以在举证期限届满前书面提出。</div>
                    <div class="textIndent">8.当事人申请证人出庭作证的，应当在举证期限届满前书面提出。</div>
                    <div class="textIndent">9.经本院许可，当事人可以申请一至二名具有专门知识的人员出庭就案件的专门性问题进行说明。</div>
                    <div class="textIndent">
                        <strong>10、当事人或者其他诉讼参与人伪造、毁灭证据，以暴力、威胁、贿买方法阻止证人作证或者指使、贿买、胁迫他人作伪证，对证人、鉴定人、勘验人进行侮辱、诽谤、诬陷、殴打或者打击报复的，人民法院可以根据情节轻重予以罚款、拘留；构成犯罪的，依法追究刑事责任。</strong>
                    </div>
                </div>
               
         
                <Row>
                    <Col span="8" push="18" class="maininfo-col headerCase">
                        <p>{{backFill.noticeTime}}</p>
                        
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
        title:'举证通知书'

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
                    requestContent:'',
                    diplomsListJoin:'',
                    you:'',
                    otherProofPeriod:this.backFill.otherProofPeriod,
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
      font-size: 16px;
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
  strong{
      text-decoration: underline;
      font-size: 16px;
  }
  input{
        width: 100%;
      height: 30px;
      border: none;
      font-size: 15px;
      text-align: center;
  }
</style>