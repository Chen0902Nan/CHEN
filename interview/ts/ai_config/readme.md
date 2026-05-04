# 在ts中 如何定义一个支持多种AI模型配置的通用接口

## 项目中用到多家llm

泛型+交叉类型

```ts
interface OpenAiOptions {
  model: "gpt-4" | "gpt-3.5-turbo" | "gpt-5";
  temperature: number;
  user?: string;
}

interface ClaudeOptions {
  model: "claude-3-opus" | "claude-3-sonnet";
  max_tokens: number;
  stop_sequences?: string[];
}

interface BaseAIConfig<T> {
  provider: "openai" | "anthropic" | "goole";
  apiKey: string;
  baseUrl: string;
  options: T;
}

type AIModelConfig = BaseAIConfig<OpenAIOptions> | BaseAIConfig<ClaudeOptions>;
```
