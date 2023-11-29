const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
require("dotenv").config();

const createUser = async (req, res, next) => {
    try {
        const input = req.body.input;

        if(!input.username || !input.password) {
            return res.status(400).send({message: 'Invalide request value'});
        }
    
        if(!(/^[a-zA-Z0-9]{6,30}$/.test(input.username)) || !(/^[a-zA-Z0-9]{6,30}$/.test(input.password))) {
            return res.status(400).send({message: 'Invalide request value'});
        } 

        const sameUsername = await db.user.findOne({
            where: {username: input.username}
        })

        if(sameUsername) {
            return res.status(400).send({message: 'มีผู้อื่นใช้ชื่อนี้แล้ว'});
        }

        const salt = bcrypt.genSaltSync(12);
    
        await db.user.create({
            username: input.username,
            password: bcrypt.hashSync(input.password, salt),
            profileName: input.username
        })

        return res.status(201).send({message: 'Succesful!!'});

    } catch (err) {
        err.from = 'createUser'
        return next(err);
    }
}

const login = async (req, res, next) => {
    try {
        const input = req.body.input;

        if(!input.username || !input.password) {
            return res.status(400).send({message: 'Username or password is undefined'});
        }
    
        const targetUser = await db.user.findOne({
            where: {username: input.username}
        })
    
        if(!targetUser) {
            return res.status(400).send({message: '"ชื่อผู้ใช้" หรือ "รหัสผ่าน" ไม่ถูกต้อง'}); 
        }
    
        const isPasswordCorrect = bcrypt.compareSync(input.password, targetUser.password);
     
        if(!isPasswordCorrect) {
            return res.status(400).send({message: '"ชื่อผู้ใช้" หรือ "รหัสผ่าน" ไม่ถูกต้อง'}); 
        }
    
        const payload = {
            userId: targetUser.id
        }
    
        const token = jwt.sign(payload, process.env.JWT_SECRETKEY, {expiresIn: +process.env.JWT_EXP});
   
        return res.status(200).send(token);

    } catch (err) {
        err.from = 'userLogin'
        return next(err);
    }
}

const getMe = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const targetUser = await db.user.findOne({
            where: {
                id: userId
            },
            include: [
                {
                    model: db.post,
                    attributes: {
                        include: ['id']
                    }
                },
                {
                    model: db.follower,
                    as: 'Accepter',
                    include: [
                        {
                            model: db.user,
                            as: 'Requester',
                            attributes: {
                                exclude: ['password']
                            }
                        }
                    ]
                },
                {
                    model: db.follower,
                    as: 'Requester',
                    include: [
                        {
                            model: db.user,
                            as: 'Accepter',
                            attributes: {
                                exclude: ['password']
                            }
                        }
                    ]
                }
            ]
        })

        return res.status(200).send(targetUser);
        
    } catch (err) {
        err.from = 'getMe'
        return next(err);
    }
}

const removeUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const targetUser =  await db.user.findOne({
            where: {id: userId}
        })

        if(!targetUser) {
            return res.status(401).send();
        }

        const targetPost = await db.post.findAll({where: {userId: userId}});

        if(targetPost[0]) {
            const targetImages = await db.media.findAll({where: {postId: targetPost.map(e => e.id)}});

            const destroy = targetImages.map(async e => {
                return cloudinary.v2.uploader.destroy(e.url.split('/')[e.url.split('/').length -1].split('.')[0]).catch(err => {throw err});
            });

            if(targetUser.profileImage) {
                const destroyImg = cloudinary.v2.uploader.destroy(targetUser.profileImage.split('/')[targetUser.profileImage.split('/').length -1].split('.')[0]).catch(err => {throw err});
                destroy.push(destroyImg);
            }

            Promise.all(destroy).then(async() => {        
                await db.user.destroy({
                    where: {
                        id: userId
                    }
                })
            
                return res.status(200).send({message: 'Account has been removed'});
            })
        } else {
            await db.user.destroy({
                where: {
                    id: userId
                }
            })
        
            return res.status(200).send({message: 'The account has been removed'});
        }

    } catch (err) {
        err.from = 'removeUser'
        return next(err);
    }
}

const editProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const input = JSON.parse(req.body.input);

        if(!input.profileName) {
            return res.status(400).send({message: 'Invalide request value'});
        }

        const targetName = await db.user.findOne({
            where: {
                [Op.and]: [
                    {profileName: input.profileName},
                    {id: {
                        [Op.ne]: userId
                    }}
                ]   
            }
        })

        if(targetName) {
            return res.status(400).send({message: 'มีผู้ใช้ชื่อนี้แล้ว'});
        }

        await db.user.update({
            profileName: input.profileName,
            detail: input.detail
        },{
            where: {
                id: userId
            }
        })

        if(req.file) {
            const targetUser = await db.user.findOne({where: {id: userId}});
            if(targetUser.profileImage) {
                const publicId = targetUser.profileImage.split('/')[targetUser.profileImage.split('/').length - 1].split('.')[0];
                await cloudinary.v2.uploader.destroy(publicId)
                .catch((err) => {
                    throw err;
                });
            }

            await cloudinary.v2.uploader.upload(`Upload/profileimages/${req.file.filename}`,
                { public_id: req.file.filename.split('.')[0] }, 
                async (error, result) => {
                    if(error) {
                        throw error;
                    } else {
                        await db.user.update({
                            profileImage: result.url
                        },{
                            where: {
                                id: userId
                            }
                        });

                        fs.unlinkSync(`Upload/profileImages/${req.file.filename}`);
                    }
                }
            );
        }

        return res.status(200).send({message: 'Done'});
        
    } catch (err) {
        err.from = 'editProfile';
        return next(err);
    }
}

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const name = req.params.name;

        const targetUser = await db.user.findOne({
            where: {
                profileName: name
            },
            attributes: {
                exclude: ['password, username']
            },
            include: [
                {
                    model: db.post,
                    attributes: {
                        include: ['id']
                    }
                },
                {
                    model: db.follower,
                    as: 'Accepter',
                    include: [
                        {
                            model: db.user,
                            as: 'Requester',
                            attributes: {
                                exclude: ['password, username']
                            }
                        }
                    ]

                },
                {
                    model: db.follower,
                    as: 'Requester',
                    include: [
                        {
                            model: db.user,
                            as: 'Accepter',
                            attributes: {
                                exclude: ['password, username']
                            }
                        }
                    ]
                },
            ]
        });

        if(!targetUser) {
            res.status(404).send('User not found');
        }

        const isFollower = await db.follower.findOne({
            where: {
                userId: userId,
                followerId: targetUser.id
            }
        })

        const isAccepter = await db.follower.findOne({
            where: {
                userId: targetUser.id,
                followerId: userId
            }
        });


        res.status(200).send({user: targetUser, isFollower: !!isFollower, isAccepter: !!isAccepter});

    } catch (err) {
        err.from = 'getProfile';
        next(err);
    }
}

const getUserAutoComplete = async (req, res, next) => {
    try {
        const query = req.params.query;
        
        const targetUser = await db.user.findAll({
            where: {
                profileName: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: {
                exclude: ['password', 'username', 'detail']
            }
        });

        return res.status(200).send(targetUser);
    } catch (err) {
        err.from = 'getUserAutoComplete';
        next(err);
    }
}


module.exports = {
    createUser,
    login,
    getMe,
    removeUser,
    editProfile,
    getProfile,
    getUserAutoComplete
}