const express = require('express')
const multer = require('multer');
const path = require('path')

const app = express()

// Serverless 场景只能读写 /tmp 目录，所以这里需要指定上传文件的目录为 /tmp/upload
const upload = multer({ dest: '/tmp/upload' });

// Routes
app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/user', (req, res) => {
  res.send([
    {
      title: 'serverless framework',
      link: 'https://serverless.com'
    }
  ])
})

app.get('/user/:id', (req, res) => {
  const id = req.params.id
  res.send({
    id: id,
    title: 'serverless framework',
    link: 'https://serverless.com'
  })
})

app.get('/404', (req, res) => {
  res.status(404).send('Not found')
})

app.get('/500', (req, res) => {
  res.status(500).send('Server Error')
})

app.post('/upload', upload.single('file'), (req, res) => {
  res.send({
    success: true,
    data: req.file,
  });
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err)
  res.status(500).send('Internal Serverless Error')
})

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
})
