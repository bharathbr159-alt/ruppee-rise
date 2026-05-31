
function loadChart() {

  const ctx =
    document.getElementById("compareChart");

  if (!ctx) return;

  new Chart(ctx, {

    type: "bar",

    data: {

      labels: schemes.map(s => s.name),

      datasets: [

        {
          label: "Returns %",
          data: schemes.map(s => s.return)
        }

      ]
    }

  });

}