<style scoped>
    .expand-row{
        margin-bottom: 5px;
    }
</style>
<template>
    <div>
        <Card style="margin-bottom:10px">
            <div style="line-height:30px"> <label class="labe">当前状态：</label> 当事人可在 <span style="color:red">{{date}}</span>  前提交证据，只有举证期内可以增加、编辑和删除证据。</div>
            <!-- <div style="line-height:30px"> <label class="labe"></label>填写答辩状，请点击<a >应诉答辩</a></div>             -->
            <div  style="line-height:30px"><label  class="labe">提示：</label>文书证据，可以扫描后上传；实物证据请拍照上传，并在开庭前将实物寄送到审理法院。</div>
        </Card>
        <Card style="margin-bottom:10px">
            <div>案由：{{briefName}}</div>
            <div style="margin-top: 10px;">
                <Button @click="showMod" type="info" style="margin-left:30px">新增</Button>
                <Button  type="info" style="margin-left:10px;display:none">生成证据清单</Button> 
                <Button @click="" type="info" style="margin-left:10px;display:none">结束举证</Button>
                <a href="" style=" position: absolute;right: 15px;top:60px;display:none">查看所有证据</a>
            </div>
        </Card>
        <Card style="margin-bottom:10px" v-for="item in allList">
            <p slot="title">
                {{item.dsrStatus}}：{{item.dsrName}}
                
            </p>
            <Table :columns="columns" :data="item.eviList" @on-selection-change="tableCheck"></Table>
            <div style="margin-top:15px;text-align:right">
                <Button  type="info" @click="sureEvi" style="margin-left:10px;display:inline-block">确认证据</Button>
            </div>
        </Card>
        <Card style="margin-bottom:10px;display:none">
            <p slot="title">
                dwad：dwda
                
            </p>
        </Card>

        <Modal
            v-model="modalAdd"
            :title="this.evidenceId=='' ? '添加证据' : '修改证据'"
            :loading="loading"
            cancel-text=""
            ok-text="提交"
            @on-ok="asyncOK"
            class="dadd"
            style="z-index:9999999">
            <Form :model="addFormItem" :label-width="85" inline>
                <FormItem label="*证据名称:"  style="width: 435px">
                    <Input v-model="addFormItem.evidenceName" placeholder="请输入证据名称" ></Input>
                </FormItem>
                <FormItem label="页数:"  style="width: 435px">
                    <Input v-model="addFormItem.pageNum" placeholder="请输入页数"></Input>
                </FormItem>
                <FormItem label="*证明对象:" style="width: 435px;">
                    <Input v-model="addFormItem.evidenceObject" placeholder="请输入证明对象"  ></Input>
                </FormItem>
                <FormItem label="*证据类型:"  style="width: 435px">
                    <Select v-model="addFormItem.evidenceType"  style="width: 100%;vertical-align:middle;">
                        <Option value="1" >申请书</Option>
                        <Option value="2" >起诉状</Option>
                        <Option value="3" >答辩状</Option>
                        <Option value="4" >异议书</Option>
                        <Option value="5" >证人证词</Option>
                    </Select>
                </FormItem>
                <FormItem label="*证据来源:"  style="width: 435px">
                    <Input v-model="addFormItem.evidenceWhere" placeholder="请输入证据来源"  ></Input>
                </FormItem>
                <FormItem label="*附件:"  style="width: 435px">
                    <!-- <myUpload
                      style="display: inline-block;margin-left:10px;"
                      ref="evidenceUpload"
                      action="/api/court/evidenceManage/upEvidence.jhtml"
                      :data="{lawCaseId: this.lowCaseId, evidenceId: this.evidenceId,uploadType:1}"
                      :on-success="uploadSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 170px;">上传附件</Button>
                    </myUpload> -->
                    <!-- <input type="file" @change="getFile($event)"> -->
                    <a href="javascript:;" class="a-upload">
                        <input type="file"  name="" @change="getFile($event)" id="upfil">点击这里上传文件
                    </a>
                    <div style="padding: 4px 10px;display:block;position: relative;top:-10px">
                        <p v-for="item in fileNlist">{{item.name}}<span @click="delFile(item.name,item.id)"><Icon type="close-circled"  style="cursor:pointer;margin-left:10px;"></Icon></span></p>
                    </div>
                </FormItem>
            </Form>
        </Modal>
         <Modal
            v-model="fileMod"
            title="附件列表"
            :loading="loading"
            cancel-text="关闭"
            class="dadd"
            style="z-index:9999999">
            <Table :columns="fileColumns" :data="fileLi"></Table>
            <div slot="footer">
                <Button @click="cloaseMod"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import myUpload from '../upload';
import { editEvi, delEvidence, getEvi, checkEvi, getEviById, deleteFile } from "@/api/witness/lawcaseInfo.js";
export default {
    components: {
        myUpload
    },
    data() {
        return{
            caseLoading: false,
            disabled:true,
            disabled2:true,
            fileMod:false,
            loading:true,
            modalAdd:false,
            evidenceId:'',
            value8:'',
            fileN:"",
            file:"",
            files:[],
            fileLi:[],
            fileNlist:[],
            plaintiffList: [],
            defendantList: [],
            thirdList: [],
            onSelectData:[],
            allList:[],
            isself:1,
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
                evidenceWhere:'',
                evidenceType:''
            },
            fileColumns:[
                {
                    title: "附件名称",
                    key: "fileName",
                    // width: 230,
                    align: "center",
                },
                {
                    title: "操作",
                    key: "name",
                    width: 100,
                    align: "center",
                     render: (h, params) =>{
                         return h("div",[
                             h(
                                "b",
                                {
                                props: {
                                    type: "img",
                                    size: "small"
                                },
                                on: {
                                    click: () => {
                                        var fileStr = params.row.fileAddr;
                                        if(fileStr == null){
                                            this.$Message.info("暂无附件");
                                            return false;
                                        }
                                        // 创建隐藏的可下载链接
                                        var eleLink = document.createElement("a");
                                        var strs = fileStr.split("/");
                                        // for (var i = 0; i < strs.length; i++) {
                                        //     if (i == strs.length - 1) {
                                        //     var filename = strs[i];
                                        //     }
                                        // }
                                        var filename = params.row.fileName;
                                        eleLink.download = filename;
                                        eleLink.style.display = "none";
                                        // 字符内容转变成blob地址
                                        eleLink.href = fileStr;
                                        // 触发点击
                                        document.body.appendChild(eleLink);
                                        eleLink.click();
                                        // 然后移除
                                        document.body.removeChild(eleLink);
                                    }
                                }
                                },
                                ""
                            ),
                         ])
                     }
                }
            ],
            columns: [
            {
                type: "selection",
                width: 60,
                align: "center"
             },
              {
                title: "证据名称",
                key: "name",
                width: 230,
                align: "center",
              },
              {
                title: "证明对象",
                key: "proves",
                width: 250,
                align: "center",
                render: (h, params) =>{
                    if(params.row.allText == 1){
                         return h("div", [
                            h(
                                "span",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        // marginRight: "5px",
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        'white-space': 'normal!important',
                                        'text-overflow': 'ellipsis',
                                        'word-wrap': 'break-word',
                                        '-webkit-line-clamp': '2',
                                        '-webkit-box-orient': 'vertical',
                                        padding:'5px',
                                    }
                                },
                                params.row.prove
                            ),
                            h(
                                "a",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    on: {
                                        click: (el) => {
                                            params.row.allText = 0;
                                        }
                                    }
                                },
                                '显示全文'
                            ),
                        ]);
                    }else{
                        return h("div", [
                            h(
                                "span",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        padding:'5px',
                                    }
                                },
                                params.row.prove
                            ),
                            h(
                                "a",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    on: {
                                        click: (el) => {
                                            params.row.allText = 1;
                                        }
                                    }
                                },
                                '收起'
                            ),
                        ]);
                    }
                   
                }
              },
              {
                title: "证明来源",
                key: "where",
                align: "center"
              },
              {
                title: "提交时间",
                key: "proveTime",
                width: 190,
                align: "center"
              },
            //   {
            //     title: "页数",
            //     key: "pageNum",
            //     width: 80,
            //     align: "center"
            //   },
              {
                title: "附件",
                key: "fileName",
                width: 60,
                align: "center",
                render: (h, params) => {
                    return h("div", [
                        // h(
                        //     "span",
                        //     {
                        //     props: {
                        //         type: "text",
                        //         size: "small"
                        //     }
                        //     },
                        //     params.row.fileName
                        // ),
                        h(
                            "b",
                            {
                            props: {
                                type: "img",
                                size: "small"
                            },
                            on: {
                                click: () => {
                                   if(params.row.fileL == null){
                                        this.$Message.info("暂无附件");
                                        return false;
                                    }
                                    this.fileLi = params.row.fileL;
                                    this.fileMod = true;
                                }
                            }
                            },
                            ""
                        ),
                    ]);
                }
              },
              {
                title: "操作",
                key: "attachment",
                width: 230,
                align: "center",
                render: (h, params) => {
                    return h("div", [
                    h(
                        "Button",
                        {
                        props: {
                            type: "text",
                            size: "small"
                        },
                        on: {
                            click: () => {
                                this.evidenceId = params.row.id;
                                this.modalAdd = true;
                                this.fileNlist = [];
                                this.files = [];
                                getEviById(this.lowCaseId, this.evidenceId).then(res => {
                                    if(res.data.state == 100){
                                        this.addFormItem.evidenceObject = res.data.result.prove;
                                        this.addFormItem.evidenceName = res.data.result.name;
                                        this.addFormItem.evidenceWhere = res.data.result.source;
                                        this.addFormItem.pageNum = res.data.result.pageno;
                                        this.fileN = res.data.result.fileName;
                                        res.data.result.file.map(item => {
                                            const data ={
                                                name:item.fileName,
                                                id:item.fileId
                                            }
                                            this.fileNlist.push(data)
                                        })
                                    }
                                    
                                })
                            }
                        }
                        },
                        "编辑"
                    ),
                    h(
                        "Button",
                        {
                        props: {
                            type: "text",
                            size: "small"
                        },
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    title: "",
                                    content: "<p>确定要删除该证据吗？</p>",
                                    okText: "确定",
                                    cancelText: "取消",
                                    onOk: () => {
                                        delEvidence(this.lowCaseId, params.row.id).then(res => {
                                            console.log()
                                            if (res.data.state == 100) {
                                                 this.$Message.success(res.data.message);
                                                 this.getEvit();
                                            } else {
                                                this.$Message.error(res.data.message);
                                            }
                                        })
                                    },
                                    onCancel: () => {
                                    
                                    }
                                });
                            }
                        }
                        },
                        "删除"
                    )
                    ]);
                }
              }
            ],
            title:""
        }       
    },
    props: {
      lowCaseId:[Number, String],
      briefName:String,
      eviList:Array,
      date:String
    },
    mounted:function(){
         console.log(222);
        this.allList = this.eviList;
        console.log(this.allList)
    },
    created: function() {
         console.log(33);
        console.log(this.eviList);
    },
    methods:{
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        cloaseMod(){
            this.fileMod = false;
        },
        tableCheck (selection) {
            this.onSelectData = [];
            for(var i=0;i<selection.length;i++){
                this.onSelectData.push(selection[i].id)
            }
            // this.onSelectData = selection;
            console.log(this.onSelectData)
        },
        /**
         * 确认证据
         */
        sureEvi(){
            if (this.onSelectData == '') {
                this.$Message.info('请选择需要确认的证据');
                return false;
            }
            var str = "";
            this.onSelectData.map((item, index) => {
                if (index == this.onSelectData.length - 1) {
                    str += item;
                } else {
                    str += item + ',';
                }
            });
            this.$Modal.confirm({
                title: "",
                content: "<p>确定要提前提交证据吗？</p>",
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                    checkEvi(this.lowCaseId, str).then(res => {
                        if(res.data.state == 100){
                            this.$Message.success(res.data.message);
                            this.getEvit();
                        }else{
                            this.$Message.error(res.data.message);
                        }
                    })
                },
                onCancel: () => {
                
                }
            });
            
        },
        getFile(event){
            this.file = event.target.files[0];
            for(var i=0;i<this.fileNlist.length;i++){
                if(this.file.name==this.fileNlist[i]){
                    return false;
                }
            }
            this.files.push(this.file)
            this.fileN = this.file.name;
            var datas = {
                name:this.file.name,
                id:''
            }
            this.fileNlist.push(datas);
            console.log(this.files);
        },
        delFile(name,id){
            if(id != ''){
                deleteFile(this.lowCaseId,this.evidenceId,id).then(res => {
                    if(res.data.state == 100){
                        this.$Message.success(res.data.message);
                        for(var i=0;i<this.fileNlist.length;i++){
                            if(id==this.fileNlist[i].id){
                                this.fileNlist.splice(i,1)
                            }
                        }
                    }else{
                        this.$Message.info(res.data.message);
                    }
                })
            }else{
                for(var i =0;i<this.files.length;i++){
                    if(name==this.files[i].name){
                        this.files.splice(i,1)
                    }
                }
                for(var i=0;i<this.fileNlist.length;i++){
                    if(name==this.fileNlist[i].name){
                        this.fileNlist.splice(i,1)
                    }
                }
            }
            
        },
        showd(){
            
            console.log(this.eviList);
        },
        getEviList(val){    //获取父组件传递过来的值
            console.log(val);
            this.allList = val;
        },
      edite(){
        if(this.disabled==true){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
        
      },
      showMod(){
          this.addFormItem = {
                evidenceName:'',
                pageNum:'',
                evidenceObject:'',
                evidenceWhere:''
          };
        document.getElementById("upfil").value = "";
          this.evidenceId = "";
          this.fileN = "";
          this.file = "";
          this.files = [];
          this.fileNlist = [];
          this.modalAdd = true;
      },
      edite2(){
        if(this.disabled2==true){
          this.disabled2 = false;
        }else{
          this.disabled2 = true;
        }
        
      },
      getEvit(){
          getEvi(this.lowCaseId, this.isself).then(res => {
            if(res.data.state == 100){
                var arr = [];
                res.data.result.map((item, index) => {
                    const ss = {};
                    ss.dsrName = item.dsrName;
                    ss.dsrStatus = item.dsrStatus;
                    arr.push(ss);
                });
                for(var i = 0; i < arr.length-1; i++){
                    for(var j = i+1; j < arr.length; j++){
                        if(arr[i].dsrName==arr[j].dsrName){
                            arr.splice(j,1);
                            j--;
                        }
                    }
                }
                var newArr = arr;
                for(var i=0;i<newArr.length;i++){
                    var arySmall = [];
                    res.data.result.map((item, index) => {
                        if(item.dsrName==newArr[i].dsrName){
                            const data = {};
                            data.id = item.evidenceId;
                            data.prove = item.prove;
                            if(data.prove.length > 35){
                                data.cellClassName = { proves: 'longText'}
                                data.allText = 1;
                            }else{
                                data.cellClassName = { proves: 'nolongText'}
                                data.allText = 0;
                            }
                            data.name = item.name;
                            data.fileAddr = item.fileAddr;
                            data.fileName = item.fileName;
                            data.fileL = item.file;
                            data.where = item.source;
                            // data.pageNum = item.
                            data.proveTime = item.time;
                            arySmall.push(data);
                        }
                    });
                    newArr[i].eviList = arySmall;
                }
                this.allList = newArr;
                console.log(this.allList)
            }else{
                    this.$Message.error(res.data.message);
            }
        })
      },
      uploadSuccess (response) {
            if (response.state == 100) {
                this.evidenceInfo.evidenceId = response.result.evidenceId
            } else {
                this.$Message.error(response.message);
            }
        },
      asyncOK(){
          if(this.addFormItem.evidenceName == ""){
              this.$Message.info('证据名称不能为空');
              this.changeLoading();
              return false;
          }
          if(this.addFormItem.evidenceObject == ""){
              this.$Message.info('证据对象不能为空');
              this.changeLoading();
              return false;
          }
          if(this.addFormItem.evidenceType == undefined){
            this.$Message.info('证据类型不能为空');
            this.changeLoading();
            return false;
          }
          if(this.addFormItem.evidenceWhere == ""){
              this.$Message.info('证据来源不能为空');
              this.changeLoading();
              return false;
          }
          if(this.files.length == 0 && this.evidenceId == ""){
              this.$Message.info('请上传证据文件');
              this.changeLoading();
              return false;
          }
          this.loading = true;
          console.log(this.addFormItem.evidenceName)
          var liniId = "";
          editEvi(
            this.files,
            this.lowCaseId,
            this.addFormItem.evidenceObject,
            this.addFormItem.evidenceName,
            this.addFormItem.evidenceWhere,
            this.addFormItem.pageNum,
            this.addFormItem.evidenceType,
            this.evidenceId,
            liniId
          ).then(res => {
              if(res.data.state == 100){
                  if(this.evidenceId == ""){
                      this.$Message.success(res.data.message);
                  }else{
                      this.$Message.success("修改成功");
                  }  
                   this.changeLoading();
                   this.modalAdd = false;
                   this.getEvit();
              }else{
                  this.$Message.error(res.data.message);
                  this.changeLoading();
              }
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
.dadd .ivu-modal{
    z-index:99999;

}
.a-upload {
    padding: 4px 10px;
    line-height: 20px;
    position: relative;
    cursor: pointer;
    color: #888;
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    *display: inline;
    *zoom: 1
}
.a-upload  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
}

.a-upload:hover {
    color: #444;
    background: #eee;
    border-color: #ccc;
    text-decoration: none
}
/* .dadd .ivu-modal-wrap{
    z-index:99998;
}
.dadd .ivu-modal-mask{
    z-index:99997;
} */
.ivu-table-cell p{
        text-align:left;
    }
    .ivu-table-cell b{
        background-image:url('../../images/download.png');
        background-size: 100% 100%; 
        display:inline-block;
        cursor: pointer;
        height: 30px;
        width:30px;
    }
.nolongText a{
    display:none;
}
.longText a{
    display:block;
}
</style>
