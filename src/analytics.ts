import { AnalyticsQueryEngine } from "@powerhousedao/analytics-engine-core";
import { AnalyticsModel } from "@powerhousedao/analytics-engine-graphql";
import { defaultQueryLogger } from "@powerhousedao/analytics-engine-knex";
import { PostgresAnalyticsStore, PostgresAnalyticsStoreOptions } from "@powerhousedao/analytics-engine-pg";
import { Knex } from "knex";

let model: AnalyticsModel | null = null;

export default function(knex: Knex) {
  if (!model) {
    const options: PostgresAnalyticsStoreOptions = {
      knex,
    };

    if (process.env.DEBUG === "true") {
      options.queryLogger = defaultQueryLogger("analytics");
      options.resultsLogger = defaultQueryLogger("analytics");
    }

    model = new AnalyticsModel(new AnalyticsQueryEngine(
      new PostgresAnalyticsStore(options),
    ));
  }

  return model;
}