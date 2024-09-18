import { PostgresConnectionInfo } from '../types';

export const parsePostgresUrl = (
  url: string,
): PostgresConnectionInfo | null => {
  try {
    const regex =
      /postgres:\/\/(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:]+):(?<port>\d+)\/(?<database>.+)/;
    const match = url.match(regex);

    if (!match || !match.groups) {
      throw new Error('Invalid PostgreSQL URL format');
    }

    return {
      user: match.groups.user,
      password: match.groups.password,
      host: match.groups.host,
      port: parseInt(match.groups.port, 10),
      database: match.groups.database,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const cleanIpcError = (
  errorMessage: string,
  handlerName: string,
): string => {
  // Escape special characters in the handlerName
  const escapedHandlerName = handlerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = `^Error invoking remote method '${escapedHandlerName}':\\s*`;
  const regex = new RegExp(pattern, 'i'); // Case-insensitive matching
  const msg = errorMessage.replace(regex, '');
  return msg;
};
