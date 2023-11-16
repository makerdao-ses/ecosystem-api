/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//Add AlignedDelegates and DEWIZ Ecosystem Actor

export async function seed(knex) {
  await knex("CoreUnit").insert({
    code: "ALD-001",
    shortCode: "ALD",
    name: "Aligned Delegates",
    type: "AlignedDelegates",
  });

  const [dewizCuId] = await knex("CoreUnit")
    .insert({
      code: "DEWIZ-001",
      shortCode: "DEWIZ",
      name: "Dewiz",
      image:
        "https://makerdao-ses.github.io/ecosystem-dashboard/core-units/dewiz-001/dewiz_logo.png",
      category: "{Technical}",
      sentenceDescription:
        "Dewiz is a team of engineers with a proven track record of delivering high-quality, secure, and reliable smart contracts for the premier DeFi projects.",
      paragraphDescription: `# **About Us**

        Dewiz DeFi Engineering Services provides organizations flexible access to battle-tested smart contract engineers that confront the wizardry of DeFi protocols.
        
        DeFi concepts and strategies can be complex. Turning these ideas into reality using ground-breaking and evolving technology only compounds the challenges. For organizations struggling to master smart contract development or those that prefer a turnkey experience when navigating smart contracts, Dewiz offers a full suite of services to support any DeFi-related project on Ethereum, L2s, and many EVM-compatable chains.
        
        # **Services offered**
        
        Dewiz gives your project smart contract engineers to utilize as much (or as little) as you need, for every aspect of the development lifecycle. Dewiz provides on-demand services for ideation, innovation, and tailored solution design in addition to writing the actual code. The team is committed to maintaining the highest standards of quality and security in all of its work.
        
        **Smart Contract Operations**
        
        Smart contract operations are typically focused on using, maintaining, and improving the functionality of existing smart contracts. This includes writing Spells, reviewing and testing code, monitoring the performance of smart contracts, and responding to issues or bugs as they arise.
        
        A key-engagement point for Dewiz in the Maker ecosystem is the authoring of Spells for common and novel use cases at MakerDAO. Dewiz is excited for the opportunity to grow alongside the needs of SubDAOs for Spell related tasks and aims to create enhancements for our clients as the demand for this service grows and takes shape operationally.
        
        **Smart Contract Product Development**
        
        Smart contract development encompasses creating new smart contracts and implementing new features and functionality. This involves designing, architecting, writing code, testing and debugging new contracts, and working with other teams to integrate the new contracts into the broader system.
        
        SubDAOs that choose to work exclusively with Ecosystem Actors for smart contract services can look forward to a consistent experience when engaging Dewiz when developing new protocol features. Dewiz’s engineering experience will support faster development cycles and successful code deployments.
        
        **Integrating DeFi & CeFi**
        
        Dewiz is purpose built and focused on opportunities to contribute engineering services in DeFi. This includes designing and implementing smart contracts that seamlessly bring the benefits of DeFi to projects that need it. Whether a client is a DeFi project looking to incorporate traditional financial instruments, or a CeFi organization seeking to tap into the power of decentralized technology, Dewiz can provide the support and guidance need to navigate a boundary-breaking project to a successful deployment.
        
        **Documentation & Technical Assessments**
        
        Correctly supporting code for a public blockchain is paramount for the success of a project.
        
        Documentation in the DeFi space is utilized by the developers authoring the code, auditors reviewing the code, and even expert users who desire to have a clear understanding of what actions a smart contract is performing. Well-documented code helps to improve the development process, and the security of the contract by making it easier for external reviewers to identify potential vulnerabilities and security risks. Clear and thorough documentation also makes it easier for users of the contract to understand how it works and how to interact with it, which increases trust and adoption.
        
        Technical assessments also help to identify potential issues with the contract’s design or implementation before any development work begins. This can save time and money by ensuring that the contract is developed in the most efficient and effective way possible. A technical assessment can also help to identify potential security vulnerabilities or other risks in the contract, which can be addressed before they become a problem. These assessments also provide valuable insights and recommendations that can be used to improve the contract’s design and functionality before writing a line of code.
        
        **Seamless Engagements**
        
        In addition to the team’s technical expertise, Dewiz also supports a strong understanding of the principles, operations, and values of both traditional and decentralized organizations. Dewiz is dedicated to working closely with DAOs, SubDAOs, projects, and traditional organizations to ensure that its team of engineers supports the transparency, communications, and preferred delivery method of smart contracts for clients. Our payment options and cycles are flexible to support a variety of engagement types, ranging from streams, on-chain payments, and integrations with payment platforms.
        `,
      type: "EcosystemActor",
    })
    .returning("id");

  await knex("SocialMediaChannels").insert({
    cuId: dewizCuId.id,
    forumTag: "https://forum.makerdao.com/u/dewiz/summary",
    twitter: "https://twitter.com/dewiz_xyz",
    discord: "https://discord.com/invite/sZQPFJxDYf",
    website: "https://dewiz.xyz/",
  });

  //Up migration adds targetSourceCode, targetSourceUrl, targetSourceTitle

  // First, find the user with username "Dracaena27" and get their id
  const user = await knex("User")
    .select("id")
    .where({ username: "DewizAdmin" })
    .first();
  const userId = user.id;

  // Find Delegates resourceId
  const dewiz = await knex("CoreUnit")
    .select("id")
    .where({ code: "DEWIZ-001" })
    .first();
  const dewizId = dewiz.id;

  const role = await knex("Role")
    .select("id")
    .where({ roleName: "EcosystemActorAdmin" })
    .first();
  const roleId = role.id;

  const supScope = await knex("AlignmentScope")
    .select("id")
    .where({ code: "SUP" })
    .first();
  const supId = supScope.id;

  const proScope = await knex("AlignmentScope")
    .select("id")
    .where({ code: "PRO" })
    .first();
  const proId = proScope.id;

  // Finally, insert the new user role record with the appropriate values
  await knex("UserRole").insert({
    roleId: roleId,
    resource: "EcosystemActor",
    resourceId: dewizId,
    userId: userId,
  });

  await knex("ContributorTeam_AlignmentScope").insert(
    {
      teamId: dewizId,
      scopeId: supId,
    },
    {
      teamId: dewizId,
      scopeId: proId,
    },
  );
}
