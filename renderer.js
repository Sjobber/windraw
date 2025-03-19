document.addEventListener('DOMContentLoaded', function () {
    // Function to highlight empty fields in red
    function highlightEmptyFields() {
        const rawData = document.getElementById("rawData");
        const winningNumber = document.getElementById("winningNumber");
        const numWinners = document.getElementById("numWinners");
        let valid = true;

        // Check if each field is empty
        if (rawData.value.trim() === "") {
            rawData.style.border = "2px solid red";
            valid = false;
        } else {
            rawData.style.border = "";
        }

        if (winningNumber.value.trim() === "") {
            winningNumber.style.border = "2px solid red";
            valid = false;
        } else {
            winningNumber.style.border = "";
        }

        if (numWinners.value.trim() === "") {
            numWinners.style.border = "2px solid red";
            valid = false;
        } else {
            numWinners.style.border = "";
        }

        return valid;
    }

    // Event listener for "Winners" button
    document.getElementById("winners").addEventListener("click", function () {
        // Highlight empty fields and stop if invalid
        if (!highlightEmptyFields()) {
            return; // Don't proceed if fields are invalid
        }

        // Get inputs
        let rawData = document.getElementById("rawData").value.trim();
        let winningNumber = parseFloat(document.getElementById("winningNumber").value.trim().replace(/,/g, '.'));
        let numWinners = parseInt(document.getElementById("numWinners").value.trim(), 10);

        // Split and process raw data
        let entries = rawData.split("\n");
        let validEntries = {};

        // Process each entry in the raw data
        entries.forEach(entry => {
            const firstSpaceIndex = entry.indexOf(' ');
            if (firstSpaceIndex !== -1) {
                const username = entry.substring(0, firstSpaceIndex + 2); // Take one letter after the first space
                const message = entry.substring(firstSpaceIndex + 2).trim(); // Everything after the username
                const numberMatch = message.match(/\d+([.,]\d+)*/); // Extract the first number found in the message

                if (numberMatch) {
                    const number = parseFloat(numberMatch[0].replace(/,/g, '.')); // Convert to float

                    // Only keep the first guess for each person
                    if (!validEntries.hasOwnProperty(username)) {
                        validEntries[username] = number;
                    }
                }
            }
        });

        // If no valid entries found
        if (Object.keys(validEntries).length === 0) {
            document.getElementById("winnersBox").value = "No valid entries found.";
            return;
        }

        // Sort by closest to winning number and group them
        let winners = [];
        let tempWinners = [];
        let lastDistance = Math.abs(Object.values(validEntries)[0] - winningNumber);

        // Sort entries by distance from the winning number
        let sortedEntries = Object.entries(validEntries).sort((a, b) => Math.abs(a[1] - winningNumber) - Math.abs(b[1] - winningNumber));

        sortedEntries.forEach(entry => {
            const distance = Math.abs(entry[1] - winningNumber);

            // If the current entry is equally close to the winning number, add it to the tempWinners
            if (distance === lastDistance) {
                tempWinners.push(entry);
            } else {
                // If the distance changes, push the previous group to winners
                winners = winners.concat(tempWinners);
                tempWinners = [entry];
                lastDistance = distance;
            }
        });

        // Don't forget to push the last group
        winners = winners.concat(tempWinners);

        // If we have more than the required winners, trim the result to the numWinners
        if (winners.length > numWinners) {
            winners = winners.slice(0, numWinners);
        }

        // If there are still more winners tied with the last one, include them
        const lastWinnerDistance = Math.abs(winners[winners.length - 1][1] - winningNumber);
        sortedEntries.forEach(entry => {
            const distance = Math.abs(entry[1] - winningNumber);
            if (distance === lastWinnerDistance && !winners.includes(entry)) {
                winners.push(entry);
            }
        });

        // Format output
        let formattedOutput = winners.map(winner => {
            return `:W: ${winner[0]} :W: ${winner[1]}`;
        }).join("\n");

        // Show formatted output
        document.getElementById("winnersBox").value = formattedOutput;
    });

    // Event listener for "Clear" button
    document.getElementById("clear").addEventListener("click", function () {
        // Clear all input boxes and output
        document.getElementById("rawData").value = "";
        document.getElementById("winningNumber").value = "";
        document.getElementById("numWinners").value = "";
        document.getElementById("winnersBox").value = "";

        // Reset input field borders
        document.getElementById("rawData").style.border = "";
        document.getElementById("winningNumber").style.border = "";
        document.getElementById("numWinners").style.border = "";
    });
});
