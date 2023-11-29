module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('like', {},
    {
        tableName: 'like',
        underscored: true,
        timestamps: false, 
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
    }


    return model
}