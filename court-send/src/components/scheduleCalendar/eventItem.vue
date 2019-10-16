<script>
import { EventBus } from "./utils";

export default {
  props: {
    item: Object,
    date: Date,
    type: String,
    itemRender: Function
  },
  methods: {
    onDrag(e) {
      this.$emit("item-dragstart", e, this.item, this.date, this.type);
    },
    onClick(e) {
      console.log(this.item)
      e.stopPropagation();
      e.preventDefault();
      EventBus.$emit("item-click", e, this.item);
    }
  },
  render(h,params) {
    return h(
      "div",
      {
          class:[
              'dspanBox'
          ],
          style:{
            //   'height':'26px',
              'position':'relative'
          }
      },
      [
        // h('CheckboxGroup', {
        //     props:{
        //         value: this.item.caseId,
        //     },
        //     on: {
        //         'on-change':(value) => {
        //             // this.listData[params.index].checkboxValue = value;
        //         }
        //     },
        //   },
        //   h('checkbox', {
        //           props: {label: ''}
        //     }, )
        // ),
        h(
          'span',
          {
             class: [
              "dspan",
              `dspan_${this.item.openState}`,
            ],
          },
          // '○'
        ),
        h(
          "div",
          {
            class: [
              "schedule-calendar-detail-item",
              // `schedule-calendar-status_${this.item.openState}`,
              // `schedule-calendar-status_dspan_${this.item.openState}`,
            ],
            style:{
                'padding-left':'10px',
                'float':'none'
            },
            attrs: {
              draggable: true
            },
            on: {
              dragstart: this.onDrag,
              click: this.onClick
            }
          },
          this.item ?  [h("span", this.item.text)] : ""
        )
      ],
      // {
      //   class: [
      //     "schedule-calendar-detail-item",
      //     `schedule-calendar-status_${this.item.status}`
      //   ],
      //   attrs: {
      //     draggable: true
      //   },
      //   on: {
      //     dragstart: this.onDrag,
      //     click: this.onClick
      //   }
      // },
      // this.itemRender
      //   ? [this.itemRender(this.item)]
      //   : [h("span", this.item.text)]
    );
  }
};
</script>
<style lang="less">
@import "./variables.less";
.expanded {
  .schedule-calendar-detail-item {
    white-space: inherit;
  }
}
.cles{
  .schedule-calendar-detail-item {
    width: calc(95%) !important;
  }
}
.dspan{
    // width: 15%;
    // float: left;
    position: absolute;
    left:0;
    // width: 24px;
    // height: 24px;
    // margin-top: 3px;

    line-height: 24px;
    width: 16px;
    height: 16px;
    margin: 7px 4px 4px 4px;

    
    border-radius: 8px;
    // background-image:url('../../images/red3.png');
    // background-size: 100% 100%;
}

// .dspan_3{
//   background: #;
// }
.schedule-calendar- {
  &detail-item {
    margin: 3px 3px 0;
    float: left;
    width: calc(100% - 20px);
    // width: 80%;
    font-size: 12px;
    // color: #fff;
    line-height: 2em;
    border-radius: 2px;
    // background: @sc-primary-color;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: 0.2s ease-in-out;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2), 0 -3px 8px rgba(0, 0, 0, 0.2);
    }

    > * {
      padding: 0 5px;
    }
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



&status_0 {
    background: #FFE001;
  }
  &status_1 {
    background: #22B573;
  }
  &status_2 {
    background: #FF2E07;
  }

  // &status_1 {
  //   background: #A7D5EC;
  // }
  // &status_2 {
  //   background: #EDDCC2;
  // }
  // &status_3 {
  //   background: #C7B07B;
  // }
  &status_4 {
    background: #FBEDFC;
  }
  &status_5 {
    background: #74E4F2;
  }
  &status_6 {
    background: #00bcd4;
  }
  &status_7 {
    background: #4caf50;
  }
  &status_8 {
    background: #cddc39;
  }
  &status_9 {
    background: #ff9800;
  }
  &status_10 {
    background: #607d8b;
  }
  &status_11 {
    background: #145d82;
  }
  &status_12 {
    background: #0b591b;
  }
  &status_13 {
    background: #4f0e61;
  }
  &status_14 {
    background: #E4C6FE;
  }
  &status_15 {
    background: #78780e;
  }
}
</style>
