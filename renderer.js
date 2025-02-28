document.addEventListener('DOMContentLoaded', function () {
    // Function to highlight empty fields in red
    function highlightEmptyFields() {
        const fields = ["rawData", "winningNumber", "numWinners"];
        let valid = true;

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field.value.trim() === "") {
                field.classList.add("error-border");
                valid = false;
            } else {
                field.classList.remove("error-border");
            }
        });

        return valid;
    }

    // Function to process raw data
    function processData(rawData, winningNumber, numWinners) {
        let entries = rawData.split("\n");
        let validEntries = {};

        entries.forEach(entry => {
            const regex = /^([\w'\u2019\s\-]+)\s*([\w]*)\s*(\d+[.,:]?\d*|\d+)/; // Capture usernames with hyphens and numbers with dot, colon, or comma
            const match = entry.trim().match(regex);

            if (match) {
                const name = match[1].replace(/[\d]/g, '') + (match[2] ? " " + match[2].replace(/[\d]/g, '') : ""); // Username is only letters, excluding numbers
                const number = match[3].replace(/[:,]/g, '.'); // Extract number and convert colon and comma to dot for parsing

                // Only keep the latest guess for each person
                validEntries[name.trim()] = number;
            }
        });

        return validEntries;
    }

    // Function to determine winners
    function determineWinners(validEntries, winningNumber, numWinners) {
        if (Object.keys(validEntries).length === 0) {
            return "No valid entries found.";
        }

        let sortedEntries = Object.entries(validEntries).sort((a, b) => Math.abs(parseFloat(a[1]) - winningNumber) - Math.abs(parseFloat(b[1]) - winningNumber));
        let winners = [], tempWinners = [], lastDistance = Math.abs(parseFloat(sortedEntries[0][1]) - winningNumber);

        sortedEntries.forEach(entry => {
            const distance = Math.abs(parseFloat(entry[1]) - winningNumber);
            if (distance === lastDistance) {
                tempWinners.push(entry);
            } else {
                winners = winners.concat(tempWinners);
                tempWinners = [entry];
                lastDistance = distance;
            }
        });

        winners = winners.concat(tempWinners);

        if (winners.length > numWinners) {
            winners = winners.slice(0, numWinners);
        }

        const lastWinnerDistance = Math.abs(parseFloat(winners[winners.length - 1][1]) - winningNumber);
        sortedEntries.forEach(entry => {
            const distance = Math.abs(parseFloat(entry[1]) - winningNumber);
            if (distance === lastWinnerDistance && !winners.includes(entry)) {
                winners.push(entry);
            }
        });

        return winners.map(winner => `:W: ${winner[0]} :W: ${winner[1]}`).join("\n");
    }

    // Event listener for "Winners" button
    document.getElementById("winners").addEventListener("click", function () {
        if (!highlightEmptyFields()) {
            return; // Don't proceed if fields are invalid
        }

        let rawData = document.getElementById("rawData").value.trim();
        let winningNumber = parseFloat(document.getElementById("winningNumber").value.trim().replace(/[:,]/g, '.'));
        let numWinners = parseInt(document.getElementById("numWinners").value.trim(), 10);

        let validEntries = processData(rawData, winningNumber, numWinners);
        let formattedOutput = determineWinners(validEntries, winningNumber, numWinners);

        document.getElementById("winnersBox").value = formattedOutput;
    });

    // Event listener for "Clear" button
    document.getElementById("clear").addEventListener("click", function () {
        ["rawData", "winningNumber", "numWinners", "winnersBox"].forEach(fieldId => {
            document.getElementById(fieldId).value = "";
            document.getElementById(fieldId).classList.remove("error-border");
        });
    });
});
