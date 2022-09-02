import { ormCreateUser as _createUser, ormDeleteUser as _deleteUser } from '../model/user-orm.js'

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