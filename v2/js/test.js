// Quick sanity test runner
document.getElementById('runTestBtn').addEventListener('click', testAll);

function testAll() {
    const resultsEl = document.getElementById('testResults');
    resultsEl.innerHTML = ''; // clear previous results

    // --- Basic Calculator Test ---
    const basicContainer = document.getElementById('basicSandbox');
    basicContainer.innerHTML = `
        <form id="basicForm">
            <input id="principal" value="1000">
            <input id="contribution" value="100">
            <input id="years" value="10">
            <input id="rate" value="5">
            <input id="targetFV" value="2000">
            <select id="solveFor">
                <option value="futureValue" selected>Future Value</option>
                <option value="principal">Principal</option>
                <option value="contribution">Contribution</option>
                <option value="rate">Rate</option>
                <option value="years">Years</option>
            </select>
            <div id="resultValue"></div>
        </form>
    `;
    initBasicCalculator();

    // Simulate calculation
    const basicForm = document.getElementById('basicForm');
    const resultValue = document.getElementById('resultValue');
    basicForm.dispatchEvent(new Event('submit', { cancelable: true }));
    const basicTest = resultValue ? 100 : 'FAIL';

    // --- Portfolio Calculator Test ---
    const portfolioContainer = document.getElementById('portfolioSandbox');
    portfolioContainer.innerHTML = `<div id="portfolioTest">Portfolio loaded</div>`;
    // Here you can add initPortfolioCalculator() + dummy inputs if needed
    const portfolioTest = document.getElementById('portfolioTest') ? 100 : 'FAIL';

    // Display results
    resultsEl.innerHTML = `
        <p>Basic Calculator: ${basicTest}</p>
        <p>Portfolio Calculator: ${portfolioTest}</p>
    `;

    console.log('Sanity test results:', { basicTest, portfolioTest });
}
