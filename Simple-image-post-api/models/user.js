module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('user', {
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        profileName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        profileImage: {
            type: DataTypes.STRING(255),
            unique: true,
        },
        detail: {
            type: DataTypes.STRING(255)
        }
    },
    {
        tableName: 'user',
        underscored: true,
        timestamps: false, 
    });

 
    model.associate = models => {
        model.hasMany(models.follower, {
            as: 'Accepter',
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        model.hasMany(models.follower, {
            as: 'Requester',
            foreignKey: {
                name: 'followerId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.comment, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.like, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.post, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.tag, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
    }

    return model
}