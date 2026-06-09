import Link from "next/link";
import { notFound } from "next/navigation";
import { executePublicGraphQL } from "@/lib/graphql";
import { BlogPostListDocument } from "@/gql/graphql";

export const metadata = {
	title: "Blog · Saleor Storefront",
	description: "Read our latest articles, guides, and news.",
};

export default async function BlogPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const channel = params.channel;

	const result = await executePublicGraphQL(BlogPostListDocument, {
		variables: { channel },
		revalidate: 60,
	});

	if (!result.ok || !result.data?.blogPosts) {
		notFound();
	}

	const posts = result.data.blogPosts.edges.map((edge) => edge.node);

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div className="mb-12 max-w-3xl">
				<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Company Blog</h1>
				<p className="mt-4 text-xl text-slate-500">
					Discover the latest stories, news, and insights from our team.
				</p>
			</div>

			{posts.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-300 py-24 text-center">
					<p className="text-lg text-slate-500">No blog posts found. Check back later!</p>
				</div>
			) : (
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => {
						const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
							year: "numeric",
							month: "long",
							day: "numeric",
						});

						return (
							<article
								key={post.id}
								className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
							>
								<Link
									href={`/${channel}/blog/${post.slug}`}
									className="relative block aspect-video overflow-hidden bg-slate-100"
								>
									{post.featuredImage ? (
										<img
											src={post.featuredImage}
											alt={post.title}
											className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200">
											<span className="text-lg font-medium text-slate-400">Saleor Blog</span>
										</div>
									)}
								</Link>

								<div className="flex flex-1 flex-col p-6">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
											<time dateTime={post.createdAt}>{formattedDate}</time>
											<span>•</span>
											<span>{post.readingTimeMinutes || 5} min read</span>
										</div>

										<Link href={`/${channel}/blog/${post.slug}`} className="mt-2 block">
											<h2 className="text-xl font-bold text-slate-900 transition-colors hover:text-blue-600">
												{post.title}
											</h2>
										</Link>

										{post.category && (
											<span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
												{post.category.name}
											</span>
										)}
									</div>

									<div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
										{post.author?.avatarUrl && (
											<img
												src={post.author.avatarUrl}
												alt={post.author.name}
												className="h-8 w-8 rounded-full"
											/>
										)}
										<div>
											<p className="text-sm font-medium text-slate-900">
												{post.author?.name || "Anonymous Team"}
											</p>
										</div>
									</div>
								</div>
							</article>
						);
					})}
				</div>
			)}
		</div>
	);
}
