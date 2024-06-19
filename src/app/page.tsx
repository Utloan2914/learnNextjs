"use client";

import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from './services/api';
import './styles.css';

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ title: '', description: '', image: '' });
  const [updateProductData, setUpdateProductData] = useState({ id: '', title: '', description: '', image: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Error fetching products');
    }
  };

  const handleCreate = async () => {
    try {
      await createProduct(newProduct);
      setNewProduct({ title: '', description: '', image: '' });
      fetchProducts();
      setError('');
    } catch (err) {
      setError('Error creating product');
    }
  };

  const handleUpdate = async () => {
    try {
      const { id, title, description, image } = updateProductData;
      await updateProduct(id, { title, description, image });
      setUpdateProductData({ id: '', title: '', description: '', image: '' });
      fetchProducts();
      setError('');
    } catch (err) {
      setError('Error updating product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts();
      setError('');
    } catch (err) {
      setError('Error deleting product');
    }
  };

  const handleUpdateFormOpen = (product: any) => {
    setUpdateProductData({
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image,
    });
  };

  const handleUpdateFormCancel = () => {
    setUpdateProductData({ id: '', title: '', description: '', image: '' });
  };

  return (
    <div className="container">
   
      <h1>Home page</h1>
      <h4>Product List</h4>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <input
          type="text"
          placeholder="Title"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <button className="btn add" onClick={handleCreate}>Add Product</button>
      </div>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-details">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <div className={updateProductData.id === product.id ? "update-form active" : "update-form"}>
                <input
                  type="text"
                  placeholder="New Title"
                  value={updateProductData.title}
                  onChange={(e) => setUpdateProductData({ ...updateProductData, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="New Description"
                  value={updateProductData.description}
                  onChange={(e) => setUpdateProductData({ ...updateProductData, description: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="New Image URL"
                  value={updateProductData.image}
                  onChange={(e) => setUpdateProductData({ ...updateProductData, image: e.target.value })}
                />
                <button className="btn update" onClick={handleUpdate}>Update</button>
                <button className="btn cancel" onClick={handleUpdateFormCancel}>Cancel</button>
              </div>
              <button className="btn update" onClick={() => handleUpdateFormOpen(product)}>Update</button>
              <button className="btn delete" onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
