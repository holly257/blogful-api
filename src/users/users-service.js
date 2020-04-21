const UsersService = {
    getAllUsers(db) {
        return db.select('*').from('blogful_users')
    },

    insertUser(db, newUser) {
        return db.insert(newUser).into('blogful_users')
            .returning('*').then(rows => {
                return rows[0]
            })
    },

    getById(db, id) {
        return db.from('blogful_users').sselect('*')
            .where('id', id).first()
    },

    deleteUser(db, id) {
        return db('blogful_users').where({ id }).delete()
    },

    updateUser(db, id, newUserFields) {
        return db('blogful_users').where({ id }).update(newUserFields)
    },
}

module.exports = UsersService