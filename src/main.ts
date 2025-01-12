import QrScanner from 'qr-scanner';
import { getDOMElementById } from './dom-utils';

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
      console.log(result);
      outputDiv.innerText = result.data;
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
