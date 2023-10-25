export const stubData = [
    {
        id: 1,
        owner: {
            ref: "EcosystemActor",
            id: 1,
            imgUrl: "http://...",
            name: "some name",
            code: "some-code",
        },
        supporter: {
            ref: "EcosystemActor",
            id: 3,
            imgUrl: "http://...",
            name: "some name",
            code: "some-code",
        },
        code: "PA-1",
        title: "Project Alpha",
        abstract: "This is the first project of Phoenix Labs.",
        status: "INPROGRESS",
        progress: {
            status: "INPROGRESS",
            indication: {
                value: 0.75
            }
        },
        imgUrl: "https://example.com/project-alpha.png",
        budgetType: "OPEX",
        deliverables: [
            {
                id: 1,
                title: "Frontend Development",
                status: "DELIVERED",
                owner: {
                    ref: "EcosystemActor",
                    id: 1,
                    imgUrl: "http://...",
                    name: "some name",
                    code: "some-code",
                },
                keyResults: [
                    {
                        id: 1,
                        title: "Complete Landing Page",
                        link: "https://example.com/landing-page"
                    }
                ]
            },
            {
                id: 2,
                title: "Backend Development",
                status: "INPROGRESS",
                owner: {
                    ref: "EcosystemActor",
                    id: 1,
                    imgUrl: "http://...",
                    name: "some name",
                    code: "some-code",
                },
                keyResults: [
                    {
                        id: 2,
                        title: "Setup Authentication",
                        link: "https://example.com/auth-docs"
                    },
                    {
                        id: 3,
                        title: "REST API Endpoints",
                        link: "https://example.com/api-docs"
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        owner: {
            ref: "EcosystemActor",
            id: 1,
            imgUrl: "http://...",
            name: "some name",
            code: "some-code",
        },
        supporter: {
            ref: "EcosystemActor",
            id: 3,
            imgUrl: "http://...",
            name: "some name",
            code: "some-code",
        },
        code: "PB-2",
        title: "Project Beta",
        abstract: "This is the second project of Phoenix Labs.",
        status: "TODO",
        progress: {
            status: "TODO",
            indication: {
                value: 0.75
            }
        },
        imgUrl: "https://example.com/project-beta.png",
        budgetType: "CAPEX",
        deliverables: [
            {
                id: 3,
                title: "Database Setup",
                status: "TODO",
                owner: {
                    ref: "EcosystemActor",
                    id: 1,
                    imgUrl: "http://...",
                    name: "some name",
                    code: "some-code",
                },
                keyResults: []  //no key results yet
            }
        ]
    }
];

export const supportedProjects = {
    id: 4,
    owner: {
        ref: "owner-ref",
        id: 1,
        imgUrl: "http://...",
        name: "some name",
        code: "some-code",
    },
    supporter: {
        ref: "supporter-ref",
        id: 2,
        imgUrl: "http://...",
        name: "some name",
        code: "some-code",
    },
    code: "EB-1",
    title: "Endgame Budgeting",
    abstract: "This is a project owned by another team but supported by Phoenix Labs.",
    status: "INPROGRESS",
    progress: 0.7,
    imgUrl: "https://example.com/endgame-budgeting.png",
    budgetType: "OPEX",
    deliverables: [
        {
            id: 1,
            title: "Frontend Development",
            status: "DELIVERED",
            ownerId: 2,
            keyResults: [
                {
                    id: 1,
                    title: "Complete Landing Page",
                    link: "https://example.com/landing-page"
                }
            ]
        },
        {
            id: 2,
            title: "Backend Development",
            status: "INPROGRESS",
            ownerId: 2,
            keyResults: [
                {
                    id: 2,
                    title: "Setup Authentication",
                    link: "https://example.com/auth-docs"
                }
            ]
        },
        {
            id: 3,
            title: "Integration",
            status: "INPROGRESS",
            ownerId: 5,
            keyResults: [
                {
                    id: 1,
                    title: "Legacy Integration",
                    link: "https://example.com/legacy-docs"
                }
            ]
        }
    ]
};