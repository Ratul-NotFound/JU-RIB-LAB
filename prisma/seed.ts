import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  // Create Admin: Prof. Dr. Mohammad Shahedur Rahman
  const profShahedur = await prisma.user.upsert({
    where: { email: "admin@btiblab.ju.edu" },
    update: {},
    create: {
      email: "admin@btiblab.ju.edu",
      name: "Prof. Dr. Mohammad Shahedur Rahman",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  await prisma.profile.upsert({
    where: { userId: profShahedur.id },
    update: {},
    create: {
      userId: profShahedur.id,
      slug: "prof-mohammad-shahedur-rahman",
      fullName: "Prof. Dr. Mohammad Shahedur Rahman",
      designation: "Professor & Principal Investigator",
      department: "Biotechnology & Genetic Engineering",
      bio: "Professor at Jahangirnagar University with D.Eng from Tokyo Institute of Technology. Leading research in industrial biotechnology, microalgae carbon capture ('Liquid-Tree'), and computational biology.",
      googleScholar: "https://scholar.google.com/citations?user=BTIB-JU",
      researchGate: "https://www.researchgate.net/profile/Mohammad-Rahman",
    },
  });

  // Create Faculty: Prof. Dr. Umme Salma Zohora
  const profZohora = await prisma.user.upsert({
    where: { email: "zohora@btiblab.ju.edu" },
    update: {},
    create: {
      email: "zohora@btiblab.ju.edu",
      name: "Prof. Dr. Umme Salma Zohora",
      password: hashedPassword,
      role: "TEACHER",
      isActive: true,
    },
  });

  await prisma.profile.upsert({
    where: { userId: profZohora.id },
    update: {},
    create: {
      userId: profZohora.id,
      slug: "prof-umme-salma-zohora",
      fullName: "Prof. Dr. Umme Salma Zohora",
      designation: "Professor & Former Dept Chairman",
      department: "Biotechnology & Genetic Engineering",
      bio: "Professor and former Chairman of BGE at Jahangirnagar University. D.Eng from Tokyo Institute of Technology. Specializing in microbial biotechnology, fermentation technology, and enzyme engineering.",
      googleScholar: "https://scholar.google.com/citations?user=Zohora-JU",
    },
  });

  // Create Faculty: Dr. Md. Zahidurl Islam
  const drZahid = await prisma.user.upsert({
    where: { email: "zahid@btiblab.ju.edu" },
    update: {},
    create: {
      email: "zahid@btiblab.ju.edu",
      name: "Dr. Md. Zahidurl Islam",
      password: hashedPassword,
      role: "TEACHER",
      isActive: true,
    },
  });

  await prisma.profile.upsert({
    where: { userId: drZahid.id },
    update: {},
    create: {
      userId: drZahid.id,
      slug: "dr-md-zahidurl-islam",
      fullName: "Dr. Md. Zahidurl Islam",
      designation: "Associate Professor & Researcher",
      department: "Biotechnology & Genetic Engineering",
      bio: "Associate Professor in Biotechnology & Genetic Engineering. Focus on bioprocess engineering, bioresource valorization, and molecular diagnostics.",
    },
  });

  // Create lab settings
  await prisma.labSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      labName: "Bioresources Technology and Industrial Biotechnology Laboratory",
      university: "Jahangirnagar University",
      tagline: "Advancing bioresources utilization, bioprocess engineering, and sustainable industrial biotechnology.",
      about: "The Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University is dedicated to cutting-edge research in bioresources valorization, industrial bioprocessing, enzyme technology, and environmental sustainability.",
      vision: "To be a globally recognized center of excellence in bioresources technology and industrial biotechnology.",
      mission: "To develop sustainable biotechnological solutions, train high-caliber scientists, and advance industrial bioprocessing through innovative research.",
      address: "Department of Biotechnology & Genetic Engineering, Jahangirnagar University, Savar, Dhaka-1342",
      email: "bge@juniv.edu",
      phone: "+880 2 7791045",
      foundedYear: 1990,
    },
  });

  // Flagship Project 1: Liquid Tree
  await prisma.project.upsert({
    where: { slug: "liquid-tree-microalgae-photobioreactor" },
    update: {},
    create: {
      slug: "liquid-tree-microalgae-photobioreactor",
      title: "Liquid-Tree: Microalgae Photobioreactor for Urban Carbon Capture",
      description: "Development of an advanced photobioreactor system utilizing indigenous microalgae cultures to capture urban greenhouse gas emissions and release purified oxygen.",
      content: "<p>The 'Liquid-Tree' is an innovative biotechnological solution engineered to combat urban air pollution and climate change. Using optimized microalgae photobioreactors, it achieves high CO2 fixation efficiency in compact urban spaces.</p>",
      status: "ONGOING",
      category: "Algae Biotechnology",
      tags: ["microalgae", "carbon-capture", "liquid-tree", "photobioreactor", "sustainability"],
      isFeatured: true,
      createdBy: profShahedur.id,
    },
  });

  // Flagship Project 2: Agro-Waste Enzymes
  await prisma.project.upsert({
    where: { slug: "industrial-enzyme-production-from-agro-waste" },
    update: {},
    create: {
      slug: "industrial-enzyme-production-from-agro-waste",
      title: "Industrial Enzyme Production via Solid-State Fermentation of Agro-Waste",
      description: "Valorization of agricultural and food industry residues for the cost-effective synthesis of thermostable industrial enzymes (cellulases, amylases, and proteases).",
      content: "<p>This research focuses on bioprocess optimization using solid-state fermentation (SSF) to convert lignocellulosic agro-waste into commercially viable industrial biocatalysts.</p>",
      status: "ONGOING",
      category: "Microbial Biotechnology",
      tags: ["enzymes", "fermentation", "agro-waste", "bioprocess"],
      isFeatured: true,
      createdBy: profZohora.id,
    },
  });

  // Flagship Project 3: Biodegradable Bioplastics
  await prisma.project.upsert({
    where: { slug: "sustainable-bioplastics-from-bioresources" },
    update: {},
    create: {
      slug: "sustainable-bioplastics-from-bioresources",
      title: "Sustainable Biodegradable Bioplastics from Indigenous Bioresources",
      description: "Synthesis and characterization of eco-friendly biopolymer films and packaging materials derived from bioresource polymers and microalgae extracts.",
      content: "<p>Developing sustainable, petroleum-free bioplastics with enhanced tensile strength and biodegradability to support the circular green economy.</p>",
      status: "ONGOING",
      category: "Biomaterial Processing",
      tags: ["bioplastics", "biomaterials", "circular-economy", "sustainability"],
      isFeatured: true,
      createdBy: drZahid.id,
    },
  });

  // Sample blog post
  await prisma.post.upsert({
    where: { slug: "welcome-to-btib-lab-blog" },
    update: {},
    create: {
      slug: "welcome-to-btib-lab-blog",
      title: "Advancing Green Biotechnology: Welcome to the BTIB Lab Platform",
      excerpt: "Introducing the digital portal of the Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University.",
      content: "<p>We are delighted to introduce the official digital platform of the Bioresources Technology and Industrial Biotechnology Laboratory (BTIB Lab) at Jahangirnagar University.</p><p>Explore our ongoing research across microbial biotechnology, bioprocess engineering, the 'Liquid-Tree' carbon capture innovation, and sustainable biomaterials.</p>",
      tags: ["welcome", "biotechnology", "JU", "innovation"],
      status: "PUBLISHED",
      authorId: profShahedur.id,
      publishedAt: new Date(),
    },
  });

  // Authentic Publications
  await prisma.publication.upsert({
    where: { id: "pub-hfcs-2024" },
    update: {},
    create: {
      id: "pub-hfcs-2024",
      title: "Construction and investigation of multi-enzyme immobilized matrix for the production of HFCS",
      authors: "Prof. Dr. Mohammad Shahedur Rahman, Prof. Dr. Umme Salma Zohora, et al.",
      journal: "PLOS ONE",
      year: 2024,
      doi: "10.1371/journal.pone.0298124",
      abstract: "This study demonstrates the construction of a multi-enzyme co-immobilized biocatalytic matrix for the continuous and sustainable enzymatic production of High-Fructose Corn Syrup (HFCS).",
      type: "JOURNAL",
      isFeatured: true,
      createdBy: profShahedur.id,
    },
  });

  await prisma.publication.upsert({
    where: { id: "pub-biofilm-2022" },
    update: {},
    create: {
      id: "pub-biofilm-2022",
      title: "Biofilm Fermentation: A Propitious Method for the Production of Protease Enzyme by Bacillus subtilis",
      authors: "Prof. Dr. Umme Salma Zohora, Prof. Dr. Mohammad Shahedur Rahman, et al.",
      journal: "Industrial Biotechnology",
      year: 2022,
      doi: "10.1089/ind.2022.0014",
      abstract: "Investigation of structured biofilm fermentation systems to enhance volumetric yield and operational stability in bacterial protease production.",
      type: "JOURNAL",
      isFeatured: true,
      createdBy: profZohora.id,
    },
  });

  await prisma.publication.upsert({
    where: { id: "pub-iturin-okara" },
    update: {},
    create: {
      id: "pub-iturin-okara",
      title: "Production of iturin A through glass column reactor (GCR) from soybean curd residue (okara) by Bacillus subtilis under solid state fermentation",
      authors: "Prof. Dr. Umme Salma Zohora, Prof. Dr. Mohammad Shahedur Rahman, et al.",
      journal: "Advances in Bioscience and Biotechnology",
      year: 2021,
      abstract: "Solid-state bioconversion of agro-industrial okara byproduct into antifungal lipopeptide iturin A using an aerated glass column bioreactor.",
      type: "JOURNAL",
      isFeatured: true,
      createdBy: profZohora.id,
    },
  });

  // Authentic Activities & Events
  await prisma.activity.upsert({
    where: { slug: "seminar-cell-penetrating-peptides-wmsrc" },
    update: {},
    create: {
      slug: "seminar-cell-penetrating-peptides-wmsrc",
      title: "Elementary Processes of Cell-Penetrating Peptides in Single Vesicles and E. coli Cells",
      description: "Specialized departmental seminar focusing on single-GUV biophysical methods to analyze peptide entry mechanisms across lipid bilayers.",
      eventDate: new Date("2026-08-20T10:00:00Z"),
      location: "Wazed Miah Science Research Centre (WMSRC), JU",
      type: "SEMINAR",
      createdBy: drZahid.id,
    },
  });

  await prisma.activity.upsert({
    where: { slug: "seminar-biotech-transforms-food-systems" },
    update: {},
    create: {
      slug: "seminar-biotech-transforms-food-systems",
      title: "How Biotechnology Transforms Bangladesh's Food Systems and Bioeconomy",
      description: "Interactive symposium exploring bioresource utilization, fermentation innovations, and sustainable food supply chains.",
      eventDate: new Date("2026-09-05T11:00:00Z"),
      location: "Department of BGE Seminar Hall, Jahangirnagar University",
      type: "SEMINAR",
      createdBy: profShahedur.id,
    },
  });

  await prisma.activity.upsert({
    where: { slug: "workshop-intellectual-property-biotech" },
    update: {},
    create: {
      slug: "workshop-intellectual-property-biotech",
      title: "Empowering Academia through Intellectual Property and Patenting in Biotechnology",
      description: "University-wide workshop covering patent filing, technology transfer, and commercialization strategies for biotechnology researchers.",
      eventDate: new Date("2026-07-15T09:30:00Z"),
      location: "Wazed Miah Science Research Centre Auditorium, JU",
      type: "WORKSHOP",
      createdBy: profShahedur.id,
    },
  });

  console.log("✅ Seed complete!");
  console.log("");
  console.log("📧 Admin email:    admin@btiblab.ju.edu");
  console.log("🔑 Admin password: admin123");
  console.log("⚠️  Please change the password after first login!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
