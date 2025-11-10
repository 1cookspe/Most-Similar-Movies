from fastapi import FastAPI
from pydantic import BaseModel
import cohere
from dotenv import load_dotenv
import os
from pinecone import Pinecone
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv(override=True)
FRONTEND_URL = str(os.getenv("FRONTEND_URL"))

# Create instance of the FastAPI app
app = FastAPI()

# Add middleware to ensure that we can access the server from our frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",	# local frontend
				   FRONTEND_URL],	# deployed frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the Cohere client
co = cohere.ClientV2(os.getenv("COHERE_API_KEY"))

# Create the Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
# Connect to the Pinecone index
index = pc.Index(PINECONE_INDEX_NAME)

# Create data model for our request, which is a string query
class RecommendationRequest(BaseModel):
    query: str

@app.get("/")
async def read_root():
	return {"message": "Hello world from FastAPI!"}

# Create API route to get movie recommendations from a search query
@app.post("/api/recommendations")
async def get_recommendations(request: RecommendationRequest):
	query = request.query

	# Get embedding for the query
	xq = co.embed(
        texts=[query],
        model="embed-v4.0",
        input_type="search_query",
        output_dimension=1024,
        embedding_types=["float"],
    ).embeddings.float

	# Query the Pinecone database, returning the top 20 most similar results
	res = index.query(vector=xq, top_k=20, include_metadata=True)

	# Rerank the retrieved results
	docs = [match["metadata"]["overview"] for match in res["matches"]]
	rerank_response = co.rerank(
		model = "rerank-english-v3.0",
		query = query,
		documents = docs,
		top_n = 5,
	)

	recommendations = []  # initialize recommendations list
	# Add the reranked results to the recommendations list
	for rerank_result in rerank_response.results:
		result_index = rerank_result.index
		# Get the match at this index
		match = res["matches"][result_index]
		metadata = match["metadata"]
		recommendations.append({
			"title": metadata.get("series_title"),
			"description": metadata.get("overview"),
			"rating": metadata.get("rating"),
			"release_year": int(metadata.get("release_year")),
		})

	return {
        "recommendations": recommendations
    }
