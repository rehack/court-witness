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
        <div class="funnel-wrapper" ref="judge" @click="showJudgeInfo">
            <Icon type="funnel"></Icon>
            筛选
            <div class="judgeInfo" v-show="judgeInfoVisible">
                <CheckboxGroup v-model="checkJudge">
                    <Checkbox v-for="(item, i) in judgeList" :label="item.id" :key="i">
                        <span style="color: #000">{{ item.name }}</span>
                        <span class="colorBox" :class="'status_'+(i+1)"></span>
                    </Checkbox>
                </CheckboxGroup>
                <Button type="primary" @click="selectJudgeId">筛选</Button>
            </div>
        </div>
        
    </header>
</template>
<script>
import { calcPrevMonth, calcNextMonth } from "./utils";
import picker from "./picker";
import { list } from "@/api/judgeInfo.js";

export default {
  components: {
    picker
  },
  props: {
    year: Number,
    month: Number
  },
  data() {
    return {
      pickerVisible: false,
      judgeInfoVisible: false,
      judgeList: [],
      checkJudge: []
    };
  },
  methods: {
    updateValue(
      year = this.year,
      month = this.month,
      judgeId = this.checkJudge
    ) {
      this.$emit("updateValue", year, month, judgeId);
    },
    prevYear() {
      this.updateValue(this.year - 1);
    },
    nextYear() {
      this.updateValue(this.year + 1);
    },
    prevMonth() {
      const { year, month } = calcPrevMonth(this.year, this.month);
      this.updateValue(year, month);
    },
    nextMonth() {
      const { year, month } = calcNextMonth(this.year, this.month);
      this.updateValue(year, month);
    },
    showJudgeInfo(e) {
      this.judgeInfoVisible = true;
    },
    clickOutSide(e) {
      if (this.pickerVisible && !this.$refs.picker.contains(e.target)) {
        this.pickerVisible = false;
      }
      if (this.judgeInfoVisible && !this.$refs.judge.contains(e.target)) {
        this.judgeInfoVisible = false;
      }
    },
    selectJudgeId() {
      this.updateValue();
    }
  },
  created() {
    document.addEventListener("mouseup", this.clickOutSide);
    list().then(res => {
      if (res.data.state == 100) {
        this.judgeList = res.data.result.content;
        res.data.result.content.map(item => {
          this.checkJudge.push(item.id);
        });
      } else {
        this.$Message.error(res.data.message);
      }
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
.judgeInfo {
  width: 200px;
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
  .colorBox {
    display: inline-block;
    width: 60px;
    height: 20px;
    vertical-align: middle;
  }
  .status_1 {
    background: #f44336;
  }
  .status_2 {
    background: #e91e63;
  }
  .status_3 {
    background: #9c27b0;
  }
  .status_4 {
    background: #3f51b5;
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
