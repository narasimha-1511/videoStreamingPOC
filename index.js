import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs'
import {exec} from "child_process" // watch out this is dangerous
import { stderr } from 'process';

const app = express();

//multer middleware
const storage = multer.diskStorage({
    destination : function(req , res , cb){
        cb(null , "./uploads")
    },
    filename: function(req, file , cb){
        cb(null , file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
    }
})


//multer  configuration
const upload = multer({storage : storage});

app.use(cors({
    origin:["http://localhost:5173" ,"http://localhost:8000" , "" ],
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/uploads" , express.static("uploads"))

app.use((req, res , next) => {
    // req.header("Access-Control-Allow-Origin" , "*" ) // watch it
    next()
})

app.get('/' , (req, res) => {
    res.json({
        message : "you are a noob"
    })
})

app.post('/upload' , upload.single('file') , (req , res) =>{
    
    const lessonId = uuidv4()
    const videoPath = req.file.path
    const outputPath = `./uploads/courses/${lessonId}`
    const hlsPath = `${outputPath}/index.m3u8`

    console.log("hls path" , hlsPath)

    if(!fs.existsSync(outputPath)){
        fs.mkdir(outputPath , {recursive:true} , (err) => {
            if(err){
                return console.log(" error while creating the drectory");
            }
            console.log("success fully created the directiry")
        })
    }
    //ffmpeg this is crazy shit that is needed 

    const setEnvironmentPath = `$env:Path += ";C:/PATH_Programs/"`;

    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    const combinedCommand =`${setEnvironmentPath}; ${ffmpegCommand} `;

    exec(combinedCommand , {shell: `powershell.exe`} ,  (error , stdout , stderr) => {

        if(error)console.log("exec error " ,error);

        console.log(`std:out is ${stdout}`)
        console.log(`std:err is ${stderr}`)

        const videoURL = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`
        
        res.json({
            message:"Video converted to hls format",
            videoUrl : videoURL
        })
    })

} )

app.listen(8000 , () => {
    console.log(" hello port is at 8000 hehehe")
})