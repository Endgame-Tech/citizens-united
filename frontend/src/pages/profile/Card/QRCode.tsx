// import { useState } from 'react';
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ text }: { text: string }) => {
  return <QRCodeCanvas value={text} bgColor="#00000000" className="p-0" fgColor="#219762" size={150}/>;
};

export default QRCodeGenerator;
