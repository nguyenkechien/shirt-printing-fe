<template>
  <div class="row">
    <div class="col-xs-12 col-xl-3">
      <ul class="m-0 p-0 mb-4">
        <li
          v-for="(type, index) in types"
          :key="index"
          :class="{ 'product-type': true, activated: index === activated }"
          @click="setActivate(index)"
        >
          <div class="row">
            <div class="col-3">
              <img class="img-fluid" :src="type.thumbnail" :alt="type.name" />
            </div>
            <div class="col-9">
              <h4 class="h6">{{ type.name }}</h4>
              <p class="text-truncated">{{ type.description }}</p>
              <ul class="colors">
                <li
                  v-on:click.stop
                  :class="'color-item color-item-' + color.value.toLowerCase()"
                  v-for="(color, name) in type.attributes.colors.options"
                  :key="name"
                  @click="selectColor(color.value, index)"
                >
                  <i
                    :class="'color color-' + color.value.toLowerCase()"
                    :style="{ 'background-color': color.hex }"
                    >{{ color.value }}</i
                  >
                  <i
                    v-if="color.value == selectedColor && index === activated"
                    class="checked uil uil-check"
                  ></i>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="col-xs-12 col-xl-9">
      <div>
        <h3 class="h5">Switch</h3>
        <div class="button-items">
          <button
            v-for="(display, idx) in types[activated].displays"
            :key="idx"
            @click="switchDesign(idx)"
            type="button"
            class="btn btn-md btn-primary"
          >
            {{ types[activated].displays[idx].label || idx }}
          </button>
        </div>
      </div>
      <Mockup
        ref="mockup"
        :display="activeDisplay"
        :color="selectedColor"
        :template="types[activated]"
        :design="design"
        :onChange="handleChange"
      />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import templates from "../assets/templates.json";
import Mockup from "./Mockup.vue";

export default {
  components: {
    Mockup,
  },
  props: {
    edit: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    chooses: {
      type: Array,
      required: true,
    },
  },
  data() {
    const activated = 0;
    const types = _.map(this.chooses, (id) => _.find(templates, { id }));
    const displays = _.keys(types[activated].displays);
    const activeDisplay = displays[0];
    console.log({ types });
    return {
      selectedColor: "White",
      activeDisplay,
      activated,
      types,
      design: {},
    };
  },
  mounted() {
    // fetch('https://api.shirtplaces.com/seller/layers')
    //   .then(response => response.json())
    //   .then(data => {
    //     this.posts = data;
    //   });
  },
  methods: {
    switchDesign(idx) {
      this.activeDisplay = idx;
    },
    setActivate(idx) {
      this.activated = idx;
    },
    selectColor(color, idx) {
      if (idx == this.activated) {
        this.selectedColor = color;
      }
    },
    // toggleLayer(idx) {
    //   this.layers.forEach((layer) => {
    //     layer.active = false;
    //   });
    //   this.layers[ idx ].active = true
    //   this.layers = [ ...this.layers ] // Fix layers not re-render
    // },
    handleSort() {},
    handleChange(action, layer) {
      console.log(action, layer);
      switch (action) {
        case "add":
          this.layers.push(layer);
          break;

        default:
          break;
      }
    },
    export() {
      return this.$refs.mockup.exportSnapshot();
    },
    thumb() {
      return this.$refs.mockup.exportPreview();
    },
  },
};
</script>

<style scoped>
.product-type {
  border: 1px solid #ccc;
  border-radius: 5px;
  display: block;
  margin: 0 0 12px;
  padding: 8px;
}

.product-type.activated {
  border-color: #5b73e8;
}

.colors {
  margin: 0;
  padding: 0;
}

.colors .color-item {
  display: block;
  margin: 0 5px 5px 0;
  padding: 0;
  overflow: hidden;
  float: left;
  position: relative;
}

.colors .color-item:last-child {
  margin-right: 0;
}

.colors .color-item .color {
  display: block;
  text-indent: -9999px;
  white-space: nowrap;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  z-index: 99;
}

.checked {
  position: absolute;
  top: 0;
  left: 3px;
  color: white;
}

.color-item-white .checked {
  color: black;
}
</style>
