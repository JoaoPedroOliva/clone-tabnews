import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  //Version
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValeu = databaseVersionResult.rows[0].server_version;

  //Conexões máximas
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectiosValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  //Conexões usadas
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValeu,
        max_connections: parseInt(databaseMaxConnectiosValue),
        used_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
