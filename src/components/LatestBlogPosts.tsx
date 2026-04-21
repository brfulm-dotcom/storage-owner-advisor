import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/supabase';

export default async function LatestBlogPosts() {
  const posts = (await getBlogPosts()).slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Latest from the Blog
            </h2>
            <p className="text-lg text-gray-600">
              Expert tips, guides, and insights for storage operators
            </p>
          </div>
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
          >
            View all posts →
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                {post.featured_image ? (
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-blue-400 text-4xl font-bold">SOA</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    {post.published_at && (
                      <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                    {post.category_slug && (
                      <>
                        <span>·</span>
                        <span className="text-blue-600 font-medium capitalize">
                          {post.category_slug.replace(/-/g, ' ')}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-block mt-auto text-blue-600 font-medium text-sm">
                    Read more →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
