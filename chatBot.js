import Groq from "groq-sdk";
import { Models } from "groq-sdk/resources";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache" ;


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});

const cache = new NodeCache({stdTTL: 60*60*24}); /// 24 hours


export async function generate(userMessage, threadId){
    const baseMessages = [
            {
                role:"system",
                content:`You are a personal smart assistent. 
                If you know the answer to a question. answer it directly in plain english.
                If the answer requires real-time, local, or up-to-date information, or if you don't know the answer, use the available
                tools to find it.
                You have access to the following tool:
                webSearch(query: string): use this to search the internet for current or unknown information.
                Decide when to use your own knowledge and when to use the tool.
                Do not mention the tool unless needed.
                
                Example:
                Q: What is the capital of France?
                A: The capital of France is Paris.
                
                q: What is the weathe in Mumbai right now?
                A: (use the search tool to fine the latest weather)
                
                q: Who is the Prime Minister of India?
                A: The current Prime minister of India is Narendra Modi.
                
                q: Tell me the latest IT news?
                A: (use the search tool to get the latest news)
                
                current date and time: ${new Date().toUTCString()}`
            },
            
        ]
        
        const messages = cache.get( threadId ) ?? baseMessages;

            messages.push({
                role: "user",
                content: userMessage
            })

            const maxRetries = 10;
            let count = 0;
            while(true){
                if(count > maxRetries){
                    return "I could not find the result. Please try again."
                }

                count ++
                const completion = await groq.chat.completions.create({
                        temperature:0,
                        // top_p:0.2,
                        // stop:"Na",
                        // frequency_penalty:1,
                        // max_completion_tokens:1000,
                        // presence_penalty:1,
                        // response_format: {"type":"json_object"},
                        model:"llama-3.3-70b-versatile",// "openai/gpt-oss-20b",
                        messages: messages,
                        tools: [
                                {
                                    type: "function",
                                    function: {
                                        name: "webSearch",
                                        description: "Search the latest information and realtime data on the internet.",
                                        parameters: {
                                            // JSON Schema object
                                            type: "object",
                                            properties: {
                                                query: {
                                                    type: "string",
                                                    description: "The search query to perform seach on."
                                                },
                                            },
                                            required: ["query"]
                                        }
                                    }
                                }
                            ],
                        tool_choice: "auto"
                    })
        

                messages.push(completion.choices[0].message)

                const toolCalls = completion.choices[0].message.tool_calls;

                if (!toolCalls) {
                    /// here we ent the chatAI response.
                    cache.set( threadId, messages)
                    return completion.choices[0].message.content
                } 

                for(const tool of toolCalls){
                    const functionName = tool.function.name;
                    const functionParams = tool.function.arguments;

                    if(functionName === "webSearch"){
                        const toolResult = await webSearch(JSON.parse(functionParams));

                        messages.push({
                            tool_call_id: tool.id,
                            role: "tool",
                            name: functionName,
                            content: toolResult
                        })
                    }
                }
                //console.log(JSON.stringify(completion.choices[0].message, null, 2));

            } 
        
        

}


async function webSearch({query}){
    console.log("Calling web search")
    // here we will do tavily api call
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY});
    const response = await tvly.search(query );

    const finaleResult = response.results.map((result) => result.content).join('\n\n');
    return finaleResult;
    //return "Iphone 17 was launched in september 2025."
}