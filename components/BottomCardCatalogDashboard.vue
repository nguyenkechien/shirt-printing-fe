<template>
    <div>
      <b-card no-body>
        <b-card-body>
          <b-card-title>
            <h4 style="color: #6c757d" class="card-title">{{ title }}</h4>
          </b-card-title>
          <b-card-text style="color: #6c757d">
            {{ content }}
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BottomCardCatalogDashboard',
    props: {
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }
  }
  </script>
  