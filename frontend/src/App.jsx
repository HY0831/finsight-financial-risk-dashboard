import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import SearchSection from "./components/SearchSection";
import HistorySection from "./components/HistorySection";
import ComparisonSection from "./components/ComparisonSection";
import RiskProfileSection from "./components/RiskProfileSection";
import StockDashboard from "./components/StockDashboard";
import EmptyState from "./components/EmptyState";
import "./App.css";

const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function App() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("1y");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [stockSuggestions, setStockSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const [searchHistory, setSearchHistory] = useState([]);

  const [compareSuggestionsOne, setCompareSuggestionsOne] = useState([]);
  const [compareSuggestionsTwo, setCompareSuggestionsTwo] = useState([]);
  const [compareSuggestionLoadingOne, setCompareSuggestionLoadingOne] = useState(false);
  const [compareSuggestionLoadingTwo, setCompareSuggestionLoadingTwo] = useState(false);
  const [compareTickerOne, setCompareTickerOne] = useState("");
  const [compareTickerTwo, setCompareTickerTwo] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState("");

  const [riskAnswers, setRiskAnswers] = useState({});
  const [userRiskProfile, setUserRiskProfile] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("finsightSearchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

 const riskQuestions = [
  {
    id: "q1",
    question: "What is your main investment objective?",
    options: [
      { text: "Preserve my money and avoid losses", score: 1 },
      { text: "Earn stable income with low risk", score: 2 },
      { text: "Balance income and growth", score: 3 },
      { text: "Grow my money over time", score: 4 },
      { text: "Maximise long-term growth, even with higher risk", score: 5 },
    ],
  },
  {
    id: "q2",
    question: "How long do you plan to keep your money invested?",
    options: [
      { text: "Less than 1 year", score: 1 },
      { text: "1 to 2 years", score: 2 },
      { text: "3 to 5 years", score: 3 },
      { text: "6 to 10 years", score: 4 },
      { text: "More than 10 years", score: 5 },
    ],
  },
  {
    id: "q3",
    question: "When do you expect to need most of this money?",
    options: [
      { text: "Very soon, within 1 year", score: 1 },
      { text: "Within 1 to 2 years", score: 2 },
      { text: "Within 3 to 5 years", score: 3 },
      { text: "After 6 to 10 years", score: 4 },
      { text: "More than 10 years from now", score: 5 },
    ],
  },
  {
    id: "q4",
    question: "How would you react if your investment value dropped by 20% in a short period?",
    options: [
      { text: "Sell immediately to avoid further loss", score: 1 },
      { text: "Sell part of it and reduce risk", score: 2 },
      { text: "Wait and monitor the situation", score: 3 },
      { text: "Hold because I understand markets can recover", score: 4 },
      { text: "Consider buying more if the investment still looks strong", score: 5 },
    ],
  },
  {
    id: "q5",
    question: "How much short-term price movement can you accept?",
    options: [
      { text: "Very small movement only", score: 1 },
      { text: "Small movement", score: 2 },
      { text: "Moderate movement", score: 3 },
      { text: "Large movement", score: 4 },
      { text: "Very large movement for higher potential return", score: 5 },
    ],
  },
  {
    id: "q6",
    question: "How familiar are you with stocks, ETFs, or investment products?",
    options: [
      { text: "Not familiar at all", score: 1 },
      { text: "Beginner knowledge", score: 2 },
      { text: "Some basic knowledge", score: 3 },
      { text: "Good understanding", score: 4 },
      { text: "Experienced and confident", score: 5 },
    ],
  },
  {
    id: "q7",
    question: "How stable is your current financial situation for investing?",
    options: [
      { text: "Not stable, I may need this money anytime", score: 1 },
      { text: "Slightly stable, but I still need high liquidity", score: 2 },
      { text: "Moderately stable", score: 3 },
      { text: "Stable with some emergency savings", score: 4 },
      { text: "Very stable with enough emergency savings", score: 5 },
    ],
  },
];
  
  const saveSearchHistory = (data) => {
    const newRecord = {
      ticker: data.ticker,
      company_name: data.company_name,
      risk_level: data.risk_level,
      period: data.period,
      latest_price: data.latest_price,
      searched_at: new Date().toLocaleString(),
    };

    const updatedHistory = [
      newRecord,
      ...searchHistory.filter((item) => item.ticker !== data.ticker),
    ].slice(0,5);

    setSearchHistory(updatedHistory);
    localStorage.setItem("finsightSearchHistory", JSON.stringify(updatedHistory));
  };

  const searchStockSuggestions = async(searchText) => {
    if(!searchText.trim() || searchText.trim().length < 2){
      setStockSuggestions([]);
      return;
    }

    setSuggestionLoading(true);

    try{
      const response = await fetch(`${API_BASE_URL}/search-stocks?query=${encodeURIComponent(searchText)}`);
      if(!response.ok){
        setStockSuggestions([]);
        return;
      }

      const data = await response.json();
      setStockSuggestions(data.results || []);
    }catch{
      setStockSuggestions([]);
    }finally{
      setSuggestionLoading(false);
    }
  };

const analyzeStock = async () => {
  if (!ticker.trim()) {
    setError("Please enter a stock ticker or search for a company name.");
    return;
  }

  const selectedTicker = ticker.trim().toUpperCase();

  setLoading(true);
  setError("");
  setStockData(null);

  try {
    const response = await fetch(
      `${API_BASE_URL}/analyze/${selectedTicker}?period=${period}`
    );

    if (!response.ok) {
      throw new Error(
        "Stock not found. Please select a stock from the search suggestions or enter a valid ticker."
      );
    }

    const data = await response.json();
    setStockData(data);
    saveSearchHistory(data);
    setStockSuggestions([]);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const calculateRiskProfile = () => {
  if (Object.keys(riskAnswers).length < riskQuestions.length) {
    alert("Please answer all questions before calculating your risk profile.");
    return;
  }

  const totalScore = Object.values(riskAnswers).reduce(
    (sum, score) => sum + score,
    0
  );

  let profile = "";
  let description = "";

  if (totalScore <= 16) {
    profile = "Conservative";
    description =
      "You prefer stability and capital protection. You may be less comfortable with large price movements or short-term losses.";
  } else if (totalScore <= 26) {
    profile = "Moderate";
    description =
      "You are willing to accept some investment risk for potential growth, but you may still prefer a balanced approach.";
  } else {
    profile = "Aggressive";
    description =
      "You are willing to accept higher risk and larger price movements for the possibility of higher long-term returns.";
  }

  setUserRiskProfile({
    score: totalScore,
    profile,
    description,
  });
};

const analyseFromHistory = async (historyItem) => {
  setTicker(historyItem.ticker);
  setPeriod(historyItem.period);
  setLoading(true);
  setError("");
  setStockData(null);

  try {
    const response = await fetch(
      `${API_BASE_URL}/analyze/${historyItem.ticker}?period=${historyItem.period}`
    );

    if (!response.ok) {
      throw new Error("Stock ticker not found. Please try again.");
    }

    const data = await response.json();
    setStockData(data);
    saveSearchHistory(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const clearSearchHistory = () => {
  setSearchHistory([]);
  localStorage.removeItem("finsightSearchHistory");
};

const getSuitabilityResult = () => {
  if (!stockData || !userRiskProfile) {
    return null;
  }

  const userProfile = userRiskProfile.profile;
  const stockRisk = stockData.risk_level;

  let suitability = "";
  let explanation = "";

  if (userProfile === "Conservative") {
    if (stockRisk === "Low Risk") {
      suitability = "Suitable";
      explanation =
        "This stock generally matches your conservative profile because it has lower price volatility.";
    } else if (stockRisk === "Medium Risk") {
      suitability = "Use Caution";
      explanation =
        "This stock may require caution because it has moderate price movement, while conservative users usually prefer more stable investments.";
    } else {
      suitability = "Not Highly Suitable";
      explanation =
        "This stock may not match your conservative profile because it has high volatility and larger price movements.";
    }
  }

  if (userProfile === "Moderate") {
    if (stockRisk === "Low Risk") {
      suitability = "Suitable";
      explanation =
        "This stock may suit your moderate profile because it has lower volatility and may provide a more stable investment experience.";
    } else if (stockRisk === "Medium Risk") {
      suitability = "Suitable";
      explanation =
        "This stock generally matches your moderate profile because you are willing to accept some level of risk for potential growth.";
    } else {
      suitability = "Use Caution";
      explanation =
        "This stock is high risk, so it may require caution even though you can accept some investment risk.";
    }
  }

  if (userProfile === "Aggressive") {
    if (stockRisk === "Low Risk") {
      suitability = "Suitable but Lower Growth Potential";
      explanation =
        "This stock has lower volatility, so it may be suitable but may not fully match an aggressive user's preference for higher growth opportunities.";
    } else if (stockRisk === "Medium Risk") {
      suitability = "Suitable";
      explanation =
        "This stock may match your aggressive profile because it has some volatility and growth potential.";
    } else {
      suitability = "Suitable with High Risk";
      explanation =
        "This stock may match your aggressive profile, but it still involves high volatility and larger potential losses.";
    }
  }

  return {
    suitability,
    explanation,
  };
};

const generatePDFReport = () => {
  if (!stockData) {
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const dark = [17, 24, 39];
  const grey = [107, 114, 128];
  const lightGrey = [249, 250, 251];
  const border = [229, 231, 235];
  const blue = [37, 99, 235];
  const red = [239, 68, 68];
  const green = [34, 197, 94];

  const formatMoney = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }
    return `$${Number(value).toFixed(2)}`;
  };

  const formatPDFPercent = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }
    return `${(Number(value) * 100).toFixed(2)}%`;
  };

  const formatShortDate = (dateText) => {
    if (!dateText) return "";
    const date = new Date(dateText);
    if (Number.isNaN(date.getTime())) return dateText;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRiskTheme = (riskLevel) => {
    if (riskLevel === "Low Risk") {
      return {
        bg: [220, 252, 231],
        text: [22, 101, 52],
        accent: [34, 197, 94],
      };
    }

    if (riskLevel === "Medium Risk") {
      return {
        bg: [254, 243, 199],
        text: [146, 64, 14],
        accent: [245, 158, 11],
      };
    }

    return {
      bg: [254, 226, 226],
      text: [153, 27, 27],
      accent: [239, 68, 68],
    };
  };

  const riskTheme = getRiskTheme(stockData.risk_level);

  const addPageHeader = (sectionName) => {
    doc.setFillColor(dark[0], dark[1], dark[2]);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("FinSight Financial Risk Report", margin, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(sectionName, pageWidth - margin, 17, { align: "right" });
  };

  const addFooter = () => {
    doc.setDrawColor(border[0], border[1], border[2]);
    doc.line(margin, pageHeight - 17, pageWidth - margin, pageHeight - 17);

    doc.setTextColor(grey[0], grey[1], grey[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(
      "Generated by FinSight | Educational and portfolio purposes only",
      margin,
      pageHeight - 10
    );

    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  };

  const addSectionTitle = (title, y) => {
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, margin, y);

    doc.setDrawColor(border[0], border[1], border[2]);
    doc.line(margin, y + 5, pageWidth - margin, y + 5);
  };

  const addMetricCard = (x, y, w, h, label, value, note, accentColor = null) => {
    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.setDrawColor(border[0], border[1], border[2]);
    doc.roundedRect(x, y, w, h, 3, 3, "FD");

    if (accentColor) {
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.roundedRect(x, y, 2.2, h, 2, 2, "F");
    }

    doc.setTextColor(grey[0], grey[1], grey[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.text(label, x + 5, y + 8);

    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(String(value), x + 5, y + 18);

    if (note) {
      doc.setTextColor(grey[0], grey[1], grey[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.2);
      doc.text(note, x + 5, y + 27, { maxWidth: w - 10 });
    }
  };

  const addInsightBox = (x, y, w, title, text, fillColor = [239, 246, 255]) => {
    const wrappedText = doc.splitTextToSize(text, w - 12);
    const boxHeight = Math.max(26, 16 + wrappedText.length * 4.2);

    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(x, y, w, boxHeight, 3, 3, "FD");

    doc.setTextColor(30, 64, 175);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(title, x + 6, y + 8);

    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(wrappedText, x + 6, y + 16);

    return boxHeight;
  };

  const addCompactInsightBox = (
    x,
    y,
    w,
    title,
    text,
    fillColor = [239, 246, 255]
  ) => {
    const wrappedText = doc.splitTextToSize(text, w - 12);
    const boxHeight = Math.max(24, 15 + wrappedText.length * 4.8);

    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(x, y, w, boxHeight, 3, 3, "FD");

    doc.setTextColor(30, 64, 175);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, x + 6, y + 8);

    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(wrappedText, x + 6, y + 16);

    return boxHeight;
  };

  const addSmallInfoRow = (label, value, x, y) => {
    doc.setTextColor(grey[0], grey[1], grey[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(label, x, y);

    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFont("helvetica", "bold");
    doc.text(value, x + 34, y);
  };

  const drawLineChart = ({
    title,
    data,
    x,
    y,
    w,
    h,
    valueKey,
    lineColor,
    valuePrefix = "",
    valueSuffix = "",
    showZeroLine = false,
  }) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(border[0], border[1], border[2]);
    doc.roundedRect(x, y, w, h, 3, 3, "FD");

    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(title, x + 6, y + 9);

    const values = data
      .map((item) => Number(item[valueKey]))
      .filter((value) => !Number.isNaN(value));

    if (values.length < 2) {
      doc.setTextColor(grey[0], grey[1], grey[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Not enough data to generate chart.", x + 8, y + 32);
      return;
    }

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const plotX = x + 17;
    const plotY = y + 22;
    const plotW = w - 28;
    const plotH = h - 38;

    doc.setDrawColor(border[0], border[1], border[2]);
    doc.setLineWidth(0.2);

    for (let i = 0; i <= 3; i++) {
      const gridY = plotY + (plotH / 3) * i;
      doc.line(plotX, gridY, plotX + plotW, gridY);
    }

    doc.line(plotX, plotY, plotX, plotY + plotH);
    doc.line(plotX, plotY + plotH, plotX + plotW, plotY + plotH);

    if (showZeroLine && minValue < 0 && maxValue > 0) {
      const zeroY = plotY + plotH - ((0 - minValue) / range) * plotH;
      doc.setDrawColor(156, 163, 175);
      doc.line(plotX, zeroY, plotX + plotW, zeroY);
    }

    doc.setTextColor(grey[0], grey[1], grey[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);

    doc.text(
      `${valuePrefix}${maxValue.toFixed(2)}${valueSuffix}`,
      plotX - 2,
      plotY - 2,
      { align: "right" }
    );

    doc.text(
      `${valuePrefix}${minValue.toFixed(2)}${valueSuffix}`,
      plotX - 2,
      plotY + plotH + 2,
      { align: "right" }
    );

    doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
    doc.setLineWidth(0.9);

    for (let i = 0; i < data.length - 1; i++) {
      const currentValue = Number(data[i][valueKey]);
      const nextValue = Number(data[i + 1][valueKey]);

      if (Number.isNaN(currentValue) || Number.isNaN(nextValue)) {
        continue;
      }

      const x1 = plotX + (i / (data.length - 1)) * plotW;
      const y1 = plotY + plotH - ((currentValue - minValue) / range) * plotH;

      const x2 = plotX + ((i + 1) / (data.length - 1)) * plotW;
      const y2 = plotY + plotH - ((nextValue - minValue) / range) * plotH;

      doc.line(x1, y1, x2, y2);
    }

    doc.setLineWidth(0.2);

    const firstDate = formatShortDate(data[0]?.date);
    const lastDate = formatShortDate(data[data.length - 1]?.date);

    doc.setTextColor(grey[0], grey[1], grey[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);

    doc.text(firstDate, plotX, y + h - 7);
    doc.text(lastDate, plotX + plotW, y + h - 7, { align: "right" });
  };

  const priceData = stockData.price_data || [];
  const dailyReturnData = priceData.map((item) => ({
    ...item,
    daily_return_percent: Number(item.daily_return) * 100,
  }));

  const firstPrice = priceData.length > 0 ? Number(priceData[0].close) : null;
  const latestPrice = Number(stockData.latest_price);

  const priceChange =
    firstPrice && latestPrice ? ((latestPrice - firstPrice) / firstPrice) * 100 : null;

  const priceRangePercent =
    ((Number(stockData.highest_price) - Number(stockData.lowest_price)) /
      Number(stockData.lowest_price)) *
    100;

  let mainInsight = "";

  if (stockData.risk_level === "Low Risk") {
    mainInsight = `${stockData.ticker} shows relatively low annualized volatility. This suggests the stock had smaller price movements during the selected period compared with more volatile stocks.`;
  } else if (stockData.risk_level === "Medium Risk") {
    mainInsight = `${stockData.ticker} shows moderate annualized volatility. The stock had noticeable price movement, but the volatility level was not extreme during the selected period.`;
  } else {
    mainInsight = `${stockData.ticker} shows high annualized volatility. This means the stock had larger price movements and may not be suitable for users with low risk tolerance.`;
  }

  const priceMovementInsight =
    priceChange !== null
      ? `${stockData.ticker} changed by approximately ${priceChange.toFixed(
          2
        )}% from the first displayed price point to the latest price. The highest-to-lowest price range was approximately ${priceRangePercent.toFixed(
          2
        )}%.`
      : "Price movement could not be calculated because there is not enough available price data.";

  /* =====================================================
     PAGE 1 - EXECUTIVE SUMMARY
  ===================================================== */

  addPageHeader("Executive Summary");

  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.text(stockData.ticker, margin, 47);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text(stockData.company_name, margin, 57, { maxWidth: 105 });

  doc.setFillColor(riskTheme.bg[0], riskTheme.bg[1], riskTheme.bg[2]);
  doc.roundedRect(pageWidth - 70, 41, 54, 16, 8, 8, "F");

  doc.setTextColor(riskTheme.text[0], riskTheme.text[1], riskTheme.text[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(stockData.risk_level, pageWidth - 43, 51, { align: "center" });

  addSmallInfoRow("Period", stockData.period, margin, 70);
  addSmallInfoRow("Generated", new Date().toLocaleString(), margin, 78);

  addSectionTitle("Key Risk Metrics", 90);

  const cardGap = 7;
  const cardW = (contentWidth - cardGap * 3) / 4;

  addMetricCard(
    margin,
    101,
    cardW,
    31,
    "Latest Price",
    formatMoney(stockData.latest_price),
    "Most recent closing price",
    blue
  );

  addMetricCard(
    margin + (cardW + cardGap),
    101,
    cardW,
    31,
    "Avg. Daily Return",
    formatPDFPercent(stockData.average_daily_return),
    "Average daily return",
    green
  );

  addMetricCard(
    margin + (cardW + cardGap) * 2,
    101,
    cardW,
    31,
    "Daily Volatility",
    formatPDFPercent(stockData.volatility),
    "Daily movement level",
    riskTheme.accent
  );

  addMetricCard(
    margin + (cardW + cardGap) * 3,
    101,
    cardW,
    31,
    "Annualized Volatility",
    formatPDFPercent(stockData.annualized_volatility),
    "Main risk metric",
    riskTheme.accent
  );

  addSectionTitle("Price Overview", 145);

  const overviewW = (contentWidth - 14) / 3;

  addMetricCard(
    margin,
    156,
    overviewW,
    30,
    "Highest Price",
    formatMoney(stockData.highest_price),
    "Highest closing price",
    blue
  );

  addMetricCard(
    margin + overviewW + 7,
    156,
    overviewW,
    30,
    "Lowest Price",
    formatMoney(stockData.lowest_price),
    "Lowest closing price",
    red
  );

  addMetricCard(
    margin + (overviewW + 7) * 2,
    156,
    overviewW,
    30,
    "Price Range",
    `${priceRangePercent.toFixed(2)}%`,
    "High-low movement range",
    riskTheme.accent
  );

  addSectionTitle("Executive Insight", 202);

  const firstInsightHeight = addInsightBox(
    margin,
    212,
    contentWidth,
    "Main Finding",
    mainInsight,
    [239, 246, 255]
  );

  addInsightBox(
    margin,
    212 + firstInsightHeight + 6,
    contentWidth,
    "Price Movement",
    priceMovementInsight,
    [240, 253, 244]
  );

  addFooter();

  /* =====================================================
     PAGE 2 - CHART ANALYSIS
  ===================================================== */

  doc.addPage();
  addPageHeader("Chart Analysis");

  addSectionTitle("Historical Price Trend", 44);

  drawLineChart({
    title: `${stockData.ticker} Closing Price Trend`,
    data: priceData,
    x: margin,
    y: 55,
    w: contentWidth,
    h: 80,
    valueKey: "close",
    lineColor: blue,
    valuePrefix: "$",
  });

  addSectionTitle("Daily Return Movement", 150);

  drawLineChart({
    title: `${stockData.ticker} Daily Return Trend`,
    data: dailyReturnData,
    x: margin,
    y: 161,
    w: contentWidth,
    h: 80,
    valueKey: "daily_return_percent",
    lineColor: red,
    valueSuffix: "%",
    showZeroLine: true,
  });

  addInsightBox(
    margin,
    252,
    contentWidth,
    "Chart Interpretation",
    "The price chart shows the general direction of the stock price. The daily return chart shows short-term price movements. Wider swings in daily returns usually indicate higher volatility and greater short-term uncertainty.",
    [239, 246, 255]
  );

  addFooter();

/* =====================================================
   PAGE 3 - PROFILE, SUITABILITY & METHOD
===================================================== */

doc.addPage();
addPageHeader("Suitability Analysis");

addSectionTitle("User Risk Profile", 44);

if (userRiskProfile) {
  const profileType =
    userRiskProfile.profile ||
    userRiskProfile.riskProfile ||
    userRiskProfile.type ||
    "Risk Profile";

  const profileScore =
    userRiskProfile.score !== undefined ? `${userRiskProfile.score}/35` : "N/A";

  const profileDescription =
    userRiskProfile.description ||
    userRiskProfile.explanation ||
    "This profile is based on the user's questionnaire responses.";

  const profileCardW = (contentWidth - 14) / 3;

  addMetricCard(
    margin,
    55,
    profileCardW,
    28,
    "Profile Type",
    profileType,
    "Questionnaire result",
    blue
  );

  addMetricCard(
    margin + profileCardW + 7,
    55,
    profileCardW,
    28,
    "Profile Score",
    profileScore,
    "Higher score = higher tolerance",
    green
  );

  addMetricCard(
    margin + (profileCardW + 7) * 2,
    55,
    profileCardW,
    28,
    "Stock Risk",
    stockData.risk_level,
    "Based on volatility",
    riskTheme.accent
  );

  const profileBoxHeight = addCompactInsightBox(
    margin,
    92,
    contentWidth,
    "Profile Meaning",
    profileDescription,
    [239, 246, 255]
  );

  addSectionTitle("Suitability Insight", 92 + profileBoxHeight + 18);

  let suitabilityTitle = "Suitability Analysis";
  let suitabilityMessage =
    "The suitability result was calculated based on the user's risk profile and the stock risk level.";

  if (suitabilityResult) {
    if (typeof suitabilityResult === "string") {
      suitabilityTitle = suitabilityResult;
      suitabilityMessage =
        "This suitability result is based on the comparison between the user's risk profile and the stock risk level.";
    } else {
      suitabilityTitle =
        suitabilityResult.title ||
        suitabilityResult.result ||
        "Suitability Analysis";

      suitabilityMessage =
        suitabilityResult.message ||
        suitabilityResult.explanation ||
        suitabilityResult.description ||
        "The suitability result was calculated based on the user's risk profile and the stock risk level.";
    }
  } else {
    suitabilityTitle = "Suitability Not Calculated";
    suitabilityMessage =
      "Suitability analysis requires both stock risk data and a completed user risk profile.";
  }

  const suitabilityY = 92 + profileBoxHeight + 29;

  const suitabilityBoxHeight = addCompactInsightBox(
    margin,
    suitabilityY,
    contentWidth,
    suitabilityTitle,
    suitabilityMessage,
    [240, 253, 244]
  );

  const methodTitleY = suitabilityY + suitabilityBoxHeight + 22;

  addSectionTitle("Risk Classification Method", methodTitleY);

  const methodText =
    "FinSight classifies stock risk based on annualized volatility: below 20% = Low Risk, 20% to 40% = Medium Risk, and above 40% = High Risk.";

  const methodBoxHeight = addCompactInsightBox(
    margin,
    methodTitleY + 11,
    contentWidth,
    "Volatility-Based Classification",
    methodText,
    [249, 250, 251]
  );

  const disclaimerTitleY = methodTitleY + methodBoxHeight + 30;

  addSectionTitle("Disclaimer", disclaimerTitleY);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.text(
    "This report is generated for educational and portfolio purposes only. It does not provide financial advice, investment recommendations, trading instructions, or professional financial planning services. Users should not rely on this report as the only basis for making investment decisions.",
    margin,
    disclaimerTitleY + 13,
    { maxWidth: contentWidth }
  );
} else {
  const noProfileHeight = addCompactInsightBox(
    margin,
    55,
    contentWidth,
    "No User Profile Available",
    "The user risk profile questionnaire was not completed before generating this report. Complete the questionnaire before downloading the report to include personalised suitability analysis.",
    [239, 246, 255]
  );

  addSectionTitle("Suitability Insight", 55 + noProfileHeight + 18);

  const noSuitabilityHeight = addCompactInsightBox(
    margin,
    55 + noProfileHeight + 29,
    contentWidth,
    "Suitability Not Calculated",
    "Suitability analysis requires both stock risk data and a completed user risk profile. Without the questionnaire result, FinSight can only analyse the stock risk level.",
    [239, 246, 255]
  );

  const methodTitleY = 55 + noProfileHeight + 29 + noSuitabilityHeight + 22;

  addSectionTitle("Risk Classification Method", methodTitleY);

  const methodText =
    "FinSight classifies stock risk based on annualized volatility: below 20% = Low Risk, 20% to 40% = Medium Risk, and above 40% = High Risk.";

  const methodBoxHeight = addCompactInsightBox(
    margin,
    methodTitleY + 11,
    contentWidth,
    "Volatility-Based Classification",
    methodText,
    [249, 250, 251]
  );

  const disclaimerTitleY = methodTitleY + methodBoxHeight + 30;

  addSectionTitle("Disclaimer", disclaimerTitleY);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.text(
    "This report is generated for educational and portfolio purposes only. It does not provide financial advice, investment recommendations, trading instructions, or professional financial planning services. Users should not rely on this report as the only basis for making investment decisions.",
    margin,
    disclaimerTitleY + 13,
    { maxWidth: contentWidth }
  );
}

addFooter();

doc.save(`${stockData.ticker}_FinSight_Risk_Report.pdf`);
};

const searchCompareStockSuggestions = async (searchText, inputNumber) => {
  if (!searchText.trim() || searchText.trim().length < 2) {
    if (inputNumber === 1) {
      setCompareSuggestionsOne([]);
    } else {
      setCompareSuggestionsTwo([]);
    }
    return;
  }

  if (inputNumber === 1) {
    setCompareSuggestionLoadingOne(true);
  } else {
    setCompareSuggestionLoadingTwo(true);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/search-stocks?query=${encodeURIComponent(searchText)}`
    );

    if (!response.ok) {
      if (inputNumber === 1) {
        setCompareSuggestionsOne([]);
      } else {
        setCompareSuggestionsTwo([]);
      }
      return;
    }

    const data = await response.json();

    if (inputNumber === 1) {
      setCompareSuggestionsOne(data.results || []);
    } else {
      setCompareSuggestionsTwo(data.results || []);
    }
  } catch {
    if (inputNumber === 1) {
      setCompareSuggestionsOne([]);
    } else {
      setCompareSuggestionsTwo([]);
    }
  } finally {
    if (inputNumber === 1) {
      setCompareSuggestionLoadingOne(false);
    } else {
      setCompareSuggestionLoadingTwo(false);
    }
  }
};

const compareStocks = async () => {
  if (!compareTickerOne.trim() || !compareTickerTwo.trim()) {
    setComparisonError("Please enter two stock tickers or company names.");
    return;
  }

  const selectedTickerOne = compareTickerOne.trim().toUpperCase();
  const selectedTickerTwo = compareTickerTwo.trim().toUpperCase();

  if (selectedTickerOne === selectedTickerTwo) {
    setComparisonError("Please enter two different stocks.");
    return;
  }

  setComparisonLoading(true);
  setComparisonError("");
  setComparisonData(null);

  try {
    const responseOne = await fetch(
      `${API_BASE_URL}/analyze/${selectedTickerOne}?period=${period}`
    );

    const responseTwo = await fetch(
      `${API_BASE_URL}/analyze/${selectedTickerTwo}?period=${period}`
    );

    if (!responseOne.ok || !responseTwo.ok) {
      throw new Error(
        "One or both stocks were not found. Please select stocks from the search suggestions."
      );
    }

    const stockOne = await responseOne.json();
    const stockTwo = await responseTwo.json();

    let summary = "";

    if (stockOne.annualized_volatility > stockTwo.annualized_volatility) {
      summary = `${stockOne.ticker} has higher annualized volatility than ${stockTwo.ticker}, which means it had larger price movement during the selected period.`;
    } else if (stockTwo.annualized_volatility > stockOne.annualized_volatility) {
      summary = `${stockTwo.ticker} has higher annualized volatility than ${stockOne.ticker}, which means it had larger price movement during the selected period.`;
    } else {
      summary = `${stockOne.ticker} and ${stockTwo.ticker} have similar annualized volatility during the selected period.`;
    }

    setComparisonData({
      stockOne,
      stockTwo,
      summary,
    });

    setCompareSuggestionsOne([]);
    setCompareSuggestionsTwo([]);
  } catch (err) {
    setComparisonError(err.message);
  } finally {
    setComparisonLoading(false);
  }
};

const suitabilityResult = getSuitabilityResult();
  return (
    <div className="app">
      <header className="hero">
        <h1>FinSight</h1>
        <p>AI-Powered Financial Risk Dashboard</p>
        <p className="disclaimer">
          For educational purposes only. This dashboard does not provide
          investment advice.
        </p>
      </header>

      <SearchSection
        ticker={ticker}
        setTicker={setTicker}
        period={period}
        setPeriod={setPeriod}
        loading={loading}
        analyzeStock={analyzeStock}
        stockSuggestions={stockSuggestions}
        suggestionLoading={suggestionLoading}
        searchStockSuggestions={searchStockSuggestions}
        setStockSuggestions={setStockSuggestions}
      />

      {loading && <p className="message">Analysing stock data...</p>}
      {error && <p className="error">{error}</p>}

      {!stockData && !loading && <EmptyState />}

      <StockDashboard
        stockData={stockData}
        formatPercent={formatPercent}
        generatePDFReport={generatePDFReport}
        userRiskProfile={userRiskProfile}
        suitabilityResult={suitabilityResult}
      />

      <HistorySection
        searchHistory={searchHistory}
        analyseFromHistory={analyseFromHistory}
        clearSearchHistory={clearSearchHistory}
      />

      <ComparisonSection
        compareTickerOne={compareTickerOne}
        setCompareTickerOne={setCompareTickerOne}
        compareTickerTwo={compareTickerTwo}
        setCompareTickerTwo={setCompareTickerTwo}
        compareStocks={compareStocks}
        comparisonLoading={comparisonLoading}
        comparisonError={comparisonError}
        comparisonData={comparisonData}
        formatPercent={formatPercent}
        compareSuggestionsOne={compareSuggestionsOne}
        compareSuggestionsTwo={compareSuggestionsTwo}
        compareSuggestionLoadingOne={compareSuggestionLoadingOne}
        compareSuggestionLoadingTwo={compareSuggestionLoadingTwo}
        searchCompareStockSuggestions={searchCompareStockSuggestions}
        setCompareSuggestionsOne={setCompareSuggestionsOne}
        setCompareSuggestionsTwo={setCompareSuggestionsTwo}
      />

      <RiskProfileSection
        riskQuestions={riskQuestions}
        riskAnswers={riskAnswers}
        setRiskAnswers={setRiskAnswers}
        calculateRiskProfile={calculateRiskProfile}
        userRiskProfile={userRiskProfile}
      />

      <footer className = "footer">
        <p>
          FinSight is developed for educational and portfolio purposes only. It does
          not provide financial advice or investment recommendations.
        </p>
      </footer>
    </div>
  );
}

export default App;