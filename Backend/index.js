const express = require('express')
const multer = require('multer')
const docxTopdf = require('docx-pdf');
const cors = require('cors')
const path = require('path')
const app = express()

let Port = 5000
app.use(cors());
//File Storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  const upload = multer({ storage: storage })
app.post('/convertFile', upload.single('file'), function (req, res, next){
    try {
            if(!req.file){
                return res.status(400).json({
                    message: "No File Uploaded"
                })
            }
            //Output File Path
            let outputPath = path.join(__dirname,"file",`${req.file.originalname}.pdf`)
        docxTopdf(req.file.path,outputPath,function(err,result){
            if(err){
              console.log(err);
              return res.status(500).json({
                message:"Error converting docx to pdf",
              })
            }
            res.download(outputPath,()=>{
                console.log("File Downloaded Successfully");
            })
            
          });
    }catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
})   
app.listen(Port,()=>{
    console.log(`Server is Running on ${Port}`);
})
 