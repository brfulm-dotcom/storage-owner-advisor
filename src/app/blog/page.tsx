import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/supabase';
import PageHero from '@/components/PageHero';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog - StorageOwnerAdvisor',
  description: 'Expert insights, vendor comparisons, and operational guides for self-storage facility owners. Stay current with industry trends and best practices.',
  alternates: {
    canonical: 'https://www.storageowneradvisor.com/blog',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Storage Industry Blog"
        subtitle="Expert insights, tips, and guides for self-storage facility owners and operators."
      />

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No posts yet — check back soon!</p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                  {/* Image / placeholder */}
                  <div className="relative w-full sm:w-1/3 aspect-[16/10] sm:aspect-auto sm:min-h-[200px] flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="p-6 sm:p-8 flex-1">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      {post.published_at && (
                        <time dateTime={post.published_at}>
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
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
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                    <span className="inline-block mt-4 text-blue-600 font-medium text-sm">
                      Read more →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
