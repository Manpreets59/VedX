const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchQuery = async (query) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/search/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      return await res.json();
    } catch (error) {
      throw new Error('Failed to fetch search results');
    }
  };