module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('comment', {
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    },
    {
        tableName: 'comment',
        underscored: true,
        timestamps: true, 
    });

    model.associate = models => {
        model.belongsTo(models.post, {
            foreignKey: {
                name: 'postId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.belongsTo(models.user, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.hasMany(models.tag, {
            foreignKey: 'commentId', 
            onDelete: 'CASCADE'
        });
    }

    return model
}