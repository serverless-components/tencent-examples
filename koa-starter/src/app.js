const Koa = require('koa')
const KoaRouter = require('koa-router')
const sendFile = require('koa-sendfile')
const path = require('path')
const multer = require('@koa/multer');

const app = new Koa()
const router = new KoaRouter()

// Serverless 场景只能读写 /tmp 目录，所以这里需要指定上传文件的目录为 /tmp/upload
const upload = multer({ dest: '/tmp/upload' });

// Routes
router.get(`/`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, 'index.html'))
})

router.post('/upload', upload.single('file'), (ctx) => {
  ctx.body = {
    success: true,
    data: ctx.file,
  };
});

app.use(router.allowedMethods()).use(router.routes())

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
})

