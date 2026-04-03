
const input = document.querySelector("#chat-input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask");

const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);




input?.addEventListener("keyup", handleEnter);
askBtn?.addEventListener("click", handleClick);


const loading = document.createElement("div");
loading.className = "my-6 animate-pulse"
loading.textContent = 'Thinking...';

 const generate = async(text) =>{
    // Append message to UI
    const msg = document.createElement("div");
    msg.className = "my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit";
    msg.textContent = text
    chatContainer?.appendChild(msg);
    input.value = "";

    chatContainer?.appendChild(loading);
    //// Call server ///
    const assistentMsg = await callServer(text);

    const assistantMsgElement = document.createElement("div");
    assistantMsgElement.className = "max-w-fit";
    assistantMsgElement.textContent = assistentMsg;
    loading.remove();
    chatContainer?.appendChild(assistantMsgElement);
}

async function callServer(inputText){
    const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({message:inputText, threadId})
    })

    if(!response.ok){
        throw new Error("Error getting in response");
    }

    const result = await response.json();
    return result.message
}

async function handleClick(){
    const text = input?.value.trim();
    if(!text) return
    await generate(text)
}

async function handleEnter(e){
    if(e.key === "Enter"){
        const text = input?.value.trim();
        if(!text) return
        await generate(text)
    }
}