import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, GitPullRequest, AlertCircle, Plus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import IssueModal from '../components/IssueModal';
import PRModal from '../components/PRModal';

const RepoDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('issues');
  
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);

  const fetchRepoData = async () => {
    try {
      setLoading(true);
      const [repoRes, issuesRes, prsRes] = await Promise.all([
        api.get(`/repos/${id}`),
        api.get(`/issues/repo/${id}`),
        api.get(`/prs/repo/${id}`)
      ]);
      setRepo(repoRes.data);
      setIssues(issuesRes.data);
      setPrs(prsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load repository data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!repo) return <div className="p-8 text-center text-xl">Repository not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">{repo.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{repo.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>By {repo.owner.username}</span>
          <span>•</span>
          <span>{repo.stars} stars</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 flex items-center space-x-2 ${activeTab === 'issues' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Issues</span>
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">{issues.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('prs')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 flex items-center space-x-2 ${activeTab === 'prs' ? 'border-green-600 text-green-600 dark:text-green-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Pull Requests</span>
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">{prs.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {activeTab === 'issues' ? 'Open Issues' : 'Pull Requests'}
          </h2>
          {user && (
            <button
              onClick={() => activeTab === 'issues' ? setIsIssueModalOpen(true) : setIsPRModalOpen(true)}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === 'issues' ? 'New Issue' : 'New PR'}</span>
            </button>
          )}
        </div>

        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          <AnimatePresence>
            {activeTab === 'issues' && issues.map(issue => (
              <motion.li key={issue._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start">
                  {issue.status === 'open' ? (
                    <AlertCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{issue.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      #{issue._id.slice(-4)} opened by {issue.author?.username}
                    </p>
                    {issue.labels && issue.labels.map(lbl => (
                      <span key={lbl} className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full mr-2 mb-1 border border-blue-200 dark:border-blue-800/50">
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.li>
            ))}

            {activeTab === 'prs' && prs.map(pr => (
              <motion.li key={pr._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start">
                  <GitPullRequest className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${pr.status === 'approved' ? 'text-green-500' : pr.status === 'rejected' ? 'text-red-500' : 'text-gray-500'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{pr.title}</h3>
                      {user && repo.owner._id === user.id && pr.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button onClick={async () => { await api.put(`/prs/${pr._id}/status`, { status: 'approved' }); fetchRepoData(); }} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors font-medium">Approve</button>
                          <button onClick={async () => { await api.put(`/prs/${pr._id}/status`, { status: 'rejected' }); fetchRepoData(); }} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 transition-colors font-medium">Reject</button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      #{pr._id.slice(-4)} {pr.status} • by {pr.author?.username} {pr.issueId ? `• links #${pr.issueId.title}` : ''}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}

            {(activeTab === 'issues' && issues.length === 0) || (activeTab === 'prs' && prs.length === 0) ? (
              <li className="p-12 text-center text-gray-500 dark:text-gray-400">
                No {activeTab === 'issues' ? 'issues' : 'pull requests'} found.
              </li>
            ) : null}
          </AnimatePresence>
        </ul>
      </div>

      {isIssueModalOpen && <IssueModal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} repoId={id} onSuccess={fetchRepoData} />}
      {isPRModalOpen && <PRModal isOpen={isPRModalOpen} onClose={() => setIsPRModalOpen(false)} repoId={id} issues={issues.filter(i => i.status === 'open')} onSuccess={fetchRepoData} />}
    </div>
  );
};

export default RepoDetail;
