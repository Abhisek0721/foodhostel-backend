import properties from "./properties";

const getCashfreeOption = (
  endpont: string,
  methodType: string,
  data: any
) => {
  const options = {
    method: methodType,
    url: properties.CASHFREE_BASE_URL + endpont,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-Client-Id": properties.CASHFREE_APP_ID,
      "X-Client-Secret": properties.CASHFREE_APP_SECRET,
    },
    data: data,
  };

  return options
};

export default getCashfreeOption;