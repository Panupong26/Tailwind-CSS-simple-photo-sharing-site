module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('follower', {},
    {
        tableName: 'follower',
        underscored: true,
        timestamps: false, 
    });

    model.associate = models => {

        model.belongsTo(models.user, {
            as: 'Accepter',
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        model.belongsTo(models.user, {
            as: 'Requester',
            foreignKey: {
                name: 'followerId',
                allowNull: false
            }, 
            onDelete: 'CASCADE'
        });
    }

    return model
}