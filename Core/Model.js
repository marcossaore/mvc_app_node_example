'use strict';

const MySqlConnect = require("./MySqlConnect")
const Connect = require("./Connect")
const Message = require("./Message")

var query = null;
var order = null;
var limit = null;
var offset = null;
var connectionInterface = null

var entity;
var protect;
var required;

class Model {

    constructor(ent, protcd, req, session) {
        entity = ent
        protect = ['created_at', "updated_at"] + protcd
        required = req
        this.Message = new Message(session)
        connectionInterface = Connect.getInstance(new MySqlConnect());
    }

    set Data(data) {
        this.data = data
    }

    get Data() {
        return this.data[entity] || null;
    }

    set Size(size) {
        this.size = size
    }

    get Size() {
        return this.size || 0
    }

    set Fail(fail) {
        this.fail = fail
    }

    get Fail() {
        return this.fail
    }

    get Message() {
        return this.message
    }

    set Message(message) {
        this.message = message
    }

    find(columns = "*") {
        query = `SELECT ${columns} FROM ${entity}`;
        return this
    }

    order(columnsToOrder) {
        order = ` ORDER BY ${columnsToOrder}`;
        return this
    }

    limit(l) {
        limit = ` LIMIT ${l}`
        return this
    }

    offset(offToSet) {
        offset = ` OFFSET ${offToSet}`
        return this
    }

    async findById(id, columns = "*") {
        let find = this.find(columns).andWhere({ id })
        find = await find.fetch();
        return find;
    }

    andWhere(terms) {

        let stringTerms = ` WHERE`;

        let entries = Object.entries(terms)

        entries.forEach((element, keyElement) => {

            if (keyElement > 0) {
                stringTerms += " AND"
            }

            let key = element[0];
            let value = element[1];

            stringTerms += ` ${key} = '${value}'`

        });

        query += stringTerms;

        return this;
    }


    orWhere(terms) {

        let stringTerms = ` WHERE`;

        let entries = Object.entries(terms)

        entries.forEach((element, keyElement) => {

            if (keyElement > 0) {
                stringTerms += " OR"
            }

            let key = element[0];
            let value = element[1];

            stringTerms += ` ${key} = '${value}'`

        });

        query += stringTerms;

        return this;
    }



    async count() {
        this.Size = 0;
        await this.fetch(true)
        return this.Size
    }

    create(data) {

        return new Promise((resolve, rejected) => {

            let columns = (Object.keys(data)).join(", ")
            let values = (Object.values(data)).join("', '")

            connectionInterface.query(`INSERT INTO ${entity} (${columns}) VALUES ('${values}')`, (err, results, fields) => {

                if (err) {
                    this.Fail = err;
                    return null;
                }

                return resolve({ lastInsertId: results.insertId })
            })

        }).then((response) => {
            this.traitResponse(response);
        }).catch((error) => {
            this.Fail = error;
        })

    }


    update(data, terms) {

        return new Promise((resolve, rejected) => {

            let entries = Object.entries(data);

            let updateColumns = "";

            entries.forEach((element, keyOfElement) => {

                let key = element[0]
                let value = element[1]

                updateColumns += ` ${key} = '${value}'` + ((entries.length - 1) != keyOfElement ? ", " : " ")
            })

            connectionInterface.query(`UPDATE ${entity} SET ${updateColumns} WHERE ${terms}`, (err, results, fields) => {

                console.log("results ", results)

                if (err) {
                    this.Fail = err;
                    return null;
                }

                return resolve({ lastInsertId: results.insertId })
            })

        }).then((response) => {
            this.traitResponse(response);
        }).catch((error) => {
            this.Fail = error;
        })

    }

    delete(terms) {

        let whereTerms = "";

        if (typeof (terms) != "object") {
            whereTerms = terms;
        } else {
            let entries = Object.entries(terms)

            entries.forEach((element, key) => {

                if (key > 0) {
                    whereTerms += " AND"
                }

                let column = element[0]
                let value = element[1]

                whereTerms += ` ${column} = '${value}'`

            })
        }

        return new Promise((resolve, rejected) => {
            connectionInterface.query(`DELETE FROM ${entity} WHERE ${whereTerms}`, (err, results, fields) => {
                if (!err) {
                    return resolve(results.affectedRows > 0 ? true : false);
                }
            })
        })


    }

    async destroy() {
        if (!this.Data.id) {
            return false
        }

        let destroy = await this.delete({ id: this.Data.id })
        return destroy
    }

    async save() {

        if (!this.required()) {
            this.Message.warning("Preencha todos os campos")
            return false
        }

        /**
         * UPDATE
         */
        if (this.Data.id) {
            let id = this.Data.id
            await this.update(this.safe(), `id = ${id}`)
            if (this.Fail) {
                this.Message.error("Erro ao cadastrar, verifique os dados")
                return false
            }
        }

        /**
         * CREATE
         */
        if (this.Data || this.Data.id) {
            let { lastInsertId } = await this.create(this.safe())
            if (this.Fail) {
                this.Message.error("Erro ao cadastrar, verifique os dados")
                return false
            }
        }

        await this.findById(lastInsertId)

    }

    fetch(all = false) {

        return new Promise((resolve, rejected) => {
            connectionInterface.query(query + order + limit + offset, (err, results, fields) => {

                if (!all) {
                    return resolve({
                        err,
                        results: results[0],
                        fields
                    });
                } else {
                    return resolve({
                        err,
                        results,
                        fields,
                        all: true
                    });
                }
            })
        }).then((response) => {
            this.traitResponse(response)
        })
    }

    traitResponse(response) {

        let { results, err, fields, all } = response;

        if (err) {
            this.Fail = err;
            return null;
        }

        let entityObject = {};
        entityObject[entity] = [];

        if (!all) {

            this.Size = 1;

            let entries = Object.entries(results)

            let data = {};

            entries.forEach((element) => {

                let key = element[0]
                let value = element[1]

                data[key] = value
            });

            entityObject[entity].push(data)
        } else {
            results.forEach((element) => {

                this.Size++

                let entries = Object.entries(element)

                let data = {};

                entries.forEach((element) => {

                    let key = element[0]
                    let value = element[1]

                    data[key] = value
                });

                entityObject[entity].push(data)
            })
        }

        this.Data = entityObject;
    }

    safe() {
        let data = this.Data;
        protect.forEach((field) => {
            if (data[field]) {
                delete data[field]
            }
        })

        return data
    }

    required() {
        let data = this.Data;
        required.forEach((field) => {
            if (!data[field]) {
                return false
            }
        })

        return true
    }

}

module.exports = Model