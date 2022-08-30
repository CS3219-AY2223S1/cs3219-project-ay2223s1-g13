import { createUser, validateUsername } from './repository.js';

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

export async function ormValidateUsername(username) {
    try {
        return await validateUsername(username);
    } catch (err) {
        console.log('ERROR: Validate username fail');
        return { err };
    }
}

