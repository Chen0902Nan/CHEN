import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private readonly configService;
    private readonly chain;
    constructor(configService: ConfigService);
    runChain(query: string): Promise<string>;
}
