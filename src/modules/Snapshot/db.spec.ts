import initApi from "../../initApi";
import { SnapshotModel } from "./db";

let authModel: SnapshotModel;

beforeAll(async () => {
  const apiModules = await initApi({
    Snapshot: { enabled: true },
  });
  authModel = apiModules.datasource.module<SnapshotModel>("Snapshot");
});

afterAll(async () => {
  await authModel.knex.destroy();
});

it("returns list of snapshots with and undefined params", async () => {
  const entry = await authModel.getSnapshots({});
  const entry1 = await authModel.getSnapshots({ limit: 1, offset: 1 });
  const entry2 = await authModel.getSnapshots({ filter: { id: 1 } });
  //const entry3 = await authModel.getSnapshots({ filter: { start: '2021-02-15 12:00:00+00' } });
  //const entry4 = await authModel.getSnapshots({ filter: { end: '2021-03-15 12:00:00+00' } });
  const entry5 = await authModel.getSnapshots({
    filter: { ownerType: "CoreUnit" },
  });
  const entry6 = await authModel.getSnapshots({ filter: { ownerId: 21 } });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry1.length).toBeGreaterThan(0);
  expect(entry2[0].id).toEqual(1);
  //expect(entry3[0].start.toISOString()).toEqual('2021-02-15T12:00:00.000Z');
  //expect(entry4[0].end.toISOString()).toEqual('2021-03-15T12:00:00.000Z');
  expect(entry5[0].ownerType).toEqual("CoreUnit");
  expect(entry6[0].ownerId).toEqual(21);
});

it("gets snapshotAccount with snapshotId", async () => {
  const entry = await authModel.getSnapshotAccounts(12);
  expect(entry.length).toBeGreaterThan(0);
});

it("gets snapshotAccountTransactions with snapshotAccountId", async () => {
  const snapshots = await authModel.getSnapshots({});
  const snapshotId = snapshots[snapshots.length - 1].id;
  const entry = await authModel.getSnapshotAccountTransactions(snapshotId);
  expect(entry.length).toBeGreaterThan(0);
});

it("gets snapshotAccountBalances with snapshotAccountId", async () => {
  const snapshots = await authModel.getSnapshots({});
  const snapshotId = snapshots[0].id;
  const entry = await authModel.getSnapshotAccountBalances(snapshotId);
  expect(entry.length).toBeGreaterThan(0);
});
