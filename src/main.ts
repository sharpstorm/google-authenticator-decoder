import QrScanner from 'qr-scanner';
import { getDOMElementById } from './dom-utils';
import { decodeOtpUrl } from './payload-parser';

let isScanning = false;
let qrScanner: QrScanner | null;

const attachPauseButton = () => {
  const toggleScanningBtn = getDOMElementById('btn-toggle-scanning');
  toggleScanningBtn.addEventListener('click', () => {
    if (!qrScanner) {
      return;
    }

    if (isScanning) {
      qrScanner.stop();
    } else {
      qrScanner.start();
    }
    isScanning = !isScanning;
  });
};

const initQrScanner = () => {
  const videoPreviewElement =
    getDOMElementById<HTMLVideoElement>('video-scan-preview');

  const outputDiv = getDOMElementById('div-result');

  qrScanner = new QrScanner(
    videoPreviewElement,
    (result) => {
      const otpUrl = result.data;
      console.log(otpUrl);
      outputDiv.textContent = `URL: ${otpUrl}\n\n`;
      const { otpConfigs } = decodeOtpUrl(otpUrl);

      otpConfigs.forEach((config) => {
        outputDiv.textContent += `Name: ${config.name}\n`;
        outputDiv.textContent += `Issuer: ${config.issuer}\n`;
        outputDiv.textContent += `Secret: ${config.secretBase32}\n\n`;
      });
    },
    {
      onDecodeError: () => {
        console.log('error occurred during decode');
      },
    },
  );
  startQrScanner();
};

const startQrScanner = () => {
  if (!qrScanner) {
    return;
  }

  qrScanner.start();
  isScanning = true;
};

document.addEventListener('DOMContentLoaded', () => {
  attachPauseButton();
  initQrScanner();
});
