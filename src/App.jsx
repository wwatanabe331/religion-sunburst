import React, { useState, useEffect } from "react";
import Chart from "./Chart";
import PopulationChart from "./PopulationChart";
import "./styles.css";
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import religionInfoData from "/public/religion_info.json";
import initialData from "/public/data.json";

//変更2
const valuetext = (value) => {
  return `${value}年`;
};

const CustomizedSlider = styled(Slider)`
  color: #626bd2;

  :hover {
    color: #626bd2;
  }
`;

const marks = [
  { value: 1950, label: "1950年" },
  { value: 1960, label: "1960年" },
  { value: 1970, label: "1970年" },
  { value: 1980, label: "1980年" },
  { value: 1990, label: "1990年" },
  { value: 2000, label: "2000年" },
  { value: 2010, label: "2010年" },
];

const App = () => {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(1945);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [religionInfo, setReligionInfo] = useState("");
  const [showPopulationChart, setShowPopulationChart] = useState(false);
  const [selectedReligion, setSelectedReligion] = useState(null);
  //変更1
  const [fullData] = useState(initialData);

  useEffect(() => {
    const selectedYearData = fullData.children.find(
      (item) => item.name === year
    );
    setData(selectedYearData);
  }, [year, fullData]);

  // 自動再生機能の制御
  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setYear((prevYear) => {
          const newYear = prevYear < 2010 ? prevYear + 5 : 1945;
          return newYear;
        });
      }, 300);
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

  // const handleToggleChart = () => {
  //   setShowPopulationChart(!showPopulationChart);
  // };

  return (
    <div>
      <div className="header">
        <h1>Religion Sunburst</h1>
      </div>
      <div style={{ display: "flex" }}>
        <div>
          <Chart
            data={data} // 年ごとのデータを渡す
            setSelectedValue={setSelectedValue}
            setReligionInfo={setReligionInfo}
            religionInfoData={religionInfoData}
            setSelectedReligion={setSelectedReligion}
            // ここでサンバースト描画のサイズも設定したら、UIコンポーネントを学上で楽だと思い変更
            width={700}
            height={700}
          />

          {selectedValue !== null && (
            <div
              style={{
                background: "white",
                padding: "5px",
                borderRadius: "3px",
                boxShadow: "0  5px rgba(0,0,0,0.3)",
                width: "200px",
                transform: `translate(5px, -700px)`,
              }}
            >
              人口: {selectedValue}
            </div>
          )}
        </div>

        <div

        // className="controls-container"
        // style={{ transform: `translate(-130px, 0px)` }}
        >
          {/* ボタンを消した*/}
          {/* <div style={{ transform: "translate(-100px, 0px)" }}> */}
          <div>
            <CustomizedSlider
              aria-label="Year"
              style={{ width: "628px", height: "15px", margin: "0 36px" }}
              defaultValue={1945}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              // 追加
              marks={marks}
              step={5}
              min={1945}
              max={2010}
              value={year}
              onChange={handleYearChange}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ padding: "0 12px" }}>{year}年</p>

              <div>
                <button onClick={handleAutoPlayToggle}>
                  {isAutoPlay ? "停止" : "再生"}
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              margin: "24px 0 ",
              background: "white",
              padding: "5px",
              borderRadius: "3px",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
              // transform: "translate(740px, 225px)",
            }}
          >
            人口グラフを表示
            <div
              style={{
                width: "700px",
                height: "225px",
                border: "1px solid #ccc",
                padding: "10px",
                overflowY: "auto",
                backgroundColor: "white",
              }}
            >
              <PopulationChart
                data={fullData}
                selectedReligion={selectedReligion}
              />

              {/* {showPopulationChart ? (
                <pre>{religionInfo}</pre>
              ) : (
                <PopulationChart
                  data={fullData}
                  selectedReligion={selectedReligion}
                />
              )} */}
            </div>
          </div>
          {/* 追加 */}
          <div
            style={{
              background: "white",
              padding: "5px",
              margin: "24px 0 ",
              borderRadius: "3px",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
              // transform: "translate(740px, 525px)",
            }}
          >
            時代背景を表示
            <div
              style={{
                width: "700px",
                height: "225px",
                border: "1px solid #ccc",
                padding: "10px",
                overflowY: "auto",
                backgroundColor: "white",
              }}
            >
              <pre>{religionInfo}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
