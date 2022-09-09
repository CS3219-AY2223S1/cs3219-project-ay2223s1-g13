<<<<<<< HEAD
import { ormCreateMatch as _createMatch } from "../model/match-orm";
=======
import { ormCreateMatches as _createMatch } from "../model/match-orm";
>>>>>>> ff34e627ed2ff80777e965bd3975bab8d8a0c133

export async function createMatch(req, res) {
    try {
        const { userOne, userTwo, timeCreated, isFull } = req.body;
        const newMatch = _createMatch(userOne, userTwo, timeCreated, isFull);

<<<<<<< HEAD
        if (newMatch) {
            return res.status(201).json({ message: "Created new match" });
=======
        if (user) {
            return res.status(200).json({ message: 'logic tbc' });
            // const existingMatch = await _findMatch(user);

            // //check if database have existing user matched/matching
            // if (existingMatch) {
            //     return res.status(409).json({ message: 'User is matched / being matched' });
            // }

            // const resp = await _createMatch(user, Date.now(), false);
            // console.log(resp);

            // if (resp.err) {
            //     return res.status(400).json({ message: 'Could not start matching process for user' });
            // } else {
            //     console.log(`Start match for user ${user.username}`)
            //     return res.status(201).json({ message: `Start match for user ${user.username}!` });
            // }
>>>>>>> ff34e627ed2ff80777e965bd3975bab8d8a0c133
        } else {
            return res
                .status(400)
                .json({ message: "Could not create a new match!" });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error when creating match!" });
    }
}


