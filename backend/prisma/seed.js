import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const avatars = [
  'https://api.dicebear.com/7.0/persona/svg?seed=aria&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.0/persona/svg?seed=marcus&backgroundColor=c0aede',
  'https://api.dicebear.com/7.0/persona/svg?seed=luna&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.0/persona/svg?seed=kai&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.0/persona/svg?seed=nova&backgroundColor=d1f4d9',
  'https://api.dicebear.com/7.0/persona/svg?seed=zen&backgroundColor=ffe4b6',
  'https://api.dicebear.com/7.0/persona/svg?seed=iris&backgroundColor=c4f1f4',
  'https://api.dicebear.com/7.0/persona/svg?seed=atlas&backgroundColor=ffb3ba',
  'https://api.dicebear.com/7.0/persona/svg?seed=willow&backgroundColor=bae1ff',
  'https://api.dicebear.com/7.0/persona/svg?seed=orion&backgroundColor=ffffba',
];

const users = [
  { name: 'Aria Chen', username: 'aria_creates', email: 'aria@pulse.dev', bio: 'Digital artist & UI designer. Creating visual stories one pixel at a time.', avatar: avatars[0] },
  { name: 'Marcus Webb', username: 'marcusw', email: 'marcus@pulse.dev', bio: 'Full-stack developer by day, photographer by night. Capturing code and light.', avatar: avatars[1] },
  { name: 'Luna Patel', username: 'luna.codes', email: 'luna@pulse.dev', bio: 'Software engineer passionate about accessibility and inclusive design.', avatar: avatars[2] },
  { name: 'Kai Nakamura', username: 'kaistudio', email: 'kai@pulse.dev', bio: 'Motion designer & creative coder. Making the web more beautiful.', avatar: avatars[3] },
  { name: 'Nova Rivera', username: 'novarivera', email: 'nova@pulse.dev', bio: 'Product manager building tools people love. Coffee enthusiast ☕', avatar: avatars[4] },
  { name: 'Zen Okafor', username: 'zen_builds', email: 'zen@pulse.dev', bio: 'DevOps engineer. Automating all the things. Open source advocate.', avatar: avatars[5] },
  { name: 'Iris Andersen', username: 'irisdesigns', email: 'iris@pulse.dev', bio: 'Brand designer crafting identities that resonate. Typography nerd.', avatar: avatars[6] },
  { name: 'Atlas Kim', username: 'atlaskim', email: 'atlas@pulse.dev', bio: 'Data scientist exploring patterns in everything. Music lover 🎵', avatar: avatars[7] },
  { name: 'Willow Brooks', username: 'willowwrites', email: 'willow@pulse.dev', bio: 'Technical writer making complex things simple. Book collector 📚', avatar: avatars[8] },
  { name: 'Orion Silva', username: 'orion_dev', email: 'orion@pulse.dev', bio: 'Mobile developer crafting delightful experiences. React Native & Flutter.', avatar: avatars[9] },
];

const posts = [
  { content: 'Just shipped a new feature using React Server Components. The DX improvement is incredible — components feel so much more natural to write now. Who else is making the transition?', image: null },
  { content: 'Golden hour at the coast today. Sometimes you just need to step away from the screen and remember what matters.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop' },
  { content: 'Hot take: The best code is the code you don\'t write. Every line is a liability. Every dependency is a risk. Build only what you absolutely need.', image: null },
  { content: 'New workspace setup complete! Standing desk + ultrawide monitor + mechanical keyboard = productivity unlocked.', image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=500&fit=crop' },
  { content: 'Accessibility isn\'t a feature — it\'s a requirement. Just published a guide on building keyboard-navigable interfaces. Link in bio.', image: null },
  { content: 'Exploring generative art with p5.js. There\'s something mesmerizing about watching algorithms create beauty.', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252cb26?w=800&h=500&fit=crop' },
  { content: 'Product managers: Your roadmap is not a promise, it\'s a hypothesis. Test it, validate it, iterate on it. The best products emerge from discovery, not planning.', image: null },
  { content: 'Just automated our entire CI/CD pipeline. What used to take 45 minutes of manual work now runs in 3 minutes. DevOps is magical.', image: null },
  { content: 'Typography tip: The space between letters matters as much as the letters themselves. Kerning is an art form that most people never notice — until it\'s wrong.', image: null },
  { content: 'Morning run through the park. 5K done before the world wakes up. There\'s nothing like starting the day with a win.', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=500&fit=crop' },
  { content: 'Reading "Designing Data-Intensive Applications" for the third time. Every re-read reveals something new. This book should be required reading for every backend engineer.', image: null },
  { content: 'Technical writing tip: If you can\'t explain it simply, you don\'t understand it well enough. Start with the reader\'s problem, not your solution.', image: null },
  { content: 'Built a real-time collaboration feature this week. WebSockets + CRDTs + optimistic UI = seamless experience. The future of apps is collaborative.', image: null },
  { content: 'The difference between a good developer and a great one isn\'t technical skill — it\'s empathy. Understanding your users, your teammates, your future self.', image: null },
  { content: 'Sunset from the office rooftop. This city never stops inspiring me.', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop' },
  { content: 'Just hit 1000 contributions on GitHub this year. Consistency beats intensity. Show up every day, even when you don\'t feel like it.', image: null },
  { content: 'Controversial opinion: Dark mode should be the default for all development tools. Our eyes will thank us.', image: null },
  { content: 'Mentoring a junior developer this quarter and honestly? I\'m learning more from them than they are from me. Teaching is the best way to learn.', image: null },
];

const commentTexts = [
  'This really resonates with me. Great perspective!',
  'Couldn\'t agree more. This is something more people need to hear.',
  'Love this! Saved for later reference.',
  'This is exactly what I needed to read today. Thank you for sharing.',
  'Interesting take. I\'d love to hear more about your experience with this.',
  'Beautiful capture! The lighting is incredible.',
  'Been thinking about this a lot lately. You nailed it.',
  'Following this journey. Keep the content coming!',
  'This changed how I think about the topic. Appreciate the insight.',
  'So well said. Bookmarking this one.',
  'Incredible work! The attention to detail shows.',
  'This is gold. Sharing with my team.',
  'Great advice. I wish I had known this earlier in my career.',
  'Absolutely! Consistency is key in everything we do.',
  'Love the energy in this post. Keep going!',
  'This perspective is refreshing. Thanks for being honest about it.',
  'Amazing shot! What camera are you using?',
  'Just implemented this at work and it made a huge difference. Thanks!',
];

async function main() {
  console.log('🌱 Seeding PULSE database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);
  const createdUsers = [];

  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        ...u,
        password: hashedPassword,
      },
    });
    createdUsers.push(user);
  }

  console.log(`👤 Created ${createdUsers.length} users`);

  // Create posts (distribute across users)
  const createdPosts = [];
  for (let i = 0; i < posts.length; i++) {
    const authorIndex = i % createdUsers.length;
    const post = await prisma.post.create({
      data: {
        ...posts[i],
        authorId: createdUsers[authorIndex].id,
        createdAt: new Date(Date.now() - (posts.length - i) * 3600000 * 2),
      },
    });
    createdPosts.push(post);
  }

  console.log(`📝 Created ${createdPosts.length} posts`);

  // Create follow relationships
  const followPairs = [
    [0, 1], [0, 2], [0, 3], [0, 5],
    [1, 0], [1, 2], [1, 4], [1, 7],
    [2, 0], [2, 1], [2, 3], [2, 6],
    [3, 0], [3, 4], [3, 8],
    [4, 1], [4, 2], [4, 5], [4, 9],
    [5, 0], [5, 3], [5, 6], [5, 7],
    [6, 2], [6, 3], [6, 8], [6, 9],
    [7, 0], [7, 4], [7, 5], [7, 9],
    [8, 1], [8, 5], [8, 6], [8, 9],
    [9, 0], [9, 3], [9, 7], [9, 8],
  ];

  for (const [followerIdx, followingIdx] of followPairs) {
    await prisma.follow.create({
      data: {
        followerId: createdUsers[followerIdx].id,
        followingId: createdUsers[followingIdx].id,
      },
    });
  }

  console.log(`🤝 Created ${followPairs.length} follow relationships`);

  // Create comments (2-4 per post randomly)
  let commentCount = 0;
  for (const post of createdPosts) {
    const numComments = Math.floor(Math.random() * 3) + 2;
    const usedIndices = new Set();

    for (let i = 0; i < numComments; i++) {
      let authorIdx;
      do {
        authorIdx = Math.floor(Math.random() * createdUsers.length);
      } while (usedIndices.has(authorIdx) || createdUsers[authorIdx].id === post.authorId);
      usedIndices.add(authorIdx);

      const commentIdx = Math.floor(Math.random() * commentTexts.length);
      await prisma.comment.create({
        data: {
          content: commentTexts[commentIdx],
          postId: post.id,
          authorId: createdUsers[authorIdx].id,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 3),
        },
      });
      commentCount++;
    }
  }

  console.log(`💬 Created ${commentCount} comments`);

  // Create likes (each post gets 3-8 likes from random users)
  let likeCount = 0;
  for (const post of createdPosts) {
    const numLikes = Math.floor(Math.random() * 6) + 3;
    const likedBy = new Set([post.authorId]); // Author likes their own post sometimes

    while (likedBy.size < numLikes + 1) {
      const userIdx = Math.floor(Math.random() * createdUsers.length);
      likedBy.add(createdUsers[userIdx].id);
    }

    for (const userId of likedBy) {
      if (userId === post.authorId) continue;
      try {
        await prisma.like.create({
          data: {
            postId: post.id,
            userId: userId,
          },
        });
        likeCount++;
      } catch (e) {
        // Skip duplicate
      }
    }
  }

  console.log(`❤️ Created ${likeCount} likes`);

  // Create notifications
  // Like notifications
  const likes = await prisma.like.findMany({
    include: { post: true },
  });

  for (const like of likes) {
    const post = await prisma.post.findUnique({
      where: { id: like.postId },
    });
    if (post && post.authorId !== like.userId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: like.userId,
          type: 'LIKE',
          postId: post.id,
        },
      });
    }
  }

  // Comment notifications
  const comments = await prisma.comment.findMany();
  for (const comment of comments) {
    const post = await prisma.post.findUnique({
      where: { id: comment.postId },
    });
    if (post && post.authorId !== comment.authorId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: comment.authorId,
          type: 'COMMENT',
          postId: post.id,
        },
      });
    }
  }

  // Follow notifications
  for (const [followerIdx, followingIdx] of followPairs) {
    await prisma.notification.create({
      data: {
        userId: createdUsers[followingIdx].id,
        actorId: createdUsers[followerIdx].id,
        type: 'FOLLOW',
      },
    });
  }

  console.log('🔔 Created notifications');
  console.log('✅ Seed complete!');
  console.log('\n📋 Login credentials:');
  console.log('   Email: aria@pulse.dev');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
