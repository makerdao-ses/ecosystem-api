//Up migration creates ChangeTrackingEvents and ChangeTrackingEvents_CoreUnits entries
export async function up(knex) {
  const data = await knex
    .select("id", "cuId", "month", "cuCode")
    .from("BudgetStatement")
    .whereExists(
      knex
        .select("*")
        .from("BudgetStatementWallet as b2")
        .whereRaw(
          '"b2"."budgetStatementId" = "BudgetStatement"."id" AND EXISTS (SELECT * FROM "BudgetStatementLineItem" AS "b3" WHERE "b3"."budgetStatementWalletId" = "b2"."id")',
        ),
    )
    .orderBy("id");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let today = new Date();
  let eventsAdded = 0;

  console.log(
    "Processing " +
      data.length +
      " budget statements to create change tracking events...",
  );

  for (let i = 0; i < data.length; i++) {
    // Instead of the 1st day of the month, the BudgetStatement month sometimes has the previous
    // month due to timezone differences, e.g. 2021-11-30T23:00:00.000Z for December. Add 1 day
    // and reset UTC hour to 12 as a band aid to correct for this.
    const utcMonth = new Date(data[i].month);
    utcMonth.setUTCDate(utcMonth.getUTCDate() + 1);
    utcMonth.setUTCHours(12);
    utcMonth.setUTCDate(1);

    // The change tracking event is assumed to happen 1 month later.
    const createdDate = new Date(utcMonth);
    createdDate.setMonth(createdDate.getMonth() + 1);

    // Only create ChangeTrackingEvents that are supposed to have happened in the past.
    if (createdDate < today) {
      const description =
        "The " +
        data[i].cuCode.slice(0, -4) +
        " Core Unit submitted a new budget statement for " +
        months[utcMonth.getMonth()] +
        " " +
        utcMonth.getFullYear();

      console.log(
        "  ADDING",
        data[i].id,
        ":",
        data[i].month,
        ">> M:",
        utcMonth,
        ">> C:",
        createdDate,
      );
      console.log("  > " + description);

      const newRecord = {
        created_at: createdDate,
        event: "CU_BUDGET_STATEMENT_CREATE",
        params: {
          coreUnit: {
            id: data[i].cuId,
            code: data[i].cuCode,
            shortCode: data[i].cuCode.slice(0, -4),
          },
          budgetStatementId: data[i].id,
          month: utcMonth.toISOString().slice(0, 7),
        },
        description: description,
      };

      await knex.insert(newRecord).into("ChangeTrackingEvents");
      eventsAdded++;
    } else {
      console.log(
        "SKIPPING",
        data[i].id,
        ":",
        data[i].month,
        " >> ",
        utcMonth,
        " >> ",
        createdDate,
      );
    }
  }

  console.log("Added", eventsAdded, "change tracking events.");

  //Create entries for the ChangeTrackingEvents_CoreUnits table
  const dataChangeTrackingEvents = await knex
    .select("id", "params")
    .from("ChangeTrackingEvents");

  console.log(
    "Creating " +
      dataChangeTrackingEvents.length +
      " ChangeTrackingEvents_CoreUnits for existing budget statements...",
  );

  for (let j = 0; j < dataChangeTrackingEvents.length; j++) {
    var coreUnitId = dataChangeTrackingEvents[j].params.coreUnit.id;

    await knex
      .insert({
        event_id: dataChangeTrackingEvents[j].id,
        coreunit_id: coreUnitId,
      })
      .into("ChangeTrackingEvents_CoreUnits");
  }
}

//Down migration deletes all ChangeTrackingEvents and ChangeTrackingEvents_CoreUnits
export function down(knex) {
  console.log(
    "Deleting all change tracking events for existing budget statements...",
  );

  return knex("ChangeTrackingEvents", "ChangeTrackingEvents_CoreUnits").del();
}
