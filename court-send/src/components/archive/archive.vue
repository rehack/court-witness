<template>
  <div>
    <Row>
      <Col style="padding: 0px 5px;" :span="colOne" v-if="colOne != 0">
      <div class="ivu-transfer-list ivu-transfer-list-with-footer" style="width: 100%; min-height: 600px;">
        <div class="ivu-transfer-list-header">
          <!-- <label class="ivu-checkbox-wrapper ivu-checkbox-default">
              <span class="ivu-checkbox">
                <span class="ivu-checkbox-inner"></span> 
                <input type="checkbox" class="ivu-checkbox-input">
              </span> 
            </label>  -->
          <span class="ivu-transfer-list-header-title">案件列表</span>
          <Tooltip content="创建案件目录" placement="right">
            <!-- <Icon type="ios-add-circle" /> -->
            <span style="cursor:pointer;color: cornflowerblue;">
              <!-- + -->
              <Icon type="plus-round"></Icon>
            </span>
          </Tooltip>
          
          <!-- <span class="ivu-transfer-list-header-count" @click="downDirectoryList">下载勾选目录</span>
          <span class="ivu-transfer-list-header-count" style="padding-right: 8px;" @click="createdMu">创建目录</span> -->
        </div>
        <div class="ivu-transfer-list-body ivu-transfer-list-body-with-search ivu-transfer-list-body-with-footer">
          <div class="ivu-transfer-list-body-search-wrapper">
            <div class="ivu-transfer-list-search">
              <div class="ivu-input-wrapper ivu-input-wrapper-small ivu-input-type">
                <i class="ivu-icon ivu-icon-ios-search ivu-input-icon ivu-input-icon-normal"></i>
                <input v-model="keyWord" @change="filterCaseList" autocomplete="off" spellcheck="false" type="text" placeholder="请输入搜索内容" class="ivu-input ivu-input-small">
              </div>
            </div>
          </div>
          <div style="width: 100%;height:100%;overflow:auto;">
            <tree :data="catalogueShow" show-checkbox multiple allow-batch whole-row
              :contextmenu="showMenu"
              :cloaseM="cloaseMenu"
             @item-click="itemClick"></tree>
          </div>
          <ul>
            <li class="ivu-transfer-list-content-not-found">列表为空</li>
          </ul>
        </div>
        <div class="ivu-transfer-list-footer">
          <div style="float: right; margin: 5px;">
            <button @click="getCaseList()" type="button" class="ivu-btn ivu-btn-default ivu-btn-small">
              <span>刷新</span>
            </button>
          </div>
        </div>
      </div>
      </Col>
      <Col style="padding: 0px 5px;" :span="colTwo" v-if="colTwo != 0">
      <div class="ivu-transfer-list ivu-transfer-list-with-footer" style="width: 100%; min-height: 600px;">
        <div class="ivu-transfer-list-header">
          <!-- <label class="ivu-checkbox-wrapper ivu-checkbox-default">
              <span class="ivu-checkbox">
                <span class="ivu-checkbox-inner"></span> 
                <input type="checkbox" class="ivu-checkbox-input">
              </span> 
            </label>  -->
          <span class="ivu-transfer-list-header-title">文件列表</span>
          <!-- <span class="ivu-transfer-list-header-count" @click="downFileIdList">下载勾选文件</span> -->
        </div>
        <div class="ivu-transfer-list-body ivu-transfer-list-body-with-search ivu-transfer-list-body-with-footer">
          <div class="ivu-transfer-list-body-search-wrapper">
            <div class="ivu-transfer-list-search">
              <div class="ivu-input-wrapper ivu-input-wrapper-small ivu-input-type">
                <i class="ivu-icon ivu-icon-ios-search ivu-input-icon ivu-input-icon-normal"></i>
                <input autocomplete="off" @change="getfileList()" v-model="filena"   spellcheck="false" type="text" placeholder="请输入搜索内容" class="ivu-input ivu-input-small">
              </div>
            </div>
          </div>
          <div style="width: 100%;height:100%;overflow:auto;position: relative;">
            <Table border stripe size="small" :columns="columns2" :data="data2"></Table>
            <Table border stripe ref="selection" size="small" :columns="columns1"  :data="data1" @on-selection-change="selectChange" @on-row-click="selectRow" style="position: absolute;top:0;left:0;width:100%"></Table>
          </div>
          <ul>
            <li class="ivu-transfer-list-content-not-found">列表为空</li>
          </ul>
        </div>
        <div class="ivu-transfer-list-footer">
          <div style="float: right; margin: 5px;">
            <Page :current="pageNumber" :total="total" @on-change="changePage" :page-size="pageSize" simple />
          </div>
        </div>
      </div>
      </Col>
      <Col style="padding: 0px 5px;" :span="colThree">
      <div class="ivu-transfer-list ivu-transfer-list-with-footer" style="width: 100%; min-height: 600px;">
        <div class="ivu-transfer-list-header">
          <span class="ivu-transfer-list-header-title">预览</span>
          <span class="ivu-transfer-list-header-content">
            <span class="col-3" @click="selectedCol(3)" :class="colOne !=0 ? 'current' : ''"></span>
            <span class="col-2" @click="selectedCol(2)" :class="colOne ==0 && colTwo !=0 ? 'current' : ''"></span>
            <span class="col-1" @click="selectedCol(1)" :class="colOne == 0 && colTwo ==0 ? 'current' : ''"></span>
          </span>
          <span class="ivu-transfer-list-header-count">
            <Page :current="previewNumber" :total="preview.length" :page-size="1" simple @on-change="nextPreview" />
          </span>
        </div>
        <div class="ivu-transfer-list-body ivu-transfer-list-body-with-footer" style="overflow-y: auto;margin-top: 10px;height: 103.5%; ">
          <img v-show="isImage" ref="imageShow" src="" alt="" style="width: 100%">
          <iframe v-show="!isImage" :src="fileShow" width="100%" height="100%" frameborder="0" style="object-fit: fill;"></iframe>
        </div>
        <!-- <div class="ivu-transfer-list-footer">
            <div style="float: right; margin: 5px;height: 25px;">
            </div> 
          </div>-->
      </div>
      </Col>
    </Row>
    <div v-show="menuOpen" class="menud" id="menuDiv" style="position:absolute" v-on="eventss">
      <p @click="openUpload('addlist')">创建子目录并上传文件</p>
      <p @click="openUpload('addfile')">上传文件</p>
      <!-- <p>删除目录</p> -->
    </div>
    <Modal
        v-model="yjMol"
        width="560px"
        :mask-closable="closeM"
        title="邮寄信息">
        <!-- <div v-html="yjcontent">
            
        </div> -->
        
        <div  style="text-align: center;color:#999;">
          暂无数据
        </div>
        <div slot="footer"> 
            <Button @click=""  type="dashed" size="large">关闭</Button>
        </div>
    </Modal>
    <Modal
        v-model="creatMol"
        width="560px"
        :mask-closable="closeM"
        
        title="创建目录">
        <div >
            <Form  :label-width="160" inline >
                <FormItem label="新目录名称：" style="width: 505px;">
                    <Input v-model="dirName" placeholder="请输入目录名称：案号（多个用'，'拼接）" style="width: 300px" />
                </FormItem>
            </Form>
        </div>
        <div slot="footer"> 
            <Button @click="creatMol = false"  type="dashed" size="large">关闭</Button>
            <Button @click="addDir" :loading="filaeLoading"  type="primary" size="large">提交</Button>
        </div>
    </Modal>
    <Modal
        v-model="upMol"
        width="560px"
        :mask-closable="closeM"
        
        title="上传文件">
        <div >
            <Form  :label-width="160" inline v-show="isAddL">
                <FormItem label="新建子目录名称：" style="width: 505px;">
                    <Input v-model="dirTypeName" placeholder="请输入目录名称" style="width: 300px" />
                </FormItem>
            </Form>
            <Upload
                multiple
                type="drag"
                :before-upload="handleUpload"
                action="//jsonplaceholder.typicode.com/posts/">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽文件上传</p>
                </div>
            </Upload>
            <ul class="ivu-upload-list">
              <li class="ivu-upload-list-file ivu-upload-list-file-finish" v-for=" (item,index) in upFile">
                <span><i class="ivu-icon ivu-icon-document-text"></i> {{item.name}}</span> 
                <i class="ivu-icon ivu-icon-ios-close-empty ivu-upload-list-remove" @click="removeFile(item.name)" style=""></i>
              </li>
            </ul>
        </div>
        <div slot="footer"> 
            <Button @click="upMol = false"  type="dashed" size="large">关闭</Button>
            <Button @click="submitFile" :loading="filaeLoading"  type="primary" size="large">提交</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import tree from "./tree";
const R = require("ramda");
import { formatDate } from "../../libs/date.js";
import {
  getDiplomsLawCaseList,
  getDiplomsFileList,
  downloadDiplomsList,
  decDiploms,
  dirTypeAndUploadDiploms,
  createCaseDir,
  uploadElectronicFile
} from "@/api/archive.js";
export default {
  components: {
    tree
  },
  props : {
      dipName:{
          type:String,
          default:'',
      },
  },
  data() {
    return {
      colOne: 5,
      colTwo: 7,
      filena:"",
      dirName:"",
      menuOpen:false,
      colThree: 12,
      yjMol:false,
      isAddL:false,
      closeM:false,
      keyWord: "",
      creatMol:false,
      direcId:'',
      dirTypeName:"",
      upMol:false,
      filaeLoading:false,
      catalogueShow: [],
      selObj:{},
      catalogueData: [],
      eventss:{},
      pageSize: 25,
      pageNumber: 1,
      isOverAll:this.$store.getters.idDraw,
      total: 1,
      columns1: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "文件名",
          key: "name",
          align: "center",
          ellipsis: true
        },
        {
          title: "页数",
          width: 40,
          key: "page",
          align: "center",
          ellipsis: true
        },
        {
          title: "上传时间",
          width: 100,
          key: "time",
          align: "center",
          ellipsis: true,
          render: (h, params) => {
            return h(
              "span",
              {},
              formatDate(new Date(params.row.time), "yyyy-MM-dd hh:mm")
            );
          }
        }
      ],
      data1: [],
      upFile:[],
      data1Selection: [],
      nowCase:"",
      columns2: [
        {
          title: "sel",
          key: "sel",
          width: 40,
          align: "center",
          ellipsis: true
        },
        {
          title: "文件名",
          key: "name",
          align: "center",
          ellipsis: true
        },
        {
          title: "页数",
          width: 40,
          key: "page",
          align: "center",
          ellipsis: true
        },
        {
          title: "上传时间",
          width: 100,
          key: "time",
          align: "center",
          ellipsis: true
        }
      ],
      data2: [
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        },
        {
          name: "",
          page: "",
          time: ""
        }
      ],
      preview: [],
      previewNumber: 1,
      isImage: true,
      fileShow: "",
    };
  },
  created() {
    // 调用接口获取案件列表及目录
    // this.getCaseList();
    // const eventss = {
    //   mouseover: this.handleItemMouseOver,
    //   mouseout: this.handleItemMouseOut
    // };
    // this.eventss = eventss;
  },
  methods: {
    uploadFile(){

    },
    cloaseMenu(){
      this.menuOpen = false;
    },  
    handleUpload(file){
      for(var i=0;i<this.upFile.length;i++){
          if(file.name==this.upFile[i].name){
              return false;
          }
      }
      this.upFile.push(file);
      console.log(this.upFile)
      return false;
    },
    removeFile(name){
      console.log(name)
      for(var i=0;i<this.upFile.length;i++){
          if(name==this.upFile[i].name){
              this.upFile.splice(i,1)
          }
      }
    },
    submitFile(){
      if(this.dirTypeName == "" && this.isAddL != false){
        this.$Message.warning('请输入子目录名称');
        return false;
      }
      if(this.upFile.length == 0){
        this.$Message.warning('请选择上传文件');
        return false;
      }
      
      this.filaeLoading = true;
      dirTypeAndUploadDiploms(this.upFile,this.selObj.caseId,this.dirTypeName,this.selObj.id ? this.selObj.id : "").then(res => {
        this.filaeLoading = false;
        if(res.data.state == 100){
          this.$Message.success('上传成功');
          this.upMol = false;
          if(!this.isAddL){
            let datas= {};
            datas.model = this.selObj;
            this.itemClick(datas)
          }else{
            this.getCaseList(this.nowCase);
          }
          
        }else{
          this.$Message.warning(res.data.message);
        }
      })
    },
    openUpload(str){
      console.log(this.selObj)
      if(str == 'addlist'){
        this.isAddL = true;
        this.dirTypeName = "";
      }else{
        this.isAddL = false;
        this.dirTypeName = '';
      }
      this.upFile = [];
      this.upMol = true;
    },
    handleItemMouseOver(){
      this.menuOpen = true;
    },
    handleItemMouseOut(){
      this.menuOpen = false;
      this.$store.commit("SET_ISCL", true);
    },
    changeWideth(){

    },
    showMenu(ob){
      this.selObj = ob;
      console.log(this.selObj)
      var e = event || window.event; 
      // var x = event.clientX
      // var y = event.clientY
      var x = event.pageX
      var y = event.pageY

      var ed = document.getElementById('menuDiv');
      // var e = event || window.event;        
      // var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;       
      // var scrollY = document.documentElement.scrollTop || document.body.scrollTop;        
      // var x = e.pageX || e.clientX + scrollX;        
      // var y = e.pageY || e.clientY + scrollY;  
      
      this.isOverAll = this.$store.getters.idDraw;
      if(this.isOverAll == true){
        var xu = x;
      }else{
        var xu = x-200;
      }
      
      ed.style.left = xu + 'px';
      ed.style.top = y-104 + 'px';
      this.menuOpen = true;
    },
    getCaseList(caseNo) {
      let params = {
        caseNo,
        pageSize: 20,
        pageNumber: 1
      };
      this.data1Selection = [];
      this.$refs.selection.selectAll(false);
      this.nowCase = caseNo;
      this.catalogueShow = this.catalogueData = [];
      getDiplomsLawCaseList(params).then(res => {
        if (R.equals(res.data.state, 100)) {
          let data = res.data.fileList;
          R.map(item => {
            let object = {};
            object.caseId = item.fileOneId;
            object.text = item.fileOneName;
            object.selected = false;
            object.topClass = 1;
            if (item.fileOneName == "（2018）闽0206民初7288号") {
              let arr = [];
              // 应急代码
              item.fileOneList.map(itemsort => {
                switch (itemsort.fileTwoName) {
                  case "立案审批表":
                    arr[0] = itemsort;
                    break;
                  case "民事起诉状":
                    arr[1] = itemsort;
                    break;
                  case "民事诉讼举证通知书":
                    arr[2] = itemsort;
                    break;
                  case "受理案件通知书":
                    arr[3] = itemsort;
                    break;
                  case "律师事务所":
                    arr[4] = itemsort;
                    arr[4].fileTwoName = "当事人身份证明";
                    break;
                  case "诉状材料接收清单":
                    arr[5] = itemsort;
                    break;
                  case "证据材料":
                    arr[6] = itemsort;
                    break;
                  case "送达回证":
                    arr[7] = itemsort;
                    break;
                  case "送达确认书":
                    arr[8] = itemsort;
                    break;
                  default:
                    break;
                }
              });
              item.fileOneList = arr;
            }
            if (item.fileOneList.length != 0) {
              if(caseNo){
                object.opened = true;
              }else{
                object.opened = false;
              }
              object.children = [];
              R.map(secondLev => {
                let secondLevObject = {};
                secondLevObject.id = secondLev.fileTwoId;
                secondLevObject.text = secondLev.fileTwoName;
                secondLevObject.caseId = item.fileOneId;
                secondLevObject.selected = false;
                secondLevObject.topClass = 2;
                if (secondLev.fileTwoList.length != 0) {
                  secondLevObject.children = [];
                  secondLevObject.opened = false;
                  R.map(thirdLev => {
                    let thirdLevObject = {};
                    thirdLevObject.id = thirdLev.fileThreeId;
                    thirdLevObject.text = thirdLev.fileThreeName;
                    thirdLevObject.caseId = item.fileOneId;
                    thirdLevObject.secondId = secondLev.fileTwoId;
                    thirdLevObject.topClass = 3;
                    if (thirdLev.fileThreeList.length != 0) {
                      thirdLevObject.children = [];
                      thirdLevObject.opened = false;
                      R.map(fourthLev => {
                        let fourthLevObject = {};
                        fourthLevObject.id = fourthLev.fileFourId;
                        fourthLevObject.text = fourthLev.fileFourName;
                        fourthLevObject.caseId = item.fileOneId;
                        fourthLevObject.secondId = secondLev.fileTwoId;
                        fourthLevObject.thirdId = thirdLev.fileThreeId;
                        fourthLevObject.isLeaf = true;
                        thirdLevObject.children = R.append(fourthLevObject)(
                          thirdLevObject.children
                        );
                      })(thirdLev.fileThreeList);
                    } else {
                      thirdLevObject.isLeaf = true;
                    }
                    secondLevObject.children = R.append(thirdLevObject)(
                      secondLevObject.children
                    );
                  })(secondLev.fileTwoList);
                } else {
                  secondLevObject.isLeaf = true;
                }
                object.children = R.append(secondLevObject)(object.children);
              })(item.fileOneList);
            } else {
              object.isLeaf = true;
            }
            this.catalogueData = R.append(object)(this.catalogueData);
          })(data);
          this.catalogueShow = this.catalogueData;
          console.log(this.catalogueShow);
        } else {
          this.$Message.error(res.data.message);
        }
      });
      // .catch(err => {
      //   this.$Message.error("服务器错误，请稍后再试！");
      // });
    },
    filterCaseList() {
      // if (this.keyWord === "") {
      //   this.catalogueShow = this.catalogueData;
      // } else {
      this.getCaseList(this.keyWord);
      // this.catalogueShow = R.filter(item => {
      //   return R.gte(item.text.indexOf(this.keyWord))(0);
      // })(this.catalogueData);
    },
    getfileList(){
      console.log(this.direcId)
      let params = {
          directory: this.direcId,
          fileName:this.filena,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
      }
      getDiplomsFileList(params).then(res => {
        if (res.data.state == 100) {
          let list = res.data.fileList;
          this.total = res.data.total;
          this.data1 = [];
          // R.map(item => {
          //   let object = {};
          //   object.id = item.groupList[0].groupId;
          //   object.name = item.groupName;
          //   object.time = item.groupList[0].createDate;
          //   object.path = item.groupList;
          //   object.page = item.groupList.length;
          //   arr = R.append(object)(arr);
          // })(list);
          // 临时
          let sortarr = [];
          if (params.directory == "8cdfece0-b7c8-11e8-b39a-00163e0af9c6,") {
            if (list.length == 1) {
              R.map(item => {
                let object = {};
                object.id = item.groupList[0].groupId;
                object.name = item.groupName;
                object.time = item.groupList[0].createDate;
                object.path = item.groupList;
                object.page = item.groupList.length;
                sortarr = R.append(object)(sortarr);
              })(list);
            } else {
              R.map(item => {
                let objsort = {};
                switch (item.groupName) {
                  case "立案审批表":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[0] = objsort;
                    break;
                  case "民事起诉状":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[1] = objsort;
                    break;
                  case "民事诉讼举证通知书":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[2] = objsort;
                    break;
                  case "受理案件通知书":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[3] = objsort;
                    break;
                  case "律师事务所":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = "当事人身份证明";
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[4] = objsort;
                    break;
                  case "诉状材料接收清单":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[5] = objsort;
                    break;
                  case "证据材料":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[6] = objsort;
                    break;
                  case "送达回证":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[7] = objsort;
                    break;
                  case "送达确认书":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[8] = objsort;
                    break;
                  default:
                    break;
                }
              })(list);
            }
            this.data1 = R.concat(sortarr)(this.data1);
          } else {
            let arr = [];
            R.map(item => {
              let object = {};
              object.id = item.groupList[0].groupId;
              object.name = item.groupName;
              object.time = item.groupList[0].createDate;
              object.path = item.groupList;
              object.page = item.groupList.length;
              arr = R.append(object)(arr);
            })(list);
            this.data1 = R.concat(arr)(this.data1);
          }

          // let eqId = R.eqBy(R.prop("id"));
          // this.data1 = R.concat(
          //   R.differenceWith(eqId, arr, this.data1),
          //   this.data1
          // );
        } else {
          this.data1 = [];
          this.$Message.error(res.data.message);
        }
      })
    },
    itemClick(node) {
      console.log(node.model);
      
      // if (!R.has("children")(node.model)) {
      let params = {};
      if (!R.has("id")(node.model)) {
        params = {
          directory: `${node.model.caseId},`,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        };
      } else {
        params = {
          directory: `${node.model.caseId},${node.model.id}`,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        };
      }
      console.log(params)
      this.direcId = params.directory;
      getDiplomsFileList(params).then(res => {
        if (res.data.state == 100) {
          let list = res.data.fileList;
          this.total = res.data.total;
          this.data1 = [];
          // R.map(item => {
          //   let object = {};
          //   object.id = item.groupList[0].groupId;
          //   object.name = item.groupName;
          //   object.time = item.groupList[0].createDate;
          //   object.path = item.groupList;
          //   object.page = item.groupList.length;
          //   arr = R.append(object)(arr);
          // })(list);
          // 临时
          let sortarr = [];
          if (params.directory == "8cdfece0-b7c8-11e8-b39a-00163e0af9c6,") {
            if (list.length == 1) {
              R.map(item => {
                let object = {};
                object.id = item.groupList[0].groupId;
                object.name = item.groupName;
                object.time = item.groupList[0].createDate;
                object.path = item.groupList;
                object.page = item.groupList.length;
                sortarr = R.append(object)(sortarr);
              })(list);
            } else {
              R.map(item => {
                let objsort = {};
                switch (item.groupName) {
                  case "立案审批表":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[0] = objsort;
                    break;
                  case "民事起诉状":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[1] = objsort;
                    break;
                  case "民事诉讼举证通知书":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[2] = objsort;
                    break;
                  case "受理案件通知书":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[3] = objsort;
                    break;
                  case "律师事务所":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = "当事人身份证明";
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[4] = objsort;
                    break;
                  case "诉状材料接收清单":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[5] = objsort;
                    break;
                  case "证据材料":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[6] = objsort;
                    break;
                  case "送达回证":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[7] = objsort;
                    break;
                  case "送达确认书":
                    objsort.id = item.groupList[0].groupId;
                    objsort.name = item.groupName;
                    objsort.time = item.groupList[0].createDate;
                    objsort.path = item.groupList;
                    objsort.page = item.groupList.length;
                    sortarr[8] = objsort;
                    break;
                  default:
                    break;
                }
              })(list);
            }
            this.data1 = R.concat(sortarr)(this.data1);
          } else {
            let arr = [];
            R.map(item => {
              let object = {};
              object.id = item.groupList[0].groupId;
              object.name = item.groupName;
              object.time = item.groupList[0].createDate;
              object.path = item.groupList;
              object.page = item.groupList.length;
              arr = R.append(object)(arr);
            })(list);
            this.data1 = R.concat(arr)(this.data1);
          }

          // let eqId = R.eqBy(R.prop("id"));
          // this.data1 = R.concat(
          //   R.differenceWith(eqId, arr, this.data1),
          //   this.data1
          // );
        } else {
          this.data1 = [];
          this.$Message.error(res.data.message);
        }
      });
      // }
    },
    changePage(num){
      this.pageNumber = num;
      this.getfileList()
      console.log(num)
    },
    selectRow(item) {
      this.preview = item.path;
      this.previewNumber = 1;
      decDiploms({ fileId: this.preview[0].fileId }).then(res => {
        if (res.data.state == 100) {
          if (this.checkImg(res.data.result)) {
            this.isImage = true;
            this.$refs.imageShow.src = res.data.result;
          } else if (
            this.checkPDF(res.data.result) ||
            this.checkMP3(res.data.result)
          ) {
            this.isImage = false;
            this.fileShow = res.data.result;
          } else {
            this.isImage = false;
            this.fileShow =
              "https://view.officeapps.live.com/op/view.aspx?src=" +
              location.host +
              res.data.result;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    nextPreview(pageNum) {
      this.previewNumber = pageNum;
      let fileId = this.preview[this.previewNumber - 1].fileId;
      decDiploms({ fileId: fileId }).then(res => {
        if (res.data.state == 100) {
          if (this.checkImg(res.data.result)) {
            this.isImage = true;
            this.$refs.imageShow.src = res.data.result;
          } else if (
            this.checkPDF(res.data.result) ||
            this.checkMP3(res.data.result)
          ) {
            this.isImage = false;
            this.fileShow = res.data.result;
          } else {
            this.isImage = false;
            this.fileShow =
              "https://view.officeapps.live.com/op/view.aspx?src=" +
              location.host +
              res.data.result;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    selectedCol(num) {
      if (num == 3) {
        this.colOne = 5;
        this.colTwo = 7;
        this.colThree = 12;
      } else if (num == 2) {
        this.colOne = 0;
        this.colTwo = 9;
        this.colThree = 15;
      } else {
        this.colOne = 0;
        this.colTwo = 0;
        this.colThree = 24;
      }
    },
    addDir(){
      console.log(this.dirName);
      let strs = this.dirName.replace(RegExp("，", "g"),",");
      console.log(strs)
      let data = {
        caseNo:strs
      }
      this.filaeLoading= true;
      createCaseDir(data).then(res => {
        this.filaeLoading= false;
        if(res.data.state == 100){
          this.$Message.success('创建成功');
          this.creatMol = false;
          this.getCaseList(this.nowCase);
        }else{
          this.$Message.warning(res.data.message);
        }
      })
    },
    createdMu(){
      this.creatMol = true;
    },
    downDirectoryList() {
      let arr = [];
      arr.push(R.filter(R.propEq("selected", true))(this.catalogueData));
      R.map(item => {
        if (
          R.has("children", item) &&
          item.children.length != 0 &&
          item.selected == false
        ) {
          arr.push(R.filter(R.propEq("selected", true))(item.children));
          R.map(item1 => {
            if (
              R.has("children", item1) &&
              item1.children.length != 0 &&
              item1.selected == false
            ) {
              arr.push(R.filter(R.propEq("selected", true))(item1.children));
              R.map(item2 => {
                if (
                  R.has("children", item2) &&
                  item2.children.length != 0 &&
                  item2.selected == false
                ) {
                  arr.push(
                    R.filter(R.propEq("selected", true))(item2.children)
                  );
                }
              })(item1.children);
            }
          })(item.children);
        }
      })(this.catalogueData);
      arr = R.flatten(arr);

      arr = R.map(item => {
        let obj = {};
        obj.caseId = item.caseId;
        obj.catalogId = item.id;
        return obj;
      })(arr);
      console.log(arr);

      let data = {
        directoryList: arr,
        fileIdList: []
      };
      this.downDipList(data);
    },
    selectChange(selection) {
      this.data1Selection = selection;
     
    },
    NowSel(){
      if(this.data1Selection.length < 1){
         this.$Message.info('请在文件列表勾选文件');
      }else{
        let ary = [];
        let str = '';
        this.data1Selection.map(item => {
          str = str + item.path[0].filePath + ","

        })
        uploadElectronicFile(str).then(res => {
          if(res.data.state == 100){
            res.data.fileList.map(it => {
              let aryss = it.split(".");
              let xar = aryss[aryss.length-2].split("/");
              let type = aryss[aryss.length-1];
              let name = xar[xar.length-1];
              const dt = {
                name:name + "." + type,
                urlName:it
              }
              ary.push(dt)
            })
            console.log(ary)
            console.log(this.dipName);
            this.$emit('onChangeDips',ary,this.dipName);
          }else{
            this.$Message.info(res.data.message);
          }
        })
      }
    },
    downFileIdList() {
      console.log(this.data1Selection)
      return false;
      let arr = R.flatten(
        R.map(item => {
          return R.map(item1 => {
            return item1.fileId;
          })(item.path);
        })(this.data1Selection)
      );
      console.log(arr);
      let data = {
        directoryList: [],
        fileIdList: arr
      };
      this.downDipList(data);
    },
    downDipList(data) {
      downloadDiplomsList(data).then(res => {
        if (res.data.state == 100) {
          var a = document.createElement("a");
          a.href = res.data.path;
          a.download = "打包(" + formatDate(new Date(), "MM-dd hh:mm:ss") + ")";
          a.click();
        } else {
          this.$Message.info(res.data.message);
        }
      });
    },
    checkImg(fileName) {
      let index = fileName.indexOf(".");
      fileName = fileName.substring(index);
      if (
        fileName !== ".bmp" &&
        fileName !== ".png" &&
        fileName !== ".gif" &&
        fileName !== ".jpg" &&
        fileName !== ".jpeg"
      ) {
        // 根据后缀，判断是否符合图片格式
        return false;
      } else {
        return true;
      }
    },

    checkPDF(fileName) {
      let index = fileName.indexOf(".");
      fileName = fileName.substring(index);
      if (fileName !== ".pdf") {
        return false;
      } else {
        return true;
      }
    },
    checkMP3(fileName) {
      let index = fileName.indexOf(".");
      fileName = fileName.substring(index);
      if (fileName !== ".mp3") {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style>
.ivu-table-cell {
  padding: 0;
  text-align: center;
}
.ivu-table-small th,
.ivu-table-small td {
  height: 25px;
}
.ivu-transfer-list-header-content {
  font-size: 0px;
  position: absolute;
  top: 6px;
  left: 60px;
}
.menud{
  background: #fff;
  box-shadow: rgb(204, 204, 204) 2px 2px 5px;
  padding: 5px;
  border: 1px solid rgb(204, 204, 204);
}
.menud p{
  cursor: pointer;
  padding:2px;
  margin-bottom:5px;
}
.menud p:hover{
  background:#666; 
  color: #fff;
}
.ivu-transfer-list-header-content span {
  display: inline-block;
  width: 28px;
  height: 26px;
  font-size: 0px;
  border: 2px solid #77818f;
  box-sizing: content-box;
  cursor: pointer;
}
.ivu-transfer-list-header-content .col-3 {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  background: url("../../images/col-3-b.png") 0px -1px;
  background-size: cover;
  border-right: none;
}
.ivu-transfer-list-header-content .col-3.current {
  background: url("../../images/col-3-w.png") 0px -1px;
  background-size: cover;
}
.ivu-transfer-list-header-content .col-2 {
  background: url("../../images/col-2-b.png") 0px -1px;
  background-size: cover;
}
.ivu-transfer-list-header-content .col-2.current {
  background: url("../../images/col-2-w.png") 0px -1px;
  background-size: cover;
}
.ivu-transfer-list-header-content .col-1 {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  background: url("../../images/col-1-b.png") 0px -1px;
  background-size: cover;
  border-left: none;
}
.ivu-transfer-list-header-content .col-1.current {
  background: url("../../images/col-1-w.png") 0px -1px;
  background-size: cover;
}
.ivu-transfer-list-header-count {
  cursor: pointer;
  color: cornflowerblue;
  text-decoration: underline;
}
</style>
