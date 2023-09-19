<script>
/**
 * Dashboard component
 */
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
  head() {
    return {
      title: `${this.title} | Nuxtjs Responsive Bootstrap 5 Admin Dashboard`
    };
  },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "ShirtPlaces"
        },
        {
          text: "Dashboard",
          active: true
        }
      ],
      valueStorefronts: null,
      optionsStorefronts: [
        "Alaska",
        "Hawaii",
        "California",
        "Nevada",
        "Oregon",
        "Washington",
        "Arizona",
        "Colorado",
        "Idaho",
        "Montana",
        "Nebraska",
        "New Mexico",
        "North Dakota",
        "Utah",
        "Wyoming",
        "Alabama",
        "Arkansas",
        "Illinois",
        "Iowa"
      ],
      selectedDefault: "campaign"
    };
  },
  mounted() {
    this.$router.push('/products/wizard')
  }
};

</script>


<template>
  <div>
    <PageHeader :title="title" :items="items" />
  </div>
</template>

<style></style>
