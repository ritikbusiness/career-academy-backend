// Enterprise-Grade AI-Powered LMS Sample Data for DesiredCareerAcademy

import { db } from '../db';
import { 
  missions, 
  skillProgress, 
  notifications, 
  userUnlocks, 
  helpQuestions, 
  helpAnswers, 
  aiScores,
  aiMentorResponses,
  enhancedHelpQuestions,
  answerFeedback,
  questionRooms,
  missionProgress,
  users,
  userStats
} from '@shared/schema';

export async function seedAIFeatures() {
  console.log('🚀 Seeding AI-Powered LMS Features for DesiredCareerAcademy...');

  try {
    // 1. Create sample missions for daily challenges
    const sampleMissions = [
      {
        title: "Answer Master",
        description: "Answer 3 questions in the DevOps category to earn XP",
        xpReward: 150,
        skillTag: "DevOps",
        missionType: "daily" as const,
        requirements: { type: "answer_questions", count: 3, skillTag: "DevOps" }
      },
      {
        title: "Knowledge Seeker",
        description: "Complete 2 lessons in any programming course",
        xpReward: 200,
        skillTag: "Programming",
        missionType: "daily" as const,
        requirements: { type: "complete_lessons", count: 2 }
      },
      {
        title: "Python Expert Weekly",
        description: "Earn 500 XP in Python-related activities this week",
        xpReward: 500,
        skillTag: "Python",
        missionType: "weekly" as const,
        requirements: { type: "earn_xp", count: 500, skillTag: "Python" }
      },
      {
        title: "Community Helper",
        description: "Help 5 students by answering their questions",
        xpReward: 300,
        skillTag: "Community",
        missionType: "daily" as const,
        requirements: { type: "help_students", count: 5 }
      },
      {
        title: "AI Learning Challenge",
        description: "Complete an AI/ML course module and score 80% on the quiz",
        xpReward: 400,
        skillTag: "AI/ML",
        missionType: "special" as const,
        requirements: { type: "complete_ai_module", count: 1, scoreThreshold: 80 }
      }
    ];

    const createdMissions = await db.insert(missions).values(sampleMissions).returning();
    console.log(`✅ Created ${createdMissions.length} sample missions`);

    // 2. Create sample skill progress data for different programming domains
    const skillCategories = ["DevOps", "Python", "Frontend", "Backend", "Mobile", "AI/ML"];
    const sampleSkillProgress = [];

    for (let userId = 1; userId <= 5; userId++) {
      for (const skill of skillCategories) {
        sampleSkillProgress.push({
          userId,
          skillTag: skill,
          totalXP: Math.floor(Math.random() * 1000) + 100,
          questionsAnswered: Math.floor(Math.random() * 20) + 1,
          averageRating: (Math.random() * 2 + 3).toFixed(2) // 3.0 to 5.0
        });
      }
    }

    const createdSkillProgress = await db.insert(skillProgress).values(sampleSkillProgress).returning();
    console.log(`✅ Created ${createdSkillProgress.length} skill progress entries`);

    // 3. Create sample Q&A questions for AI-powered features
    const sampleQuestions = [
      {
        userId: 1,
        categoryId: 1,
        title: "How to deploy a React app with Docker and CI/CD pipeline?",
        content: "I'm trying to set up a complete deployment pipeline for my React application using Docker containers and GitHub Actions. What are the best practices for production deployment?",
        tags: ["docker", "react", "cicd", "deployment"],
        bountyXP: 50
      },
      {
        userId: 2,
        categoryId: 2,
        title: "Python asyncio vs threading: When to use what?",
        content: "I'm confused about when to use asyncio versus threading in Python. Can someone explain the differences and provide examples of when each approach is better?",
        tags: ["python", "asyncio", "threading", "concurrency"],
        bountyXP: 30
      },
      {
        userId: 3,
        categoryId: 6,
        title: "Best approach for fine-tuning BERT for text classification?",
        content: "I need to fine-tune BERT for a custom text classification task. What's the most efficient approach in terms of computational resources and accuracy?",
        tags: ["bert", "nlp", "machine-learning", "fine-tuning"],
        bountyXP: 75
      },
      {
        userId: 4,
        categoryId: 3,
        title: "React State Management: Redux vs Zustand vs Context API",
        content: "Working on a large React application and need to decide on state management. What are the pros and cons of Redux, Zustand, and Context API for different use cases?",
        tags: ["react", "state-management", "redux", "zustand"],
        bountyXP: 40
      },
      {
        userId: 5,
        categoryId: 4,
        title: "Node.js microservices communication patterns",
        content: "Building a microservices architecture with Node.js. What are the best communication patterns between services? Should I use HTTP, message queues, or event streaming?",
        tags: ["nodejs", "microservices", "architecture", "communication"],
        bountyXP: 60
      }
    ];

    const createdQuestions = await db.insert(helpQuestions).values(sampleQuestions).returning();
    console.log(`✅ Created ${createdQuestions.length} sample Q&A questions`);

    // 4. Create sample answers with AI scoring
    const sampleAnswers = [
      {
        questionId: createdQuestions[0].id,
        userId: 2,
        content: "For deploying React apps with Docker, here's a production-ready approach:\n\n1. **Multi-stage Dockerfile:**\n```dockerfile\n# Build stage\nFROM node:18-alpine as build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nRUN npm run build\n\n# Production stage\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/nginx.conf\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]\n```\n\n2. **GitHub Actions CI/CD:**\n```yaml\nname: Deploy React App\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Build and push Docker image\n        run: |\n          docker build -t myapp:latest .\n          docker push myregistry/myapp:latest\n```\n\n3. **Best Practices:**\n- Use .dockerignore to exclude node_modules\n- Implement health checks\n- Use environment variables for configuration\n- Set up proper logging and monitoring\n- Use HTTPS with proper SSL certificates\n\nThis approach ensures fast builds, small image sizes, and secure deployments.",
        xpRating: 9,
        starRating: "4.8",
        starRatingCount: 12,
        isAccepted: true
      },
      {
        questionId: createdQuestions[1].id,
        userId: 3,
        content: "Great question! Here's when to use each:\n\n**asyncio (Asynchronous Programming):**\n- Use for I/O-bound tasks (web requests, file operations, database queries)\n- Single-threaded but handles many concurrent operations\n- Better for network programming and APIs\n\n```python\nimport asyncio\nimport aiohttp\n\nasync def fetch_data(session, url):\n    async with session.get(url) as response:\n        return await response.text()\n\nasync def main():\n    async with aiohttp.ClientSession() as session:\n        tasks = [fetch_data(session, f'https://api.example.com/{i}') for i in range(100)]\n        results = await asyncio.gather(*tasks)\n```\n\n**Threading:**\n- Use for CPU-bound tasks that can benefit from parallelism\n- Good for blocking operations that can't be made async\n- Limited by GIL in CPython for CPU-intensive work\n\n```python\nimport threading\nimport concurrent.futures\n\ndef cpu_intensive_task(n):\n    return sum(i*i for i in range(n))\n\nwith concurrent.futures.ThreadPoolExecutor() as executor:\n    futures = [executor.submit(cpu_intensive_task, 1000000) for _ in range(4)]\n    results = [f.result() for f in futures]\n```\n\n**Rule of thumb:**\n- asyncio for I/O-bound concurrent operations\n- threading for I/O-bound parallel operations or when working with blocking libraries\n- multiprocessing for CPU-bound parallel work",
        xpRating: 10,
        starRating: "4.9",
        starRatingCount: 8,
        isAccepted: true
      }
    ];

    const createdAnswers = await db.insert(helpAnswers).values(sampleAnswers).returning();
    console.log(`✅ Created ${createdAnswers.length} high-quality sample answers`);

    // 5. Create AI scores for the answers
    const aiScoreData = [
      {
        answerId: createdAnswers[0].id,
        aiScore: "8.5",
        summaryComment: "Excellent technical answer with practical code examples, clear structure, and comprehensive coverage of Docker deployment best practices. Well-formatted and actionable.",
        grammarScore: "9.2",
        clarityScore: "8.8",
        correctnessScore: "8.9"
      },
      {
        answerId: createdAnswers[1].id,
        aiScore: "9.1",
        summaryComment: "Outstanding explanation of asyncio vs threading concepts with clear use cases, excellent code examples, and practical guidelines. Very well structured and educational.",
        grammarScore: "9.5",
        clarityScore: "9.3",
        correctnessScore: "9.0"
      }
    ];

    const createdAIScores = await db.insert(aiScores).values(aiScoreData).returning();
    console.log(`✅ Created ${createdAIScores.length} AI analysis scores`);

    // 6. Create sample notifications for various activities
    const sampleNotifications = [
      {
        userId: 1,
        title: "🎉 Mission Completed!",
        message: "You completed 'Answer Master' and earned 150 XP! Keep up the great work!",
        type: "mission_complete" as const,
        relatedId: createdMissions[0].id,
        relatedType: "mission"
      },
      {
        userId: 2,
        title: "⭐ Level Up!",
        message: "Congratulations! You've reached Level 5 in Python programming!",
        type: "level_up" as const,
        relatedType: "skill"
      },
      {
        userId: 3,
        title: "💎 AI Analysis Complete",
        message: "Your answer received an AI quality score of 9.1/10. Excellent technical depth!",
        type: "answer_received" as const,
        relatedId: createdAnswers[1].id,
        relatedType: "answer"
      },
      {
        userId: 4,
        title: "🏆 Badge Earned",
        message: "You earned the 'Knowledge Sharer' badge for helping 10 students this month!",
        type: "badge_earned" as const,
        relatedType: "achievement"
      },
      {
        userId: 5,
        title: "⚡ XP Gained",
        message: "You gained 75 XP for your insightful answer about BERT fine-tuning!",
        type: "xp_gained" as const,
        relatedType: "answer"
      }
    ];

    const createdNotifications = await db.insert(notifications).values(sampleNotifications).returning();
    console.log(`✅ Created ${createdNotifications.length} sample notifications`);

    // 7. Create smart content unlocks
    const sampleUnlocks = [
      {
        userId: 1,
        unlockType: "mentor_status",
        requirements: JSON.stringify({ xp: 1000, answersGiven: 20, rating: 4.5 })
      },
      {
        userId: 2,
        unlockType: "premium_content",
        requirements: JSON.stringify({ xp: 500, coursesCompleted: 3 })
      },
      {
        userId: 3,
        unlockType: "advanced_ai_features",
        requirements: JSON.stringify({ xp: 1500, aiInteractions: 50 })
      }
    ];

    const createdUnlocks = await db.insert(userUnlocks).values(sampleUnlocks).returning();
    console.log(`✅ Created ${createdUnlocks.length} smart content unlocks`);

    // 8. Create AI mentor responses for demonstration
    const aiMentorData = [
      {
        questionId: createdQuestions[2].id,
        aiResponse: "🤖 **AI Suggested Answer:**\n\nFor fine-tuning BERT for text classification, here's an efficient approach:\n\n**1. Data Preparation:**\n- Ensure your dataset is properly formatted with clear labels\n- Use stratified sampling to maintain class distribution\n- Consider data augmentation techniques for small datasets\n\n**2. Model Selection:**\n- Start with `bert-base-uncased` for English text\n- Use `distilbert-base-uncased` for faster training with minimal accuracy loss\n- Consider domain-specific BERT variants if available\n\n**3. Fine-tuning Strategy:**\n```python\nfrom transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer\n\n# Load pre-trained model\nmodel = AutoModelForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=num_classes)\ntokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')\n\n# Training arguments\ntraining_args = TrainingArguments(\n    output_dir='./results',\n    num_train_epochs=3,\n    per_device_train_batch_size=16,\n    per_device_eval_batch_size=64,\n    warmup_steps=500,\n    weight_decay=0.01,\n    logging_dir='./logs',\n    learning_rate=2e-5\n)\n```\n\n**4. Optimization Tips:**\n- Use gradient accumulation for effective larger batch sizes\n- Implement early stopping to prevent overfitting\n- Use mixed precision training (fp16) to reduce memory usage\n- Freeze early layers if you have limited data\n\n**5. Evaluation:**\n- Use appropriate metrics (F1-score, precision, recall)\n- Implement cross-validation for robust evaluation\n- Monitor training/validation loss curves\n\n*This is an AI-generated response. Please verify the information and consider getting a human expert's opinion.*",
        confidence: "0.87",
        triggerReason: "24_hour_timeout"
      }
    ];

    const createdAIMentor = await db.insert(aiMentorResponses).values(aiMentorData).returning();
    console.log(`✅ Created ${createdAIMentor.length} AI mentor responses`);

    console.log('\n🎯 AI-Powered LMS Backend Features Successfully Seeded!');
    console.log('\n📊 Summary:');
    console.log(`   • ${createdMissions.length} Daily/Weekly Missions`);
    console.log(`   • ${createdSkillProgress.length} Skill Progress Entries`);
    console.log(`   • ${createdQuestions.length} Q&A Questions`);
    console.log(`   • ${createdAnswers.length} High-Quality Answers`);
    console.log(`   • ${createdAIScores.length} AI Analysis Scores`);
    console.log(`   • ${createdNotifications.length} Smart Notifications`);
    console.log(`   • ${createdUnlocks.length} Content Unlocks`);
    console.log(`   • ${createdAIMentor.length} AI Mentor Responses`);
    
    console.log('\n🚀 Your DesiredCareerAcademy LMS now has enterprise-grade AI features!');
    
    return {
      missions: createdMissions.length,
      skillProgress: createdSkillProgress.length,
      questions: createdQuestions.length,
      answers: createdAnswers.length,
      aiScores: createdAIScores.length,
      notifications: createdNotifications.length,
      unlocks: createdUnlocks.length,
      aiMentor: createdAIMentor.length
    };

  } catch (error) {
    console.error('❌ Error seeding AI features:', error);
    throw error;
  }
}

// Export individual seeding functions for modular use
export async function seedMissions() {
  // Seed only missions data
}

export async function seedSkillAnalytics() {
  // Seed only skill analytics data
}

export async function seedAIScoring() {
  // Seed only AI scoring data
}