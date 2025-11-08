import Search from "@/app/ui/search";
import ResultsList from "@/app/ui/results-list";
import { ResultsTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  // Get the query from the Search component in the URL
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  // Render the search bar and results table
  return (
    <div className="w-full p-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
        Movie Recommendations
      </h1>
      <p className="pt-4 pb-2">Looking for your next movie? Describe the movie you would like to watch, and we'll find the best matches for you!</p>
      <Search placeholder="What kind of movie do you want to watch?" />
      <Suspense key={query} fallback={
        <ResultsTableSkeleton />
      }>
        <ResultsList query={query} />
      </Suspense>
    </div>
  );
}
