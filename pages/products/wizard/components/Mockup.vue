<template>
  <div>
    <div id="mockup"></div>
    <div class="button-items">
      <button v-b-modal.modal-image data-toggle="modal" type="button" class="btn btn-sm btn-outline-primary">Add
        Image</button>
      <button v-b-modal.modal-text data-toggle="modal" type="button" class="btn btn-sm btn-outline-primary">Add
        Text</button>
      <button @click="removeLayer()" type="button" class="btn btn-sm btn-outline-danger" :disabled="!activated">Remove
        selected</button>
    </div>

    <b-modal ref="modal-image" id="modal-image" centered title="Add Image" title-class="font-18" data-backdrop="static"
      data-keyboard="false" hide-footer>
      <div class="form-group">
        <label for="image_file">Select image</label>
        <input type="file" class="form-control-file" id="image_file" @change="handleSelectImage($event)">
      </div>
    </b-modal>

    <b-modal ref="modal-text" id="modal-text" centered title="Add Text" title-class="font-18" data-backdrop="static"
      data-keyboard="false" hide-footer>
      <TextLayer :onSubmit="addTextLayer" :layerName="layerName('text')" />
    </b-modal>

    <div :class="{ 'm-0 mt-3 p-2 layers': true, 'd-none': !items.length }">
      <Draggable v-model="layers[display]" @end="handleSort">
        <div v-for="layer  in  layers[display] " :key="layer.id"
          :class="{ 'layer-item': true, selected: layer.id == activated }" @click="toggleLayer(layer.id)">
          <span>{{ layer.data.name }}</span>
          <i class="handle fas fa-arrows-alt"></i>
        </div>
      </Draggable>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Draggable from 'vuedraggable'
import Mockup from '../assets/mockup.js'
import TextLayer from "./TextLayer.vue"

export default {
  components: {
    TextLayer,
    Draggable
  },
  props: {
    display: {
      type: String,
      required: false
    },
    design: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    template: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      required: false,
      default() {
        return "white"
      }
    },
    onChange: {
      type: Function,
      required: false
    }
  },
  data() {
    const ds = _.keys(this.template.displays)
    const layers = {}
    for (const d of ds) {
      layers[ d ] = this.design[ d ] || []
    }

    console.log({layers})

    return {
      fontFamilies: {},
      activated: 0,
      layers,
      files: {}
    }
  },
  computed: {
    googleFontsApiKey() {
      return this.$config.googleFontsApiKey;
    },
    items() {
      return this.layers[ this.display ] || []
    }
  },
  created() {
    if (typeof Konva === 'undefined') {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://unpkg.com/konva@9.0.1/konva.min.js')
      document.head.appendChild(recaptchaScript)
    }
  },
  mounted() {
    const self = this
    const ready = setInterval(function () {
      if (typeof Konva !== 'undefined') {
        self.draw()
        clearInterval(ready)
      }
    }, 500);
  },
  watch: {
    template(newValue, oldValue) {
      // Do something with the new value of myProp
      console.log(`template changed from ${ oldValue } to ${ newValue }`);
      // this.forceRerender = !this.forceRerender;
      // rerender mockup
      // this.mockup.destroy()
      // this.draw()
      this.capture(this.display)
      this.refresh()
    },
    color(newValue, oldValue) {
      console.log('Change background')
      this.mockup.changeBackground(newValue);
    },
    display(newValue, oldValue) {
      console.log('Display changed:', newValue, oldValue)
      // this.forceRerender = !this.forceRerender;
      // this.mockup.destroy()
      // this.draw()
      this.capture(oldValue)
      this.refresh()
    }
    // layers(newValue, oldValue) {
    //   console.log('Update layers')
    // }
  },
  methods: {
    draw() {
      this.mockup = new Mockup(this.color, this.display, this.template, this.handleCallback);
      this.mockup.render("mockup", _.keyBy(this.layers[ this.display ], 'id'));
    },
    addImageLayer(id, url) {
      // this.onChange("add", { name: 'image-' + Math.floor(Date.now() / 1000) });
      this.activated = id
      this.layers[ this.display ].unshift(this.mockup.addImage(id, url, {}));
      this.mockup.setZIndex(this.layers[ this.display ][ 0 ].id, this.layers[ this.display ].length)
    },
    addTextLayer(layer) {
      this.$refs[ 'modal-text' ].hide()
      let id = this.layerIdentifier()
      this.activated = id
      const text = this.mockup.addText(id, layer, {})
      this.layers[ this.display ].unshift(text)
      this.$refs[ 'modal-text' ].hide()
      this.setFont(text.id, text.data.fontFamily)
      this.mockup.setZIndex(this.layers[ this.display ][ 0 ].id, this.layers[ this.display ].length)
    },
    removeLayer(layer) {
      if (layer == undefined) {
        layer = this.activated
      }
      console.log('layer', layer)
      if (!layer) return

      if (layer == this.activated) {
        this.activated = null
      }

      _.remove(this.layers[ this.display ], item => item.id == layer);
      this.mockup.removeLayer(layer)
    },
    updateLayer(layer) {
      this.layers[ layer.name ] = { ...this.layers[ layer.name ], ...layer }
    },
    submitLayers() {
      this.$emit('submit-layers', this.layers)
    },
    takeSnapshot() {
      return this.mockup.capture.toDataURL({ pixelRatio: 4 });
    },
    takePreview() {
      return this.mockup.preview.toDataURL({ pixelRatio: 2 });
    },
    handleSelectImage(e) {
      e.target.files.forEach(file => {
        const uri = URL.createObjectURL(file);
        this.files[ uri ] = file

        const idx = this.layerIdentifier()
        console.log(uri)
        this.addImageLayer(idx, uri)
        this.$refs[ 'modal-image' ].hide()
      })
    },

    layerIdentifier() {
      let idx = _.size(this.layers[ this.display ]) + 1
      for (const id in this.layers[ this.display ]) {
        const is = id.split("-")
        if (parseInt(is[ 1 ]) >= idx) {
          idx = is[ 1 ] + 1
        }
      }

      return idx
    },
    layerName(type) {
      const idx = this.layerIdentifier()
      return type.charAt(0).toUpperCase() + type.slice(1) + '-' + idx
    },
    handleCallback(name, data) {
      switch (name) {
        case 'select':
          this.activated = data
          break

        default:
          break
      }
    },
    setFont(layer, fontFamily) {
      if (this.fontFamilies[ fontFamily ]) {
        this.mockup.setFont(layer, fontFamily)
        return
      }

      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = 'https://fonts.googleapis.com/css2?family=' + fontFamily + '&display=swap'
      link.onload = () => {
        this.mockup.setFont(layer, fontFamily)
        setTimeout(() => {
          this.mockup.setFont(layer, fontFamily)
        }, 1000)
      }
      document.getElementsByTagName("head")[ 0 ].appendChild(link)
    },
    toggleLayer(layer) {
      if (layer == this.activated) {
        this.mockup.setActive(null)
        return
      }

      this.mockup.setActive(layer)
    },
    handleSort() {
      const max = this.layers[ this.display ].length
      for (const idx in this.layers[ this.display ]) {
        const weight = max - idx - 1
        this.layers[ this.display ][ idx ].weight = weight
        this.mockup.setZIndex(this.layers[ this.display ][ idx ].id, weight)
      }
    },
    refresh() {
      this.mockup.destroy()
      this.draw()
    },
    capture(display) {
      const children = this.mockup.editorLayer.getChildren()
      for (const child of children) {
        const idx = _.findIndex(this.layers[ display ], { id: child.name() })
        if (idx !== -1) {
          const attrs = _.omitBy(child.getAttrs(), _.isNil)
          if (attrs.image) {
            attrs.src = attrs.image.src
            delete attrs.image
          }
          this.layers[ display ][ idx ].attrs = attrs
        }
      }
    },
    exportSnapshot(){
      this.mockup.convertCanvasToSVG(this.mockup.capture.toCanvas({ pixelRatio: 2 }), 'design.svg')
    },
    exportPreview(){
      this.mockup.convertCanvasToSVG(this.mockup.preview.toCanvas({ pixelRatio: 2 }), 'thumb.svg')
    }
  }
}
</script>

<style>
#mockup>div {
  float: left;
  width: 50%;
}

#ou-editor .ou-canvas {
  background-image: linear-gradient(45deg, #a9a9a9 25%, transparent 0),
    linear-gradient(-45deg, #a9a9a9 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #a9a9a9 0),
    linear-gradient(-45deg, transparent 75%, #a9a9a9 0);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
  background-color: #d3d3d3;
  width: 400px;
  height: 400px;
}

#mockup #ou-snapshot {
  visibility: hidden;
  height: 0;
  width: 0;
}

#mockup #ou-snapshot .ou-canvas {
  background-color: blue;
}

#mockup .ou-canvas {
  margin: 0 auto;
}
</style>
<style scoped>
.button-items {
  overflow: hidden;
  clear: both;
}
</style>

<style scoped>
.layers {
  display: block;
  border: 1px solid #ddd;
  background-color: #e8e8e8;
  border-radius: 5px;
}

.layer-item {
  background-color: #fff;
  border: 1px solid #ccc;
  display: block;
  padding: 4px 30px 4px 8px;
  list-style: none outside none;
  margin: 0 0 6px;
  position: relative;
  border-radius: 5px;
  cursor: move;
}

.layer-item:last-child {
  margin-bottom: 0;
}

.layer-item.selected {
  background-color: #5b73e8;
  color: white;
}

.layer-item .handle {
  position: absolute;
  right: 6px;
  top: 8px;
  cursor: pointer;
}
</style>
