async function fetchHistPrices(symbol) {
  const resp = await fetch('dummy-data.json');
  let histPrices = await resp.json();
  return histPrices;
}

function populateGraph(monthsAndYears, avgPrices) {
  const ctx = document.getElementById('stock-performance').getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: monthsAndYears,
      datasets: [
        {
          label: 'Average Stock Prices',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: avgPrices,
          fill: false
        }
      ]
    },

    // Configuration options go here
    options: {}
  });
}

function populateData(histPrices) {
  const monthAndYear = [];
  const avgPrices = [];

  let runningAvgPrice = 0;

  for (let i = 0; i < histPrices.length; i++) {
    const priceMonthYear = histPrices[i].date.substr(0, 7);
    const avgPrice = (histPrices[i].open + histPrices[i].close) / 2;
    let counter = 0;

    if (monthAndYear.includes(priceMonthYear)) {
      if (counter !== 0) {
        runningAvgPrice = avgPrice + runningAvgPrice / counter;
      } else {
        runningAvgPrice = avgPrice;
      }
    } else {
      if (runningAvgPrice === 0) {
        runningAvgPrice = avgPrice;
      } else {
        monthAndYear.push(priceMonthYear);
        avgPrices.push(Math.round(runningAvgPrice * 100) / 100);
        runningAvgPrice = avgPrice;
      }
    }
  }
  populateGraph(monthAndYear, avgPrices);
}

fetchHistPrices('aapl').then(histPrices => {
  populateData(histPrices);
});
