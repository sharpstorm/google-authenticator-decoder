import QrScanner from 'qr-scanner';
import { getDOMElementById } from './dom-utils';

let isScanning = false;
const initQrScanner = () => {
  const videoPreviewElement =
    getDOMElementById<HTMLVideoElement>('video-scan-preview');
  const toggleScanningBtn = getDOMElementById('btn-toggle-scanning');
  const outputDiv = getDOMElementById('div-result');

  const scanner = new QrScanner(
    videoPreviewElement,
    (result) => {
      console.log(result);
      outputDiv.innerText = result.data;
    },
    {
      onDecodeError: () => {
        console.log('error occurred during decode');
      },
    },
  );

  scanner.start();
  isScanning = true;

  toggleScanningBtn.addEventListener('click', () => {
    if (isScanning) {
      scanner.stop();
    } else {
      scanner.start();
    }
    isScanning = !isScanning;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initQrScanner();
});
