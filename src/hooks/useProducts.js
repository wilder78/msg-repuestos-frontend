import { useState, useEffect, useCallback } from "react";

// Helper interno para peticiones con Token
const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || null;

const authFetch = (url, options = {}) => {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resProducts, resCategories] = await Promise.all([
        authFetch("http://localhost:8080/api/products"),
        authFetch("http://localhost:8080/api/categories"),
      ]);

      if (!resProducts.ok || !resCategories.ok) {
        throw new Error("Error fetching data from server");
      }

      const dataProducts = await resProducts.json();
      const dataCategories = await resCategories.json();

      const productList = dataProducts.data || dataProducts.usuarios || dataProducts.content || dataProducts || [];
      const categoryList = dataCategories.data || dataCategories.roles || dataCategories || [];

      setProducts(productList);
      setCategories(categoryList);

      const map = {};
      categoryList.forEach((cat) => {
        map[cat.idCategoria || cat.id_categoria] = cat.nombreCategoria || cat.nombre_categoria;
      });
      setCategoryMap(map);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  return {
    products,
    setProducts,
    categories,
    categoryMap,
    loading,
    error,
    refresh: fetchProductsData,
    authFetch,
  };
};
