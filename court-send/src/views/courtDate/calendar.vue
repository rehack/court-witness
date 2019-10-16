<template>
  <div>
    <!-- <calendar1 v-if="calendar1"/> -->
    <!-- <calendar2 v-if="calendar2"/> -->
    <calendar2 />
  </div>
</template>
<script>
import { getUserInfo } from "@/api/user.js";
import calendar1 from "./calendar1.vue";
import calendar2 from "./calendar2.vue";
export default {
  components: {
    calendar1,
    calendar2
  },
  data() {
    return {
      calendar1: false,
      calendar2:false
    };
  },
  created() {
    getUserInfo().then(res => {
      if (res.data.court.name == "殿前法庭") {
        this.calendar2 = true;
      } else {
        this.calendar1 = true;
      }
    });
  }
};
</script>
