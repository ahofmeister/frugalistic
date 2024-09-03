export default async function DevPage() {
  return <div>{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}</div>;
}
