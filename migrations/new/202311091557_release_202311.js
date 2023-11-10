// Creating PriceData table

export async function up(knex) {
  try {
    await knex.schema.alterTable("AnalyticsSeries", function (table) {
      table.index(["start"]);
      table.index(["end"]);
      table.index(["unit"]);
      table.index(["metric"]);
      table.index(["value"]);
      table.index(["source"]);
      table.index(["fn"]);
    });

    await knex.schema.alterTable("AnalyticsDimension", function (table) {
      table.index(["dimension"]);
      table.index(["path"]);
    });

    await knex.schema.alterTable(
      "AnalyticsSeries_AnalyticsDimension",
      function (table) {
        table.index(["dimensionId"]);
        table.index(["seriesId"]);
      },
    );

    // await knex.schema.alterTable('AnalyticsSeries_AnalyticsDimension', function(table) {
    //     table.index(['dimensionId', 'seriesId']);
    // });
    console.log("Indexes added");
  } catch (error) {
    console.error(error);
  } finally {
    await knex.destroy();
  }
}

export async function down(knex) {
  await knex.schema.alterTable("AnalyticsSeries", function (table) {
    table.dropIndex(["start"]);
    table.dropIndex(["end"]);
    table.dropIndex(["unit"]);
    table.dropIndex(["metric"]);
    table.dropIndex(["value"]);
    table.dropIndex(["source"]);
    table.dropIndex(["fn"]);
  });

  await knex.schema.alterTable("AnalyticsDimension", function (table) {
    table.dropIndex(["dimension"]);
    table.dropIndex(["path"]);
  });

  await knex.schema.alterTable(
    "AnalyticsSeries_AnalyticsDimension",
    function (table) {
      table.dropIndex(["dimensionId"]);
      table.dropIndex(["seriesId"]);
    },
  );
}
