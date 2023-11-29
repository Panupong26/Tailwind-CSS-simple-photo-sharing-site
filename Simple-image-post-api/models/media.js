module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('media', {
        type: {
            type: DataTypes.ENUM('IMAGE', 'VIDEO'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        url: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'media',
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
    }


    return model
}