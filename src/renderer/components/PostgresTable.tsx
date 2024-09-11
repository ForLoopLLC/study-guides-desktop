import React from 'react';
import { parsePostgresUrl } from '../util';

interface PostgresTableProps {
  url: string;
}

const PostgresTable: React.FC<PostgresTableProps> = ({ url }) => {
  if (!url) {
    return (
      <p className="text-red-500">No PostgreSQL connection URL provided</p>
    );
  }

  const connectionInfo = parsePostgresUrl(url);

  if (!connectionInfo) {
    return <p className="text-red-500">Invalid PostgreSQL connection URL</p>;
  }

  return (
    <table className="min-w-full table-auto bg-white text-left border border-gray-300">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="text-sm px-4 py-2 font-semibold">Parameter</th>
          <th className="text-sm px-4 py-2 font-semibold">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t border-gray-300">
          <td className="text-sm px-4 py-2">Host</td>
          <td className="text-sm px-4 py-2">{connectionInfo.host || 'N/A'}</td>
        </tr>
        <tr className="border-t border-gray-300">
          <td className="text-sm px-4 py-2">Port</td>
          <td className="text-sm px-4 py-2">{connectionInfo.port || 'N/A'}</td>
        </tr>
        <tr className="border-t border-gray-300">
          <td className="text-sm px-4 py-2">User</td>
          <td className="text-sm px-4 py-2">{connectionInfo.user || 'N/A'}</td>
        </tr>
        <tr className="border-t border-gray-300">
          <td className="text-sm px-4 py-2">Database</td>
          <td className="text-sm px-4 py-2">
            {connectionInfo.database || 'N/A'}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PostgresTable;
