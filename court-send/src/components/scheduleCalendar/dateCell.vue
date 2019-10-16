<template>
    <div class="schedule-calendar-date"
         :class="[type, { today: isToday, dragged: draggedIndex === index }]"
         @dragover.prevent=""
         @dragenter.prevent="dragenter"
         @drop="onDrop"
         @click="cellClick">
        <div class="schedule-calendar-date-hd">
            <div class="schedule-calendar-date-label">{{date.getDate()}}</div>
            <button type="button"
                    class="schedule-calendar-counter"
                    v-if="details.length > 0"
                    @click.stop.prevent="expandAll">共 {{details.length}} 项</button>
        </div>
        <div class="schedule-calendar-details"
             :class="{ expanded }"
             :style="detailsPost"
             ref="details"
             >
            <div v-show="expanded"
                 class="schedule-calendar-details-hd">{{ dateString }}</div>
            <div class="schedule-calendar-details-bd" :style="heiScro">
                <event-item v-if="details.length"
                            v-for="item in displayDetails"
                            :item="item"
                            :date="date"
                            :type="type"
                            :itemRender="itemRender"
                            @item-dragstart="dragItem"
                            :key="item.id"></event-item>
                      
            </div>
        </div>
        <Modal
              v-model="daylyModal"
              width="750"
              ok-text="关闭"
              :cancel-text="''"
              
              :title="dateString">
              <div style="width:720px;margin: 0 auto;">
                <div class="cles" style="width: 100%;">
                    <div style="height: 45px;">
                        <Checkbox @on-change="akkCheckHandle" style="line-height: 27px;padding-left: 15px;text-align:right;margin-right: 10px;" v-model="allCheck">全选</Checkbox>
                        <span :class="nowSe == 'time' ? 'btnSelected' : 'noneSel'" @click="cliSort('time')">
                            按时间排序↓
                        </span>
                        <span :class="nowSe == 'caseNo' ? 'btnSelected' : 'noneSel'" @click="cliSort('caseNo')">
                            按案号排序↓
                        </span>
                    </div>
                    
                    <div v-for="i in allList" :class="allList.length == 1 ? 'schedule-calendar-details-bd' : 'schedule-calendar-details-bd'" style="margin-bottom: 10px;padding-right: 15px;padding-left: 15px;overflow: auto;;">
                        <div class="schedule-calendar-details-hd" style="font-weight:600">{{ i.judgeName }}</div>
                        <div v-for="item in i.textList" style="display:block">
                            <Checkbox style="line-height: 27px;display:inline-block;float: left;text-align:right;margin-right: 10px;" v-model="item.isChecked"></Checkbox>
                            <event-item :class="allList.length == 1 ? 'dayItems' : 'dayItems'" style="width:95%;margin-left: 25px;" v-if="details.length"
                                    :item="item"
                                    :date="date"
                                    :type="type"
                                    :itemRender="itemRender"
                                    @item-dragstart="dragItem"
                                    :key="item.id"></event-item>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div slot="footer">
                <Button @click="inCaseInfo"  type="primary" >案件导入内网</Button>
                <Button @click="daylyModal = false"  type="dashed" >关闭</Button>
            </div>
          </Modal>
    </div>
</template>
<script>
import { EventBus, isSameDay, format, Store } from './utils';
import { setCaseForCalendar } from "@/api/finanseCase.js";
import eventItem from './eventItem';

export default {
    components: {
        eventItem
    },
    props: {
        date: Date,
        type: String,
        data: Array,
        index: Number,
        draggedIndex: Number,
        itemRender: Function
    },
    data () {
        return {
            volume: 0,
            expanded: false,
            daylyModal:false,
            allCheck:false,
            allList:[],
            caseIdList:[],
            nowSe:'time'
        };
    },
    computed: {
        isToday () {
            return isSameDay(new Date(), this.date);
        },
        details () {
            return this.data.length
                ? this.data.filter(item => isSameDay(item.date, this.date))
                : [];
        },
        displayDetails () {
            return this.expanded ? this.details : this.details.slice(0, this.volume);
        },
        dateString () {
            return format(this.date);
        },
        heiScro(){
            const post = {};
            if(this.expanded){
                post.height = '300px';
                post.overflow =  'auto';
            }else{

            }

            return post;
        },
        detailsPost () {
            const post = {};
            if (this.index >= 35) {
                post.bottom = 0;
                
            } else {
                post.top = 0;
            }

            if ((this.index + 1) % 7 === 0) {
                post.right = 0;
            } else {
                post.left = 0;
            }

            return post;
        }
    },
    created() {
        EventBus.$on('changeSort', target => {    
            this.nowSe = target;
        });
    },
    watch: {
        details(cur,old){
            // console.log(cur)
            // console.log(old)
            if(this.daylyModal){
                this.expandAll();
            }
            
        }
    },
    methods: {
        cliSort(sr){
            EventBus.$emit('updateViews', sr);
        },
        calcVolume () {
            this.volume = Math.floor(this.$refs.details.clientHeight / 27);
        },
        closeModel(){
            console.log(999666)
            this.daylyModal = false;
        },
        inCaseInfo(){
            console.log(this.allList)
            let arr = [];
            this.allList.map(item => {
                item.textList.map(i => {
                    if(i.isChecked){
                        arr.push(i.caseId)
                    }
                })
            })
            console.log(arr)
            if(arr.length == 0){
                this.$Message.info('请选择案件');
                return false;
            }
            let showcaseId=arr.join(",")
            setCaseForCalendar(showcaseId).then(res=>{
                if (res.data.state==100) {
                    // this.createEmsExcelWindow=false
                    this.$Message.success(res.data.message);
                    this.daylyModal = false;
                }else{
                    this.$Message.info(res.data.message);
                }
            })
        },
        akkCheckHandle(){
            
            if(this.allCheck){
                this.allList.map(item => {
                    item.textList.map(i => {
                        i.isChecked = true;
                    })
                })
            }else{
                this.allList.map(item => {
                    item.textList.map(i => {
                        i.isChecked = false;
                    })
                })
            }
            
        },
        expandAll () {
            this.allList = [];
            // console.log(this.displayDetails)
            // console.log(this.data)
            // console.log(this.details)
            
            let arr =[];
            this.details.map((item, index) => {
                const ss = {};
                ss.judgeName = item.judgeName;
                arr.push(ss);
            });
            for(var i = 0; i < arr.length-1; i++){
                for(var j = i+1; j < arr.length; j++){
                    if(arr[i].judgeName==arr[j].judgeName){
                        arr.splice(j,1);
                        j--;
                    }
                }
            }
            for(let i = 0;i<arr.length;i++){
                let data = {
                    judgeName:arr[i].judgeName,
                    textList:[],
                    len:'',
                }
                this.details.map((item, index) => {
                    if(arr[i].judgeName == item.judgeName){
                        item.isChecked = false;
                        data.textList.push(item);
                        // data.textList.push(item);
                        // data.textList.push(item);
                        // data.textList.push(item);
                        // data.textList.push(item);
                    }
                });
                data.len = data.textList.length;
                this.allList.push(data);
                // this.allList.push(data);
            }
            console.log(this.allList)
            // this.daylyModal = true;
            this.allList = this.arrItemSort(this.allList,'len',1);
            if(this.allList[0].textList.length < 6 && this.allList.length < 2){
                // this.expanded = true;
                this.daylyModal = true;
                document.addEventListener('mouseup', this.reduceAll);
            }else{
                this.daylyModal = true;
            }
            
        },
        reduceAll (e) {
            if (!this.$refs.details.contains(e.target)) {
                this.expanded = false;
                Store.hasExpand = true; // 设为 true，当前点击仅仅是为了收缩单元格
                document.removeEventListener('mouseup', this.reduceAll);
            }
        },
        arrItemSort(arrObj,keyName,type) {
            //这里如果 直接等于arrObj，相当于只是对对象的引用，改变排序会同时影响原有对象的排序，而通过arrObj.slice(0)，
            //表示把对象复制给另一个对象，两者间互不影响 
            var tempArrObj = arrObj.slice(0);
            var compare = function (keyName,type) {
                return function (obj1, obj2) {
                    var val1 = obj1[keyName];
                    var val2 = obj2[keyName];
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                        val1 = Number(val1);
                        val2 = Number(val2);
                        }
                        //如果值为空的，放在最后       
                        if (val1 == null && val2 == null) {
                        return 0;
                    } else if (val1 == null && val2!= null ) {
                        return (type==1 ? -1 : 1);
                    } else if (val2 == null && val1!= null ) {
                        return (type==1 ? 1 : -1);
                    }            
                        //排序
                    if (val1 < val2) {
                        return (type==1 ? 1 : -1);
                    } else if (val1 > val2) {
                        return (type==1 ? -1 : 1);;
                    } else {
                        return 0;
                    }            
                } 
            }
            return tempArrObj.sort(compare(keyName,type));
        },
        dragenter (e) {
            if (this.$el.contains(e.target)) {
                this.$emit('highlight', this.index);

                if (this.$el === e.target) {
                    EventBus.$emit(
                        'cell-dragenter',
                        e,
                        format(this.date, 'yyyy-MM-dd'),
                        this.type,
                        this.index
                    );
                }
            }
        },
        dragItem (e, item, date, type) {
            this.$emit('highlight', this.index);
            EventBus.$emit(
                'item-dragstart',
                e,
                item,
                format(date, 'yyyy-MM-dd'),
                type
            );
        },
        onDrop (e) {
            this.$emit('highlight', -1);
            EventBus.$emit(
                'item-drop',
                e,
                format(this.date, 'yyyy-MM-dd'),
                this.type,
                this.index
            );
        },
        cellClick (e) {
            // 此时为收缩单页格，不触发 date-click
            if (Store.hasExpand) {
                // 设为 false，下次正常触发 date-click
                Store.hasExpand = false;
                return;
            }
            EventBus.$emit('date-click', e, format(this.date, 'yyyy-MM-dd'));
        }
    },
    mounted () {
        this.calcVolume();
        window.addEventListener('resize', this.calcVolume);
    },
    destroyed () {
        window.removeEventListener('resize', this.calcVolume);
    }
};
</script>
<style lang="less">
.dayItems .schedule-calendar-detail-item{
    white-space:inherit
}
.onde{
    width:740px
}
.onet{
    display:inline-block;
    float: left;
}
.cles{
    *zoom:1;
}
.noneSel{
    padding: 6px 7px;
    border: 1px dashed #ccc;
    border-radius: 7px;
    cursor: pointer;
    float: right;
    margin-right: 10px;
}
.btnSelected{
    padding: 6px 7px;
    border: 1px dashed #40a9ff;
    border-radius: 7px;
    cursor: pointer;
    color: #40a9ff;
    float: right;
    margin-right: 10px;
}
.cles:after {content:'';display:block;clear:both;height:0px;}
@import "./variables.less";

.schedule-calendar- {
  &date {
    position: relative;
    display: flex;
    flex-direction: column;
    width: ~"calc(100% / 7)";
    height: ~"calc(100% / 6)";
    min-width: 94px;
    min-height: 40px;
    padding: 4px;
    border-top: 1px solid @sc-border-color;
    border-left: 1px solid @sc-border-color;
    user-select: none;

    &:nth-child(7n + 1) {
      border-left: none;
    }

    &.prev,
    &.next {
      color: @sc-gray-light-color;
      background: @sc-gray-background;
    }

    &-label {
      width: @sc-data-label-size;
      height: @sc-data-label-size;
      line-height: @sc-data-label-size;
      text-align: center;
      border-radius: 50%;
    }

    &.today {
      .schedule-calendar-date-label {
        color: @sc-body-color;
        background: @sc-primary-color;
      }
    }

    &.dragged {
      background: @sc-primary-light-color;
      .schedule-calendar-details {
        background: @sc-primary-light-color;
      }
    }
  }
  &date-hd {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .schedule-calendar-details-bd > div{
    //   position: relative;
      zoom:1;
  }
.schedule-calendar-details-bd > div::after {
    content:'';
    display:block;
    clear:both;
    height:0px;
}


  &details {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: center;

    &.expanded {
      position: absolute;
      z-index: 2;
      width: @sc-details-width;
      min-width: 100%;
      padding: 0 6px 10px;
      background: @sc-body-color;
      box-shadow: @sc-box-shadow;
      .schedule-calendar-details-bd {
        overflow-y: auto;
        // max-height: @sc-details-height - @sc-details-hd-height;
      }
    }
  }
  &details-hd {
    height: @sc-details-hd-height;
    line-height: @sc-details-hd-height;
    font-size: 13px;
    color: @sc-gray-color;
    text-align: center;
  }
  &counter {
    font-size: 13px;
    color: @sc-primary-color;
  }
}
</style>
