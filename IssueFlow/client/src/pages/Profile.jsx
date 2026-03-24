import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, GitPullRequest, AlertCircle, CheckCircle, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setProfileData(res.data);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profileData) return <div className="p-8 text-center text-xl">User not found.</div>;

  const { user, timeline } = profileData;

  const impactScore = (user.stats.issuesCreated * 2) + (user.stats.issuesSolved * 5) + (user.stats.prsSubmitted * 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg flex-shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.username}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{user.email} • GitHub: {user.githubUsername || 'Not linked'}</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Issues Created</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats.issuesCreated}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Issues Solved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats.issuesSolved}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">PRs Submitted</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats.prsSubmitted}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1 flex items-center justify-center md:justify-start">
                <Award className="w-4 h-4 mr-1" />
                Impact Score
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {impactScore}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issues Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 font-semibold text-gray-900 dark:text-white">
            Recent Issues
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {timeline.issues.length === 0 ? (
              <li className="p-6 text-center text-gray-500">No issues created yet.</li>
            ) : (
              timeline.issues.map(iss => (
                <li key={iss._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start">
                    {iss.status === 'open' ? <AlertCircle className="w-4 h-4 text-green-500 mt-1 mr-3 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 text-purple-500 mt-1 mr-3 flex-shrink-0" />}
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium mb-1">{iss.title}</p>
                      <p className="text-sm text-gray-500">in <Link to={`/repo/${iss.repository._id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">{iss.repository.name}</Link></p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* PRs Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 font-semibold text-gray-900 dark:text-white">
            Recent Pull Requests
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {timeline.prs.length === 0 ? (
              <li className="p-6 text-center text-gray-500">No pull requests submitted yet.</li>
            ) : (
              timeline.prs.map(pr => (
                <li key={pr._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start">
                    <GitPullRequest className={`w-4 h-4 mt-1 mr-3 flex-shrink-0 ${pr.status === 'approved' ? 'text-green-500' : pr.status === 'rejected' ? 'text-red-500' : 'text-gray-500'}`} />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium mb-1">{pr.title} <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full ml-2 border border-gray-200 dark:border-gray-700">{pr.status}</span></p>
                      <p className="text-sm text-gray-500">in <Link to={`/repo/${pr.repository._id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">{pr.repository.name}</Link></p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
