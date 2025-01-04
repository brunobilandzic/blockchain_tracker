export const config = (type) => {
  console.log(
    process.env.KRIPTO_HOST,
    process.env.KRIPTO_USERNAME,
    process.env.KRIPTO_PASSWORD
  );
  const mutualProps = {
    host: process.env.KRIPTO_HOST,
    username: process.env.KRIPTO_USERNAME,
    password: process.env.KRIPTO_PASSWORD,
  };
  if (type === "mainnet") {
    return { ...mutualProps, port: 50004 };
  } else if (type === "testnet") {
    return { ...mutualProps, port: 51002 };
  } else if (type === "litecoin") {
    return { ...mutualProps, port: 53012 };
  }
};
