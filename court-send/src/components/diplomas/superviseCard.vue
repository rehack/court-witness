<template>
   <div class="box">
       <div class="header">
             <h2>厦门市湖里区人民法院廉政监督卡</h2>
       </div>
    <div>
     <Form>
      <div class="textIndent">
          为进一步加强对案件管理监督，规范办案行为，促进公正、廉洁、高效司法，维护你的合法权益，请对办案法官行为进行监督评议，并将结果及时向
          <strong>厦门市湖里区人民法院纪检组监察室反馈（邮编：361000，举报电话：0592-6036057，或直接投至设在厦门市湖里区人民法院的意见箱内）</strong>
      </div>
      <div class="main">
            <Row>
                <Col span="9" class="maininfo-col">
                    案号:<FormItem  style="width: 85%;"><Input v-model="backFill.caseNo"></Input></FormItem>
                </Col>
                <Col span="8" class="maininfo-col">
                   立案时间:<FormItem  style="width: 68%;"><Input v-model="backFill.filingDate" disabled></Input></FormItem>
                </Col>
                 <Col span="7" class="maininfo-col">
                   书记员:
                   <FormItem  style="width: 72%;"><Input v-model="backFill.clerkName"></Input></FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="7" class="maininfo-col">
                    承办部门:<FormItem  style="width: 62%;"><Input v-model="backFill.department"></Input></FormItem>
                </Col>
                <Col span="7" class="maininfo-col">
                   承办人:<FormItem  style="width: 70%;"><Input v-model="backFill.judgeName"></Input></FormItem>
                </Col>
                 <Col span="10" class="maininfo-col">
                   合议庭成员:
                   <FormItem  style="width: 70%;"><Input v-model="backFill.allMembers"></Input></FormItem>
                </Col>
            </Row>
             <Row>
                <Col span="24" class="maininfo-col">
                  <strong>请在相应方框内打√，并说明详情，以便掌握、核实。</strong>  
                </Col>
               
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    遵守法律法规情况
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    <div>
                        好<Checkbox value="" disabled></Checkbox>、
                        较好<Checkbox value="" disabled></Checkbox>、
                        一般<Checkbox value="" disabled></Checkbox>、
                       差<Checkbox value="" disabled></Checkbox>;
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    遵守廉政纪律情况
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    <div>
                        好<Checkbox value="" disabled></Checkbox>、
                        较好<Checkbox value="" disabled></Checkbox>、
                        一般<Checkbox value="" disabled></Checkbox>、
                       差<Checkbox value="" disabled></Checkbox>;
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    遵守办案纪律情况
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    <div>
                        好<Checkbox value="" disabled></Checkbox>、
                        较好<Checkbox value="" disabled></Checkbox>、
                        一般<Checkbox value="" disabled></Checkbox>、
                       差<Checkbox value="" disabled></Checkbox>;
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    遵守行为规范情况
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    <div>
                        好<Checkbox value="" disabled></Checkbox>、
                        较好<Checkbox value="" disabled></Checkbox>、
                        一般<Checkbox value="" disabled></Checkbox>、
                       差<Checkbox value="" disabled></Checkbox>;
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    遵守职业道德情况
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    <div>
                        好<Checkbox value="" disabled></Checkbox>、
                        较好<Checkbox value="" disabled></Checkbox>、
                        一般<Checkbox value="" disabled></Checkbox>、
                       差<Checkbox value="" disabled></Checkbox>;
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    办案质效
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    <div>
                        好<Checkbox value="" disabled></Checkbox>、
                        较好<Checkbox value="" disabled></Checkbox>、
                        一般<Checkbox value="" disabled></Checkbox>、
                       差<Checkbox value="" disabled></Checkbox>;
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    工作态度
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    <div>
                        好<Checkbox value="" disabled></Checkbox>、
                        较好<Checkbox value="" disabled></Checkbox>、
                        一般<Checkbox value="" disabled></Checkbox>、
                       差<Checkbox value="" disabled></Checkbox>;
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="3" class="maininfo-col grid70">
                    总体评价
                </Col>
                <Col span="21" class="maininfo-col grid70">
                    <div>
                        好<Checkbox value="" disabled></Checkbox>、
                        较好<Checkbox value="" disabled></Checkbox>、
                        一般<Checkbox value="" disabled></Checkbox>、
                       差<Checkbox value="" disabled></Checkbox>;
                     </div>
                     <!-- <p>详情：</p> -->
                </Col>
            </Row>
            <Row>
                <Col span="10" class="border">
                    结案时间：
                </Col>
                <Col span="14" class="border">
                   填卡人姓名：
                </Col>
            </Row>
            <Row>
                <Col span="10" class="border">
                    联系电话：
                </Col>
                <Col span="14" class="border">
                   联系地址：
                </Col>
            </Row>
         </div>   
    </Form>
     </div> 
       <p style="text-align:right;">厦门市湖里区人民法院监察室制  </p>
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
          title:'廉政监督卡'
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
      height: 70px;
  }

    .textIndent{
      text-indent:2em;  
      font-size: 15px;
  }
  .border{
      border-right:1px solid black !important;
     border-bottom:1px solid black !important;
     height: 40px;
  }
</style>