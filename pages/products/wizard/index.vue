<script>
import _ from "lodash";
import types from "./assets/templates.json";
import Design from "./components/Design.vue";
import Upsert from "./components/Form.vue";

export default {
  components: {
    Design,
    Upsert,
  },
  head() {
    return {
      title: `Streamline Your Product Creation Process with Our User-Friendly Wizard`,
    };
  },
  data() {
    return {
      loading: false,
      step: 1,
      title:
        "Streamline Your Product Creation Process with Our User-Friendly Wizard",
      chooses: [],
      types,
      // types: _.map(types, type => ({
      //   ...type,
      //   thumbnail: require(type.thumbnail || `~/assets/templates/${ type.id }_thumbnail.webp`),
      //   mockup: {
      //     outer: require(type.mockup.outer || `~/assets/templates/${ type.id }_outer.webp`),
      //     reflection: require(type.mockup.reflection || `~/assets/templates/${ type.id }_reflection.webp`),
      //     inner: require(type.mockup.inner || `~/assets/templates/${ type.id }_inner.webp`),
      //   }
      // })),
      thumb: null,
      design: null,
    };
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: "Product creation wizard",
          active: false,
        },
        {
          text: `Step ${this.step}`,
          active: true,
        },
      ];
    },
  },
  methods: {
    b64toBlob: (b64Data, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    uploadUri: function (name, uri, secure) {
      const match = uri.match(/^data:(.*?);base64,(.*?)$/is);
      const contentType = match[1];
      const b64Data = match[2];

      const blob = this.b64toBlob(b64Data, contentType);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.textContent = "Tải xuống SVG";

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    next: function () {
      if (this.step == 2) {
        this.$refs.design.export();
        this.$refs.design.thumb();

        return;
      }

      if (this.step == 3) {
        this.loading = true;
        this.$refs.form
          .submit()
          .then((res) => {
            console.log(res);
            this.$router.push("/product/" + this.product.id);
            this.loading = false;
          })
          .catch((err) => {
            console.log("Error:", err);
          });
        return;
      }

      this.step++;
    },
    back: function () {
      this.step--;
    },
    selectType: function (type) {
      const idx = this.chooses.indexOf(type.id);
      if (idx !== -1) {
        this.chooses.splice(idx);
        return;
      }
      this.chooses.push(type.id);
    },
  },
};
</script>
<template>
  <div>
    <PageHeader :title="title" :items="breadcrumbs" />
    <div class="wrapper row">
      <div class="col-lg-12">
        <div v-if="step == 1" class="card">
          <div class="p-4">
            <div class="media align-items-center">
              <div class="me-3">
                <div class="avatar-xs">
                  <div
                    class="avatar-title rounded-circle bg-soft-primary text-primary"
                  >
                    01
                  </div>
                </div>
              </div>
              <div class="media-body overflow-hidden">
                <h5 class="font-size-16 mb-1">
                  Select product types ({{ chooses.length }} selected)
                </h5>
                <p class="text-muted mb-0">
                  To get started on creating your new product, please select the
                  product type from the list below that best matches the type of
                  product you want to create.
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 border-top">
            <div class="product-types row">
              <div
                v-for="type in types"
                @click="selectType(type)"
                class="col-12 col-sm-6 col-lg-4 col-xl-3 p-2"
              >
                <div
                  :class="{
                    'type-item px-2 py-3': true,
                    selected: chooses.indexOf(type.id) !== -1,
                  }"
                >
                  <h3 class="h6">{{ type.name }}</h3>
                  <p>{{ type.description }}</p>
                  <p>
                    <img :src="type.thumbnail" :alt="type.name" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="m-3 text-end">
            <button class="btn btn-primary" type="button" @click="next">
              Continue
            </button>
          </div>
        </div>

        <div v-if="step == 2" class="card">
          <div class="p-4">
            <div class="media align-items-center">
              <div class="me-3">
                <div class="avatar-xs">
                  <div
                    class="avatar-title rounded-circle bg-soft-primary text-primary"
                  >
                    02
                  </div>
                </div>
              </div>
              <div class="media-body overflow-hidden">
                <h5 class="font-size-16 mb-1">Design your products</h5>
                <p class="text-muted mb-0">
                  Experiment with different layouts and designs
                </p>
              </div>
            </div>
          </div>
          <div class="p-4 border-top">
            <Design ref="design" :chooses="chooses" />
            <div class="row m-3">
              <div class="col-6 text-start">
                <button class="btn btn-secondary" type="button" @click="back">
                  Back
                </button>
              </div>
              <div class="col-6 text-end">
                <button class="btn btn-primary" type="button" @click="next">
                  {{ step === 2 ? "Export" : "Continue" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="step == 3" class="card">
          <div class="p-4">
            <div class="media align-items-center">
              <div class="me-3">
                <div class="avatar-xs">
                  <div
                    class="avatar-title rounded-circle bg-soft-primary text-primary"
                  >
                    03
                  </div>
                </div>
              </div>
              <div class="media-body overflow-hidden">
                <h5 class="font-size-16 mb-1">Create product</h5>
                <p class="text-muted text-truncate mb-0">
                  Fill all information below
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 border-top">
            <Upsert
              ref="form"
              :chooses="chooses"
              :design="design"
              :thumb="thumb"
            />

            <div class="row m-3">
              <!-- <div class="col-6 text-start">
                <button class="btn btn-secondary" type="button" @click="back">
                  Back
                </button>
              </div> -->
              <div class="col-6 text-end">
                <button class="btn btn-primary" type="button" @click="next">
                  {{ step === 2 ? "Export" : "Continue" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="preloader" v-if="loading">
          <div id="status">
            <div class="spinner">
              <i class="uil-shutter-alt spin-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-types {
  text-align: center;
}

.product-types img {
  max-width: 100%;
}

.product-types .type-item {
  border: 1px solid #ccc;
  border-radius: 8px;
}

.product-types .type-item.selected {
  border-color: #5b73e8;
}

.wrapper {
  position: relative;
}

#preloader {
  background-color: #f5f6f8;
  position: absolute;
}
</style>
