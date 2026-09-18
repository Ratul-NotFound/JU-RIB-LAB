import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bgelab.ju.edu" },
    update: {},
    create: {
      email: "admin@bgelab.ju.edu",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  // Create admin profile
  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      slug: "admin-user",
      fullName: "Lab Administrator",
      designation: "Lab Director",
      department: "Biotechnology & Genetic Engineering",
      bio: "Administrator of the BGE Lab website.",
    },
  });

  // Create lab settings
  await prisma.labSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      labName: "Biotechnology & Genetic Engineering Lab",
      university: "Jahangirnagar University",
      tagline: "Advancing life sciences through innovation, collaboration, and cutting-edge research.",
      about: "The Biotechnology and Genetic Engineering Laboratory at Jahangirnagar University is one of Bangladesh's leading research centers dedicated to advancing the frontiers of life sciences.",
      vision: "To be a globally recognized center of excellence in biotechnology and genetic engineering.",
      mission: "To foster cutting-edge research, develop skilled scientists, and translate scientific discoveries into solutions.",
      address: "Department of Biotechnology & Genetic Engineering, Jahangirnagar University, Savar, Dhaka-1342",
      email: "bge@juniv.edu",
      phone: "+880 2 7791045",
      foundedYear: 1990,
    },
  });

  // Sample project
  await prisma.project.upsert({
    where: { slug: "genomics-of-local-crop-varieties" },
    update: {},
    create: {
      slug: "genomics-of-local-crop-varieties",
      title: "Genomics of Local Crop Varieties",
      description: "Comprehensive genomic analysis of indigenous crop varieties to identify genes responsible for disease resistance and drought tolerance.",
      content: "<p>This project aims to sequence and analyze the genomes of traditional crop varieties grown in Bangladesh, with a focus on identifying genetic markers associated with stress tolerance.</p>",
      status: "ONGOING",
      category: "Agri-Biotechnology",
      tags: ["genomics", "crops", "Bangladesh", "drought-tolerance"],
      isFeatured: true,
      createdBy: admin.id,
    },
  });

  // Sample blog post
  await prisma.post.upsert({
    where: { slug: "welcome-to-bge-lab-blog" },
    update: {},
    create: {
      slug: "welcome-to-bge-lab-blog",
      title: "Welcome to the BGE Lab Blog",
      excerpt: "Introducing our new lab blog where we will share research updates, insights, and stories from our team.",
      content: "<p>We are excited to launch the official blog of the Biotechnology &amp; Genetic Engineering Laboratory at Jahangirnagar University.</p><p>Through this blog, we will share the latest updates from our lab, research breakthroughs, student achievements, and insights into the world of biotechnology.</p><p>Stay tuned for regular updates!</p>",
      tags: ["welcome", "announcement"],
      status: "PUBLISHED",
      authorId: admin.id,
      publishedAt: new Date(),
    },
  });

  console.log("✅ Seed complete!");
  console.log("");
  console.log("📧 Admin email:    admin@bgelab.ju.edu");
  console.log("🔑 Admin password: admin123");
  console.log("⚠️  Please change the password after first login!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
