# MCP


- llm with tools 
  read write listDir exec tool
  llm + tools = Agent
  甜头 llm 真的能干活了

- mini-cursor
  llm with tools 不太满意?
  怎么把llm 能干活的甜头扩大呢？ 更多的tools 更好的tool 第三方的tool
  向外提供tool 大厂将自己的服务以mcp的方式向外提供
  - 80%的App 会消失
  - 集成第三方的mcp服务，mcp其实就是tool
  - node 调用java/python/rust 等其他语言的tool
  - 远程的tool

## MCP
就是tool 
Model Context Protocol -> Anthropic公司
在大量的将本地，跨语言、第三方的tool 集成到Agent里来的时候，让llm 强大的同时 也会带来一定的复杂性（对接连调）
大家都按照一个约定来

## 按MCP 协议来开发 将我们的服务或资源 输出出去

## MCP 协议 还有通信部分
    - stdio 本地命令行
    - http 远程调用

## MCP 最大的特点就是可以跨进程调用工具
  - 子进程 node:child-process
  - 跨进程 java/rust
  - 远程进程
    llm 干更强大的任务
     繁杂(本地、跨语言、跨部门、远程) 不同的通信方式 (stdio,http)
     规范的提供工具和资源,mcp 协议 

## 编写满足mcp协议规范的Tool


- Model Context Protocol
  tool result , ToolMessage Context 上下文

- Anthropic公司 定义了MCP协议的规范 24年底提出 25年底贡献给开源社区
- sdk @modelcontextprotocol/sdk
  pnpm i @modelcontextprotocol/sdk

- 为什么mcp 需要配置?
  - cursor/trae 编程Agent 支持MCP client
  - 读取mcp.json 需要的mcp tool
  

  - 因为mcp 协议是一个规范，不是一个实现
  - 不同的实现 有不同的配置
  - 比如 stdio 协议 就需要配置 stdio 命令行

- 手写 MCP tool
  - Client/Server 架构
  - tool 的基础上加上MCP规范
  - tool 需要一个server 容器 @modelcontextprotocol/sdk
  - registerTool
    describe
  - connect transport
