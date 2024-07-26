import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Chart from "./Chart";
import PopulationChart from "./PopulationChart"; // 新しく作成するコンポーネント
import "./styles.css";
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import religionInfoData from "./religion_info.json";

function valuetext(value) {
  return `${value}年`;
}

const CustomizedSlider = styled(Slider)`
  color: #626bd2;

  :hover {
    color: #626bd2;
  }
`;

const App = () => {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(1945);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const [religionInfo, setReligionInfo] = useState("");
  const [showPopulationChart, setShowPopulationChart] = useState(false);
  const [selectedReligion, setSelectedReligion] = useState(null);
  const [fullData, setFullData] = useState(null);

  useEffect(() => {
    fetch("src/data.json")
      .then((response) => response.json())
      .then((fetchedData) => {
        setFullData(fetchedData);
        const selectedYearData = fetchedData.children.find(
          (item) => item.name === year
        );
        setData(selectedYearData);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, [year]);

  // 自動再生機能の制御
  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setYear((prevYear) => {
          const newYear = prevYear < 2010 ? prevYear + 5 : 1945; // Loop back to 1945 if the year exceeds 2010
          return newYear;
        });
      }, 300); // スピードを300ミリ秒に設定
    }
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // 自動再生の切り替え
  const handleAutoPlayToggle = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // 年の変更ハンドラ
  const handleYearChange = (event, newValue) => {
    setYear(newValue);
    setIsAutoPlay(false); // スライダーで変更された場合は自動再生を停止する
  };

  const handleToggleChart = () => {
    setShowPopulationChart(!showPopulationChart);
  };

  return (
    <div>
      <div className="header">
        <h1>Religion Sunburst</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ position: "relative", width: "700px", height: "700px" }}>
          <Chart
            data={data}
            setSelectedValue={setSelectedValue}
            setReligionInfo={setReligionInfo}
            religionInfoData={religionInfoData}
            setSelectedReligion={setSelectedReligion}
          />
        </div>
        {selectedValue !== null && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "white",
              padding: "5px",
              borderRadius: "3px",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
              transform: `translate(0px, 100px)`,
            }}
          >
            Value: {selectedValue}
          </div>
        )}

        <div
          className="controls-container"
          style={{ transform: `translate(-130px, 0px)` }}
        >
          <div className="box">
            {[
              1945, 1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995,
              2000, 2005, 2010,
            ].map((yr) => (
              <button
                key={yr}
                onClick={() => {
                  setYear(yr);
                  setIsAutoPlay(false);
                }}
                style={{
                  margin: "5px 5px",
                  transform: `translate(-50px, 150px)`,
                }}
              >
                {yr}
              </button>
            ))}
          </div>

          <div style={{ transform: "translate(-20px, 150px)" }}>
            <CustomizedSlider
              aria-label="Year"
              style={{ width: "300px", height: "2px" }}
              defaultValue={1945}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={1945}
              max={2010}
              value={year}
              onChange={handleYearChange}
            />
            <p style={{ transform: "translate(60px, 0px)" }}>{year}年</p>
            <div style={{ transform: "translate(150px, -45px)" }}>
              <button onClick={handleAutoPlayToggle}>
                {isAutoPlay ? "停止" : "再生"}
              </button>
            </div>
          </div>

          <div style={{ transform: "translate(-50px, 120px)" }}>
            <button
              variant="contained"
              onClick={handleToggleChart}
              style={{
                marginBottom: "10px",
                transform: "translate(370px, 0px)",
              }}
            >
              {showPopulationChart ? "グラフを表示" : "時代背景を表示"}
            </button>
            <div
              style={{
                width: "500px",
                height: "250px",
                border: "1px solid #ccc",
                padding: "10px",
                overflowY: "auto",
                backgroundColor: "white",
              }}
            >
              {showPopulationChart ? (
                <pre>{religionInfo}</pre>
              ) : (
                <PopulationChart
                  data={fullData}
                  selectedReligion={selectedReligion}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
