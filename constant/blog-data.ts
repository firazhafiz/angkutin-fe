export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How Smart Recycling is Changing Our Cities",
    slug: "how-smart-recycling-changing-cities",
    excerpt: "Discover how digital platforms are streamlining waste management and creating cleaner urban environments.",
    content: `
      <p>Recycling has come a long way from simple sorting bins. Today, technology is playing a crucial role in how we manage waste in our cities. From IoT-enabled bins to integrated digital platforms like Angkutin, the future of waste management is smart.</p>
      <h2>The Rise of Integrated Platforms</h2>
      <p>One of the biggest challenges in urban waste management is coordination. When citizens, collection services, and recycling centers are disconnected, efficiency drops. Integrated platforms bridge this gap by providing real-time data and seamless communication.</p>
      <h2>Impact on Urban Sustainability</h2>
      <p>By optimizing collection routes and improving sorting accuracy, cities can significantly reduce their carbon footprint. Smart recycling isn't just about waste; it's about building a sustainable ecosystem for future generations.</p>
    `,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    author: "Angkutin Team",
    date: "May 15, 2025",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "5 Simple Ways to Reduce Your Daily Plastic Waste",
    slug: "5-simple-ways-reduce-plastic-waste",
    excerpt: "Practical tips you can start today to minimize your environmental footprint and live more sustainably.",
    content: `
      <p>Reducing plastic waste doesn't have to be overwhelming. Small changes in your daily routine can lead to significant environmental benefits. Here are five simple ways to get started.</p>
      <ol>
        <li><strong>Switch to Reusable Bags:</strong> Keep a foldable cloth bag in your car or backpack.</li>
        <li><strong>Ditch Single-Use Bottles:</strong> Invest in a high-quality stainless steel water bottle.</li>
        <li><strong>Say No to Plastic Straws:</strong> Use bamboo or metal straws if you need one.</li>
        <li><strong>Buy in Bulk:</strong> Reduce packaging by choosing larger quantities or refill stations.</li>
        <li><strong>Choose Glass over Plastic:</strong> When possible, opt for products packaged in glass.</li>
      </ol>
    `,
    category: "Tips",
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=2070&auto=format&fit=crop",
    author: "Eco Specialist",
    date: "May 12, 2025",
    readTime: "3 min read",
  },
  {
    id: "3",
    title: "The Future of Waste Management in Indonesia",
    slug: "future-waste-management-indonesia",
    excerpt: "An in-depth look at upcoming trends and innovations in the Indonesian waste management industry.",
    content: `
      <p>Indonesia is at a turning point in its journey toward sustainable waste management. With a growing population and increasing urbanization, the need for innovative solutions has never been greater.</p>
      <h2>Community-Driven Solutions</h2>
      <p>We are seeing a surge in community-led initiatives that prioritize local sorting and composting. These grassroots movements are essential for long-term success.</p>
      <h2>Government Policy and Technology</h2>
      <p>New regulations and the adoption of smart technologies are paving the way for a more organized and efficient industry. The synergy between policy and innovation will define the next decade.</p>
    `,
    category: "Industry",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop",
    author: "Ahmad Rizky",
    date: "10 May 2025",
    readTime: "7 min read",
  },
  {
    id: "4",
    title: "Trend Kemasan Berkelanjutan di Industri Pengemasan",
    slug: "trend-kemasan-berkelanjutan",
    excerpt: "Industri pengemasan atau packaging saat ini menjadi salah satu pemicu sampah plastik terbesar.",
    content: `
      <p>Industri pengemasan atau packaging saat ini menjadi salah satu pemicu sampah plastik terbesar. Namun, tren mulai beralih ke material yang lebih ramah lingkungan.</p>
      <p>Permasalahan sampah masih menjadi pembicaraan yang tidak hanya di kota-kota besar, bahkan sampai ke tingkat pedesaan. Hal ini memicu inovasi di sektor kemasan berkelanjutan.</p>
    `,
    category: "Packaging",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2070&auto=format&fit=crop",
    author: "Ilham",
    date: "24 Jun 2025",
    readTime: "4 min read",
  },
  {
    id: "5",
    title: "Inovasi Pengolahan Sampah Organik Rumah Tangga",
    slug: "inovasi-pengolahan-sampah-organik",
    excerpt: "Mengolah sampah organik di rumah dapat mengurangi beban TPA secara signifikan.",
    content: `
      <p>Sampah organik merupakan penyumbang volume terbesar di TPA. Dengan pengolahan yang tepat di sumbernya, kita bisa menciptakan pupuk yang bermanfaat.</p>
    `,
    category: "Community",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop",
    author: "Rina",
    date: "15 Jul 2025",
    readTime: "6 min read",
  },
];
