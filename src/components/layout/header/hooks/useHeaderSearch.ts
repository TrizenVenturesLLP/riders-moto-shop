import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHeaderSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Only navigate if there's a search query
    if (searchQuery.trim()) {
      // Navigate to search results with query and category
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(searchCategory)}`);
    }
    // If search query is empty, do nothing (don't navigate)
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
    handleSearch,
    handleKeyPress,
  };
};

