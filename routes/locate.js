const router = require('express').Router()
const fs = require('fs-extra')

//[GET] Get các users gần nhất
router.get('/', async (req, res) => {
    const id = req.query.userId
    const numUsers = req.query.n
    
    const db = await fs.readJson('./db.json')
    const userA = db.listUser.find(user => user.id === id)

    const xA = userA.coordinate.slice(0, 3)
    const yA = userA.coordinate.slice(4)

    const closestUsers = db.listUser.map(userB => {

        const xB = userB.coordinate.slice(0, 3)
        const yB = userB.coordinate.slice(4)

        let distance = Math.sqrt(
            (xB - xA)^2 + (yB - yA)^2
        )

        if (xA === yA && xB === yB)
            distance = xB > xA ? xB - xA : xA - xB

        userB.distance = distance

        return userB
    })

    closestUsers.sort((a, b) => a.distance - b.distance)
    closestUsers.shift()
    closestUsers.length = numUsers

    return res.json({
        success: true,
        data: closestUsers,
        error: null
    })
})

module.exports = router