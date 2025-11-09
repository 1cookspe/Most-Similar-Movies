# Movie Recommendations using Semantic Search - Backend

This repository contains the FastAPI backend for the `Most Similar Movies` app.
In `main.py`, the backend contains an endpoint called `/api/recommendations` that takes in the search query as a string.
This function converts the search query to its embedding using the [Cohere Embed API](https://docs.cohere.com/reference/embed).
The 20 closest embeddings stored in a Pinecone database are returned; these are the embeddings for the summaries of the 1000 highest rated movies on IMDb.
The [Cohere Rerank API](https://docs.cohere.com/reference/rerank) is then used to rerank the results down to the 5 most relevant movies, which are then returned to the frontend.

Please feel free to check out the frontend code [here](https://github.com/1cookspe/Movie-Recommendations).


## Running the Backend Locally
1. Clone the repository:
```shell
git clone https://github.com/1cookspe/Movie-Recommendations-Backend.git
```

2. Create a virtual environment. I used [MiniConda](https://www.anaconda.com/docs/getting-started/miniconda/main) with Python 3.11, like so:
```shell
conda create -n semantic_search python=3.11
```

3. Once you have activated your environment, install the required packages.
```shell
pip install requirements.txt
```

4. Create an `.env` file where you can store information specific to your environment, including the Cohere and Pinecone API keys.
Please ensure that you include the following keys:
- `COHERE_API_KEY`: The API key associated with your Cohere account.
- `PINECONE_API_KEY`: The API key associated with your Pinecone account.
- `PINECONE_INDEX_NAME`: The name of the index where you have stored the embeddings of the dataset.
- `NUM_DIMENSIONS`: The number of values in the vector embedding; I use `1024` in my application.

5. Now that your environment has been set up, you can run the server like so:

```shell
uvicorn main:app --reload
```
Now, your server should be running on [http://localhost:8000](http://localhost:8000).
