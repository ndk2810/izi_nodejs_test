const express = require('express')
const app = express()
const PORT = 3000

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

const route = require('./routes')
route(app)

app.get('/', (req, res) => {
    res.send("Ngô Duy Khang - BÀI KIỂM TRA LẬP TRÌNH VIÊN NODE.JS")
})

app.listen(PORT, () => {
    console.log('App đang chạy trên http://localhost:' + PORT)
})