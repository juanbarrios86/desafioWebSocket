const { promises: fs } = require('fs')

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async listar(id) {
        const msjs = await this.listarAll()
        const msjbusq = msjs.find(o => o.id == id)
        return msjbusq
    }

    async listarAll() {
        try {
            const mensajes = await fs.readFile(this.ruta, 'utf-8')
            return JSON.parse(mensajes)
        } catch (error) {
            return []
        }
    }

    async guardar(obj) {
        const mensajes = await this.listarAll()

        let nuevoId
        if (mensajes.length == 0) {
            nuevoId = 1
        } else {
            nuevoId = mensajes[mensajes.length - 1].id + 1
        }

        const newObj = { ...obj, id: nuevoId }
        mensajes.push(newObj)

        try {
            await fs.writeFile(this.ruta, JSON.stringify(mensajes, null, 2))
            return nuevoId
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async actualizar(elem, id) {
        const mensajes = await this.listarAll()
        const index = mensajes.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            mensajes[index] = elem
            try {
                await fs.writeFile(this.ruta, JSON.stringify(mensajes, null, 2))
            } catch (error) {
                throw new Error(`Error al borrar: ${error}`)
            }
        }
    }

    async borrar(id) {
        const mensajes = await this.listarAll()
        const index = mensajes.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }

        mensajes.splice(index, 1)
        try {
            await fs.writeFile(this.ruta, JSON.stringify(mensajes, null, 2))
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async borrarAll() {
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}

module.exports = ContenedorArchivo