import { productModel } from "../models/products.models.js";



export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
          page: parseInt(page),
          limit: parseInt(limit),
          sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : null, 
        };
   
   
        const filter = {};
        if (query === 'available') {
          filter.available = true;
        } else if (query === 'unavailable') {
          filter.available = false;
        } else if (query) {
          filter.category = query;
        }
        const products = await productModel.paginate(filter, options);
        const response = {
          status: 'success',
          payload: products.docs, 
          totalPages: products.totalPages,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
          nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        };
   
        res.status(200).json(response);
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
     }
    }

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productModel.findById(productId).exec();
    
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).send('Producto no existente');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el producto');
      }
    }

export const postProduct = async (req, res) => {
  try {
    const productData = req.body;
 
    const newProduct = new productModel(productData);
    await newProduct.save();

    res.status(201).send(newProduct);

  } catch (error) {
    if (error.code == 11000) {  
      return res.status(400).send({ error: "Producto ya creado con llave duplicada" })
  }

    console.error(error);
    res.status(500).send('Error al agregar el producto');
  }
}

export const putProductById = async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;

    await productModel.findByIdAndUpdate(productId, updatedFields).exec();
    res.status(200).send('Producto actualizado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el producto');
  }
}

export const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.pid;
    if(productId){
      await productModel.findByIdAndRemove(productId).exec();
      res.status(200).send('Producto eliminado correctamente');
  }
  res.status(404).send({ error: "Producto no encontrado" })
  } catch (error) {
    
    res.status(500).send('Error al eliminar el producto');
  }
}
