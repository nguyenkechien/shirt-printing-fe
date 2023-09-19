<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import templates from '../assets/templates.json';

/**
 * Add-product component
 */
export default {
  components: {
    Multiselect,
  },
  props: {
    chooses: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    design: {
      type: String,
      required: true
    },
    thumb: {
      type: String,
      required: true
    },
  },
  data() {
    this.selectTypes = _.keyBy(_.map(this.chooses, (id) => _.find(templates, { id })), 'id')
    this.generateProductOptions()
    this.generateTemplateVariants();
    // for (const template of templates) {
    //   if (!this.chooses.includes(template.id)) continue

    //   if (this.chooses.length > 1) {
    //     this.generateVariants({ type: { "label": "Types", options: [ { value: template.name, price: template.price } ] }, ...template.attributes })
    //   } else {
    //     this.generateVariants(template.attributes)
    //   }
    // }

    console.log(this.variants)

    return {
      typeOptions: [],
      product: {
        title: "",
        handle: "",
        discountable: true,
        is_giftcard: false,
        description: "",
        type: { value: "Jacket", id: "Jacket" },
        options: _.values(this.productOptions),
        thumbnail: this.thumb,
        images: [ this.thumb ],
        metadata: {
          design_id: this.design,
        },
        variants: this.variants,
        status: "published",
        // "sales_channels": [ { "id": "sc_01GX9285FVFKHAVCPZF6M5HCEB" } ]
      }
    }
  },
  mounted() {
    this.fetchTypeOptions();
  },
  methods: {
    fetchTypeOptions() {
      // Make an API request to retrieve the options
      // Replace 'apiEndpoint' with your actual API endpoint URL
      this.$axios.get('/seller/product-types')
        .then(data => {
          // Assuming the response data is an array of objects with 'id' and 'name' properties
          this.typeOptions = data.product_types;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    submit: function (e) {
      this.formValidate()
      return this.$axios.post('/seller/products', this.product)
    },
    formValidate: function () {
    },
    showVariantModal: function () {
      this.$refs[ 'modal-variants' ].show()
    },
    removeVariant: function (idx) {
      this.product.variants.splice(idx, 1)
    },
    // generateVariants: function (attributes, currentCombination = { options: [] }) {
    //   const attributeKeys = Object.keys(attributes);
    //   let template = 0;

    //   if (attributeKeys.length === 0) {
    //     // Base case: All attributes processed, add currentCombination to options array
    //     this.variants.push({
    //       inventory_quantity: 0,
    //       allow_backorder: false,
    //       manage_inventory: true,
    //       title: currentCombination.title,
    //       options: currentCombination.options,
    //       prices: [ { amount: currentCombination.price + this.selectTypes[ currentCombination.type || 0 ].price, currency_code: "usd" } ],
    //       metadata: currentCombination.metadata
    //     });
    //   } else {
    //     const currentAttribute = attributeKeys[ 0 ];
    //     const remainingAttributes = { ...attributes };
    //     delete remainingAttributes[ currentAttribute ];

    //     const attributeOptions = attributes[ currentAttribute ].options;

    //     for (const option of attributeOptions) {
    //       const newCombination = {
    //         title: currentCombination.title ? currentCombination.title + '/' + option.value : option.value,
    //         price: (currentCombination.price || 0) + (option.price ?? 0),
    //         options: [ ...(currentCombination.options || []), { value: option.value } ],
    //       };
    //       if (option.metadata && option.metadata.machine == "template") {
    //         newCombination.type = template++
    //         newCombination.metadata = { ...newCombination.metadata, template }
    //       }
    //       this.generateVariants(remainingAttributes, newCombination);
    //     }
    //   }
    // },
    // getProductOptions(attrs) {
    //   const keys = Object.keys(attrs);
    //   let nextIndex = _.size(this.productOptions)
    //   for (const key of keys) {
    //     // this.productOptions.push({ title: attrs[ key ].label, metadata: { machine: key } })
    //     this.productOptions[ key ] = ({ title: attrs[ key ].label, metadata: { machine: key } })
    //     this.productOptionIndexes[ key ] = nextIndex++
    //   }
    // },
    generateTemplateVariants() {
      console.log('productOptions', this.productOptions)
      this.variants = []
      this.attributes = {}
      for (const template of templates) {
        if (!this.chooses.includes(template.id)) continue

        this.generateVariants(template, this.productOptions)
      }
    },
    generateVariants: function (template, attributes, currentCombination = { options: [] }) {
      const keys = Object.keys(attributes);

      if (keys.length === 0) {
        // Base case: All attributes processed, add currentCombination to options array
        this.variants.push({
          inventory_quantity: 0,
          allow_backorder: false,
          manage_inventory: true,
          title: currentCombination.title,
          options: currentCombination.options,
          prices: [ { amount: currentCombination.price + this.selectTypes[ currentCombination.type || templates[ 0 ].id ].price, currency_code: "usd" } ],
          metadata: currentCombination.metadata
        });
      } else {
        const currentAttribute = keys[ 0 ];
        const remainingAttributes = { ...attributes };
        delete remainingAttributes[ currentAttribute ];

        if (!this.attributes[ currentAttribute ]) {
          this.attributes[ currentAttribute ] = []
        }

        let attributeOptions = []
        if (this.productOptions[ currentAttribute ].metadata.machine == "template") {
          attributeOptions = [ { value: template.short_name || template.name } ];
        } else if (template.attributes[ currentAttribute ]) {
          attributeOptions = template.attributes[ currentAttribute ].options;
        } else {
          attributeOptions = [ { value: "Default" } ]
        }

        for (const option of attributeOptions) {
          if (!this.attributes[ currentAttribute ].includes(option.value)) {
            this.attributes[ currentAttribute ].push(option.value)
          }
          const newCombination = {
            title: currentCombination.title ? currentCombination.title + '/' + option.value : option.value,
            price: (currentCombination.price || 0) + (option.price ?? 0),
            options: [ ...(currentCombination.options || []), { value: option.value } ],
          };
          if (option.metadata && option.metadata.machine == "template") {
            newCombination.type = template.id
            newCombination.metadata = { ...newCombination.metadata, template }
          }
          this.generateVariants(template, remainingAttributes, newCombination);
        }
      }
    },
    generateProductOptions() {
      this.productOptions = {}

      if (this.chooses.length > 1) {
        this.productOptions[ `template` ] = { title: "Types", metadata: { machine: "template" } }
      }

      for (const template of templates) {
        if (!this.chooses.includes(template.id)) continue

        const keys = Object.keys(template.attributes);
        for (const key of keys) {
          if (!this.productOptions[ key ]) {
            this.productOptions[ key ] = { title: template.attributes[ key ].label, metadata: { machine: key } }
            continue
          }

          if (this.productOptions[ key ].title != template.attributes[ key ].label) {
            this.productOptions[ key ].title += '/' + template.attributes[ key ].label
          }
        }
      }
    }
  }
};
</script>

<template>
  <div>
    <form ref="form" method="post">
      <h3>General Information</h3>
      <div class="row">
        <div class="col-lg-6">
          <div class="mb-3">
            <label for="title">Title</label>
            <input id="title" name="title" type="text" class="form-control" v-model="product.title" />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="mb-3">
            <label for="subtitle">Subtitle</label>
            <input id="subtitle" name="subtitle" type="text" class="form-control" v-model="product.subtitle" />
          </div>
        </div>
        <div class="col-xs-12">
          <p>Give your product a short and clear title.<br />50-60 characters is the recommended length for search
            engines.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6">
          <div class="mb-3">
            <label for="handle">Handle</label>
            <input id="handle" name="handle" type="text" class="form-control" v-model="product.handle" />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="mb-3">
            <label for="material">Material</label>
            <input id="material" name="material" type="text" class="form-control" v-model="product.material" />
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="description">Description</label>
        <textarea class="form-control" id="description" rows="4" name="description"
          v-model="product.description"></textarea>
        <p>Give your product a short and clear description.<br />120-160 characters is the recommended length for
          search engines.
        </p>
      </div>

      <h4 class="h6">Organize Product</h4>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="control-label">Type</label>
            <select class="form-control select2" v-model="product.type.value">
              <option>Choose a type</option>
              <option v-for="option in typeOptions" :value="option.id" :key="option.id">
                {{ option.value }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="control-label">Collection</label>
            <select class="form-control select2">
              <option>Choose a collection</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="tags">Tags (comma separated)</label>
        <input class="form-control" type="text" id="tags" />
      </div>

      <h4 class="h6">Discountable</h4>
      <div class="form-check form-switch mb-3" dir="ltr">
        <input type="checkbox" class="form-check-input" id="discountable" v-model="product.discountable"
          :checked="product.discountable" />
        <label class="form-check-label" for="discountable">When unchecked discounts will not be applied to this
          product.</label>
      </div>

      <h4 class="h6">Media</h4>
      <div class="row thumbnail">
        <div class="col-xs-12 col-md-6">
          <img :src="thumb" />
        </div>
        <div class="col-xs-12 col-md-6">
          <img :src="thumb" />
        </div>
      </div>

      <h3 class="mt-5">Variants</h3>
      <div class="table-responsive">
        <table class="table mb-0">
          <thead>
            <tr>
              <th>Product</th>
              <th v-for="(option, id) in productOptions" :key="id">
                {{ option.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="type in selectTypes" @click="showVariantModal">
              <td>{{ type.name }}</td>
              <td v-for="(attr, name) in type.attributes" :key="name">
                <ul v-if="attr.options[0].type && attr.options[0].type == 'color'" class="colors">
                  <li :class="'color-item color-item-' + color.value.toLowerCase()"
                    v-for="color in type.attributes.colors.options" :key="color.value">
                    <i :class="'color color-' + color.value.toLowerCase()" :style="{ 'background-color': color.hex }">{{
                      color.value }}</i>
                  </li>
                </ul>
                <span v-else>
                  {{ attr.options.map(opt => opt.value).join(', ') }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <h3 class="mt-5">Attributes</h3> -->
    </form>

    <b-modal ref="modal-variants" id="modal-variants" size="lg" centered title="Edit Variants" title-class="font-18"
      data-backdrop="static" data-keyboard="false" hide-footer>
      <div class="table-responsive">
        <table class="table mb-0">
          <thead>
            <tr>
              <th v-for="(option, idx) in productOptions">
                <span v-if="idx == 'template'">
                  Variants
                </span>
                <span v-else>
                  {{ option.title }}
                </span>
              </th>
              <th>Pricing</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(variant, idx) in product.variants" :key="idx">
              <td v-for="(opt, jdx) in Object.keys(productOptions)">
                <span v-if="opt == 'template'">
                  {{ variant.title }}
                </span>
                <span v-else>
                  {{ variant.options[jdx].value }}
                </span>
              </td>
              <td>
                <div class="input-group">
                  <input class="form-control" :name="`price[${idx}]`" :value="variant.prices[0].amount" />
                  <div class="input-group-append">
                    <span class="input-group-text">$</span>
                  </div>
                </div>
              </td>
              <td>
                <button @click="removeVariant(idx)" class="btn btn-xs btn-danger">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
  </div>
</template>

<style scoped>
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

.color-item-white .checked {
  color: black;
}

.thumbnail img {
  max-width: 100%;
  max-height: 240px;
}
</style>