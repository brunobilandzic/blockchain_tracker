const initBody = () => {
  const body = document.body;

  body.style.width = "screen.width";
  body.style.height = "screen.height";
    
};

const getApiData = async () => {
  const infoResponse = await fetch("api/bestblockinfo");
  const infoData = await infoResponse.json();
  console.log(infoData);

  const mempoolResponse = await fetch("api/mempoolsize");
  const mempoolData = await mempoolResponse.json();
    console.log(mempoolData);
    
  const diffRelative = mempoolData.mempoolsize / infoData.tlen;

  console.log(diffRelative);

  addBackground(diffRelative);
};

const addBackground = (diffRelative) => {
  document.body.style.backgroundColor = getColorString(diffRelative);
};

const getColorString = (diffRelative) => {
  let redAmount, greenAmount, blueAmount;

  if (diffRelative < 0.5) {
    redAmount = 255;
    greenAmount = 255 * diffRelative;
    blueAmount = 0;
  } else if (diffRelative < 1) {
    redAmount = 255 * (1 - diffRelative);
    greenAmount = 255;
    blueAmount = 0;
  } else if (diffRelative < 1.5) {
    redAmount = 0;
    greenAmount = 255;
    blueAmount = 255 * (diffRelative - 1);
  } else {
    redAmount = 0;
    greenAmount = 255 * (1 - (diffRelative - 1));
    blueAmount = 255;
  }
  const colorString = `rgb(${redAmount}, ${greenAmount}, ${blueAmount})`;
  console.log(colorString);
  return colorString;
};

initBody();

// setInterval(getApiData, 5000);
