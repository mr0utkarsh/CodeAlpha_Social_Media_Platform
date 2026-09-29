// Demo data for GitHub Pages deployment (no backend)
const demoUsers = [
  { id: '1', name: 'Aria Chen', username: 'aria_creates', email: 'aria@pulse.dev', bio: 'Digital artist & UI designer. Creating visual stories one pixel at a time.', avatar: 'https://api.dicebear.com/7.0/persona/svg?seed=aria&backgroundColor=b6e3f4', createdAt: '2024-01-15T10:00:00Z', _count: { followers: 128, following: 85 } },
  { id: '2', name: 'Marcus Webb', username: 'marcusw', email: 'marcus@pulse.dev', bio: 'Full-stack developer by day, photographer by night.', avatar: 'https://api.dicebear.com/7.0/persona/svg?seed=marcus&backgroundColor=c0aede', createdAt: '2024-02-01T10:00:00Z', _count: { followers: 95, following: 62 } },
  { id: '3', name: 'Luna Patel', username: 'luna.codes', email: 'luna@pulse.dev', bio: 'Software engineer passionate about accessibility and inclusive design.', avatar: 'https://api.dicebear.com/7.0/persona/svg?seed=luna&backgroundColor=ffdfbf', createdAt: '2024-02-10T10:00:00Z', _count: { followers: 210, following: 43 } },
  { id: '4', name: 'Kai Nakamura', username: 'kaistudio', email: 'kai@pulse.dev', bio: 'Motion designer & creative coder. Making the web more beautiful.', avatar: 'https://api.dicebear.com/7.0/persona/svg?seed=kai&backgroundColor=ffdfbf', createdAt: '2024-03-05T10:00:00Z', _count: { followers: 156, following: 72 } },
  { id: '5', name: 'Nova Rivera', username: 'novarivera', email: 'nova@pulse.dev', bio: 'Product manager building tools people love. Coffee enthusiast ☕', avatar: 'https://api.dicebear.com/7.0/persona/svg?seed=nova&backgroundColor=d1f4d9', createdAt: '2024-03-15T10:00:00Z', _count: { followers: 88, following: 91 } },
  { id: '6', name: 'Zen Okafor', username: 'zen_builds', email: 'zen@pulse.dev', bio: 'DevOps engineer. Automating all the things. Open source advocate.', avatar: 'https://api.dicebear.com/7.0/persona/svg?seed=zen&backgroundColor=ffe4b6', createdAt: '2024-04-01T10:00:00Z', _count: { followers: 73, following: 55 } },
  { id: '7', name: 'Iris Andersen', username: 'irisdesigns', email: 'iris@pulse.dev', bio: 'Brand designer crafting identities that resonate. Typography nerd.', avatar: 'https://api.dicebear.com/7.0/persona/svg?seed=iris&backgroundColor=c4f1f4', createdAt: '2024-04-20T10:00:00Z', _count: { followers: 145, following: 38 } },
  { id: '8', name: 'Atlas Kim', username: 'atlaskim', email: 'atlas@pulse.dev', bio: 'Data scientist exploring patterns in everything. Music lover 🎵', avatar: 'https://api.dicebear.com/7.0/persona/svg?seed=atlas&backgroundColor=ffb3ba', createdAt: '2024-05-01T10:00:00Z', _count: { followers: 67, following: 84 } },
];

const demoPosts = [
  { id: 'p1', content: 'Just shipped a new feature using React Server Components. The DX improvement is incredible — components feel so much more natural to write now. Who else is making the transition?', image: null, authorId: '1', createdAt: new Date(Date.now() - 3600000).toISOString(), author: demoUsers[0], _count: { likes: 24, comments: 8 }, isLiked: false },
  { id: 'p2', content: 'Golden hour at the coast today. Sometimes you just need to step away from the screen and remember what matters.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop', authorId: '2', createdAt: new Date(Date.now() - 7200000).toISOString(), author: demoUsers[1], _count: { likes: 42, comments: 15 }, isLiked: true },
  { id: 'p3', content: "Hot take: The best code is the code you don't write. Every line is a liability. Every dependency is a risk. Build only what you absolutely need.", image: null, authorId: '2', createdAt: new Date(Date.now() - 14400000).toISOString(), author: demoUsers[1], _count: { likes: 67, comments: 23 }, isLiked: false },
  { id: 'p4', content: 'New workspace setup complete! Standing desk + ultrawide monitor + mechanical keyboard = productivity unlocked.', image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=500&fit=crop', authorId: '3', createdAt: new Date(Date.now() - 28800000).toISOString(), author: demoUsers[2], _count: { likes: 35, comments: 11 }, isLiked: false },
  { id: 'p5', content: "Accessibility isn't a feature — it's a requirement. Just published a guide on building keyboard-navigable interfaces. Link in bio.", image: null, authorId: '3', createdAt: new Date(Date.now() - 43200000).toISOString(), author: demoUsers[2], _count: { likes: 89, comments: 31 }, isLiked: true },
  { id: 'p6', content: "Exploring generative art with p5.js. There's something mesmerizing about watching algorithms create beauty.", image: 'https://images.unsplash.com/photo-1550745165-9bc0b252cb26?w=800&h=500&fit=crop', authorId: '4', createdAt: new Date(Date.now() - 72000000).toISOString(), author: demoUsers[3], _count: { likes: 56, comments: 18 }, isLiked: false },
  { id: 'p7', content: "Product managers: Your roadmap is not a promise, it's a hypothesis. Test it, validate it, iterate on it. The best products emerge from discovery, not planning.", image: null, authorId: '5', createdAt: new Date(Date.now() - 86400000).toISOString(), author: demoUsers[4], _count: { likes: 44, comments: 16 }, isLiked: false },
  { id: 'p8', content: 'Typography tip: The space between letters matters as much as the letters themselves. Kerning is an art form that most people never notice — until it\'s wrong.', image: null, authorId: '7', createdAt: new Date(Date.now() - 100000000).toISOString(), author: demoUsers[6], _count: { likes: 38, comments: 9 }, isLiked: false },
  { id: 'p9', content: 'Morning run through the park. 5K done before the world wakes up. There\'s nothing like starting the day with a win.', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=500&fit=crop', authorId: '8', createdAt: new Date(Date.now() - 120000000).toISOString(), author: demoUsers[7], _count: { likes: 71, comments: 22 }, isLiked: true },
  { id: 'p10', content: 'The difference between a good developer and a great one isn\'t technical skill — it\'s empathy. Understanding your users, your teammates, your future self.', image: null, authorId: '6', createdAt: new Date(Date.now() - 140000000).toISOString(), author: demoUsers[5], _count: { likes: 103, comments: 27 }, isLiked: false },
  { id: 'p11', content: 'Sunset from the office rooftop. This city never stops inspiring me.', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop', authorId: '1', createdAt: new Date(Date.now() - 160000000).toISOString(), author: demoUsers[0], _count: { likes: 55, comments: 14 }, isLiked: false },
  { id: 'p12', content: 'Just hit 1000 contributions on GitHub this year. Consistency beats intensity. Show up every day, even when you don\'t feel like it.', image: null, authorId: '6', createdAt: new Date(Date.now() - 180000000).toISOString(), author: demoUsers[5], _count: { likes: 82, comments: 19 }, isLiked: false },
];

const demoNotifications = [
  { id: 'n1', userId: '1', actorId: '2', type: 'LIKE', postId: 'p1', read: false, createdAt: new Date(Date.now() - 1800000).toISOString(), actor: demoUsers[1], post: { id: 'p1', content: demoPosts[0].content } },
  { id: 'n2', userId: '1', actorId: '3', type: 'COMMENT', postId: 'p1', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), actor: demoUsers[2], post: { id: 'p1', content: demoPosts[0].content } },
  { id: 'n3', userId: '1', actorId: '4', type: 'FOLLOW', postId: null, read: false, createdAt: new Date(Date.now() - 7200000).toISOString(), actor: demoUsers[3] },
  { id: 'n4', userId: '1', actorId: '5', type: 'LIKE', postId: 'p11', read: true, createdAt: new Date(Date.now() - 14400000).toISOString(), actor: demoUsers[4], post: { id: 'p11', content: demoPosts[10].content } },
  { id: 'n5', userId: '1', actorId: '6', type: 'FOLLOW', postId: null, read: true, createdAt: new Date(Date.now() - 28800000).toISOString(), actor: demoUsers[5] },
  { id: 'n6', userId: '1', actorId: '7', type: 'COMMENT', postId: 'p11', read: true, createdAt: new Date(Date.now() - 43200000).toISOString(), actor: demoUsers[6], post: { id: 'p11', content: demoPosts[10].content } },
  { id: 'n7', userId: '1', actorId: '8', type: 'LIKE', postId: 'p11', read: true, createdAt: new Date(Date.now() - 57600000).toISOString(), actor: demoUsers[7], post: { id: 'p11', content: demoPosts[10].content } },
];

export const demoData = {
  users: demoUsers,
  posts: demoPosts,
  notifications: demoNotifications,
  currentUser: demoUsers[0],
};
