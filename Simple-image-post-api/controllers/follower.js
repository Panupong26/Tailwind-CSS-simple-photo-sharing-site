const db = require("../models");

const follow = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const targetId = req.params.id;

        const targetFollow = await db.follower.findOne({
            where: {
                userId: targetId,
                followerId: userId
            }
        });

        if(targetFollow) {
            res.status(400).send({message: 'ไม่สามารถขอติดตามซ้ำได้'})
        }
        
        await db.follower.create({
            userId: targetId,
            followerId: userId
        });

        return res.status(201).send('Done!');

    } catch (err) {
        err.from = 'follow';
        next(err);
    }
}

const cancleFollow = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const targetId = req.params.id;

        const targetFollow = await db.follower.findOne({
            where: {
                userId: targetId,
                followerId: userId
            }
        });

        if(!targetFollow) {
            return res.status(400).send({message: 'คุณยังไม่ได้ติดตาม'})
        }
        
        await db.follower.destroy({where: {id: targetFollow.id}});

        return res.status(200).send('Done!');

    } catch (err) {
        err.from = 'follow';
        next(err);
    }
}

module.exports = {
    follow,
    cancleFollow
}