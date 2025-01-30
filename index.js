 
 import dotenv from 'dotenv'
 dotenv.config()
 import express from'express'
import { initApp } from './init.APP.js'
 
 

 
 const app = express()
  initApp(express,app)
  
