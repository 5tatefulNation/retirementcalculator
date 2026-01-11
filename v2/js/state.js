// Global app state
window.appState = (function () {
    // Initial state
    const state = {
        hasPaid: localStorage.getItem('has_paid') === 'true'
    };

    // Persist to localStorage
    function setPaid(value) {
        state.hasPaid = value;
        localStorage.setItem('has_paid', value ? 'true' : 'false');
    }

    // Listen for Stripe success redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        setPaid(true);
        alert('Payment successful! Portfolio Mode unlocked.');
    }

    // Expose API
    return {
        get hasPaid() {
            return state.hasPaid;
        },
        unlockPaid() {
            setPaid(true);
        }
    };
})();
