import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { healthCheck } from "./lib/api";

const HealthCheckPage = () => {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthCheck();
        if (response.status === 200) {
          setStatus("ok");
        } else {
          setStatus("error");
          setError(`API returned status ${response.status}`);
        }
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="p-6 text-center">
      <Helmet>
        <title>Health Check - YoutubeClone</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">API Health Check</h1>
      <p>Status: {status === "loading" ? "Checking..." : status}</p>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </div>
  );
};

export default HealthCheckPage;
