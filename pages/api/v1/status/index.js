import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  //Version
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValeu = databaseVersionResult.rows[0].server_version;

  //Conexões máximas
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const databaseMaxConnectiosValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  //Conexões usadas
  const databaseUsedConnectionsResult = await database.query(
    "SELECT count(*) FROM pg_stat_activity",
  );
  const databaseUsedConnectionsValeu = databaseUsedConnectionsResult.rows[0];

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValeu,
        max_connections: databaseMaxConnectiosValue,
        used_connections: databaseUsedConnectionsValeu,
      },
    },
  });
}

export default status;
