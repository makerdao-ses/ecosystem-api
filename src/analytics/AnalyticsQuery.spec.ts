import fetch from "node-fetch";
import { JsonObjectExpression } from "typescript";

describe("AnalyticsQuery", () => {
    describe("Time resolutions", () => {
        beforeAll(async () => {});

        afterAll(async () => {});

        it("should return correct total over all data sets", () => {
            // fetchData()
        });

        it("should return correct annual total", () => {});

        it("should return correct semi-annual total");

        it("should return correct quarterly total", () => {});

        it("should return correct monthly total", () => {});

        it("should return correct weekly total", () => {});

        it("should return correct daily total", () => {});

        it("should return correct hourly total", () => {});
    });
});

const fetchData = async (query: string, variables: object) => {
    const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ query, variables, operationName: "Series" }),
    });

    return response.json();
};

const getQuery = () => {
    return `query Series($filter: AnalyticsFilter) {
    analytics(filter: $filter) {
      series {
        period
        start
        end
        rows {
          dimensions {
            name
            value
          }
          metric
          unit
          value
          sum
        }
      }
    }
  }`;
};

const getFilter = () => {
    return `{
    "filter": {
     "start": "2023-01-01", // defining the "year" url parameter
      "end": "2024-01-01", // defined by the "year" url parameter +1
      "granularity": "total", // always total
      "metrics": [
        "budget", // only query with this field, otherwise the dev server will fry
        "actuals"
      ],
      "currency": "DAI",
      "dimensions": {
        "select": {
          "budget": "atlas/legacy/core-units",
          "category": "atlas"
        },
        "lod": {
          "budget": 4,
          "category": 1
        }
      }
    }
  }`;
};
