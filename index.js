const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.json());

app.get("/", function (req, res) {
    fs.readdir('./tasks', function (err, tasks) {
        res.render('index', { files: tasks });
    })

});

app.get('/task/:filename', function (req, res) {
    const decodedFilename = decodeURIComponent(req.params.filename);
    const filePath = `./tasks/${decodedFilename}`;
    
    fs.readFile(filePath, "utf-8", function (err, fileData) {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            res.status(404).render('show', { content: 'File not found', title: decodedFilename });
        } else {
            console.log(`Successfully read file ${filePath}`);
            res.render('show', { content: fileData, title: decodedFilename });
        }
    });
});

app.get('/edit/:filename', function (req, res) {
    fs.readFile( `./tasks/${req.params.filename}`, 'utf8', (err, Data) => {
   
        res.render('edit', { filename: req.params.filename , details: Data });
    }) 
});

app.post('/edit',function (req, res) {

    fs.rename(`./tasks/${req.body.PreviousName}`, `./tasks/${req.body.NewName}`, function (err) {
        res.redirect('/');
    });
    fs.writeFile(`./tasks/${req.body.PreviousName}`, req.body.NewDetails , 'utf8', (err) => {});
});


app.post("/submit",async function (req, res) {
    fs.writeFile(`./tasks/${req.body.title}`, await req.body.text, function (err) {
        res.redirect('/');
    });

});



// app.post('/delete/:file', function(req, res){
//     const filename = req.params.file;
//     console.log(filename);

//     fs.unlink(filename, (err) => {
//         if (err) {
//             console.error('File deletion error:', err);
//             return res.status(500).send('Server error');
//         }
//         res.redirect('/');
//     });
// });



app.listen(3000);