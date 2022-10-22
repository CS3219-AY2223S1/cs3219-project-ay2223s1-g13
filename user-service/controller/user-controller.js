import { ormCreateUser as _createUser, ormFindUser as _findUser, ormDeleteUser as _deleteUser, ormChangePassword as _changePassword } from '../model/user-orm.js'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const existingUser = await _findUser(username);

            //check if database have existing username
            if (existingUser) {
                return res.status(409).json({ message: 'Existing username!' });
            }

            const hash = await hashPassword(password);
            const resp = await _createUser(username.toLowerCase(), hash);
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
        if (username && password) {2
            const user = await _findUser(username.toLowerCase());
            // check if username exists
            if (!user) {
                return res.status(400).json({ message: "User does not exist" })
            }
            // check if correct password
            const isCorrectPassword = await checkPassword(password, user.password);
            if (!isCorrectPassword) {
                return res.status(400).json({ message: "Invalid Password" })
            }

            const payload = { user: { name: username } }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
            return res.status(200).json({ accessToken: accessToken, message: `Logged in user ${username} succesfully` });
            // all good to go
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error when logging in!" })
    }
}

async function checkPassword(typedPassword, requiredPassword) {
    //compare 2 passwords
    const validPassword = await bcrypt.compare(typedPassword, requiredPassword);
    return validPassword;
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export async function changePassword(req, res) {
    try {
        const { username, oldPassword, newPassword } = req.body;
        if (username && oldPassword && newPassword) {
            const user = await _findUser(username);

            // check if username exists
            if (!user) {
                return res.status(400).json({ message: "User does not exist" })
            }

            // check if correct current password entered
            const isCorrectPassword = await checkPassword(oldPassword, user.password);
            if (!isCorrectPassword) {
                return res.status(400).json({ message: "Invalid password" })
            }

            const hash = await hashPassword(newPassword);
            // update old password to new password
            const resp = await _changePassword(username, hash);
            if (resp.err) {
                return res.status(400).json({ message: 'Could not update password!' })
            } else {
                console.log(`Successfully updated password for user ${username}!`)
                return res.status(200).json({ message: `Successfully updated password for user ${username}!` })
            }

        } else {
            return res.status(400).json({ message: 'Username and/or Old Password and/or New Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error when updating password!" })
    }
}

// This is an middleware to authenticate user actions
export async function authenticateToken(req, res, next) {
    try {
        const {token} = req.body

        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        try {
            const decoded = jwt.verify(token, "ACCESS_TOKEN");
            req.user = decoded;
            return res.status(200).send("Valid Token");
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    } catch (err) {
        return res.status(500).send("Problem authenticating code")
    }
}


export async function deleteUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const user = await _findUser(username);
      if (!user) {
        return res.status(406).json({ message: "User does not exist" })
      }

      const isCorrectPassword = await checkPassword(password, user.password);
      if (!isCorrectPassword) {
          return res.status(409).json({ message: "Invalid Password" })
      }

      const resp = await _deleteUser(username);
      console.log(resp);
      if (resp.err) {
          return res.status(400).json({message: 'Could not delete the user!'});
      } else {
          console.log(`User ${username} is deleted successfully!`)
          return res.status(200).json({message: `Deleted user ${username} successfully!`});
      }
    } else {
      return res.status(400).json({message: 'Username and/or password missing!'});
    } 
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when deleting the user!' })
  }
}

