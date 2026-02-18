const baseURL = "http://api.qrserver.com/v1/create-qr-code/";
// ?data=HelloWorld!&size=100x100

const getQRCode = async (uri) => {
  const data = encodeuricomponent(uri);
  const fullUrl = `${baseURL}?data=${data}&size=400x400`;
  const res = await fetch(fullUrl);
  if (!res.ok) {
    throw new Error(`API failed: ${res.status}`);
  }
  const contentType = res.headers.get("content-type") || "";
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("jpeg")
      ? "jpg"
      : "bin";

  const bytes = await res.arrayBuffer();
  return { ext, bytes };
};

export default getQRCode;
