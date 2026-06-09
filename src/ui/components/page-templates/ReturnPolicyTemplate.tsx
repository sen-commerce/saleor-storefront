/**
 * Return Policy page template.
 *
 * Clear and structured layout emphasizing steps, timelines, and key conditions.
 */

import { EditorJSRenderer } from "@/ui/components/editorjs-renderer";
import type { PageTemplateProps } from "./types";

export function ReturnPolicyTemplate({ page }: PageTemplateProps) {
	const lastUpdated = page.publishedAt || page.created;

	return (
		<article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
			{/* Header with info banner */}
			<header className="mb-10">
				<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
					{page.title}
				</h1>
				{lastUpdated && (
					<p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
						Effective date:{" "}
						<time dateTime={lastUpdated}>
							{new Date(lastUpdated).toLocaleDateString(undefined, {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</time>
					</p>
				)}
				{/* Quick info banner */}
				<div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
					<p className="text-sm font-medium text-blue-800 dark:text-blue-300">
						📋 Please review our return policy carefully before making a purchase.
					</p>
				</div>
			</header>

			{/* Content */}
			<div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-h2:mt-10 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4 prose-a:text-blue-600 dark:prose-a:text-blue-400">
				<EditorJSRenderer content={page.content} />
			</div>
		</article>
	);
}
