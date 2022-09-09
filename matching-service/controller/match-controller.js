import { ormCreateMatches as _createMatch, ormFindMatch as _findMatch } from "../model/match-orm";

export async function createMatch(req, res) {
    try {
        const { user, difficulty } = req.body;

        if (user && difficulty) {

            const existingMatch = await _findMatch(user);

            //check if database have existing user matched/matching
            if (existingMatch) {
                return res.status(409).json({ message: 'User is matched / being matched' });
            }

            const resp = await _createMatch(user.username, null, difficulty, Date.now());
            console.log(resp);

            if (resp.err) {
                return res.status(400).json({ message: 'Could not start a match' });
            } else {
                console.log(`Start match for user ${user.username}`)
                return res.status(201).json({ message: `Start match for user ${user.username}!` });
            }
        } else {
            return res.status(500).json({ message: 'Something went wrong!' });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error when creating match!" })
    }
}