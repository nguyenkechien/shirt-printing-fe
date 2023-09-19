<template>
  <div class="col-md-6 col-xl-3">
    <div class="card">
      <div class="card-body">
        <div class="cardHeight">
          <p class="mb-1 mt-1 headerTitleCard">
            <span class="text-muted mb-0">{{ title }}</span>
            <span class="icon"><i :class="`bx bx-${icon}`"></i></span>
          </p>
          <h4 class="mb-1 mt-1 mt-20">
            <span data-plugin="counterup">
              <countTo :startVal="0" :endVal="value" :duration="2000"></countTo>
            </span>
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import countTo from "vue-count-to";

export default {
  name: 'DashboardCard',
  components: {
    countTo
  },
  props: {
    title: {
      type: String,
      required: true,
      default: 'Total Revenue'
    },
    value: {
      type: Number,
      required: true,
      default: '0'
    },
    icon: {
      type: String,
      required: true,
      default: 'mdi mdi-arrow-up-bold'
    }
  },
}
</script>
  
  