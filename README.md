## vue3 data container

* 包装了数据请求的 vue 容器组件
* 灵活控制前端数据请求的三大状态：pending, finished, error
* 让数据请求组件化
* 可扩展其支持 fetch, axios 等任意请求库

### Install

```bash
npm i vue3-data-container

// or

yarn add vue3-data-container
```

### Usage

本例以接入 axios 请求库为例

```js
// main.js
import axios from 'axios'
import dataContainer from 'vue3-data-container'

// const app = createApp(App);

app.component('axios-data-container', dataContainer.create({
  // 比较抽象的业务接口请求封装
  async serviceHandler(method, url, params) {
    let error, data;
    try {
      const res = await axios[method](url, {/*...*/})
      const {
        code,
        msg,
        ...rest
      } = res
      if (code === 0) {
        data = {
          msg,
          ...rest
        }
      } else {
        error = msg
      }
    } catch(e) {
      error = e.message
    }

    // 此处务必返回 error 和 data
    return {
      error,
      data
    }
  }
}))
```

在 SFC 中使用上面定义的 axios-data-container 组件

> 内置的 default, data, loading, error 四个 slot 可用来自定义数据渲染区域

```html
<template>
  <axios-data-container
    url="http://localhost:3000/api/test"
    params="{}">
    <tempalte #data="{ res }">
      <div v-for="item of res.records">
        {{ item }}
      </div>
    </template>
    <template #loading>loading</template>
    <template #error>error</tempalte>
  </axios-data-container>
</template>
```

### 创建容器组件的静态方法：create

**container.create** ({ serviceHandler, headers }) => ContainerComponent

### 容器组件参数

| 名称 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| method | string | POST | 请求类型 |
| url | string | - | 请求地址 |
| params | object | - | 请求参数 |
| options | object | - | 其他参数 |
| cached | boolean | false | 是否缓存结果 |
| noCached | boolean | true | 不缓存结果 |

### 如何接入 fetch-functions-api

项目中需自己安装 @all-in-js/fetch-functions-api

fetch-functions-api 使用参考：[ffa](https://github.com/all-in-js/fetch-functions-api)

```js
// main.js
import fetchFunctionsContainer from 'vue3-data-container/fetch-functions-api'

// const app = createApp(/* App */);

app.component('fetch-container', fetchFunctionsContainer({
  successCode: 1000,
  url: 'api/functions'
}))
```


