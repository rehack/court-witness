<template>
    <div>
        <!-- <Card>
            <Row style="padding-bottom: 10px;">
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">文书送达地图</span>
                </Col>
                <Col span="21">
                    
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="searchData" inline :label-width="100" v-show="show1" @keydown.native.enter.prevent="search">
                        <FormItem label="案号">
                            <Input style="width: 200px" v-model="searchData.caseNo"/>
                        </FormItem>
                        <FormItem label="部门：">
                            <Select v-model="searchData.courtId" style="width:200px">
                                <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="案由">
                          <Select v-model="searchData.briefName" style="width: 200px;vertical-align:middle;">
                            <Option v-for="item in briefList" :value="item.brief" :key="item.brief">{{ item.brief }}</Option>
                          </Select>
                        </FormItem>
                        <FormItem label="立案时间">
                            <DatePicker style="width:175px;" type="daterange" placeholder="选择日期" v-model="searchData.date" />
                        </FormItem>
                        <div style="display: inline-block; padding-right: 30px;float: right;">
                            <Button type="ghost" @click="search">查询</Button>
                            <Button style="margin-left: 10px" type="ghost" @click="empty">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Table stripe :columns="dipcol" :data="dipdata" @on-selection-change="tableCheck" ></Table>
            
            <div style="margin: 10px;overflow: hidden">
                <div style="float: left;">
                    <Button  style="margin-left: 10px;margin-bottom: 10px;" type="primary" >
                        生成地址
                    </Button>
                </div>
                <div style="float: right;">
                    <Page :total="totalPage" :page-size="1" :current="searchData.pageNumber" @on-change="changePage"></Page>
                </div>
            </div>
        </Card> -->
        <Card style="margin-top:20px;height:100%;">
            <div class="drawMenu">
                <Dropdown trigger="click" placement="bottom-start" :visible="visible" 
                style="margin-left: 20px;padding: 8px 6px;border: 1px solid #2d8cf0;border-radius: 16px;background: #fff;">
                    <a href="javascript:void(0)" @click="handleOpen">
                        案件列表
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <!-- <p>常用于各种自定义下拉内容的场景。</p> -->
                        <div>
                            <Form :model="searchData" inline :label-width="100"  @keydown.native.enter.prevent="search">
                                <FormItem label="案号">
                                    <Input style="width: 200px" v-model="searchData.caseNo"/>
                                </FormItem>
                                <FormItem label="部门：">
                                    <Select v-model="searchData.courtId" style="width:200px">
                                        <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                                <div style="display: inline-block; padding-right: 30px;">
                                    <Button type="ghost" @click="search">查询</Button>
                                </div>
                            </Form>
                        </div>
                        <div style="width:450px;height:230px;display: inline-block;margin:5px 10px">
                            <p>案件列表：</p>
                            <Table height="220" ref="selectTable" :columns="detailColumns" :data="noneData" @on-select="onSelectCon" @on-selection-change="onSelectChangeCon" style="margin-top: 10px;"></Table>
                        </div>
                        <!-- <div style="width:60px;height:230px;display: inline-block;">
                            
                        </div> -->
                        <div style="width:450px;height:220px;display: inline-block;margin:5px 15px">
                            <p>选中案件：</p>
                            <Table height="220" ref="selection" :columns="detailColumns" :data="selData" @on-select="onSelectCon" @on-selection-change="onSelectChangeCon2" style="margin-top: 10px;"></Table>
                        </div>
                        <div style="margin:10px;">
                            <Button style="float: right;" type="dashed" @click="handleClose">关闭</Button>
                            <Button style="float: right;margin-right:20px;" @click="searchMap" :loading="searchL"  type="primary" >查询</Button>
                        </div>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Button class="daoCls daoCls-left" @click="allExcel" type="dashed">全部导出EXCL</Button>
            <Button class="daoCls daoCls-right" @click="selectedExcel" type="dashed">选中导出EXCL</Button>
            <baidu-map class="map" :location="location" 
                :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true" :reload="reload"
                >
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-driving
                :start="startAdress"
                :end="endAdress"
                :auto-viewport="true"
                @infohtmlset="setHt"
                @markersset="dsd"
                markersset
                :waypoints="adress1"  ></bm-driving>
                <!-- <bm-point-collection :points="points"  color="red" size="BMAP_POINT_SIZE_SMALL" @click="clickHandler"></bm-point-collection> -->
                <div v-for="item in makers">
                    <bm-marker :position="{lng: item.lng, lat: item.lat}" :clicking='isTop'
                    :icon="item.selected ? blueMaker : redMaker"
                    @dblclick="selectPoint(item)"
                     :top='isTop' :dragging="true" @click="infoWindowOpen(item)">
                        <bm-info-window :show="item.showInfo" @close="infoWindowClose(item)" @open="infoWindowOpen(item)">
                            <div>
                                <h3>案号：{{item.caseNo}}</h3>
                                <h5>被告：{{item.name}}</h5>
                                <h5>地址：{{item.adress}}</h5>
                            </div>
                        </bm-info-window>
                    </bm-marker>
                </div>
                
            </baidu-map>
        </Card>
    </div>
</template>
<script>
import { getBrief,courtList } from "@/api/global";
import { queryLawCase,querySendAddr,createMapAddr } from "@/api/caseInfo.js";
import { formatDate } from "@/libs/date";
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '3s5kFNIlo9hvD8yBEZBvu9DTAQ2y244k'
})
export default {
    data () {
        return {
            show1:false,
            searchL:false,
            visible:false,
            searchData: {
                caseNo: this.$store.getters.caseNo,
                briefName: "",
                date: "",
                filingDate1: "",
                filingDate2: "",
                pageNumber: 1
            },
            redMaker:{
                url: 'https://court1.ptnetwork001.com/images/red-maker.png',
                size: {width: 19, height: 25}
            },
            blueMaker:{
                url: 'https://court1.ptnetwork001.com/images/blue-maker.png',
                size: {width: 19, height: 25}
            },
            briefList: [],
            departmentList: [],
            dipdata:[],
            selData:[],
            totalPage: 0,
            location:"北京",
            center: {lng: 0, lat: 0},
            zoom: 15.8,
            adress1:[],
            adress2:[],
            startAdress:"",
            endAdress:"",
            isTop:true,
            points:[{lng: 118.10388605, lat: 24.48923061}],
            makers:[],
            noneData:[],
            detailColumns: [
                {
                type: "selection",
                width: 60,
                align: "center",
                fixed: "left"
                },
                {
                title: "案号",
                key: "caseNo",
                align: "center",
                width: 210
                },
                {
                title: "被告",
                key: "defendants",
                align: "center",
                width: 165
                }
            ],
            dipcol: [
                {
                type: "selection",
                title: "案号",
                key: "caseNo",
                align: "center",
                width: 80
                },
                {
                // type: "selection",
                title: "案号",
                key: "caseNo",
                align: "center",
                width: 180
                },
                {
                title: "案由",
                key: "briefName",
                align: "center",
                width: 120
                },
                {
                title: "案件状态",
                key: "process",
                align: "center",
                width: 100,
                render: (h, params) => {
                    return h("span", {}, params.row.process == null ?  "无状态" : params.row.process)
                },
                },
                {
                title: "部门",
                key: "courtName",
                align: "center",
                width: 100
                },
                {
                title: "审判员",
                key: "judgeName",
                align: "center",
                width: 120
                },
                {
                title: "书记员",
                key: "clerkName",
                align: "center",
                width: 120
                },
                {
                title: "原告",
                key: "plaintiffs",
                align: "center",
                // width: 150
                },
                {
                title: "被告",
                key: "defendants",
                align: "center",
                // width: 150
                },
                {
                title: "立案日期",
                key: "filingDate",
                align: "center",
                width: 100,
                render: (h, params) => {
                    return h(
                    "span",
                    {},
                    formatDate(new Date(params.row.filingDate), "yyyy-MM-dd")
                    );
                }
                },
            ],
        }
    },
    created() {
        this.onRefreshList();
        this.getCourtList();
        
        getBrief()
        .then(res => {
            if (res.data.state === 100) {
            this.briefList = res.data.result;
            }
        })
        .catch(error => {});
    },
    mounted () {},
    methods: {
        allExcel(){
            console.log(this.makers)
            if(this.makers.length < 1){
                 this.$Message.error('请选择案件');
                 return false;
            }
            let ary = [];
            this.makers.forEach(item => {
                let dt = {
                    id:item.id,
                    caseNo:item.caseNo,
                    litigant:item.name,
                    address:item.adress,
                    
                }
                ary.push(dt)
            })
            createMapAddr({data:JSON.stringify(ary)}).then(res => {
                if(res.data.state == 100){
                    window.open(res.data.path)
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        },
        selectedExcel(){
            console.log(this.makers)
            let ary = [];
            this.makers.forEach(item => {
                if(item.selected){
                    let dt = {
                        id:item.id,
                        caseNo:item.caseNo,
                        litigant:item.name,
                        address:item.adress,
                        
                    }
                    ary.push(dt)
                }
            })
            if(ary.length == 0){
                this.$Message.error('请双击选中红标地址');
                return false;
            }
            createMapAddr({data:JSON.stringify(ary)}).then(res => {
                if(res.data.state == 100){
                    window.open(res.data.path)
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        },
        searchMap(){
            
            if(this.selData.length<1){
                this.$Message.error('请选择案件');
                return false;
            }
            let arr = [];
            this.selData.forEach(i => {
                arr.push(i.id)
            })
            this.searchL = true;
            let that = this;
            console.log(arr.join(','))
            querySendAddr(arr.join(',')).then(res => {
                this.searchL = false;
                if(res.data.state == 100){
                    let arrr = [];
                    res.data.data.forEach(item => {
                        if(item.litigant.length > 0){
                            item.litigant.forEach(tt => {
                                if(tt.address.length > 0){
                                    tt.address.forEach(kk => {
                                        let dt =  {
                                            name:tt.litigant,
                                            caseNo:item.case,
                                            id:item.id,
                                            showInfo:false,
                                            lng: "",
                                            lat: '',
                                            adress:kk,
                                            selected:false,
                                        }
                                        arrr.push(dt)
                                    })
                                }
                                
                            })
                        }
                    });
                    console.log(arrr)
                    this.addAdreess(arrr)
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        },
        clickHandler(e){
            console.log(e)
        },
        infoWindowClose (data) {
            data.showInfo = false;
        },
        infoWindowOpen (data) {
            console.log(this.makers)
            console.log(data)
            data.showInfo = true
        },
        selectPoint(data){
            data.selected = !data.selected;
        },
        handler ({BMap, map}) {
            this.center.lng = 118.10388605
            this.center.lat = 24.48923061
            this.zoom = 13
            this.shili = {BMap, map};
        },
        reload(){
            this.addAdreess(this.endAdress1,2)
            this.adress1 = this.adress2;
        },
        addAdreess(ary){
            console.log(66666666666666)
            var that = this;
            this.makers = [];
            this.shili.map.clearOverlays();
            ary.forEach(item => {
                
                var localSearch = new this.shili.BMap.LocalSearch(this.shili.map);
                var keyword = item.adress;
                var localSearch = new this.shili.BMap.LocalSearch(this.shili.map);
                let pointss = {};
                localSearch.setSearchCompleteCallback(function (searchResult) {
                //   var poi = searchResult.Br[0];
                
                    var poi = searchResult.Ar[0];
                    let pointss = {
                        lng:poi.point.lng,
                        lat:poi.point.lat
                    }
                    item.lng = poi.point.lng;
                    item.lat = poi.point.lat;
                    that.makers.push(item)
                })
                localSearch.search(keyword);
            })
            // this.makers = JSON.parse(JSON.stringify(ary));
            this.visible = false;
            console.log(this.makers)
            // return pointss;
        },
        setHt(e,htmls){
            console.log(e)
            // e.title = "案号显示"
            console.log(htmls)
        },
        dsd(e){
            console.log(53332222222222222)
            console.log(e)
            let htmls = "<p style='color:red;'>大声道</p><br><br>"
            e[0].title = htmls
        },
        search() {
            this.onRefreshList();
        },
        empty() {
            this.searchData.caseNo = "";
            this.searchData.briefName = "";
            this.searchData.litigantName = "";
            this.searchData.date = "";
            this.searchData.filingDate1 = "";
            this.searchData.filingDate2 = "";
            this.searchData.pageNumber = 1;
            this.onRefreshList();
        },
        getCourtList() {
            courtList()
                .then(res => {
                if (res.data.state == 100) {
                    res.data.result.map(item => {
                    this.departmentList.push({ name: item.name, id: item.id });
                    });
                }
                })
                .catch(err => {});
        },
        onRefreshList() {
            this.$store.commit("SET_CASENO", this.searchData.caseNo);
            if(this.searchData.date != "" && this.searchData.date[0] != null){
                console.log(this.searchData.date[0])
                this.searchData.filingDate1 =new Date(this.searchData.date[0]).getTime();
                this.searchData.filingDate2 =new Date(this.searchData.date[1]).getTime();
            }else{
                this.searchData.filingDate1 = ""
                this.searchData.filingDate2 = ""
            }
            // this.searchData.filingDate1 =
            //   this.searchData.date == "" ? "" : this.searchData.date[0].getTime();
            // this.searchData.filingDate2 =
            //   this.searchData.date == "" ? "" : this.searchData.date[1].getTime();
            queryLawCase(this.searchData).then(res => {
                if ((res.data.state = 100)) {
                this.noneData = res.data.result.content;
                this.totalPage = res.data.result.totalPage;
                this.searchData.pageNumber = res.data.result.pageNumber;
                }
            });
        },
        tableCheck(c) {
            var arr = [];

            for (let i = 0; i < c.length; i++) {
                const el = c[i];
                arr.push(el.id);
            }

            this.lawCaseIds = arr;
            console.log(this.lawCaseIds);
        },
        onSelectCon(){

        },
        onSelectChangeCon(c){
            var arr = [];
            let aaa = this.noneData;
            let ary = JSON.parse(JSON.stringify(this.selData));
            for (let i = 0; i < c.length; i++) {
                let el = c[i];
                let isAdd = true;
                for(let u=0;u<ary.length;u++){
                    if(ary[u].id == el.id){
                        isAdd = false;
                    }
                }
                if(isAdd){
                    this.selData.push(c[i])
                }
            }
        },
        onSelectChangeCon2(c){
            let id = c[0].id
             this.noneData.forEach((item,index) => {
                 c.forEach(t => {
                    if(item.id == t.id){
                        this.$refs.selectTable.toggleSelect(index)
                    }
                 })
                 
             })
             this.selData.forEach((item,index) => {
                 c.forEach(t => {
                    if(item.id == id){
                        this.selData.splice(index, 1)
                    }
                 })
                 
             })
        },
        changePage(num) {
            this.searchData.pageNumber = num;
            this.onRefreshList();
        },
        handleOpen () {
            this.visible = true;
        },
        handleClose () {
            this.visible = false;
        }
    }
};
</script>
<style scoped>
.map {
  width: 100%;
  height: 650px;
  min-height: 650px;
}
.drawMenu{
    position: absolute;
    top:20px;
    left:20px;
    z-index: 999;
    width: 100%;
}
.ivu-form-item{
    margin-bottom: 1px !important;
}
.daoCls-left{
    right: 250px;
}
.daoCls{
    color:  rgb(45, 140, 240);
    border-color: rgb(45, 140, 240);
    background: #fff;
    z-index: 999;
    position: absolute;
    top: 20px;
}
.daoCls-right{
    right: 100px;
}
</style>


