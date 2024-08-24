# el-table 的 cell-click 事件中的 column 参数与 el_table-column 插槽参数中的 column 对象不一致



## 前言
::: info 背景
在开发过程中，我们经常需要通过 `el-table` 渲染表格，并允许用户直接编辑单元格的数据。通常，
我们会使用 `cell-click` 事件来检测用户点击的单元格，并通过展示 `el-input` 组件来实现可编辑的功能。
然而，在实现过程中遇到了一个问题，即 `cell-click` 事件参数中的 `column` 对象与 `el-table-column` 插槽中的 `column` 对象不一致，
这导致在处理用户输入时遇到了困难。
:::

在做 `MES` 项目时，需要对上传的 `excel` 数据解析成表格渲染出来，并支持在表格中直接修改每一条数据，上代码：

::: details 示例代码
```vue
<template>
  <el-table
    border
    highlight-current-row
    style="width: 100%; margin-top: 20px"
    :data="tableData"
    :cell-class-name="cellClassName"
    @cell-click="handleCellClick"
  >
    <el-table-column
      v-for="item of tableHeader"
      :key="item"
      :prop="item"
      :label="item"
    >
      <template v-slot="{ row, column }">
        <el-input
          v-if="column[`editable_${row.index}_${column.index}`]"
          :ref="`inputRef_${row.index}_${column.index}`"
          v-model="row[item]"
          @blur="handleInputBlur(row, column, $event)"
        />
        <span v-else>{{ row[item] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    methods: {
      cellClassName({ row, column, rowIndex, columnIndex }) {
        // 通过cellClassName将el-table内部传递过来的rowIndex和columnIndex 添加到 row和column中
        row.index = rowIndex 
        column.index = columnIndex
      },
      handleInputBur(row, column, event) {
        const inputRef = this.$refs[`inputRef_${row.index}_${column.index}`][0]
        inputRef.blur()
        // 删除失去焦点的input的ref和所添加editable属性
        // Vue.delete，删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 property 被删除的限制
        this.$delete(column, `editable_${row.index}_${column.index}`)
        this.$nextTick(() => this.$delete(this.$refs, `inputRef_${row.index}_${column.index}`))
      },
      handleCellClick(row, column, cell, event) {
        this.$set(column, [`editable_${row.index}_${column.index}`], true) // 要用Vue.set方法去修改，不然不会更新，因为el-table-column组件及其作用域插槽中相关的一些变量及其所处的上下文，导致对一些属性操作是不具备响应式的
        this.$nextTick(() => {
          const inputRef = this.$refs[`inputRef_${row.index}_${column.index}`][0]
          inputRef.focus()
        })
      }
    }
  }
</script>
```
:::

所以上面代码中我们做了如下操作：

1. 点击的时候，需要知道点击的那个单元格，然后将 `input` 显示出来以供用户输入修改，然后在尝试的过程中，发现 `cellClick` 事件参数中获取不到点击单元格所在的 `rowIndex` 和 `columnIndex`，所以就通过通过 `cellClassName` 将 `el-table` 内部传递过来的 `rowIndex` 和 `columnIndex` 添加到 `row` 和 `column` 中。
    ```js
    cellClassName({ row, column, rowIndex, columnIndex }) {
      // 通过cellClassName将el-table内部传递过来的rowIndex和columnIndex 添加到 row和column中
      row.index = rowIndex
      column.index = columnIndex
    }
    ```
2. 添加完成之后，`row` 和 `column` 就都有了 `index` 了，这样在 `ref` 和 `v-if` 就都有根据索引生成的变量去控制了
   ```vue{3-4}
   <template v-slot="{ row, column }">
     <el-input
       v-if="column[`editable_${row.index}_${column.index}`]"
       :ref="`inputRef_${row.index}_${column.index}`" 
       v-model="row[item]"
       @blur="handleInputBlur(row, column, $event)"
     />
     <span v-else>{{ row[item] }}</span>
   </template>
   ```
3. 我们就只需要点击的时候，拿到 `row` 和 `column` 的索引获取对应的变量，然后改变对应 `v-if` 的变量即可，但是我们是绑定在每一个 `column` 中，
在实际过程中发现 `el-tabled` 的 `cell-click` 事件参数 `column` 与 `el_table-column` 插槽参数中的 `column` 不是同一个对象。
这就导致 `input` 的 `blur` 事件处理的时候，无法将 `cell-click` 事件参数中的 `column` 变量隐藏,



## 解决
`data` 中新增一个变量记录对 `cell-click` 事件参数 `column` 的引用，`blur` 的回调中，直接通过该变量修改对应的属性（`editable_${row.index}_${column.index}`）的值即可

::: details 最终代码
  ```js
  export default {
    data() {
      return {
        currentEditableColumn: null, // 记录当前可编辑的列的所绑定column对象，为了解决el-table的cell-click事件传递的column参数和el-table-column中默认插槽中的column对象不同
      }  
    },
    methods: {
      cellClassName({ row, column, rowIndex, columnIndex }) {
        // 通过cellClassName将el-table内部传递过来的rowIndex和columnIndex 添加到 row和column中
        row.index = rowIndex 
        column.index = columnIndex
      },
      handleInputBur(row, column, event) {
        console.log(column == this.currentEditableColumn) // false
        const inputRef = this.$refs[`inputRef_${row.index}_${column.index}`][0]
        inputRef.blur()
        // 删除失去焦点的input的ref和所添加editable属性
        // Vue.delete，删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 property 被删除的限制
        this.$delete(this.currentEditableColumn, `editable_${row.index}_${column.index}`)
        this.$nextTick(() => this.$delete(this.$refs, `inputRef_${row.index}_${column.index}`))
      },
      handleCellClick(row, column, cell, event) {
        this.currentEditableColumn = column // 保存引用
        this.$set(column, [`editable_${row.index}_${column.index}`], true) // 要用Vue.set方法去修改，不然不会更新，因为el-table-column组件及其作用域插槽中相关的一些变量及其所处的上下文，导致对一些属性操作是不具备响应式的
        this.$nextTick(() => {
          const inputRef = this.$refs[`inputRef_${row.index}_${column.index}`][0]
          inputRef.focus()
        })
      }
    }
  }
  ```
:::


## 总结
通过以上方法，我们成功解决了 `el-table` 中 `cell-click` 事件参数与插槽参数不一致的问题。通过引入 `currentEditableColumn` 变量，我们能够在处理 `blur` 事件时正确地管理单元格的编辑状态。
同时，通过 `cellClassName` 方法，我们确保了可以追踪到每一个单元格的位置。这种方法在处理复杂的表格编辑场景时非常有效，可以大大提升代码的稳定性和可维护性。

在实际项目中，开发者可以根据项目需求，灵活运用这些方法来处理表格中的事件和状态管理问题。同时，建议在处理引用和状态时，明确变量的生命周期和作用范围，以减少可能出现的意外状态改变。
