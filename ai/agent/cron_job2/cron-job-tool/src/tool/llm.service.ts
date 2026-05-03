import { Inject,Injectable } from "@nestjs/common";
import {ConfigService} from '@nestjs/config'
import { ChatOpenAI } from "@langchain/openai";

@Injectable()
export class LlmService{
    @Inject(ConfigService)
    private readonly configService!:ConfigService;

    getModel(){
        return new ChatOpenAI({
          model:this.configService.get('MODEL_NAME'),
          apiKey:this.configService.get('TEST_OPENAI_API_KEY'),
          configuration:{
            baseURL:this.configService.get('TEST_OPENAI_BASE_URL')
          }
        })
    }
}