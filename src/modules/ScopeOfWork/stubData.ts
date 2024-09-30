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
            "id": "oNJfRL9P",
            "ref": "skyecosystem/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "8k7E2tkN",
            "ref": "skyecosystem/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "Yyw6RRs7",
            "ref": "skyecosystem/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "T4ixm254",
            "ref": "skyecosystem/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "c4hVMhFM",
            "ref": "skyecosystem/ecosystem-actor",
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
              "startDate": "2023-12-31T23:00:00.000Z",
              "endDate": "2024-02-29T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "oT96D3Ue",
                  "title": "RWA Conceptual Wireframes",
                  "link": "https://drive.google.com/file/d/1NZXm_Q43sKH5pqwHTwN0DYvSW1uewMlY/view",
                  "Note": ""
                },
                {
                  "parentIdRef": "oy69oibt04",
                  "id": "xG0J4003",
                  "title": "First demo of RWA Portfolio - Feb 21",
                  "link": "https://drive.google.com/file/d/1CMwePiR046IJqQGLypi7Fzu_B7aLYNco/view",
                  "Note": ""
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
              "startDate": "2023-12-31T23:00:00.000Z",
              "endDate": "2024-02-29T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "N263vtn8",
                  "title": "Source code (Powerhouse repo)",
                  "link": "https://github.com/powerhouse-inc/",
                  "Note": ""
                },
                {
                  "parentIdRef": "oy69oibt03",
                  "id": "3V23DF56",
                  "title": "Source code (SES repo)",
                  "link": "https://github.com/makerdao-ses",
                  "Note": ""
                }
              ]
            },
            {
              "id": "oy69oibt02",
              "parentIdRef": "ustpb52jla",
              "code": "POC3",
              "title": "Expense dashboard increments (on-chain data, budget breakdowns)",
              "description": "Separate incremental release of the Sky Ecosystem expenses platform with on-chain transactional data and budget breakdown views.",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "startDate": "2023-12-31T23:00:00.000Z",
              "endDate": "2024-02-29T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "9KhY71W3",
                  "title": "Expense Dashboard deployment v0.33.0",
                  "link": "https://github.com/makerdao-ses/ecosystem-dashboard/releases/tag/v0.33.0",
                  "Note": ""
                }
              ]
            }
          ],
          "status": "FINISHED",
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
        "description": "Roadmap milestone: Decentralized Operations Platform - Minimal Viable Product. Milestone 2, set for July 3, marks the continuation phase of Powerhouse Decentralized Operations Platform. Deliverables include: MVP Release with Sky Ecosystem transparency reporting information that can be shared publicly; Delivery of integrated platform consisting of Powerhouse core products (Fusion, Switchboard, Connect, and the first release of Renown).",
        "targetDate": "2024-07-02T23:00:00.000Z",
        "coordinators": [
          {
            "id": "oNJfRL9P",
            "ref": "skyecosystem/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "8k7E2tkN",
            "ref": "skyecosystem/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "Yyw6RRs7",
            "ref": "skyecosystem/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "T4ixm254",
            "ref": "skyecosystem/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "c4hVMhFM",
            "ref": "skyecosystem/ecosystem-actor",
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
              "title": "MVP release of the Sky Ecosystem transparency reporting information.",
              "description": "MVP Release with Sky Ecosystem transparency reporting information that can be shared publicly. \n* RWA reporting flow (without e2e encryption & comparison views) \n* DAO finances (advanced stage) \n* DAO teams (at least core unit + ecosystem actor profiles) \n* DAO work (projects & roadmaps in early stage) \n* Endgame overview (latest updates & budget insights) \n* New homepage with at-glance insights on various DAO aspects - Finances, governance, Teams, and Work (reskin implemented).",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "startDate": "2024-03-03T23:00:00.000Z",
              "endDate": "2024-03-06T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "Z13c84Nd",
                  "title": "Integration Demo of RWA portfolio - Apr 10",
                  "link": "https://drive.google.com/file/d/1Q1zYh1_qosF8JG1z3gbKszrp60HlnYyV/view",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "C08yG2oT",
                  "title": "Switchboard data / API endpoint ",
                  "link": "https://makerdao-ses.notion.site/RWA-API-Query-Key-Result-889eab4be0144d799650620794694916",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "RGgxU8V9",
                  "title": "Sky Ecosystem platform demo - Jul 3rd",
                  "link": "https://drive.google.com/file/d/1f-h8mPCUw4u5gCFn-TQcTw_XIDN7Ayvs/view",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "85452Z31",
                  "title": "PH EA update 1/3 - Powerhouse vision",
                  "link": "https://forum.makerdao.com/t/ea-status-update-1-3-detailing-the-powerhouse-vision/24586",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "H3s58f80",
                  "title": "Fusion Reskin example designs",
                  "link": "https://www.figma.com/proto/dX0ZItTTMaJ78Tsv8kZDlW/Expense-Dashboard-Update?page-id=2417%3A84822&node-id=2417-85288&viewport=465%2C761%2C0.28&t=wu9jjPYjDEC2tmDl-1&scaling=min-zoom&content-scaling=fixed",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr1mn",
                  "id": "7swFA4Y3",
                  "title": "Sky deployment of PH products WIP demo - Aug14",
                  "link": "https://drive.google.com/file/d/1DGyS4sa1yGgM-pePcbuIYmkki-QlCLzq/view?usp=sharing",
                  "Note": ""
                }
              ]
            },
            {
              "id": "xnatzcr2mn",
              "parentIdRef": "e7c86wa1g0",
              "code": "MVP2",
              "title": "Integrated Powerhouse Platform delivery including Renown",
              "description": "Delivery of integrated platform consisting of Powerhouse core products: Fusion, Switchboard, Connect, and the first release of Renown. \n* Enhanced expenses.Sky Ecosystem.network rebranded as Fusion \n* Switchboard API endpoints that contain the RWA Portfolio Reporting queries. \n* Other data presented on Fusion will be partially served through Switchboard and partially through the legacy ecosystem API.",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "startDate": "2024-03-03T23:00:00.000Z",
              "endDate": "2024-03-06T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "4146F4I8",
                  "title": "Sky Connect ",
                  "link": "https://connect.sky.money/",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "t4y5x9f1",
                  "title": "Fusion deployment",
                  "link": "https://staging.fusion.phd/",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "fI5U6pwU",
                  "title": "Switchboard deployment ",
                  "link": "https://switchboard.sky.money/",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "2A99h0AS",
                  "title": "Renown deployment ",
                  "link": "https://www.renown.id/",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "TdO513IB",
                  "title": "Fusion Github repo",
                  "link": "https://github.com/powerhouse-inc/fusion/",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "96Z84azi",
                  "title": "Switchboard Github repo",
                  "link": "https://github.com/powerhouse-inc/switchboard",
                  "Note": ""
                },
                {
                  "parentIdRef": "xnatzcr2mn",
                  "id": "0392Oq73",
                  "title": "Connect Github repo",
                  "link": "https://github.com/powerhouse-inc/connect",
                  "Note": ""
                }
              ]
            }
          ],
          "status": "FINISHED",
          "progress": {
            "value": 1
          },
          "totalDeliverables": 2,
          "deliverablesCompleted": 2
        }
      },
      {
        "id": "luc6t7m18q",
        "sequenceCode": "PH03",
        "code": "PROD",
        "title": "Decentralized Operations Platform - Production",
        "abstract": "Work on polished and production-grade version of Powerhouse Decentralized Operations Platform.",
        "description": "Roadmap milestone: Decentralized Operations Platform - Production release.\nMilestone 3, set for Q4, marks the production grade development phase of Powerhouse Decentralized Operations Platform.\nDeliverables include: (scope not final) Production grade release of the Sky Ecosystem transparency reporting information; integrated Powerhouse platform.",
        "targetDate": "2024-11-01T00:00:00.000Z",
        "coordinators": [
          {
            "id": "oNJfRL9P",
            "ref": "skyecosystem/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "8k7E2tkN",
            "ref": "skyecosystem/contributor",
            "name": "teep",
            "code": "teep",
            "imageUrl": "N/A"
          },
          {
            "id": "Yyw6RRs7",
            "ref": "skyecosystem/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "T4ixm254",
            "ref": "skyecosystem/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "c4hVMhFM",
            "ref": "skyecosystem/ecosystem-actor",
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
              "title": "Sky Fusion Production Release",
              "description": "Sky rebrand of Fusion, including staging & production deployment on the sky.money subdomains with the latest available ecosystem data.",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "startDate": "2024-07-07T22:00:00.000Z",
              "endDate": "2024-10-31T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "r6U53504",
                  "title": "Custom Sky Fusion deployment",
                  "link": "https://fusion.sky.money/",
                  "Note": ""
                },
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "72733Z7f",
                  "title": "Sky Fusion Staging Release",
                  "link": "https://fusion-staging.sky.money/",
                  "Note": ""
                },
                {
                  "parentIdRef": "t4wjsoym8u",
                  "id": "2S6n9Kgv",
                  "title": "Sky Fusion Production Release",
                  "link": "https://fusion.sky.money/",
                  "Note": ""
                }
              ]
            },
            {
              "id": "t4wjsoym9u",
              "parentIdRef": "luc6t7m18q",
              "code": "PROD2",
              "title": "Sky Connect Production Release",
              "description": "Sky rebrand of Connect, including staging & production deployment on the sky.money subdomains  with the available Real World Assets reports data.",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "startDate": "2024-07-07T22:00:00.000Z",
              "endDate": "2024-10-31T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "7ov2891Y",
                  "title": "Sky Connect Staging Release",
                  "link": "https://connect-staging.sky.money/",
                  "Note": ""
                },
                {
                  "parentIdRef": "t4wjsoym9u",
                  "id": "Ni2v6sP8",
                  "title": "Sky Connect Production Release",
                  "link": "https://connect.sky.money/",
                  "Note": ""
                }
              ]
            },
            {
              "id": "t4wjsoyrru",
              "parentIdRef": "luc6t7m18q",
              "code": "PROD3",
              "title": "Sky Switchboard Production Release",
              "description": "Sky rebrand of Switchboard, including staging & production deployment on the sky.money subdomains, including latest available RWA & ecosystem data. ",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.9
              },
              "startDate": "2024-07-07T22:00:00.000Z",
              "endDate": "2024-10-31T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "parentIdRef": "t4wjsoyrru",
                  "id": "G2722974",
                  "title": "Sky Switchboard Staging Release ",
                  "link": "https://switchboard-staging.sky.money/",
                  "Note": ""
                },
                {
                  "parentIdRef": "t4wjsoyrru",
                  "id": "4r3SjB52",
                  "title": "Sky Switchboard Production Release ",
                  "link": "https://switchboard.sky.money/",
                  "Note": ""
                }
              ]
            },
            {
              "id": "t4wjsoywdu",
              "parentIdRef": "luc6t7m18q",
              "code": "PROD4",
              "title": "Renown.id Production Release",
              "description": "Sky rebrand of PRODUCT, including staging & production deployment on the sky.money domain. ",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.9
              },
              "startDate": "2024-07-07T22:00:00.000Z",
              "endDate": "2024-10-31T23:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "parentIdRef": "t4wjsoywdu",
                  "id": "Jz3hvn06",
                  "title": "Renown.id Production Release",
                  "link": "https://www.renown.id/ ",
                  "Note": ""
                }
              ]
            }
          ],
          "status": "IN_PROGRESS",
          "progress": {
            "value": 0.92
          },
          "totalDeliverables": 4,
          "deliverablesCompleted": 2
        }
      },
      {
        "id": "r3bzzgbyk2",
        "sequenceCode": "PH04",
        "code": "ATLAS",
        "title": "Atlas Rulebook Editor",
        "abstract": "The initial phase of Atlas Rulebook Editor work.",
        "description": "Roadmap milestone: Atlas Rulebook Editor. \nMilestone 4, set for Q4, marks the first version of an Atlas document model and viewer in Connect for the Atlas Rulebook.\nDeliverables include: Notion Atlas integration analysis; Atlas document model creation; Atlas - Powerhouse integrated roadmap planning",
        "targetDate": "2024-12-31T00:00:00.000Z",
        "coordinators": [
          {
            "id": "oNJfRL9P",
            "ref": "skyecosystem/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "b7I1N2H3",
            "ref": "skyecosystem/contributor",
            "name": "apeiron",
            "code": "apeiron",
            "imageUrl": "N/A"
          },
          {
            "id": "Yyw6RRs7",
            "ref": "skyecosystem/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "c4hVMhFM",
            "ref": "skyecosystem/ecosystem-actor",
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
              "description": "Analysis of the Atlas Axis Notion database setup and identifying how we can pull the data from it, serving as input to creation of document model + viewer.",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "56NI28Ob",
                  "title": "Mapping existing manual process in Notion",
                  "link": "https://drive.google.com/file/d/1HdJ9WGOVkUg9cn9qn7TBghLOTf0g3F1A/view",
                  "Note": ""
                },
                {
                  "parentIdRef": "kjjxdnrl1n",
                  "id": "1bOw7412",
                  "title": "Atlas editing process capture",
                  "link": "https://drive.google.com/file/d/1fgHtkfic8PbI71cLavgDz7XUoNg71ZtW/view",
                  "Note": ""
                },
                {
                  "parentIdRef": "kjjxdnrl1n",
                  "id": "K69u6130",
                  "title": "MIPs Portal Requirements + Numbering algorithm",
                  "link": "https://drive.google.com/file/d/1KE8nXZD0rbkzVVWXjpc8FZsg99l4glsI/view",
                  "Note": ""
                }
              ]
            },
            {
              "id": "kjjxdnrl2n",
              "parentIdRef": "r3bzzgbyk2",
              "code": "ATLAS2",
              "title": "Atlas document model creation",
              "description": "Creation of Notion export + viewer to replicate the structure of Notion DB.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.85
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "634L7497",
                  "title": "Atlas document model",
                  "link": "https://drive.google.com/file/d/1j9SVd_cJ5K885WRmc0Zm8UBSqveIRruu/view",
                  "Note": ""
                },
                {
                  "parentIdRef": "kjjxdnrl2n",
                  "id": "EM49B2ue",
                  "title": "Atlas viewer ",
                  "link": "https://sky-atlas.powerhouse.io/",
                  "Note": ""
                }
              ]
            },
            {
              "id": "kjjxdnrl3n",
              "parentIdRef": "r3bzzgbyk2",
              "code": "ATLAS3",
              "title": "Atlas - Powerhouse integrated roadmap planning",
              "description": "Gap analysis & future roadmap plan covering 2024 year end + 2025. ",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.1
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "9PqZ5106",
                  "title": "Business analysis",
                  "link": "https://drive.google.com/file/d/1MErkuyCLXEXbvcRs7Sxma9BTPsTOo7-p/view",
                  "Note": ""
                },
                {
                  "parentIdRef": "kjjxdnrl3n",
                  "id": "98aE05ZH",
                  "title": "Exploratory exercise for Atlas viewer",
                  "link": "https://drive.google.com/file/d/1aN-e04slhCDfd1O3SWENEfJhUd28mcEG/view",
                  "Note": ""
                }
              ]
            }
          ],
          "status": "IN_PROGRESS",
          "progress": {
            "value": 0.5
          },
          "totalDeliverables": 3,
          "deliverablesCompleted": 1
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
            "id": "oNJfRL9P",
            "ref": "skyecosystem/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          },
          {
            "id": "T4ixm254",
            "ref": "skyecosystem/contributor",
            "name": "callmeT",
            "code": "callmeT",
            "imageUrl": "N/A"
          },
          {
            "id": "Yyw6RRs7",
            "ref": "skyecosystem/contributor",
            "name": "meraki",
            "code": "meraki",
            "imageUrl": "N/A"
          },
          {
            "id": "3a5B60B0",
            "ref": "skyecosystem/contributor",
            "name": "Lumen",
            "code": "Lumen",
            "imageUrl": "N/A"
          },
          {
            "id": "2pJTZf58",
            "ref": "skyecosystem/contributor",
            "name": "Kilgore",
            "code": "Kilgore",
            "imageUrl": "N/A"
          },
          {
            "id": "Q8H2P6ZV",
            "ref": "skyecosystem/contributor",
            "name": "Layer0x",
            "code": "Layer0x",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "c4hVMhFM",
            "ref": "skyecosystem/ecosystem-actor",
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
              "description": "Research and setup of legal entities in the Powerhouse network model.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.5
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "BCmeo109",
                  "title": "Layer0x on PH legal research - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=160s",
                  "Note": "Legal entity setup"
                }
              ]
            },
            {
              "id": "dn2z902pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN2",
              "title": "Business model templates",
              "description": "Business modelling work including Powerhouse infrastructure stack & decentralized operations model.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.95
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "9788O5RC",
                  "title": "T on PH tech stack - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=1490s",
                  "Note": "Business model templates"
                },
                {
                  "parentIdRef": "dn2z902pbv",
                  "id": "g66wI4Gy",
                  "title": "Prometheus on PH business model - Power Brunch",
                  "link": "https://www.youtube.com/watch?v=tH0yb-lMsZ4",
                  "Note": "Business model templates"
                }
              ]
            },
            {
              "id": "dn2z903pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN3",
              "title": "OCF + compensation",
              "description": "Work out the OCF structure and the contributor compensation model.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.5
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "672b8B1w",
                  "title": "More...",
                  "link": "",
                  "Note": "OCF + compensation"
                }
              ]
            },
            {
              "id": "dn2z904pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN4",
              "title": "New customer",
              "description": "Launch Powerhouse Software with one or more projects outside of the Sky Ecosystem ecosystem",
              "status": "DELIVERED",
              "workProgress": {
                "value": 1
              },
              "startDate": "2024-01-31T23:00:00.000Z",
              "endDate": "2024-09-30T22:00:00.000Z",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "D4kqp87k",
                  "title": "Introducing ArbGrants - Arbitrum forum",
                  "link": "https://forum.arbitrum.foundation/t/introducing-arbgrants-bi-weekly-reporting-for-ltipp-and-stip-b/",
                  "Note": ""
                },
                {
                  "parentIdRef": "dn2z904pbv",
                  "id": "ZOR0gg77",
                  "title": "ArbGrants Connect deployment",
                  "link": "https://www.arbgrants.com/",
                  "Note": ""
                },
                {
                  "parentIdRef": "dn2z904pbv",
                  "id": "PeD8Ug09",
                  "title": "PH EA update 3/3 - Sustainability",
                  "link": "https://forum.makerdao.com/t/ea-status-update-3-3-powerhouse-sustainability/25051",
                  "Note": ""
                }
              ]
            },
            {
              "id": "dn2z905pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN5",
              "title": "Community engagement",
              "description": "Grow and engage Powerhouse community, including events and social media presence for Powerhouse.",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.7
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "1399482a",
                  "title": "X thread Power Brunch 1 ",
                  "link": "https://x.com/PowerhouseDAO/status/1801283667651621155",
                  "Note": ""
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "r0arCNP5",
                  "title": "X thread Power Brunch 2",
                  "link": "https://x.com/PowerhouseDAO/status/1801623398075736470",
                  "Note": ""
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "44QqV504",
                  "title": "X thread Power Brunch 3",
                  "link": "https://x.com/PowerhouseDAO/status/1802726156816285797",
                  "Note": ""
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "191j91cx",
                  "title": "PowerhouseDAO X account",
                  "link": "https://x.com/PowerhouseDAO",
                  "Note": ""
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "r73aJ4ho",
                  "title": "Devcon attendance",
                  "link": "",
                  "Note": ""
                },
                {
                  "parentIdRef": "dn2z905pbv",
                  "id": "h4n73Vu4",
                  "title": "Powerhouse Builder Showcase event",
                  "link": "",
                  "Note": ""
                }
              ]
            },
            {
              "id": "dn2z906pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN6",
              "title": "Powherhouse DAO tokenomics",
              "description": "Work out Powerhouse DAO token model",
              "status": "IN_PROGRESS",
              "workProgress": {
                "value": 0.15
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "4v2qT8f3",
                  "title": "More...",
                  "link": "",
                  "Note": "Powherhouse DAO tokenomics"
                }
              ]
            },
            {
              "id": "dn2z907pbv",
              "parentIdRef": "fn7f9sea7u",
              "code": "SPIN7",
              "title": "Spin-off agreement with SkyBase",
              "description": "Agreement for Sky Incubation Stake / structure spin-off relationship",
              "status": "TO DO",
              "workProgress": {
                "value": 0.001
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "99614296",
                  "title": "More...",
                  "link": "",
                  "Note": ""
                }
              ]
            }
          ],
          "status": "IN_PROGRESS",
          "progress": {
            "value": 0.385
          },
          "totalDeliverables": 7,
          "deliverablesCompleted": 1
        }
      },
      {
        "id": "jeu5fu3ncc",
        "sequenceCode": "PH06",
        "code": "PMC",
        "title": "Sky Ecosystem PM Consultancy",
        "abstract": "Project management consultancy and advisory work for Sky Ecosystem",
        "description": "Roadmap milestone: Sky Ecosystem Project Management Consultancy. \nMilestone 6, set for Q4, marks the PM advisory and consultancy work for Sky Ecosystem. Deliverables include: Endgame advisory & Operations coordination; Management & delivery of Pointable AI SOW1; related OCF work & management.",
        "targetDate": "2024-12-31T00:00:00.000Z",
        "coordinators": [
          {
            "id": "oNJfRL9P",
            "ref": "skyecosystem/contributor",
            "name": "Prometheus",
            "code": "Prometheus",
            "imageUrl": "N/A"
          }
        ],
        "contributors": [
          {
            "id": "c4hVMhFM",
            "ref": "skyecosystem/ecosystem-actor",
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
                "value": 0.75
              },
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "y91E3dXx",
                  "title": "More...",
                  "link": "",
                  "Note": ""
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
              "startDate": "",
              "endDate": "",
              "owner": {
                "id": "c4hVMhFM",
                "ref": "skyecosystem/ecosystem-actor",
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
                  "id": "P90iUu8I",
                  "title": "More...",
                  "link": "",
                  "Note": ""
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
