import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Star, Check, ArrowLeft } from "lucide-react";
import { executePublicGraphQL } from "@/lib/graphql";
import { BlogPostGetBySlugDocument } from "@/gql/graphql";
import { TipTapRenderer } from "@/ui/components/TipTapRenderer/TipTapRenderer";

interface Comment {
	author: string;
	avatar_url?: string;
	text: string;
	rating?: number;
	verified?: boolean;
	date?: string;
}

export const generateMetadata = async (props: {
	params: Promise<{ slug: string; channel: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const result = await executePublicGraphQL(BlogPostGetBySlugDocument, {
		variables: { slug: params.slug, channel: params.channel },
		revalidate: 60,
	});

	const post = result.ok ? result.data.blogPost : null;

	return {
		title: `${post?.title || "Article"} · Saleor Blog`,
		description: post?.title || "Read our latest article",
	};
};

export default async function BlogPostPage(props: { params: Promise<{ slug: string; channel: string }> }) {
	const params = await props.params;
	const { slug, channel } = params;

	const result = await executePublicGraphQL(BlogPostGetBySlugDocument, {
		variables: { slug, channel },
		revalidate: 60,
	});

	if (!result.ok || !result.data.blogPost) {
		notFound();
	}

	const post = result.data.blogPost;

	const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	let comments: Comment[] = [];
	if (post.featuredComments) {
		try {
			comments =
				typeof post.featuredComments === "string"
					? (JSON.parse(post.featuredComments) as Comment[])
					: (post.featuredComments as any);
		} catch (e) {
			console.error("Failed to parse comments", e);
		}
	}

	return (
		<article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
			{/* Back button */}
			<Link
				href={`/${channel}/blog`}
				className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
			>
				<ArrowLeft size={16} /> Back to articles
			</Link>

			{/* Header */}
			<header className="mb-10">
				{post.category && (
					<span className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
						{post.category.name}
					</span>
				)}
				<h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
					{post.title}
				</h1>

				<div className="flex items-center justify-between border-y border-slate-200 py-6">
					<div className="flex items-center gap-3">
						{post.author?.avatarUrl ? (
							<img
								src={post.author.avatarUrl}
								alt={post.author.name}
								className="h-12 w-12 rounded-full object-cover"
							/>
						) : (
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500">
								{post.author?.name ? post.author.name.charAt(0) : "T"}
							</div>
						)}
						<div>
							<p className="text-sm font-semibold text-slate-900">{post.author?.name || "Anonymous Team"}</p>
							{post.author?.bio && (
								<p className="mt-0.5 line-clamp-1 max-w-md text-xs text-slate-500">{post.author.bio}</p>
							)}
						</div>
					</div>

					<div className="text-right text-sm text-slate-500">
						<time dateTime={post.createdAt}>{formattedDate}</time>
						<p className="mt-1">{post.readingTimeMinutes || 5} min read</p>
					</div>
				</div>
			</header>

			{/* Featured Image */}
			{post.featuredImage && (
				<div className="relative mb-12 aspect-video overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
					<img src={post.featuredImage} alt={post.title} className="h-full w-full object-cover" />
				</div>
			)}

			{/* Main Body */}
			<section className="border-b border-slate-200 pb-16">
				<TipTapRenderer node={post.content} />
			</section>

			{/* Static Comments Section */}
			<section className="mt-16">
				<h2 className="mb-8 text-2xl font-bold text-slate-900">What Readers Say ({comments.length})</h2>

				{comments.length === 0 ? (
					<p className="italic text-slate-500">
						No comments featured yet. Be the first to share your thoughts!
					</p>
				) : (
					<div className="grid gap-6 md:grid-cols-2">
						{comments.map((comment, i) => {
							const initial = comment.author ? comment.author.charAt(0).toUpperCase() : "?";
							return (
								<div
									key={i}
									className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
								>
									<div className="mb-4 flex items-center gap-3">
										{comment.avatar_url ? (
											<img
												src={comment.avatar_url}
												alt={comment.author}
												className="h-10 w-10 rounded-full object-cover"
											/>
										) : (
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
												{initial}
											</div>
										)}
										<div>
											<p className="text-sm font-semibold text-slate-900">{comment.author}</p>
											<div className="mt-0.5 flex items-center gap-2">
												{comment.date && <span className="text-xs text-slate-500">{comment.date}</span>}
												{comment.verified && (
													<span className="inline-flex items-center gap-0.5 rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
														<Check size={8} /> Verified
													</span>
												)}
											</div>
										</div>
									</div>

									{comment.rating && (
										<div className="mb-3 flex gap-0.5">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													size={14}
													className={
														star <= comment.rating! ? "fill-amber-400 stroke-amber-400" : "stroke-slate-300"
													}
												/>
											))}
										</div>
									)}

									<p className="text-sm leading-relaxed text-slate-600">{comment.text}</p>
								</div>
							);
						})}
					</div>
				)}
			</section>
		</article>
	);
}
