import { express } from "express";
import prodsRouter from "./routes/products.router.js";
import path from 'path'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
