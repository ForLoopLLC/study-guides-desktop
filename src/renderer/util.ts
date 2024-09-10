import { PostgresConnectionInfo } from "../types";

export const parsePostgresUrl = (url: string): PostgresConnectionInfo | null => {
  try {
    const regex = /postgres:\/\/(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:]+):(?<port>\d+)\/(?<database>.+)/;
    const match = url.match(regex);

    if (!match || !match.groups) {
      throw new Error("Invalid PostgreSQL URL format");
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

