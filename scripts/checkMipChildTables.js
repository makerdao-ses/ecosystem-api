import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

console.log("Checking child tables for missing entries...");

//Connect to database selected in the .env file
const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

//Retreive the current data from the database
const getData = async () => {
  var data = await db
    .select("mipCode", "cuId", "id", "mipTitle", "mipStatus", "accepted")
    .from("CuMip");

  //Pass CU MIP table data to the functions
  await checkChildTables(data);
  await checkMipReplacesMip39(data);
  await obsoleteMip40();

  process.exit(0);
};

const checkChildTables = async (data) => {
  var missingEntries = [];

  for (var i = 0; i < data.length; i++) {
    var code = data[i].mipCode.slice(3, 5);
    var status = data[i].mipStatus;
    if (status == "Accepted") {
      if (code == "39") {
        var resultMip39 = await db
          .select("id")
          .from("Mip39")
          .where("mipId", data[i].id);
        if (resultMip39.length == 0) {
          let res = {
            id: data[i].id,
            mipCode: data[i].mipCode,
            mipTitle: data[i].mipTitle,
            mipStatus: data[i].mipStatus,
            accepted: data[i].accepted,
          };
          missingEntries.push(res);
        }
      }
      if (code == "40") {
        var resultMip40 = await db
          .select("id")
          .from("Mip40")
          .where("cuMipId", data[i].id);
        if (resultMip40.length == 0) {
          let res = {
            id: data[i].id,
            mipCode: data[i].mipCode,
            mipTitle: data[i].mipTitle,
            mipStatus: data[i].mipStatus,
            accepted: data[i].accepted,
          };
          missingEntries.push(res);
        }
      }
      if (code == "41") {
        var resultMip41 = await db
          .select("id")
          .from("Mip41")
          .where("cuMipId", data[i].id);
        if (resultMip41.length == 0) {
          let res = {
            id: data[i].id,
            mipCode: data[i].mipCode,
            mipTitle: data[i].mipTitle,
            mipStatus: data[i].mipStatus,
            accepted: data[i].accepted,
          };
          missingEntries.push(res);
        }
      }
    }
  }

  //Sort array by mipCode
  const sortedEntries = missingEntries.sort((a, b) => {
    if (a.mipCode < b.mipCode) return -1;
    if (a.mipCode > b.mipCode) return 1;
    return 0;
  });

  console.log("CuMip with missing corresponding entries: ");
  console.table(sortedEntries);
};

const checkMipReplacesMip39 = async (data) => {
  //check for MIP39c3
  for (var i in data) {
    var cuId = data[i].cuId;
    var mipCode = data[i].mipCode;
    var newMipId = data[i].id;
    var status = data[i].mipStatus;
    var accepted = data[i].accepted;

    if (mipCode.includes("MIP39c3") && status == "Accepted") {
      //Use CU ID of offboarded CU to find old MIP
      var result = await db.raw(
        `SELECT * FROM public."CuMip" WHERE "cuId" = ` +
          cuId +
          ` AND "mipCode" LIKE '%MIP39c2%'`,
      );
      var oldMipId = result["rows"][0]["id"];

      await db("CuMip").where({ id: oldMipId }).update({
        mipStatus: "Obsolete",
        obsolete: accepted,
      });

      var output = [];

      output.push({
        cuId: cuId,
        mipCode: mipCode,
        status: status,
        newMipId: newMipId,
        oldMipId: oldMipId,
      });

      console.table(output, [
        "cuId",
        "mipCode",
        "status",
        "newMipId",
        "oldMipId",
      ]);

      await db.raw(
        `INSERT INTO public."MipReplaces"(
            "newMip", "replacedMip")
            SELECT ` +
          newMipId +
          `, ` +
          oldMipId +
          ` 
            WHERE NOT EXISTS (
                SELECT 1 
                FROM public."MipReplaces"
                WHERE "newMip" = ` +
          newMipId +
          ` AND "replacedMip" = ` +
          oldMipId +
          `)`,
      );
    }
  }
};

const obsoleteMip40 = async () => {
  const result = await db.schema
    .raw(`SELECT cumip."mipCode", cumip."mipTitle", cumip."mipStatus", cumip."id", m4bp."budgetPeriodStart", m4bp."budgetPeriodEnd"
    FROM public. "CuMip" as cumip
    LEFT JOIN "Mip40" as m4 on m4. "cuMipId" = cumip.id
    LEFT JOIN "Mip40Wallet" as m4w on m4w. "mip40Id" = m4.id
    LEFT JOIN "Mip40BudgetPeriod" as m4bp on m4.id = m4bp."mip40Id"
    WHERE m4bp."budgetPeriodEnd" < CURRENT_DATE AND cumip."mipStatus" = 'Accepted'`);

  return console.table(result.rows);
};

getData();
