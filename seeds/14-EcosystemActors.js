/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps

export async function seed(knex) {

    // Inserting new Ecosystem Actors
    const ecosystemActors = await knex('CoreUnit').insert([{
            code: 'L2B-001',
            shortCode: 'L2B',
            name: 'L2BEAT',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: 'L2BEAT is the leading Layer Two development and research company focusing on multichain scaling solutions across a variety of blockchains.',
            paragraphDescription: `# **About Us** #
    We are the team behind the L2BEAT.com 5 site and have intimate knowledge of Maker’s bridging and teleport capabilities as our team members have directly worked on this both within and alongside the former Protocol Engineering Core Unit.

    With the following proposal, L2BEAT would like to use their technical expertise to support Maker’s Multichain opportunities.

    ## L2BEAT’s Proposal to Maker Governance ##

    In light of Maker’s recent onboarding of the Endgame and Scope Frameworks, various community members and 3rd party participants have requested clarity regarding Maker’s Layer Two plans. As a professional ecosystem actor, L2BEAT proposes to work on these challenges for both Maker Core as well as offering SubDAO support as necessary. This involves both near term and long term, aspirational elements.

    Near term work involves reaching a resolution following PECU’s Multichain Strategy Update, and longer term efforts involve deeper research work for aspirational maker chain development.

    As per the Engineering Multichain budget (Section 7.1), L2BEAT is requesting an annual 1.55M DAI streamed monthly, expiring at the end of June 2024.

    ## Scope ##

    As part of this proposal, L2BEAT aims to:
    - Work with relevant stakeholders, including Maker holders, SubDAOs and other Ecosystem Actors, to deliver an updated MultiChain strategy with regards to:

        -- The usage of Canonical DAI and Canonical Bridges (currently deployed on Optimism, Arbitrum, zkSync, StarkNet)
        -- Providing clear guidance if Maker should support Canonical DAI on new chains or if the use of “wrapped DAI” is acceptable
        -- Developing the future roadmap of governance relays that are currently used to relay governance spells to L2 contracts
        -- Exploring the future roadmap of Maker Teleport - the facility allowing for fast withdrawals of DAI from L2s
        -- Exploring the future roadmap of dss-bridge - the facility meant to allow for fast teleport of DAI to any chain and for direct DAI minting on L2 if Maker VAT was to be deployed on L2 (which, with the current strategy, is not being considered)
        -- Work on interoperability aspects and design for the future MakerChain, especially with a focus on trustless bridging from whatever chain will be used to implement the MakerChain to chains where DAI is actually used (primarily Ethereum, but theoretically other chains as well)
    - Perform oversight on the future deployments of bridges, gov-relays, teleport, etc. depending on the approved version of the new MultiChain strategy, including help reviewing L2 spells
    - Continue currently paused talks with Base, Scroll, Polygon and other rollups/chains

    Note that the scope of work does not include smart contract deployment (other than eventual prototyping), unit and integration testing, coordination of auditing process, bug bounty programs or subsequent maintenance of smart contract infrastructure. We assume that this work (with our oversight) will be performed by other Ecosystem Actors specializing in smart contract development and maintenance.

    L2BEAT is a respected member of the DeFi ecosystem and would feel privileged to bring its expertise to the Maker ecosystem to help Maker scale in a safe manner. We welcome the community’s consideration and vote on our proposal.
                `
        },
        {
            code: 'BAL-001',
            shortCode: 'BAL',
            name: 'BALabs',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: 'BA Labs provides a critical and clear understanding of the fast moving market dynamics in the DeFi ecosystem.',
            paragraphDescription: `# **About Us** #

            The experience, skills, and professional expertise offered by our teams, enables BA Labs to meet the needs of different protocols, applications, and DAOs in the Maker ecosystem. We work in a variety of domains, including: consulting, dashboard development, improving data accessibility, data platform as a service, risk analysis, protocol assessments, and risk modeling.
            
            Our products, services, and priorities going forward are highlighted below.
            
            ### Endgame Scope Parameter Monitoring ###
            
            Following our recent merger with DICU, we plan to incorporate additional information, such as Maker Teleport statistics and Maker governance data. This will serve as a useful tool to track a variety of protocol and governance changes, including: risk parameters, governance decisions, and an overview of the financial landscape of the Maker ecosystem.
            
            
            ### Dashboards: Ongoing Maintenance and Developments ###
            
            BA Labs currently maintains three critical dashboards related to the Maker Protocol
            
            ### Planned Improvements ###
            
            Relevant Endgame data and parameters will be added to the Maker Risk Dashboard and Makerburn dashboard. 
            
            ### SubDAO Data Insights and Support ###
            
            BA Labs offers the development and maintenance of sophisticated financial risk monitoring dashboards specifically tailored to the requirements of SubDAO projects.
            
            ### Governance & Data Accessibility support ###
            
            As continuation to the work of DICU, BA labs offers a free & public data api as well ad-hoc analysis and reporting to support governance and technical functions, such as delegate compensation calculations. Extending to the future needs of AVCs and Scopes.
            
            ### Risk Monitoring & Parameter Proposals ###
            
            Since 2019, BA Labs’ risk monitoring and risk mitigation strategies have been essential in maintaining Dai as the largest decentralized stablecoin in the Ethereum DeFi ecosystem. Demand for Dai has remained high, despite challenging, uncertain, and volatile market conditions in certain periods of 2022 and 2023. We believe that a key reason for this is the confidence that Dai holders have in MakerDAO’s smart contracts and risk mitigated collateral management provided by the @Risk-Core-Unit (BA Labs) as well as contributions of other MakerDAO teams.
            
            ### Consultancy ###
            
            - Scope Language and Content
            - Risk Modeling
            - Asset Liability Management (ALM)
                `
        },
        {
            code: 'PH-001',
            shortCode: 'PH',
            name: 'Powerhouse',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: '',
            paragraphDescription: `
                # **About Us** #
                The new Powerhouse team plans to use its extensive knowledge and experience from its SES and Maker Foundation days to contribute to the development of efficient and scalable decentralized organizations. It aims to work not just for MakerDAO and its subDAOs, but as a fully independent service provider for the wider industry.

                ### Services Offering ###

                As an Ecosystem Actor, Powerhouse will offer three categories of paid consultancy services. These services will span a variety of operational areas going from project management, to finances and transparency reporting, to legal-operational matters.

                #### Decentralized org design and business process analysis ####

                Open and decentralized organizations are an emerging paradigm that can be difficult to get right at first. MakerDAO has been one of the biggest pioneering experiments so far, achieving some successes but also laying bare the various challenges that these organizations may face.

                #### Open-source software development ####

                Software is a key factor that can easily determine the success or failure of open and decentralized organizations. To be successful, these organizations essentially need to trade traditional management oversight and extensive training programs with automated processes on their operational platform.

                ### Operational support and coordination ####

                One of the challenges of decentralized organizations is that they can introduce a lot of inefficiencies by forcing the contributor teams to take care of operational overhead tasks outside of their core competencies.
                    `
        },
        {
            code: 'CHL-001',
            shortCode: 'CH',
            name: 'Chronicle Labs',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: 'Chronicle Labs is the developer of the Chronicle Protocol, a sustainable decentralized infrastructure primitive encompassing Oracles, bridges, and cross-chain communication that is purpose-built to maximize scalability, security, transparency, and resiliency.',
            paragraphDescription: `# **About Us** #
    The Chronicle Protocol secures the Maker Protocol and its growing SubDAO ecosystem to ensure the integrity of the Maker Protocol and expedite its course towards the Endgame. Chronicle Labs will utilize the 12-month incubation period to position itself to sustainably provide services to the SubDAO ecosystem for the long term. Through leveraging Chronicle, SubDAOs gain seamless access to battle-tested Oracle infrastructure, averting the need to waste resources reinventing the wheel, and enabling them to focus their full attention on building successful products.

    ### Goals ###

    1. Launch a sustainable, secure, and decentralized oracle protocol and infrastructure service provider which supports the needs of SubDAOs. 
    2. Raise private capital and cease any further direct funding from MakerDAO.
                `
        },
        {
            code: 'JST-001',
            shortCode: 'JST',
            name: 'Jetstream',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: ' We build open-source components & infrastructure for resilient DeFi frontends. Our mission is to make the DeFi space more resilient against outages, attacks and censorship by innovating on frontend code, app delivery methods, data handling & UX.',
            paragraphDescription: `# **About Us** #
    ### Future Vision for Jetstream ###
    In the longer term, after delivery of the Launch Project as part of the Accessibility Scope, we have the following vision for our Ecosystem Actor as part of this ecosystem:

    ### Further contribute to Maker core projects ###

    As we progress on launching Endgame-related milestones we’ll continue proposing additional projects related to Maker core, for the scopes to consider.

    ### Serving the Accessibility scope ###

    As one of the first Ecosystem Actors working under the Accessibility scope, we aim to serve the scope and help it bootstrap its first set of functional and non-functional requirements for frontends in the NewDAO ecosystem.

    ### Adopt project-based financial reporting ###

    We’re committed to adopting improved processes related to budgeting and financial reporting, bringing the DAO closer to project-based budgeting.

    ### Start partnerships with SubDAOs and other Ecosystem Actors ###

    As we deliver value for Maker core and as SubDAOs flourish into their own distinct brands and businesses we will strive to build partnerships with them and further diversify our project roadmap.

    ### Contribute to other web3 projects and share ###

    We aim to share our learnings, knowledge and code with the entire web3 space, in order to make the DeFi space more resilient.                
                `
        },
        {
            code: 'DP-001',
            shortCode: 'DP',
            name: 'DevPool',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: 'DevPool allows developers to find and get paid for jobs they are interested and qualified in while allowing project managers to outsource tasks to qualified talent on demand.',
            paragraphDescription: `# **About Us** #
    Being purpose-built on top of Github, DevPool retains an open source ethos with a focus on increasing operational efficiencies, accountability, and maintaining transparent community building that are all the cornerstones of the Ethereum developer ecosystem.
                `
        },
        {
            code: 'PL-001',
            shortCode: 'PL',
            name: 'PullUp Labs',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: 'The PullUp Labs team, formed from senior ex-PECU engineers, is proposed as an Ecosystem Actor for implementing code for MakerDAO. The team’s deliverables will focus on the governance-approved Endgame plan.',
            paragraphDescription: `# **About Us** #
    The Endgame proposal interacts with critical system components, including the DAI and MKR tokens, Vat balances, Chief contract, Flapper module, Emergency Shutdown module, voter proxies, and more. Working safely with these components requires a deep understanding of the Maker protocol. This team has collectively spent 10+ years building and maintaining the protocol and knows it inside and out. The team has worked on essentially every area of the Maker on-chain stack (MCD core, D3M modules, L2 bridges, DSProxy, CdpManager).

    ### Scope of Work ###

    The team will initially focus on building the software for the following DAO-devised Endgame products:

    - Smart Burn Engine.
    - Tokens rebranding initiatives.
    - Savings rate referrals and enhancements.
    - Governance migration contracts.
    - Sagittarius Engine implementation.
    - SubDAO tokenomics support.
    - MakerDAO chain development.

    The above scope may be adjusted to include other future Endgame mechanisms if priorities change.

    ### Responsibilities ###

    The team’s deliverables will span the following stages of module development:

    - Research & Inception - definition of use cases for correct implementation.
    - Technical Design & Architecture - to align technical functions with user needs.
    - Proof of Concept Coding - initial implementation to ascertain interfaces.
    - Development & Implementation - coding and documentation.
    - Testing and internal review - including formal verification.
    - External Audits - adjustments, updates, and necessary maintenance.
    - Alignment with marketing and business development.                
                `
        },
        {
            code: 'PHL-001',
            shortCode: 'PHL',
            name: 'Phoenix Labs',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: 'Phoenix Labs is a research and development company created to introduce new decentralized products into the Maker Ecosystem. Our mission is to help MakerDAO grow and innovate in the decentralized realm.',
            paragraphDescription: `# **About Us** #
    MakerDAO will own every product that Phoenix Labs creates; therefore, they will inherit Maker’s already well-established governance system. Maker Governance will administer all smart contracts with polls to adjust system parameters and add new collateral.

    Once the Creator subDAO model is established, Spark Protocol can be transitioned to one of them.

    ### Our values ###

    - Value Sharing: Phoenix Labs is committed to building a healthy and sustainable developer ecosystem through value sharing models such as retroactive payment for public goods.
    - Plug and Play Model: Phoenix Labs plans to make all code open, owned by MakerDAO, and available for use by other teams under a revenue share agreement using the “Plug and Play” model of the Endgame proposal. It is one of our goals to provide a core toolbox that other subDAOs or Ecosystem Actors to build upon.
    - Continuous Innovation: Phoenix Labs wants to help Maker consolidate its position as the DeFi leading platform by integrating new and exciting solutions including everything Endgame will bring.
    - DAI-centric: Everything Phoenix Labs will build will have DAI as the centerpiece.
    `
        },
        {
            code: 'VPAC-001',
            shortCode: 'VPAC',
            name: 'Viridian Protector Advisory Company',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: 'The Group consists of ecosystem actors the Viridian Allocator Advisor as well as service based partners. This Group proposes to continue to work in partnership and provide advice & support for the development of the RWA roadmap for MakerDAO. And build on the learnings to date from RWA projects, in particular MIP65 which has led to the implementation of the James Asset Trust (JAT) structure , facilitated the largest RWA allocation for MakerDAO and added a significant revenue driver for the protocol.',
            paragraphDescription: `# **About Us** #
    We are experiencing pivotal times for the crypto industry, with increasing regulatory oversight, institutional adoption/competition and blurring of the lines between DeFi and TradFi ecosystems.
    Our immediate focus areas are to support enhancements to the James Asset Trust (JAT) structure for this evolving market reality;

    - JAT Structural enhancements ( ie onboarding of new payments & exchange service providers for operational resilience )
    - Legal & Regulatory - JAT legal structure maintenance and regulatory review of alternative Trust jurisdictions
    - Process Automation & migration of components of the structure “On-Chain”, explore Tokenization options.
    - Pipeline development for new arrangers & allocation opportunities ( as determined via the Stability scope framework )
    - Support MakerDao Endgame organizational restructuring process

    ### Our Values ###

    - Humility : We relish the challenge of building at the intersection of DeFi & TradFi with no real rule book to follow and learning in the process !
    - Passionate : About Financial Markets & DeFi, and being part of the journey to build a better Financial system on-chain.
    - Result Driven : We work through the challenges and remain focussed on delivering value for the Maker protocol and community.
    `
        },
        {
            code: 'STEAK-001',
            shortCode: 'STEAK',
            name: 'Steakhouse',
            category: '{ScopeFacilitator}',
            type: 'EcosystemActor',
            sentenceDescription: 'Our seasoned team of crypto-native collaborators brings a wealth of expertise in financial advisory, strategic planning, investment banking, analytics, accounting, legal research, and coding to help your DAO navigate the challenges and opportunities of the decentralized economy.',
            paragraphDescription: `# **About Us** #
    ### Financial Planning & Analysis ###
    Our financial statements are built from the ground up, leveraging the transparency and immutability of the blockchain.

    This allows us to provide highly customizable financial reporting that's tailored to the unique needs of your DAO community

    ### DAO Operations ###

    Transitioning from a centralized organization to a fully-fledged DAO is messy and fraught with challenges that Steakhouse has successfully tackled first hand.

    We partner with our clients to build transition plans to ensure operations continuity and scalability, and then execute on them relentlessly.

    ### Strategic Advisory ### 

    Steakhouse has significant experience negotiating Commercial deals, partnerships and advising on tokenomics with the largest companies and DAOs in the the industry.

    We also spearheaded the onboarding of the largest Real World Assets (”RWA”) in the industry, and vigorously fight for our clients’ interests.
    `
        }
    ]).returning('*');

    // Inserting new Social Media Channels
    await knex('SocialMediaChannels').insert([{
            cuId: ecosystemActors[0].id,
            forumTag: 'https://forum.makerdao.com/u/l2beat/summary',
            twitter: 'https://twitter.com/l2beat',
            discord: 'https://discord.gg/eaVKXPmtWk',
            website: "https://l2beat.com",
            github: 'https://github.com/l2beat',

        },
        {
            cuId: ecosystemActors[1].id,
            forumTag: 'https://forum.makerdao.com/t/professional-ecosystem-actor-introduction-ba-labs/20813',
            twitter: 'https://twitter.com/BlockAnalitica',
            discord: 'https://discord.com/channels/893112320329396265/897513189711937608',
            website: "https://blockanalitica.com/",
            github: 'https://github.com/blockanalitica',
        },
        {
            cuId: ecosystemActors[2].id,
            forumTag: 'https://forum.makerdao.com/t/professional-ecosystem-actor-introduction-powerhouse/21057',
            twitter: 'https://twitter.com/PowerhouseDAO',
            discord: 'https://discord.com/invite/h7GKvqDyDP',
            website: "https://www.powerhouse.inc",
            github: 'https://github.com/makerdao-ses',
        },
        {
            cuId: ecosystemActors[3].id,
            forumTag: 'https://forum.makerdao.com/t/professional-ecosystem-actor-introduction-chronicle-labs/21053',
            twitter: 'https://twitter.com/ChronicleLabs',
            discord: 'https://discord.gg/CjgvJ9EspJ',
            website: "https://chroniclelabs.org",
            github: '',
        },
        {
            cuId: ecosystemActors[4].id,
            forumTag: 'https://forum.makerdao.com/t/professional-ecosystem-actor-introduction-jetstream/21054',
            twitter: 'https://twitter.com/jetstreamgg',
            discord: 'https://discord.gg/3qy8e2Q8',
            website: "https://dux.makerdao.network",
            github: 'https://github.com/makerdao-dux',
        },
        {
            cuId: ecosystemActors[5].id,
            forumTag: 'https://forum.makerdao.com/t/professional-ecosystem-actor-intro-devpool/20895',
            twitter: 'https://twitter.com/UbiquityDAO',
            discord: 'https://discord.com/invite/SjymJ5maJ4',
            website: "https://dao.ubq.fi/devpool",
            github: 'https://github.com/ubiquity',
        },
        {
            cuId: ecosystemActors[6].id,
            forumTag: 'https://forum.makerdao.com/u/pulluplabs/summary',
            twitter: '',
            discord: 'https://discord.gg/3qy8e2Q8',
            website: '',
            github: 'https://github.com/makerdao',
        },
        {
            cuId: ecosystemActors[7].id,
            forumTag: 'https://forum.makerdao.com/u/phoenixlabs/summary',
            twitter: 'https://twitter.com/spark_protocol',
            discord: 'https://discord.gg/EHyhp3aCFz',
            website: "https://www.sparkprotocol.io/",
            github: 'https://github.com/marsfoundation/'
        },
        {
            cuId: ecosystemActors[8].id,
            forumTag: 'https://forum.makerdao.com/u/viridian/summary',
            twitter: '',
            discord: '',
            website: "",
            github: ''
        },
        {
            cuId: ecosystemActors[9].id,
            forumTag: 'https://forum.makerdao.com/u/steakhouse/summary',
            twitter: 'https://twitter.com/SteakFi',
            discord: 'https://discord.gg/kmHe4wNcZy',
            website: "https://steakhouse.financial/",
            github: ''
        }
    ]);

    const scopesToAdd = [{
            shortCode: 'L2B',
            scopes: ['Protocol Scope']
        },
        {
            shortCode: 'BAL',
            scopes: ['Stability Scope']
        },
        {
            shortCode: 'PH',
            scopes: ['Support Scope']
        },
        {
            shortCode: 'CH',
            scopes: ['Protocol Scope']
        },
        {
            shortCode: 'JST',
            scopes: ['Accessibility Scope']
        },
        {
            shortCode: 'DP',
            scopes: ['Support Scope']
        },
        {
            shortCode: 'PL',
            scopes: ['Protocol Scope', 'Support Scope']
        },
        {
            shortCode: 'PHL',
            scopes: ['Support Scope']
        },
        {
            shortCode: 'VPAC',
            scopes: ['Support Scope']
        },
        {
            shortCode: 'STEAK',
            scopes: ['Stability Scope']
        },
        {
            shortCode: 'SAS',
            scopes: ['Support Scope', 'Protocol Scope']
        },
        {
            shortCode: 'SES',
            scopes: ['Support Scope', 'Protocol Scope', 'Stability Scope']
        },
        {
            shortCode: 'GOV',
            scopes: ['Governance Scope']
        },
        {
            shortCode: 'GRO',
            scopes: ['Accessibility Scope']
        },
        {
            shortCode: 'TECH',
            scopes: ['Support Scope', 'Accessibility Scope', 'Governance  Scope']
        }
    ]

    // // Adding categories to selected CUs
    await knex('CoreUnit').update({
        category: '{ScopeFacilitator}'
    }).whereIn('shortCode', ['SAS', 'SES', 'GOV', 'GRO', 'TECH']).returning('*');

    // Adding Scopes to Ecosystem Actors
    for (const scope of scopesToAdd) {
        const [{
            id
        }] = await knex.select('id').from('CoreUnit').where('shortCode', scope.shortCode)
        const scopes = await knex('AlignmentScope').whereIn('name', scope.scopes);
        await knex('ContributorTeam_AlignmentScope').insert(scopes.map((scope) => ({
            teamId: id,
            scopeId: scope.id
        })));
    }

}