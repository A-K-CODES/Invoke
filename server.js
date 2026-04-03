import express from 'express';
import {generate} from "./chatBot.js"
import cors from "cors";
const app = express()
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome To ChatAI')
})

app.post('/chat', async(req, res) =>{
    const {message, threadId} = req.body;

    if(!message || !threadId){
      res.status(400).json({message: "All Fields are required."});
      return;
    }
    const result = await generate(message, threadId)

    res.json({message:result})

})

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
