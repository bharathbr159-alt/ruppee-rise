let allocationChart;
document.getElementById("recommendForm").addEventListener("submit", function(e){

    e.preventDefault();

    const salary = Number(document.getElementById("salary").value);

    const savings = Number(document.getElementById("savings").value);

    const risk = document.getElementById("risk").value;

    const years = Number(document.getElementById("years").value);

    const food = Number(document.getElementById("food").value);

    const petrol = Number(document.getElementById("petrol").value);

    const health = Number(document.getElementById("health").value);

    let recommendation = "";

    let score = 0;

    // Savings Score

    const savingRatio = (savings / salary) * 100;

    if(savingRatio >= 40){

        score += 40;

    }

    else if(savingRatio >= 20){

        score += 25;

    }

    else{

        score += 10;

    }

    // Expense Control

    const totalExpense = food + petrol + health;

    if(totalExpense < salary * 0.5){

        score += 30;

    }

    else{

        score += 15;

    }

    // Risk Analysis

    if(risk === "low"){

        recommendation = "FD, PPF, NPS";

        score += 10;

    }

    else if(risk === "medium"){

        recommendation = "SIP, Gold, Mutual Funds";

        score += 20;

    }

    else{

        recommendation = "Stocks, Equity Mutual Funds";

        score += 30;

    }

    // Long Term Bonus

    if(years >= 10){

        score += 20;

    }

    // Financial Health

    let healthStatus = "";

    if(score >= 80){

        healthStatus = "Excellent Financial Health";

    }

    else if(score >= 60){

        healthStatus = "Good Financial Health";

    }

    else if(score >= 40){

        healthStatus = "Average Financial Health";

    }

    else{

        healthStatus = "Poor Financial Health";

    }

       // SMART CALCULATIONS

    const emergencyFund = totalExpense * 6;

    const suggestedSIP = Math.round(salary * 0.2);

    let bondAllocation = 0;

    let goldAllocation = 0;

    let equityAllocation = 0;

    if(risk === "low"){

        bondAllocation = 50;

        goldAllocation = 30;

        equityAllocation = 20;

    }

    else if(risk === "medium"){

        bondAllocation = 30;

        goldAllocation = 20;

        equityAllocation = 50;

    }

    else{

        bondAllocation = 10;

        goldAllocation = 10;

        equityAllocation = 80;

    }

    document.getElementById("result").innerHTML = `

        <h2>Your Savings Score: ${score}/100</h2>

        <h3>${healthStatus}</h3>

        <p>Recommended Investments:</p>

        <strong>${recommendation}</strong>

    `;

    // UPDATE ANALYSIS CARDS

    document.getElementById("emergencyFund").innerText =
        `₹${emergencyFund.toLocaleString()}`;

    document.getElementById("sipPlan").innerText =
        `₹${suggestedSIP.toLocaleString()}/month`;

    document.getElementById("bondPlan").innerText =
        `${bondAllocation}%`;

    document.getElementById("goldPlan").innerText =
        `${goldAllocation}%`;
            // PORTFOLIO CHART

    const ctx = document.getElementById('allocationChart');

    if(allocationChart){

        allocationChart.destroy();

    }

    allocationChart = new Chart(ctx, {

        type: 'doughnut',

        data: {

            labels: ['Bonds', 'Gold', 'Equity'],

            datasets: [{

                data: [
                    bondAllocation,
                    goldAllocation,
                    equityAllocation
                ],

                backgroundColor: [
                    '#2dce7a',
                    '#f5a623',
                    '#4f8cff'
                ],

                borderWidth: 0

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    labels: {

                        color: '#d7e2d7',

                        font: {

                            size: 14

                        }

                    }

                }

            }

        }

    });

});