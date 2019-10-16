<template>
   <div class="box">
      <div class="main">
          <Form>
            <Row>
                <Col span="6" class=" grid152">
                    <Row>
                        <Col span="24" class="maininfo-col">
                            案号
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span="24" class="maininfo-col">
                        <!-- <FormItem  style="width: 100%;"> -->
                                <Input v-model="backFill.converCaseNo"></Input>
                            <!-- </FormItem> -->
                        
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24" class="maininfo-col">
                            案由
                        </Col>
                    
                    </Row>
                    <Row>
                        <Col span="24" class="maininfo-col">
                            <!-- <FormItem  style="width: 100%;"> -->
                                <Input v-model="backFill.briefName"></Input>
                            <!-- </FormItem> -->
                        </Col>
                    </Row>
                </Col>
                <Col span="1" class="maininfo-col grid152">
                    <Row>
                           <Col  span="24" style="line-height:55px" > &nbsp;&nbsp;&nbsp;原&emsp;告</Col> 
                    </Row>
                </Col>
                
                <Col span="8" class="maininfo-col grid152">
                      <Row>
                           <Col  span="24" >
                           <!-- <input type="textarea" :rows="4" v-model="backFill.plaintiffNamePhone" class="inputHeight"> -->
                           <Input v-model="backFill.plaintiffNamePhone" type="textarea" :rows="3" placeholder="原告" />
                           <Input v-model="backFill.plaintiffLawyerNamePhone" type="textarea" :rows="3" placeholder="原告律师" />
                           </Col> 
                      </Row>  
                      <!-- <Row>
                         <Col span="24" class="row"  style="border-top:1px solid black;"> <input type="text" v-model="backFill.plaintiffLawyerNamePhone" class="inputHeight"></Col>
                      </Row>  -->
                </Col>
                 <Col span="1" class="maininfo-col grid152">
                    <Row>
                           <Col  span="24" style="line-height:55px"> &nbsp;&nbsp;&nbsp;被&emsp;告</Col> 
                    </Row>
                    <!-- <Row>
                           <Col  span="24" class="row"  style="border-top:1px solid black;"> &nbsp;&nbsp;&nbsp;律&emsp;师</Col> 
                    </Row> -->
                       
                </Col>
                <Col span="8" class="maininfo-col grid152">
                      <Row>
                           <Col span="24" >
                           <!-- <input type="textarea" :rows="4" v-model="backFill.defendantNamePhone" class="inputHeight"> -->
                           <Input v-model="backFill.defendantNamePhone" type="textarea" :rows="3" placeholder="被告" />
                           <Input v-model="backFill.defendantLawyerNamePhone" type="textarea" :rows="3" placeholder="被告律师" />
                           </Col>
                      </Row>  
                      <!-- <Row>
                          <Col span="24" class="row"  style="border-top:1px solid black;"><input type="text" v-model="backFill.defendantLawyerNamePhone" class="inputHeight"></Col>
                      </Row>  -->
                </Col>
            </Row>
            <Row>
                <Col span="6" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col grid114">
                        备注
                        <Input v-model="backFill.remark" type="textarea" :rows="3" placeholder="备注" />
                        
                        </Col>
                    </Row>
                </Col>
                <Col span="6" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col row24" style="font-weight:600">待办事项</Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.todo1" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.todo2" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                </Col>
                <Col span="6" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col row24" style="font-weight:600">移交时间、申请时间</Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.transferApplyTime1 " type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.transferApplyTime2" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                </Col>
                <Col span="6" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col row24" style="font-weight:600">完成情况</Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.completion1 " type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.completion2" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                </Col>
                
            </Row>
            <Row>
                <Col span="6" class="grid180">
                    <Row>
                        <Col span="24" class="maininfo-col row45">
                            <span style="float:left;line-height:45px;"> 立案时间:</span>    <input type="text" style="width:125px;float:left;height:40px;" v-model="backFill.filingDate" >
                        </Col>
                    </Row>
                    <Row>
                         <Col span="24" class="maininfo-col row45">
                         <span style="float:left;line-height:45px;"> 承办人:</span>
                            <input type="text" style="width:125px;float:left;height:40px;" v-model="backFill.judgeName" >
                         </Col>
                    </Row>
                    <Row>
                         <Col span="24" class="maininfo-col row45">
                         <span style="float:left;line-height:45px;"> 书记员:</span>
                            <input type="text" style="width:125px;float:left;height:40px;" v-model="backFill.clerkName" >
                         </Col>
                    </Row>
                    <Row>
                         <Col span="24" class="maininfo-col row45">
                         <span style="float:left;line-height:45px;"> 审判法庭:</span>
                            <input type="text" style="width:125px;float:left;height:40px;" v-model="backFill.courtName" >
                         </Col>
                    </Row>
                </Col>
                <Col span="6" class="grid180">
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.todo3" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.todo4" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.def1" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.def2" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                </Col>
                <Col span="6" class="grid180">
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.transferApplyTime3 " type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.transferApplyTime4" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.def1Addr" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.def2Addr" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                </Col>
                <Col span="6" class="grid180">
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.completion3" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.completion4" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.completion5" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        <Input v-model="backFill.completion6" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col span="6" class="row45">
                    <Row>
                        <Col span="24" class="maininfo-col row45">
                            <span style="float:left;line-height:45px;"> 开庭时间:</span>  <span style="width:125px;float:left;height:40px;">{{backFill.startDate}}</span>  
                        </Col>
                    </Row>
                </Col>
                <Col span="6" class="row45">
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.defn" type="textarea" :rows="1"  />
                        </Col>
                    </Row>
                </Col>
                <Col span="6" class="row45">
                    <Row>
                        <Col  span="24" class="maininfo-col row45">

                        <Input v-model="backFill.defnAddr " type="textarea" :rows="1"  />
                        </Col>
                    </Row>

                </Col>
                <Col span="6" class="row45">
                    <Row>
                        <Col  span="24" class="maininfo-col row45">
                        
                        <!-- <span style="float:left;line-height:45px;"> 送达人:</span>    <input type="text" style="width:125px;float:left;height:40px;" v-model="backFill.filingDate" > -->
                        <!-- <Input v-model="backFill.completion3" type="textarea" :rows="1"  /> -->
                        </Col>
                    </Row>
                </Col>
            </Row>
           
           </Form>
      </div>
   </div>

</template>

<script type="text/javascript">
import { dbList } from '@/api/diplomas.js';
export default {
    data(){
        return{
            modelHid:true,
            courtName:this.$store.state.app.courtName
        }
    },
     props: {
        backFill:[Array,Object]
    },
    methods: {
        dipPro(litigantId,panelList){
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
                    requestContent:this.backFill.requestContent,
                    diplomsListJoin:this.backFill.diplomsListJoin,
                    you:this.backFill.you,
                    otherProofPeriod:this.backFill.otherProofPeriod,
                    plaintiffNameOrLawyerNameAndPhone:this.backFill.plaintiffNameOrLawyerNameAndPhone,
                    otherClerkName:this.backFill.otherClerkName,
                    plaintiffNameOrLawyerName:this.backFill.plaintiffNameOrLawyerName,
                    courtNum:this.backFill.courtNum,
                    courtTime:this.backFill.courtTime,
                    sentenceContent:this.backFill.sentenceContent,
                    converDefendantAddress1:this.backFill.converDefendantAddress1,
                    converDefendantAddress2:this.backFill.converDefendantAddress2,
                    converDefendantAddress3:this.backFill.converDefendantAddress3,
                    converDefendantAddress4:this.backFill.converDefendantAddress4,
                    converDefendantAddress5:this.backFill.converDefendantAddress5,
                    converDefendantAddress6:this.backFill.converDefendantAddress6,
                    todo1:this.backFill.todo1,
                    todo2:this.backFill.todo2,
                    todo3:this.backFill.todo3,
                    todo4:this.backFill.todo4,
                    todo5:this.backFill.todo5,
                    todo6:this.backFill.todo6,
                    transferApplyTime1:this.backFill.transferApplyTime1,
                    transferApplyTime2:this.backFill.transferApplyTime2,
                    transferApplyTime3:this.backFill.transferApplyTime3,
                    transferApplyTime4:this.backFill.transferApplyTime4,
                    transferApplyTime5:this.backFill.transferApplyTime5,
                    transferApplyTime6:this.backFill.transferApplyTime6,
                    completion1:this.backFill.completion1,
                    completion2:this.backFill.completion2,
                    completion3:this.backFill.completion3,
                    completion4:this.backFill.completion4,
                    completion5:this.backFill.completion5,
                    completion6:this.backFill.completion6,
                    def1:this.backFill.def1 ? this.backFill.def1 : "",
                    def2:this.backFill.def2 ? this.backFill.def2 : "",
                    defn:this.backFill.defn ? this.backFill.defn : "",
                    def1Addr:this.backFill.def1Addr ? this.backFill.def1Addr : "",
                    def2Addr:this.backFill.def2Addr ? this.backFill.def2Addr : "",
                    defnAddr:this.backFill.defnAddr ? this.backFill.defnAddr : "",
                    remark:this.backFill.remark,
                }
              dbList(
                data
              ).then(res=>{
                //    console.log('请求成功'+JSON.stringifyres.data.state))
               if(res.data.state == 100){
                console.log('请求成功'+res)
                this.modelHid = false
                 this.$emit('model',this.modelHid,res.data.result);
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
      width: 900px;
      height: 100%;
      display: block;
    //   border: 1px solid black;
      font-size: 14px;
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
      text-align: center;
      line-height:25px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center; 
      padding: 0;
  }
 .grid152{
     height: 152px;
 }
 
 .grid114{
     height: 114px;
 }
 .grid180{
     height: 180px;
 }
 .grid380{
     height: 455px;
 }
  .grid304{
     height: 380px;
 }
  .grid228{
     height: 304px;
 }
 .row100{
     height: 100px;
 }
 .row76{
     height: 76px;
 }
 .row45{
     height: 45px;
 }
 .row38{
     height: 38px;
 }
  .row24{
     height: 24px;
 }
 .row28{
     height: 28.5px;
 }
  .row54{
     height: 65.2px;
 }
    input{
      width: 100%;
      height: 30px;
      border: none;
      font-size: 15px;
      text-align: center;
  }
  .row{
      height: 75px;
  }
  .inputHeight{
        height: 72px;
  }
</style>