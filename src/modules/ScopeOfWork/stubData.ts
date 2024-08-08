export default [
  {
    "id": "1",
    "slug": "ph-2024",
    "title": "Powerhouse Roadmap 2024",
    "description": "Powerhouse Ecosystem Actor team roadmap for the year 2024.",
    "milestones": [
      {
        "id": "ustpb52jla",
        "sequenceCode": "PH01",
        "code": "POC",
        "title": "Decentralized Operations Platform - POC",
        "abstract": "The initial phase of Powerhouse Decentralized Operations Platform.",
        "description": "Roadmap milestone: Decentralized Operations Platform - Proof of Concept. Milestone 1, set for March 1, marks the initial phase of Powerhouse Decentralized Operations Platform. Deliverables include: Technical integration demo showcasing for the first time the RWA Portfolio Editor in Connect and the data synchronization with Switchboard; Switchboard API endpoints for integration partners with document model update events and document state queries; and Switchboard API endpoints for integration partners with document model update events and document state queries.",
        "targetDate": "2024-03-01T00:00:00.000Z",
        "coordinators": [
          {
            "id": "Z89231k5",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "66ICk94v",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "47z35Z8x",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "05SGYZ20",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "H7Cx8em3",
            "ref": "makerdao/ecosystem-actor",
            "name": "Powerhouse",
            "code": "PH",
            "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
          }
        ],
        "scope": {
          "deliverables": [
            {
              "id": "oy69oibt04",
              "parentIdRef": "ustpb52jla",
              "code": "POC1",
              "title": "First technical integration of RWA Portfolio (Connect & Switchboard)",
              "description": "Technical integration demo showcasing for the first time the RWA Portfolio Editor in Connect and the data synchronization with Switchboard.",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "RWA",
                  "title": "RWA Portfolio Reporting"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "oy69oibt04",
                  "id": "B84xO69g",
                  "title": "RWA Conceptual Wireframes",
                  "link": "https://drive.google.com/file/d/1NZXm_Q43sKH5pqwHTwN0DYvSW1uewMlY/view"
                },
                {
                  "parentIdRef": "oy69oibt04",
                  "id": "4965Bh97",
                  "title": "First demo of RWA Portfolio - Feb 21",
                  "link": "https://drive.google.com/file/d/1CMwePiR046IJqQGLypi7Fzu_B7aLYNco/view"
                }
              ]
            },
            {
              "id": "oy69oibt03",
              "parentIdRef": "ustpb52jla",
              "code": "POC2",
              "title": "Integration (API endpoints and Queries)",
              "description": "Switchboard API endpoints for integration partners with document model update events and document state queries.",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PHP",
                  "title": "Powerhouse Products POC"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "oy69oibt03",
                  "id": "6G64PrVM",
                  "title": "Source code (Powerhouse repo)",
                  "link": "u3ez94wW"
                },
                {
                  "parentIdRef": "oy69oibt03",
                  "id": "4BdhCJH9",
                  "title": "Source code (SES repo)",
                  "link": "https://github.com/makerdao-ses"
                }
              ]
            },
            {
              "id": "oy69oibt02",
              "parentIdRef": "ustpb52jla",
              "code": "POC3",
              "title": "Expense dashboard increments (on-chain data, budget breakdowns)",
              "description": "Separate incremental release of the MakerDAO expenses platform with on-chain transactional data and budget breakdown views.",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PEA",
                  "title": "Protocol Expense Accounting"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "oy69oibt02",
                  "id": "d86LdxF2",
                  "title": "Expenses dashboard on-going work",
                  "link": "https://expenses-staging.makerdao.network"
                },
                {
                  "parentIdRef": "oy69oibt02",
                  "id": "4799A069",
                  "title": "Expense Dashboard deployment v0.33.0",
                  "link": "https://github.com/makerdao-ses/ecosystem-dashboard/releases/tag/v0.33.0"
                }
              ]
            }
          ],
          "status": "DONE",
          "progress": {
            "value": 1
          },
          "totalDeliverables": 3,
          "deliverablesCompleted": 3
        }
      },
      {
        "id": "e7c86wa1g0",
        "sequenceCode": "PH02",
        "code": "MVP",
        "title": "Decentralized Operations Platform - MVP",
        "abstract": "The advanced phase of Powerhouse Decentralized Operations Platform.",
        "description": "Roadmap milestone: Decentralized Operations Platform - Minimal Viable Product. Milestone 2, set for July 3, marks the continuation phase of Powerhouse Decentralized Operations Platform. Deliverables include: MVP Release with MakerDAO transparency reporting information that can be shared publicly; Delivery of integrated platform consisting of Powerhouse core products (Fusion, Switchboard, Connect, and the first release of Renown).",
        "targetDate": "2024-07-02T23:00:00.000Z",
        "coordinators": [
          {
            "id": "Z89231k5",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "66ICk94v",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "47z35Z8x",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "05SGYZ20",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "H7Cx8em3",
            "ref": "makerdao/ecosystem-actor",
            "name": "Powerhouse",
            "code": "PH",
            "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
          }
        ],
        "scope": {
          "deliverables": [
            {
              "id": "xnatzcr1mn",
              "parentIdRef": "e7c86wa1g0",
              "code": "MVP1",
              "title": "MVP release of the MakerDAO transparency reporting information.",
              "description": "MVP Release with MakerDAO transparency reporting information that can be shared publicly. \n* RWA reporting flow (without e2e encryption & comparison views) \n* DAO finances (advanced stage) \n* DAO teams (at least core unit + ecosystem actor profiles) \n* DAO work (projects & roadmaps in early stage) \n* Endgame overview (latest updates & budget insights) \n* New homepage with at-glance insights on various DAO aspects - Finances, governance, Teams, and Work (reskin implemented).",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.8
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "RWA",
                  "title": "RWA Portfolio Reporting"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "8n55K4Py",
                  "title": "Integration Demo of RWA portfolio - Apr 10",
                  "link": "https://drive.google.com/file/d/1Q1zYh1_qosF8JG1z3gbKszrp60HlnYyV/view"
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "k2ZtY572",
                  "title": "Switchboard data / API endpoint ",
                  "link": "https://makerdao-ses.notion.site/RWA-API-Query-Key-Result-889eab4be0144d799650620794694916"
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "D544L9pj",
                  "title": "MakerDAO platform demo - Jul 3rd",
                  "link": "https://drive.google.com/file/d/1f-h8mPCUw4u5gCFn-TQcTw_XIDN7Ayvs/view"
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "58xP03Vs",
                  "title": "Forum status update 1",
                  "link": "https://forum.makerdao.com/t/ea-status-update-1-3-detailing-the-powerhouse-vision/24586"
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "hlq7Tzsa",
                  "title": "Custom MakerDAO domain name ",
                  "link": ""
                }
              ]
            },
            {
              "id": "xnatzcr2mn",
              "parentIdRef": "e7c86wa1g0",
              "code": "MVP2",
              "title": "Integrated Powerhouse Platform delivery including Renown",
              "description": "Delivery of integrated platform consisting of Powerhouse core products: Fusion, Switchboard, Connect, and the first release of Renown. \n* Enhanced expenses.makerdao.network rebranded as Fusion \n* Switchboard API endpoints that contain the RWA Portfolio Reporting queries. \n* Other data presented on Fusion will be partially served through Switchboard and partially through the legacy ecosystem API.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.95
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PHP",
                  "title": "Powerhouse Products POC"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "1g3C4z09",
                  "title": "Connect deployment",
                  "link": "https://apps.powerhouse.io/makerdao/connect"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "9982Vj6x",
                  "title": "Fusion deployment",
                  "link": "https://expenses-staging.makerdao.network"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "FY5PJJyh",
                  "title": "Switchboard deployment ",
                  "link": "https://apps.powerhouse.io/makerdao/switchboard/graphql/e5d5a2aa-b3f8-449a-b68a-5cb5fdae6f8d"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "9wWu9R13",
                  "title": "Renown deployment ",
                  "link": "https://www.renown.id/"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "35I05G7o",
                  "title": "Open-source code (Powerhouse repo)",
                  "link": "https://github.com/powerhouse-inc"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "5b147J03",
                  "title": "Open-source code (SES repo)",
                  "link": "https://github.com/makerdao-ses"
                }
              ]
            }
          ],
          "status": "IN_PROGRESS",
          "progress": {
            "value": 0.875
          },
          "totalDeliverables": 2,
          "deliverablesCompleted": 0
        }
      },
      {
        "id": "luc6t7m18q",
        "sequenceCode": "PH03",
        "code": "PROD",
        "title": "Decentralized Operations Platform - Production",
        "abstract": "Work on polished and production-grade version of Powerhouse Decentralized Operations Platform.",
        "description": "Roadmap milestone: Decentralized Operations Platform - Production release.\r\nMilestone 3, set for Q4, marks the production grade development phase of Powerhouse Decentralized Operations Platform.\r\nDeliverables include: (scope not final) Production grade release of the MakerDAO transparency reporting information; integrated Powerhouse platform.",
        "targetDate": "2024-11-01T00:00:00.000Z",
        "coordinators": [
          {
            "id": "Z89231k5",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "66ICk94v",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "47z35Z8x",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "05SGYZ20",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "H7Cx8em3",
            "ref": "makerdao/ecosystem-actor",
            "name": "Powerhouse",
            "code": "PH",
            "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
          }
        ],
        "scope": {
          "deliverables": [
            {
              "id": "t4wjsoym8u",
              "parentIdRef": "luc6t7m18q",
              "code": "PROD1",
              "title": "Production grade release of the MakerDAO transparency reporting information.",
              "description": "(scope not final) QA tested and reskined release of MakerDAO transparency reporting information. Including: Reskinned pages on the Fusion dashboard; Complete & correct available financial, team and work information.",
              "status": "TODO",
              "workProgress": {
                "value": 0.001
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PEA",
                  "title": " Protocol Expense Accounting"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "dY1J31mD",
                  "title": "Fusion Reskin example designs",
                  "link": "https://www.figma.com/proto/dX0ZItTTMaJ78Tsv8kZDlW/Expense-Dashboard-Update?page-id=2417%3A84822&node-id=2417-85288&viewport=465%2C761%2C0.28&t=wu9jjPYjDEC2tmDl-1&scaling=min-zoom&content-scaling=fixed"
                },
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "Fp8D8e4Q",
                  "title": "MakerDAO Finances page",
                  "link": ""
                },
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "19V15F4t",
                  "title": "Fusion prod demo recording",
                  "link": ""
                }
              ]
            },
            {
              "id": "t4wjsoym9u",
              "parentIdRef": "luc6t7m18q",
              "code": "PROD2",
              "title": "Production grade deployment of integrated Powerhouse platform.",
              "description": "(scope not final) Production-ready release of an integrated solution comprising Fusion, Switchboard, Connect and Renown, where contributor teams can register with their Ethereum identity and manage their transparency reporting data through the platform. Refactoring work.",
              "status": "TODO",
              "workProgress": {
                "value": 0.001
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PHP",
                  "title": "Powerhouse Products POC"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "t4wjsoym9u",
                  "id": "9720n972",
                  "title": "More...",
                  "link": ""
                }
              ]
            }
          ],
          "status": "TODO",
          "progress": {
            "value": 0.001
          },
          "totalDeliverables": 2,
          "deliverablesCompleted": 0
        }
      },
      {
        "id": "r3bzzgbyk2",
        "sequenceCode": "PH04",
        "code": "ATLAS",
        "title": "Atlas Viewer v1",
        "abstract": "The initial phase of Atlas Rulebook work.",
        "description": "Roadmap milestone: Atlas viewer v1. \nMilestone 4, set for Q4, marks the first version of an Atlas document model and viewer in Connect for the Atlas Rulebook.\nDeliverables include: (scope not final) Notion Atlas integration analysis; Atlas document model creation; Atlas viewer USPs exploration.",
        "targetDate": "2024-12-31T00:00:00.000Z",
        "coordinators": [
          {
            "id": "Z89231k5",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "50xm48xC",
            "ref": "makerdao/contributor",
            "name": "apeiron",
            "code": "apeiron",
            "imageUrl": "N/A"
          },
          {
            "id": "47z35Z8x",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "H7Cx8em3",
            "ref": "makerdao/ecosystem-actor",
            "name": "Powerhouse",
            "code": "PH",
            "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
          }
        ],
        "scope": {
          "deliverables": [
            {
              "id": "kjjxdnrl1n",
              "parentIdRef": "r3bzzgbyk2",
              "code": "ATLAS1",
              "title": "Notion Atlas integration analysis",
              "description": "(scope not final) Analysis of the Atlas Axis Notion database setup and identifying how we can pull the data from it, serving as input to creation of document model + viewer.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.05
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "ATL",
                  "title": "Atlas Rulebook Prototype"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "kjjxdnrl1n",
                  "id": "k7q90ux9",
                  "title": "Atlas integration analysis summary",
                  "link": ""
                }
              ]
            },
            {
              "id": "kjjxdnrl2n",
              "parentIdRef": "r3bzzgbyk2",
              "code": "ATLAS2",
              "title": "Atlas document model creation",
              "description": "(scope not final) Creation of document model + viewer to replicate the structure of Notion DB.",
              "status": "TODO",
              "workProgress": {
                "value": 0.001
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "ATL",
                  "title": "Atlas Rulebook Prototype"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "kjjxdnrl2n",
                  "id": "34hC7n1W",
                  "title": "Atlas document model",
                  "link": ""
                },
                {
                  "parentIdRef": "kjjxdnrl2n",
                  "id": "434H4RJ5",
                  "title": "Atlas viewer wireframes",
                  "link": ""
                }
              ]
            },
            {
              "id": "kjjxdnrl3n",
              "parentIdRef": "r3bzzgbyk2",
              "code": "ATLAS3",
              "title": "Atlas viewer USPs exploration",
              "description": "(scope not final) Exploration of the Powerhouse Unique Selling Points that will provide the most value to feature’s stakeholders.",
              "status": "TODO",
              "workProgress": {
                "value": 0.001
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "ATL",
                  "title": "Atlas Rulebook Prototype"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "kjjxdnrl3n",
                  "id": "PF6A4m6S",
                  "title": "Business analysis",
                  "link": ""
                },
                {
                  "parentIdRef": "kjjxdnrl3n",
                  "id": "F165EA59",
                  "title": "Conceptual wireframes with USP candidates",
                  "link": ""
                },
                {
                  "parentIdRef": "kjjxdnrl3n",
                  "id": "a4oxs2O5",
                  "title": "Demo of Atlas flow",
                  "link": ""
                }
              ]
            }
          ],
          "status": "IN_PROGRESS",
          "progress": {
            "value": 0.02
          },
          "totalDeliverables": 3,
          "deliverablesCompleted": 0
        }
      },
      {
        "id": "fn7f9sea7u",
        "sequenceCode": "PH05",
        "code": "SPIN",
        "title": "Powerhouse Spin-off",
        "abstract": "Research and implementation work of turning Powerhouse into a fully-fledged Ecosystem Actor.",
        "description": "Roadmap milestone: Powerhouse spin-off creation. \nMilestone 5, set for Q4, marks the research, modelling and the creation of  Powerhouse Spin-off. Deliverables include: legal entity setup; business modeling; OCF structuring & contributor; Powerhouse software integration; token modelling; new customers; public comms.",
        "targetDate": "2024-12-31T00:00:00.000Z",
        "coordinators": [
          {
            "id": "Z89231k5",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "05SGYZ20",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          },
          {
            "id": "47z35Z8x",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "1Sd1505K",
            "ref": "makerdao/contributor",
            "name": "Lumen",
            "code": "Lumen",
            "imageUrl": "N/A"
          },
          {
            "id": "0ztZ08rX",
            "ref": "makerdao/contributor",
            "name": "Kilgore",
            "code": "Kilgore",
            "imageUrl": "N/A"
          },
          {
            "id": "S11y1LJ2",
            "ref": "makerdao/contributor",
            "name": "Layer0x",
            "code": "Layer0x",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "H7Cx8em3",
            "ref": "makerdao/ecosystem-actor",
            "name": "Powerhouse",
            "code": "PH",
            "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
          }
        ],
        "scope": {
          "deliverables": [
            {
              "id": "dn2z901pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN1",
              "title": "Legal entity setup",
              "description": "(scope not final) Research and setup of legal entities.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.3
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PLS",
                  "title": "Powerhouse Legal Structuring"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "dn2z901pbv",
                  "id": "6914Q8aa",
                  "title": "Layer0x on PH legal research - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=160s"
                }
              ]
            },
            {
              "id": "dn2z902pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN2",
              "title": "Business model templates",
              "description": "(scope not final) Business modelling work including Powerhouse infrastructure stack & decentralized operations model.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.3
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PLS",
                  "title": "Powerhouse Legal Structuring"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "dn2z902pbv",
                  "id": "g5L00Z70",
                  "title": "T on PH tech stack - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=1490s"
                },
                {
                  "parentIdRef": "dn2z902pbv",
                  "id": "W2220791",
                  "title": "Prometheus on PH business model - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=tH0yb-lMsZ4"
                }
              ]
            },
            {
              "id": "dn2z903pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN3",
              "title": "OCF + compensation",
              "description": "(scope not final) Work out the OCF structure and the contributor compensation model.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.15
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PLS",
                  "title": "Powerhouse Legal Structuring"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "dn2z903pbv",
                  "id": "7QiuO0Hg",
                  "title": "More...",
                  "link": ""
                }
              ]
            },
            {
              "id": "dn2z904pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN4",
              "title": "New customer",
              "description": "(scope not final) Launch Powerhouse Software with one or more projects outside of the MakerDAO ecosystem",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.8
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "ARB",
                  "title": "Arbitrum Reporting Prototype"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "dn2z904pbv",
                  "id": "HE6k82i2",
                  "title": "Arbitrum LTIPP grants editor - Arbitrum forum",
                  "link": "https://forum.arbitrum.foundation/t/introducing-arbgrants-bi-weekly-reporting-for-ltipp-and-stip-b/"
                }
              ]
            },
            {
              "id": "dn2z905pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN5",
              "title": "social media presence",
              "description": "(scope not final) Build social media presence for Powerhouse",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.2
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PRC",
                  "title": "Powerhouse Release Comms"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "4u1439lw",
                  "title": "X thread Power Brunch 1 ",
                  "link": "https://x.com/PowerhouseDAO/status/1801283667651621155"
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "AZ5noMr9",
                  "title": "X thread Power Brunch 2",
                  "link": "https://x.com/PowerhouseDAO/status/1801623398075736470"
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "9l4201j9",
                  "title": "X thread Power Brunch 3",
                  "link": "https://x.com/PowerhouseDAO/status/1802726156816285797"
                }
              ]
            },
            {
              "id": "dn2z906pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN6",
              "title": "Powherhouse DAO tokenomics",
              "description": "(scope not final) Work out Powerhouse DAO token model",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.15
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "PLS",
                  "title": "Powerhouse Legal Structuring"
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "dn2z906pbv",
                  "id": "o973nN49",
                  "title": "PowerhouseDAO tokenomics",
                  "link": ""
                }
              ]
            },
            {
              "id": "dn2z907pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN7",
              "title": "Spin-off agreement with MakerDAO",
              "description": "(scope not final) Agreement for MakerDAO Incubation Stake / structure spin-off relationship",
              "status": "TODO",
              "workProgress": {
                "value": 0.001
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "",
                  "title": ""
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "dn2z907pbv",
                  "id": "7I75MG5r",
                  "title": "Publicly shareable agreement info",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z907pbv",
                  "id": "zoztKQnj",
                  "title": "Next steps forum update",
                  "link": ""
                }
              ]
            }
          ],
          "status": "IN_PROGRESS",
          "progress": {
            "value": 0.375
          },
          "totalDeliverables": 7,
          "deliverablesCompleted": 0
        }
      },
      {
        "id": "jeu5fu3ncc",
        "sequenceCode": "PH06",
        "code": "PMC",
        "title": "MakerDAO PM Consultancy",
        "abstract": "Project management consultancy and advisory work for MakerDAO.",
        "description": "Roadmap milestone: MakerDAO Project Management Consultancy. \nMilestone 6, set for Q4, marks the PM advisory and consultancy work for MakerDAO. Deliverables include: Endgame advisory & Operations coordination; Management & delivery of Pointable AI SOW1; related OCF work & management.",
        "targetDate": "2024-12-31T00:00:00.000Z",
        "coordinators": [
          {
            "id": "Z89231k5",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "H7Cx8em3",
            "ref": "makerdao/ecosystem-actor",
            "name": "Powerhouse",
            "code": "PH",
            "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
          }
        ],
        "scope": {
          "deliverables": [
            {
              "id": "c3vcxkuo41",
              "parentIdRef": "jeu5fu3ncc",
              "code": "PMC1",
              "title": "Endgame advisory & coordination",
              "description": "Endgame advisory and Operational roadmap coordination (Wouter)",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.5
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "",
                  "title": ""
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "c3vcxkuo41",
                  "id": "v5M2Zi6g",
                  "title": "Publicly shearable info",
                  "link": ""
                }
              ]
            },
            {
              "id": "c3vcxkuo42",
              "parentIdRef": "jeu5fu3ncc",
              "code": "PMC2",
              "title": "Management and Delivery of Pointable AI SOW1",
              "description": "Management and Delivery of Pointable AI SOW1, including:* Project Management, Cross Team Collaboration: Content, Front-End, AI, and Infra. * Delivery of Viable Agent with Integrated Front End in coordination with Jetstream and Pointable. * Agent Support Tooling and Hosting Delivery * Scoping of Pointable AI SOW2 to fulfill PH-04 and Ongoing Launch Project Requirements.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.75
              },
              "owner": {
                "id": "H7Cx8em3",
                "ref": "makerdao/ecosystem-actor",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "budgetAnchor": {
                "project": {
                  "code": "",
                  "title": ""
                },
                "workUnitBudget": 1,
                "deliverableBudget": 0
              },
              "keyResults": [
                {
                  "parentIdRef": "c3vcxkuo42",
                  "id": "4b2ZKfK9",
                  "title": "Public Pointable progress info",
                  "link": ""
                }
              ]
            }
          ],
          "status": "IN_PROGRESS",
          "progress": {
            "value": 0.5625
          },
          "totalDeliverables": 2,
          "deliverablesCompleted": 0
        }
      }
    ]
  }
]
