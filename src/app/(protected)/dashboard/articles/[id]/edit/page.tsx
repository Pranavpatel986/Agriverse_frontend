import { AuthGate } from "@/features/auth/components/auth-gate";
import { EditArticleForm } from "@/features/articles/components/edit-article-form";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  return (
    <AuthGate minimumRole="AUTHOR">
      <EditArticleForm id={id} />
    </AuthGate>
  );
}
