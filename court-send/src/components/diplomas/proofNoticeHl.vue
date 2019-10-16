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
                    <div class="textIndent">依据《中华人民共和国民事诉讼法》和《最高人民法院关于民事诉讼证据的若干规定》，现将有关举证事项通知如下：</div>
                    <div class="textIndent">1、当事人对自己提出的主张有责任提供证据。但符合《最高人民法院关于民事诉讼证据的若干规定》第四条、第五条、第六条规定情形的，从其规定。
                      <p>没有证据或证据不足以证明当事人的事实主张的，由负有举证责任的当事人承担不利后果。</p>
                    </div>
                    <div class="textIndent">2、当事人应在收到本通知次日起十五日内向本院提交证据材料，在举证期限内不提交的，视为放弃举证权利。
                        <p>双方当事人协商一致，可依法变更上述举证期限，但需在收到本通知的次日起七日内共同向本院提出变更举证期限的书面请求。经本院认可，方可变更。</p>
                        <p>当事人超过举证期限提交的证据材料，本院不组织质证，但对方当事人同意质证的除外。</p>
                        <p>当事人增加、变更诉讼请求或提起反诉的，应当在举证期限届满前提出。</p>
                    </div>
                    <div class="textIndent">
                        3、当事人在举证期限内提交证据材料确有困难的，应在举证期限内向本院申请延期举证，经本院准许，可以适当延长举证期限。
                    </div>
                    <div class="textIndent">4、当事人向本院提供证据，应当提供原件或原物。如需自己保存证据原件、原物或者提供原件、原物确有困难的，可以提供复制件或复制品，但应当将原件、原物在举证期限内带至本院进行核对，携带原件、原物有困难的，可以申请本院派员前往核对。
                        <p>当事人应当对其提交的证据材料逐一分类编号，对证据材料的来源、证明对象和内容作简要说明，签名盖章，注明提交日期，一式二份，并依照对方当事人人数提出副本。</p>
                        <p>当事人提供的书面证据复印件，应一律使用A4型纸，其成品幅面尺寸为：210mm×297mm。</p>
                    </div>
                    <div class="textIndent">5、当事人提供的证据系在中华人民共和国领域外形成的，该证据应当经所在国公证机关予以证明，并经中华人民共和国驻该国使领馆予以认证，或者履行中华人民共和国与该所在国订立的有关条约中规定的证明手续。
                        <p>当事人提供的外文书证或者外文说明资料，应当附有中文译本。</p>
                    </div>
                    <div class="textIndent">6、与本案有关且符合下列条件之一的，当事人及其诉讼代理人可以申请本院调查收集证据，但不得迟于举证期限届满前七日，并应按规定提交书面申请书：</div>
                    <div class="textIndent">（一）申请调查收集的证据属于国家有关部门保存并须人民法院依职权调取的档案材料；</div>
                    <div class="textIndent">（二）涉及国家秘密、商业秘密、个人隐私的材料；</div>
                    <div class="textIndent">（三）当事人及其诉讼代理人确因客观原因不能自行收集的其他材料。</div>
                    <div class="textIndent">申请本院调查收集证据的申请书，应当载明被调查人的姓名或者单位名称、住所地等基本情况、所要调查收集的证据内容，需要由本院调查收集证据的原因及其要证明的事实。</div>
                    <div class="textIndent">7、当事人依法申请保全证据的，应于举证期限届满前七日提出书面申请。</div>
                    <div class="textIndent">8、当事人申请鉴定的，应当在举证期限内提出，并提出书面申请。</div>
                    <div class="textIndent">9、当事人申请证人出庭作证，应当在举证期限届满七日前提出，并经人民法院许可。</div>
                    <div class="textIndent">
                        10、经本院许可，当事人可以申请一至二名具有专门知识的人员出庭就案件的专门性问题进行说明。
                    </div>
                    <div class="textIndent">
                        11、当事人举证应当诚实，当事人或者其他诉讼参与人伪造、毁灭证据，提供假证据，阻止证人作证，指使、贿买、胁迫他人作伪证或者对证人、鉴定人、勘验人打击报复的，依照《中华人民共和国民事诉讼法》第一百零二条的规定将承担相应法律责任。
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