const db = require('../config/config');
const Evento = {};
Evento.create = (evento) =>{
    const sql =`
        INSERT INTO
            eventos(
                name,
                description,
                image1,
                image2,
                image3,
                id_category,
                created_at,
                updated_at
            )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;
    return db.oneOrNone(sql, [
        evento.name,
        evento.description,
        evento.image1,
        evento.image2,
        evento.image3,
        evento.id_category,
        new Date(),
        new Date()
    ]);
}

Evento.findByCategory = (id_category) => {
    const sql = `
    SELECT
        e.id,
        e.name,
        e.description,
        e.image1,
        e.image2,
        e.image3,
        e.id_category
    FROM
	    eventos as e
    INNER JOIN
	    categories AS c ON e.id_category = c.id
    WHERE
	    c.id = $1
    `;
    return db.manyOrNone(sql, id_category);
}

Evento.findByCategoryAndName = (id_category, name) => {
    const sql = `
    SELECT
        e.id,
        e.name,
        e.description,
        e.image1,
        e.image2,
        e.image3,
        e.id_category
    FROM
	    eventos as e
    INNER JOIN
	    categories AS c ON e.id_category = c.id
    WHERE
	    c.id = $1 and e.name ILIKE $2
    `;
    return db.manyOrNone(sql, [id_category, `%${name}%`]);
}


Evento.update = (evento) => {
    const sql = `
        UPDATE
            eventos
        SET
            name = $2,
            description = $3,
            image1 = $4,
            image2 = $5,
            image3 = $6,
            id_category = $7,
            updated_at = $8
        WHERE
            id = $1
    `;
    return db.none(sql, [
        evento.id,
        evento.name,
        evento.description,
        evento.image1,
        evento.image2,
        evento.image3,
        evento.id_category,
        new Date()
    ]);
}


module.exports = Evento;