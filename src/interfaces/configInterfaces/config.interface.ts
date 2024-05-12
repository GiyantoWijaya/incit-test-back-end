// Assuming your EnvironmentConfig interface looks like this:
export interface EnvironmentConfig {
  [key: string]: {
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    host: string | undefined;
    dialect?: string | undefined;
    port: string | undefined;
  };
}