<template>
  <slot
    v-if="useLoading && loading"
    name="loading">loading...</slot>
  <slot
    v-else-if="error"
    name="error">some err...</slot>
  <template v-else>
    <slot></slot>
    <slot
      name="data"
      :error="error"
      :loading="loading"
      :res="res"></slot>
  </template>
</template>
<script >
import { reactive, toRefs, onMounted } from 'vue';

const DataContainer = {
  name: 'data-container',
  props: {
    useLoading: {
      type: Boolean,
      default: false
    },
    method: String,
    url: String,
    params: Object,
    options: Object,
    cached: Boolean,
    noCached: Boolean
  },
  setup({
    method = 'post',
    url,
    params,
    options
  }) {
    const state = reactive({
      loading: false,
      error: null,
      res: {}
    });
    const getData = async function() {
      state.loading = true;
      let res;
      try {
        const opts = Object.assign(DataContainer.headers, options);
        res = await DataContainer.serviceHandler(method, url, params, opts) || {};
        const {
          error,
          data
        } = res;
        if (error) {
          state.error = error;
        } else {
          state.res = data;
        }
      } catch(e) {
        state.error = e;
      }
      state.loading = false;
    }

    onMounted(() => {
      console.log('rendered vue3 data container.');
      getData();
    });

    return {
      getData,
      ...toRefs(state)
    }
  }
};

export default DataContainer;

DataContainer.create = function(options) {
  const {
    serviceHandler,
    headers = {}
  } = options;
  if (typeof serviceHandler === 'function') {
    DataContainer.serviceHandler = serviceHandler;
  } else {
    throw new Error(`'serviceHandler' expected a function.`);
  }
  if (typeof headers === 'object') {
    DataContainer.headers = headers;
  }
  return DataContainer;
};
</script>