# CSS

## 布局

BFC对于两列式、三列式起到了关键性的支持，先介绍下
Block Formating Context 块级格式化上下文 是CSS中独立(不受外界影响)的布局区域，
核心规则分为[创建规则]、[布局规则]、[交互规则]

- 创建的规则
  - html就是最大的BFC元素，块级元素不一定是BFC元素，得创建
  - 块级元素从上到下布局
  - 浮动
    float:left/right(none不算)
  - 绝对/固定/粘性定位
    position:absolute/fixed/sticky 会离开文档流
  - 行内块
    display:inline-block
  - 表格相关
    table:用的很少
    display:table-cell /table-caption
  - 溢出非可见 BFC使用的最多，因为其他的会改变原来的布局
    overflow:hidden/auto/scroll
    overflow:visible 不触发
  - 弹性/网格 flex/inline-flex/grid/inline-grid

### BFC内部的布局规则

- 垂直排列
  - BFC 内部块级盒子从上到下依次垂直排列
  - 边距的折叠 相邻块级盒子的垂直margin会折叠，取最大值，非相加
  - 触边对齐
    每个盒子左外边缘紧贴BFC容器的左边缘，即使有浮动元素在
  - 独立计算
    BFC是一个独立渲染的区域，不受外界影响

### 
## 两列式布局

- float:left + overflow:hidden
