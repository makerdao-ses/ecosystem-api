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
        "description": "Roadmap milestone: Decentralized Operations Platform - Proof of Concept. Milestone 1, set for March 1, marks the initial phase of Powerhouse Decentralized Operations Platform. Deliverables include: Technical integration demo showcasing for the first time the RWA Portfolio Editor in Connect and the data synchronization with Switchboard; Switchboard API endpoints for integration partners with document model update events and document state queries; and Switchboard API endpoints for integration partners with document model update events and document state queries.",
        "targetDate": "2024-01-02T23:00:00.000Z",
        "scope": {
          "deliverables": [
            {
              "id": "oy69oibt04",
              "parentIdRef": "ustpb52jla",
              "code": "POC1",
              "title": "First technical integration of RWA Portfolio (Connect & Switchboard)",
              "description": "Technical integration demo showcasing for the first time the RWA Portfolio Editor in Connect and the data synchronization with Switchboard.",
              "status": "Delivered",
              "workProgress": {
                "value": 1.0
              },
              "budgetAnchor": {
                "project": "RWA - RWA Portfolio Reporting",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "oy69oibt01",
                  "parentIdRef": "oy69oibt04",
                  "title": "KR01 - RWA Conceptual Wireframes",
                  "link": "https://drive.google.com/file/d/1NZXm_Q43sKH5pqwHTwN0DYvSW1uewMlY/view"
                },
                {
                  "id": "oy69oibt02",
                  "parentIdRef": "oy69oibt04",
                  "title": "KR02 - First demo of RWA Portfolio - Feb 21",
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
              "status": "Delivered",
              "workProgress": {
                "value": 1.0
              },
              "budgetAnchor": {
                "project": "PHP - Powerhouse Products POC",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "oy69oibt01",
                  "parentIdRef": "oy69oibt03",
                  "title": "KR03 - Source code on Powerhouse Github repo",
                  "link": "https://github.com/powerhouse-inc"
                },
                {
                  "id": "oy69oibt02",
                  "parentIdRef": "oy69oibt03",
                  "title": "KR04 - Source code on SES Github repo",
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
              "status": "Delivered",
              "workProgress": {
                "value": 1.0
              },
              "budgetAnchor": {
                "project": "PEA - Protocol Expense Accounting",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "oy69oibt01",
                  "parentIdRef": "oy69oibt02",
                  "title": "KR05 - Expenses dashboard on-going work available",
                  "link": "https://expenses-staging.makerdao.network"
                },
                {
                  "id": "oy69oibt02",
                  "parentIdRef": "oy69oibt02",
                  "title": "KR06 - Expense Dashboard deployment v0.33.0",
                  "link": "https://github.com/makerdao-ses/ecosystem-dashboard/releases/tag/v0.33.0"
                }
              ]
            }
          ],
        },
        "coordinators": [
          {
            "id": "1",
            "ref": "Prometheus",
            "name": 'Prometheus',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "2",
            "ref": "Teep",
            "name": 'Teep',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "3",
            "ref": "meraki",
            "name": 'meraki',
            "code": "",
            "imageUrl": ""
          }
        ],
        "contributors": [
          {
            "id": "1",
            "ref": "Powerhouse",
            "name": 'Powerhouse',
            "code": "",
            "imageUrl": ""
          }
        ],
      },
      {
        "id": "e7c86wa1g0",
        "sequenceCode": "PH02",
        "code": "MVP",
        "title": "Decentralized Operations Platform - MVP",
        "description": "Roadmap milestone: Decentralized Operations Platform - Proof of Concept. Milestone 2, set for July 2, marks the continuation phase of Powerhouse Decentralized Operations Platform. Deliverables include: MVP Release with MakerDAO transparency reporting information that can be shared publicly; Delivery of integrated platform consisting of Powerhouse core products (Fusion, Switchboard, Connect, and the first release of Renown).",
        "targetDate": "2024-03-06T23:00:00.000Z",
        "scope": {
          "deliverables": [],
        },
        "coordinators": [
          {
            "id": "1",
            "ref": "Prometheus",
            "name": 'Prometheus',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "2",
            "ref": "Teep",
            "name": 'Teep',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "3",
            "ref": "meraki",
            "name": 'meraki',
            "code": "",
            "imageUrl": ""
          }
        ],
        "contributors": [
          {
            "id": "1",
            "ref": "Powerhouse",
            "name": 'Powerhouse',
            "code": "",
            "imageUrl": ""
          }
        ],
      },
      {
        "id": "luc6t7m18q",
        "sequenceCode": "PH03",
        "code": "PROD",
        "title": "Decentralized Operations Platform - Production",
        "description": "Roadmap milestone: Decentralized Operations Platform - Production release.\r\nMilestone 3, set for Q4, marks the production grade development phase of Powerhouse Decentralized Operations Platform.\r\nDeliverables include: (scope not final) Production grade release of the MakerDAO transparency reporting information; integrated Powerhouse platform.",
        "targetDate": "2024-01-10T23:00:00.000Z",
        "scope": {
          "deliverables": [
            {
              "id": "t4wjsoym8u",
              "parentIdRef": "luc6t7m18q",
              "code": "PROD1",
              "title": "Production grade release of the MakerDAO transparency reporting information.",
              "description": "(scope not final) QA tested and reskined release of MakerDAO transparency reporting information. Including: Atlas Viewer workflow TBC; Reskinned pages on the Fusion dashboard; Complete & correct available financial, team and work information TBC.",
              "status": "To do",
              "workProgress": {
                "value": 0.01
              },
              "budgetAnchor": {
                "project": "PEA - Protocol Expense Accounting",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "t4wjsoym8u",
                  "parentIdRef": "t4wjsoym8u",
                  "title": "KR01 - Fusion Reskin example designs",
                  "link": "link to a resource referencing a couple of before & after reskin designs/page screenshots "
                },
                {
                  "id": "t4wjsoym8u",
                  "parentIdRef": "t4wjsoym8u",
                  "title": "KR02 - MakerDAO Finances page",
                  "link": "url to finances page on fusion"
                },
                {
                  "id": "t4wjsoym8u",
                  "parentIdRef": "t4wjsoym8u",
                  "title": "KR03 - Fusion prod demo recording",
                  "link": "link to demo recording mid Sep"
                }
              ]
            },
            {
              "id": "t4wjsoym9u",
              "parentIdRef": "luc6t7m18q",
              "code": "PROD2",
              "title": "Production grade deployment of integrated Powerhouse platform.",
              "description": "(scope not final) Production-ready release of an integrated solution comprising Fusion, Switchboard, Connect and Renown where contributor teams can register with their Ethereum identity and manage their own transparency reporting data through the platform. Refactoring work of core products.",
              "status": "To do",
              "workProgress": {
                "value": 0.01
              },
              "budgetAnchor": {
                "project": "PHP - Powerhouse Products POC",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "t4wjsoym9u",
                  "parentIdRef": "t4wjsoym9u",
                  "title": "KR01 - TBD",
                  "link": ""
                },
                {
                  "id": "t4wjsoym9u",
                  "parentIdRef": "t4wjsoym9u",
                  "title": "KR02 - TBD",
                  "link": ""
                },
                {
                  "id": "t4wjsoym9u",
                  "parentIdRef": "t4wjsoym9u",
                  "title": "KR03 - TBD",
                  "link": ""
                }
              ]
            }
          ]
        },
        "coordinators": [
          {
            "id": "1",
            "ref": "Prometheus",
            "name": 'Prometheus',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "2",
            "ref": "Teep",
            "name": 'Teep',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "3",
            "ref": "meraki",
            "name": 'meraki',
            "code": "",
            "imageUrl": ""
          }
        ],
        "contributors": [
          {
            "id": "1",
            "ref": "Powerhouse",
            "name": 'Powerhouse',
            "code": "",
            "imageUrl": ""
          }
        ],
      },
      {
        "id": "r3bzzgbyk2",
        "sequenceCode": "PH04",
        "code": "ATLA",
        "title": "Atlas Viewer v1",
        "description": "Roadmap milestone: Atlas viewer v1. \nMilestone 4, set for Q4, marks the first version of an Atlas document model and viewer in Connect for the Atlas Rulebook.\nDeliverables include: (scope not final) Notion Atlas integration analysis; Atlas document model creation; Atlas viewer USPs exploration.",
        "targetDate": "31/12/2024",
        "scope": {
          "deliverables": [
            {
              "id": "kjjxdnrl1n",
              "parentIdRef": "r3bzzgbyk2",
              "code": "ATLA1",
              "title": "Notion Atlas integration analysis\n",
              "description": "(scope not final) Analysis of the Atlas Axis Notion database setup and identifying how we can pull the data from it, serving as input to creation of document model + viewer.",
              "status": "In progress",
              "workProgress": {
                "value": 0.05
              },
              "budgetAnchor": {
                "project": "ATL - Atlas Rulebook prototype",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "kjjxdnrl1n",
                  "parentIdRef": "kjjxdnrl1n",
                  "title": "KR01 - Atlas integration analysis",
                  "link": "\"link to public Notion Atlas integration analysis\""
                },
                {
                  "id": "kjjxdnrl1n",
                  "parentIdRef": "kjjxdnrl1n",
                  "title": "KR02 - TBD",
                  "link": ""
                },
                {
                  "id": "kjjxdnrl1n",
                  "parentIdRef": "kjjxdnrl1n",
                  "title": "KR03 - TBD",
                  "link": ""
                }
              ]
            },
            {
              "id": "kjjxdnrl2n",
              "parentIdRef": "r3bzzgbyk2",
              "code": "ATLA2",
              "title": "Atlas document model creation",
              "description": "(scope not final) Creation of document model + viewer to replicate the structure of Notion DB.",
              "status": "To do",
              "workProgress": {
                "value": 0.01
              },
              "budgetAnchor": {
                "project": "ATL - Atlas Rulebook prototype",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "kjjxdnrl2n",
                  "parentIdRef": "kjjxdnrl2n",
                  "title": "KR01 - Atlas document model",
                  "link": "\"link to public Atlas document model deployment\""
                },
                {
                  "id": "kjjxdnrl2n",
                  "parentIdRef": "kjjxdnrl2n",
                  "title": "KR02 - Atlas viewer wireframes",
                  "link": "\"link to public Atlas viewer wireframes\""
                },
                {
                  "id": "kjjxdnrl2n",
                  "parentIdRef": "kjjxdnrl2n",
                  "title": "KR03 - TBD",
                  "link": ""
                }
              ]
            },
            {
              "id": "kjjxdnrl3n",
              "parentIdRef": "r3bzzgbyk2",
              "code": "ATLA3",
              "title": "Atlas viewer USPs exploration",
              "description": "(scope not final) Exploration of the Powerhouse Unique Selling Points that will provide the most value to feature’s stakeholders.",
              "status": "To do",
              "workProgress": {
                "value": 0.01
              },
              "budgetAnchor": {
                "project": "ATL - Atlas Rulebook prototype",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "kjjxdnrl3n",
                  "parentIdRef": "kjjxdnrl3n",
                  "title": "KR01 - Business analysis",
                  "link": ""
                },
                {
                  "id": "kjjxdnrl3n",
                  "parentIdRef": "kjjxdnrl3n",
                  "title": "KR02 - Conceptual wireframes with USP candidates",
                  "link": ""
                },
                {
                  "id": "kjjxdnrl3n",
                  "parentIdRef": "kjjxdnrl3n",
                  "title": "KR03 - Demo of Atlas flow",
                  "link": "\"link to Atlas demo recording\""
                }
              ]
            }
          ],
        },
        "coordinators": [
          {
            "id": "1",
            "ref": "Prometheus",
            "name": 'Prometheus',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "2",
            "ref": "Teep",
            "name": 'Teep',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "3",
            "ref": "meraki",
            "name": 'meraki',
            "code": "",
            "imageUrl": ""
          }
        ],
        "contributors": [
          {
            "id": "1",
            "ref": "Powerhouse",
            "name": 'Powerhouse',
            "code": "",
            "imageUrl": ""
          }
        ],
      },
      {
        "id": "fn7f9sea7u",
        "sequenceCode": "PH05",
        "code": "SPIN",
        "title": "Powerhouse Spin-off",
        "description": "Roadmap milestone: Powerhouse spin-off creation. \nMilestone 5, set for Q4, marks the research, modelling and the creation of  Powerhouse Spin-off. Deliverables include: legal entity setup; business modeling; OCF structuring & contributor; Powerhouse software integration; token modelling; new customers; public comms.",
        "targetDate": "31/12/2024",
        "deliverables": [
          {
            "id": "dn2z901pbv",
            "parentIdRef": "fn7f9sea7u",
            "code": "SPIN1",
            "title": "Legal entity setup",
            "description": "(scope not final) Research and setup of legal entities",
            "status": "In progress",
            "workProgress": {
              "value": 0.3
            },
            "budgetAnchor": {
              "project": "PLS - Powerhouse legal structuring",
              "workUnitBudget": 0,
              "deliverableBudget": 0
            },
            "owner": {
              "id": "1",
              "ref": "Powerhouse",
              "name": "Powerhouse",
              "code": "PH",
              "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
            },
            "keyResults": [
              {
                "id": "dn2z901pbv",
                "parentIdRef": "dn2z901pbv",
                "title": "KR01 - Layer0x on PH legal research - Power Brunch",
                "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=160s"
              },
              {
                "id": "dn2z901pbv",
                "parentIdRef": "dn2z901pbv",
                "title": "KR02 - TBD",
                "link": ""
              },
              {
                "id": "dn2z901pbv",
                "parentIdRef": "dn2z901pbv",
                "title": "KR03 - TBD",
                "link": ""
              }
            ]
          },
          {
            "id": "dn2z902pbv",
            "parentIdRef": "fn7f9sea7u",
            "code": "SPIN2",
            "title": "Business model templates",
            "description": "(scope not final) business modelling work including Powerhouse infrastructure stack & decentralized operations model",
            "status": "In progress",
            "workProgress": {
              "value": 0.3
            },
            "budgetAnchor": {
              "project": "PLS - Powerhouse legal structuring",
              "workUnitBudget": 0,
              "deliverableBudget": 0
            },
            "owner": {
              "id": "1",
              "ref": "Powerhouse",
              "name": "Powerhouse",
              "code": "PH",
              "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
            },
            "keyResults": [
              {
                "id": "dn2z902pbv",
                "parentIdRef": "dn2z902pbv",
                "title": "KR01 - T on PH tech stack - Power Brunch",
                "link": "https://www.youtube.com/watch?v=5GnRqdoXt8o&t=1490s"
              },
              {
                "id": "dn2z902pbv",
                "parentIdRef": "dn2z902pbv",
                "title": "KR02 - Prometheus on PH business model - Power Brunch",
                "link": "https://www.youtube.com/watch?v=tH0yb-lMsZ4"
              },
              {
                "id": "dn2z902pbv",
                "parentIdRef": "dn2z902pbv",
                "title": "KR03 -TBD",
                "link": ""
              }
            ]
          },
          {
            "id": "dn2z903pbv",
            "parentIdRef": "fn7f9sea7u",
            "code": "SPIN3",
            "title": "OCF + compensation",
            "description": "(scope not final) Work out the OCF structure and the contributor compensation model",
            "status": "In progress",
            "workProgress": {
              "value": 0.15
            },
            "budgetAnchor": {
              "project": "PLS - Powerhouse legal structuring",
              "workUnitBudget": 0,
              "deliverableBudget": 0
            },
            "owner": {
              "id": "1",
              "ref": "Powerhouse",
              "name": "Powerhouse",
              "code": "PH",
              "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
            },
            "keyResults": [
              {
                "id": "dn2z903pbv",
                "parentIdRef": "dn2z903pbv",
                "title": "KR01 - TBD",
                "link": ""
              },
              {
                "id": "dn2z903pbv",
                "parentIdRef": "dn2z903pbv",
                "title": "KR02 - TBD",
                "link": ""
              },
              {
                "id": "dn2z903pbv",
                "parentIdRef": "dn2z903pbv",
                "title": "KR03 -TBD",
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
            "status": "In progress",
            "workProgress": {
              "value": 0.8
            },
            "budgetAnchor": {
              "project": "ARB - Arbitrum reporting prototype ",
              "workUnitBudget": 0,
              "deliverableBudget": 0
            },
            "owner": {
              "id": "1",
              "ref": "Powerhouse",
              "name": "Powerhouse",
              "code": "PH",
              "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
            },
            "keyResults": [
              {
                "id": "dn2z904pbv",
                "parentIdRef": "dn2z904pbv",
                "title": "KR01 - Arbitrum LTIPP grants editor ",
                "link": "URL"
              },
              {
                "id": "dn2z904pbv",
                "parentIdRef": "dn2z904pbv",
                "title": "KR02 - TBD",
                "link": ""
              },
              {
                "id": "dn2z904pbv",
                "parentIdRef": "dn2z904pbv",
                "title": "KR03 -TBD",
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
            "status": "In progress",
            "workProgress": {
              "value": 0.2
            },
            "budgetAnchor": {
              "project": "PRC - Powerhouse release comms",
              "workUnitBudget": 0,
              "deliverableBudget": 0
            },
            "owner": {
              "id": "1",
              "ref": "Powerhouse",
              "name": "Powerhouse",
              "code": "PH",
              "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
            },
            "keyResults": [
              {
                "id": "dn2z905pbv",
                "parentIdRef": "dn2z905pbv",
                "title": "KR13 - Twitter thread Power brunch 1 ",
                "link": "https://x.com/PowerhouseDAO/status/1801283667651621155"
              },
              {
                "id": "dn2z905pbv",
                "parentIdRef": "dn2z905pbv",
                "title": "KR14 - Twitter thread Power brunch 2",
                "link": "https://x.com/PowerhouseDAO/status/1801623398075736470"
              },
              {
                "id": "dn2z905pbv",
                "parentIdRef": "dn2z905pbv",
                "title": "KR14 - Twitter thread Power brunch 3",
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
            "status": "In progress",
            "workProgress": {
              "value": 0.15
            },
            "budgetAnchor": {
              "project": "PLS - Powerhouse legal structuring",
              "workUnitBudget": 0,
              "deliverableBudget": 0
            },
            "owner": {
              "id": "1",
              "ref": "Powerhouse",
              "name": "Powerhouse",
              "code": "PH",
              "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
            },
            "keyResults": [
              {
                "id": "dn2z906pbv",
                "parentIdRef": "dn2z906pbv",
                "title": "KR01- PowerhouseDAO tokenomics?",
                "link": ""
              },
              {
                "id": "dn2z906pbv",
                "parentIdRef": "dn2z906pbv",
                "title": "KR02 - TBD",
                "link": ""
              },
              {
                "id": "dn2z906pbv",
                "parentIdRef": "dn2z906pbv",
                "title": "KR03 -TBD",
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
            "status": "To do",
            "workProgress": {
              "value": 0.0
            },
            "budgetAnchor": {
              "project": "?",
              "workUnitBudget": 0,
              "deliverableBudget": 0
            },
            "owner": {
              "id": "1",
              "ref": "Powerhouse",
              "name": "Powerhouse",
              "code": "PH",
              "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
            },
            "keyResults": [
              {
                "id": "dn2z907pbv",
                "parentIdRef": "dn2z907pbv",
                "title": "KR01- publicly shareable agreement info?",
                "link": ""
              },
              {
                "id": "dn2z907pbv",
                "parentIdRef": "dn2z907pbv",
                "title": "KR02 - Next steps forum update?",
                "link": ""
              },
              {
                "id": "dn2z907pbv",
                "parentIdRef": "dn2z907pbv",
                "title": "KR03 -TBD",
                "link": ""
              }
            ]
          }
        ],
        "coordinators": [
          {
            "id": "1",
            "ref": "Prometheus",
            "name": 'Prometheus',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "2",
            "ref": "Teep",
            "name": 'Teep',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "3",
            "ref": "meraki",
            "name": 'meraki',
            "code": "",
            "imageUrl": ""
          },
          {
            "id": "4",
            "ref": "Layer0x",
            "name": 'Layer0x',
            "code": "",
            "imageUrl": ""
          }
        ],
        "contributors": [
          {
            "id": "1",
            "ref": "Powerhouse",
            "name": 'Powerhouse',
            "code": "",
            "imageUrl": ""
          }
        ],
      },
      {
        "id": "jeu5fu3ncc",
        "sequenceCode": "PH06",
        "code": "PMC",
        "title": "MakerDAO PM Consultancy",
        "description": "Roadmap milestone: MakerDAO Project Management Consultancy. \nMilestone 6, set for Q4, marks the PM advisory and consultancy work for MakerDAO. Deliverables include: Endgame advisory & Operations coordination; Management & delivery of Pointable AI SOW1; related OCF work & management.",
        "targetDate": "31/12/2024",
        "scope": {
          "deliverables": [
            {
              "id": "c3vcxkuo41",
              "parentIdRef": "jeu5fu3ncc",
              "code": "PMC1",
              "title": "Endgame advisory & coordination",
              "description": "Endgame advisory and Operational roadmap coordination (Wouter)",
              "status": "In progress",
              "workProgress": {
                "value": 0.01
              },
              "budgetAnchor": {
                "project": "?",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "c3vcxkuo41",
                  "parentIdRef": "c3vcxkuo41",
                  "title": "KR01- can we share anything publicly?",
                  "link": ""
                },
                {
                  "id": "c3vcxkuo41",
                  "parentIdRef": "c3vcxkuo41",
                  "title": "KR02 - TBD",
                  "link": ""
                },
                {
                  "id": "c3vcxkuo41",
                  "parentIdRef": "c3vcxkuo41",
                  "title": "KR03 -TBD",
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
              "status": "In progress",
              "workProgress": {
                "value": 0.01
              },
              "budgetAnchor": {
                "project": "?",
                "workUnitBudget": 0,
                "deliverableBudget": 0
              },
              "owner": {
                "id": "1",
                "ref": "Powerhouse",
                "name": "Powerhouse",
                "code": "PH",
                "imageUrl": "https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png"
              },
              "keyResults": [
                {
                  "id": "c3vcxkuo42",
                  "parentIdRef": "c3vcxkuo42",
                  "title": "KR01- public Pointable progress reference?",
                  "link": ""
                },
                {
                  "id": "c3vcxkuo42",
                  "parentIdRef": "c3vcxkuo42",
                  "title": "KR02 - TBD",
                  "link": ""
                },
                {
                  "id": "c3vcxkuo42",
                  "parentIdRef": "c3vcxkuo42",
                  "title": "KR03 -TBD",
                  "link": ""
                }
              ]
            }
          ],
        },        
        "coordinators": [{
          "id": "1",
          "ref": "Prometheus",
          "name": 'Prometheus',
          "code": "",
          "imageUrl": ""
        }],
        "contributors": [
          {
            "id": "1",
            "ref": "Powerhouse",
            "name": 'Powerhouse',
            "code": "",
            "imageUrl": ""
          }
        ],
      }
    ]
  }
]
