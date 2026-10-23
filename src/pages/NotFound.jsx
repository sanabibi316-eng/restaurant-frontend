import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="text-center animate-slide-up">
        <h1 className="text-8xl font-black bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-slate-400 text-lg mt-4 mb-8">Page not found. It might have been removed.</p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <FiHome /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;