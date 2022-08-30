import { ormCreateUser as _createUser, ormFindUser as _findUser } from '../model/user-orm.js'
import "bcrypt.js"

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function loginUser(req, res) {
    try {
        const {username, password} = req.body;
        if (username && password) {
            const user = await _findUser(username);
            // check if username exists
            if (!user) {
                return res.status(400).json({message: "User does not exist"})
            }

            // check if correct password
            const isCorrectPassword = await checkPassword(password, user.password);
            if (!isCorrectPassword) {
                return res.status(400).json({message: "Invalid Password"})
            }

            return res.status(200).json({message: `Logged in user ${username} succesfully`});
            // all good to go
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: "Server error when logging in!"})
    }
}


async function checkPassword(typedPassword, requiredPassword) {
    //need to hash and salt stuff later 
    return bcrypt.compare(typedPassword, requiredPassword);
}