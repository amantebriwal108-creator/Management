import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Star, AlertCircle } from 'lucide-react';

const RepositoryCard = ({ repo }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-2.5 rounded-xl">
            <Github className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <Link to={`/repo/${repo._id}`} className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 break-all">
              {repo.name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">By {repo.owner.username}</p>
          </div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 flex-grow">
        {repo.description || 'No description provided for this repository.'}
      </p>
      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-1.5">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">{repo.stars}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <AlertCircle className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Issues</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RepositoryCard;
