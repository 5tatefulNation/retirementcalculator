/**
 * @jest-environment jsdom
 */

import { initPortfolioCalculator } from '../js/portfolio-calculator';

describe('Portfolio Calculator', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="calculator">
                <div class="global-inputs">
                    <h3>Portfolio Settings</h3>
                    <div class="global-grid">
                        <div class="form-group">
                            <label for="portfolioRate">Annual Rate (%)</label>
                            <input type="number" id="portfolioRate" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="portfolioYears">Years</label>
                            <input type="number" id="portfolioYears" step="1">
                        </div>
                    </div>
                </div>
                <form id="portfolioForm">
                    <div id="accountsContainer"></div>
                    <button type="button" class="add-account" id="addAccountBtn">Add Account</button>
                    <div class="portfolio-total" id="portfolioTotal">
                        <div class="portfolio-total-label">Portfolio Total</div>
                        <div class="portfolio-total-value" id="portfolioTotalValue">—</div>
                    </div>
                    <div class="action-buttons">
                        <button type="submit" class="calculate-btn">Calculate</button>
                        <button type="button" class="reset-portfolio" id="resetPortfolioBtn">Reset Portfolio</button>
                    </div>
                </form>
            </div>
        `;
        initPortfolioCalculator();
        container = document.getElementById('accountsContainer');
    });

    test('should add a new account when "Add Account" is clicked', () => {
        const addAccountBtn = document.getElementById('addAccountBtn');
        addAccountBtn.click();
        const accounts = container.querySelectorAll('.account-section');
        expect(accounts.length).toBe(3); // 2 initial accounts + 1 new
    });

    test('should calculate the portfolio value correctly', () => {
        const portfolioRate = document.getElementById('portfolioRate');
        const portfolioYears = document.getElementById('portfolioYears');
        const calculateBtn = document.querySelector('.calculate-btn');
        const portfolioTotalValue = document.getElementById('portfolioTotalValue');

        // Set global values
        portfolioRate.value = '5';
        portfolioYears.value = '10';

        // Set account values
        const accounts = container.querySelectorAll('.account-section');
        const account1Principal = accounts[0].querySelector('.account-principal');
        const account1Contribution = accounts[0].querySelector('.account-contribution');
        const account2Principal = accounts[1].querySelector('.account-principal');
        const account2Contribution = accounts[1].querySelector('.account-contribution');

        account1Principal.value = '1000';
        account1Contribution.value = '100';
        account2Principal.value = '2000';
        account2Contribution.value = '200';

        // Trigger calculation
        calculateBtn.click();

        // Assert total value
        expect(portfolioTotalValue.textContent).toBe('$8,660.05');
    });
});
