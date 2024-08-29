document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartBtn = document.querySelector('.restart-btn');
    const congratulations = document.getElementById('congratulations');
    const congratsMessage = congratulations.querySelector('h1');

    let savedState = JSON.parse(localStorage.getItem('gameState')) || Array(9).fill(null);
    let currentPlayer = 'x';

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (savedState[a] && savedState[a] === savedState[b] && savedState[a] === savedState[c]) {
                return savedState[a];
            }
        }

        // Check for draw
        if (!savedState.includes(null)) {
            return 'draw';
        }

        return null;
    }

    function handleMove(cell, player, index) {
        savedState[index] = player;
        cell.classList.remove('x', 'o');
        cell.classList.add(player);
        localStorage.setItem('gameState', JSON.stringify(savedState));

        const winner = checkWinner();
        if (winner) {
            setTimeout(() => {
                congratulations.classList.remove('hidden');
                if (winner === 'x') {
                    congratulations.classList.add('x');
                    congratsMessage.textContent = "Player X won! 🎉";
                } else if (winner === 'o') {
                    congratulations.classList.add('o');
                    congratsMessage.textContent = "Player O won! 🎉";
                } else {
                    congratulations.classList.add('draw');
                    congratsMessage.textContent = "It's a Draw!";
                }
            }, 200);
        }
    }

    function loadState() {
        cells.forEach((cell, index) => {
            if (savedState[index]) {
                cell.classList.add(savedState[index]);
            }
            cell.querySelector('.btn-x').addEventListener('click', () => handleMove(cell, 'x', index));
            cell.querySelector('.btn-o').addEventListener('click', () => handleMove(cell, 'o', index));
        });
    }

    loadState();

    restartBtn.addEventListener('click', () => {
        savedState = Array(9).fill(null);
        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
        });
        localStorage.removeItem('gameState');
        congratulations.classList.add('hidden');
        congratulations.classList.remove('x', 'o', 'draw');
    });
});
