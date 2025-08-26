"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import ImageUploader from '../components/ImageUploader';
import HistoryTable from '../components/HistoryTable';
import SearchAndFilter from '../components/SearchAndFilter';

const API_URL = 'http://localhost:8000';

interface Filters {
  query?: string;
  startDate?: string;
}

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState<Filters>({});

  const pageSize = 10;

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_URL}/results`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('page_size', pageSize.toString());
      
      if (filters.query) url.searchParams.append('query', filters.query);
      if (filters.startDate) url.searchParams.append('start_date', filters.startDate);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Unable to load historical data');
      }
      const result = await response.json();
      setData(result.data);
      setTotalRecords(result.total_records);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      const response = await fetch(`${API_URL}/results/${imageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(errorDetail.detail || "Error deleting image");
      }
      fetchHistory();
      alert("Image deleted successfully!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  const handlePageChange = (delta: number) => {
    setPage((prevPage) => prevPage + delta);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleUpdateHistory = () => {
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, [page, filters]);

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Human Detection System</title>
        <meta name="description" content="Human detection and history tracking system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold text-center mb-8">Human Detection System</h1>

        <ImageUploader onUpdateHistory={handleUpdateHistory} />

        <h2 className="text-3xl font-bold text-center mt-12 mb-4">History of Image Processing</h2>
        <SearchAndFilter onFilter={handleFilterChange} />
        
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        
        {!loading && !error && (
          <>
            <HistoryTable data={data} onDelete={handleDelete} />
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={page === 1}
                className="bg-gray-200 text-gray-700 rounded-md p-2 hover:bg-gray-300 disabled:opacity-50"
              >
                Previous Page
              </button>
              <span>Page {page} / {Math.ceil(totalRecords / pageSize)}</span>
              <button
                onClick={() => handlePageChange(1)}
                disabled={page * pageSize >= totalRecords}
                className="bg-gray-200 text-gray-700 rounded-md p-2 hover:bg-gray-300 disabled:opacity-50"
              >
                Next Page
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
