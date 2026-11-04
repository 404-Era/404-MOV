import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { MovieHubPage } from './pages/MovieHubPage';

export function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Check if route matches /movie/:id
  const movieMatch = currentPath.match(/^\/movie\/([a-zA-Z0-9-_]+)$/);

  if (movieMatch) {
    const movieId = movieMatch[1];
    return <MovieHubPage movieId={movieId} onNavigateHome={() => navigateTo('/')} />;
  }

  return <HomePage />;
}

export default App;
