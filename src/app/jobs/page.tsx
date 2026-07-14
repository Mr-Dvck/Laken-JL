"use client";

import { useState } from "react";
import { Job } from "@/types";
import JobCard from "@/components/JobCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Search, SlidersHorizontal, MapPin, X, Heart } from "lucide-react";

export default function JobsPage() {
  const [query, setQuery] = useState("data entry");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [page, setPage] = useState(1);

  async function handleSearch(e?: React.FormEvent, newPage = 1) {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSelectedJob(null);

    try {
      const params = new URLSearchParams({
        what: query || "data entry",
        page: String(newPage),
      });
      if (location) params.set("where", location);

      const res = await fetch(`/api/jobs/search?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setJobs(data.jobs);
      setTotal(data.total);
      setSearched(true);
      setPage(newPage);
    } catch (err: any) {
      setError(err.message || "Failed to fetch jobs. Try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          🔍 Find Your Next Role
        </h1>
        <p className="text-gray-500">
          Let&apos;s find the perfect data entry job for you, Laken!
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={(e) => handleSearch(e, 1)} className="card mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title or keyword..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or state (optional)"
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search size={18} />
            Search
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            "data entry",
            "data entry clerk",
            "administrative assistant",
            "office assistant",
            "remote data entry",
          ].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setQuery(term);
                // Auto-search after quick filter
              }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all
                ${query === term
                  ? "bg-laken-100 text-laken-700 border border-laken-200"
                  : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-pink-50 hover:text-laken-600"
                }`}
            >
              {term}
            </button>
          ))}
        </div>
      </form>

      {/* Results */}
      {loading && <LoadingSpinner text="Searching for the best jobs for you..." />}

      {error && (
        <div className="card border-red-200 bg-red-50 text-center">
          <p className="text-red-600 mb-2">😕 {error}</p>
          <button onClick={() => handleSearch()} className="btn-secondary text-sm">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && searched && jobs.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-4xl mb-4">🔎</p>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-4">
            Try different keywords or remove the location filter, Laken!
          </p>
          <button
            onClick={() => {
              setLocation("");
              setQuery("data entry");
            }}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      )}

      {jobs.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Found <span className="font-semibold text-laken-600">{total.toLocaleString()}</span>{" "}
            jobs — showing page {page}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => handleSearch(undefined, page - 1)}
              disabled={page <= 1}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              onClick={() => handleSearch(undefined, page + 1)}
              disabled={jobs.length < 20}
              className="btn-primary text-sm disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedJob.title}</h2>
                <p className="text-gray-500">{selectedJob.company} · {selectedJob.location}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-600 mb-6"
              dangerouslySetInnerHTML={{ __html: selectedJob.description.replace(/\n/g, "<br/>") }}
            />
            <div className="flex gap-3">
              <a
                href={selectedJob.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 justify-center"
              >
                <Heart size={18} /> Apply Now
              </a>
              <button
                onClick={() => setSelectedJob(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
