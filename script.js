document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.getElementById('progress-bar');
    const progressMessage = document.getElementById('progress-message');
    const todayDate = document.getElementById('today-date');
    const currentTime = document.getElementById('current-time');
    const daysPassed = document.getElementById('days-passed');
    const yearPercentageDecimals = document.getElementById('year-percentage-decimals');
    const screenshotButton = document.getElementById('screenshot-btn');
    const captureArea = document.getElementById('capture-area');
    let screenshotImage = null;

    const toggleInfoBtn = document.getElementById('toggle-info-btn');
    const extraInfo = document.querySelector('.extra-info');
    // const todayMarker = document.getElementById('today-marker');

    // Start and end dates for 2026
    const startOfYear = new Date(2026, 0, 1); // Jan 1, 2026 00:00:00
    const endOfYear = new Date(2027, 0, 1); // Jan 1, 2027 00:00:00 (Exact end of 2026)

    function updateInfo() {
        const currentDate = new Date(); // Uses local system time by default

        if (currentDate >= endOfYear) {
            progressMessage.innerText = "100% of 2026 has passed.";
            progressBar.style.width = "100%";
            // todayMarker.style.left = "100%";
            todayDate.innerText = `Today's Date: ${currentDate.toDateString()}`;
            currentTime.innerText = `Current Time: ${currentDate.toLocaleTimeString()}`;
            daysPassed.innerText = `Days Passed: Day 365 of 365`;
            if (yearPercentageDecimals) {
                yearPercentageDecimals.innerText = `Year Progress: 100.00000%`;
            }
            return;
        }

        const totalMilliseconds = endOfYear - startOfYear;
        const passedMilliseconds = currentDate - startOfYear;
        // Clamp to 0 if before start of 2026
        const safePassed = Math.max(0, passedMilliseconds);
        const progressPercentage = (safePassed / totalMilliseconds) * 100;

        const totalDays = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
        const passedDays = Math.floor(safePassed / (1000 * 60 * 60 * 24)) + 1;

        progressBar.style.width = `${progressPercentage}%`;
        // todayMarker.style.left = `${progressPercentage}%`;

        // Use toFixed(6) or similar for precision if desired, but user just said "percentage". 
        // Showing a few decimals makes it look more "live". The original had Math.floor.
        // I'll stick to Math.floor or maybe 1 decimal to show movement, but the user didn't explicitly ask for decimals. 
        // Let's stick to the existing style but updated text.
        // Actually, to show it "go with current local time" and move smoothly, decimals help. 
        // The user didn't ask for decimals, so I will keep Math.floor but `width` uses full precision.
        progressMessage.innerText = `${Math.floor(progressPercentage)}% of 2026 has passed.`;

        todayDate.innerText = `Today's Date: ${currentDate.toDateString()}`;
        currentTime.innerText = `Current Time: ${currentDate.toLocaleTimeString()}`;
        daysPassed.innerText = `Days Passed: Day ${passedDays} of ${totalDays}`;
        if (yearPercentageDecimals) {
            yearPercentageDecimals.innerText = `Year Progress: ${progressPercentage.toFixed(5)}%`;
        }
    }

    setInterval(updateInfo, 1000); // Update every second
    updateInfo(); // Initial call

    // Handle toggle extra info
    if (toggleInfoBtn && extraInfo) {
        toggleInfoBtn.addEventListener('click', function () {
            extraInfo.classList.toggle('hidden');
            captureArea.classList.toggle('expanded-height'); // Toggle class to increase height
            if (extraInfo.classList.contains('hidden')) {
                toggleInfoBtn.innerText = 'Show Extra Info';
            } else {
                toggleInfoBtn.innerText = 'Hide Extra Info';
            }
        });
    }

    // Handle screenshot functionality
    screenshotButton.addEventListener('click', function () {
        if (screenshotButton.innerText === 'Take Screenshot' || screenshotButton.innerText === 'Take Another Screenshot') {
            screenshotButton.innerText = 'Taking Screenshot...';
            screenshotButton.style.backgroundColor = '#ffcc00'; // Yellow during capturing

            html2canvas(captureArea).then(function (canvas) {
                screenshotImage = canvas.toDataURL(); // Save screenshot as data URL

                screenshotButton.innerText = 'Screenshot Successful! Download Screenshot';
                screenshotButton.style.backgroundColor = '#4caf50'; // Green after successful capture
            }).catch(function (error) {
                console.error('Error capturing screenshot:', error);
                screenshotButton.innerText = 'Take Screenshot';
                screenshotButton.style.backgroundColor = '#f44336'; // Red on error
            });
        } else if (screenshotButton.innerText === 'Screenshot Successful! Download Screenshot') {
            if (screenshotImage) {
                const link = document.createElement('a');

                // Generate a unique name using timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const fileName = `progress-screenshot-${timestamp}.png`;

                link.href = screenshotImage;
                link.download = fileName;
                link.click();

                screenshotButton.innerText = 'Take Another Screenshot';
                screenshotButton.style.backgroundColor = '#2196f3'; // Blue for taking another screenshot
            }
        }
    });
});
