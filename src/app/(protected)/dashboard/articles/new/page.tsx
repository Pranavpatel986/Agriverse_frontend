"use client";

import { AuthGate } from "@/features/auth/components/auth-gate";
import { ArticleForm } from "@/features/articles/components/article-form";

function NewArticleContent() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-display mb-6 text-2xl font-semibold">New article</h1>
      <ArticleForm />
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <AuthGate minimumRole="AUTHOR">
      <NewArticleContent />
    </AuthGate>
  );
}
