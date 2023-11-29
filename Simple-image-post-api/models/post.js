module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('post', {
        title: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: 'post',
        underscored: true,
        timestamps: true, 
    });

    model.associate = models => {
        model.belongsTo(models.user, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.comment, {
            foreignKey: {
                name: 'postId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.like, {
            foreignKey: {
                name: 'postId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.tag, {
            foreignKey: 'postId', 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.media, {
            foreignKey: {
                name: 'postId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
       
    }


    return model
}