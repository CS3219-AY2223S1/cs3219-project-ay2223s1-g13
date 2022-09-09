
export async function ormCreateMatch(user, difficulty, time) {
    try {
        return true;

    } catch (err) {
        console.log('ERROR: Could not create matching');
        return { err };
    }
}