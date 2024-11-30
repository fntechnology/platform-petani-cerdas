import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Constants and Configuration
const GEMINI_API_KEY = "AIzaSyAcwroBdyqURbkXLDUkzRQmDTH7FyX0TRA";

// Color constants
const COLORS = {
  primary: '#059669',    // Emerald 600 - Main green
  secondary: '#10b981',  // Emerald 500 - Lighter green
  accent: '#34d399',     // Emerald 400 - Bright green
  success: '#047857',    // Emerald 700 - Dark green
  warning: '#f59e0b',    // Amber - For warnings
  error: '#dc2626',      // Red - For errors
  danger: '#dc2626',     // Red - For errors (alias)
  dark: '#064e3b',       // Emerald 900 - Very dark green
  light: '#ecfdf5',      // Emerald 50 - Very light green
  gray: '#6b7280',       // Cool gray
  safe: '#059669',       // Same as primary
  gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)' // Emerald gradient
};

// Data tanaman
const CROPS = [
  {
    name: 'Padi',
    optimalTemperature: { min: 22, max: 30 },
    waterRequirement: { min: 160, max: 200 },
    soilType: 'Tanah lempung berpasir dengan pH 5.5-7.5',
    bestPlantingMonths: ['Oktober', 'November', 'Maret', 'April'],
    challenges: 'Serangan hama wereng, penyakit blast, dan kekeringan'
  },
  {
    name: 'Jagung',
    optimalTemperature: { min: 20, max: 32 },
    waterRequirement: { min: 100, max: 140 },
    soilType: 'Tanah gembur dengan pH 5.6-7.5',
    bestPlantingMonths: ['September', 'Oktober', 'Februari', 'Maret'],
    challenges: 'Serangan ulat penggerek batang dan kekeringan'
  },
  {
    name: 'Kedelai',
    optimalTemperature: { min: 21, max: 32 },
    waterRequirement: { min: 100, max: 150 },
    soilType: 'Tanah lempung berpasir dengan pH 6.0-7.0',
    bestPlantingMonths: ['Oktober', 'November', 'Februari', 'Maret'],
    challenges: 'Serangan ulat grayak dan penyakit karat daun'
  },
  {
    name: 'Kacang Tanah',
    optimalTemperature: { min: 20, max: 30 },
    waterRequirement: { min: 100, max: 150 },
    soilType: 'Tanah lempung berpasir dengan pH 5.5-6.5',
    bestPlantingMonths: ['April', 'Mei', 'Juni', 'Juli'],
    challenges: 'Serangan penyakit layu dan hama kutu daun'
  },
  {
    name: 'Singkong',
    optimalTemperature: { min: 24, max: 34 },
    waterRequirement: { min: 50, max: 100 },
    soilType: 'Tanah berpasir dengan pH 4.5-7.5',
    bestPlantingMonths: ['Maret', 'April', 'Mei', 'Juni'],
    challenges: 'Serangan hama tikus dan penyakit busuk batang'
  }
];

// Data kota dan cuaca
const CITIES = {
  "Jambi": {
    monthlyWeather: [
      { month: "Januari", temperature_min: 23, temperature_max: 31, rainfall: 200 },
      { month: "Februari", temperature_min: 23, temperature_max: 32, rainfall: 180 },
      { month: "Maret", temperature_min: 24, temperature_max: 32, rainfall: 170 },
      { month: "April", temperature_min: 24, temperature_max: 33, rainfall: 160 },
      { month: "Mei", temperature_min: 24, temperature_max: 33, rainfall: 140 },
      { month: "Juni", temperature_min: 23, temperature_max: 32, rainfall: 120 },
      { month: "Juli", temperature_min: 23, temperature_max: 32, rainfall: 110 },
      { month: "Agustus", temperature_min: 23, temperature_max: 32, rainfall: 130 },
      { month: "September", temperature_min: 24, temperature_max: 33, rainfall: 150 },
      { month: "Oktober", temperature_min: 24, temperature_max: 33, rainfall: 180 },
      { month: "November", temperature_min: 24, temperature_max: 32, rainfall: 200 },
      { month: "Desember", temperature_min: 23, temperature_max: 31, rainfall: 220 }
    ]
  },
  "Palembang": {
    monthlyWeather: [
      { month: "Januari", temperature_min: 24, temperature_max: 32, rainfall: 220 },
      { month: "Februari", temperature_min: 24, temperature_max: 32, rainfall: 200 },
      { month: "Maret", temperature_min: 24, temperature_max: 33, rainfall: 190 },
      { month: "April", temperature_min: 24, temperature_max: 33, rainfall: 180 },
      { month: "Mei", temperature_min: 24, temperature_max: 33, rainfall: 160 },
      { month: "Juni", temperature_min: 24, temperature_max: 32, rainfall: 140 },
      { month: "Juli", temperature_min: 23, temperature_max: 32, rainfall: 130 },
      { month: "Agustus", temperature_min: 23, temperature_max: 32, rainfall: 140 },
      { month: "September", temperature_min: 24, temperature_max: 33, rainfall: 160 },
      { month: "Oktober", temperature_min: 24, temperature_max: 33, rainfall: 190 },
      { month: "November", temperature_min: 24, temperature_max: 32, rainfall: 210 },
      { month: "Desember", temperature_min: 24, temperature_max: 32, rainfall: 230 }
    ]
  },
  "Jakarta": {
    monthlyWeather: [
      { month: "Januari", temperature_min: 23, temperature_max: 31, rainfall: 300 },
      { month: "Februari", temperature_min: 23, temperature_max: 31, rainfall: 280 },
      { month: "Maret", temperature_min: 24, temperature_max: 32, rainfall: 260 },
      { month: "April", temperature_min: 24, temperature_max: 33, rainfall: 240 },
      { month: "Mei", temperature_min: 24, temperature_max: 33, rainfall: 220 },
      { month: "Juni", temperature_min: 23, temperature_max: 32, rainfall: 200 },
      { month: "Juli", temperature_min: 23, temperature_max: 32, rainfall: 190 },
      { month: "Agustus", temperature_min: 23, temperature_max: 32, rainfall: 210 },
      { month: "September", temperature_min: 24, temperature_max: 33, rainfall: 240 },
      { month: "Oktober", temperature_min: 24, temperature_max: 33, rainfall: 270 },
      { month: "November", temperature_min: 24, temperature_max: 32, rainfall: 300 },
      { month: "Desember", temperature_min: 24, temperature_max: 32, rainfall: 320 }
    ]
  },
  "Surabaya": {
    monthlyWeather: [
      { month: "Januari", temperature_min: 24, temperature_max: 32, rainfall: 200 },
      { month: "Februari", temperature_min: 24, temperature_max: 32, rainfall: 190 },
      { month: "Maret", temperature_min: 25, temperature_max: 33, rainfall: 180 },
      { month: "April", temperature_min: 25, temperature_max: 34, rainfall: 170 },
      { month: "Mei", temperature_min: 25, temperature_max: 34, rainfall: 160 },
      { month: "Juni", temperature_min: 24, temperature_max: 33, rainfall: 150 },
      { month: "Juli", temperature_min: 24, temperature_max: 33, rainfall: 140 },
      { month: "Agustus", temperature_min: 24, temperature_max: 33, rainfall: 160 },
      { month: "September", temperature_min: 25, temperature_max: 34, rainfall: 180 },
      { month: "Oktober", temperature_min: 25, temperature_max: 34, rainfall: 200 },
      { month: "November", temperature_min: 25, temperature_max: 33, rainfall: 220 },
      { month: "Desember", temperature_min: 25, temperature_max: 33, rainfall: 240 }
    ]
  },
  "Bandung": {
    monthlyWeather: [
      { month: "Januari", temperature_min: 19, temperature_max: 28, rainfall: 350 },
      { month: "Februari", temperature_min: 19, temperature_max: 28, rainfall: 340 },
      { month: "Maret", temperature_min: 20, temperature_max: 29, rainfall: 330 },
      { month: "April", temperature_min: 20, temperature_max: 30, rainfall: 320 },
      { month: "Mei", temperature_min: 20, temperature_max: 30, rainfall: 310 },
      { month: "Juni", temperature_min: 19, temperature_max: 29, rainfall: 300 },
      { month: "Juli", temperature_min: 19, temperature_max: 29, rainfall: 290 },
      { month: "Agustus", temperature_min: 19, temperature_max: 29, rainfall: 310 },
      { month: "September", temperature_min: 20, temperature_max: 30, rainfall: 330 },
      { month: "Oktober", temperature_min: 20, temperature_max: 30, rainfall: 350 },
      { month: "November", temperature_min: 20, temperature_max: 29, rainfall: 370 },
      { month: "Desember", temperature_min: 20, temperature_max: 29, rainfall: 390 }
    ]
  }
};

// Fungsi untuk menentukan musim
const determineSeason = (month) => {
    const rainySeasonMonths = ['November', 'Desember', 'Januari', 'Februari', 'Maret'];
    const drySeasonMonths = ['April', 'Mei', 'Juni', 'Juli', 'Agustus'];
    const transitionSeasonMonths = ['September', 'Oktober'];

    if (rainySeasonMonths.includes(month)) return 'Musim Hujan';
    if (drySeasonMonths.includes(month)) return 'Musim Kemarau';
    if (transitionSeasonMonths.includes(month)) return 'Musim Pancaroba';
    return 'Tidak Diketahui';
};

const determinePlantingSeason = (month, avgTemperature, avgRainfall) => {
    // Define optimal conditions for each planting season
    const conditions = {
        'MT1': { tempRange: [20, 30], rainfallRange: [100, 200] },
        'MT2': { tempRange: [25, 35], rainfallRange: [150, 250] },
        'MT3': { tempRange: [22, 32], rainfallRange: [120, 220] }
    };

    // Determine the planting season based on climate data
    for (const [season, { tempRange, rainfallRange }] of Object.entries(conditions)) {
        if (
            avgTemperature >= tempRange[0] && avgTemperature <= tempRange[1] &&
            avgRainfall >= rainfallRange[0] && avgRainfall <= rainfallRange[1]
        ) {
            return season;
        }
    }
    return 'Tidak Diketahui';
};

const isOptimalPlantingMonth = (month, cropType) => {
    const crop = CROPS.find(c => c.name === cropType);
    return crop && crop.bestPlantingMonths.includes(month) ? 'Optimal' : 'Tidak Optimal';
};

const isOptimalForAnyCrop = (month) => {
    return CROPS.some(crop => crop.bestPlantingMonths.includes(month)) ? 'Optimal' : 'Tidak Optimal';
};

Object.keys(CITIES).forEach(city => {
    CITIES[city].monthlyWeather = CITIES[city].monthlyWeather.map(weather => ({
        ...weather,
        season: determineSeason(weather.month),
        plantingInfo: isOptimalPlantingMonth(weather.month, 'Padi') // Update planting info based on crop type
    }));
});

// Fungsi untuk memanggil Gemini AI
async function getGeminiAnalysis(prompt, month, cropType) {
  try {
    const refinedPrompt = `${prompt} Please analyze the planting suitability for ${cropType} in the month of ${month}. Consider the average temperature and rainfall.`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: refinedPrompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Maaf, terjadi kesalahan saat menganalisis dengan AI. Silakan coba lagi dalam beberapa saat.";
  }
}

// Komponen WeatherCharts untuk visualisasi data cuaca
const WeatherCharts = () => {
  const [selectedCity, setSelectedCity] = useState('Jambi');
  const [chartData, setChartData] = useState(null);
  const chartRef = React.useRef(null);
  const rainChartRef = React.useRef(null);
  const [charts, setCharts] = React.useState({ temp: null, rain: null });

  React.useEffect(() => {
    if (!CITIES[selectedCity] || !chartRef.current || !rainChartRef.current) return;

    // Destroy existing charts
    if (charts.temp) charts.temp.destroy();
    if (charts.rain) charts.rain.destroy();

    // Temperature Chart
    const tempCtx = chartRef.current.getContext('2d');
    const tempChart = new Chart(tempCtx, {
      type: 'line',
      data: {
        labels: CITIES[selectedCity].monthlyWeather.map(w => w.month),
        datasets: [
          {
            label: 'Suhu Maksimum (°C)',
            data: CITIES[selectedCity].monthlyWeather.map(w => w.temperature_max),
            borderColor: '#dc2626',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Suhu Minimum (°C)',
            data: CITIES[selectedCity].monthlyWeather.map(w => w.temperature_min),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    // Rainfall Chart
    const rainCtx = rainChartRef.current.getContext('2d');
    const rainChart = new Chart(rainCtx, {
      type: 'bar',
      data: {
        labels: CITIES[selectedCity].monthlyWeather.map(w => w.month),
        datasets: [{
          label: 'Curah Hujan (mm)',
          data: CITIES[selectedCity].monthlyWeather.map(w => w.rainfall),
          backgroundColor: COLORS.accent,
          borderColor: COLORS.accent,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    setCharts({ temp: tempChart, rain: rainChart });

    return () => {
      if (charts.temp) charts.temp.destroy();
      if (charts.rain) charts.rain.destroy();
    };
  }, [selectedCity]);

  const analyzeWeather = async () => {
    const cityData = CITIES[selectedCity];
    const cropData = CROPS.find(c => c.name === 'Padi');
    
    const result = `Analisis Musim Tanam untuk ${cropData.name} di ${selectedCity}:
        
      1. Suhu:
      - Suhu optimal untuk ${cropData.name}: ${cropData.optimalTemperature.min}°C - ${cropData.optimalTemperature.max}°C
      - Suhu di ${selectedCity} sesuai untuk penanaman
      
      2. Curah Hujan:
      - Kebutuhan air ${cropData.name}: ${cropData.waterRequirement.min}-${cropData.waterRequirement.max} mm/bulan
      - Bulan dengan curah hujan optimal: ${cropData.bestPlantingMonths.join(', ')}
      
      3. Rekomendasi:
      - Waktu tanam terbaik: ${cropData.bestPlantingMonths[0]}
      - Perhatikan: ${cropData.challenges}
      - Jenis tanah yang sesuai: ${cropData.soilType}`;
      
    setChartData(result);

    const annualData = cityData.monthlyWeather.map(month =>
      `${month.month}: Suhu ${month.temperature_min}-${month.temperature_max}°C, Curah Hujan ${month.rainfall} mm`
    ).join("\n");

    const aiPrompt = `Analisis Musim Tanam Khusus ${cropData.name} di ${selectedCity}:

Data Tanaman:
- Suhu Optimal: ${cropData.optimalTemperature.min}-${cropData.optimalTemperature.max}°C
- Kebutuhan Air: ${cropData.waterRequirement.min}-${cropData.waterRequirement.max} mm
- Jenis Tanah Terbaik: ${cropData.soilType}
- Bulan Terbaik Tanam: ${cropData.bestPlantingMonths.join(", ")}
- Tantangan Utama: ${cropData.challenges}

Data Iklim Tahunan:
${annualData}

Berikan analisis mendalam tentang:
1. Kesesuaian kondisi iklim untuk tanaman tersebut
2. Rekomendasi waktu tanam yang optimal (terutama peralihan musim kemarau ke hujan)
3. Potensi risiko dan cara mitigasinya
4. Teknik budidaya yang sesuai dengan kondisi iklim
5. Antisipasi perubahan cuaca

`;

    const aiResult = await getGeminiAnalysis(aiPrompt, cityData.monthlyWeather[0].month, 'Padi');
    setChartData(aiResult);
  };

  const styles = {
    tableHeaderStyle: {
      padding: '12px',
      textAlign: 'left',
      backgroundColor: COLORS.light,
      color: COLORS.dark,
      fontWeight: '600',
      borderBottom: `2px solid ${COLORS.primary}`
    },
    tableCellStyle: {
      padding: '12px',
      borderBottom: `1px solid ${COLORS.light}`,
      color: COLORS.gray
    }
  };

  return (
    <div className="tab-content">
      <div className="input-group" style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}
        >
          {Object.keys(CITIES).map(cityName => (
            <option key={cityName} value={cityName}>{cityName}</option>
          ))}
        </select>
        
        <button
          onClick={analyzeWeather}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: COLORS.primary,
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Analisa Musim Tanam
        </button>
      </div>

      <div className="charts-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${COLORS.light}`
        }}>
          <canvas ref={chartRef}></canvas>
        </div>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${COLORS.light}`
        }}>
          <canvas ref={rainChartRef}></canvas>
        </div>
      </div>

      <div className="weather-table" style={{
        marginTop: '20px',
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.tableHeaderStyle}>Bulan</th>
              <th style={styles.tableHeaderStyle}>Musim</th>
              <th style={styles.tableHeaderStyle}>Kelayakan Tanam</th>
              <th style={styles.tableHeaderStyle}>Suhu Min (°C)</th>
              <th style={styles.tableHeaderStyle}>Suhu Max (°C)</th>
              <th style={styles.tableHeaderStyle}>Curah Hujan (mm)</th>
            </tr>
          </thead>
          <tbody>
            {CITIES[selectedCity].monthlyWeather.map((weather, index) => (
              <tr key={index}>
                <td style={styles.tableCellStyle}>{weather.month}</td>
                <td style={styles.tableCellStyle}>{weather.season}</td>
                <td style={styles.tableCellStyle}>{weather.plantingInfo}</td>
                <td style={styles.tableCellStyle}>{weather.temperature_min}</td>
                <td style={styles.tableCellStyle}>{weather.temperature_max}</td>
                <td style={styles.tableCellStyle}>{weather.rainfall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {chartData && (
        <div className="analysis-result" style={{
          marginTop: '20px',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <pre style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit'
          }}>
            {chartData}
          </pre>
        </div>
      )}
    </div>
  );
}

// Komponen FarmingAnalysis untuk analisis usaha tani
const FarmingAnalysis = () => {
    const [analysisData, setAnalysisData] = useState({
        cropType: '',
        landArea: '',
        productionCost: '',
        sellingPrice: '',
        yield: ''
    });

    const sampleData = {
        cropType: 'Padi',
        landArea: '1000',
        productionCost: '5000000',
        sellingPrice: '6000000',
        yield: '4000'
    };

    const loadSampleData = () => {
        setAnalysisData(sampleData);
    };

    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnalysisData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateAnalysis = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const prompt = `Berdasarkan data usaha tani berikut:

Lahan: ${analysisData.landArea} m²
Biaya Operasional: Rp ${analysisData.productionCost}
Estimasi Hasil Panen: ${analysisData.yield} kg
Harga Jual: Rp ${analysisData.sellingPrice}/kg
ROI: ${((analysisData.sellingPrice - analysisData.productionCost) / analysisData.productionCost) * 100}%
B/C Ratio: ${analysisData.sellingPrice / analysisData.productionCost}
Break Even Point: ${analysisData.productionCost / analysisData.sellingPrice} kg

Berikan analisis komprehensif dalam bentuk satu paragraf yang detail dan mendalam. Gunakan format teks berikut:
- Gunakan **teks** untuk penekanan penting atau kesimpulan utama
- Gunakan *teks* untuk istilah teknis, angka-angka kunci, atau nilai penting
- Gunakan __teks__ untuk rekomendasi atau saran penting

Analisis harus mencakup aspek-aspek berikut dalam satu paragraf yang mengalir:
1. Evaluasi kelayakan finansial (ROI, B/C Ratio, BEP)
2. Analisis potensi keuntungan dan risiko
3. Rekomendasi strategi optimasi dan mitigasi risiko
4. Prospek keberlanjutan usaha
5. Aspek teknis dan operasional yang relevan
6. Strategi pemasaran dan pengembangan usaha
7. Perbandingan dengan standar industri pertanian
8. Faktor-faktor kritis kesuksesan

Gunakan bahasa formal dan ilmiah yang mengalir dengan baik. Hindari penggunaan poin-poin atau pembagian yang terpisah. Semua aspek harus terhubung secara logis dalam satu paragraf yang kohesif dan komprehensif.`;

            const result = await getGeminiAnalysis(prompt, 'Jambi', 'Padi');
            setAnalysis(result);
        } catch (error) {
            setError("Terjadi kesalahan saat menganalisis data. Silakan coba lagi.");
            console.error("Error generating analysis:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi perhitungan finansial
    const calculateTotalCosts = () => {
        const productionCost = parseInt(analysisData.productionCost) || 0;
        return productionCost;
    };

    const calculateEstimatedRevenue = () => {
        const yield_kg = parseInt(analysisData.yield) || 0;
        const price_per_kg = parseInt(analysisData.sellingPrice) || 0;
        return yield_kg * price_per_kg;
    };

    const calculateBEP = () => {
        const totalCosts = calculateTotalCosts();
        const pricePerKg = parseInt(analysisData.sellingPrice) || 0;
        
        if (pricePerKg === 0) return { units: 0, value: 0 };
        
        const bepUnits = totalCosts / pricePerKg; // BEP dalam kg
        const bepValue = totalCosts; // BEP dalam Rupiah
        
        return { units: bepUnits, value: bepValue };
    };

    const calculateBCRatio = () => {
        const totalCosts = calculateTotalCosts();
        const totalRevenue = calculateEstimatedRevenue();
        
        if (totalCosts === 0) return 0;
        return totalRevenue / totalCosts;
    };

    const calculateROI = () => {
        const totalCosts = calculateTotalCosts();
        const totalRevenue = calculateEstimatedRevenue();
        const profit = totalRevenue - totalCosts;
        
        if (totalCosts === 0) return 0;
        return (profit / totalCosts) * 100;
    };

    const analyzeLandSuitability = () => {
        const crop = CROPS.find(c => c.name.toLowerCase() === analysisData.cropType.toLowerCase());
        if (!crop) return { suitable: false, message: 'Jenis tanaman tidak ditemukan dalam database' };

        const soilTypeMatch = analysisData.soilType.toLowerCase().includes(crop.soilType.toLowerCase());
        const phValue = parseFloat(analysisData.soilPh);
        const phSuitable = phValue >= 5.5 && phValue <= 7.5;

        return {
            suitable: soilTypeMatch && phSuitable,
            message: `${soilTypeMatch ? '✓' : '✗'} Jenis Tanah\n${phSuitable ? '✓' : '✗'} pH Tanah`,
            recommendations: crop.challenges
        };
    };

    const analyzePlantingSeason = (cityData) => {
        const crop = CROPS.find(c => c.name.toLowerCase() === analysisData.cropType.toLowerCase());
        if (!crop) return { suitable: false, message: 'Jenis tanaman tidak ditemukan' };

        const currentMonth = new Date().getMonth();
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const currentMonthName = monthNames[currentMonth];

        const isOptimalMonth = crop.bestPlantingMonths.includes(currentMonthName);
        const weatherData = cityData?.monthlyWeather[currentMonth];

        if (!weatherData) return { suitable: false, message: 'Data cuaca tidak tersedia' };

        const tempSuitable = weatherData.temperature_max <= crop.optimalTemperature.max && 
                           weatherData.temperature_min >= crop.optimalTemperature.min;
        
        const waterSuitable = weatherData.rainfall >= crop.waterRequirement.min && 
                            weatherData.rainfall <= crop.waterRequirement.max;

        return {
            suitable: isOptimalMonth && tempSuitable && waterSuitable,
            message: `
                ${isOptimalMonth ? '✓' : '✗'} Bulan Tanam Optimal
                ${tempSuitable ? '✓' : '✗'} Suhu Sesuai (${weatherData.temperature_min}°C - ${weatherData.temperature_max}°C)
                ${waterSuitable ? '✓' : '✗'} Curah Hujan Sesuai (${weatherData.rainfall} mm/bulan)
            `,
            recommendations: weatherData.season === "Hujan" ? 
                "Perhatikan drainase dan antisipasi serangan penyakit" : 
                "Pastikan ketersediaan air irigasi dan antisipasi kekeringan"
        };
    };

    // Fungsi untuk memformat teks analisis menjadi satu paragraf
    function formatAnalysisText(text) {
        if (!text) return '';

        // Format bold text (between **text**)
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        
        // Format italic text (between _text_)
        text = text.replace(/_(.*?)_/g, "<em>$1</em>");
        
        // Format underlined text (between __text__)
        text = text.replace(/__(.*?)__/g, "<u>$1</u>");
        
        return text;
    };

    const renderFormattedText = (text) => {
        return { __html: formatAnalysisText(text) };
    };

    return (
        <div className="farming-analysis">
            <div className="form-container">
                <div className="form-section">
                    <div className="section-header">
                        <h3>Data Lahan</h3>
                    </div>

                    <div className="form-group">
                        <label>Luas Lahan</label>
                        <input
                            type="number"
                            name="landArea"
                            value={analysisData.landArea}
                            onChange={handleInputChange}
                            placeholder="Masukkan luas lahan"
                        />
                    </div>

                    <div className="form-group">
                        <label>Jenis Tanah</label>
                        <input
                            type="text"
                            name="soilType"
                            value={analysisData.soilType}
                            onChange={handleInputChange}
                            placeholder="Contoh: Tanah Humus, Tanah Liat"
                        />
                    </div>

                    <div className="form-group">
                        <label>pH Tanah</label>
                        <input
                            type="text"
                            name="soilPh"
                            value={analysisData.soilPh}
                            onChange={handleInputChange}
                            placeholder="Contoh: 6.5"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Data Tanaman</h3>
                    <div className="form-group">
                        <label>Jenis Tanaman</label>
                        <input
                            type="text"
                            name="cropType"
                            value={analysisData.cropType}
                            onChange={handleInputChange}
                            placeholder="Contoh: Padi"
                        />
                    </div>

                    <div className="form-group">
                        <label>Biaya Produksi (Rp)</label>
                        <input
                            type="number"
                            name="productionCost"
                            value={analysisData.productionCost}
                            onChange={handleInputChange}
                            placeholder="Masukkan biaya produksi"
                        />
                    </div>

                    <div className="form-group">
                        <label>Harga Jual (Rp/kg)</label>
                        <input
                            type="number"
                            name="sellingPrice"
                            value={analysisData.sellingPrice}
                            onChange={handleInputChange}
                            placeholder="Masukkan harga jual"
                        />
                    </div>

                    <div className="form-group">
                        <label>Perkiraan Hasil Panen (kg)</label>
                        <input
                            type="number"
                            name="yield"
                            value={analysisData.yield}
                            onChange={handleInputChange}
                            placeholder="Masukkan perkiraan hasil panen"
                        />
                    </div>
                </div>
            </div>

            <button 
                className="analyze-button"
                onClick={generateAnalysis}
                disabled={isLoading}
            >
                {isLoading ? 'Menganalisis...' : 'Analisis Usaha Tani'}
            </button>

            {isLoading && (
                <div className="loading-spinner">
                    <progress value={undefined} max="100" />
                    <div>Sedang menganalisis data usaha tani...</div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="analysis-container">
                <div className="analysis-result basic">
                    <h3>
                        <i className="fas fa-calculator"></i>
                        Analisis Dasar Usaha Tani
                    </h3>
                    {!analysis ? (
                        <div className="empty-state">
                            <i className="fas fa-chart-line"></i>
                            <p>Masukkan data usaha tani Anda dan klik tombol Analisis untuk melihat hasil perhitungan dasar.</p>
                        </div>
                    ) : (
                        <div className="basic-analysis">
                            <div className="analysis-card">
                                <h4>Modal Usaha</h4>
                                <p>Rp {calculateTotalCosts().toLocaleString()}</p>
                                <div className="label">Total biaya operasional</div>
                            </div>
                            <div className="analysis-card">
                                <h4>Proyeksi Pendapatan</h4>
                                <p>Rp {calculateEstimatedRevenue().toLocaleString()}</p>
                                <div className="label">Berdasarkan estimasi hasil panen</div>
                            </div>
                            <div className="analysis-card">
                                <h4>Estimasi Keuntungan</h4>
                                <p>Rp {(calculateEstimatedRevenue() - calculateTotalCosts()).toLocaleString()}</p>
                                <div className="label">Pendapatan - Modal</div>
                            </div>
                            <div className="analysis-card">
                                <h4>ROI</h4>
                                <p>{calculateROI().toFixed(1)}%</p>
                                <div className="label">Return on Investment</div>
                            </div>
                            <div className="analysis-card">
                                <h4>Break Even Point</h4>
                                <p>{calculateBEP().units.toFixed(0)} kg</p>
                                <div className="label">Titik impas produksi</div>
                            </div>
                            <div className="analysis-card">
                                <h4>B/C Ratio</h4>
                                <p>{calculateBCRatio().toFixed(2)}</p>
                                <div className="label">Rasio manfaat-biaya</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="analysis-result ai">
                    <h3>
                        <i className="fas fa-brain"></i>
                        Pembahasan AI
                    </h3>
                    {!analysis ? (
                        <div className="empty-state">
                            <i className="fas fa-robot"></i>
                            <p>Hasil analisis AI akan muncul di sini setelah Anda mengklik tombol Analisis.</p>
                        </div>
                    ) : (
                        <div 
                            className="ai-content"
                            dangerouslySetInnerHTML={{ 
                                __html: formatAnalysisText(analysis)
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Komponen PestEconomicAnalysis untuk analisis ambang ekonomi hama
const PestEconomicAnalysis = () => {
  const [pestData, setPestData] = React.useState({
    pestType: 'Wereng Coklat',
    cropType: 'Padi',
    damageLevel: '5',
    controlCost: '500000',
    expectedLoss: '10'
  });
  const [analysis, setAnalysis] = React.useState(null);
  const [charts, setCharts] = React.useState([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [aiAnalysis, setAiAnalysis] = React.useState('');
  const [analysisProgress, setAnalysisProgress] = React.useState(0);
  const chartRefs = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)];

  React.useEffect(() => {
    calculateEconomicThreshold();
  }, [pestData]);

  const handleInputChange = (index, field, value) => {
    const newData = [...treatmentData];
    newData[index][field] = value;
    setTreatmentData(newData);
  };

  const calculateEconomicThreshold = () => {
    const cropPrice = parseFloat(pestData.cropPrice);
    const controlCost = parseFloat(pestData.controlCost);
    const yieldLoss = parseFloat(pestData.yieldLoss) / 100;
    const pestDensity = parseFloat(pestData.pestDensity);
    const sampleArea = parseFloat(pestData.sampleArea);
    const potentialYield = parseFloat(pestData.potentialYield);
    const controlEffectiveness = parseFloat(pestData.controlEffectiveness) / 100;
    const laborCost = parseFloat(pestData.laborCost);
    const materialCost = parseFloat(pestData.materialCost);
    const samplePoints = parseFloat(pestData.samplePoints);
    const damageIntensity = parseFloat(pestData.damageIntensity) / 100;

    if (isNaN(cropPrice) || isNaN(controlCost) || isNaN(yieldLoss) || isNaN(pestDensity) || isNaN(sampleArea) || isNaN(potentialYield) || isNaN(controlEffectiveness) || isNaN(laborCost) || isNaN(materialCost) || isNaN(samplePoints) || isNaN(damageIntensity)) {
      console.error('Invalid input detected');
      return;
    }

    const totalControlCost = controlCost + laborCost + materialCost;
    const economicThreshold = totalControlCost / (cropPrice * yieldLoss * potentialYield * controlEffectiveness);
    const densityPerArea = pestDensity / sampleArea;
    
    // Generate data points for visualization
    const dataPoints = [];
    const maxDensity = Math.max(densityPerArea * 2, economicThreshold * 2);
    for (let i = 0; i <= 10; i++) {
      const density = (maxDensity * i) / 10;
      const loss = cropPrice * yieldLoss * density * potentialYield;
      const control = density > economicThreshold ? totalControlCost : 0;
      const netLoss = loss + control;

      dataPoints.push({
        density,
        loss,
        control,
        netLoss
      });
    }

    createCharts(dataPoints, economicThreshold);

    setAnalysis({
      economicThreshold,
      currentDensity: densityPerArea,
      recommendation: densityPerArea > economicThreshold
        ? 'Tindakan pengendalian hama diperlukan karena kepadatan hama melebihi ambang ekonomi.'
        : 'Tindakan pengendalian belum diperlukan karena kepadatan hama masih di bawah ambang ekonomi.',
      status: densityPerArea > economicThreshold ? 'danger' : 'safe'
    });
  };

  const createCharts = (dataPoints, economicThreshold) => {
    charts.forEach(chart => chart.destroy());

    const newCharts = chartRefs.map((ref, index) => {
      if (!ref.current) return null;
      const ctx = ref.current.getContext('2d');

      switch (index) {
        case 0:
          return new Chart(ctx, {
            type: 'line',
            data: {
              labels: dataPoints.map(dp => dp.density.toFixed(1) + ' hama/m²'),
              datasets: [
                {
                  label: 'Kerugian Ekonomi',
                  data: dataPoints.map(dp => dp.loss),
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  tension: 0.4,
                  fill: true
                },
                {
                  label: 'Ambang Ekonomi',
                  data: dataPoints.map(() => economicThreshold),
                  borderColor: 'rgb(234, 179, 8)',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  fill: false
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Kepadatan Hama (hama/m²)'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Nilai (Rp)'
                  },
                  beginAtZero: true
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Kerugian Ekonomi dan Ambang Ekonomi vs Kepadatan Hama',
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                },
                legend: {
                  position: 'bottom'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: Rp ${context.raw.toLocaleString()}`;
                    }
                  }
                }
              }
            }
          });
        case 1:
          return new Chart(ctx, {
            type: 'bar',
            data: {
              labels: dataPoints.map(dp => dp.density.toFixed(1) + ' hama/m²'),
              datasets: [{
                label: 'Biaya Pengendalian',
                data: dataPoints.map(dp => dp.control),
                backgroundColor: 'rgba(16, 185, 129, 0.3)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Kepadatan Hama (hama/m²)'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Biaya Pengendalian (Rp)'
                  },
                  beginAtZero: true
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Biaya Pengendalian vs Kepadatan Hama',
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                },
                legend: {
                  position: 'bottom'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Biaya: Rp ${context.raw.toLocaleString()}`;
                    }
                  }
                }
              }
            }
          });
        case 2:
          return new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['Biaya Tenaga Kerja', 'Biaya Material', 'Biaya Pengendalian'],
              datasets: [{
                data: [pestData.laborCost, pestData.materialCost, pestData.controlCost],
                backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 206, 86)', 'rgb(75, 192, 192)'],
                hoverOffset: 4
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Distribusi Biaya Pengendalian',
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                },
                legend: {
                  position: 'bottom'
                }
              }
            }
          });
        case 3:
          return new Chart(ctx, {
            type: 'bar',
            data: {
              labels: dataPoints.map(dp => dp.density.toFixed(1) + ' hama/m²'),
              datasets: [
                {
                  label: 'Kerugian Ekonomi',
                  data: dataPoints.map(dp => dp.loss),
                  backgroundColor: 'rgba(239, 68, 68, 0.3)',
                  stack: 'Stack 0'
                },
                {
                  label: 'Biaya Pengendalian',
                  data: dataPoints.map(dp => dp.control),
                  backgroundColor: 'rgba(16, 185, 129, 0.3)',
                  stack: 'Stack 0'
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                  title: {
                    display: true,
                    text: 'Kepadatan Hama (hama/m²)'
                  }
                },
                y: {
                  stacked: true,
                  title: {
                    display: true,
                    text: 'Total Biaya dan Kerugian (Rp)'
                  },
                  beginAtZero: true
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Total Biaya dan Kerugian vs Kepadatan Hama',
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                },
                legend: {
                  position: 'bottom'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: Rp ${context.raw.toLocaleString()}`;
                    }
                  }
                }
              }
            }
          });
        case 4:
          return new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Biaya Tenaga Kerja', 'Biaya Material', 'Biaya Pengendalian'],
              datasets: [
                {
                  label: 'Biaya',
                  data: [pestData.laborCost, pestData.materialCost, pestData.controlCost],
                  backgroundColor: 'rgba(54, 162, 235, 0.3)',
                  stack: 'Stack 0'
                },
                {
                  label: 'Persentase',
                  data: [((pestData.laborCost / (pestData.laborCost + pestData.materialCost + pestData.controlCost)) * 100).toFixed(2), ((pestData.materialCost / (pestData.laborCost + pestData.materialCost + pestData.controlCost)) * 100).toFixed(2), ((pestData.controlCost / (pestData.laborCost + pestData.materialCost + pestData.controlCost)) * 100).toFixed(2)],
                  backgroundColor: 'rgba(255, 206, 86, 0.3)',
                  stack: 'Stack 1'
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                  title: {
                    display: true,
                    text: 'Jenis Biaya'
                  }
                },
                y: {
                  stacked: true,
                  title: {
                    display: true,
                    text: 'Nilai (Rp) / Persentase (%)'
                  },
                  beginAtZero: true
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Biaya dan Persentase vs Jenis Biaya',
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                },
                legend: {
                  position: 'bottom'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
                    }
                  }
                }
              }
            }
          });
        default:
          return null;
      }
    });

    setCharts(newCharts);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAiAnalysis('');

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const prompt = `Analisis ambang ekonomi hama untuk tanaman berikut:
      
Data Tanaman:
- Jenis Tanaman: ${pestData.cropType}
- Hama: ${pestData.pestType}
- Fase Pertumbuhan: ${pestData.growthPhase}
- Harga Panen: Rp${parseInt(pestData.cropPrice).toLocaleString()}/kg
- Potensi Hasil: ${pestData.potentialYield} kg/ha
- Musim: ${pestData.season === 'hujan' ? 'Musim Hujan' : pestData.season === 'kemarau' ? 'Musim Kemarau' : 'Musim Pancaroba'}
- Musim Tanam: ${pestData.plantingSeason}

Data Pengamatan:
- Metode Pengamatan: ${pestData.observationMethod}
- Jumlah Titik Sampel: ${pestData.samplePoints}
- Kepadatan Hama: ${pestData.pestDensity} hama/m²
- Area Sampel: ${pestData.sampleArea} m²
- Intensitas Kerusakan: ${pestData.damageIntensity}%
- Persentase Kehilangan Hasil: ${pestData.yieldLoss}%

Data Pengendalian:
- Metode Pengendalian: ${pestData.controlMethod}
- Biaya Pengendalian Total: Rp${parseInt(pestData.controlCost).toLocaleString()}/ha
- Biaya Tenaga Kerja: Rp${parseInt(pestData.laborCost).toLocaleString()}/ha
- Biaya Material: Rp${parseInt(pestData.materialCost).toLocaleString()}/ha
- Efektivitas Pengendalian: ${pestData.controlEffectiveness}%

Hasil Perhitungan:
- Ambang Ekonomi: ${analysis?.economicThreshold?.toFixed(2) || 'Belum dihitung'} hama/m²
- Kepadatan Saat Ini: ${analysis?.currentDensity?.toFixed(2) || 'Belum dihitung'} hama/m²

Berikan analisis komprehensif mengenai:
1. Evaluasi tingkat serangan hama saat ini dibandingkan dengan ambang ekonomi
2. Rekomendasi tindakan pengendalian berdasarkan metode yang dipilih
3. Analisis cost-benefit dari tindakan pengendalian
4. Saran untuk monitoring dan pencegahan
5. Pertimbangan khusus berdasarkan musim dan musim tanam saat ini
6. Strategi pengendalian yang disesuaikan dengan kondisi musim

Berikan analisis dalam format yang terstruktur dan mudah dibaca, dengan penekanan pada aspek ekonomi dan keberlanjutan.`;

      const result = await getGeminiAnalysis(prompt, pestData.month, pestData.cropType);
      setAiAnalysis(result);
      clearInterval(progressInterval);
      setAnalysisProgress(100);
    } catch (error) {
      console.error('Error in AI analysis:', error);
      setAiAnalysis('Maaf, terjadi kesalahan dalam analisis AI. Silakan coba lagi.');
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 500);
    }
  };

  const formatText = (text) => {
    // Format bold text (between **text**)
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Format italic text (between _text_)
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");
    
    // Format underlined text (between __text__)
    text = text.replace(/__(.*?)__/g, "<u>$1</u>");
    
    return text;
  };

  const renderFormattedText = (text) => {
    return { __html: formatText(text) };
  };

  return (
    <div className="container" style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f9fafb', 
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="form-container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div className="form-section" style={{ flex: '1 1 45%', minWidth: '280px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#059669', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>Data Tanaman dan Hama</h3>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Jenis Tanaman</label>
            <select name="cropType" value={pestData.cropType} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Padi">Padi (Oryza sativa)</option>
              <option value="Jagung">Jagung (Zea mays)</option>
              <option value="Kedelai">Kedelai (Glycine max)</option>
            </select>
            <small style={{ color: '#666', fontSize: '12px' }}>Pilih jenis tanaman yang akan dianalisis</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Jenis Hama</label>
            <select name="pestType" value={pestData.pestType} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Wereng Coklat">Wereng Coklat (Nilaparvata lugens)</option>
              <option value="Penggerek Batang">Penggerek Batang Kuning (Scirpophaga incertulas)</option>
              <option value="Ulat Grayak">Ulat Grayak (Spodoptera frugiperda)</option>
              <option value="Walang Sangit">Walang Sangit (Leptocorisa oratorius)</option>
              <option value="Tikus Sawah">Tikus Sawah (Rattus argentiventer)</option>
            </select>
            <small style={{ color: '#666', fontSize: '12px' }}>Termasuk nama ilmiah spesies hama target</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Fase Pertumbuhan Tanaman</label>
            <select name="growthPhase" value={pestData.growthPhase} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="vegetatif-awal">Vegetatif Awal (0-30 HST)</option>
              <option value="vegetatif-aktif">Vegetatif Aktif (31-60 HST)</option>
              <option value="reproduktif">Reproduktif/Pembungaan (61-90 HST)</option>
              <option value="pemasakan">&gt;90 HST</option>
            </select>
            <small style={{ color: '#666', fontSize: '12px' }}>HST = Hari Setelah Tanam</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Potensi Hasil Panen (kg/ha)</label>
            <input type="text" name="potentialYield" value={pestData.potentialYield} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Estimasi hasil panen dalam kondisi optimal tanpa serangan hama</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Harga Jual Hasil Panen (Rp/kg)</label>
            <input type="text" name="cropPrice" value={pestData.cropPrice} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Harga pasar terkini untuk kualitas standar</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Musim</label>
            <select name="season" value={pestData.season} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="hujan">Musim Hujan</option>
              <option value="kemarau">Musim Kemarau</option>
              <option value="pancaroba">Musim Pancaroba</option>
            </select>
            <small style={{ color: '#666', fontSize: '12px' }}>Musim yang sedang berlangsung</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Musim Tanam</label>
            <select name="plantingSeason" value={pestData.plantingSeason} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="MT1">Musim Tanam 1 (MT1)</option>
              <option value="MT2">Musim Tanam 2 (MT2)</option>
              <option value="MT3">Musim Tanam 3 (MT3)</option>
            </select>
            <small style={{ color: '#666', fontSize: '12px' }}>Musim tanam yang sedang berlangsung</small>
          </div>
        </div>

        <div className="form-section" style={{ flex: '1 1 45%', minWidth: '280px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#059669', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>Data Pengamatan Hama</h3>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Metode Pengamatan</label>
            <select name="observationMethod" value={pestData.observationMethod} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="langsung">Pengamatan Langsung</option>
              <option value="jaring">Jaring Serangga</option>
              <option value="perangkap">Perangkap Feromon</option>
              <option value="light-trap">Light Trap</option>
            </select>
            <small style={{ color: '#666', fontSize: '12px' }}>Metode yang digunakan dalam pengamatan populasi hama</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Jumlah Titik Sampel</label>
            <input type="number" name="samplePoints" value={pestData.samplePoints} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Minimal 5 titik sampel per hektar</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Luas Area Sampel (m²)</label>
            <input type="text" name="sampleArea" value={pestData.sampleArea} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Area pengamatan per titik sampel</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Jumlah Hama Ditemukan (per titik sampel)</label>
            <input type="text" name="pestDensity" value={pestData.pestDensity} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Rata-rata jumlah hama yang ditemukan per titik sampel</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Intensitas Kerusakan (%)</label>
            <input type="text" name="damageIntensity" value={pestData.damageIntensity} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Persentase kerusakan tanaman yang diamati</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Penurunan Hasil per Hama (%)</label>
            <input type="text" name="yieldLoss" value={pestData.yieldLoss} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Estimasi kehilangan hasil per individu hama</small>
          </div>
        </div>

        <div className="form-section" style={{ flex: '1 1 45%', minWidth: '280px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#059669', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>Data Pengendalian</h3>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Metode Pengendalian</label>
            <select name="controlMethod" value={pestData.controlMethod} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="kimia">Pengendalian Kimia</option>
              <option value="biologis">Pengendalian Biologis</option>
              <option value="kultur-teknis">Kultur Teknis</option>
              <option value="terpadu">Pengendalian Terpadu</option>
            </select>
            <small style={{ color: '#666', fontSize: '12px' }}>Metode pengendalian yang akan diterapkan</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Biaya Pengendalian (Rp/ha)</label>
            <input type="text" name="controlCost" value={pestData.controlCost} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Total biaya aplikasi pengendalian per hektar</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Efektivitas Pengendalian (%)</label>
            <input type="text" name="controlEffectiveness" value={pestData.controlEffectiveness} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Persentase keberhasilan pengendalian berdasarkan penelitian</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Biaya Tenaga Kerja (Rp/ha)</label>
            <input type="text" name="laborCost" value={pestData.laborCost} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Upah pekerja untuk aplikasi pengendalian</small>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Biaya Bahan Pengendalian (Rp/ha)</label>
            <input type="text" name="materialCost" value={pestData.materialCost} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <small style={{ color: '#666', fontSize: '12px' }}>Biaya pestisida atau bahan pengendalian lainnya</small>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        {chartRefs.map((ref, index) => (
          <div key={index} style={{ 
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <canvas 
              ref={ref} 
              style={{ 
                width: '100%', 
                height: '100%', 
                minHeight: '350px',
                objectFit: 'contain' 
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ 
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '2px solid #ddd'
        }}>
          <h3 style={{
            color: '#059669',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            margin: 0
          }}>
            Analisis Ambang Ekonomi Hama dengan AI
          </h3>
          <button
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
            style={{
              padding: '10px 20px',
              backgroundColor: isAnalyzing ? '#9ca3af' : '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isAnalyzing ? 'Sedang Menganalisis...' : 'Analisis dengan AI'}
          </button>
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#059669'
              }}>
                Proses Analisis
              </span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#059669'
              }}>
                {analysisProgress}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e5e7eb',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${analysisProgress}%`,
                  height: '100%',
                  backgroundColor: '#059669',
                  borderRadius: '9999px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {aiAnalysis && !isAnalyzing && (
          <div style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #dcfce7',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#059669',
              marginBottom: '16px'
            }}>
              Hasil Analisis AI
            </div>
            <div style={{
              whiteSpace: 'pre-line',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              {aiAnalysis.split('\n').map((line, index) => {
                if (line.trim().startsWith('-')) {
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: '#059669' }}>•</span>
                      <span dangerouslySetInnerHTML={renderFormattedText(line.trim().substring(1))} />
                    </div>
                  );
                }
                if (line.trim().match(/^\d+\./)) {
                  return (
                    <div key={index} style={{
                      fontWeight: '600',
                      color: '#059669',
                      marginTop: '16px',
                      marginBottom: '8px'
                    }}
                    dangerouslySetInnerHTML={renderFormattedText(line)} />
                  );
                }
                return line.trim() && (
                  <p key={index} style={{ marginBottom: '8px' }}
                    dangerouslySetInnerHTML={renderFormattedText(line)} />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Komponen untuk Analisa Penelitian
const ResearchAnalysis = () => {
  const [treatmentData, setTreatmentData] = React.useState({
    treatments: [],
    replications: [],
    results: []
  });

  const [editingLabel, setEditingLabel] = React.useState(null);
  const [editingHeader, setEditingHeader] = React.useState(null);
  const [replicationLabels, setReplicationLabels] = React.useState([]);

  React.useEffect(() => {
    // Initialize replication labels if empty
    if (replicationLabels.length === 0 && treatmentData.treatments[0]) {
      setReplicationLabels(treatmentData.treatments[0].replications.map((_, i) => `Ulangan ${i + 1}`));
    }
  }, [treatmentData]);

  const addColumn = () => {
    const newData = treatmentData.treatments.map(row => ({ ...row, replications: [...row.replications, 0] }));
    setTreatmentData(prev => ({ ...prev, treatments: newData }));
    setReplicationLabels([...replicationLabels, `Ulangan ${replicationLabels.length + 1}`]);
  };

  const addRow = () => {
    const newRow = {
      treatment: `Perlakuan ${String.fromCharCode(65 + treatmentData.treatments.length)}`,
      replications: Array(treatmentData.treatments[0].replications.length).fill(0)
    };
    setTreatmentData(prev => ({ ...prev, treatments: [...prev.treatments, newRow] }));
  };

  const deleteRow = (rowIndex) => {
    const newData = treatmentData.treatments.filter((_, index) => index !== rowIndex);
    setTreatmentData(prev => ({ ...prev, treatments: newData }));
  };

  const deleteColumn = (colIndex) => {
    const newData = treatmentData.treatments.map(row => ({
      ...row,
      replications: row.replications.filter((_, index) => index !== colIndex)
    }));
    const newLabels = replicationLabels.filter((_, index) => index !== colIndex);
    setTreatmentData(prev => ({ ...prev, treatments: newData }));
    setReplicationLabels(newLabels);
  };

  const handleInputChange = (index, repIndex, value) => {
    const newData = treatmentData.treatments.map((row, i) => {
      if (i === index) {
        return { ...row, replications: row.replications.map((val, j) => j === repIndex ? Number(value) : val) };
      }
      return row;
    });
    setTreatmentData(prev => ({ ...prev, treatments: newData }));
  };

  const handleLabelEdit = (index, newValue) => {
    const newData = treatmentData.treatments.map((row, i) => {
      if (i === index) {
        return { ...row, treatment: newValue };
      }
      return row;
    });
    setTreatmentData(prev => ({ ...prev, treatments: newData }));
    setEditingLabel(null);
  };

  const handleHeaderEdit = (index, newValue) => {
    const newLabels = replicationLabels.map((label, i) => i === index ? newValue : label);
    setReplicationLabels(newLabels);
    setEditingHeader(null);
  };

  const calculateMean = (numbers) => {
    return numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
  };

  const calculateStandardDeviation = (numbers) => {
    const mean = calculateMean(numbers);
    const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  };

  const calculateCV = (numbers) => {
    const mean = calculateMean(numbers);
    const sd = calculateStandardDeviation(numbers);
    return (sd / mean) * 100;
  };

  const calculateStatistics = () => {
    return treatmentData.treatments.map(row => ({
      treatment: row.treatment,
      mean: calculateMean(row.replications),
      sd: calculateStandardDeviation(row.replications),
      sum: row.replications.reduce((acc, val) => acc + val, 0),
      cv: calculateCV(row.replications)
    }));
  };

  // ANOVA Calculations
  const calculateANOVA = () => {
    // Calculate total number of observations
    const n = treatmentData.treatments.reduce((acc, row) => acc + row.replications.length, 0);
    const k = treatmentData.treatments.length; // number of treatments
    const r = treatmentData.treatments[0].replications.length; // number of replications

    // Calculate correction factor (CF)
    const totalSum = treatmentData.treatments.reduce((acc, row) => 
      acc + row.replications.reduce((sum, val) => sum + val, 0), 0);
    const CF = Math.pow(totalSum, 2) / n;

    // Calculate Total Sum of Squares (TSS)
    const TSS = treatmentData.treatments.reduce((acc, row) => 
      acc + row.replications.reduce((sum, val) => sum + Math.pow(val, 2), 0), 0) - CF;

    // Calculate Treatment Sum of Squares (TrSS)
    const TrSS = treatmentData.treatments.reduce((acc, row) => {
      const treatmentSum = row.replications.reduce((sum, val) => sum + val, 0);
      return acc + Math.pow(treatmentSum, 2) / r;
    }, 0) - CF;

    // Calculate Error Sum of Squares (ESS)
    const ESS = TSS - TrSS;

    // Calculate degrees of freedom
    const df_treatment = k - 1;
    const df_error = n - k;
    const df_total = n - 1;

    // Calculate Mean Squares
    const MS_treatment = TrSS / df_treatment;
    const MS_error = ESS / df_error;

    // Calculate F value
    const F_value = MS_treatment / MS_error;

    // Calculate F table value (using 5% significance level)
    // This is a simplified approximation. In practice, you should use a proper F-distribution table
    const F_table = calculateFTable(df_treatment, df_error, 0.05);

    return {
      sources: [
        {
          source: 'Perlakuan',
          df: df_treatment,
          SS: TrSS,
          MS: MS_treatment,
          F_value: F_value,
          F_table: F_table,
          significance: F_value > F_table ? '*' : 'ns'
        },
        {
          source: 'Galat',
          df: df_error,
          SS: ESS,
          MS: MS_error,
          F_value: null,
          F_table: null,
          significance: null
        },
        {
          source: 'Total',
          df: df_total,
          SS: TSS,
          MS: null,
          F_value: null,
          F_table: null,
          significance: null
        }
      ],
      MS_error: MS_error
    };
  };

  // Helper function to calculate F table value
  const calculateFTable = (df1, df2, alpha) => {
    // This is a simplified approximation of F table values
    // In practice, you should use a proper F-distribution table or statistical library
    const approximateFTable = {
      '1,10': 4.96,
      '2,10': 4.10,
      '3,10': 3.71,
      '4,10': 3.48,
      '5,10': 3.33,
      '6,10': 3.22,
      '7,10': 3.14,
      '8,10': 3.07,
      '9,10': 3.02,
      '10,10': 2.98
    };

    const key = `${df1},${Math.min(10, df2)}`;
    return approximateFTable[key] || 4.96; // Default to 1,10 if not found
  };

  // DMRT Calculations
  const calculateDMRT = () => {
    if (treatmentData.treatments.length < 2) return null;

    const anova = calculateANOVA();
    const means = treatmentData.treatments.map(row => ({
      treatment: row.treatment,
      mean: calculateMean(row.replications)
    }));

    // Sort means in descending order
    means.sort((a, b) => b.mean - a.mean);

    // Calculate Standard Error
    const r = treatmentData.treatments[0].replications.length;
    const SE = Math.sqrt(anova.MS_error / r);

    // Significant Studentized Range (at 5% level)
    // This is a simplified table. In practice, you should use a complete table
    const SSR = {
      2: 3.08,
      3: 3.23,
      4: 3.33,
      5: 3.41,
      6: 3.46,
      7: 3.51,
      8: 3.55,
      9: 3.59,
      10: 3.62
    };

    // Calculate Least Significant Range
    const LSR = {};
    for (let p = 2; p <= means.length; p++) {
      LSR[p] = SE * (SSR[p] || SSR[10]);
    }

    // Assign groupings and check significance
    const groups = means.map(() => '');
    const significance = means.map(() => []);

    for (let i = 0; i < means.length; i++) {
      let group = 'a';
      const comparisons = [];
      
      for (let j = 0; j < means.length; j++) {
        if (i !== j) {
          const difference = Math.abs(means[i].mean - means[j].mean);
          const p = Math.abs(i - j) + 1;
          const isSignificant = difference > LSR[p];
          
          comparisons.push({
            treatment: means[j].treatment,
            difference: difference.toFixed(2),
            significant: isSignificant
          });
        }
      }
      
      // Sort comparisons by difference
      comparisons.sort((a, b) => parseFloat(b.difference) - parseFloat(a.difference));
      
      // Create significance description
      const significantDiffs = comparisons
        .filter(comp => comp.significant)
        .map(comp => comp.treatment);
      
      significance[i] = significantDiffs.length > 0 
        ? `Berbeda nyata dengan: ${significantDiffs.join(', ')}`
        : 'Tidak berbeda nyata dengan perlakuan lain';

      // Assign letter group
      for (let j = 0; j < i; j++) {
        const range = means[j].mean - means[i].mean;
        const p = i - j + 1;
        if (range > LSR[p]) {
          group = String.fromCharCode(group.charCodeAt(0) + 1);
        }
      }
      groups[i] = group;
    }

    return means.map((item, index) => ({
      ...item,
      grouping: groups[index],
      significance: significance[index]
    }));
  };

  return (
    <div className="container" style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f9fafb', 
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={addRow} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Tambah Perlakuan</button>
        <button onClick={addColumn} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Tambah Kolom Ulangan</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '200px' }} />
            {treatmentData.treatments[0].replications.map((_, index) => (
              <col key={index} style={{ width: '120px' }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>Jenis Perlakuan</th>
              {treatmentData.treatments[0].replications.map((_, repIndex) => (
                <th key={repIndex} style={{ border: '1px solid #ddd', padding: '8px', position: 'relative', background: '#f8f9fa' }}>
                  <div style={{ paddingRight: '24px', position: 'relative' }}>
                    {editingHeader === repIndex ? (
                      <input
                        type="text"
                        defaultValue={replicationLabels[repIndex]}
                        onBlur={(e) => handleHeaderEdit(repIndex, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleHeaderEdit(repIndex, e.target.value);
                          }
                        }}
                        autoFocus
                        style={{ 
                          width: '100%',
                          padding: '4px',
                          border: '1px solid #10b981',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      <span 
                        onClick={() => setEditingHeader(repIndex)}
                        style={{ cursor: 'pointer' }}
                        title="Klik untuk edit"
                      >
                        {replicationLabels[repIndex]}
                      </span>
                    )}
                    <button 
                      onClick={() => deleteColumn(repIndex)} 
                      style={{ 
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#ef4444',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}
                      title="Hapus kolom"
                    >
                      ×
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {treatmentData.treatments.map((row, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px', position: 'relative' }}>
                  <div style={{ paddingRight: '24px', position: 'relative' }}>
                    {editingLabel === index ? (
                      <input
                        type="text"
                        defaultValue={row.treatment}
                        onBlur={(e) => handleLabelEdit(index, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleLabelEdit(index, e.target.value);
                          }
                        }}
                        autoFocus
                        style={{ 
                          width: '100%',
                          padding: '4px',
                          border: '1px solid #10b981',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      <span 
                        onClick={() => setEditingLabel(index)}
                        style={{ cursor: 'pointer' }}
                        title="Klik untuk edit"
                      >
                        {row.treatment}
                      </span>
                    )}
                    <button 
                      onClick={() => deleteRow(index)} 
                      style={{ 
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#ef4444',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}
                      title="Hapus baris"
                    >
                      ×
                    </button>
                  </div>
                </td>
                {row.replications.map((rep, repIndex) => (
                  <td key={repIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="number"
                      value={rep}
                      onChange={(e) => handleInputChange(index, repIndex, e.target.value)}
                      style={{ 
                        width: '100%',
                        padding: '4px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {/* Placeholder for charts and analysis */}
        <p>Grafik dan analisis dasar akan ditampilkan di sini.</p>
      </div>
      <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ marginBottom: '15px', color: '#059669' }}>Analisis Tabel</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa', textAlign: 'left' }}>Perlakuan</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa', textAlign: 'center' }}>Rata-rata</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa', textAlign: 'center' }}>Standar Deviasi</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa', textAlign: 'center' }}>Total</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa', textAlign: 'center' }}>CV (%)</th>
            </tr>
          </thead>
          <tbody>
            {calculateStatistics().map((stat, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stat.treatment}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{stat.mean.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{stat.sd.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{stat.sum.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{stat.cv.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: '0.9em', color: '#666' }}>
          <p>* CV = Coefficient of Variation (Koefisien Keragaman)</p>
          <p>* Semakin kecil nilai CV, semakin seragam data penelitian</p>
        </div>
      </div>
      <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ marginBottom: '15px', color: '#059669' }}>Analisis Sidik Ragam (ANOVA)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>Sumber Keragaman</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>db</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>JK</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>KT</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>F-hitung</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>F-tabel</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>Signifikansi</th>
              </tr>
            </thead>
            <tbody>
              {calculateANOVA().sources.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.source}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.df}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.SS?.toFixed(2) || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.MS?.toFixed(2) || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.F_value?.toFixed(2) || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.F_table?.toFixed(2) || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.significance || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            * signifikan pada taraf 5% (P{'<'}0.05)<br/>
            ns = tidak signifikan
          </p>
        </div>
      </div>

      <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ marginBottom: '15px', color: '#059669' }}>Uji DMRT (Duncan Multiple Range Test)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>Perlakuan</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>Rata-rata</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>Notasi</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f8f9fa' }}>Perbedaan Nyata</th>
              </tr>
            </thead>
            <tbody>
              {calculateDMRT()?.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.treatment}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.mean.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.grouping}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            Nilai yang diikuti huruf yang sama menunjukkan tidak berbeda nyata pada uji DMRT taraf 5%
          </p>
        </div>
      </div>
    </div>
  );
}

// Komponen utama App
const App = () => {
  const [activeTab, setActiveTab] = React.useState('weather');
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 py-6">
            PLATFORM PETANI CERDAS INDONESIA
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-4 py-2 rounded ${
                activeTab === 'weather' ? 'bg-emerald-600 text-white' : 'bg-gray-200'
              }`}
            >
              Analisa Musim Tanam
            </button>
            <button
              onClick={() => setActiveTab('farming')}
              className={`px-4 py-2 rounded ${
                activeTab === 'farming' ? 'bg-emerald-600 text-white' : 'bg-gray-200'
              }`}
            >
              Analisa Usaha Tani
            </button>
            <button
              onClick={() => setActiveTab('pest')}
              className={`px-4 py-2 rounded ${
                activeTab === 'pest' ? 'bg-emerald-600 text-white' : 'bg-gray-200'
              }`}
            >
              Analisa Ambang Ekonomi Hama
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-4 py-2 rounded ${
                activeTab === 'research' ? 'bg-emerald-600 text-white' : 'bg-gray-200'
              }`}
            >
              Analisa Penelitian
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'weather' && <WeatherCharts />}
            {activeTab === 'farming' && <FarmingAnalysis />}
            {activeTab === 'pest' && <PestEconomicAnalysis />}
            {activeTab === 'research' && <ResearchAnalysis />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
