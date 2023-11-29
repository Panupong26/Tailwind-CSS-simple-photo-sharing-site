const db = require("../models");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { Op } = require("sequelize");


const createPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const files = req.files;
        const title = req.body.title || null;
        const tag = req.body.tag || null;

        await db.post.create({
            title: title,
            userId: userId,
        })
        .then(async (data) => {
            const upload = files.map(file => new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload(`Upload/postImages/${file.filename}`,{
                        public_id: file.filename.split('.')[0]
                    }, (error, result) => {
                        if(error) {
                            reject(error);
                        }
                        if(result) {
                            fs.unlinkSync(`Upload/postImages/${file.filename}`);
                            resolve(result);
                        }
                    })
                })
            )         

            Promise.all(upload).then(async (values) => { 
                for(let result of values) {
                    await db.media.create({
                        type: 'IMAGE',
                        url: result.url,
                        postId: data.id
                    });
                }

                if(tag) {
                    for(let user of JSON.parse(tag)) {
                        await db.tag.create({
                            type: 'POST',
                            userId: user.id,
                            postId: data.id
                        })
                    }
                }
    
                const targetPost = await db.post.findOne({
                    where: {
                        id: data.id
                    },
                    include: [
                        {
                            model: db.media
                        },
                        {
                            model: db.like,
                            include: [
                                {
                                    model: db.user,
                                    attributes: {
                                        exclude: ['username', 'password', 'detail']
                                    }
                                }
                            ]
                        },
                        {
                            model: db.comment,
                            include: [
                                {
                                    model: db.user,
                                    attributes: {
                                        exclude: ['username', 'password', 'detail']
                                    }
                                }
                            ]
                        },
                    ]
                });
    
                return res.status(200).send(targetPost)
            });             
        })
    } catch (err) {
        err.from = 'createPost';
        next(err);
    }
}

const getAllPost = async (req, res, next) => {
    try {
        const offset = +req.params.offset;

        const targetPost = await db.post.findAndCountAll({
            include: [
                {
                    model: db.media
                },
                {
                    model: db.like,
                    include: [
                        {
                            model: db.user,
                            attributes: {
                                exclude: ['username', 'password', 'detail']
                            }
                        }
                    ]
                },
                {
                    model: db.comment,
                    include: [
                        {
                            model: db.user,
                            attributes: {
                                exclude: ['username', 'password', 'detail']
                            }
                        }
                    ]
                },
            ],
            order: [
                ['id', 'DESC']
            ],
            distinct: true,
            limit: 24,
            offset: offset,
        })

        return res.status(200).send(targetPost)

    } catch (err) {
        err.from = 'getUserPost';
        next(err);
    }
}

const getPostByQuery = async (req, res, next) => {
    try {
        const query = req.params.query;
        const offset = +req.params.offset;
        
        const targetUser = await db.user.findAll({
            where: {
                profileName: {
                    [Op.like]: `%${query}%`
                }
            }
        });

        const idArr = [];

        for(let user of targetUser) {
            idArr.push(user.id);
        }

        const targetPost = await db.post.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        userId: idArr
                    },
                    {
                        title: {
                            [Op.like]: `%${query}%`
                        }
                    }
                ]
            },
            include: [
                {
                    model: db.media
                },
                {
                    model: db.like,
                    include: [
                        {
                            model: db.user,
                            attributes: {
                                exclude: ['username', 'password', 'detail']
                            }
                        }
                    ]
                },
                {
                    model: db.comment,
                    include: [
                        {
                            model: db.user,
                            attributes: {
                                exclude: ['username', 'password', 'detail']
                            }
                        }
                    ]
                },
            ],
            order: [
                ['id', 'DESC']
            ],
            distinct: true,
            limit: 24,
            offset: offset,
        })

        return res.status(200).send(targetPost)

    } catch (err) {
        err.from = 'getUserPost';
        next(err);
    }
}

const getUserPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const offset = +req.params.offset;

        const targetPost = await db.post.findAndCountAll({
            where: {
                userId: id
            },
            include: [
                {
                    model: db.media
                },
                {
                    model: db.like,
                    include: [
                        {
                            model: db.user,
                            attributes: {
                                exclude: ['username', 'password', 'detail']
                            }
                        }
                    ]
                },
                {
                    model: db.comment,
                    include: [
                        {
                            model: db.user,
                            attributes: {
                                exclude: ['username', 'password', 'detail']
                            }
                        }
                    ]
                },
            ],
            order: [
                ['id', 'DESC']
            ],
            distinct: true,
            limit: 24,
            offset: offset,
        })

        return res.status(200).send(targetPost)

    } catch (err) {
        err.from = 'getUserPost';
        next(err);
    }
}

const getUserTagPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const offset = +req.params.offset;

        const targetTag = await db.tag.findAll({
            where: {
                type: 'POST',
                userId: id
            }
        })

        if(targetTag[0]) {
            const targetPost = await db.post.findAndCountAll({
                where: {
                    id: targetTag.map(e => e.postId)
                },
                include: [
                    {
                        model: db.media
                    },
                    {
                        model: db.like,
                        include: [
                            {
                                model: db.user,
                                attributes: {
                                    exclude: ['username', 'password', 'detail']
                                }
                            }
                        ]
                    },
                    {
                        model: db.comment,
                        include: [
                            {
                                model: db.user,
                                attributes: {
                                    exclude: ['username', 'password', 'detail']
                                }
                            }
                        ]
                    },
                ],
                order: [
                    ['id', 'DESC']
                ],
                distinct: true,
                limit: 24,
                offset: offset,
            });

            return res.status(200).send(targetPost)
    
        } else {
            return res.status(200).send({count: 0, rows: []});
        }   

    } catch (err) {
        err.from = 'getUserTagPost';
        next(err);
    }
}

const getPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
    
        const targetPost = await db.post.findOne({
            where: {
                id: postId
            },
            include: [
                {
                    model: db.media
                },
                {
                    model: db.user,
                    attributes: {
                        exclude: ['username', 'password', 'detail']
                    }
                },
                {
                    model: db.like,
                    include: [
                        {
                            model: db.user,
                            attributes: {
                                exclude: ['username', 'password', 'detail']
                            }
                        }
                    ]
                },
                {
                    model: db.comment,
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
        })

        if(!targetPost) {
            return res.status(404).send();
        }

        const targetLike = await db.like.findOne({
            where: {
                userId: userId,
                postId: postId
            }
        })

        const isLiked = targetLike? true : false ;

        return res.status(200).send({post: targetPost, isLiked: isLiked});

    } catch (err) {
        err.from = 'getPost';
        next(err);
    }
}

const likePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const targetPost = await db.post.findOne({where: {id: postId}});

        const targetLike = await db.like.findOne({
            where:{
                userId: userId,
                postId: postId
            }
        })

        if(!targetPost) {
            return res.status(404).send('not found post');
        }

        if(targetLike) {
            return res.status(400).send("You already liked this post");
        }

        await db.like.create({
            userId: userId,
            postId: postId
        })

        return res.status(201).send('Done');
    } catch (err) {
        err.from = 'likePost';
        next(err)
    }
}

const unlikePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const targetPost = await db.post.findOne({where: {id: postId}});
        const targetLike = await db.like.findOne({
            where:{
                userId: userId,
                postId: postId
            }
        });

        if(!targetPost) {
            return res.status(404).send('not found post');
        }

        if(!targetLike) {
            return res.status(400).send("You haven't liked this post.");
        }

        await db.like.destroy({
            where: {
                userId: userId,
                postId: postId
            }
        });

        return res.status(201).send('Done');
    } catch (err) {
        err.from = 'likePost';
        next(err)
    }
}

const deletePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const targetPost = await db.post.findOne({where: {id: postId}});

        if(!targetPost) {
            return res.status(400).send();
        }

        if(targetPost.userId !== userId) {
            return res.status(401).send();
        }

        await db.post.destroy({where: {id: postId}});

        return res.status(200).send('Done!');

    }  catch (err) {
        err.from = 'deletePost';
        next(err);
    }
}

module.exports = {
    createPost,
    getUserPost,
    getPost,
    likePost,
    unlikePost,
    deletePost,
    getAllPost,
    getPostByQuery,
    getUserTagPost
}