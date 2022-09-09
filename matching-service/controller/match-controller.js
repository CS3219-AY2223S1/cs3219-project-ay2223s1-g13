import { ormCreateMatchas as _createMatch } from "../model/match-orm";

export async function createMatch(req, res) {
    try {
        const { user } = req.body;

        if (user) {
            const existingMatch = await _findMatch(user);

            //check if database have existing user matched/matching
            if (existingMatch) {
                return res.status(409).json({ message: 'User is matched / being matched' });
            }

            const resp = await _createMatch(user, Date.now(), false);
            console.log(resp);

            if (resp.err) {
                return res.status(400).json({ message: 'Could not start matching process for user' });
            } else {
                console.log(`Start match for user ${user.username}`)
                return res.status(201).json({ message: `Start match for user ${user.username}!` });
            }
        } else {
            return res.status(500).json({ message: 'Somethign went wrong!' });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error when creating match!" })
    }
}