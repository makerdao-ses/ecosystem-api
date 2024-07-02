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
            "id": "2k2h5JTx",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "q3I0787Z",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "5042W1c3",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "3Q8190FB",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "3M2q23L1",
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
                "id": "3M2q23L1",
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
                  "id": "Kw5e9weG",
                  "title": "RWA Conceptual Wireframes",
                  "link": "https://drive.google.com/file/d/1NZXm_Q43sKH5pqwHTwN0DYvSW1uewMlY/view"
                },
                {
                  "parentIdRef": "oy69oibt04",
                  "id": "UWd20IKa",
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
                "id": "3M2q23L1",
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
                  "id": "u510C73l",
                  "title": "Source code (Powerhouse repo)",
                  "link": "https://github.com/powerhouse-inc"
                },
                {
                  "parentIdRef": "oy69oibt03",
                  "id": "P9nlXAra",
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
                "id": "3M2q23L1",
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
                  "id": "599333pu",
                  "title": "Expenses dashboard on-going work",
                  "link": "https://expenses-staging.makerdao.network"
                },
                {
                  "parentIdRef": "oy69oibt02",
                  "id": "a16R346G",
                  "title": "Expense Dashboard deployment v0.33.0",
                  "link": "https://github.com/makerdao-ses/ecosystem-dashboard/releases/tag/v0.33.0"
                }
              ]
            }
          ],
          "status": "DRAFT",
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
            "id": "2k2h5JTx",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "q3I0787Z",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "5042W1c3",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "3Q8190FB",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "3M2q23L1",
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
              "description": "MVP Release with MakerDAO transparency reporting information that can be shared publicly. * RWA reporting flow (without e2e encryption & comparison views) * DAO finances (advanced stage) * DAO teams (at least core unit + ecosystem actor profiles) * DAO work (projects & roadmaps in early stage) * Endgame overview (latest updates & budget insights) * New homepage with at-glance insights on various DAO aspects - Finances, governance, Teams, and Work (designs only).",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.8
              },
              "owner": {
                "id": "3M2q23L1",
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
                  "id": "E3428c30",
                  "title": "Integration Demo of RWA portfolio - Apr 10",
                  "link": "https://drive.google.com/file/d/1Q1zYh1_qosF8JG1z3gbKszrp60HlnYyV/view"
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "7Z367229",
                  "title": "Switchboard data / API endpoint ",
                  "link": "https://makerdao-ses.notion.site/RWA-API-Query-Key-Result-889eab4be0144d799650620794694916"
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "pM504SUR",
                  "title": "MakerDAO platform demo - Jul 3rd",
                  "link": ""
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "U28r263D",
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
              "description": "Delivery of integrated platform consisting of Powerhouse core products: Fusion, Switchboard, Connect, and the first release of Renown. * Enhanced expenses.makerdao.network rebranded as Fusion * Switchboard API endpoints that contain the RWA Portfolio Reporting queries. * Other data presented on Fusion will be partially served through Switchboard and partially through the legacy ecosystem API.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.95
              },
              "owner": {
                "id": "3M2q23L1",
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
                  "id": "78I8Sn29",
                  "title": "Connect deployment",
                  "link": "https://apps.powerhouse.io/makerdao/connect"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "RP48a22R",
                  "title": "Fusion deployment",
                  "link": "https://apps.powerhouse.io/makerdao/fusion"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "sOW19B5r",
                  "title": "Switchboard deployment ",
                  "link": "https://apps.powerhouse.io/makerdao/switchboard"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "58718649",
                  "title": "Renown deployment ",
                  "link": "https://renown.id/makerdao"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "e2wGu1C5",
                  "title": "Open-source code (Powerhouse repo)",
                  "link": "https://github.com/powerhouse-inc"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "L975E8kH",
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
            "id": "2k2h5JTx",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "q3I0787Z",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "5042W1c3",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "3Q8190FB",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "3M2q23L1",
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
                "id": "3M2q23L1",
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
                  "id": "38CPG9Wi",
                  "title": "Fusion Reskin example designs",
                  "link": "\"link to a resource referencing a couple of before & after reskin designs/page screenshots\" "
                },
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "2O9S9Zc9",
                  "title": "MakerDAO Finances page",
                  "link": "\"url to finances page on fusion\""
                },
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "2wkgt835",
                  "title": "Fusion prod demo recording",
                  "link": "\"link to demo recording mid Sep\""
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
                "id": "3M2q23L1",
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
                  "id": "H0d1118D",
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
            "id": "2k2h5JTx",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "GuzP82g5",
            "ref": "makerdao/contributor",
            "name": "apeiron",
            "code": "apeiron",
            "imageUrl": "N/A"
          },
          {
            "id": "5042W1c3",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "3M2q23L1",
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
                "id": "3M2q23L1",
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
                  "id": "WD185L4k",
                  "title": "Atlas integration analysis summary",
                  "link": "\"link to public Notion Atlas integration analysis\""
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
                "id": "3M2q23L1",
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
                  "id": "809L77XN",
                  "title": "Atlas document model",
                  "link": "\"link to public Atlas document model deployment\""
                },
                {
                  "parentIdRef": "kjjxdnrl2n",
                  "id": "042o718C",
                  "title": "Atlas viewer wireframes",
                  "link": "\"link to public Atlas viewer wireframes\""
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
                "id": "3M2q23L1",
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
                  "id": "T47s985L",
                  "title": "Business analysis",
                  "link": ""
                },
                {
                  "parentIdRef": "kjjxdnrl3n",
                  "id": "bVn8Bh8z",
                  "title": "Conceptual wireframes with USP candidates",
                  "link": ""
                },
                {
                  "parentIdRef": "kjjxdnrl3n",
                  "id": "2g47idc4",
                  "title": "Demo of Atlas flow",
                  "link": "\"link to Atlas demo recording\""
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
            "id": "2k2h5JTx",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "3Q8190FB",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          },
          {
            "id": "5042W1c3",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "jxgI351z",
            "ref": "makerdao/contributor",
            "name": "Lumen",
            "code": "Lumen",
            "imageUrl": "N/A"
          },
          {
            "id": "t265E0B7",
            "ref": "makerdao/contributor",
            "name": "Kilgore",
            "code": "Kilgore",
            "imageUrl": "N/A"
          },
          {
            "id": "4uNN1Fz1",
            "ref": "makerdao/contributor",
            "name": "Layer0x",
            "code": "Layer0x",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "3M2q23L1",
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
                "id": "3M2q23L1",
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
                  "id": "8p921w06",
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
                "id": "3M2q23L1",
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
                  "id": "168t78Mp",
                  "title": "T on PH tech stack - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=1490s"
                },
                {
                  "parentIdRef": "dn2z902pbv",
                  "id": "p551C21W",
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
                "id": "3M2q23L1",
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
                  "id": "4b4206mI",
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
                "id": "3M2q23L1",
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
                  "id": "XZT2b9A0",
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
                "id": "3M2q23L1",
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
                  "id": "6117SDNM",
                  "title": "X thread Power brunch 1 ",
                  "link": "https://x.com/PowerhouseDAO/status/1801283667651621155"
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "42s77Kc4",
                  "title": "X thread Power brunch 2",
                  "link": "https://x.com/PowerhouseDAO/status/1801623398075736470"
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "2D48K0L1",
                  "title": "X thread Power brunch 3",
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
                "id": "3M2q23L1",
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
                  "id": "xe85E90x",
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
                "id": "3M2q23L1",
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
                  "id": "9y2773s7",
                  "title": "publicly shareable agreement info",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z907pbv",
                  "id": "xS4y080R",
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
            "id": "2k2h5JTx",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "3M2q23L1",
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
                "id": "3M2q23L1",
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
                  "id": "l44c6xG2",
                  "title": "publicly shearable info",
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
                "id": "3M2q23L1",
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
                  "id": "LYX8YM52",
                  "title": "public Pointable progress info",
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
