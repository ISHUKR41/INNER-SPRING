/**
 * Database Seed Data - Sample content for MindCare Mental Health Platform
 * 
 * This script populates the database with realistic sample data for all features:
 * - Users and counselors for testing appointment booking
 * - Mental health resources in multiple categories and languages
 * - Emergency and crisis contacts for immediate support
 * - Forum categories for peer support discussions
 * - Sample assessments to demonstrate progress tracking
 * - Chat conversations to show AI interaction history
 * 
 * The data is designed to be comprehensive and realistic to provide
 * a fully functional demo environment for testing and development.
 */

import { storage } from "./storage";

/**
 * Seed all database tables with comprehensive sample data
 * This function populates every aspect of the mental health platform
 */
export async function seedDatabase() {
  console.log("🌱 Starting database seeding with sample data...");

  try {
    // 1. Create sample users for testing
    console.log("👥 Creating sample users...");
    const users = [
      {
        username: "test_student",
        email: "student@example.com",
        password: "$2b$10$hashedpassword", // In real app, this would be properly hashed
        firstName: "Alex",
        lastName: "Johnson",
        studentId: "STU001",
        isAnonymous: false
      },
      {
        username: "jane_doe",
        email: "jane@example.com", 
        password: "$2b$10$hashedpassword",
        firstName: "Jane",
        lastName: "Doe",
        studentId: "STU002",
        isAnonymous: true
      },
      {
        username: "michael_smith",
        email: "michael@example.com",
        password: "$2b$10$hashedpassword",
        firstName: "Michael",
        lastName: "Smith",
        studentId: "STU003",
        isAnonymous: false
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      try {
        const user = await storage.createUser(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.username}`);
      } catch (error) {
        console.log(`⚠️ User ${userData.username} might already exist, skipping...`);
      }
    }

    // 2. Create licensed mental health counselors
    console.log("👨‍⚕️ Creating licensed counselors...");
    const counselors = [
      {
        name: "Dr. Sarah Williams",
        credentials: "PhD, Licensed Clinical Psychologist",
        specializations: ["anxiety", "depression", "trauma", "LGBTQ+ support"],
        languages: ["en", "es"],
        bio: "Dr. Williams has over 15 years of experience in cognitive behavioral therapy and specializes in helping students manage academic stress and anxiety disorders.",
        rating: 5,
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
      },
      {
        name: "Dr. James Chen",
        credentials: "MD, Psychiatrist",
        specializations: ["ADHD", "depression", "medication management", "academic support"],
        languages: ["en", "zh"],
        bio: "Dr. Chen combines medication management with therapy approaches, specializing in ADHD and learning differences that affect academic performance.",
        rating: 5,
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"
      },
      {
        name: "Dr. Maria Rodriguez",
        credentials: "LCSW, Licensed Clinical Social Worker",
        specializations: ["stress", "family therapy", "cultural counseling", "sleep disorders"],
        languages: ["en", "es"],
        bio: "Dr. Rodriguez provides culturally sensitive therapy and helps students navigate family expectations while managing academic and personal stress.",
        rating: 4,
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1594824723406-9e88925e7d8c?w=300&h=300&fit=crop&crop=face"
      },
      {
        name: "Dr. David Thompson",
        credentials: "PhD, Clinical Psychology",
        specializations: ["academic pressure", "perfectionism", "social anxiety", "career counseling"],
        languages: ["en"],
        bio: "Dr. Thompson specializes in helping high-achieving students overcome perfectionism and develop healthy coping strategies for academic pressure.",
        rating: 5,
        isAvailable: false, // Some counselors might be temporarily unavailable
        imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face"
      }
    ];

    const createdCounselors = [];
    for (const counselorData of counselors) {
      const counselor = await storage.createCounselor(counselorData);
      createdCounselors.push(counselor);
      console.log(`✅ Created counselor: ${counselor.name}`);
    }

    // 3. Create comprehensive mental health resources
    console.log("📚 Creating mental health resources...");
    const resources = [
      {
        title: "Breathing Exercises for Anxiety Relief",
        description: "Learn simple but effective breathing techniques to manage anxiety and panic attacks in the moment.",
        type: "video",
        category: "anxiety",
        language: "en",
        url: "https://www.youtube.com/watch?v=YRPh_GaiL8s",
        thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
        duration: 8,
        isFeatured: true,
        tags: ["breathing", "panic attacks", "immediate relief", "techniques"]
      },
      {
        title: "Understanding Depression: Student Guide",
        description: "Comprehensive guide to recognizing depression symptoms and available treatment options for college students.",
        type: "pdf",
        category: "depression",
        language: "en",
        url: "https://www.nami.org/getattachment/About-NAMI/NAMI-News/2018/NAMI-Guide-for-Students.pdf",
        thumbnailUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
        duration: null,
        isFeatured: true,
        tags: ["depression", "symptoms", "treatment", "college students"]
      },
      {
        title: "Progressive Muscle Relaxation Audio",
        description: "Guided audio session for deep relaxation and stress relief. Perfect for before exams or when feeling overwhelmed.",
        type: "audio",
        category: "stress",
        language: "en",
        url: "https://example.com/progressive-relaxation.mp3",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
        duration: 20,
        isFeatured: false,
        tags: ["relaxation", "guided meditation", "stress relief", "sleep"]
      },
      {
        title: "Sleep Hygiene for Students",
        description: "Evidence-based strategies for improving sleep quality and establishing healthy sleep patterns during college.",
        type: "article",
        category: "sleep",
        language: "en",
        url: "https://example.com/sleep-hygiene-article",
        thumbnailUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=200&fit=crop",
        duration: null,
        isFeatured: true,
        tags: ["sleep", "insomnia", "sleep schedule", "health"]
      },
      {
        title: "Time Management and Study Strategies",
        description: "Practical techniques for managing academic workload, reducing procrastination, and maintaining work-life balance.",
        type: "video",
        category: "academic",
        language: "en",
        url: "https://example.com/time-management-video",
        thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
        duration: 15,
        isFeatured: false,
        tags: ["time management", "productivity", "study skills", "procrastination"]
      },
      {
        title: "Mindfulness Meditation for Beginners",
        description: "Introduction to mindfulness practice with simple techniques you can use anywhere on campus.",
        type: "video",
        category: "stress",
        language: "en",
        url: "https://example.com/mindfulness-video",
        thumbnailUrl: "https://images.unsplash.com/photo-1499728603263-13726abce5ca?w=400&h=200&fit=crop",
        duration: 12,
        isFeatured: true,
        tags: ["mindfulness", "meditation", "stress reduction", "mental health"]
      },
      {
        title: "Técnicas de Respiración para la Ansiedad",
        description: "Aprende técnicas simples pero efectivas de respiración para manejar la ansiedad y ataques de pánico.",
        type: "video",
        category: "anxiety",
        language: "es",
        url: "https://example.com/breathing-spanish",
        thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
        duration: 10,
        isFeatured: false,
        tags: ["respiración", "ansiedad", "técnicas", "español"]
      },
      {
        title: "Building Healthy Relationships",
        description: "Guide to developing and maintaining healthy relationships while managing mental health challenges.",
        type: "article",
        category: "general",
        language: "en",
        url: "https://example.com/healthy-relationships",
        thumbnailUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop",
        duration: null,
        isFeatured: false,
        tags: ["relationships", "social skills", "mental health", "communication"]
      }
    ];

    for (const resourceData of resources) {
      const resource = await storage.createResource(resourceData);
      console.log(`✅ Created resource: ${resource.title}`);
    }

    // 4. Create emergency contacts for crisis situations
    console.log("🚨 Creating emergency contacts...");
    const emergencyContacts = [
      {
        name: "Campus Counseling Center",
        phoneNumber: "(555) 123-4567",
        description: "On-campus counseling services available to all students. Walk-ins welcome during business hours.",
        type: "campus",
        isAvailable247: false,
        location: "Student Services Building, Room 201",
        isActive: true
      },
      {
        name: "Campus Security/Emergency",
        phoneNumber: "(555) 911-HELP",
        description: "24/7 campus security for immediate safety concerns and emergency situations.",
        type: "campus",
        isAvailable247: true,
        location: "Security Office, Main Campus",
        isActive: true
      },
      {
        name: "Local Emergency Room",
        phoneNumber: "(555) 789-0123",
        description: "City General Hospital Emergency Department for medical and psychiatric emergencies.",
        type: "hospital",
        isAvailable247: true,
        location: "123 Hospital Drive, Main City",
        isActive: true
      },
      {
        name: "Crisis Intervention Team",
        phoneNumber: "(555) CRISIS-1",
        description: "Mobile crisis response team for mental health emergencies in the community.",
        type: "crisis",
        isAvailable247: true,
        location: "Mobile service - city wide",
        isActive: true
      }
    ];

    for (const contactData of emergencyContacts) {
      const contact = await storage.createEmergencyContact(contactData);
      console.log(`✅ Created emergency contact: ${contact.name}`);
    }

    // 5. Create crisis contacts for immediate help
    console.log("☎️ Creating crisis hotlines...");
    const crisisContacts = [
      {
        name: "National Suicide Prevention Lifeline",
        country: "US",
        phone: "988",
        sms: "988",
        chatUrl: "https://suicidepreventionlifeline.org/chat/",
        type: "multi",
        availability: "24/7",
        languages: ["en", "es"],
        description: "Free and confidential emotional support for people in suicidal crisis or emotional distress. Available 24/7 across the United States.",
        isActive: true,
        priority: 1
      },
      {
        name: "Crisis Text Line",
        country: "US",
        phone: null,
        sms: "741741",
        chatUrl: "https://www.crisistextline.org/",
        type: "text",
        availability: "24/7",
        languages: ["en", "es"],
        description: "Free, 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the United States.",
        isActive: true,
        priority: 2
      },
      {
        name: "SAMHSA National Helpline",
        country: "US",
        phone: "1-800-662-4357",
        sms: null,
        chatUrl: null,
        type: "hotline",
        availability: "24/7",
        languages: ["en", "es"],
        description: "Treatment referral and information service for individuals facing mental health and substance use disorders.",
        isActive: true,
        priority: 3
      },
      {
        name: "LGBT National Hotline",
        country: "US",
        phone: "1-888-843-4564",
        sms: null,
        chatUrl: "https://www.lgbthotline.org/",
        type: "hotline",
        availability: "Daily 4PM-12AM ET",
        languages: ["en"],
        description: "Confidential peer-support hotline for lesbian, gay, bisexual, transgender, and questioning callers.",
        isActive: true,
        priority: 4
      },
      {
        name: "Veterans Crisis Line",
        country: "US",
        phone: "1-800-273-8255",
        sms: "838255",
        chatUrl: "https://www.veteranscrisisline.net/",
        type: "multi",
        availability: "24/7",
        languages: ["en", "es"],
        description: "Connects veterans in crisis and their families with qualified, caring Department of Veterans Affairs responders.",
        isActive: true,
        priority: 5
      }
    ];

    for (const crisisData of crisisContacts) {
      const crisis = await storage.createCrisisContact(crisisData);
      console.log(`✅ Created crisis contact: ${crisis.name}`);
    }

    // 6. Create forum categories for peer support
    console.log("💬 Creating forum categories...");
    const forumCategories = [
      {
        name: "General Support",
        description: "Share your experiences and get support from fellow students on any topic",
        color: "#3B82F6",
        isActive: true
      },
      {
        name: "Anxiety & Stress",
        description: "Discuss coping strategies and experiences with anxiety, stress, and panic",
        color: "#8B5CF6",
        isActive: true
      },
      {
        name: "Academic Pressure",
        description: "Talk about study stress, exam anxiety, and balancing academic demands",
        color: "#F59E0B",
        isActive: true
      },
      {
        name: "Depression & Mood",
        description: "Support for those dealing with depression, mood changes, and related challenges",
        color: "#06B6D4",
        isActive: true
      },
      {
        name: "Social Connection",
        description: "Building friendships, dating, family relationships, and social skills",
        color: "#10B981",
        isActive: true
      },
      {
        name: "Sleep & Wellness",
        description: "Tips and support for better sleep, exercise, nutrition, and overall wellness",
        color: "#F97316",
        isActive: true
      }
    ];

    const createdCategories = [];
    for (const categoryData of forumCategories) {
      const category = await storage.createForumCategory(categoryData);
      createdCategories.push(category);
      console.log(`✅ Created forum category: ${category.name}`);
    }

    // 7. Create sample forum posts for active community feel
    console.log("📝 Creating sample forum posts...");
    if (createdUsers.length > 0 && createdCategories.length > 0) {
      const samplePosts = [
        {
          userId: createdUsers[0].id,
          categoryId: createdCategories[0].id, // General Support
          title: "Starting my mental health journey - feeling hopeful",
          content: "Hi everyone! I just wanted to share that I've finally decided to prioritize my mental health this semester. It's been a long time coming, but I'm ready to make positive changes. Any tips for someone just starting out?",
          isAnonymous: false,
          isModerated: true,
          isApproved: true
        },
        {
          userId: createdUsers[1].id,
          categoryId: createdCategories[1].id, // Anxiety & Stress
          title: "Breathing techniques that actually work?",
          content: "I've been dealing with panic attacks lately, especially during exams. I've tried some breathing exercises but I'm looking for techniques that have really worked for other people. What's been most helpful for you?",
          isAnonymous: true,
          isModerated: true,
          isApproved: true
        },
        {
          userId: createdUsers[2].id,
          categoryId: createdCategories[2].id, // Academic Pressure
          title: "Overwhelmed by course load this semester",
          content: "Is anyone else feeling completely overwhelmed this semester? I'm taking 18 credits and working part-time, and I feel like I'm drowning. How do you all manage when everything feels like too much?",
          isAnonymous: false,
          isModerated: true,
          isApproved: true
        }
      ];

      for (const postData of samplePosts) {
        const post = await storage.createForumPost(postData);
        console.log(`✅ Created forum post: ${post.title}`);
      }
    }

    // 8. Create sample chat conversations to demonstrate AI interaction
    console.log("💬 Creating sample chat conversations...");
    if (createdUsers.length > 0) {
      const conversation = await storage.createChatConversation({
        userId: createdUsers[0].id,
        title: "Stress Management Support"
      });

      // Add some sample messages to show conversation flow
      await storage.createChatMessage({
        conversationId: conversation.id,
        role: "user",
        content: "I've been feeling really stressed about my upcoming exams. Do you have any suggestions for managing anxiety?"
      });

      await storage.createChatMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: "I understand that exam stress can feel overwhelming. Here are some evidence-based techniques that many students find helpful:\n\n1. **Deep breathing exercises** - Try the 4-7-8 technique: breathe in for 4, hold for 7, exhale for 8\n2. **Break study sessions into chunks** - Use the Pomodoro technique (25 minutes focused study, 5-minute break)\n3. **Create a realistic study schedule** - This helps reduce last-minute cramming anxiety\n\nWould you like me to guide you through one of these techniques right now?"
      });

      console.log(`✅ Created sample chat conversation with messages`);
    }

    // 9. Create sample assessment to show progress tracking
    console.log("📊 Creating sample assessment...");
    if (createdUsers.length > 0) {
      const sampleAssessment = {
        userId: createdUsers[0].id,
        assessmentType: "PHQ-9",
        responses: [
          { question: 1, score: 1, text: "Little interest or pleasure in doing things" },
          { question: 2, score: 2, text: "Feeling down, depressed, or hopeless" },
          { question: 3, score: 1, text: "Trouble falling or staying asleep" },
          { question: 4, score: 2, text: "Feeling tired or having little energy" },
          { question: 5, score: 1, text: "Poor appetite or overeating" },
          { question: 6, score: 0, text: "Feeling bad about yourself" },
          { question: 7, score: 1, text: "Trouble concentrating" },
          { question: 8, score: 0, text: "Moving or speaking slowly" },
          { question: 9, score: 0, text: "Thoughts of self-harm" }
        ],
        totalScore: 8,
        interpretation: "mild",
        recommendations: [
          "Consider speaking with a counselor",
          "Practice stress management techniques", 
          "Maintain regular sleep schedule",
          "Engage in physical activity"
        ]
      };

      const assessment = await storage.createAssessment(sampleAssessment);
      console.log(`✅ Created sample PHQ-9 assessment with score: ${assessment.totalScore}`);
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   👨‍⚕️ Counselors: ${createdCounselors.length}`);
    console.log(`   📚 Resources: ${resources.length}`);
    console.log(`   🚨 Emergency Contacts: ${emergencyContacts.length}`);
    console.log(`   ☎️ Crisis Contacts: ${crisisContacts.length}`);
    console.log(`   💬 Forum Categories: ${createdCategories.length}`);
    console.log("✅ All pages should now have content to display!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding function when this file is executed directly
seedDatabase()
  .then(() => {
    console.log("🌱 Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });