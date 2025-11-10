# Pre-processing the IMDb dataset
This repository is responsible for converting the movie overviews (or summaries) into their embeddings and saving them into a database.

## Setup Environment
1. Create a virtual environment from the `environment.yml` file.
I used [MiniConda](https://www.anaconda.com/docs/getting-started/miniconda/main) with Python 3.11, like so:
```shell
conda env create -f environment.yml
```

2. Create an `.env` file where you can store information specific to your environment, including the Cohere and Pinecone API keys.
Please ensure that you include the following keys:
- `COHERE_API_KEY`: The API key associated with your Cohere account.
- `PINECONE_API_KEY`: The API key associated with your Pinecone account.
- `PINECONE_INDEX_NAME`: The name of the index where you will store the embeddings of the dataset. If it does not already exist, it will be created.

## Run the Code
The code can be found in a Jupyter notebook called `preprocess.ipynb`.
