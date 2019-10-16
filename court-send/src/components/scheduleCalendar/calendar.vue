<template>
    <div class="schedule-calendar">
        <header-bar :year="year"
                    :month="month"
                    :infoscount="count"
                    @updateValue="updateView"
                    @showCourtDate='showCourtDate'></header-bar>
        <div class="schedule-calendar-body">
            <week :startWeek="startWeek"></week>
            <month :year="year"
                   :month="month"
                   :startWeek="startWeek"
                   :data="events"
                   ref="mouths"
                   :itemRender="dateItemRender"></month>
            <div v-show="OCRLoading" style="position:absolute;top:0;bottom:0;left:0;right:0;background: rgba(255,255,255,0.5);z-index: 9999;">
              <ClipLoader style="position:absolute;top:50%;left:50%;margin-top:-50px;margin-left:-50px" color="#40a9ff" size="100px"/>
              <div style="position:absolute;top: 50%;left:50%;margin-left:-60px;color:#3399ff;margin-top: 60px;">加载中，请稍后。。。</div>
            </div>
        </div>
    </div>
</template>
<script>
import { EventBus } from "./utils";
import headerBar from "./header";
import week from "./week";
import month from "./month";
import { getJudgeList } from "@/api/judgeInfo.js";
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min.js';

export default {
  name: "schedule-calendar",
  components: {
    headerBar,
    week,
    month,
    ClipLoader
  },
  props: {
    startMonth: String,
    startWeek: {
      type: Number,
      default: 1
    },
    events: {
      type: Array,
      default: []
    },
    dateItemRender: Function,
    count:Object
  },
  data() {
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      judgeId: [],
      checkJudge: [],
      openState:[],
      OCRLoading:false,
      dragItem: null,
      litigantName:'',
      caseNo:''
    };
  },
  methods: {
    updateView(year, month, judgeId,openStateid,caseNo,litigantName,sort) {
      this.year = year;
      this.month = month;
      this.judgeId = judgeId;
      this.openState = openStateid;
      this.OCRLoading = true;
      this.caseNo=caseNo;
      this.litigantName=litigantName;
      if(sort){
        EventBus.$emit('changeSort', sort);
      }else{
        EventBus.$emit('changeSort', 'time');
      }
      
      this.$emit("event-updateView", this.year, this.month, this.judgeId,this.openState,this.caseNo,this.litigantName,sort);
    },
    showCourtDate(){
      this.$emit("even-courtDate");
    },
    cloaseReload(){
      console.log(1111)
      this.OCRLoading = false;
    },
    cellDragenter(e, date, type, index) {
      this.$emit("event-dragenter", e, this.dragItem, date);
    },
    itemDragstart(e, item, date, type) {
      this.dragItem = item;
      this.$emit("event-dragstart", e, item, date);
    },
    itemDrop(e, date, type, index) {
      if (!this.dragItem) return;
      console.log("[event-dragend]:", this.dragItem, date);
      this.$emit("event-dragend", e, this.dragItem, date);
    },
    itemClick(e, item) {
      console.log("[event-click]:", item);
      
      this.$emit("event-click", e, item);
      // this.$refs.mouths.closeList();
    },
    dateClick(e, date) {
      console.log("[date-click]:", date);
      this.$emit("date-click", e, date);
    }
  },
  created() {
    EventBus.$on("cell-dragenter", this.cellDragenter);
    EventBus.$on("item-dragstart", this.itemDragstart);
    EventBus.$on("item-drop", this.itemDrop);
    EventBus.$on("item-click", this.itemClick);
    EventBus.$on("date-click", this.dateClick);
    // getJudgeList().then(res => {
    //   if (res.data.state == 100) {
    //     res.data.result.map(item => {
    //       this.checkJudge.push(item.id);
    //     });
    //   } else {
    //     this.$Message.error(res.data.message);
    //   }
    // });
  },
  destoryed() {
    EventBus.$off();
  }
};
</script>
<style lang="less">
@import "./variables.less";

.schedule- {
  &calendar {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: @sc-cell-min-width * 7;
    color: @sc-base-color;
    font-size: @sc-base-font-size;
    box-shadow: @sc-box-shadow;

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    button {
      border: 0;
      outline: none;
      cursor: pointer;
      background: transparent;
    }

    &-body {
      position: relative;
      flex: 1;
      width: 100%;
      overflow: hidden;
      background: @sc-body-color;
      z-index: 1;
    }
  }
}
</style>
