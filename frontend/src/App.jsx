import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import SearchSection from "./components/SearchSection";
import HistorySection from "./components/HistorySection";
import ComparisonSection from "./components/ComparisonSection";
import RiskProfileSection from "./components/RiskProfileSection";
import StockDashboard from "./components/StockDashboard";
import EmptyState from "./components/EmptyState";
import "./App.css";

function App() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("1y");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchHistory, setSearchHistory] = useState([]);

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

  const analyzeStock = async () => {
    if (!ticker.trim()) {
      setError("Please enter a stock ticker.");
      return;
    }

    setLoading(true);
    setError("");
    setStockData(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/analyze/${ticker.toUpperCase()}?period=${period}`
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
      `http://127.0.0.1:8000/analyze/${historyItem.ticker}?period=${historyItem.period}`
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
    alert("Please analyse a stock before generating the report.");
    return;
  }

  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(20);
  doc.text("FinSight Stock Risk Report", pageWidth / 2, y, {
    align: "center",
  });

  y += 12;

  doc.setFontSize(10);
  doc.text("For educational purposes only. Not financial advice.", pageWidth / 2, y, {
    align: "center",
  });

  y += 18;

  doc.setFontSize(14);
  doc.text("Stock Information", 20, y);

  y += 10;

  doc.setFontSize(11);
  doc.text(`Ticker: ${stockData.ticker}`, 20, y);
  y += 8;
  doc.text(`Company Name: ${stockData.company_name}`, 20, y);
  y += 8;
  doc.text(`Analysis Period: ${stockData.period}`, 20, y);
  y += 8;
  doc.text(`Latest Price: $${stockData.latest_price}`, 20, y);
  y += 8;
  doc.text(`Highest Price: $${stockData.highest_price}`, 20, y);
  y += 8;
  doc.text(`Lowest Price: $${stockData.lowest_price}`, 20, y);

  y += 15;

  doc.setFontSize(14);
  doc.text("Risk Metrics", 20, y);

  y += 10;

  doc.setFontSize(11);
  doc.text(
    `Average Daily Return: ${(stockData.average_daily_return * 100).toFixed(2)}%`,
    20,
    y
  );
  y += 8;
  doc.text(
    `Daily Volatility: ${(stockData.volatility * 100).toFixed(2)}%`,
    20,
    y
  );
  y += 8;
  doc.text(
    `Annualized Volatility: ${(stockData.annualized_volatility * 100).toFixed(2)}%`,
    20,
    y
  );
  y += 8;
  doc.text(`Stock Risk Level: ${stockData.risk_level}`, 20, y);

  y += 15;

  if (userRiskProfile) {
    doc.setFontSize(14);
    doc.text("User Risk Profile", 20, y);

    y += 10;

    doc.setFontSize(11);
    doc.text(`User Profile: ${userRiskProfile.profile}`, 20, y);
    y += 8;
    doc.text(`Risk Profile Score: ${userRiskProfile.score} / 35`, 20, y);

    y += 10;

    const profileLines = doc.splitTextToSize(
      userRiskProfile.description,
      170
    );

    doc.text(profileLines, 20, y);
    y += profileLines.length * 7 + 8;
  }

  if (suitabilityResult) {
    doc.setFontSize(14);
    doc.text("Suitability Analysis", 20, y);

    y += 10;

    doc.setFontSize(11);
    doc.text(`Suitability Result: ${suitabilityResult.suitability}`, 20, y);

    y += 10;

    const suitabilityLines = doc.splitTextToSize(
      suitabilityResult.explanation,
      170
    );

    doc.text(suitabilityLines, 20, y);
    y += suitabilityLines.length * 7 + 8;
  }

  doc.setFontSize(14);
  doc.text("Risk Summary", 20, y);

  y += 10;

  doc.setFontSize(11);
  const summaryLines = doc.splitTextToSize(stockData.summary, 170);
  doc.text(summaryLines, 20, y);

  y += summaryLines.length * 7 + 15;

  doc.setFontSize(9);
  const disclaimer =
    "Disclaimer: This report is generated for educational and portfolio purposes only. It does not provide financial advice, investment recommendation, trading instruction, or professional financial planning service.";

  const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
  doc.text(disclaimerLines, 20, y);

  doc.save(`${stockData.ticker}_FinSight_Risk_Report.pdf`);
};

const compareStocks = async () => {
  if (!compareTickerOne.trim() || !compareTickerTwo.trim()) {
    setComparisonError("Please enter two stock tickers to compare.");
    return;
  }

  if (compareTickerOne.toUpperCase() === compareTickerTwo.toUpperCase()) {
    setComparisonError("Please enter two different stock tickers.");
    return;
  }

  setComparisonLoading(true);
  setComparisonError("");
  setComparisonData(null);

  try {
    const responseOne = await fetch(
      `http://127.0.0.1:8000/analyze/${compareTickerOne.toUpperCase()}?period=${period}`
    );

    const responseTwo = await fetch(
      `http://127.0.0.1:8000/analyze/${compareTickerTwo.toUpperCase()}?period=${period}`
    );

    if (!responseOne.ok || !responseTwo.ok) {
      throw new Error("One or both stock tickers could not be found.");
    }

    const dataOne = await responseOne.json();
    const dataTwo = await responseTwo.json();

    let comparisonSummary = "";

    if (dataOne.annualized_volatility > dataTwo.annualized_volatility) {
      comparisonSummary = `${dataOne.ticker} has higher annualized volatility than ${dataTwo.ticker}, which means it had larger price movement during the selected period.`;
    } else if (dataOne.annualized_volatility < dataTwo.annualized_volatility) {
      comparisonSummary = `${dataTwo.ticker} has higher annualized volatility than ${dataOne.ticker}, which means it had larger price movement during the selected period.`;
    } else {
      comparisonSummary = `${dataOne.ticker} and ${dataTwo.ticker} have similar annualized volatility during the selected period.`;
    }

    setComparisonData({
      stockOne: dataOne,
      stockTwo: dataTwo,
      summary: comparisonSummary,
    });
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