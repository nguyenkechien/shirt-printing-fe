<script>
import _ from 'lodash'
import ColorPicker from './ColorPicker.vue'

export default {
  components: {
    ColorPicker,
  },
  data() {
    // let { fonts } = document;
    // const it = fonts.entries();

    // let vailables = {};
    // let done = false;

    // while (!done) {
    //   const font = it.next();
    //   if (!font.done) {
    //     vailables[ font.value[ 0 ].family ] = font.value[ 0 ].family;
    //   } else {
    //     done = font.done;
    //   }
    // }

    // console.log(vailables)

    return {
      name: this.layerName,
      text: "",
      color: '#F8060F',
      stretch: "normal",
      fontFamily: "Caveat",
      style: "normal",
      searchFont: '',
      fonts: [],
      availableFonts: []
    }
  },
  props: {
    // chooses: {
    //   type: Array,
    //   required: true,
    //   default() {
    //     return []
    //   }
    // },
    // design: {
    //   type: String,
    //   required: true
    // },
    layerName: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function
    },
  },
  created() {
    this.searchFont = this.fontFamily
    this.$axios.get('https://www.googleapis.com/webfonts/v1/webfonts', {
      params: {
        key: 'AIzaSyBcfFLnvnOca2Wq6TLNt9cNmOccUXHYHG8', // @TODO move to env
      }
    }).then(res => {
      this.availableFonts = res.data.items
    }).catch(err => {
      console.log(err)
    })
  },
  unmounted() {
    this.searchFont = this.fontFamily
  },
  methods: {
    changeColor(color) {
      const { r, g, b, a } = color.rgba
      this.color = `rgba(${ r }, ${ g }, ${ b }, ${ a })`
    },
    handleSubmit() {
      this.onSubmit({
        name: this.name,
        text: this.text,
        color: this.color,
        stretch: this.stretch,
        fontFamily: this.fontFamily,
        fontStyle: this.style,
      })
    },
    filterFonts() {
      let searchFont = this.searchFont.trim()
      if (searchFont.length < 3) {
        return this.fonts = [];
      }

      let keys = searchFont.split(" ")
      this.fonts = _.filter(this.availableFonts, (font) => {
        return _.some(keys, v => {
          return _.includes(font.family, v)
        })
      });
    },
    selectFont(font) {
      this.searchFont = font
      this.fontFamily = font
      this.fonts = []
    }
  }
};
</script>

<template>
  <form>
    <div class="mb-3">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" class="form-control" v-model="name" />
    </div>
    <div class="mb-3">
      <label for="text">Text</label>
      <input id="text" name="text" type="text" class="form-control" v-model="text" />
    </div>
    <div class="mb-3">
      <label for="font">Font family</label>
      <b-form-input v-model="searchFont" @input="filterFonts" placeholder="Type to search font"></b-form-input>
      <b-list-group>
        <b-list-group-item v-for="font in fonts" :key="font.family" @click="selectFont(font.family)">
          {{ font.family }}
        </b-list-group-item>
      </b-list-group>
    </div>
    <div class="mb-3">
      <label for="text">Font style</label>
      <b-form-radio v-model="style" class="mb-3" value="normal" plain>Normal</b-form-radio>
      <b-form-radio v-model="style" class="mb-3" value="bold" plain>Bold</b-form-radio>
      <b-form-radio v-model="style" class="mb-3" value="italic" plain>Italic</b-form-radio>
      <b-form-radio v-model="style" class="mb-3" value="italic bold" plain>Italic + Bold</b-form-radio>
    </div>
    <!-- <div class="mb-3">
      <label for="size">Font size</label>
      <div class="input-group">
        <input id="size" name="number" type="text" class="form-control" />
        <div class="input-group-text">px</div>
      </div>
    </div>
     -->
    <div class="mb-3">
      <label for="text">Font stretch</label>
      <select v-model="stretch" class="form-control">
        <option value="ultra-condensed">Ultra-condensed</option>
        <option value="extra-condensed">Extra-condensed</option>
        <option value="condensed">Condensed</option>
        <option value="semi-condensed">Semi-condensed</option>
        <option value="normal">Normal</option>
        <option value="semi-expanded">Semi-expanded</option>
        <option value="expanded">Expanded</option>
        <option value="extra-expanded">Extra-expanded</option>
        <option value="ultra-expanded">Ultra-expanded</option>

        <option value="25%">25%</option>
        <option value="50%">50%</option>
        <option value="75%">75%</option>
        <option value="100%">100%</option>
        <option value="125%">125%</option>
        <option value="150%">150%</option>
        <option value="175%">175%</option>
        <option value="200%">200%</option>
        <option value="125%">225%</option>
        <option value="150%">250%</option>
        <option value="175%">275%</option>
        <option value="200%">300%</option>
      </select>
    </div>
    <div class="mb-3">
      <label for="color">Color</label>
      <ColorPicker :color="color" v-model="color" />
    </div>
    <div class="mb-3">
      <button class="btn btn-primary" type="button" @click="handleSubmit">
        Save
      </button>
    </div>
  </form>
</template>

<style scoped>
.list-group {
  position: absolute;
  max-height: 240px;
  overflow-y: scroll;
  background: white;
  z-index: 999;
  border: 1px solid #ced4da;
}

.list-group-item:hover {
  background-color: #ced4da !important;
}
</style>