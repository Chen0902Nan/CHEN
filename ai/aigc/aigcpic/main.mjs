//模块化导入
import OpenAI from 'openai'
// import dotenv from 'dotenv' ,解构，导入包的一部分->优化
import { config } from 'dotenv'

//config 将.env文件配置读取到process中
config({
  path: '.env'
})
//进程启动了
// console.log(process.env)

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // openai sdk 是AIGC 事实标准
  // 默认发送请求到openai 服务器
  // 可以向baseURL 自定义服务器地址 LLM 服务代理商或其他模型发送请求
  baseURL: 'https://api.agicto.cn/v1'
})
// 箭头函数
// async 耗时性的任务 -> 异步任务
const main = async () => {
  //生成图片接口
  const res = await client.images.generate({
    model: 'dall-e-3', //达芬奇模型
    prompt: 'A spaceship flying through the universe', //给LLM下达的指令
    n: 1,
    size: '1024x1024'
  })
  console.log(res.data[0].url)
}
main()
