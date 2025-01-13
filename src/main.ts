import QrScanner from 'qr-scanner';
import { getDOMElementById, makeNode } from './dom-utils';
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
      toggleScanningBtn.textContent = 'Start Scanning';

      // Clear everything
      clearResults();
      clearDebugLogs();
    } else {
      qrScanner.start();
      toggleScanningBtn.textContent = 'Stop Scanning';
    }
    isScanning = !isScanning;
  });
};

const initQrScanner = () => {
  const videoPreviewElement =
    getDOMElementById<HTMLVideoElement>('video-scan-preview');

  qrScanner = new QrScanner(videoPreviewElement, handleQrScanResult, {
    onDecodeError: () => {
      logDebug('Error occurred during decode');
    },
  });

  qrScanner.start();
  isScanning = true;
};

const handleQrScanResult = (result: QrScanner.ScanResult) => {
  const qrUrlDiv = getDOMElementById('div-qr-url');

  const otpUrl = result.data;
  qrUrlDiv.textContent = otpUrl;

  try {
    const { otpConfigs } = decodeOtpUrl(otpUrl);
    otpConfigs.forEach((config) => {
      addResultRow(config);
    });
  } catch (err) {
    logDebug('An error occurred parsing QR data');
    if (err instanceof Error) {
      logDebug(err.message);
    }
  }
};

const clearResults = () => {
  const resultsContainer = getDOMElementById('div-results-container');
  const qrUrlDiv = getDOMElementById('div-qr-url');
  while (resultsContainer.lastChild) {
    resultsContainer.removeChild(resultsContainer.lastChild);
  }
  qrUrlDiv.textContent = '';
};

const addResultRow = ({
  name,
  issuer,
  secretBase32,
}: {
  name: string;
  issuer: string;
  secretBase32: string;
}) => {
  const resultsContainer = getDOMElementById('div-results-container');

  const row = makeNode(
    'div',
    { className: 'result-row' },
    makeNode(
      'div',
      { className: 'result-metadata' },
      makeNode('strong', {}, issuer),
      name,
    ),
    makeNode('div', { className: 'result-secret' }, secretBase32),
  );

  resultsContainer.appendChild(row);
};

const logDebug = (msg: string) => {
  const logContainer = getDOMElementById('div-debug-log');
  logContainer.textContent += `${msg}\n`;
};

const clearDebugLogs = () => {
  const logContainer = getDOMElementById('div-debug-log');
  logContainer.textContent = '';
};

document.addEventListener('DOMContentLoaded', () => {
  attachPauseButton();
  initQrScanner();
});
