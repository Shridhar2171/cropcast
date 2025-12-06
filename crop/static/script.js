document.addEventListener('DOMContentLoaded', function() {
    // Initialize feather icons
    feather.replace();
    
    // Form submission handler
    const predictionForm = document.getElementById('predictionForm');
    const resultsSection = document.getElementById('resultsSection');
    const newPredictionBtn = document.getElementById('newPredictionBtn');
    let yieldChart = null;
    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        // Get form values
        const cropType = document.getElementById('cropType').value;
        const soilType = document.getElementById('soilType').value;
        const rainfall = document.getElementById('rainfall').value;
        const season = document.getElementById('season').value;
        const irrigation = document.getElementById('irrigation').value;
        const farmSize = document.getElementById('farmSize').value;
        
        // Call backend API
        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cropType,
                    soilType,
                    rainfall,
                    season,
                    irrigation,
                    farmSize
                })
            });
            
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            // Fallback to simulated prediction
            simulatePrediction(cropType, soilType, rainfall, season, irrigation, farmSize);
        }
});
    
    newPredictionBtn.addEventListener('click', function() {
        resultsSection.classList.add('hidden');
        predictionForm.reset();
    });
    function calculateCropYield(cropType, soilType, rainfall, season, irrigation, farmSize) {
        let baseYield;
        switch(cropType) {
            case 'wheat': baseYield = 3000; break;
            case 'rice': baseYield = 4000; break;
            case 'corn': baseYield = 5000; break;
            case 'soybean': baseYield = 2500; break;
            case 'potato': baseYield = 35000; break;
            default: baseYield = 3000;
        }
        
        // Adjust based on soil type
        if (soilType === 'loamy') baseYield *= 1.2;
        else if (soilType === 'silty') baseYield *= 1.1;
        else if (soilType === 'clay') baseYield *= 0.9;
        else if (soilType === 'sandy') baseYield *= 0.8;
        
        // Adjust based on rainfall
        if (rainfall === 'medium') baseYield *= 1.1;
        else if (rainfall === 'high') baseYield *= 1.3;
        else baseYield *= 0.9; // low
        
        // Adjust based on irrigation
        if (irrigation === 'drip') baseYield *= 1.2;
        else if (irrigation === 'sprinkler') baseYield *= 1.1;
        else if (irrigation === 'flood') baseYield *= 0.9;
        
        return Math.round(baseYield / 100) * 100;
    }
    function displayResults(data) {
        // Show loading state
        resultsSection.classList.add('hidden');
        
        // Find alternative crop with better yield
        let alternativeCrop = '';
        let alternativeYield = 0;
        const crops = ['wheat', 'rice', 'corn', 'soybean', 'potato'];
        
        // Format crop name
        const formattedCrop = data.crop_type.charAt(0).toUpperCase() + data.crop_type.slice(1);
        
        // Update UI with results
        document.getElementById('yieldResult').textContent = `${Math.round(data.predicted_yield)} kg/ha`;
        document.getElementById('cropResult').textContent = formattedCrop;
        document.getElementById('confidenceResult').textContent = `${data.confidence}%`;
        
        // Create or update chart
        renderYieldChart(data.crop_type, data.predicted_yield);
        
        // Show results with animation
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('fade-in');
    }

    function simulatePrediction(cropType, soilType, rainfall, season, irrigation, farmSize) {
        // Show loading state
        resultsSection.classList.add('hidden');
// Simulate API call delay
        setTimeout(() => {
            // Calculate "predicted" yield (simplified linear regression simulation)
            let baseYield;
            switch(cropType) {
                case 'wheat': baseYield = 3000; break;
                case 'rice': baseYield = 4000; break;
                case 'corn': baseYield = 5000; break;
                case 'soybean': baseYield = 2500; break;
                case 'potato': baseYield = 35000; break;
                default: baseYield = 3000;
            }
            // Simplified model based on simple parameters
            let yieldPrediction = baseYield;
            
            // Adjust based on soil type
            if (soilType === 'loamy') yieldPrediction *= 1.2;
            else if (soilType === 'silty') yieldPrediction *= 1.1;
            else if (soilType === 'clay') yieldPrediction *= 0.9;
            else if (soilType === 'sandy') yieldPrediction *= 0.8;
            
            // Adjust based on rainfall
            if (rainfall === 'medium') yieldPrediction *= 1.1;
            else if (rainfall === 'high') yieldPrediction *= 1.3;
            else yieldPrediction *= 0.9; // low
            
            // Adjust based on irrigation
            if (irrigation === 'drip') yieldPrediction *= 1.2;
            else if (irrigation === 'sprinkler') yieldPrediction *= 1.1;
            else if (irrigation === 'flood') yieldPrediction *= 0.9;
            
            // Round to nearest 100
            yieldPrediction = Math.round(yieldPrediction / 100) * 100;
// Random confidence between 85-95%
            const confidence = Math.floor(Math.random() * 10) + 85;
            // Find alternative crop with better yield
            let alternativeCrop = '';
            let alternativeYield = 0;
            
            const crops = ['wheat', 'rice', 'corn', 'soybean', 'potato'];
            crops.forEach(crop => {
                if (crop !== cropType) {
                    let currentYield = calculateCropYield(crop, soilType, rainfall, season, irrigation, farmSize);
                    if (currentYield > alternativeYield) {
                        alternativeYield = currentYield;
                        alternativeCrop = crop;
                    }
                }
            });

            // Format alternative crop name
            const formattedAltCrop = alternativeCrop.charAt(0).toUpperCase() + alternativeCrop.slice(1);
            
            // Update UI with results
            document.getElementById('yieldResult').textContent = `${yieldPrediction} kg/ha`;
            document.getElementById('cropResult').textContent = cropType.charAt(0).toUpperCase() + cropType.slice(1);
            document.getElementById('confidenceResult').textContent = `${confidence}%`;
            document.getElementById('alternativeCrop').textContent = formattedAltCrop;
            document.getElementById('alternativeYield').textContent = `${alternativeYield} kg/ha`;
            document.getElementById('alternativePercent').textContent = `${Math.round((alternativeYield - yieldPrediction) / yieldPrediction * 100)}% higher`;
// Create or update chart
            renderYieldChart(cropType, yieldPrediction);
            
            // Show results with animation
            resultsSection.classList.remove('hidden');
            resultsSection.classList.add('fade-in');
        }, 1000);
    }
    
    function renderYieldChart(cropType, yieldPrediction) {
        const ctx = document.getElementById('yieldChart').getContext('2d');
        
        // Historical data for visualization (simulated)
        const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
        const baseData = {
            wheat: [2500, 2700, 2900, 3100, 2800, 3000, 0],
            rice: [3500, 3700, 3900, 4100, 3800, 4000, 0],
            corn: [4500, 4700, 4900, 4100, 4800, 5000, 0],
            soybean: [2000, 2200, 2400, 2100, 2300, 2500, 0],
            potato: [30000, 32000, 34000, 31000, 33000, 35000, 0]
        };
        
        // Update current year prediction
        const historicalData = [...baseData[cropType]];
        historicalData[historicalData.length - 1] = yieldPrediction;
        
        if (yieldChart) {
            yieldChart.destroy();
        }
        
        yieldChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} Yield (kg/ha)`,
                        data: historicalData,
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toLocaleString()} kg/ha`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
});