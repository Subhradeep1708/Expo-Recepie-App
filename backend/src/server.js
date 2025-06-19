import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'

const port = env.PORT
const app = express()
app.use(cors())
app.use(express.json())



app.listen(port, () => {
    console.log("server listening on port", port);
})