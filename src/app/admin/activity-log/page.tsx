import { prisma } from "@/lib/prisma";
import { Clock } from "lucide-react";

interface PageProps {
  searchParams: { page?: string };
}

const LIMIT = 25;

export default async function ActivityLogPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }).catch(() => []),
    prisma.activityLog.count().catch(() => 0),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Log</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{total} total actions</p>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 w-10"></th>
              <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Action</th>
              <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Details</th>
              <th className="text-end px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {logs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">No activity yet.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{log.action}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{log.details ?? "—"}</td>
                  <td className="px-4 py-3 text-end text-gray-400 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={`?page=${page - 1}`} className="admin-btn-outline text-xs px-3 py-1.5">Prev</a>
              )}
              {page < totalPages && (
                <a href={`?page=${page + 1}`} className="admin-btn-outline text-xs px-3 py-1.5">Next</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
