<style>
.rightEv{
  display: inline-block;
  width:100px;
  height: 50px;
  position: absolute;
}
</style>

<template>
  <div>
    <li role="treeitem"
        :class="classes"
        :draggable="draggable"
        @dragstart.stop="onItemDragStart($event, _self, _self.model)"
        @dragend.stop.prevent="onItemDragEnd($event, _self, _self.model)"
        @dragover.stop.prevent="isDragEnter = true"
        @dragenter.stop.prevent="isDragEnter = true"
        @dragleave.stop.prevent="isDragEnter = false"
        @drop.stop.prevent="handleItemDrop($event, _self, _self.model)">
        <div role="presentation" :class="wholeRowClasses" v-if="isWholeRow">&nbsp;</div>
        <i class="tree-icon tree-ocl" role="presentation" @click="handleItemToggle"></i>
        <div :class="anchorClasses" @contextmenu.prevent="show1(model)"  v-on="events">
          <!-- @contextmenu.prevent="show1(model[textFieldName],dex)" -->
            <i class="tree-icon tree-checkbox" role="presentation" v-if="showCheckbox && !model.loading"></i>
            <slot :vm="this" :model="model">
                <i :class="themeIconClasses" role="presentation" v-if="!model.loading"></i>
                <span v-html="model[textFieldName]"></span>
            </slot>
        </div>
        <!-- <div class="rightEv">
          <p>创建同级目录</p>
          <p>关闭</p>
        </div> -->
        <ul role="group" ref="group" class="tree-children" v-if="isFolder" :style="groupStyle">
            <tree-item v-for="(child, index) in model[childrenFieldName]"
                       :key="index"
                       :data="child"
                       :text-field-name="textFieldName"
                       :value-field-name="valueFieldName"
                       :children-field-name="childrenFieldName"
                       :item-events="itemEvents"
                       :whole-row="wholeRow"
                       :show-checkbox="showCheckbox"
                       :allow-transition="allowTransition"
                       :height= "height"
                       :parent-item="model[childrenFieldName]"
                       :draggable="draggable"
                       :drag-over-background-color="dragOverBackgroundColor"
                       :on-item-click="onItemClick"
                       :on-item-toggle="onItemToggle"
                       :on-item-drag-start="onItemDragStart"
                       :on-item-drag-end="onItemDragEnd"
                       :on-item-drop="onItemDrop"
                       :contextmenu="show1"
                       :cloaseM="closeMM"
                       :klass="index === model[childrenFieldName].length-1?'tree-last':''">
                <template slot-scope="_">
                    <slot :vm="_.vm" :model="_.model">
                        <i :class="_.vm.themeIconClasses" role="presentation" v-if="!model.loading"></i>
                        <span v-html="_.model[textFieldName]"></span>
                    </slot>
                </template>
            </tree-item>
        </ul>
        
    </li>
    <!-- <li
      role="treeitem"
      :class="classes"
      :draggable="draggable"
      v-if="model[topClass] != 1 && dex == model.length"
    >
        <div role="presentation" :class="wholeRowClasses" v-if="isWholeRow">&nbsp;</div>
        <i class="tree-icon tree-ocl" role="presentation" ></i>
        <span><Icon type="plus-round"></Icon>
        {{'11'+model[topClass]}}</span>
    </li> -->
  </div>
</template>
<script>
export default {
  name: "TreeItem",
  props: {
    data: { type: Object, required: true },
    textFieldName: { type: String },
    valueFieldName: { type: String },
    childrenFieldName: { type: String },
    itemEvents: { type: Object },
    topClass:{type: String},
    dex:{type: Number},
    wholeRow: { type: Boolean, default: false },
    showCheckbox: { type: Boolean, default: false },
    allowTransition: { type: Boolean, default: true },
    height: { type: Number, default: 24 },
    parentItem: { type: Array },
    draggable: { type: Boolean, default: false },
    dragOverBackgroundColor: { type: String },
    onItemClick: {
      type: Function,
      default: () => false
    },
    onItemToggle: {
      type: Function,
      default: () => false
    },
    onItemDragStart: {
      type: Function,
      default: () => false
    },
    contextmenu: {
      type: Function,
      default: () => false
    },
    cloaseM: {
      type: Function,
      default: () => false
    },
    onItemDragEnd: {
      type: Function,
      default: () => false
    },
    onItemDrop: {
      type: Function,
      default: () => false
    },
    klass: String
  },
  data() {
    return {
      isHover: false,
      isDragEnter: false,
      model: this.data,
      maxHeight: 0,
      isCl:this.$store.getters.isCl,
      events: {}
    };
  },
  watch: {
    isDragEnter(newValue) {
      if (newValue) {
        this.$el.style.backgroundColor = this.dragOverBackgroundColor;
      } else {
        this.$el.style.backgroundColor = "inherit";
      }
    },
    data(newValue) {
      this.model = newValue;
    },
    "model.opened": {
      handler: function(val, oldVal) {
        this.onItemToggle(this, this.model);
        this.handleGroupMaxHeight();
      },
      deep: true
    }
  },
  computed: {
    isFolder() {
      return (
        this.model[this.childrenFieldName] &&
        this.model[this.childrenFieldName].length
      );
    },
    classes() {
      return [
        { "tree-node": true },
        { "tree-open": this.model.opened },
        { "tree-closed": !this.model.opened },
        { "tree-leaf": !this.isFolder },
        { "tree-loading": !!this.model.loading },
        { "tree-drag-enter": this.isDragEnter },
        { [this.klass]: !!this.klass }
      ];
    },
    anchorClasses() {
      return [
        { "tree-anchor": true },
        { "tree-disabled": this.model.disabled },
        { "tree-selected": this.model.selected },
        { "tree-hovered": this.isHover }
      ];
    },
    wholeRowClasses() {
      return [
        { "tree-wholerow": true },
        { "tree-wholerow-clicked": this.model.selected },
        { "tree-wholerow-hovered": this.isHover }
      ];
    },
    themeIconClasses() {
      return [
        { "tree-icon": true },
        { "tree-themeicon": true },
        { [this.model.icon]: !!this.model.icon },
        { "tree-themeicon-custom": !!this.model.icon }
      ];
    },
    isWholeRow() {
      if (this.wholeRow) {
        if (this.$parent.model === undefined) {
          return true;
        } else if (this.$parent.model.opened === true) {
          return true;
        } else {
          return false;
        }
      }
    },
    groupStyle() {
      return {
        position: this.model.opened ? "" : "relative",
        "max-height": !!this.allowTransition ? this.maxHeight + "px" : "",
        "transition-duration": !!this.allowTransition
          ? Math.ceil(this.model[this.childrenFieldName].length / 100) * 300 +
            "ms"
          : "",
        "transition-property": !!this.allowTransition ? "max-height" : "",
        display: !!this.allowTransition
          ? "block"
          : this.model.opened ? "block" : "none"
      };
    }
  },
  methods: {
    handleItemToggle(e) {
      if (this.isFolder) {
        this.model.opened = !this.model.opened;
        this.onItemToggle(this, this.model);
      }
    },
    show1(ob){
      this.isCl = false;
      this.$store.commit("SET_ISCL", this.isCl);
      this.contextmenu(ob)
      // alert(str)
    },
    closeMM(){
      this.isCl = true;
      this.$store.commit("SET_ISCL", this.isCl);
      this.cloaseM()
    },
    handleGroupMaxHeight() {
      if (!!this.allowTransition) {
        let length = 0;
        let childHeight = 0;
        if (this.model.opened) {
          length = this.$children.length;
          for (let children of this.$children) {
            childHeight += children.maxHeight;
          }
        }
        this.maxHeight = length * this.height + childHeight;
        if (this.$parent.$options._componentTag === "tree-item") {
          this.$parent.handleGroupMaxHeight();
        }
      }
    },
    handleItemClick(e) {
      if (this.model.disabled) return;
      if (e.target.className.indexOf("tree-checkbox") != -1) {
        this.model.selected = !this.model.selected;
      }

      this.onItemClick(this, this.model, e);
    },
    changeBc(){
      this.handleItemMouseOver();
    },
    handleItemMouseOver() {
      let cssAry = document.getElementsByClassName('tree-wholerow-hovered');
      if(cssAry.length > 1){
        for(let i=0;i<cssAry.length;i++){
          if(this != cssAry[i]){
            cssAry[i].classList.remove("tree-wholerow-hovered");
          }
        }
      }
      this.isHover = true;
      this.closeMM();
    },
    handleItemMouseOut() {
      if(this.$store.getters.isCl != false){
        this.isHover = false;
      }
    },
    handleItemDrop(e, oriNode, oriItem) {
      this.$el.style.backgroundColor = "inherit";
      this.onItemDrop(e, oriNode, oriItem);
    }
  },
  created() {
    const self = this;
    const events = {
      click: this.handleItemClick,
      mouseover: this.handleItemMouseOver,
      mouseout: this.handleItemMouseOut
    };
    for (let itemEvent in this.itemEvents) {
      let itemEventCallback = this.itemEvents[itemEvent];
      if (events.hasOwnProperty(itemEvent)) {
        let eventCallback = events[itemEvent];
        events[itemEvent] = function(event) {
          eventCallback(self, self.model, event);
          itemEventCallback(self, self.model, event);
        };
      } else {
        events[itemEvent] = function(event) {
          itemEventCallback(self, self.model, event);
        };
      }
    }
    this.events = events;
  },
  mounted() {
    this.handleGroupMaxHeight();
  }
};
</script>
