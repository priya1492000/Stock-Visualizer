# from django.shortcuts import render

# Create your views here.
import requests
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
import io

@csrf_exempt
@require_GET
def stock(request, symbol):
    url = f"https://query1.finance.yahoo.com/v7/finance/download/{symbol}"
    params = {
        "interval": "1d",
        "range": "max",
        "events": "history"
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code != 200:
        return JsonResponse({"error": "Failed to get data from Yahoo Finance"})

    data = pd.read_csv(io.StringIO(response.text))
    data = data.rename(columns={"Adj Close": "Adj_Close"})
    data["Date"] = pd.to_datetime(data["Date"])
    data = data.to_dict(orient="records")
    return JsonResponse(data, safe=False)
