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
                    告知事项
                </Col>
                <Col span="22" class="maininfo-col grid250">
                   <div>
                    <p>1.为了便于当事人及时收到人民法院诉讼文书，保证诉讼程序顺利进行，当事人应当如实提供确切的送达地址;</p>
                    <p>2.如果提供的地址不确切，或不及时告知变更后的地址，使诉讼文书无法送达或为及时送达，当事人将自行承担由此可能产生的法律后果；</p>
                    <p>3.为提高送达效率，法院可以采取传真、电子邮件等方式送达诉讼文书，但判决书、裁定书、调解书除外，以发送方设备显示发送成功视为送达；</p>
                    <p>4.<strong>确认的送达地址适用于一审、二审、再审审查、执行程序。如果送达地址有变更，应当及时书面告知人民法院变更后的送达地址；</strong> </p>
                    <p>5.有关送达的法律规定，见本确认书后页。</p>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="2" class="maininfo-col grid250">
                    送达地址及方式
                </Col>
                 <Col span="22" class="maininfo-col grid250">
                   <div style="width:100%;">
                        <div>指定签收人：<div class="underline"></div> （如系他人，请注明与当事人关系）</div>
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
                        <div class="dis"><span>其他联系方式：</span><div class="underline100" style="width:80%;"></div></div>
                    </div>
                </Col>  
            </Row>
            <Row>
                <Col  span="2" class="maininfo-col grid290">
                  受送达人确认
                </Col>
                 <Col  span="22" class="maininfo-col grid290">
                   <div>
                       <p class="textIndent">一、本人已阅读本确认书的告知事项，并清楚了解其内容及法律意义；</p>
                       <p class="textIndent">二、本人承诺基于诚信原则进行所有诉讼活动，保证上述送达地址是准确、有效的，如无法送达，将承担相应法律责任；</p>
                       <p class="textIndent">三、本人承诺，诉讼过程中，本人送达地址、联系方式（包括手机号码、传真号码、电子邮箱等）若有变更，或者中途撤销委托代理、委托新的代理人，需要变更送达地址的，将以书面形式告知人民法院，确认新的送达地址，否则，人民法院可以上述地址为送达地址；</p>
                       <p class="textIndent">四、本人确认以上地址为本案一审、二审、再审审查、执行程序的送达地址。</p>
                       <Col push="9" class="paddings"> 受送达人签名、盖章或捺印:</Col>
                       <Col push="17" class="paddings"> 年&emsp;&emsp;月&emsp;&emsp;日</Col>
                   </div>
                    
                </Col>
                
            </Row>
             <Row> 
                 <Col  span="2" class="maininfo-col grid50">
                  备注
                </Col>
                 <Col  span="22" class="maininfo-col textIndent grid50">
                  当事人授权委托代理人代为签收法律文书的，代理人应当同时提交当事人签名确认的本人送达地址。
                </Col>
             </Row>
       </Form>
      
     </div>
     <div>
            注：收到后请于一周内填妥并寄回厦门市湖里区人民法院。
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
      height: 250px;
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