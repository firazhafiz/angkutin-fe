import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { blogPosts } from "@/constant/blog-data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiClock, FiCalendar, FiArrowLeft, FiUser, FiShare2 } from "react-icons/fi";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <article className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <header className="mb-10">
            <p className="text-[#016A70] text-sm font-bold mb-6">
              {post.date}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-dark leading-[1.1] mb-12">
              {post.title}
            </h1>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl shadow-dark/5">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Heading Repeat (as in design) */}
          <h2 className="text-3xl font-black text-dark mb-8 leading-tight">
            {post.title}
          </h2>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-p:text-dark/80 prose-p:leading-relaxed prose-p:text-justify prose-headings:text-dark prose-headings:font-black prose-img:rounded-[2rem] prose-a:text-[#016A70] prose-strong:text-dark"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Recommendation Section */}
          <section className="mt-32 pt-20 border-t border-gray-100">
             <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-dark tracking-tight">Recommendation</h3>
                <Link href="/blog" className="text-[#016A70] font-bold text-sm hover:underline transition-all">
                  View all
                </Link>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                 <Link key={related.id} href={`/blog/${related.slug}`} className="group flex flex-col">
                    <div className="relative aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden mb-4 shadow-lg shadow-dark/5">
                      <Image 
                        src={related.image} 
                        alt={related.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-[#016A70]/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="text-base font-black text-dark group-hover:text-[#016A70] transition-colors line-clamp-2 leading-snug mb-3">
                        {related.title}
                      </h4>
                      <p className="text-[10px] text-dark/60 font-medium mb-4 line-clamp-2 leading-relaxed">
                        {related.excerpt}
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-[9px] font-bold text-[#016A70] uppercase tracking-widest">
                        <span>{related.author}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400">{related.date}</span>
                      </div>
                    </div>
                 </Link>
               ))}
             </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
