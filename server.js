const express = require("express");
const uuid = require('uuid');
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3001

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/index.html'));
})
app.get("/notes",(req,res)=>{
    res.sendFile(path.join(__dirname,"/public/notes.html"));
})

app.get("/api/notes",(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if (err) {
           return res.status(500).json({msg:"error reading db"});
        }else{
            const notes = JSON.parse(data);
            res.json(notes);

            }
        })
    })

app.post("/api/notes",(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if (err) {
           return res.status(500).json({msg:"error reading db"});
        }else{
            var notesArray = JSON.parse(data);
            const newNote = {
                id: uuid.v4(),
                title: req.body.title,
                text: req.body.text,
            };
            notesArray.push(newNote);
            fs.writeFile("./db/db.json",JSON.stringify(notesArray,null,4),(err)=>{
                if (err) {
                    return res.status(500).json({msg:"error writing db"});
                }else{
                    return res.json(newNote);
                }
            });
        }
    });
})

app.delete("/api/notes/:id", (req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if (err) {
            return res.status(500).json({msg:"error reading db"});
        }else{
            var notesArray = JSON.parse(data);
            var id = (req.params.id);
            for (let i = 0; i < notesArray.length; i ++) {
                if(notesArray[i].id==id){
                    id=i;
                }
            }
            const newData = notesArray.slice(0,id).concat(notesArray.slice(id+1,notesArray.length));
            fs.writeFile("./db/db.json",JSON.stringify(newData,null,4),(err)=>{
                if (err) {
                    return res.status(500).json({msg:"error writing note db"});
                }else{
                    return res.json({msg: "note deleted"});
                }
            });
        }
    });
})

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})