import path from 'path'
 import dotenv from 'dotenv'
 dotenv.config({path:path.resolve('config/.env')})
 import express from'express'
import { initApp } from './init.APP.js'





 const app = express()
  initApp(express,app)
  
