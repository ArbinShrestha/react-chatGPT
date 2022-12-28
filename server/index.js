import { ChatGPTAPIBrowser } from "chatgpt";
import {createRequire} from "module"
const require = createRequire(import.meta.url)
const express = require('express')
const app = express();
const PORT = 4000
const cors = require('cors')
const { Novu } = require("@novu/node");
require('dotenv').config();

const novu = new Novu("f18324fd5def0e72b7df6023950dbe16");

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.get('/api',(_, res) => {
    
    res.json({
        message: "Hello world"
    })
})

let chatgptResult = ""

  async function chatgptFunction(message, subscriberId,firstName, res){
    //use puppeteer to bypass cloudflare (headful beacuse of captchas)
    const api = new ChatGPTAPIBrowser({
      email: "warlordzankrow420@gmail.com",
      password: "qwerty1234567890"
    })

    await api.initSession()
    const result = await api.sendMessage(message)
    chatgptResult = result.response
    //Replace the user variable with the user's first name
    const notificationString = chatgptResult.replace("{{user}}", firstName)
    sendNotification(notificationString, subscriberId, res);
    // console.log(notificationString, subscriberId)
  }

  //Sends the notification via Novu
  async function sendNotification(data, subscriberId, res){
    try{
      let result = await novu.trigger("on-boarding-notification",{
        to: {
          subscriberId: subscriberId,
        },
        payload:{
          message: data,
        },
      })
      return res.json({message:result})
    } catch(err){
        return res.json({error_message:err})
    }
  }

app.get('/subscribers',async(req,res)=>{
    try{
        const {data} = await novu.subscribers.list(0)
        const resultData = data.data
        //Returns subscribers with an id, and first and last names
        const subscribers = resultData.filter(
            (d)=>d.firstName && d.lastName && d.subscriberId
        )
        res.json(subscribers)
    }
    catch(err){
        console.error(err)
    }
})

app.post('/notify',(req,res)=>{
    //Destructure the message and subscriber from the object
    const {message, subscriber} = req.body
    //Seperates the first name and the subscriber ID
    const subscriberDetails = subscriber.split(" ")
    const firstName = subscriberDetails[0]
    const subscriberId = subscriberDetails[3]
    //Added some specificaitons to themessage to enable the AI generate a consice notification.
    const fullMessage = `"${message}" can you write me one?
    please use double curly brackets for variables.
    make it short, and use only one variable for the user name.
    Please just write 1 notification without any intro.`;

    //Log the required variables to the console
    console.log({firstName, subscriberId, fullMessage})

    //Pass the variables as parameter into the funciton
    chatgptFunction(fullMessage, subscriberId, firstName, res)
})

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`)
})

