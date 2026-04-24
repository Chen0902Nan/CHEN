## CSS实现垂直居中的方法

1. flex弹性布局
   就是对父元素设置
   display:flex,
   align-items:center; //垂直居中
   justify-content:center //水平居中3.
2. 利用定位 子绝父相
   将子元素设置 position:absolute 绝对定位
   父元素设置 position:relative 相对定位
   然后通过top,left设置为50%
   transform:translate(-50%,-50%)
3. 网格布局 Grid
   display:grid;
   place-items:center
4. 子绝父相
   但是子元素的top,right,bottom,left都设置为0，给定一个高度，margin:auto
   就会自动居中
5. 单行文本
   height:100px
   line-height：100px
