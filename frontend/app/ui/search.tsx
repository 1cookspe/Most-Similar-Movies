'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	// Local state for the input value
	const [term, setTerm] = useState(searchParams.get('query')?.toString() || '');

	// Debounced callback is used so that the search results are shown and updated as the user types
	const handleSearch = useDebouncedCallback((term) => {
		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set('query', term);
		} else {
			params.delete('query');
		}
		// Add /query?= to URL
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	// Keep state in sync if URL changes
	useEffect(() => {
		console.log("updating search bar...");
		setTerm(searchParams.get('query')?.toString() || '');
	}, [searchParams]);

	// Define suggestions that user can select as example searches
	const suggestions = [
		"superheroes who save the city",
		"underdog story winning big",
		"royal family",
		"falsely accused of crime"
	];

	// Return the search form
	return (
		<div className="w-full">
			<div className="relative flex flex-1 flex-shrink-0">
				<label htmlFor="search" className="sr-only">
					Search
				</label>
				<input
					className="peer block w-full rounded-md border border-white-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-white-500"
					value={term}
					placeholder={placeholder}
					onChange={(e) => {
						setTerm(e.target.value);
						handleSearch(e.target.value);
					}}
					defaultValue={searchParams.get('query')?.toString()}
				/>
				<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
			</div>

			{/* Suggestions */}
			<div className="mt-3">
				<p className="mb-2 text-sm text-gray-600">Need a suggestion? Try these:</p>
				<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
					{suggestions.map((s) => (
						<button
							key={s}
							onClick={() => {
								setTerm(s);
								handleSearch(s);
							}}
							className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
						>
							{s}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
