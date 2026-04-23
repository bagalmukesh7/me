'use client';

import { useEffect, useState } from 'react';
import { getOpportunities, createApplication } from '../../lib/api';
import OpportunityCard from '../../components/ui/OpportunityCard';
import { Search, Filter, Briefcase, AlertCircle } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [states, setStates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchStates();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getOpportunities({ type: 'job', search, state });
      setJobs(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await getOpportunities({ type: 'job' });
      const uniqueStates = [...new Set(res.data?.map(j => j.state).filter(Boolean))];
      setStates(uniqueStates);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApply = async (id) => {
    try {
      setError('');
      const res = await createApplication(id);
      if (res.data?.redirect_url) {
        window.open(res.data.redirect_url, '_blank');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-green" />
            <h1 className="text-3xl font-bold text-navy">Government Jobs</h1>
          </div>
          <p className="text-gray-600">Find the latest job openings across central government, state governments, PSUs, and more.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-transparent outline-none"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-transparent outline-none"
              >
                <option value="">All States</option>
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-green text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-green border-t-transparent rounded-full"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <OpportunityCard key={job.id} opportunity={job} onApply={handleApply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
