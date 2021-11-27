import express from "express";
import path from "path";

const app = express()

var srcPath = path.join(__dirname, 'src');

app.use(express.static(srcPath));

// Opstarten server
app.listen({port: 4000}, ()=> {
    console.log('server running')
})




