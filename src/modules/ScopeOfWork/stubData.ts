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
        "targetDate": "2024-01-02T23:00:00.000Z",
        "coordinators": [
          {
            "id": "J79t56bN",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "Np5pkE6E",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "r8vP852u",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "8yn28U94",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "8KQny6Yp",
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
                "id": "8KQny6Yp",
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
                  "id": "L205E3C0",
                  "title": "RWA Conceptual Wireframes",
                  "link": "https://drive.google.com/file/d/1NZXm_Q43sKH5pqwHTwN0DYvSW1uewMlY/view"
                },
                {
                  "parentIdRef": "oy69oibt04",
                  "id": "q1B24kzw",
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
                "id": "8KQny6Yp",
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
                  "id": "rj5s42a7",
                  "title": "Source code (Powerhouse repo)",
                  "link": "https://github.com/powerhouse-inc"
                },
                {
                  "parentIdRef": "oy69oibt03",
                  "id": "z15uuGd4",
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
                "id": "8KQny6Yp",
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
                  "id": "w54Z03g7",
                  "title": "Expenses dashboard on-going work",
                  "link": "https://expenses-staging.makerdao.network"
                },
                {
                  "parentIdRef": "oy69oibt02",
                  "id": "kjr986l6",
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
        "targetDate": "2024-03-06T23:00:00.000Z",
        "coordinators": [
          {
            "id": "J79t56bN",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "Np5pkE6E",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "r8vP852u",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "8yn28U94",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "8KQny6Yp",
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
                "value": 0.75
              },
              "owner": {
                "id": "8KQny6Yp",
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
                  "id": "187Ca392",
                  "title": "Integration Demo of RWA portfolio - Apr 10",
                  "link": "https://drive.google.com/file/d/1Q1zYh1_qosF8JG1z3gbKszrp60HlnYyV/view"
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "h840kkm7",
                  "title": "Switchboard data / API endpoint ",
                  "link": "https://makerdao-ses.notion.site/RWA-API-Query-Key-Result-889eab4be0144d799650620794694916"
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "3qx6mh7T",
                  "title": "MakerDAO platform demo - Jul 3rd",
                  "link": "“provide link to recording when available”."
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "E47Kg31s",
                  "title": "Custom MakerDAO domain name ",
                  "link": "“link TBD”."
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
                "value": 0.65
              },
              "owner": {
                "id": "8KQny6Yp",
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
                  "id": "dQePc680",
                  "title": "Connect deployment",
                  "link": "https://apps.powerhouse.io/makerdao/connect"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "1tQhz5pz",
                  "title": "Fusion deployment",
                  "link": "https://apps.powerhouse.io/makerdao/fusion"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "X290IQC5",
                  "title": "Switchboard deployment ",
                  "link": "https://apps.powerhouse.io/makerdao/switchboard"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "9lj465HZ",
                  "title": "Renown deployment ",
                  "link": "https://renown.id/makerdao"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "H8vI85xu",
                  "title": "Open-source code (Powerhouse repo)",
                  "link": "https://github.com/powerhouse-inc"
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "f5f514h8",
                  "title": "Open-source code (SES repo)",
                  "link": "https://github.com/makerdao-ses"
                }
              ]
            }
          ],
          "status": "TODO",
          "progress": {
            "value": 0.5
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
        "targetDate": "2024-01-10T23:00:00.000Z",
        "coordinators": [
          {
            "id": "J79t56bN",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "Np5pkE6E",
            "ref": "makerdao/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "r8vP852u",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "8yn28U94",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "8KQny6Yp",
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
                "id": "8KQny6Yp",
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
                  "id": "uObPib7V",
                  "title": "Fusion Reskin example designs",
                  "link": "\"link to a resource referencing a couple of before & after reskin designs/page screenshots\" "
                },
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "9l11OD96",
                  "title": "MakerDAO Finances page",
                  "link": "\"url to finances page on fusion\""
                },
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "9se9D3L1",
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
                "id": "8KQny6Yp",
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
                  "id": "4oc7204a",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "t4wjsoym9u",
                  "id": "2Ud05269",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "t4wjsoym9u",
                  "id": "624Ob7S6",
                  "title": "TBD",
                  "link": ""
                }
              ]
            }
          ],
          "status": "IN_PROGRESS",
          "progress": {
            "value": 0.75
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
        "targetDate": "31/12/2024",
        "coordinators": [
          {
            "id": "J79t56bN",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "PjuB4Bfg",
            "ref": "makerdao/contributor",
            "name": "apeiron",
            "code": "apeiron",
            "imageUrl": "N/A"
          },
          {
            "id": "r8vP852u",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "N/A",
            "ref": "N/A",
            "name": "N/A",
            "code": "N/A",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "8KQny6Yp",
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
                "id": "8KQny6Yp",
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
                  "id": "375g655n",
                  "title": "Atlas integration analysis summary",
                  "link": "\"link to public Notion Atlas integration analysis\""
                },
                {
                  "parentIdRef": "kjjxdnrl1n",
                  "id": "799DX5A9",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "kjjxdnrl1n",
                  "id": "8Fb4R9DN",
                  "title": "TBD",
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
                "id": "8KQny6Yp",
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
                  "id": "3YV75G35",
                  "title": "Atlas document model",
                  "link": "\"link to public Atlas document model deployment\""
                },
                {
                  "parentIdRef": "kjjxdnrl2n",
                  "id": "LFG583X4",
                  "title": "Atlas viewer wireframes",
                  "link": "\"link to public Atlas viewer wireframes\""
                },
                {
                  "parentIdRef": "kjjxdnrl2n",
                  "id": "WpmZdS3N",
                  "title": "TBD",
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
                "id": "8KQny6Yp",
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
                  "id": "I6821235",
                  "title": "Business analysis",
                  "link": ""
                },
                {
                  "parentIdRef": "kjjxdnrl3n",
                  "id": "qq3548qa",
                  "title": "Conceptual wireframes with USP candidates",
                  "link": ""
                },
                {
                  "parentIdRef": "kjjxdnrl3n",
                  "id": "FewLf04b",
                  "title": "Demo of Atlas flow",
                  "link": "\"link to Atlas demo recording\""
                }
              ]
            }
          ],
          "status": "FINISHED",
          "progress": {
            "value": 0.5
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
        "targetDate": "31/12/2024",
        "coordinators": [
          {
            "id": "J79t56bN",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "8yn28U94",
            "ref": "makerdao/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          },
          {
            "id": "r8vP852u",
            "ref": "makerdao/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "ry36f2h0",
            "ref": "makerdao/contributor",
            "name": "Lumen",
            "code": "Lumen",
            "imageUrl": "N/A"
          },
          {
            "id": "1574Vm9O",
            "ref": "makerdao/contributor",
            "name": "Kilgore",
            "code": "Kilgore",
            "imageUrl": "N/A"
          },
          {
            "id": "4fDo1U80",
            "ref": "makerdao/contributor",
            "name": "Layer0x",
            "code": "Layer0x",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "8KQny6Yp",
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
                "id": "8KQny6Yp",
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
                  "id": "Z1q83aS4",
                  "title": "Layer0x on PH legal research - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=160s"
                },
                {
                  "parentIdRef": "dn2z901pbv",
                  "id": "e1eW3e1b",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z901pbv",
                  "id": "fYP77R6C",
                  "title": "TBD",
                  "link": ""
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
                "id": "8KQny6Yp",
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
                  "id": "AO6h1dI1",
                  "title": "T on PH tech stack - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=1490s"
                },
                {
                  "parentIdRef": "dn2z902pbv",
                  "id": "3471iW50",
                  "title": "Prometheus on PH business model - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=tH0yb-lMsZ4"
                },
                {
                  "parentIdRef": "dn2z902pbv",
                  "id": "1TN0MvG8",
                  "title": "TBD",
                  "link": ""
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
                "id": "8KQny6Yp",
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
                  "id": "1U55ntO5",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z903pbv",
                  "id": "48D993OZ",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z903pbv",
                  "id": "1Z42y8HM",
                  "title": "TBD",
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
                "id": "8KQny6Yp",
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
                  "id": "1932l97f",
                  "title": "KR01 - Arbitrum LTIPP grants editor - Arbitrum forum",
                  "link": "https://forum.arbitrum.foundation/t/introducing-arbgrants-bi-weekly-reporting-for-ltipp-and-stip-b/"
                },
                {
                  "parentIdRef": "dn2z904pbv",
                  "id": "8c7ajKPG",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z904pbv",
                  "id": "3NRFGZ3m",
                  "title": "TBD",
                  "link": ""
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
                "id": "8KQny6Yp",
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
                  "id": "U61E07Ey",
                  "title": "X thread Power brunch 1 ",
                  "link": "https://x.com/PowerhouseDAO/status/1801283667651621155"
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "s34SmQ30",
                  "title": "X thread Power brunch 2",
                  "link": "https://x.com/PowerhouseDAO/status/1801623398075736470"
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "25d17j2E",
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
                "id": "8KQny6Yp",
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
                  "id": "a6v454c7",
                  "title": "PowerhouseDAO tokenomics",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z906pbv",
                  "id": "P37113Rd",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z906pbv",
                  "id": "D881ed0s",
                  "title": "TBD",
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
                "id": "8KQny6Yp",
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
                  "id": "279U9V6i",
                  "title": "publicly shareable agreement info",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z907pbv",
                  "id": "71msxhT9",
                  "title": "Next steps forum update",
                  "link": ""
                },
                {
                  "parentIdRef": "dn2z907pbv",
                  "id": "M113ANka",
                  "title": "TBD",
                  "link": ""
                }
              ]
            }
          ],
          "status": "DRAFT",
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
        "targetDate": "31/12/2024",
        "coordinators": [
          {
            "id": "J79t56bN",
            "ref": "makerdao/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "8KQny6Yp",
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
                "id": "8KQny6Yp",
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
                  "id": "3dQ0V4S1",
                  "title": "publicly shearable info",
                  "link": ""
                },
                {
                  "parentIdRef": "c3vcxkuo41",
                  "id": "49M9TW9u",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "c3vcxkuo41",
                  "id": "5y6A36H2",
                  "title": "TBD",
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
                "id": "8KQny6Yp",
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
                  "id": "p6Q5Ii1O",
                  "title": "public Pointable progress info",
                  "link": ""
                },
                {
                  "parentIdRef": "c3vcxkuo42",
                  "id": "8XL02U5x",
                  "title": "TBD",
                  "link": ""
                },
                {
                  "parentIdRef": "c3vcxkuo42",
                  "id": "K8443of9",
                  "title": "TBD",
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
