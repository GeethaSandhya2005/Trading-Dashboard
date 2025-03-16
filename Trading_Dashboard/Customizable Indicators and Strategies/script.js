// Wait until the page loads
document.addEventListener("DOMContentLoaded", () => {
    const chartCanvas = document.getElementById("stockChart");
    const ctx = chartCanvas.getContext("2d");
    let stockChart;
    let stockData = generateRandomStockData();
    
    // Initialize Chart
    function initializeChart() {
        stockChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: stockData.dates,
                datasets: [
                    {
                        label: "Stock Price",
                        data: stockData.prices,
                        borderColor: "blue",
                        fill: false,
                    },
                ],
            },
        });
    }

    // Generate Random Stock Data
    function generateRandomStockData() {
        let dates = [];
        let prices = [];
        let price = 100; // Starting price

        for (let i = 0; i < 50; i++) {
            dates.push(`Day ${i + 1}`);
            price += Math.random() * 10 - 5; // Random movement
            prices.push(price);
        }
        return { dates, prices };
    }

    // Update Chart with Indicator
    function addIndicator(indicator) {
        let indicatorData = [];

        if (indicator === "sma") {
            indicatorData = calculateSMA(stockData.prices, 5);
        } else if (indicator === "ema") {
            indicatorData = calculateEMA(stockData.prices, 5);
        } else if (indicator === "bollinger") {
            indicatorData = calculateBollingerBands(stockData.prices, 5);
        }

        stockChart.data.datasets.push({
            label: indicator.toUpperCase(),
            data: indicatorData,
            borderColor: "red",
            fill: false,
        });

        stockChart.update();
    }

    // Calculate Simple Moving Average (SMA)
    function calculateSMA(prices, period) {
        let sma = [];
        for (let i = 0; i < prices.length; i++) {
            if (i < period) {
                sma.push(null);
            } else {
                let sum = 0;
                for (let j = i - period; j < i; j++) {
                    sum += prices[j];
                }
                sma.push(sum / period);
            }
        }
        return sma;
    }

    // Calculate Exponential Moving Average (EMA)
    function calculateEMA(prices, period) {
        let ema = [];
        let multiplier = 2 / (period + 1);
        ema[0] = prices[0]; // First EMA value is the first price

        for (let i = 1; i < prices.length; i++) {
            ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1]);
        }
        return ema;
    }

    // Calculate Bollinger Bands (Using only the middle line for now)
    function calculateBollingerBands(prices, period) {
        return calculateSMA(prices, period);
    }

    // Remove Indicator
    function removeIndicator() {
        stockChart.data.datasets.pop();
        stockChart.update();
    }

    // Apply Trading Strategy
    function applyStrategy() {
        let logOutput = document.getElementById("outputLog");
        logOutput.innerHTML = ""; // Clear previous log

        for (let i = 1; i < stockData.prices.length; i++) {
            if (stockData.prices[i] > calculateSMA(stockData.prices, 50)[i]) {
                let li = document.createElement("li");
                li.textContent = `Day ${i + 1}: Buy (Price: ${stockData.prices[i].toFixed(2)})`;
                logOutput.appendChild(li);
            }
        }
    }

    // Event Listeners
    document.getElementById("applyIndicator").addEventListener("click", () => {
        let selectedIndicator = document.getElementById("indicator").value;
        addIndicator(selectedIndicator);
    });

    document.getElementById("removeIndicator").addEventListener("click", removeIndicator);

    document.getElementById("applyStrategy").addEventListener("click", applyStrategy);

    // Initialize the Chart on Load
    initializeChart();
});