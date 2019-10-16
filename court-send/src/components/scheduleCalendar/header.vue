<template>
    <header class="schedule-calendar-hd">
        <button type="button"
                class="schedule-calendar-arrow double-arrow"
                @click="prevYear">&lt;&lt;</button>
        <button type="button"
                class="schedule-calendar-arrow"
                @click="prevMonth">&lt;</button>
        <div class="schedule-calendar-picker"
             ref="picker">
            <div role="button"
                 class="schedule-calendar-display"
                 @click="pickerVisible = !pickerVisible">{{year}} 年 {{month + 1}} 月</div>
            <picker :visible="pickerVisible"
                    :year="year"
                    :month="month"></picker>
        </div>
        <button type="button"
                class="schedule-calendar-arrow"
                @click="nextMonth">&gt;</button>
                
        <button type="button"
                class="schedule-calendar-arrow double-arrow"
                @click="nextYear">&gt;&gt;</button>
                <Input v-model="value13" style="float: right;    float: right;
    width: 22%;
    position: absolute;
    left: 20px;
    top: 20px;">
                        <Select v-model="select3" slot="prepend" style="width:100px">
                            <Option value="案号">案号</Option>
                            <Option value="当事人名称">当事人名称</Option>
                        </Select>
                        <Button slot="append" icon="ios-search" @click.native='seacher'></Button>
                    </Input>
        <div class="infosa" ref="Infos">
          <span  @click="showInfo">
               <Icon type="cube" ></Icon>
               数据
          </span>
           <div class="judgeInfo" style="width:320px" v-show="totalInfos">
                <div style="width: 155px;display:inline-block;text-align:right">
                  <p  style="margin-left:10px;color:#000;">排期案件数：</p>
                  <p  style="margin-left:10px;color:#FFE001;">待确认案件数：</p>
                  <p  style="margin-left:10px;color:#22B573;">可开庭案件数：</p>
                  <p  style="margin-left:10px;color:#FF2E07;">无法开庭案件数：</p>
                </div>
                <div style="width: 130px;display:inline-block;text-align:left">
                  <p  style="margin-left:10px;color:#000;">{{infoscount.total}}</p>
                  <p  style="margin-left:10px;color:#FFE001;">{{infoscount.unConfirm}}</p>
                  <p  style="margin-left:10px;color:#22B573;">{{infoscount.confirmYes}}</p>
                  <p  style="margin-left:10px;color:#FF2E07;">{{infoscount.confirmNo}}</p>
                </div>
            </div>
        </div>
        <div class="funnel-wrapper" ref="judge" >
          <Icon type="md-calendar" />
          <Button style="margin-right:35px;border: 1px solid #fff;" type="info" @click="showCourtDate" ghost size="large">排期</Button> 
            <span  @click="showJudgeInfo">
                
               <Icon type="funnel"></Icon>
               筛选
            </span>
           
            <div class="judgeInfo" v-show="judgeInfoVisible">
                <div style="width:100%">
                  <div class="judgeD" style='height: 125px;overflow: auto;'>
                    <CheckboxGroup v-model="checkJudge">
                        <Checkbox v-for="(item, i) in judgeList" :label="item.id" :key="i">
                            <span style="color: #000;margin-left:10px;">{{ item.name }}<span v-show="item.name == '陈惠清' || item.name == '卢泽潇'"> *</span></span>
                            <!-- <span class="colorBox" :class="'status_'+(i+1)"></span> -->
                        </Checkbox>
                    </CheckboxGroup>
                  </div>
                  <div class="calenD">
                    <CheckboxGroup v-model="checkAllGroup" >
                        <Checkbox style="color:#FFE001" label="0">
                          <span  style="margin-left:10px;">待确认开庭案件</span>
                        </Checkbox>
                        <Checkbox style="color:#22B573" label="1">
                          <span  style="margin-left:10px;">确认开庭案件</span>
                        </Checkbox>
                        <Checkbox style="color:#FF2E07" label="2">
                          <span  style="margin-left:10px;">确认不开庭案件</span>
                        </Checkbox>
                    </CheckboxGroup>
                  </div>
                </div>
                <div style="text-align:center;float;left;margin-top:25px;">
                <Button type="primary" @click="selectJudgeId">筛选</Button>                  
                </div>
            </div>
        </div>
        
    </header>
</template>
<script>
import { EventBus } from "./utils";
import { calcPrevMonth, calcNextMonth } from "./utils";
import picker from "./picker";
import { getJudgeList } from "@/api/judgeInfo.js";

export default {
  components: {
    picker
  },
  props: {
    year: Number,
    month: Number,
    infoscount:Object
  },
  data() {
    return {
        pickerVisible: false,
        judgeInfoVisible: false,
        totalInfos:false,
        judgeList: [],
        checkJudge: [],
        // checkAllGroup:['0','1','2'],
        checkAllGroup:['1'],
        value13: '',
        select1: 'http',
        select2: 'com',
        select3: '案号',
        caseNo:'',
        litigantName:''
    };
  },
  watch: {
      value13(cur,old){
          if (this.select3=='案号') {
            this.caseNo=this.value13
            this.litigantName=''
        }else{
            this.litigantName=this.value13
            this.caseNo=''
        }
        this.updateValue();
      }
  },
  methods: {
    updateValue(
      year = this.year,
      month = this.month,
      judgeId = this.checkJudge,
      openState = this.checkAllGroup,
      caseNo=this.caseNo,
      litigantName=this.litigantName
    ) {
        console.log(caseNo)
      this.$emit("updateValue", year, month, judgeId,openState,caseNo,litigantName);
      this.judgeInfoVisible = false;
      this.totalInfos = false;
    },
    showCourtDate(){
      this.$emit("showCourtDate");
    },
    prevYear() {
        if (this.select3=='案号') {
            this.caseNo=this.value13
            this.litigantName=''
        }else{
            this.litigantName=this.value13
            this.caseNo=''
        }
      this.updateValue(this.year - 1);
    },
    nextYear() {
        if (this.select3=='案号') {
            this.caseNo=this.value13
            this.litigantName=''
        }else{
            this.litigantName=this.value13
            this.caseNo=''
        }
      this.updateValue(this.year + 1);
    },
    prevMonth() {
      const { year, month } = calcPrevMonth(this.year, this.month);
      if (this.select3=='案号') {
            this.caseNo=this.value13
            this.litigantName=''
        }else{
            this.litigantName=this.value13
            this.caseNo=''
        }
      this.updateValue(year, month);
    },
    nextMonth() {
      const { year, month } = calcNextMonth(this.year, this.month);
      if (this.select3=='案号') {
            this.caseNo=this.value13
            this.litigantName=''
        }else{
            this.litigantName=this.value13
            this.caseNo=''
        }
      this.updateValue(year, month);
    },
    showJudgeInfo(e) {
      if(this.judgeInfoVisible == true){
        this.judgeInfoVisible = false;
      }else{
        this.judgeInfoVisible = true;
      }
      
    },
    showInfo(){
      if(this.totalInfos == true){
        this.totalInfos = false;
      }else{
        this.totalInfos = true;
      }
    },
    seacher(){
        if (this.select3=='案号') {
            this.caseNo=this.value13
            this.litigantName=''
        }else{
            this.litigantName=this.value13
            this.caseNo=''
        }
        console.log(this.caseNo)
        this.updateValue();
    },
    clickOutSide(e) {
      if (this.pickerVisible && !this.$refs.picker.contains(e.target)) {
        this.pickerVisible = false;
      }
      if (this.judgeInfoVisible && !this.$refs.judge.contains(e.target)) {
        this.judgeInfoVisible = false;
      }
      if (this.totalInfos && !this.$refs.Infos.contains(e.target)) {
        this.totalInfos = false;
      }
    },
    selectJudgeId() {
      console.log(this.checkAllGroup)
      if (this.select3=='案号') {
            this.caseNo=this.value13
            this.litigantName=''
        }else{
            this.litigantName=this.value13
            this.caseNo=''
        }
      this.updateValue();
    }
  },
  created() {
    document.addEventListener("mouseup", this.clickOutSide);
    getJudgeList().then(res => {
      if (res.data.state == 100) {
        this.judgeList = res.data.result;
        this.checkJudge.push(res.data.current);
        // res.data.result.map(item => {
        //   this.checkJudge.push(item.id);
        // });
      } else {
        this.$Message.error(res.data.message);
      }
    });
    EventBus.$on('updateViews', target => {  
        console.log(target);  
        this.$emit("updateValue", this.year, this.month, this.checkJudge,this.checkAllGroup,this.caseNo,this.litigantName,target);
    });
  },
  destoryed() {
    document.removeEventListener("mouseup", this.clickOutSide);
  }
};
</script>
<style lang="less">
@import "./variables.less";

.schedule-calendar- {
  &hd {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    height: @sc-header-height;
    padding: @sc-header-padding 0;
    font-size: @sc-header-fs;
    line-height: @sc-header-height - @sc-header-padding * 2;
    background: @sc-primary-color;
    color: @sc-body-color;
    user-select: none;
  }
  &arrow {
    font-family: consolas;
    font-size: inherit;
    font-weight: 400;
    padding: 0 10px;
    height: 100%;
    color: @sc-primary-light-color;

    &:active {
      background: darken(@sc-primary-dark-color, 15%);
    }
    &.double-arrow {
      letter-spacing: -3px;
    }
  }
  &picker {
    position: relative;
    z-index: 20;
    padding: 4px 5px;
    height: 100%;
  }
  &arrow,
  &display {
    border-radius: 2px;
    transition: 0.2s ease-in-out;
    &:hover {
      color: #fff;
      background: @sc-primary-dark-color;
    }
  }
  &display {
    padding: 0 10px;
    line-height: 32px;
    cursor: pointer;
  }
}
.funnel-wrapper {
  display: inline;
  position: absolute;
  right: 60px;
  cursor: pointer;
}
.infosa{
  display: inline-block;
  position: absolute;
  right: 260px;
  cursor: pointer;
}
.dspan_0{ 
  background: #FFE001;
}
.dspan_1{
  background: #22B573;
}
.dspan_2{
  background: #FF2E07;
}
.judgeInfo {
  width: 400px;
  background: #fff;
  position: absolute;
  right: 0px;
  top: 46px;
  z-index: 99;
  border-radius: 15px;
  padding: 5px 10px;
  box-shadow: 3px 3px 30px #999;
  .ivu-checkbox-group-item,
  .ivu-switch {
    display: block;
    font-size: 14px;
  }
  .judgeD{
    width: 195px;
    display: inline-block;
    border-right: 1px solid #ccc;
  }
  .calenD{
    width:165px;
    min-height: 30px;
    float: right;
  }
  .colorBox {
    display: inline-block;
    width: 60px;
    height: 20px;
    vertical-align: middle;
  }
  .status_1 {
    background: #A7D5EC;
  }
  .status_2 {
    background: #EDDCC2;
  }
  .status_3 {
    background: #C7B07B;
  }
  .status_4 {
    background: #FBEDFC;
  }
  .status_5 {
    background: #2196f3;
  }
  .status_6 {
    background: #00bcd4;
  }
  .status_7 {
    background: #4caf50;
  }
  .status_8 {
    background: #cddc39;
  }
  .status_9 {
    background: #ff9800;
  }
  .status_10 {
    background: #607d8b;
  }
  .ivu-btn-primary {
    color: #fff;
    background-color: #40a9ff;
    border-color: #40a9ff;
    margin: 5px auto;
    display: block;
    width: 100px;
  }
}
</style>
