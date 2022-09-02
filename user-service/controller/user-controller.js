import { ormCreateUser as _createUser, ormFindUser as _findUser, ormDeleteUser as _deleteUser  } from '../model/user-orm.js'
import "bcrypt"
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const existingUser = await _validateUsername(username);

            //check if database have existing username
            if (existingUser) {
                return res.status(409).json({ message: 'Existing username!' });
            }

            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({ message: 'Could not create a new user!' });
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({ message: `Created new user ${username} successfully!` });
            }
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when creating new user!' })
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const user = await _findUser(username);
            // check if username exists
            if (!user) {
                return res.status(400).json({ message: "User does not exist" })
            }
            // check if correct password
            const isCorrectPassword = await checkPassword(password, user.password);
            if (!isCorrectPassword) {
                return res.status(400).json({ message: "Invalid Password" })
            }

            const payload = { user: { name: username }}
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
            return res.status(200).json({ accessToken: accessToken, message: `Logged in user ${username} succesfully` });
            // all good to go
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error when logging in!"})
    }
}


async function checkPassword(typedPassword, requiredPassword) {
    //need to hash and salt stuff later 
    return (typedPassword == requiredPassword)
}

// This is an middleware to authenticate user actions
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null ) {
        return res.status(401).json({message: "No token provided"})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) return res.status(403).json({message: "Invalid Token"})
        req.user = payload.user
        next()
    })
}

export async function deleteUser(req, res) {
  try {
    const { username } = req.body;
    if (username) {
        const resp = await _deleteUser(username);
        console.log(resp);
        if (resp.err) {
            return res.status(400).json({message: 'Could not delete the user!'});
        } else {
            console.log(`User ${username} is deleted successfully!`)
            return res.status(201).json({message: `Deleted user ${username} successfully!`});
        }
    } else {
        return res.status(400).json({message: 'Username use missing!'});
    }
  } catch (err) {
      return res.status(500).json({message: 'Database failure when deleting the user!'})
  }
}

