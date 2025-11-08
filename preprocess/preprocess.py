import cohere
import numpy as np
from dotenv import load_dotenv
import os
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

co = cohere.ClientV2(
    api_key=os.getenv("COHERE_KEY")
)

# Load plot summaries to a dictionary so that we can embed them
plot_summaries = {}
with open('./data/plot_summaries.txt', 'r') as file:
    for line in file:
        line = line.strip()
        # Separate string between the \t
        id, summary = line.split('\t')
        plot_summaries[id] = summary # .strip() removes leading/trailing whitespace, including newline characters

# Load movie names to a dictionary
movie_titles = {}
with open('./data/movie.metadata.tsv', 'r') as file:
    for line in file:
      metadata = line.split('\t')
      movie_titles[metadata[0]] = metadata[2]

# Constructing the embed_input object
summary_documents = list(plot_summaries.values())
embed_input = [
    {"content": [{"type": "text", "text": doc}]} for doc in summary_documents
]
embed_input = embed_input[0:20]  # Show the first 20 inputs

# Embed the documents
summary_embeddings = co.embed(
    inputs=embed_input,
    model="embed-v4.0",
    output_dimension=1024,
    input_type="search_document",
    embedding_types=["float"],
).embeddings.float

shape = np.array(summary_embeddings).shape
print(shape)

# initialize connection to pinecone (get API key at app.pinecone.io)
pc = Pinecone(api_key=os.getenv("PINECONE_KEY"))
index_name = 'cohere-pinecone-movie-summaries'
# if the index does not exist, we create it
if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=shape[1],
        metric="cosine",
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        )
    )
# connect to index
index = pc.Index(index_name)

# Upload embeddings to pinecone
# Now you can begin populating the index with your embeddings.
# Pinecone expects you to provide a list of tuples in the format (id, vector, metadata)
for i, sum_emb in enumerate(summary_embeddings):
    movie_id = list(plot_summaries.keys())[i]
    index.upsert(
        vectors=[(
            movie_id,  # ID
            sum_emb,  # The vector needs to be a list, not numpy array
            {"title": movie_titles[movie_id]}  # Metadata - including the movie title
        )]
    )

# let's view the index statistics
print(index.describe_index_stats())

# Add the user query
query = "Fight to the death in a game for teenagers"
query_input = [{"content": [{"type": "text", "text": query}]}]
# Embed the query
query_emb = co.embed(
    inputs=query_input,
    model="embed-v4.0",
    input_type="search_query",
    output_dimension=1024,
    embedding_types=["float"],
).embeddings.float

# Calculate similarity scores
scores = np.dot(query_emb, np.transpose(doc_emb))[0]

movie_titles[list(movies.keys())[1]]

# Sort and filter documents based on scores
top_n = 2
top_doc_idxs = np.argsort(-scores)[:top_n]
top_doc_idxs

# Get the movie names of the most similar movies

if __name__ == "__main__":
    for idx in top_doc_idxs:
        movie_id = list(plot_summaries.keys())[idx]
        print(f"Movie: {movie_titles[movie_id]}, Score: {scores[idx]}")
