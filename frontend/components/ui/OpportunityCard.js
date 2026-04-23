'use client';

import Link from 'next/link';
import { Calendar, Building2, MapPin, ExternalLink } from 'lucide-react';

export default function OpportunityCard({ opportunity, onApply }) {
  const typeColors = {
    scheme: 'bg-saffron/10 text-saffron',
    exam: 'bg-navy/10 text-navy',
    job: 'bg-green/10 text-green',
  };

  const typeLabels = {
    scheme: 'Scheme',
    exam: 'Exam',
    job: 'Job',
  };

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[opportunity.type] || 'bg-gray-100 text-gray-600'}`}>
          {typeLabels[opportunity.type] || opportunity.type}
        </span>
        {opportunity.last_date && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(opportunity.last_date).toLocaleDateString('en-IN')}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-navy mb-2 line-clamp-2">{opportunity.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{opportunity.description}</p>

      <div className="space-y-1.5 mb-4 flex-grow">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 className="w-4 h-4 text-saffron" />
          {opportunity.organization}
        </div>
        {opportunity.state && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-navy" />
            {opportunity.state}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="flex-1 text-center py-2 border border-navy text-navy rounded-lg font-medium hover:bg-navy hover:text-white transition-all text-sm"
        >
          View Details
        </Link>
        {onApply && (
          <button
            onClick={() => onApply(opportunity.id)}
            className="flex-1 py-2 bg-navy text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm flex items-center justify-center gap-1"
          >
            Apply <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
