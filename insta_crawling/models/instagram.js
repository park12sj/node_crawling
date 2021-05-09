module.exports = (sequelize, Seauelize) => {
    return sequelize.define('instagrams', {
        postId : {
            type:Seauelize.STRING(200),
            allowNull: false,
            unique: true
        },
        media : {
            type:Seauelize.TEXT,
            allowNull: false
        },
        content : {
            type:Seauelize.TEXT,
            allowNull: true
        },
        writer : {
            type:Seauelize.TEXT,
            allowNull: true
        }
    })
}