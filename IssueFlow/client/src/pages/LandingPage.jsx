import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, GitPullRequest, Layout, Activity } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl max-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Manage Issues with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Flow</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Simulate the open-source contribution workflow. Browse repositories, submit issues, and create mock pull requests instantly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Get Started for Free
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-gray-900 dark:text-white font-bold text-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 block"
            >
              View Repositories
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-950 py-24 px-4 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Layout, title: "Modern Dashboard", desc: "View projects and track overall contribution health from a beautiful dashboard." },
              { icon: GitPullRequest, title: "Pull Requests", desc: "Simulate submitting pull requests, linking them to active issues effortlessly." },
              { icon: Activity, title: "Activity Tracking", desc: "Track your impact over time with automated contribution statistics and profiles." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-colors"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
                  <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
