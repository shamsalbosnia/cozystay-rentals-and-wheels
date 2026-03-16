import { useState, useEffect, useMemo } from 'react';

interface PaginationOptions {
  defaultItemsPerPage?: number;
}

/**
 * Reusable pagination hook
 * Handles page state, items per page, and data slicing
 */
export const usePagination = <T>(
  data: T[], 
  options: PaginationOptions = {}
) => {
  const { defaultItemsPerPage = 10 } = options;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData,
    handlePageChange,
    handleItemsPerPageChange,
    setCurrentPage,
    setItemsPerPage,
    // Pagination info for display
    startIndex: Math.min((currentPage - 1) * itemsPerPage + 1, data.length),
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
    totalItems: data.length
  };
};