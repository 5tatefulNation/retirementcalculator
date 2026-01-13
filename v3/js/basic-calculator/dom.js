// js/basic-calculator/dom.js
export function initDOM({ basicForm, solveFor, inputGroups, resultValue, calculate }) {
    if (!basicForm) return;

    solveFor.addEventListener('change', updateInputStates);
    basicForm.addEventListener('submit', e => {
        e.preventDefault();
        calculate();
    });

    updateInputStates();

    function updateInputStates() {
        const solving = solveFor.value;

        // Show all first
        Object.values(inputGroups).forEach(group => group.classList.remove('hidden'));

        if (solving === 'futureValue') {
            inputGroups.targetFV.classList.add('hidden');
        } else {
            inputGroups[solving].classList.add('hidden');
            inputGroups.targetFV.classList.remove('hidden');
        }

        resultValue.textContent = '—';
    }
}
