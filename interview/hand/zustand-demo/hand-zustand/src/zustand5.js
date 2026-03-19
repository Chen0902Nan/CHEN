import { useState,useEffect } from "react";


//createState 创建状态的函数
//set 第一个参数 
//get 第二个参数
//模块私有的方法
const createStore=(createState)=>{
    let state;//需要根据createState 初始化状态
    //初始化
    const listnners=new Set();
    const getState=()=>state;
    //修改
    //partial部分状态
    //函数
    //replace 是否替换整个状态
    const setState=(partial,replace=false)=>{
        const nextState=typeof partial==='function'?partial(state):partial;
        if(!Object.is(nextState,state)){
            const previousState=state;
            if(!replace){
                state=(typeof nextState!=='object'||nextState===null)
                ?nextState
                :Object.assign({},state,nextState)
            }else{
                state=nextState 
            }
            listnners.forEach((listnner)=>listnner(state,previousState))
        }
    }

    const subscribe=(listnner)=>{
        listnners.add(listnner);
        return ()=>listnners.delete(listnner)
    }

    const destory=()=>{
        listnners.clear()
    }

    const api={
        setState,
        getState,
        subscribe,
        destory
    }
    state=createState(setState,getState);
    return api;
}

//hooks 方便任何组件使用这个仓库
const useStore=(api,selector)=>{
    //api 拿到仓库里的状态
    //selector 局部
    //局部状态，只需要修改状态的方法
    const [,forceRender]=useState(0);
    useEffect(()=>{
        //自动订阅 不需要手动subscribe
        //只关心的状态，改变了
        api.subscribe((state,prevState)=>{
            const newObj=selector(state);//关心的，就会改变，不关心，不会改变
            const oldObj=selector(prevState);//关心的，旧状态
            if(newObj!==oldObj){
                forceRender(Math.random());//强制组件刷新
            }
        })
    },[]);
    return selector(api.getState())
}

//高阶函数
//返回一个函数 useXxxStore
//useXxxStore 可以接受一个函数 返回某一些状态和方法
export const create=(createState)=>{
    //返回 subscribe方法
    const api=createStore(createState);
    //selector 选择哪个属性，哪个方法
    //hooks的好处
    //函数式编程
    //方便使用
    const useBoundStore=(selector)=>{
        return useStore(api,selector)
    }

    Object.assign(useBoundStore,api)
    return useBoundStore;

} 