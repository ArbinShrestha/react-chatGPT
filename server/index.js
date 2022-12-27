import express from 'express';
import cors from 'cors';

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

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`)
})

