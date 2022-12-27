import express from 'express';
import cors from 'cors';
import Novu from '@novu/node';


const novu = new Novu("f18324fd5def0e72b7df6023950dbe16");
const app = express();
const PORT = 4000

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.get('/api',(_, res) => {
    
    res.json({
        message: "Hello world"
    })
})

app.get('/subscribers',async(req,res)=>{
    try{
        const {data} = await novu.subscribers.list(0)
        const resulData = data.data
        //Returns subscribers with an id, and first and last names
        const subscribers = resultData.filter(
            (d)=>d.firstName && d.firstName && d.subscriberId
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
    const fullMessage = `I have a notification system and I want to send the user a notification about "${message}" can you write me one?
    please use double curly brackets for variables.
    make it short, and use only one variable for the user name.
    Please just write 1 notification without any intro.`

    //Log the required variables to the console
    console.log({firstName, subscriberId, fullMessage})
})

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`)
})

