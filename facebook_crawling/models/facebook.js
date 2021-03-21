module.exports = (sequelize, Seauelize) => {
    return sequelize.define('facebook', {
        name : {
            type:Seauelize.STRING(30),
            allowNull: false
        },
        content : {
            type:Seauelize.TEXT,
            allowNull: true
        },
        img : {
            type:Seauelize.TEXT,
            allowNull: true
        }
    })
}