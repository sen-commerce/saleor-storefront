/**
 * Affiliate Program page template.
 *
 * Marketing-focused layout with CTA sections and benefit highlights.
 */

import { EditorJSRenderer } from "@/ui/components/editorjs-renderer";
import type { PageTemplateProps } from "./types";

export function AffiliateTemplate({ page }: PageTemplateProps) {
	// Extract affiliate link from metadata if available
	const affiliateLink = page.metadata.find((m) => m.key === "affiliate_signup_url")?.value;

	return (
		<article className="mx-auto max-w-4xl px-6 py-12 md:py-20">
			{/* Hero section */}
			<header className="mb-16 text-center">
				<span className="mb-4 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
					Partner with us
				</span>
				<h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-5xl">
					{page.title}
				</h1>
				{page.seoDescription && (
					<p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
						{page.seoDescription}
					</p>
				)}
				{affiliateLink && (
					<a
						href={affiliateLink}
						className="mt-8 inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl"
					>
						Join Now →
					</a>
				)}
			</header>

			{/* Content */}
			<div className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-purple-600 dark:prose-a:text-purple-400">
				<EditorJSRenderer content={page.content} />
			</div>

			{/* Bottom CTA */}
			{affiliateLink && (
				<footer className="mt-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center text-white md:p-12">
					<h2 className="text-2xl font-bold md:text-3xl">Ready to Start Earning?</h2>
					<p className="mx-auto mt-3 max-w-lg text-purple-100">
						Join our affiliate program today and start earning commissions on every referral.
					</p>
					<a
						href={affiliateLink}
						className="mt-6 inline-flex items-center rounded-lg bg-white px-6 py-3 font-semibold text-purple-700 shadow-lg transition-all hover:shadow-xl"
					>
						Sign Up Now
					</a>
				</footer>
			)}
		</article>
	);
}
