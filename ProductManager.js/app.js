const fs = require('fs');

class ProductManager {
    constructor(ruta) {
        this.ruta = ruta;
    }

    async agregarProducto(producto) {
        try {
            const productos = await this.obtenerProductos();
            const nuevoProducto = {
                id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
                ...producto
            };
            productos.push(nuevoProducto);
            await this.guardarProductos(productos);
            return nuevoProducto.id;
        } catch (error) {
            throw new Error('Error al agregar producto: ' + error.message);
        }
    }

    async obtenerProductos() {
        try {
            const datos = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(datos);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // El archivo aun no existe, devuelve un array vacío
                return [];
            }
            throw new Error('Error al leer productos: ' + error.message);
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const productos = await this.obtenerProductos();
            return productos.find(producto => producto.id === id);
        } catch (error) {
            throw new Error('Error al obtener producto por ID: ' + error.message);
        }
    }

    async actualizarProducto(id, camposActualizados) {
        try {
            const productos = await this.obtenerProductos();
            const indice = productos.findIndex(producto => producto.id === id);
            if (indice !== -1) {
                productos[indice] = { ...productos[indice], ...camposActualizados };
                await this.guardarProductos(productos);
                return true;
            }
            return false;
        } catch (error) {
            throw new Error('Error al actualizar producto: ' + error.message);
        }
    }

    async eliminarProducto(id) {
        try {
            let productos = await this.obtenerProductos();
            productos = productos.filter(producto => producto.id !== id);
            await this.guardarProductos(productos);
            return true;
        } catch (error) {
            throw new Error('Error al eliminar producto: ' + error.message);
        }
    }

    async guardarProductos(productos) {
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify(productos, null, 2));
        } catch (error) {
            throw new Error('Error al guardar productos: ' + error.message);
        }
    }
}

module.exports = ProductManager;
