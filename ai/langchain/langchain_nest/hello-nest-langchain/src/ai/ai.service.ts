import { Injectable,Inject } from '@nestjs/common';
import {ChatOpenAI} from '@langchain/openai';
import {PromptTemplate} from '@langchain/core/prompts';
import {StringOutputParser} from '@langchain/core/output_parsers';
import type {Runnable} from '@langchain/core/runnables'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
    //链式调用对象
    private readonly chain:Runnable;
// OPENAI_API_KEY=sk-9b054153cbf5460db0651fbd85b5da73
// OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
    constructor(@Inject(ConfigService) configService:ConfigService){
        const prompt=PromptTemplate.fromTemplate(
            `
            请回答以下问题：\n\n{query}
            `
        );
        const model=new ChatOpenAI({
            temperature:0.7,
            modelName:configService.get('MODEL_NAME'),
            apiKey:configService.get('OPENAI_API_KEY'),
            configuration:{
                baseURL:configService.get('OPENAI_BASE_URL')
            }
        });
        this.chain=prompt.pipe(model).pipe(new StringOutputParser());

    }
    async runChain(query:string):Promise<string>{
        return this.chain.invoke({query});
    }
}