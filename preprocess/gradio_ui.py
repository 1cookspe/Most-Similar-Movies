
import gradio as gr
import cohere
from dotenv import load_dotenv
import os

from pinecone import Pinecone

load_dotenv()

co = cohere.ClientV2(os.getenv("COHERE_KEY"))
model = "embed-v4.0"
input_type = "search_query"

# initialize connection to pinecone (get API key at app.pinecone.io)
pc = Pinecone(api_key=os.getenv("PINECONE_KEY"))
index_name = 'tmdb-movie-overviews'
# connect to index
index = pc.Index(index_name)


def search_movies(query):
	# Replace with your real search; return a list of result strings.
	if not query:
		return "No query provided."

	# create the query embedding
	xq = co.embed(
        texts=[query],
        model=model,
        input_type='search_query',
        output_dimension=1024,
        embedding_types=["float"],
    ).embeddings.float

	# query, returning the top 5 most similar results
	res = index.query(vector=xq, top_k=5, include_metadata=True)
	print(res)

	results_to_display = ""
	for match in res['matches']:
		metadata = match['metadata']
		results_to_display += f"{metadata['series_title']}: {metadata['overview']}\n"
	return results_to_display


with gr.Blocks() as demo:
	gr.Markdown("# Movie Search Similarity App")

	query_input = gr.Textbox(label="Enter your movie search query", placeholder="Type and press Enter or click Search")
	search_button = gr.Button("Search")

	# Use a non-interactive multiline Textbox to show results under the input.
	results_output = gr.Textbox(label="Search Results", interactive=False, lines=6)

	# Wire both button click and pressing Enter (submit) to the same function
	search_button.click(fn=search_movies, inputs=query_input, outputs=results_output)
	query_input.submit(fn=search_movies, inputs=query_input, outputs=results_output)


demo.launch()
