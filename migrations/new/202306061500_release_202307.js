// Up migration that fills the expenseCategory table

export async function up(knex) {
  const budgetCategoriesMap = [
    {
      canonicalCategory: "CompensationAndBenefits",
      position: 1,
      headCountExpense: true,
      budgetCategories: [
        "compensation & benefits",
        "contributor compensation",
        "salaries & wages",
        "healtcare",
        "contractor (temp) fees",
        "insurance",
        "employer taxes",
        "bonus",
        "referral bonus",
        "sign on bonus",
        "fees & salary costs",
        "contractor fees",
        "salaries & benefits",
        "phone",
      ],
    },
    {
      canonicalCategory: "Bonus",
      position: 2,
      headCountExpense: true,
      budgetCategories: [
        "bonus",
        "referral bonus",
        "sign on bonus",
        "sign-on bonus",
      ],
    },
    {
      canonicalCategory: "AdminExpense",
      position: 3,
      headCountExpense: true,
      budgetCategories: ["recruiting fees"],
    },
    {
      canonicalCategory: "AdminExpense",
      position: 3,
      headCountExpense: false,
      budgetCategories: [
        "admin expense",
        "exchange fees",
        "bank fees",
        "admin expenses",
      ],
    },
    {
      canonicalCategory: "TravelAndEntertainment",
      position: 4,
      headCountExpense: true,
      budgetCategories: [
        "travel & entertainment",
        "hotels",
        "airfare",
        "meals",
        "activities & events",
        "events",
        "transportation (uber, taxi, etc.)",
        "events & activities",
        "activities",
        "internet/online fees while traveling",
        "taxi/uber/bus/train",
        "hotels/airbnb",
        "events/ tickets",
        "lunch employee",
        "travel costs",
      ],
    },
    {
      canonicalCategory: "FreightAndDuties",
      position: 5,
      headCountExpense: false,
      budgetCategories: [
        "freight & duties",
        "shipping & fright",
        "shipping",
        "fright",
      ],
    },
    {
      canonicalCategory: "GasExpense",
      position: 6,
      headCountExpense: false,
      budgetCategories: ["gas expense", "gas", "gas fees"],
    },
    {
      canonicalCategory: "GovernancePrograms",
      position: 7,
      headCountExpense: false,
      budgetCategories: [
        "governance programs",
        "programs - other",
        "programs - sourcecred",
      ],
    },
    {
      canonicalCategory: "HardwareExpense",
      position: 8,
      headCountExpense: false,
      budgetCategories: ["hardware expense"],
    },
    {
      canonicalCategory: "MarketingExpense",
      position: 9,
      headCountExpense: false,
      budgetCategories: [
        "marketing expense",
        "marketing expenses",
        "advertising",
        "marketing campaign",
        "maker swag",
        "sponsorships",
        "public relations",
      ],
    },
    {
      canonicalCategory: "ProfessionalServices",
      position: 10,
      headCountExpense: false,
      budgetCategories: [
        "professional services",
        "accounting expense",
        "accounting expenses",
        "legal expense",
        "legal expenses",
        "legal advice",
        "contractor services",
        "contractor services (professional)",
        "payroll services",
        "technical operations services",
        "data feeds",
      ],
    },
    {
      canonicalCategory: "SoftwareDevelopmentExpense",
      position: 11,
      headCountExpense: false,
      budgetCategories: [
        "software development expense",
        "bug bounty",
        "programs",
        "programs - status ui",
        "sc audit expense",
        "blockchain development expense",
        "web development",
        "software development",
        "backend",
        "frontend",
        "software",
      ],
    },
    {
      canonicalCategory: "SoftwareExpense",
      position: 12,
      headCountExpense: false,
      budgetCategories: [
        "software expense",
        "it expense",
        "tooling",
        "tools",
        "software costs",
      ],
    },
    {
      canonicalCategory: "Supplies",
      position: 13,
      headCountExpense: false,
      budgetCategories: ["supplies", "office supplies"],
    },
    {
      canonicalCategory: "TrainingExpense",
      position: 14,
      headCountExpense: false,
      budgetCategories: ["training expense", "training"],
    },
    {
      canonicalCategory: "CommunityDevelopmentExpense",
      position: 15,
      headCountExpense: false,
      budgetCategories: ["community development expense", "grants", "grant"],
    },
    {
      canonicalCategory: "ContingencyBuffer",
      position: 16,
      headCountExpense: false,
      budgetCategories: ["contingency buffer", "contingency", "buffer"],
    },
  ];

  budgetCategoriesMap.forEach(async (item) => {
    const idOfCanonicalCategory = await knex("ExpenseCategory")
      .insert({
        name: item.canonicalCategory,
        headcountExpense: item.headCountExpense,
        order: item.position,
        legacyCategory: item.canonicalCategory,
      })
      .returning("id");
    item.budgetCategories.forEach(async (budgetCategory) => {
      await knex("ExpenseCategory").insert({
        name: budgetCategory,
        headcountExpense: item.headCountExpense,
        parentId: idOfCanonicalCategory[0].id,
        order: item.position,
        legacyCategory: item.canonicalCategory,
      });
    });
  });
}

//Down migration that empties the expenseCategory table

export async function down(knex) {
  await knex("ExpenseCategory").del();
}
