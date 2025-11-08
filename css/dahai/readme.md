# CSS 大海

- 何为 css？ -> 层叠样式表

  - 一个属性与值的键值对 -> 申明
  - 申明块 多个申明组成一个申明块
  - 申明块如果需要作用到对应的 HTML 属性 -> 选择器
  - cssRules 组成了 样式表

- 层叠？

- margin 重叠的 最大的
- 小数单位 px 怎么处理的？

- transform
- ::beform ::after

- inline 元素，在有些情况下不支持 transform
  position；absolute
  inline->inline-block

- css 选择器 优先级 按 个十百千的位数从小到大安排
  element class id inline
  !important 最高 建议不要乱用，甚至不用

- transition:property duration timing-function delay;

  - property:需要过渡的属性，用逗号隔开
  - duration:过渡持续时间
  - timing-function:时间函数，控制过渡动画的节奏
    ease：默认，慢 → 快 → 慢
    linear：匀速
    ease-in：慢开始
    ease-out：慢结束
    ease-in-out：慢开始和结束
  - delay:动画开始前的等待时间

- transform

  - transform-origin:left
    改变变换原点，默认为 center
