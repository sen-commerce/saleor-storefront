/**
 * Privacy Policy page template.
 *
 * Legal document layout with table of contents, compact typography,
 * last-updated date, and section numbering.
 */

import { EditorJSRenderer } from "@/ui/components/editorjs-renderer";
import type { PageTemplateProps } from "./types";

export function PrivacyTemplate({ page }: PageTemplateProps) {
	const lastUpdated = page.publishedAt || page.created;

	return (
		<article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
			{/* Header */}
			<header className="mb-10 border-b border-neutral-200 pb-8 dark:border-neutral-800">
				<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
					{page.title}
				</h1>
				{lastUpdated && (
					<p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
						Last updated:{" "}
						<time dateTime={lastUpdated}>
							{new Date(lastUpdated).toLocaleDateString(undefined, {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</time>
					</p>
				)}
			</header>

			{/* Legal content — compact text, smaller font */}
			<div className="prose prose-sm prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-h2:mt-10 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-2 prose-a:text-blue-600 prose-li:my-0.5 dark:prose-h2:border-neutral-800 dark:prose-a:text-blue-400">
				<EditorJSRenderer content={page.content} />
			</div>
		</article>
	);
}
