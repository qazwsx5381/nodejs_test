const express = require("express");
const app = express();
const path = require("path");
const logger = require("morgan");
const multer = require("multer");
const fs = require("fs");
const _path = path.join(__dirname, "/dist");
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(_path));
app.use(logger("tiny"));
console.log(_path);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./download");
  },
  filename: function (req, res, cb) {
    const fix = Buffer.from(res.originalname, "latin1").toString("utf-8"); // 파일명 한글이 깨질 때
    cb(null, fix);
    // cb(null, file.fieldname + '-' + Date.now())
  },
});

const upload = multer({ storage });

app.get("/test", (req, res) => {
  const { id, name } = req.query;
  res.send(`
  <div>아이디 : ${id}</div>
  <div>이름 : ${name}</div>
  <button onclick="location.href='./index.html'">돌아가기</button>`);
});

app.post("/save", (req, res) => {
  const obj = req.body;
  let arr = { 나이: obj.age, 문의사항: obj.notice };
  fs.writeFile(_path + `/${obj.name}.txt`, JSON.stringify(arr), (e) => {
    if (e) console.log(e);
    console.log("파일 작성이 완료되었습니다.");
    let a = `<script>alert('${obj.name}.txt로 저장되었습니다.');location.href='/index.html';</script>`;
    res.send(a);
  });
});

app.post("/download", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.send(
    `<script>alert('${req.file.filename} 파일 업로드 완료');location.replace('index.html')</script>`
  );
});

app.listen(PORT, () => {
  console.log("현재 오픈한 서버의 포트 : ", PORT);
});
