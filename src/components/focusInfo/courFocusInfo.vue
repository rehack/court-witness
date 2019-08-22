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
        <Card style="margin-bottom:10px">
            <label for="fouce">争议焦点</label>
            <div name="fouce" style="display:inline-block;width:80%;vertical-align: top;margin-left:20px">
                <Input name="fouce" :disabled="edit" v-model="fouceContent" type="textarea" :autosize="{minRows: 8,maxRows: 5}" placeholder="请编辑争议焦点"></Input>                
            </div>
            <div style="text-align:left;margin-top:20px;">
                <Button @click="editFouce" type="ghost">编辑</Button>
                <Button @click="sureFouce" style="margin-left:15px" type="info">保存</Button>
                <Button @click="showFouce" style="margin-left:15px" type="info">发布</Button>
            </div>
        </Card>
        <Card style="margin-bottom:10px">
            <div class="titleLini">
                <span>当事人补充争议焦点</span>
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
            title="补充争议焦点"
            :loading="loading"
            cancel-text=""
            ok-text="提交"
            @on-ok="asyncOK">
            <Input name="fouce" v-model="value8"  type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="争议焦点"></Input>
        </Modal>
    </div>
</template>
<script>
import myUpload from '../upload';
import { addFouce, editFouce, fouceList, publish } from "@/api/courtWitness/lawCase.js";
import { formatDate } from "@/libs/date";
export default {
    components: {
        myUpload
    },
    created: function() {
        console.log(222);
    },
    data() {
        return{
            caseLoading: false,
            edit:true,
            value8:"",
            disabled2:true,
            content:'',
            loading:false,
            modalAdd:false,
            fouceContent:"",
            replyList:[],
            conId:'',
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
            title:""
        }       
    },
    props: {
      lowCaseId:[Number, String],
      briefName:String
    },
    methods:{
      edite(){
        if(this.disabled==true){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
        
      },
      changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
      getContents(value){    //获取焦点
            this.replyList = [];
            console.log(1115)
            if(value != ""){
                this.lowCaseId = value;
            }
            fouceList(this.lowCaseId).then(res => {
                if(res.data.state == 100){
                    this.fouceContent = res.data.content;
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
                    // this.$Message.error(res.data.message);
                    this.edit = false;
                }
            })
        },
      showMod(){
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
      sureFouce(){  //新增&编辑
        if( this.conId != ""){  //编辑
            editFouce(this.conId, this.fouceContent).then(res => {
                if(res.data.state == 100){
                    this.$Message.success("保存成功");
                    this.edit = true;
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        }else{  //新增
            addFouce(this.lowCaseId, this.fouceContent).then(res => {
                if(res.data.state == 100){
                    this.$Message.success(res.data.message);
                    this.conId = res.data.conId;
                    this.edit = true;
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        }
        
        
      },
      showFouce(){  //发布
        if(this.conId == ""){
            this.$Message.info("发布前请编辑并保存争议焦点");
            return false;
        }
        publish(this.conId).then(res => {
            if(res.data.state == 100){
                this.$Message.success(res.data.message);
            }else{
                this.$Message.error(res.data.message);
            }
        })
      },
      editFouce(){  //编辑
          if(this.edit == false){
              this.edit = true;
          }else{
              this.edit = false;
            //   this.fouceContent = this.content;
          }
        
      },
      asyncOK(){

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
.titleLini{
    margin-bottom: 10px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
}
</style>
