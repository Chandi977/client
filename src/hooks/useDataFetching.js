import { useState, useEffect } from "react";

/**
 * A custom hook for fetching data from an API.
 *
 * @param {Function} apiFunc - The API function to call for fetching data.
 * @param {Array} params - The parameters to pass to the API function.
 * @param {any} initialData - The initial state for the data.
 * @returns {{data: any, loading: boolean, error: string | null, setData: Function}}
 */
export const useDataFetching = (apiFunc, params = [], initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...params);
        setData(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
        console.error("Data fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [...params]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, setData };
};
