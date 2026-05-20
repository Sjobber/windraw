document.addEventListener('DOMContentLoaded', function () {
   
    function highlightEmptyFields() {
        const rawData = document.getElementById("rawData");
        const winningNumber = document.getElementById("winningNumber");
        const numWinners = document.getElementById("numWinners");
        let valid = true;

      
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

  
    document.getElementById("winners").addEventListener("click", function () {
       
        if (!highlightEmptyFields()) {
            return;
        }

      
        let rawData = document.getElementById("rawData").value.trim();
        let winningNumber = parseFloat(document.getElementById("winningNumber").value.trim().replace(/,/g, '.'));
        let numWinners = parseInt(document.getElementById("numWinners").value.trim(), 10);

      
        let entries = rawData.split("\n");
        let validEntries = {};
        let markoKCount = 0;

        
        entries.forEach(entry => {
            const firstSpaceIndex = entry.indexOf(' ');
            if (firstSpaceIndex !== -1) {
                let username = entry.substring(0, firstSpaceIndex + 2);
                const message = entry.substring(firstSpaceIndex + 2).trim(); 
                const numberMatch = message.match(/\d+([.,]\d+)*/); 

                
                if (username.trim() === "Marko K") {
                    markoKCount++;
                    username = `Marko K${markoKCount}`;
                }

                if (numberMatch) {
                    const number = parseFloat(numberMatch[0].replace(/,/g, '.')); 

                    
                    if (!validEntries.hasOwnProperty(username)) {
                        validEntries[username] = number;
                    }
                }
            }
        });

        
        if (Object.keys(validEntries).length === 0) {
            document.getElementById("winnersBox").value = "No valid entries found.";
            return;
        }

        
        let winners = [];
        let tempWinners = [];
        let lastDistance = Math.abs(Object.values(validEntries)[0] - winningNumber);

        
        let sortedEntries = Object.entries(validEntries).sort((a, b) => Math.abs(a[1] - winningNumber) - Math.abs(b[1] - winningNumber));

        sortedEntries.forEach(entry => {
            const distance = Math.abs(entry[1] - winningNumber);

            
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

        
        const lastWinnerDistance = Math.abs(winners[winners.length - 1][1] - winningNumber);
        sortedEntries.forEach(entry => {
            const distance = Math.abs(entry[1] - winningNumber);
            if (distance === lastWinnerDistance && !winners.includes(entry)) {
                winners.push(entry);
            }
        });

       
        let formattedOutput = winners.map(winner => {
            return `:W: ${winner[0]} :W: ${winner[1]}`;
        }).join("\n");

        
        document.getElementById("winnersBox").value = formattedOutput;
    });

    
    document.getElementById("clear").addEventListener("click", function () {
        // Clear all input boxes and output
        document.getElementById("rawData").value = "";
        document.getElementById("winningNumber").value = "";
        document.getElementById("numWinners").value = "";
        document.getElementById("winnersBox").value = "";

        
        document.getElementById("rawData").style.border = "";
        document.getElementById("winningNumber").style.border = "";
        document.getElementById("numWinners").style.border = "";
    });
});
