export const grades = [
  "Reception / Kindergarten", "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "Junior Secondary 1", "Junior Secondary 2", "Junior Secondary 3", "Secondary 1", "Secondary 2", "Secondary 3"
];

export const countries = [
  { code: "NG", name: "Nigeria", curricula: ["NERDC Basic Education Curriculum", "Cambridge International"] },
  { code: "GB", name: "United Kingdom", curricula: ["England National Curriculum", "Cambridge International"] },
  { code: "US", name: "United States", curricula: ["Common Core State Standards", "Next Generation Science Standards"] },
  { code: "GH", name: "Ghana", curricula: ["Ghana Education Service Curriculum"] },
  { code: "ZA", name: "South Africa", curricula: ["CAPS"] },
  { code: "KE", name: "Kenya", curricula: ["CBC"] },
  { code: "IN", name: "India", curricula: ["CBSE", "ICSE"] },
  { code: "CA", name: "Canada", curricula: ["Provincial curriculum (select province in production)"] }
];

// Demo curriculum content only. Replace/extend with verified, licensed curriculum data before school deployment.
export const lessons = [
  { id: "math-fractions", subject: "Mathematics", title: "Understanding fractions", grade: "Primary 4", minutes: 12, objective: "Recognise fractions as equal parts of a whole.", explanation: "A fraction describes equal parts of a whole. In 1/2, the bottom number (2) tells us the whole is split into two equal parts; the top number (1) tells us we have one of those parts.", questions: [
    { q: "A pizza is cut into 4 equal slices. You eat 1. What fraction did you eat?", options: ["1/4", "4/1", "1/3"], answer: 0, explain: "One of four equal slices is 1/4." },
    { q: "Which fraction means one half?", options: ["1/3", "1/2", "2/1"], answer: 1, explain: "One of two equal parts is 1/2." },
    { q: "A shape has 8 equal parts and 3 are shaded. What fraction is shaded?", options: ["8/3", "3/8", "3/5"], answer: 1, explain: "Three of eight equal parts gives 3/8." }
  ]},
  { id: "english-main-idea", subject: "English", title: "Finding the main idea", grade: "Primary 4", minutes: 10, objective: "Identify the central idea in a short passage.", explanation: "The main idea is what a passage is mostly about. Details give extra information that supports the main idea.", questions: [
    { q: "A passage explains how bees collect nectar and help flowers. What is its likely main idea?", options: ["Bees help plants and collect nectar", "Flowers are always blue", "All insects live in water"], answer: 0, explain: "This choice captures the central point described." },
    { q: "What do supporting details do?", options: ["Change the topic", "Give information about the main idea", "Always ask a question"], answer: 1, explain: "Supporting details explain or give evidence for the main idea." },
    { q: "Which is the best way to find a main idea?", options: ["Read only the last word", "Look for what most details are about", "Count the letters"], answer: 1, explain: "Look across the passage and identify the common topic." }
  ]},
  { id: "science-habitats", subject: "Basic Science", title: "Habitats and living things", grade: "Primary 4", minutes: 11, objective: "Explain how a habitat meets an organism's needs.", explanation: "A habitat is the natural place where a living thing gets what it needs, such as food, water, shelter and suitable conditions.", questions: [
    { q: "What is a habitat?", options: ["A living thing's natural home", "A type of weather", "A measuring tool"], answer: 0, explain: "A habitat is where an organism lives and meets its needs." },
    { q: "Which is a need for most animals?", options: ["Plastic toys", "Food and water", "A school uniform"], answer: 1, explain: "Animals need resources such as food and water to survive." },
    { q: "A fish is best suited to which habitat?", options: ["A dry desert", "A tree branch", "A pond or other suitable water body"], answer: 2, explain: "Fish are adapted to living in water." }
  ]}
];

export const initialProgress = {
  "math-fractions": { attempts: 0, best: 0, mastery: 0, status: "New", lastScore: null },
  "english-main-idea": { attempts: 0, best: 0, mastery: 0, status: "New", lastScore: null },
  "science-habitats": { attempts: 0, best: 0, mastery: 0, status: "New", lastScore: null }
};