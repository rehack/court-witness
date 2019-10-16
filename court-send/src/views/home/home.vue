<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>
<template>
    <div  style="height:100%">
    <div class="home-main" v-show="litigantLogin">
      <h1>欢迎进入湖里法院易送达管理平台，当事人请点击左边菜单栏进行相关业务查询</h1>
    </div>
    <div class="home-main"  style="height:100%" v-show="!litigantLogin">
        <Row :gutter="10"  style="height:100%">
            <!-- <Col :md="24" :lg="24"
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="4" :lg="4" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row class="margin-top-5">
                                    <Col span="8"><p class="notwrap">NEW</p></Col>
                                </Row>
                            <Row type="flex"  :style="{textAlign: 'center'}" align="middle">
                                <b class="card-user-infor-name" :style="{width: '100%'}">{{newCase}}</b>
                            </Row>
                            <div class="line-gray" align="middle"></div>
                            <Row  :style="{textAlign: 'center'}">
                                <p class="notwrap" :style="{fontSize: '16px',marginTop: '8px'}">新收案件</p>
                            </Row>
                        </Card>
                    </Col>
                    <Col :md="4" :lg="4" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row class="margin-top-5">
                                    <Col span="8"><p class="notwrap">ING</p></Col>
                                </Row>
                            <Row type="flex" :style="{textAlign: 'center'}" align="middle">
                                <b class="card-user-infor-name" :style="{width: '100%'}">{{acceptCase}}</b>
                            </Row>
                            <div class="line-gray" align="middle"></div>
                            <Row  :style="{textAlign: 'center'}">
                                <p class="notwrap" :style="{fontSize: '16px',marginTop: '8px'}">受理案件</p>
                            </Row>
                        </Card>
                    </Col>
                    <Col :md="16" :lg="16" :style="{marginBottom: '10px',height: '129px'}">
                        <Card :style="{height: '129px'}">
                            <Row class="margin-top-5">
                                    <Col span="8"><p class="notwrap">NAME</p></Col>
                                </Row>
                            <Row type="flex" class="user-infor" :style="{textAlign: 'center'}" align="middle">
                                <span class="card-user-infor-name" :style="{width: '100%',color: '#38B3FF',fontWeight: '100',fontSize: '1.6rem', color: '#2D8CF0'}"><b :style="{fontWeight: '600', color: '#2D8CF0'}">{{name}}</b>欢迎您，今天是<b :style="{fontWeight: '600'}">{{nowLoginDay}}</b></span>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Col> -->
            <Col :md="24" :lg="24" style="height:45%;margin-bottom:10px">
                <Row class-name="home-page-row1" style="height:100%" :gutter="10">
                    <Col :md="16" :lg="16" :style="{marginBottom: '10px'}" style="height:100%">
                        <Card style="height:100%">
                            <div id="charts-m" :style="{width: '100%',height: '100%',backgroundColor: '#F7F7F7'}">
                            </div>
                        </Card>
                    </Col>
                    <Col :md="8" :lg="8" :style="{marginBottom: '10px',backgroundColor: '#F7F7F7'}" style="height:100%">
                        <Card style="height:100%">
                            <div  :style="{lineHeight: '20px', paddingBottom: '10px',borderBottom:'1px solid #ccc'}"><span :style="{fontSize:'18px'}">庭审排期</span> <a href="#"  v-on:click="showCourtDate" :style="{float: 'right',fontSize:'18px'}">查看更多>></a></div>
                            <div  :style="{height: '95%',textAlign:'center'}">
                                <!-- <Carousel  v-model="value1"  :dots="setting.dots" :radius-dot="setting.radiusDot">
                                    <CarouselItem   v-for="item in courtPlans">
                                        <div class="demo-carousel" :style="{padding: '10px',marginTop:'20px',display:'inline-block',textAlign:'left'}">
                                            <ul class='date-lis'>
                                                <li :style="{fontSize: '18px', fontWeight:'600',lineHeight:'30px'}">{{item.date}}</li>
                                                <ul class="detail-list">
                                                    <li   v-for="it in item.data">
                                                        {{it.hour}}：<a :style="{color: '#2FB3EA'}">{{it.associate}}</a>；<br/>
                                                        　　　　法官  {{it.judgePeople}}；{{it.adress}};
                                                    </li>
                                                </ul>
                                            </ul>
                                        </div>
                                    </CarouselItem>
                                </Carousel> -->
                                <Carousel  v-model="value1"  :dots="setting.dots" :radius-dot="setting.radiusDot">
                                    <CarouselItem v-for="item in courtPlans">
                                        <div class="demo-carousel" :style="{padding: '10px',marginTop:'20px',display:'inline-block',textAlign:'left'}">
                                            <ul class='date-lis' v-for="it in item">
                                                <li :style="{fontSize: '18px', fontWeight:'600',lineHeight:'20px'}">{{it.date}}</li>
                                                <ul class="detail-list" v-for="i in it.data">
                                                    <li @click="detailM(i.data.id)">
                                                        {{i.data.hour}}<a :style="{color: '#2FB3EA'}">{{i.data.associate}}</a>
                                                        <Badge  v-bind:class="i.data.isMaster !=false ? '': 'hides'" count="关联" class-name="demo-badge-alone"></Badge>；<br/>
                                                    </li>
                                                </ul>
                                            </ul>
                                        </div>
                                    </CarouselItem>
                                </Carousel>
                                <!-- <Carousel  v-model="value1"  :dots="setting.dots" :radius-dot="setting.radiusDot">
                                    <CarouselItem >
                                        <div class="demo-carousel" :style="{padding: '10px',marginTop:'20px',display:'inline-block',textAlign:'left'}">
                                            <ul class='date-lis'>
                                                <li :style="{fontSize: '18px', fontWeight:'600',lineHeight:'30px'}">4月24日</li>
                                                <ul class="detail-list">
                                                    <li >
                                                        08:45：<a :style="{color: '#2FB3EA'}">(2018)闽0246民初748号</a>；<br/>
                                                    </li>
                                                    <li >
                                                        09:40：<a :style="{color: '#2FB3EA'}">(2018)闽0246民初748号</a>；<br/>
                                                    </li>
                                                </ul>
                                                <li :style="{fontSize: '18px', fontWeight:'600',lineHeight:'30px'}">4月24日</li>
                                                <ul class="detail-list">
                                                    <li >
                                                        08:45：<a :style="{color: '#2FB3EA'}">(2018)闽0246民初748号</a>；<br/>
                                                    </li>
                                                    <li >
                                                        09:40：<a :style="{color: '#2FB3EA'}">(2018)闽0246民初748号</a>；<br/>
                                                    </li>
                                                </ul>
                                                <li :style="{fontSize: '18px', fontWeight:'600',lineHeight:'30px'}">4月24日</li>
                                                <ul class="detail-list">
                                                    <li >
                                                        08:45：<a :style="{color: '#2FB3EA'}">(2018)闽0246民初748号</a>；<br/>
                                                    </li>
                                                    <li >
                                                        09:40：<a :style="{color: '#2FB3EA'}">(2018)闽0246民初748号</a>；<br/>
                                                    </li>
                                                </ul>
                                            </ul>
                                        </div>
                                    </CarouselItem>
                                </Carousel> -->
                            </div>
                        </Card>
                    </Col>
                </row>
            </Col>
            <Modal
              v-model="detailModal"
              width="630"
              :ok-text="'关闭'"
              cancel-text=""
              @on-ok=""
              title="详情">
                <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      原告
                  </Col>
                  <Col span="21" class="maininfo-col">
                      {{detailLawcase.plaintiffName}}
                  </Col>
              </Row>
              <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      被告
                  </Col>
                  <Col span="21" class="maininfo-col">
                      {{detailLawcase.defendantName}}
                  </Col>
              </Row>
              <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      案件编号
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.caseNo}}
                  </Col>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      案由
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.briefName}}
                  </Col>
              </Row>
              <Row> 
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      法官
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.judgeName}}
                  </Col>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      书记员
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.clerkName}}
                  </Col>
              </Row>
              <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      开庭时间
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.startDate | formatDate}}
                  </Col>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      法庭
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.tribunalName}}
                  </Col>
              </Row>
              <Row>
                  <Col span="3" class="table-border-t" :style="{minHeight: '38px'}">
                      关联案件
                  </Col>
                  <Col span="21" class="table-border-t"  v-if="detailLawcase.associateLawCase != ''" :style="{minHeight: '38px'}">
                      <span v-for="item in detailLawcase.associateLawCase" > <a>{{ item.caseNo }}</a><br/> </span>
                  </Col>
                  <Col span="21"  class="table-border-t" v-else>
                      <span>无</span>
                  </Col>
              </Row>
          </Modal>
            <Col :md="12" :lg="12" style="height:45%">
                <Row class-name="home-page-row1" :gutter="10" style="height:100%">
                    
                    <Col :md="24" :lg="24" :style="{marginBottom: '10px'}"  style="height:100%">
                        <Card  style="height:100%">
                            <div :style="{textAlign: 'center',marginBottom:'10px'}">
                                <!-- <el-date-picker
                                    v-model="startDate"
                                    type="date"
                                    placeholder="选择开始日期">
                                </el-date-picker> -->
                                <span class="img-title">送达时间情况统计</span>
                                <div :style="{display: 'inline-block',margin:'0 auto'}" v-show="monthInput">
                                    月份　<span><DatePicker 
                                    type="month"
                                    @on-change="selectStartDate"
                                    :options="dateOptions"
                                    v-model="sendStartDate"
                                    style="width: 100px"></DatePicker></span>　 -　  
                                    <span><DatePicker 
                                    type="month"
                                    @on-change="selectEndDate" 
                                    :options="dateOptionsEnd" 
                                    v-model="sendEndData"
                                    style="width: 100px"></DatePicker></span>    
                                </div>
                                <div :style="{display: 'inline-block',margin:'0 auto'}" v-show="yearInput">
                                    年份　<span><DatePicker 
                                    type="year"
                                    @on-change="selectyearDate"
                                    :options="dateOptions"
                                    v-model="yearDate"
                                    style="width: 200px"></DatePicker></span>　     
                                </div>
                                <div :style="{display: 'inline-block',float:'right '}">
                                    <span class="date-select" v-bind:class="yearMonth==1? '':'date-active'" @click="changeYearMonth(2)">年</span>　／　
                                    <span class="date-select" v-bind:class="yearMonth==1? 'date-active':''" @click="changeYearMonth(1)">月</span>
                                </div>
                            </div>
                            <div id="charts-y" :style="{width: '100%',height: '90%',backgroundColor: '#F7F7F7'}">
                            </div>
                        </Card>
                    </Col>               
                </row>
            </Col>
            <Col :md="12" :lg="12" style="height:45%">
                <Row class-name="home-page-row1" :gutter="10"  style="height:100%">                    
                    <Col :md="24" :lg="24" :style="{marginBottom: '10px'}"  style="height:100%">
                        <Card  style="height:100%">
                            <div :style="{textAlign: 'center',marginBottom:'10px'}" >
                                <span class="img-title" style="font-size:14px">案件案由分布情况统计（前十）</span>
                                <div :style="{display: 'inline-block',margin:'0 auto'}">
                                    日期　<span>
                                            <DatePicker :options="dateOptionsAn" v-model="courtStartDate" @on-change="selectCourtStartDate"  placeholder="选择日期"></DatePicker>
                                        </span>
                                    　 -　  <span><DatePicker  :options="dateOptionsAnEnd" v-model="courtEndDate" @on-change="selectCourtEndDate"  placeholder="选择日期"></DatePicker></span>
                                </div>
                            </div>
                            <div id="charts-r" :style="{width: '100%',height: '90%',backgroundColor: '#F7F7F7'}">
                            </div>
                        </Card>
                    </Col>              
                </row>
            </Col>
        </Row>
    </div>
  </div>
</template>

<script>
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
import toDoListItem from './components/toDoListItem.vue';
import util from '@/libs/util.js';
import echarts from 'echarts';
import {
    caseCount,
    schedulingCase,
    sendCountDate,
    caseCountDate,
    lawCaseSchedulding
} from '@/api/homeDate';
import { formatDate } from '@/libs/date';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

export default {
    name: 'home',
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow,
        countUp,
        inforCard,
        mapDataTable,
        toDoListItem,
        swiper,
        swiperSlide
    },
    data () {
        return {
            toDoList: [],
            count: {
                createUser: 496,
                visit: 3264,
                collection: 24389305,
                transfer: 39503498
            },
            cityData: cityData,
            showAddNewTodo: false,
            newToDoItemValue: '',
            name: '',
            monthInput: true,
            yearInput: false,
            detailModal: false,
            loading: true,
            nowLoginDay: '',
            recentDay: '',
            litigantLogin: this.$store.getters.access == 'litigant',
            startDate: '',
            dots: '',
            yearMonth: 1,
            items: [2, 6, 4, 5],
            newCase: '',
            acceptCase: '',
            sendStartDate: '',
            sendEndData: '',
            yearDate: '',
            beforeDate: '',
            afterDate: '',
            courtStartDate: '',
            courtEndDate: '',
            sourceData: false,
            courtxdata: [],
            courtydata: [],
            value1: 0,
            detailLawcase: [],
            setting: {
                dots: 'outside',
                radiusDot: true
            },
            courtPlans: [],
            dateOptions: {
                disabledDate: time => {
                    let endDateVal = this.sendEndData;
                    return (
                        time.getTime() > Date.now() ||
            time.getTime() > new Date(endDateVal).getTime()
                    );
                }
            },
            dateOptionsEnd: {
                disabledDate: time => {
                    let beginDateVal = this.sendStartDate;
                    return (
                        time.getTime() < new Date(beginDateVal).getTime() ||
            time.getTime() > Date.now()
                    );
                }
            },
            dateOptionsAnEnd: {
                disabledDate: time => {
                    let beginDateVal = this.courtStartDate;
                    return (
                        time.getTime() < new Date(beginDateVal).getTime() ||
            time.getTime() > Date.now()
                    );
                }
            },
            dateOptionsAn: {
                disabledDate: time => {
                    let endDateVal = this.courtEndDate;
                    return (
                        time.getTime() > Date.now() ||
            time.getTime() > new Date(endDateVal).getTime()
                    );
                }
            }
        };
    },
    created () {
        this.$store.dispatch('GetUserInfo').then(res => {
            this.name = res.data.result.name;

            var dataStr = formatDate(
                new Date(res.data.nowLoginDay),
                'yyyy-MM-dd hh:mm:ss'
            );
            this.nowLoginDay = dataStr.slice(0, 4) + '年' + dataStr.slice(5, 7) + '月' + dataStr.slice(8, 10) + '日';
            if (res.data.result.roles[0].name == '当事人' || res.data.result.roles[0].name == '代理人') {
                this.litigantLogin = true;
            } else {
                this.litigantLogin = false;
            }
        });
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    mounted () {
    // 案件数统计及环形图
        caseCount().then(res => {
            if (res.data.result.state == 100) {
                this.newCase = res.data.result.newCaseCount;
                this.acceptCase = res.data.result.allCaseCount;
                var ary1 = {
                    value: res.data.result.waitSendCount,
                    name: '待送达案件数'
                };
                var ary2 = {
                    value: res.data.result.overSendCount,
                    name: '已送达案件数'
                };
                var ary3 = {
                    value: res.data.result.overOpenCount,
                    name: '已开庭案件数'
                };
                var ary4 = {
                    value: res.data.result.waitScheduldingCount,
                    name: '待排期案件数'
                };
                var ary5 = {
                    value: res.data.result.allCaseCount,
                    name: '受理案件'
                };
                var caseAry = [ary4, ary1, ary2, ary3];
                var waitshCase = [ary5];
                this.drawChart1(waitshCase, caseAry);
            } else if (res.data.result.state == 101) {
                this.$Message.error(res.data.result.message);
            }
        });
        // 近三天庭审排期
        schedulingCase().then(res => {
            if (res.data.state == 100) {
                const ary = res.data.result;
                var allAry = [];
                var dateAry = [];
                for (var i = 0; i < ary.length; i++) {
                    var strDate =
            ary[i].startDate.slice(5, 7) +
            '月' +
            ary[i].startDate.slice(8, 10) +
            '日'; // 日期
                    dateAry.push(strDate);
                    var hourJudge = ary[i].startDate.slice(11, 13); // 小时判断文字
                    if (hourJudge < 9) {
                        var strHour = ary[i].startDate.slice(11, 17);
                    } else if (hourJudge < 12) {
                        var strHour = ary[i].startDate.slice(11, 17);
                    } else if (hourJudge < 14) {
                        var strHour = ary[i].startDate.slice(11, 17);
                    } else if (hourJudge < 17) {
                        var strHour = ary[i].startDate.slice(11, 17);
                    } else if (hourJudge < 19) {
                        var strHour = ary[i].startDate.slice(11, 17);
                    } else if (hourJudge < 22) {
                        var strHour = ary[i].startDate.slice(11, 17);
                    }
                    if (ary[i].isMaster != true) {
                        ary[i].isMaster = false;
                    }
                    var smAry = {
                        hour: strHour,
                        associate: ary[i].caseNo,
                        id: ary[i].lawcaseId,
                        isMaster: ary[i].isMaster
                    };
                    var addAry = {
                        date: strDate,
                        data: smAry
                    };
                    allAry.push(addAry);
                }
                // allAry = [{date:'04月23日',data:'(2018)闽0246民初748号'},{date:'04月23日',data:'(2018)闽0246民初748号'},{date:'04月24日',data:'(2018)闽0246民初748号'},{date:'04月24日',data:'(2018)闽0246民初748号'},{date:'04月24日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'},{date:'04月25日',data:'(2018)闽0246民初748号'}];
                var newDateAry = Array.from(new Set(dateAry));
                // var newDateAry =['04月23日','04月24日','04月25日']
                var smallAry1 = [];
                var lastAry = [];
                if (allAry.length <= 4) {
                    for (var j = 0; j < newDateAry.length; j++) {
                        var dateSmallAry = [];
                        var fi = 1;
                        for (var i = 0; i < allAry.length; i++) {
                            if (allAry[i].date == newDateAry[j]) {
                                fi = 0;
                                dateSmallAry.push(allAry[i]);
                            }
                        }
                        if (fi == 0) {
                            var addAry = {
                                date: newDateAry[j],
                                data: dateSmallAry
                            };
                            smallAry1.push(addAry);
                        }
                    }
                    lastAry.push(smallAry1);
                } else if (allAry.length > 4 ) {
                    if (allAry.length > 4 && allAry.length <= 8) {
                        for (var j = 0; j < newDateAry.length; j++) {
                            var dateSmallAry = [];
                            var fi = 1;
                            for (var i = 0; i < 4; i++) {
                                if (allAry[i].date == newDateAry[j]) {
                                    fi = 0;
                                    dateSmallAry.push(allAry[i]);
                                }
                            }
                            if (fi == 0) {
                                var addAry = {
                                    date: newDateAry[j],
                                    data: dateSmallAry
                                };
                                smallAry1.push(addAry);
                            }
                        }
                        lastAry.push(smallAry1);
                        smallAry1 = [];
                        for (var j = 0; j < newDateAry.length; j++) {
                            var dateSmallAry = [];
                            var fi = 1;
                            for (var i = 4; i < allAry.length; i++) {
                                if (allAry[i].date == newDateAry[j]) {
                                    fi = 0;
                                    dateSmallAry.push(allAry[i]);
                                }
                            }
                            if (fi == 0) {
                                var addAry = {
                                    date: newDateAry[j],
                                    data: dateSmallAry
                                };
                                smallAry1.push(addAry);
                            }
                        }
                        lastAry.push(smallAry1);
                        console.log(lastAry)
                    } else {
                        for (var j = 0; j < newDateAry.length; j++) {
                            var dateSmallAry = [];
                            var fi = 1;
                            for (var i = 0; i < 4; i++) {
                                if (allAry[i].date == newDateAry[j]) {
                                    fi = 0;
                                    dateSmallAry.push(allAry[i]);
                                }
                            }
                            if (fi == 0) {
                                var addAry = {
                                    date: newDateAry[j],
                                    data: dateSmallAry
                                };
                                smallAry1.push(addAry);
                            }
                        }
                        
                        
                        lastAry.push(smallAry1);
                        smallAry1 = [];
                        for (var j = 0; j < newDateAry.length; j++) {
                            var dateSmallAry = [];
                            var fi = 1;
                            for (var i = 4; i < 8; i++) {
                                if (allAry[i].date == newDateAry[j]) {
                                    fi = 0;
                                    dateSmallAry.push(allAry[i]);
                                }
                            }
                            if (fi == 0) {
                                var addAry = {
                                    date: newDateAry[j],
                                    data: dateSmallAry
                                };
                                smallAry1.push(addAry);
                            }
                        }
                        lastAry.push(smallAry1);
                        
                        let ddex = 8;
                        if(allAry.length - 8 > 4 && allAry.length - 8 <= 8){
                            smallAry1 = [];
                            for (var j = 0; j < newDateAry.length; j++) {
                                var dateSmallAry = [];
                                var fi = 1;
                                for (var i = 8; i < 12; i++) {
                                    if (allAry[i].date == newDateAry[j]) {
                                        fi = 0;
                                        dateSmallAry.push(allAry[i]);
                                    }
                                }
                                if (fi == 0) {
                                    var addAry = {
                                        date: newDateAry[j],
                                        data: dateSmallAry
                                    };
                                    smallAry1.push(addAry);
                                }
                            }
                            lastAry.push(smallAry1);
                            ddex = 12;
                        }
                        if(allAry.length - 8 > 8 && allAry.length - 8 <= 12){
                            smallAry1 = [];
                            for (var j = 0; j < newDateAry.length; j++) {
                                var dateSmallAry = [];
                                var fi = 1;
                                for (var i = 12; i < 16; i++) {
                                    if (allAry[i].date == newDateAry[j]) {
                                        fi = 0;
                                        dateSmallAry.push(allAry[i]);
                                    }
                                }
                                if (fi == 0) {
                                    var addAry = {
                                        date: newDateAry[j],
                                        data: dateSmallAry
                                    };
                                    smallAry1.push(addAry);
                                }
                            }
                            lastAry.push(smallAry1);
                            ddex = 16;
                        }
                        if(allAry.length - 8 > 12 && allAry.length - 8 <= 16){
                            smallAry1 = [];
                            for (var j = 0; j < newDateAry.length; j++) {
                                var dateSmallAry = [];
                                var fi = 1;
                                for (var i = 16; i < 20; i++) {
                                    if (allAry[i].date == newDateAry[j]) {
                                        fi = 0;
                                        dateSmallAry.push(allAry[i]);
                                    }
                                }
                                if (fi == 0) {
                                    var addAry = {
                                        date: newDateAry[j],
                                        data: dateSmallAry
                                    };
                                    smallAry1.push(addAry);
                                }
                            }
                            lastAry.push(smallAry1);
                            ddex = 20;
                        }
                        smallAry1 = [];
                        for (var j = 0; j < newDateAry.length; j++) {
                            var dateSmallAry = [];
                            var fi = 1;
                            for (var i = ddex; i < allAry.length; i++) {
                                if (allAry[i].date == newDateAry[j]) {
                                    fi = 0;
                                    dateSmallAry.push(allAry[i]);
                                }
                            }
                            if (fi == 0) {
                                var addAry = {
                                    date: newDateAry[j],
                                    data: dateSmallAry
                                };
                                smallAry1.push(addAry);
                            }
                        }
                        lastAry.push(smallAry1);
                    }
                }
                this.courtPlans = lastAry;
                console.log(1111)
                console.log(this.courtPlans)
            } else if (res.data.result.state == 101) {
                this.$Message.error(res.data.result.message);
            }
        });
        // 平均送达时间表
        sendCountDate().then(res => {
            this.drawChart2(
                res.data.monthList,
                res.data.belowAvergeList,
                res.data.overAvergeList,
                res.data.avergeCountList
            );
        });
        // 案件案由分布统计表
        caseCountDate(this.courtStartDate, this.courtEndDate).then(res => {
            if (res.data.result.state == 100) {
                this.courtxdata = res.data.result.briefList;
                this.courtydata = res.data.result.talNums;
                this.drawChart3(this.courtxdata, this.courtydata);
            } else if (res.data.result.state == 101) {
                this.$Message.error(res.data.result.message);
            }
        });
    },
    methods: {
        compare (property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        detailM (id) {
            this.detailModal = true;
            lawCaseSchedulding(id).then(res => {
                if (res.data.state == 100) {
                    this.detailLawcase = res.data.result;
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        },
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        drawChart1 (waitshCase, aryData) {
            let myChart = echarts.init(document.getElementById('charts-m'));
            var option1 = {
                title: {
                    text: '案件处理统计',
                    textStyle: {
                        fontWeight: 'normal'
                    }
                },
                legend: {
                    y: 'top',
                    right: 40,
                    data: [
                        '受理案件',
                        '待排期案件数',
                        '待送达案件数',
                        '已送达案件数',
                        '已开庭案件数'
                    ]
                },
                series: [
                    {
                        name: '受理案件',
                        type: 'pie',
                        selectedMode: false,
                        radius: [0, '30%'],
                        label: {
                            normal: {
                                position: 'inner',
                                formatter: '{c}\n\n{a}\n\n\n\n',
                                fontSize: 16,
                                fontWeight: 600
                            }
                        },
                        data: waitshCase
                    },
                    {
                        name: '案件数量',
                        type: 'pie',
                        radius: ['40%', '60%'],
                        label: {
                            normal: {
                                formatter: '{b|{b}：}{c}  {per|{d}%}',
                                borderWidth: 1,
                                borderRadius: 4,
                                rich: {
                                    a: {
                                        color: '#999',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    hr: {
                                        borderColor: '#aaa',
                                        width: '100%',
                                        borderWidth: 0.5,
                                        height: 0
                                    },
                                    b: {
                                        fontSize: 16,
                                        lineHeight: 33
                                    },
                                    per: {
                                        color: '#eee',
                                        backgroundColor: '#334455',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }
                            }
                        },
                        data: aryData
                    }
                ]
            };
            myChart.setOption(option1);
            myChart.on('click', function (param) {
            //     alert(
            //         param.dataIndex +
            // ':' +
            // option1.series[param.seriesIndex].data[param.dataIndex].name
            //     );
            });
        },
        drawChart2 (xaxisdata, serieszs, seriesyx, avergeCount) {
            var myChart = echarts.init(document.getElementById('charts-y'));
            myChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    showDelay: 0,
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['高于平均送达时间', '低于平均送达时间', '平均时间']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xaxisdata,
                        axisLabel: {
                            textStyle: {
                                color: '#222'
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '低于平均送达时间',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 25, // 柱图宽度
                        data: serieszs,
                        itemStyle: {
                            emphasis: {
                                barBorderRadius: 30
                            },
                            normal: {
                                barBorderRadius: [5, 5, 5, 5],
                                label: {
                                    show: true,
                                    textStyle: {
                                        fontWeight: 'bolder',
                                        fontSize: '12',
                                        fontFamily: '微软雅黑'
                                    }
                                },
                                color: 'rgb(132,208,255)'
                            }
                        }
                    },
                    {
                        name: '高于平均送达时间',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 25,
                        data: seriesyx,
                        itemStyle: {
                            emphasis: {
                                barBorderRadius: 30
                            },
                            normal: {
                                barBorderRadius: [5, 5, 5, 5],
                                label: {
                                    show: true,
                                    textStyle: {
                                        fontWeight: 'bolder',
                                        fontSize: '12',
                                        fontFamily: '微软雅黑'
                                    }
                                },
                                color: 'rgb(255,140,70)'
                            }
                        }
                    },
                    {
                        name: '平均时间',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 25,
                        data: avergeCount,
                        label: {
                            normal: {
                                show: true,
                                position: 'insideBottom',
                                formatter: function (params) {
                                    if (params.value > 0) {
                                        return '平均时间\n' + params.value + '天';
                                    } else {
                                        return '';
                                    }
                                },
                                textStyle: { color: '#ccc' }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgba(128, 128, 128, 0)'
                            }
                        }
                        // dimensions: [ // 如果此维度不想给出定义，则使用 null 即可
                        //     {type: 'ordinal'}, // 只定义此维度的类型。
                        //     // 'ordinal' 表示离散型，一般文本使用这种类型。
                        //     // 如果类型没有被定义，会自动猜测类型。
                        //     {name: 'good', type: 'number'},
                        //     'bad' // 等同于 {name: 'bad'}
                        // ],
                    }
                ]
            });
        },
        drawChart3 (xaxisdata, seriesdata) {
            let myChart = echarts.init(document.getElementById('charts-r'));
            myChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    showDelay: 5,
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xaxisdata,
                    axisLabel: {
                        interval: 0, // 横轴信息全部显示
                        formatter: function (val) {
                            var strs = val.split(''); // 字符串数组
                            var str = '';
                            for (var i = 0, s; (s = strs[i++]);) {
                                str += s;
                                if (!(i % 3)) str += '\n';
                            }
                            return str;
                        }
                    }
                },
                yAxis: {
                    type: 'value'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#ccc'
                        }
                    }
                },
                series: [
                    {
                        data: seriesdata,
                        type: 'bar',
                        barWidth: 25, // 柱图宽度
                        // 配置样式
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    var colorList = [
                                        'rgb(164,205,238)',
                                        'rgb(132,208,255)',
                                        'rgb(42,170,227)',
                                        'rgb(25,46,94)',
                                        'rgb(195,229,235)',
                                        'rgb(255,140,70)',
                                        'rgb(39,114,123)',
                                        'rgb(193,35,43)',
                                        'rgb(205,206,16)',
                                        'rgb(155,202,99)'
                                    ];
                                    return colorList[params.dataIndex];
                                },
                                barBorderRadius: [5, 5, 5, 5]
                            }
                        }
                    }
                ]
            });
        },
        changeYearMonth (num) {
            this.yearMonth = num;
            if (num == 2) {
                this.monthInput = false;
                this.yearInput = true;
                var yearDate = null;
                var startDate = null;
                var endDate = null;
                this.sendCourtAj(yearDate, startDate, endDate, this.yearMonth);
            } else {
                this.monthInput = true;
                this.yearInput = false;
                this.sendCourtAj();
            }
        },
        showCourtDate () {
            util.openNewPage(this, 'courtdate');
            this.$router.push({
                name: 'calendar'
            });
        },
        sendCourtAj (yearDate, startDate, endDate, type) {
            sendCountDate(yearDate, startDate, endDate, type).then(res => {
                this.drawChart2(
                    res.data.monthList,
                    res.data.belowAvergeList,
                    res.data.overAvergeList,
                    res.data.avergeCountList
                );
            });
        },
        selectStartDate (value) {
            this.sendStartDate = value;
            if (this.sendEndData != '') {
                var startDate = formatDate(new Date(this.sendStartDate), 'yyyy-MM');
                var endDate = formatDate(new Date(this.sendEndData), 'yyyy-MM');
                var yearDate = null;
                console.log(this.sendEndData);
                this.sendCourtAj(yearDate, startDate, endDate, this.yearMonth);
            }
        },
        selectEndDate (value) {
            this.sendEndData = value;
            if (this.sendStartDate != '') {
                var startDate = formatDate(new Date(this.sendStartDate), 'yyyy-MM');
                var endDate = formatDate(new Date(this.sendEndData), 'yyyy-MM');
                var yearDate = null;
                console.log(this.sendEndData);
                this.sendCourtAj(yearDate, startDate, endDate, this.yearMonth);
            }
        },
        selectyearDate (value) {
            this.yearDate = value;
            var startDate = null;
            var endDate = null;
            this.sendCourtAj(this.yearDate, startDate, endDate, this.yearMonth);
        },
        selectCourtStartDate (value) {
            this.courtStartDate = value;
            if (this.courtEndDate != '') {
                this.caseDate();
            }
        },
        selectCourtEndDate (value) {
            this.courtEndDate = value;
            if (this.courtStartDate != '') {
                this.caseDate();
            }
        },
        caseDate () {
            var startDate = formatDate(new Date(this.courtStartDate), 'yyyy-MM-dd');
            var endDate = formatDate(new Date(this.courtEndDate), 'yyyy-MM-dd');
            caseCountDate(startDate, endDate).then(res => {
                if (res.data.result.state == 100) {
                    this.courtxdata = res.data.result.briefList;
                    this.courtydata = res.data.result.talNums;
                    this.$Message.success(res.data.result.message);
                    this.drawChart3(this.courtxdata, this.courtydata);
                } else if (res.data.result.state == 101) {
                    this.$Message.error(res.data.result.message);
                }
            });
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('请输入待办事项内容');
            }
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        }
    },
    filters: {
        formatDate (time) {
            if (time == '') {
                return '';
            }
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd  hh:mm:ss');
        }
    }
};
</script>
<style>
/* .ivu-card-body{
    padding: 8px;
} */
.single-page {height: 100%; }
.ivu-card-body{
    height:100%
}
</style>