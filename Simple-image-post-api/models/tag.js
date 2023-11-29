module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('tag', {
        type: {
            type: DataTypes.ENUM('POST', 'COMMENT'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    },
    {
        tableName: 'tag',
        underscored: true,
        timestamps: false, 
    });

    model.associate = models => {
        model.belongsTo(models.user, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
        model.belongsTo(models.comment, {
            foreignKey: 'commentId', 
            onDelete: 'CASCADE'
        });
        model.belongsTo(models.post, {
            foreignKey: 'postId', 
            onDelete: 'CASCADE'
        });
    }


    return model
}