const db = require('../config/config');
const crypto = require('crypto');
const User = {};

User.getAll = () => {
    const sql = `
    select 
        * 
    from 
        users`;

    return db.manyOrNone(sql);
}

User.findById = (id, callback) => {
    const sql = `
    SELECT
	id,
    id_rol,
	matricula,
	name,
	lastname,
	image,
	phone,
	password,
	session_token
FROM
    users
WHERE
	id = $1`;
return db.oneOrNone(sql, id).then(user => { callback(null, user);})
}

User.findByMatricula = (matricula) => {
    const sql = `
    SELECT
	a.id,
    a.id_rol,
	a.matricula,
	a.name,
	a.lastname,
	a.image,
	a.phone,
	a.password,
	a.session_token,
    a.identifier,
	json_agg(
		json_build_object(
			'id', r.id,
			'name', r.name,
			'image', r.image,
			'route', r.route
		)
	) as roles
FROM
    users as a
inner join roles as r on (r.id = a.id_rol)
WHERE
    a.matricula = $1
GROUP BY
	a.id`;
return db.oneOrNone(sql, matricula);
}

User.findByUserId = (id) => {
    const sql = `
    SELECT
	a.id,
    a.id_rol,
	a.matricula,
	a.name,
	a.lastname,
	a.image,
	a.phone,
	a.password,
	a.session_token,
	json_agg(
		json_build_object(
			'id', r.id,
			'name', r.name,
			'image', r.image,
			'route', r.route
		)
	) as roles
FROM
    users as a
inner join roles as r on (r.id = a.id_rol)
WHERE
    a.id = $1
GROUP BY
	a.id`;
return db.oneOrNone(sql, id);
}

User.create = (user) => {
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;
    const sql = `
    INSERT INTO
        users(
            id_rol,
            matricula,
            name,
            lastname,
            phone,
            image,
            password,
            created_at,
            updated_at,
            identifier
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
    `;
    return db.oneOrNone(sql, [
        user.id_rol,
        user.matricula,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.password,
        new Date(),
        new Date(),
        user.identifier
    ]);
}

User.update = (user) => {
    const sql = `
    UPDATE
        users
    SET
        name = $2,
        lastname = $3,
        phone = $4,
        image = $5,
        updated_at = $6
    WHERE
        id = $1
    `;
    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);
}

User.updateToken = (id, token) => {
    const sql = `
    UPDATE
        users
    SET
        session_token = $2
    WHERE
        id = $1
    `;
    return db.none(sql, [
        id,
        token
    ]);
}

User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if(myPasswordHashed === hash){
        return true;
    }
    return false;
}

module.exports = User;