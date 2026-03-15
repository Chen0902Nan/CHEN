import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history'
import { SystemMessage,HumanMessage } from '@langchain/core/messages'

const model=new ChatOpenAI({
  modelName:process.env.MODEL_NAME,
  apiKey:process.env.OPENAI_API_KEY,
  temperature:0,
  configuration:{
    baseURL:process.env.OPENAI_BASE_URL
  }
})


async function inMemoryDemo() {
  const history=new InMemoryChatMessageHistory()
  const systemMessage=new SystemMessage(
    
  )
  console.log('[第一轮对话]');
  const userMessage1=new HumanMessage(
    '你今天吃的什么?'
  )
  await history.addMessage(userMessage1)
  const messages1=[systemMessage,...(await history.getMessages())]
  const response1=await model.invoke(messages1)
  await history.addAIMessage(response1)
  console.log(`用户:${userMessage1.content}`);
  console.log(`助手:${response1.content}`);
  
  
}

inMemoryDemo()
  .catch(console.error)