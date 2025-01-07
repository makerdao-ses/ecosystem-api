import { AnalyticsQueryEngine } from "@powerhousedao/analytics-engine-core";
import { AnalyticsModel } from "@powerhousedao/analytics-engine-graphql";
import { PostgresAnalyticsStore } from "@powerhousedao/analytics-engine-pg";
import { Knex } from "knex";

let model: AnalyticsModel | null = null;

export default function(knex: Knex) {
  if (!model) {
    model = new AnalyticsModel(new AnalyticsQueryEngine(
      new PostgresAnalyticsStore({
        knex,
      }),
    ));
  }

  return model;
}