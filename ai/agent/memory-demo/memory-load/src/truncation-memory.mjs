import {
    InMemoryChatMessageHistory
} from '@langchain/core/chat_history';
import {
    HumanMessage,
    AIMessage,
    trimMessages
} from '@langchain/core/messages';
import {
    getEncoding // 40%
} from 'js-tiktoken';

async function messageCountTruncation() {
    const history = new InMemoryChatMessageHistory();
    const maxMessages = 4;

    const messages = [
        { type: 'human', content: '我叫张三' },
        { type: 'ai', content: '你好张三，很高兴认识你！' },
        { type: 'human', content: '我今年25岁' },
        { type: 'ai', content: '25岁正是青春年华，有什么我可以帮助你的吗？' },
        { type: 'human', content: '我喜欢编程' },
        { type: 'ai', content: '编程很有趣！你主要用什么语言？' },
        { type: 'human', content: '我住在北京' },
        { type: 'ai', content: '北京是个很棒的城市！' },
        { type: 'human', content: '我的职业是软件工程师' },
        { type: 'ai', content: '软件工程师是个很有前景的职业！' },
      ];

    for (const msg of messages) {
        if (msg.type === 'human') {
            await history.addMessage(
                new HumanMessage(msg.content)
            )
        } else {
            await history.addMessage(
                new AIMessage(msg.content)
            )
        }
    }

    let allMessages = await history.getMessages();
    console.log("所有消息:", allMessages);
    // 截取保留最近的几条
    const trimmedMessage=allMessages.slice(-maxMessages)
    console.log('保留消息的数量:',trimmedMessage.length);
    console.log('保留的消息:',trimmedMessage.map((message)=>(`
       ${message.constructor.name}:${message.content}`
    
    )
  ).join('\n\n'));
    
    
}

async function runAll() {
    await messageCountTruncation();// 消息的条目
}

runAll()
    .catch(console.error);