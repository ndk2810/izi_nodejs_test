const router = require('express').Router()
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra')

//[POST] Add user
router.post('/add', async (req, res) => {
    const newUser = req.body

    for (property in newUser) {
        if (!newUser[property]) {
            return res.json({
                success: false,
                data: null,
                error: "Thiếu thông tin"
            })
        }
    }

    if (parseInt(newUser.age) < 1 || parseInt(newUser.age) > 100) {
        return res.json({
            success: false,
            data: null,
            error: "Độ tuổi không được bé hơn 1 hay lớn hơn 100 !"
        })
    }

    if (!newUser.coordinate.match(/^[0-9]\d{2}:[0-9]\d{2}/g))
        return res.json({
            success: false,
            data: null,
            error: "Coordinate không hợp lệ (VD: xxx:yyy)"
        })

    const db = await fs.readJson('./db.json')

    newUser.id = uuidv4()
    db.listUser.push(newUser)

    fs.writeJson('./db.json', db, function (err) {
        if (err)
            return res.json({
                success: false,
                data: null,
                error: err
            })

        return res.json({
            success: true,
            data: newUser,
            error: null
        })
    });
})

//[GET] Get user info
router.get('/read', async (req, res) => {
    const id = req.query.id

    const db = await fs.readJson('./db.json')
    const user = db.listUser.find(user => user.id === id)

    if (!user)
        return res.json({
            success: false,
            data: null,
            error: "Không tìm thấy user"
        })

    return res.json({
        success: true,
        data: user,
        error: null
    })
})

//[GET] Search user
router.get('/search', async (req, res) => {
    const name = req.query.name.toLowerCase()

    const db = await fs.readJson('./db.json')
    const searchList = db.listUser.filter(user => {
        if (user.firstname.toLowerCase().indexOf(name) >= 0 || user.lastname.toLowerCase().indexOf(name) >= 0)
            return user
    })

    searchList.sort((a, b) => {
        if (a.firstname < b.firstname) {
            return 1;
        }
        if (a.firstname > b.firstname) {
            return -1;
        }

        return 0;
    })

    if (searchList.length < 1)
        return res.json({
            success: false,
            data: null,
            error: "Không tìm thấy user nào với tên đó"
        })

    return res.json({
        success: true,
        data: searchList,
        error: null
    })
})

//[PUT] Edit user
router.put('/edit/:id', async (req, res) => {
    const id = req.params.id
    const newInfo = req.body

    const db = await fs.readJson('./db.json')
    const user = db.listUser.find(user => user.id === id)
    const index = db.listUser.indexOf(user)

    for (property in user)
        user[property] = newInfo[property] ? newInfo[property] : user[property]

    db.listUser[index] = user

    fs.writeJson('./db.json', db, function (err) {
        if (err)
            return res.json({
                success: false,
                data: null,
                error: err
            })

        return res.json({
            success: true,
            data: user,
            error: null
        })
    });
})

//[DELETE] Delete user
router.delete('/edit/:id', async (req, res) => {
    const id = req.params.id

    const db = await fs.readJson('./db.json')
    db.listUser = db.listUser.filter(user => user.id !== id)

    fs.writeJson('./db.json', db, function (err) {
        if (err)
            return res.json({
                success: false,
                data: null,
                error: err
            })

        return res.json({
            success: true,
            data: "Delete user thành công",
            error: null
        })
    });
})

module.exports = router