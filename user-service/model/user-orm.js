import { createUser, findUser, deleteUser, changePassword } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({ username, password });
        newUser.save(err => {
            if (err) console.log(err);
        });
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormFindUser(username) {
    try {
        const user = await findUser(username)
        return user;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}

export async function ormChangePassword(username, newPassword) {
    try {
        const userUpdated = await changePassword(username, newPassword);
        return userUpdated;
    } catch (err) {
        console.log('ERROR: Could not update password');
        return { err };
    }
}

export async function ormDeleteUser(username) {
  try {
      await deleteUser(username);
      return true;
  } catch (err) {
      console.log('ERROR: Could not delete user');
      return { err };
  }
}
