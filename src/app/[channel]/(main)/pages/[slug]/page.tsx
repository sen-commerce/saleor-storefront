import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { createElement } from "react";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { getTemplateForPageType } from "@/ui/components/page-templates";

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
	const params = await props.params;
	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	const page = result.ok ? result.data.page : null;

	return {
		title: `${page?.seoTitle || page?.title || "Page"} · Saleor Storefront example`,
		description: page?.seoDescription || page?.seoTitle || page?.title,
	};
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	if (!result.ok || !result.data.page) {
		notFound();
	}

	const page = result.data.page;

	// Dispatcher: route to the appropriate template based on PageType slug
	const pageTypeSlug = page.pageType?.slug ?? "default";
	const template = getTemplateForPageType(pageTypeSlug);

	return createElement(template, { page });
}
