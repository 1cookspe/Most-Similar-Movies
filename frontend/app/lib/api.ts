interface Movie {
    title: string;
    description: string;
    rating: number;
    release_year: number;
}

interface RecommendationsResponse {
    recommendations: Movie[];
}

export async function getTopMovies(query: string): Promise<{ topMovies: Movie[]; apiError: string | null }> {
    if (!query.trim()) {
        return { topMovies: [], apiError: null };
    }

    try {
        // Get base URL from environment variable
        const BASE_URL = process.env.BACKEND_URL;
        // Fetch response from API
        const response = await fetch(`${BASE_URL}/api/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        // Check if response is OK; if not, return empty list of movies with the error
        if (!response.ok) {
            return { topMovies: [], apiError: `Server error: ${response.status}`}
        }

        // Get the data from the response
        const data: RecommendationsResponse = await response.json();
        // Return the movies with no error
        return { topMovies: data.recommendations, apiError: null };

    } catch (error: any) {
        // An error occurred when performing the fetch request; return the error
        return { topMovies: [], apiError: error.message || "Unknown error occurred" };
    }
}
