# Pre-processing the IMDb dataset
This repository is responsible for converting the movie overviews (or summaries) into their embeddings and saving them into a database.

## Setup Environment
1. Create a virtual environment. I used [MiniConda](https://www.anaconda.com/docs/getting-started/miniconda/main) with Python 3.11, like so:
```shell
conda create -n semantic_search python=3.11
```

2. Once you have activated your environment, install the required packages.
```shell
pip install requirements.txt
```

3. Create an `.env` file where you can store information specific to your environment, including the Cohere and Pinecone API keys.
Please ensure that you include the following keys:
- `COHERE_API_KEY`: The API key associated with your Cohere account.
- `PINECONE_API_KEY`: The API key associated with your Pinecone account.
- `PINECONE_INDEX_NAME`: The name of the index where you have stored the embeddings of the dataset.
- `NUM_DIMENSIONS`: The number of values in the vector embedding; I use `1024` in my application.

## Run the Code
The code can be found in a Jupyter notebook called `preprocess.ipynb`.
