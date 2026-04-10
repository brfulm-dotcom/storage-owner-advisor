import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/supabase';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog - StorageOwnerAdvisor',
  description: 'Expert insights, tips, and guides for self-storage facility owners and operators.',
  alternates: {
    canonical: 'https://www.storageowneradvisor.com/blog',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Storage Industry Blog
          </h1>
          <p className="text-lg text-blue-100">
            Expert insights, tips, and guides for self-storage facility owners and operators.
          </p>
        </div>
      </div>

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
                <Link href={`/blog/${post.slug}`} className="block p-6 sm:p-8">
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
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
