/**
 * Contact Us page template.
 *
 * Layout with contact information display and clean content section.
 */

import { EditorJSRenderer } from "@/ui/components/editorjs-renderer";
import type { PageTemplateProps } from "./types";

export function ContactTemplate({ page }: PageTemplateProps) {
	// Extract contact details from metadata if available
	const email = page.metadata.find((m) => m.key === "contact_email")?.value;
	const phone = page.metadata.find((m) => m.key === "contact_phone")?.value;
	const address = page.metadata.find((m) => m.key === "contact_address")?.value;

	return (
		<article className="mx-auto max-w-4xl px-6 py-12 md:py-16">
			{/* Header */}
			<header className="mb-12 text-center">
				<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
					{page.title}
				</h1>
				{page.seoDescription && (
					<p className="mx-auto mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
						{page.seoDescription}
					</p>
				)}
			</header>

			{/* Contact info cards (from metadata) */}
			{(email || phone || address) && (
				<div className="mb-12 grid gap-6 md:grid-cols-3">
					{email && (
						<div className="rounded-xl border border-neutral-200 p-6 text-center dark:border-neutral-800">
							<span className="mb-3 block text-2xl">✉️</span>
							<h3 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">Email</h3>
							<a
								href={`mailto:${email}`}
								className="text-sm text-blue-600 hover:underline dark:text-blue-400"
							>
								{email}
							</a>
						</div>
					)}
					{phone && (
						<div className="rounded-xl border border-neutral-200 p-6 text-center dark:border-neutral-800">
							<span className="mb-3 block text-2xl">📞</span>
							<h3 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">Phone</h3>
							<a href={`tel:${phone}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
								{phone}
							</a>
						</div>
					)}
					{address && (
						<div className="rounded-xl border border-neutral-200 p-6 text-center dark:border-neutral-800">
							<span className="mb-3 block text-2xl">📍</span>
							<h3 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">Address</h3>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">{address}</p>
						</div>
					)}
				</div>
			)}

			{/* Content body */}
			<div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400">
				<EditorJSRenderer content={page.content} />
			</div>
		</article>
	);
}
