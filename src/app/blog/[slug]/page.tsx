import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPostSlugs, getCategoryBySlug } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} - StorageOwnerAdvisor Blog`,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: `https://www.storageowneradvisor.com/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const category = post.category_slug ? await getCategoryBySlug(post.category_slug) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="text-blue-600 hover:text-blue-700">Blog</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            {post.published_at && (
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.author && (
              <>
                <span>·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {category.name}
            </Link>
          )}
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:text-gray-700 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          {category && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Looking for {category.name} vendors?
              </h3>
              <p className="text-gray-600 mb-4">
                Browse our directory of trusted {category.name.toLowerCase()} providers for storage facilities.
              </p>
              <Link
                href={`/category/${category.slug}`}
                className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View {category.name} Vendors
              </Link>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
