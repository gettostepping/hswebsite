import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { slug: "bls-provider" },
      update: {},
      create: {
        slug: "bls-provider",
        title: "BLS Provider Course",
        description:
          "The BLS Provider course teaches both single-rescuer and team basic life support skills for application in both in-facility and prehospital settings, with a focus on High-Quality CPR and team dynamics. This course is designed for healthcare professionals and other personnel who need to know how to perform CPR and other basic cardiovascular life support skills in a wide variety of in-facility and prehospital settings.",
        duration: "4 hours",
        priceOriginal: 85,
        priceRenewal: 65,
        category: "AHA Certification",
        active: true,
        imageUrl: "/images/bls.jpg",
      },
    }),
    prisma.course.upsert({
      where: { slug: "cpr-aed-first-aid" },
      update: {},
      create: {
        slug: "cpr-aed-first-aid",
        title: "CPR/AED & First Aid Combo",
        description:
          "This comprehensive combination course covers CPR and AED use for adults, children, and infants, plus essential first aid skills. Perfect for workplace compliance, teachers, coaches, fitness professionals, and anyone who wants to be prepared for emergencies. Includes certification card valid for 2 years.",
        duration: "6 hours",
        priceOriginal: 110,
        priceRenewal: 85,
        category: "Workplace Safety",
        active: true,
        imageUrl: "/images/cpr-aed.jpg",
      },
    }),
    prisma.course.upsert({
      where: { slug: "first-aid" },
      update: {},
      create: {
        slug: "first-aid",
        title: "First Aid Certification",
        description:
          "Learn to recognize and provide care for a variety of first aid emergencies including breathing problems, severe bleeding, shock, diabetic emergencies, seizures, and more. This course meets OSHA workplace requirements and is designed for anyone who wants to learn how to respond in an emergency.",
        duration: "3 hours",
        priceOriginal: 65,
        priceRenewal: 50,
        category: "Workplace Safety",
        active: true,
        imageUrl: "/images/first-aid.jpg",
      },
    }),
    prisma.course.upsert({
      where: { slug: "acls-provider" },
      update: {},
      create: {
        slug: "acls-provider",
        title: "ACLS Provider Course",
        description:
          "The Advanced Cardiovascular Life Support (ACLS) Provider course builds on the foundation of lifesaving BLS skills, emphasizing the importance of continuous high-quality CPR. This advanced course covers reading and interpreting ECGs, pharmacology, and applying these concepts to critical patient management.",
        duration: "8 hours",
        priceOriginal: 195,
        priceRenewal: 155,
        category: "AHA Certification",
        active: true,
        imageUrl: "/images/acls.jpg",
      },
    }),
    prisma.course.upsert({
      where: { slug: "pals-provider" },
      update: {},
      create: {
        slug: "pals-provider",
        title: "PALS Provider Course",
        description:
          "The Pediatric Advanced Life Support (PALS) course aims to improve the quality of care provided to seriously ill or injured children, resulting in improved outcomes. The course teaches a systematic approach to pediatric assessment and treatment using team-based communication and simulation.",
        duration: "8 hours",
        priceOriginal: 195,
        priceRenewal: 155,
        category: "AHA Certification",
        active: true,
        imageUrl: "/images/pals.jpg",
      },
    }),
    prisma.course.upsert({
      where: { slug: "heartsaver-cpr" },
      update: {},
      create: {
        slug: "heartsaver-cpr",
        title: "Heartsaver CPR AED",
        description:
          "The Heartsaver CPR AED course teaches lay rescuers how to recognize cardiovascular emergencies and how to perform CPR and use an AED. Ideal for anyone with limited or no medical training who wants to be prepared for emergencies. Perfect for community members, parents, and caregivers.",
        duration: "3 hours",
        priceOriginal: 55,
        priceRenewal: 40,
        category: "Community Training",
        active: true,
        imageUrl: "/images/heartsaver.jpg",
      },
    }),
  ]);

  console.log(`✅ Created ${courses.length} courses`);

  // Create class sessions for the next 3 months
  const now = new Date();
  const sessions = [];

  for (let i = 0; i < courses.length; i++) {
    for (let week = 1; week <= 4; week++) {
      const date = new Date(now);
      date.setDate(date.getDate() + week * 7 + i);

      sessions.push(
        prisma.classSession.create({
          data: {
            courseId: courses[i].id,
            date: date,
            startTime: i % 2 === 0 ? "09:00" : "13:00",
            endTime: i % 2 === 0 ? "13:00" : "17:00",
            capacity: 12,
            enrolledCount: Math.floor(Math.random() * 8),
            location:
              i % 3 === 0
                ? "Main Training Center - Room A"
                : i % 3 === 1
                  ? "Downtown Campus - Suite 200"
                  : "North Medical Center - Lab 3",
            instructorName:
              i % 3 === 0
                ? "Dr. Sarah Johnson"
                : i % 3 === 1
                  ? "Michael Chen, RN"
                  : "Lisa Martinez, EMT-P",
            active: true,
          },
        })
      );
    }
  }

  const createdSessions = await Promise.all(sessions);
  console.log(`✅ Created ${createdSessions.length} class sessions`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
