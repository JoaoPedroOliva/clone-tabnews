import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  //Version
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValeu = databaseVersionResult.rows[0].server_version;

  //Conexões máximas
  const databaseMaxConnections = await database.query("SHOW max_connections");
  const databaseMaxConnectiosValue =
    databaseMaxConnections.rows[0].max_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValeu,
        max_connections: databaseMaxConnectiosValue,
      },
    },
  });
}

export default status;
