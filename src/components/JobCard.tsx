import { Job } from "@/types";
import { formatSalary, timeAgo, truncate } from "@/lib/utils";
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  ExternalLink,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  return (
    <div
      className="card group cursor-pointer hover:border-laken-300"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 group-hover:text-laken-600 transition-colors mb-1">
            {truncate(job.title, 80)}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Building2 size={14} />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {timeAgo(job.posted)}
            </span>
          </div>
        </div>
        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-center gap-1 text-sm font-semibold text-green-600 whitespace-nowrap">
            <DollarSign size={14} />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        {truncate(job.description, 200)}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs px-3 py-1 rounded-full bg-pink-50 text-laken-600 font-medium">
          {job.category || "Data Entry"}
        </span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-laken-500 hover:text-laken-700 font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View Job <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
