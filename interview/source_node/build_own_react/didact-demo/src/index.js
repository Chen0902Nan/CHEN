function createElement(type,props,...children){
  // console.log(type,props,children);
  // 返回一个element 对象
  return {
    type,
    props:{
      ...props,
      children:children.map(child=>typeof child==='object'?
         child: // 虚拟DOM对象 element
         createTextElement(child) // 退出条件 文本节点
    )
    }
  }
}

function createTextElement(text){
  return {
    type:'TEXT_ELEMENT',
    props:{
      nodeValue:text,
      children:[]
    }
  }
}

function render(element,container){
  // console.log(element,container);
  const dom=
  element.type==='TEXT_ELEMENT'
  ? document.createTextNode('')
  :document.createElement(element.type)
  const isProperty=key=>key!=='children'
  Object.keys(element.props)
  .filter(isProperty)
  .forEach(name=>{
    console.log(name,'/////');
    dom[name] = element.props[name]
  })
  element.props.children.forEach(child=>render(child,dom))
  container.appendChild(dom)
  
}

// console.log('手搓react源码');
window.Didact={
  createElement, // 创建虚拟DOM
  render // 虚拟渲染DOM  
}

/**@jsxRuntime classic */
/**@jsx Didact.createElement */
const element=(
    <div style="background:salmon">
      <h1>Hello world</h1>
      <h2 style="text-align:right">from Didact</h2>
    </div>
)

const container=document.getElementById('root')
Didact.render(element,container)