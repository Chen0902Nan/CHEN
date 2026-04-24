import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env') });
import {
    ChatOpenAI
} from '@langchain/openai';
import {
    FileSystemChatMessageHistory
} from '@langchain/community/stores/message/file_system';
import {
    HumanMessage,
    AIMessage,
    SystemMessage
} from '@langchain/core/messages';

const model = new ChatOpenAI({
    modelName: process.env.MODEL_NAME,
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL
    }
})

async function fileHistoryDemo() {
    const filePath = path.join(process.cwd(), "chat-history.json");
    const sessionId = "user_session_001"; // 新一轮会话的会话id

    const systemMesage = new SystemMessage(
        "你是一个友好的做菜助手，喜欢分享美食和烹饪技巧。"
    )
    const userMessage=new HumanMessage(`红烧肉怎么做？`)
    console.log("[第一轮对话]");
    const history = new FileSystemChatMessageHistory({
      sessionId,
      filePath
    });
    await history.addMessage(userMessage)
    const messages1 = [systemMesage, ...(await history.getMessages())];
    console.log(messages1);
    const response1=await model.invoke(messages1)
    console.log(response1);
    await history.addAIMessage(response1)

    const userMessage2=new HumanMessage('好吃吗？')
    await history.addMessage(userMessage2);
    const message2=[systemMesage,...(await history.getMessages())];
    const response2=await model.invoke(message2);
    console.log('[第二轮会话]');
    await history.addMessage(response2);
    console.log(response2);
    
}

fileHistoryDemo().catch(console.error);