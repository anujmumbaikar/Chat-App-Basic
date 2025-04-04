import express from 'express';
import { app } from './app.js';
import { connectDB } from './db/index.js';
import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1);
});