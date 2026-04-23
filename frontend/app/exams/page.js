'use client';

import { useEffect, useState } from 'react';
import { getOpportunities, createApplication } from '../../lib/api';
import OpportunityCard from '../../components/ui/OpportunityCard';
import { Search, Filter, GraduationCap, AlertCircle } from 'lucide-react';

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExams();
    fetchCategories();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await getOpportunities({ type: 'exam', search, category });
      setExams(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getOpportunities({ type: 'exam' });
      const uniqueCats = [...new Set(res.data?.map(e => e.category).filter(Boolean))];
      setCategories(uniqueCats);
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
    fetchExams();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-navy" />
            <h1 className="text-3xl font-bold text-navy">Competitive Exams</h1>
          </div>
          <p className="text-gray-600">Stay updated with UPSC, SSC, Banking, Railway, and all competitive exam notifications.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary px-6 flex items-center justify-center gap-2">
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
            <div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full"></div>
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No exams found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map(exam => (
              <OpportunityCard key={exam.id} opportunity={exam} onApply={handleApply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
