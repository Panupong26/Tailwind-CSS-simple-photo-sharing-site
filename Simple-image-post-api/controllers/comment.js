const db = require("../models");

const createComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const title = req.body.title;
        const postId = req.body.postId;
        const tag = req.body.tag;

        await db.comment.create({
            title: title,
            postId: postId,
            userId: userId
        })
        .then(async data => {
            if(tag) {
                for(let user of JSON.parse(tag)) {
                    await db.tag.create({
                        type: 'COMMENT',
                        commentId: data.id,
                        userId: user.id
                    });
                }
            }

            const targetComment = await db.comment.findOne({
                where: {
                    id: data.id
                },
                include: [
                    {
                        model: db.user,
                        attributes: {
                            exclude: ['username', 'password', 'detail']
                        }
                    },
                    {
                        model: db.tag,
                        include: [
                            {
                                model: db.user,
                                attributes: {
                                    exclude: ['username', 'password', 'detail']
                                }    
                            }
                        ]
                       
                    }
                ]
            });

            return res.status(201).send(targetComment);
        });
    } catch (err) {
        err.from = 'createComment';
        next(err);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;

        const targetComment = await db.comment.findOne({
            where: {
                id: commentId
            }
        })

        if(!targetComment) {
            return res.status(404).send();
        }

        if(targetComment.userId !== userId) {
            return res.status(401).send();
        }

        await db.comment.destroy({
            where: {
                id: commentId
            }
        })
       
        return res.status(200).send('Done');   
    } catch (err) {
        err.from = 'deleteComment';
        next(err);
    }
}

module.exports = {
    createComment,
    deleteComment
}