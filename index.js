
const express = require("express")
const shortid = require("shortid")
const server = express()

server.use(express.json())

let users = []

// {
//     id: "a_unique_id", // hint: use the shortid npm package to generate it
//     name: "Jane Doe", // String, required
//     bio: "Not Tarzan"s Wife, another Jane",  // String, required
// }

server.post("/api/users", (req, res) => {
    const userInfo = req.body
    if(!userInfo.bio || !userInfo.name) {
        console.log(userInfo)
        res.status(400).json({
            errorMessage:
            "Please provide a name and bio for the user."
        })
    } else {
        try {
            userInfo.id = shortid.generate()
            users.push(userInfo)
            res.status(201).json(userInfo)
            console.log(userInfo)
        } catch (err) {
            res.status(500).json({
                errorMessage:
                "There was an error while saving the user to the database"})
        }
    }
})

server.get("/api/users", (req, res) => {
    try {
        res.status(200).json(users)
    } catch(err) {
        res.status(500).json({
            errorMessage:
            "The users information could not be retrieved."
        })
    }
})

server.get('/api/users/:id', (req, res)=>{
    const { id } = req.params
    const userId = users.find(user => user.id === id)

    try {
        if(userId) {
            res.status(200).json(userId)
        } else{
            res.status(404).json({
                errorMessage:
                "The user with the specified ID does not exist."
            })
        }
    } catch (err) {
        res.status(500).json({
            errorMessage:
           "The user information could not be retrieved."
        })
    }
})

server.delete('/api/users/:id', (req, res)=>{
    const { id } = req.params;
    const userId = users.find(user => user.id === id)

    try {
        if(userId) {
            users = users.filter(user => user.id !== id);
            res.status(200).json(userId);
        } else {
            res.status(404).json({
                errorMessage:
                "The user with the specified ID does not exist."
            })
        }
    } catch (err) {
        res.status(500).json({
            errorMessage:
            "The user could not be removed"
        })
    }
})

server.patch('/api/users/:id', (req, res)=>{
    const { id } = req.params
    const update = req.body
    const userId = users.find(user => user.id === id)

    try {
        if (userId) {
            Object.assign(userId, update);
            res.status(200).json(userId);
        } else {
            res.status(404).json({
                errorMessage:
                "The user with the specified ID does not exist."
            })
        }
    } catch (err) {
        res.status(500).json({
            errorMessage:
            "The user information could not be modified."
        })
    }
})

const PORT = 5000
server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`))