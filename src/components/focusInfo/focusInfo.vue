<style scoped>
    .expand-row{
        margin-bottom: 5px;
    }
</style>
<template>
    <div>
        <Card style="margin-bottom:10px">
            <div>{{briefName}}</div>
        </Card>
        <Card style="margin-bottom:10px;text-align:center;" v-show="!flag">
            <h3>该案件法官暂未发布争议焦点</h3>
        </Card>
        <Card style="margin-bottom:10px" v-show="flag">
            <label for="fouce">争议焦点：</label>
            <div name="fouce" style="display:inline-block;width:80%;vertical-align: top;margin-left:20px;min-height: 50px;">
                {{value8}}
                <!-- <Input name="fouce" disabled v-model="value8" type="textarea" :autosize="{minRows: 8,maxRows: 5}" placeholder="争议焦点"></Input>                 -->
            </div>
            <div style="text-align:center;margin-top:20px;">
                <!-- <Button v-show="flag" style="margin-right:90px" type="info">确认</Button> -->
                <Button  @click="addF" v-show="isReply" type="ghost">发表意见</Button>
            </div>
            <div class="titleLini">
                <span>补充争议焦点</span>
            </div>
            <div>
                 <Row style="margin-bottom:5px" v-for="item in replyList">
                    <Col span="2">
                        <!-- <span class="ygBtn">{{item.dsrStatus}}</span> -->
                    </Col>
                    <Col span="1" style="text-align: left; padding-right: 5px">
                        姓名：
                    </Col>
                    <Col span="3" style="text-align: left;">
                        {{item.litiName}}
                    </Col>
                    <Col span="17" style="text-align: left;">
                        {{item.createDate}}
                    </Col>
                    <Col span="2" style="text-align: left;">
                        
                    </Col>
                    <Col span="18" style="text-align: left;">
                        {{item.content}}
                    </Col>
                </Row>
            </div>
        </Card>
        <Modal
            v-model="modalAdd"
            title="补充意见"
            :loading="loading"
            cancel-text=""
            ok-text="提交"
            @on-ok="asyncOK">
            <Input name="fouce" v-model="addFouce"  type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="补充意见"></Input>
        </Modal>
    </div>
</template>
<script>
import myUpload from '../upload';
import { reply, fouceList } from "@/api/courtWitness/lawCase.js";
import { formatDate } from "@/libs/date";
export default {
    components: {
        myUpload
    },
    
    data() {
        return{
            caseLoading: false,
            disabled:true,
            disabled2:true,
            loading:true ,
            modalAdd:false,
            addFouce:"",
            flag:false,
            isReply:false,
            value8:'',
            plaintiffList: [],
            defendantList: [],
            thirdList: [],
            allContent:"",
            caseInfo: {
                id: "",
                caseNo: "",
                court: "",
                judge: "",
                clerk: "",
                filingDate: "",
                expireDate: "",
                brief: "",
                applyStandard: "",
                allMembers: ""
            },
            addFormItem:{
                evidenceName:'',
                pageNum:'',
                evidenceObject:'',
                evidenceWhere:''
            },
            title:"",
            conId:'',
            replyList:[],
        }       
    },
    props: {
      lowCaseId:[Number, String],
    //   contents:Object,
      briefName:String
    },
    created: function() {
    },
    methods:{
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        addF(){
            this.modalAdd=true;
        },
        getContents(){    //获取焦点
            this.replyList = [];
            fouceList(this.lowCaseId).then(res => {
                if(res.data.state == 100){
                    this.value8 = res.data.content;
                        if(res.data.flags == 1){
                            this.flag = true;
                        }else{
                            this.flag = false;
                        }
                        if(res.data.isReply == false){
                            this.isReply = true;
                        }else{
                            this.isReply = false;
                        }
                       this.conId = res.data.conId;
                       res.data.opinions.map((item, index) => {
                            const data = {};
                            data.id = item.id;
                            data.content = item.content;
                            data.createDate = formatDate(new Date(item.createDate), 'yyyy-MM-dd hh:mm');
                            var arys = item.litiName.split('*');
                            data.litiName = arys[1];
                            data.dsrStatus = arys[0];
                            this.replyList.push(data);
                        });
                }else{
                    this.flag = false;
                }
            })
        },
      edite(){
        if(this.disabled==true){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
        
      },
      showMod(){
          this.addFouce = "";
          this.modalAdd = true;
      },
      edite2(){
        if(this.disabled2==true){
          this.disabled2 = false;
        }else{
          this.disabled2 = true;
        }
        
      },
      uploadSuccess (response) {
            if (response.state == 100) {
                this.evidenceInfo.evidenceId = response.result.evidenceId
            } else {
                this.$Message.error(response.message);
            }
        },
      asyncOK(){
          console.log(this.conId);
          reply(this.conId, this.addFouce).then(res => {
            if (res.data.state == 100) {
                this.modalAdd = false;
                this.getContents();
                this.changeLoading();
            } else {
                this.$Message.error(res.data.message);
                this.changeLoading();
            }
            this.loading = false;
          })
      }
    }
};
</script>
<style>
.labe{
    display: inline-block;
    /* text-align: left; */
    margin-left:80px;
}
</style>
