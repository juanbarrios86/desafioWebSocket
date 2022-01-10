class ContenedorMemoria {
    constructor() {
        this.elementos = []
        this.id = 0
    }

    listar(id) {
        const elemento = this.elementos.find(elem => elem.id == id)
    

        return elemento || { error: `elemento no encontrado` }
    }

    listarAll() {
        return [...this.elementos]  //devuelvo todos los elementos agregados en la matriz
    }

    guardar(elem) {
        const newElemento = { ...elem, id: ++this.id }
        this.elementos.push(newElemento)
        return newElemento
    }

    actualizar(elem, id) {
        const newElemento = { id: Number(id), ...elem }
        const index = this.elementos.findIndex(p => p.id == id)
        if (index !== -1) {
            this.elementos[index] = newElemento
            return newElemento
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    borrar(id) {
        const index = this.elementos.findIndex(elem => elem.id == id)
        if (index !== -1) {
            return this.elementos.splice(index, 1) //elimino el elemento
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    borrarAll() {
        this.elementos = []
    }
}

module.exports = ContenedorMemoria
