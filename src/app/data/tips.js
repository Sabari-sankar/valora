// Valora Inbuilt Quote / Financial Tips Data

export const expenseTips = [
  {
    "id": "exp-1",
    "category": "Food & Dining",
    "tip": "Brew your own gourmet coffee or tea at home instead of buying premium cafe cups daily. Save substantial amounts annually. (Tip #1)"
  },
  {
    "id": "exp-2",
    "category": "Utilities",
    "tip": "Turn off water heaters and air conditioning units when leaving the room. Substantially cuts monthly electric bills. (Tip #2)"
  },
  {
    "id": "exp-3",
    "category": "Groceries",
    "tip": "Buy monthly dry kitchen provisions and staples in bulk from local wholesale markets or wholesale vendors to save 15-20%. (Tip #3)"
  },
  {
    "id": "exp-4",
    "category": "Transport",
    "tip": "Use public transit, subways, or bike pools for daily commutes instead of booking single-rider cabs. Save thousands yearly. (Tip #4)"
  },
  {
    "id": "exp-5",
    "category": "Dining Out",
    "tip": "Set a monthly dining out budget and prefer local family-owned eateries over premium food delivery apps. Save delivery and service fees. (Tip #5)"
  },
  {
    "id": "exp-6",
    "category": "Savings",
    "tip": "Automate a portion of your monthly income directly into low-cost index funds or savings instruments on payday. (Tip #6)"
  },
  {
    "id": "exp-7",
    "category": "Food & Dining",
    "tip": "Pack home-cooked lunches and snacks for work or travel. Healthy, hygienic, and saves significant food budget. (Tip #7)"
  },
  {
    "id": "exp-8",
    "category": "Appliances",
    "tip": "Maintain home appliances and vehicles regularly. Regular servicing prevents expensive replacements or emergency repairs. (Tip #8)"
  },
  {
    "id": "exp-9",
    "category": "Shopping",
    "tip": "Wait for 48 hours before making any non-essential purchase to evaluate if it is a need or a temporary impulse. (Tip #9)"
  },
  {
    "id": "exp-10",
    "category": "Clothing",
    "tip": "Focus on building a versatile capsule wardrobe with high-quality items instead of buying fast fashion. (Tip #10)"
  },
  {
    "id": "exp-11",
    "category": "Transport",
    "tip": "Buy multi-ride passes or transit smart cards to enjoy local commuter discounts and skip long ticket queues. (Tip #11)"
  },
  {
    "id": "exp-12",
    "category": "Entertainment",
    "tip": "Host cozy potlucks and board game nights at home instead of expensive nightclub or high-end restaurant outings. (Tip #12)"
  },
  {
    "id": "exp-13",
    "category": "Subscriptions",
    "tip": "Audit your bank statements monthly to identify and cancel unused streaming, app, or gym subscriptions. (Tip #13)"
  },
  {
    "id": "exp-14",
    "category": "Shopping",
    "tip": "Always carry reusable shopping bags to avoid purchasing paper or plastic bags at checkout counters. (Tip #14)"
  },
  {
    "id": "exp-15",
    "category": "Groceries",
    "tip": "Purchase seasonal produce directly from local farmers' markets or co-ops. Fresher, healthier, and significantly cheaper. (Tip #15)"
  },
  {
    "id": "exp-16",
    "category": "Utilities",
    "tip": "Switch to energy-efficient LED light bulbs and smart power strips to reduce standby power consumption. (Tip #16)"
  },
  {
    "id": "exp-17",
    "category": "Entertainment",
    "tip": "Look for free community events, parks, and museums with free entry days for cost-effective weekend recreation. (Tip #17)"
  },
  {
    "id": "exp-18",
    "category": "Shopping",
    "tip": "Buy generic brands for basic household items and cleaning supplies. They perform identically for half the price. (Tip #18)"
  },
  {
    "id": "exp-19",
    "category": "Health",
    "tip": "Opt for generic prescription medications over brand-name equivalents whenever approved by your physician. (Tip #19)"
  },
  {
    "id": "exp-20",
    "category": "Finance",
    "tip": "Track all minor cash expenses offline using a digital ledger. Unmonitored cash purchases drain your savings silently. (Tip #20)"
  }
];

export const incomeTips = [
  {
    "id": "inc-1",
    "category": "Real Estate",
    "tip": "Lease out spare rooms or storage space in your home to students, travelers, or local professionals. (Tip #1)"
  },
  {
    "id": "inc-2",
    "category": "Freelance",
    "tip": "Monetize professional skills like writing, designing, coding, or translating through global freelance platforms. (Tip #2)"
  },
  {
    "id": "inc-3",
    "category": "Education",
    "tip": "Conduct online or offline tutorials, test preparation classes, or language lessons in your fields of expertise. (Tip #3)"
  },
  {
    "id": "inc-4",
    "category": "Investments",
    "tip": "Build a passive income stream by investing in dividend-paying stocks, high-yield savings, or index funds. (Tip #4)"
  },
  {
    "id": "inc-5",
    "category": "Side Hustle",
    "tip": "Create digital assets like e-books, online courses, or templates that can be sold repeatedly with zero marginal cost. (Tip #5)"
  },
  {
    "id": "inc-6",
    "category": "Boutique",
    "tip": "Launch a custom home-based craft, design, or custom tailoring business catering to local clients. (Tip #6)"
  },
  {
    "id": "inc-7",
    "category": "Services",
    "tip": "Provide neighborhood services like property maintenance, plant care, or grocery deliveries to senior citizens. (Tip #7)"
  },
  {
    "id": "inc-8",
    "category": "E-Commerce",
    "tip": "Sell unique handmade crafts, artwork, or customized merchandise through dedicated online marketplaces. (Tip #8)"
  },
  {
    "id": "inc-9",
    "category": "Rentals",
    "tip": "Rent out specialized equipment (like high-end cameras, tools, or event decorations) when not in active use. (Tip #9)"
  },
  {
    "id": "inc-10",
    "category": "Consulting",
    "tip": "Offer consulting or coaching services to small business owners looking to optimize their operations or digital presence. (Tip #10)"
  }
];

export function getRandomTips() {
  const randomExpense = [];
  const randomIncome = [];
  
  const expIndices = new Set();
  const expLimit = Math.min(5, expenseTips.length);
  while (expIndices.size < expLimit) {
    expIndices.add(Math.floor(Math.random() * expenseTips.length));
  }
  
  const incIndices = new Set();
  const incLimit = Math.min(5, incomeTips.length);
  while (incIndices.size < incLimit) {
    incIndices.add(Math.floor(Math.random() * incomeTips.length));
  }
  
  expIndices.forEach(idx => randomExpense.push(expenseTips[idx]));
  incIndices.forEach(idx => randomIncome.push(incomeTips[idx]));
  
  return {
    expense: randomExpense,
    income: randomIncome
  };
}
