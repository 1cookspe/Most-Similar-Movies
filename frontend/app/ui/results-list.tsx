import { getTopMovies } from "@/app/lib/api";

export default async function ResultsList({
	query
}: {
	query: string
}) {
	// Don't show anything if there's no query
	if (!query.trim()) {
		return null;
	}

	// Now start the movie fetch - Suspense will show while this is pending
	const { topMovies, apiError } = await getTopMovies(query);

	// First, check if we had any errors with retrieving the top movies
	if (apiError) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500">Internal server error. Please try again later.</p>
			</div>
		);
	}

	// We do not have an API error, so we will check if we have at least 1 movie
	if (!topMovies || topMovies.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">No movies found. Try a different description!</p>
			</div>
		);
	}

	// Return the table with the top movies
	return (
		<div className="mt-6 flow-root">
			<div className="inline-block min-w-full align-middle">
				<div className="rounded-lg bg-gray-50 p-2 md:pt-0">
					<div className="md:hidden">
						{topMovies?.map((movie, index) => (
							<div
								key={`${movie.title}-${index}`}
								className="mb-2 w-full rounded-md bg-white p-4"
							>
								<div className="flex items-center justify-between border-b pb-4">
									{/* Left side: title and year */}
									<div className="flex items-center gap-2 text-xl font-medium">
										<p>{movie.title}</p>
										<span className="text-sm text-gray-500">({movie.release_year})</span>
									</div>

									{/* Right side: rating */}
									<p className="text-sm text-gray-700">{movie.rating} / 10</p>
								</div>
								<div className="flex w-full items-center justify-between pt-4">
									<div>
										<p>
											{movie.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
					<table className="hidden min-w-full text-gray-900 md:table">
						<thead className="rounded-lg text-left text-sm font-normal">
							<tr>
								<th scope="col" className="px-4 py-5 font-medium sm:pl-6 text-center">
									Name
								</th>
								<th scope="col" className="px-3 py-5 font-medium text-center">
									Year
								</th>
								<th scope="col" className="px-3 py-5 font-medium text-center">
									Description
								</th>
								<th scope="col" className="px-3 py-5 font-medium text-center">
									Rating
								</th>
							</tr>
						</thead>
						<tbody className="bg-white">
							{topMovies?.map((movie, index) => (
								<tr
									key={`${movie.title}-${index}`}
									className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
								>
									<td className="whitespace-nowrap py-3 pl-6 pr-3">
										<p className="text-center text-xl font-medium">{movie.title}</p>
									</td>
									<td className="whitespace-nowrap px-3 py-3 text-center">
										{movie.release_year}
									</td>
									<td className="whitespace-wrap px-3 py-3 text-center text-base">
										{movie.description}
									</td>
									<td className="whitespace-nowrap px-3 py-3 text-center">
										{movie.rating}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
