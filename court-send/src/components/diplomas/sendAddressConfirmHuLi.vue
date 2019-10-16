<template>
   <div class="box">
       <div class="header">
             <!-- <h2>福建省厦门市湖里区人民法院</h2> -->
             <h2>送达地址确认书</h2>
       </div>
    <div>
     
      <div class="main">
          <Form>
            <Row>
                <Col span="2" class="maininfo-col maininfo-col-label">
                    案号
                </Col>
                <Col span="10" class="maininfo-col">
                    <Input v-model="backFill.caseNo"></Input>
                </Col>
                <Col span="2" class="maininfo-col maininfo-col-label">
                    案由
                </Col>
                <Col span="10" class="maininfo-col">
                    <Input v-model="backFill.briefName"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="2" class="maininfo-col grid250">
                    人民法院对当事人填写送达地址确认书的告知事项
                </Col>
                <Col span="22" class="maininfo-col grid250">
                   <div>
                    <p>1.为便于当事人及时收到人民法院文书，保证诉讼程序顺利进行，当事人及其诉讼代理人应当如实提供确切的送达地址。</p>
                    <p>2.如果提供的地址不确切，或不及时告知变更后的地址，使诉讼文书无法送达或未及时送达，当事人将自行承担由此可能产生的法律后果。</p>
                    <p>3.为提高送达效率，法院可以采用传真、电子邮件等方式送达诉讼文书，但判决书、裁定书、调解书除外。以发送方设备显示发送成功视为送达。</p>
                    <p>4.确认的送达地址适用于一审、二审、执行程序。如果送达地址有变更， 应当书面告知人民法院，未书面变更的以确认地址为送达地址。</p>
                    <p>5.因受送达人提供的送达地址不准确、拒不提供送达地址、送达地址变更未书面告知人民法院，导致文书未能被受送达人实际接收的，直接送达的，民事诉讼文书留在该地址之日为送达之日；邮寄送达的，文书被退回之日为送达之日。</p>
                    <p>6.当事人拒绝确认送达地址的，按照最高人民法院《关于进一步加强民事送达工作的若干意见》第八条、第九条规定的情形处理。</p>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="2" class="maininfo-col grid250" style="position: relative;line-height: 14px;height:390px">
                <span  style="font-size:12px;writing-mode: tb-rl;position: absolute;right:1px">︵诉讼代理人代为确认地址的，应当一并填写当事人的送达
地址和电话，未填写的，视为当事人拒绝确认送达地址。︶</span>
<span  style="font-size: 20px;writing-mode: tb-rl;float: left;width: 12px;left: 8px;text-align: center;position: absolute;height: 100%;">送达地址及方式</span>
                </Col>
                 <Col span="22" class="maininfo-col grid250" style="height:390px">
                   <div style="width:50%;border-right:1px solid black;height: 100%;">
                        <!-- <div>指定签收人：<div class="underline"></div> （如系他人，请注明与当事人关系）</div>
                        <div>证件类型：<div class="underline"></div>证件号码：<div class="underline"></div></div>
                        <div class="dis">确认送达地址：<div class="underline100" style="width:80%;"></div></div>
                        <div class="dis">是否接受电子送达：
                            <Checkbox value="" disabled></Checkbox>是
                            <Checkbox value="" disabled></Checkbox>否
                        </div>
                        <div class="dis"> <span>手机号码：</span> <div class="underline100" style="width:85%;"></div></div>
                        <div class="dis"><span>传真号：</span><div class="underline100" style="width:87.5%;"></div></div>
                        <div class="dis"><span>电子邮件：</span><div class="underline100" style="width:85%;"></div></div>
                        <div class="dis"><span>微信号：</span><div class="underline100" style="width:87.5%;"></div></div>
                        <div class="dis"><span>其他联系方式：</span><div class="underline100" style="width:80%;"></div></div> -->
                        <div style="border-bottom:1px solid black">
                            <p>当事人：</p>
                            <p>法定代表人：</p>
                        </div>
                        <div style="border-bottom:1px solid black">
                            <p>（<Checkbox value="" disabled></Checkbox>自然人
                            <Checkbox value="" disabled></Checkbox>法定代表人）</p>
                            <p>证件类型：</p>
                        </div>
                        <div style="border-bottom:1px solid black">
                            <p>证件号码：</p>
                        </div>
                        <div style="border-bottom:1px solid black;height:130px">
                            <p>送达地址（含邮编）：</p>
                        </div>
                        <div style="border-bottom:1px solid black">
                            <p>联系电话：</p>
                        </div>
                        <div style="border-bottom:1px solid black">
                            <p>是否同意接受短信送达：</p>
                        </div>
                        <div style="font-size:14px">
                            <p>电子送达地址（包括传真、电子邮件、微信等）：</p>
                        </div>
                    </div>
                    <div style="width:50%;height:100%;">
                        <div style="border-bottom:1px solid black">
                            <p>委托诉讼代理人：</p>
                            <p style="height:25px"></p>
                        </div>
                        <div style="border-bottom:1px solid black;height:53px">
                            <p>证件类型：</p>
                            <p style="height:25px"></p>
                        </div>
                        <div style="border-bottom:1px solid black;">
                            <p>证件号码：</p>
                        </div>
                        <div style="border-bottom:1px solid black;height:130px">
                            <p>送达地址（含邮编）：</p>
                        </div>
                        <div style="border-bottom:1px solid black">
                            <p>联系电话：</p>
                        </div>
                        <div style="border-bottom:1px solid black">
                            <p>是否同意接受短信送达：</p>
                        </div>
                        <div style="font-size:14px">
                            <p>电子送达地址（包括传真、电子邮件、微信等）：</p>
                        </div>
                        <!-- <div>指定签收人：<div class="underline"></div> （如系他人，请注明与当事人关系）</div>
                        <div>证件类型：<div class="underline"></div>证件号码：<div class="underline"></div></div>
                        <div class="dis">确认送达地址：<div class="underline100" style="width:80%;"></div></div>
                        <div class="dis">是否接受电子送达：
                            <Checkbox value="" disabled></Checkbox>是
                            <Checkbox value="" disabled></Checkbox>否
                        </div>
                        <div class="dis"> <span>手机号码：</span> <div class="underline100" style="width:85%;"></div></div>
                        <div class="dis"><span>传真号：</span><div class="underline100" style="width:87.5%;"></div></div>
                        <div class="dis"><span>电子邮件：</span><div class="underline100" style="width:85%;"></div></div>
                        <div class="dis"><span>微信号：</span><div class="underline100" style="width:87.5%;"></div></div>
                        <div class="dis"><span>其他联系方式：</span><div class="underline100" style="width:80%;"></div></div> -->
                    </div>
                </Col>  
            </Row>
            <Row>
                <Col  span="2" class="maininfo-col grid290">
                  受送达人确认
                </Col>
                 <Col  span="22" class="maininfo-col grid290">
                   <div>
                       <p class="textIndent">我已阅读（听明白）本确认书的告知事项，提供了上栏送达地址，确认了上栏送达方式，并保证所提供的送达地址各项内容是正确的、有效的。如在诉讼过程中送达地址发生变化，将及时书面通知法院。</p>
                       <Col push="9" class="paddings"> 受送达人（签名或签章）：</Col>
                       <Col push="17" class="paddings"> 年&emsp;&emsp;月&emsp;&emsp;日</Col>
                   </div>
                    
                </Col>
                
            </Row>
             <Row> 
                 <Col  span="2" class="maininfo-col grid50">
                  备考
                </Col>
                 <Col  span="22" class="maininfo-col textIndent grid50">
                  
                </Col>
             </Row>
       </Form>
      
     </div>
     <div>
            注：收到后请于一周内填妥寄回。
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
        title:'送达地址确认书'
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
      line-height:25px;
      display: flex;
      align-items: center;
    //   justify-content: center;
  }
  .ivu-form-item{
      margin-bottom: 3px;
  }
  .grid250{
      height: 350px;
  }
.grid290{
      height: 330px;
  }
  .grid50{
      height: 50px;
  }
  .underline{
    border-bottom: 1px solid black; 
    display: inline-block;
    width: 35.5%;
  }
  .dis{
      display: flex;
      }
  .underline100{
    border-bottom: 1px solid black; 
    // display: inline-block;
    // width: 79%;
  }
  .textIndent{
      text-indent:2em;  
  }
  .paddings{
           padding: 10px 0;
  }
</style>