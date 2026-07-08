# FinSight: AI-Powered Financial Risk Dashboard

FinSight is a full-stack financial risk analysis dashboard that helps users understand stock risk using historical market data. The system retrieves real stock price data, calculates financial risk metrics, classifies the stock risk level, and displays the results through a clean dashboard interface.

## Project Overview

Many beginner investors and students find it difficult to understand stock risk because financial data is often presented in a complex way. FinSight aims to simplify this by converting stock market data into visual charts, risk indicators, and beginner-friendly explanations.

This project was developed as a personal portfolio project to combine computer science, finance knowledge, data analysis, and web development.

## Features

- Search stock ticker such as AAPL, TSLA, MSFT, NVDA, or KO
- Retrieve historical stock market data
- Calculate average daily return
- Calculate daily volatility
- Calculate annualized volatility
- Classify stock risk level as Low Risk, Medium Risk, or High Risk
- Display stock price trend chart
- Display daily return trend chart
- Show recent historical stock data
- Generate simple risk explanation

## Tech Stack

### Frontend
- React
- Vite
- Recharts
- CSS

### Backend
- Python
- FastAPI
- Pandas
- NumPy
- yfinance

## System Architecture

```text
User
 ↓
React Frontend
 ↓
FastAPI Backend
 ↓
Risk Analysis Module
 ↓
Yahoo Finance Data
 ↓
Dashboard Result