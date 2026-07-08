# FinSight: AI-Powered Financial Risk Dashboard

FinSight is a full-stack financial risk analysis dashboard that helps users understand stock risk using historical market data. The system retrieves real stock price data, calculates financial risk metrics, classifies the stock risk level, and displays the results through a clean dashboard interface.

FinSight also includes a simplified user risk profile questionnaire that identifies whether a user has a Conservative, Moderate, or Aggressive investment risk profile. This allows the project to combine stock risk analysis with basic user risk tolerance analysis.

## Project Overview

Many beginner investors and students find it difficult to understand stock risk because financial data is often presented in a complex way. They may see stock prices, charts, and financial numbers, but may not know how to interpret return, volatility, or risk level.

FinSight aims to simplify this problem by converting historical stock market data into visual charts, financial risk indicators, and beginner-friendly explanations.

This project was developed as a personal portfolio project to combine computer science, finance knowledge, data analysis, and full-stack web development.

## Features

- Search stock ticker such as AAPL, TSLA, MSFT, NVDA, or KO
- Retrieve historical stock market data
- Select analysis period: 6 months, 1 year, 3 years, or 5 years
- Display company name and latest stock price
- Calculate average daily return
- Calculate daily volatility
- Calculate annualized volatility
- Classify stock risk level as Low Risk, Medium Risk, or High Risk
- Display stock price trend chart
- Display daily return trend chart
- Show recent historical stock data
- Generate simple risk explanation
- Identify user investment risk profile using a questionnaire
- Classify user risk profile as Conservative, Moderate, or Aggressive
- Display user risk profile score and explanation

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

### Tools

- Git
- GitHub
- VS Code

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